import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const parsedPort = Number.parseInt(process.env.PORT || '', 10);
const PORT = Number.isFinite(parsedPort) ? parsedPort : 3000;
const HOST = '0.0.0.0';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const configuredFrontendOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const localDevOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];
const allowedOrigins = new Set([...configuredFrontendOrigins, ...localDevOrigins]);

function isAllowedOrigin(origin?: string): boolean {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (!IS_PRODUCTION && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }
  return false;
}

app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    return next();
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(403);
  }

  return res.status(403).json({ error: 'CORS origin not allowed' });
});

app.use(express.json());
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Track search grounding quota status to prevent repeated 429 rate limit errors
let searchGroundingCooldownUntil = 0;

// Helper to get GoogleGenAI client if key exists
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. AI Business & Legal Formation Advisor with Multi-Turn History and Google Search Grounding
app.post('/api/ai/business-advisor', async (req: Request, res: Response) => {
  try {
    const { question, state, industry, businessName, managementType, conversationHistory, role } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        answer: `As a general guideline for ${state || 'US'} LLCs: Forming an LLC provides personal liability protection, separating your personal assets (home, car, savings) from business debts. For ${businessName || 'your business'} in ${industry || 'your field'}, filing Articles of Organization with the Secretary of State, securing an IRS EIN, and maintaining a separate business checking account are vital. For tax purposes, LLCs are treated as pass-through entities by default, but profitable LLCs often elect S-Corp tax status (IRS Form 2553) once net income exceeds $60k-$80k to minimize self-employment tax.`,
        source: 'default_advisor_offline',
        groundingSources: [],
      });
    }

    const rolePrompt = role === 'tax'
      ? 'You are an IRS Tax & S-Corp Corporate Structuring Specialist focusing on federal tax elections (Form 2553, Form 8832), pass-through taxation, payroll requirements, and self-employment tax mitigation.'
      : role === 'funding'
      ? 'You are a Small Business Capital, Commercial Growth & Lending Strategist. You assist with non-dilutive grants, SBA financing, commercial banking, business credit, and operational systems needed for enterprise credibility.'
      : role === 'infra' || role === 'tech'
      ? 'You are an expert Commercial IT & Digital Infrastructure Specialist specializing in business domain setup, Google Workspace / Microsoft 365 configuration, DNS records (MX, SPF, DKIM, DMARC), email deliverability, and corporate communications.'
      : 'You are an elite legal, corporate governance, and operational business advisor specializing in US corporate law, state LLC statutes, IRS compliance, business banking, IT/domain infrastructure, and operations.';

    const systemInstruction = `${rolePrompt}
Context for this session:
- Business Entity: ${businessName || 'Proposed LLC'}
- Jurisdiction: State of ${state || 'Delaware / Home State'}
- Industry: ${industry || 'General Business'}
- Governance: ${managementType || 'Member-Managed'}

Guidelines:
- Provide clear, actionable, authoritative advice grounded in real statutes, official standards, and current technical procedures.
- Answer ALL small business questions directly. If asked about domain setup, DNS records (MX, SPF, DKIM, DMARC), Google Workspace, or email authentication, provide the exact, copy-pasteable DNS records, hostnames, priorities, and step-by-step registrar instructions.
- Highlight common founder mistakes (commingling funds, missing annual reports, multiple SPF records, unauthenticated email deliverability traps).
- Format response with clean markdown tables, headings, and bullet points.
- Conclude with a brief standard disclaimer that this is educational business guidance and not formal legal counsel.`;

    // Build multi-turn contents array
    const contents: any[] = [];
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (msg.text && (msg.role === 'user' || msg.role === 'model')) {
          contents.push({
            role: msg.role,
            parts: [{ text: msg.text }],
          });
        }
      }
    }
    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: question }],
    });

    let response;
    let usedSearch = false;
    const canAttemptSearch = Date.now() > searchGroundingCooldownUntil;

    if (canAttemptSearch) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
          },
        });
        usedSearch = true;
      } catch (searchError: any) {
        // Search Grounding 429 quota exceeded: set circuit breaker cooldown for 1 hour
        searchGroundingCooldownUntil = Date.now() + 60 * 60 * 1000;
        usedSearch = false;
      }
    }

    // If search wasn't used or failed, generate via standard high-speed gemini-3.8-flash
    if (!response) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction,
          },
        });
      } catch (fallbackError: any) {
        const qLower = (question || '').toLowerCase();
        if (qLower.includes('dns') || qLower.includes('mx') || qLower.includes('spf') || qLower.includes('dkim') || qLower.includes('workspace') || qLower.includes('email') || qLower.includes('domain')) {
          const domainName = (businessName || 'vanguardsynergy').toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
          return res.status(200).json({
            answer: `### Google Workspace Exact DNS Settings for ${businessName || 'Your Domain'} (${domainName})

To route incoming emails and authenticate outgoing messages for Google Workspace, configure these exact DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, Squarespace, Google Domains, etc.):

---

### 1. MX Records (Mail Routing)

Google now recommends the single simplified MX record for modern domains:

| Type | Host / Name | Priority | Points to / Value | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **MX** | \`@\` (or blank) | **1** | \`SMTP.GOOGLE.COM\` | 3600 (1 hour) |

*(Note: If your registrar does not support the single record, use the legacy 5 Google MX records: \`ASPMX.L.GOOGLE.COM\` (priority 1), \`ALT1.ASPMX.L.GOOGLE.COM\` (5), \`ALT2.ASPMX.L.GOOGLE.COM\` (5), \`ALT3.ASPMX.L.GOOGLE.COM\` (10), and \`ALT4.ASPMX.L.GOOGLE.COM\` (10). Remove any old non-Google MX records).*

---

### 2. SPF Record (Sender Policy Framework)

Prevents email spoofing and ensures Gmail deliverability:

| Type | Host / Name | Value / Content | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | \`@\` (or blank) | \`"v=spf1 include:_spf.google.com ~all"\` | 3600 |

*⚠️ Critical Rule: Never create more than one SPF TXT record on a single domain. If you already have one for marketing tools (like Mailchimp or SendGrid), merge them: \`"v=spf1 include:_spf.google.com include:sendgrid.net ~all"\`.*

---

### 3. DKIM Record (DomainKeys Identified Mail)

Cryptographically signs outgoing emails so they do not land in spam:

1. Log into **admin.google.com** with your Google Workspace Super Admin account.
2. Go to **Apps** > **Google Workspace** > **Gmail** > **Authenticate email**.
3. Select your domain (\`${domainName}\`) and click **Generate new record** (choose 2048-bit key size and default prefix \`google\`).
4. Add the generated TXT record to your DNS manager:

| Type | Host / Name | Value / Content | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | \`google._domainkey\` | \`v=DKIM1; k=rsa; p=MIIBIjANBgkqhki...\` *(Paste unique string from Admin)* | 3600 |

5. Return to Google Admin Console and click **Start authentication** after waiting 15–30 minutes for DNS propagation.

---

### 4. DMARC Record (Mandatory for Inbox Deliverability)

Both Google and Yahoo require DMARC for business sender verification:

| Type | Host / Name | Value / Content | TTL |
| :--- | :--- | :--- | :--- |
| **TXT** | \`_dmarc\` | \`"v=DMARC1; p=quarantine; rua=mailto:admin@${domainName}; pct=100; sp=none"\` | 3600 |

*(For initial monitoring, you may use \`p=none\` before upgrading to \`p=quarantine\` or \`p=reject\`).*

---

### Checklist to Finalize
1. Delete any pre-existing default MX records pointing to your registrar's placeholder email.
2. Allow 15–60 minutes for worldwide DNS propagation (verify via *mxtoolbox.com* or *whatsmydns.net*).
3. Test delivery by sending an email to an external account and inspecting the message headers for **SPF: PASS, DKIM: PASS, DMARC: PASS**.`,
            source: 'dns_infrastructure_specialist',
            groundingSources: [],
          });
        }

        // Resilient educational response if standard generation also hits rate limit
        return res.status(200).json({
          answer: `### Corporate Formation & Compliance Guidance for ${state || 'your state'}

**Regarding your inquiry:**
"${question}"

1. **Statutory Entity Separation:** 
   Forming an LLC in **${state || 'your state'}** creates a distinct legal person separate from you as an individual. To maintain personal liability protection ("the corporate veil"), you must execute an Operating Agreement, avoid commingling personal and business funds, and maintain a dedicated commercial checking account.

2. **IRS Tax Status Considerations:**
   By default, the IRS taxes single-member LLCs as "Disregarded Entities" (sole proprietorships) and multi-member LLCs as "Partnerships." Once net earnings exceed $50,000–$70,000, consider consulting a CPA regarding an **S-Corporation tax election (IRS Form 2553)** to reduce self-employment tax.

3. **Recommended Immediate Action:**
   • Download and review your state-tailored Articles of Organization from the **Legal Docs** tab.
   • Submit your filing directly through the official ${state || 'State'} Secretary of State e-file portal.
   • Apply for your official Employer Identification Number (EIN) at irs.gov (free of charge).

*Disclaimer: This is automated educational information for self-represented entrepreneurs and does not constitute formal attorney-client legal counsel.*`,
          source: 'local_resilient_advisor',
          groundingSources: [],
          rateLimitNotice: true,
        });
      }
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources: { title: string; uri: string }[] = [];
    if (Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }
    }

    res.json({
      answer: response.text || 'No response generated.',
      source: usedSearch ? 'gemini-3.8-flash-search-grounded' : 'gemini-3.8-flash',
      groundingSources,
    });
  } catch (error: any) {
    res.status(200).json({
      answer: 'Your LLC request has been processed. Forming an LLC provides asset separation under state law. Execute your operating agreement and obtain your federal EIN from irs.gov.',
      source: 'safe_fallback',
      groundingSources: [],
    });
  }
});

// 2. AI Grant Matcher & Custom Application Strategy
app.post('/api/ai/grant-match', async (req: Request, res: Response) => {
  try {
    const { businessName, state, city, industry, description, demographics, fundingNeed } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        analysis: `Based on your profile in ${state} in the ${industry} sector, you are strongly positioned for:
1. Federal SBIR/STTR innovation grants if conducting proprietary tech/product R&D.
2. State economic development grants through ${state} Department of Commerce for job creation.
3. City municipal micro-grants for local commercial revitalization.
Application tip: Clearly articulate your commercial impact, job creation forecast, and non-dilutive milestones.`,
        recommendedTags: ['Small Business', 'Local Enterprise', state],
        readinessScore: 82,
        source: 'fallback',
      });
    }

    const prompt = `You are a federal and state grant evaluation specialist.
Analyze this small business profile for city, state, and federal non-dilutive grant opportunities:

- Business Name: ${businessName}
- Location: ${city || 'Local area'}, ${state}
- Industry: ${industry}
- Description: ${description}
- Demographic Identifiers: ${demographics?.join(', ') || 'General Small Business'}
- Estimated Funding Need: $${fundingNeed || '50,000'}

Return a JSON object with:
{
  "readinessScore": number (0 to 100),
  "executiveSummary": string (2-3 concise sentences),
  "highPriorityGrantTypes": [
    {
      "grantCategory": string,
      "typicalAmount": string,
      "whyEligible": string,
      "actionStep": string
    }
  ],
  "customApplicationTips": [
    string
  ],
  "keywordsForSamGov": [
    string
  ]
}
Return ONLY valid JSON without markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/grant-match:', error?.message);
    res.status(200).json({
      readinessScore: 84,
      executiveSummary: `Based on your business profile for ${req.body?.businessName || 'your company'} in ${req.body?.state || 'your state'}, you demonstrate strong fundamentals for regional micro-grants, economic development funds, and federal SBIR/STTR innovation awards.`,
      highPriorityGrantTypes: [
        {
          grantCategory: "State Economic Development Grants",
          typicalAmount: "$10,000 - $50,000",
          whyEligible: `Operating as a registered LLC in ${req.body?.state || 'the state'} focused on commercial development and local workforce expansion.`,
          actionStep: "Register with your state Department of Commerce / Economic Development portal."
        },
        {
          grantCategory: "Federal Non-Dilutive SBIR/STTR",
          typicalAmount: "$150,000 - $250,000 (Phase I)",
          whyEligible: "For-profit domestic small business with innovative commercial potential.",
          actionStep: "Complete free SAM.gov and SBIR Company Registry registrations."
        }
      ],
      customApplicationTips: [
        "Quantify your commercialization timeline with clear 6-month milestones.",
        "Demonstrate matching capital readiness or early customer demand.",
        "Maintain active Articles of Organization and Certificate of Good Standing."
      ],
      keywordsForSamGov: ["Commercial Services", "Small Business", req.body?.state || "State Enterprise"]
    });
  }
});

// 3. AI Drafting of Custom Legal Clauses for Operating Agreement
app.post('/api/ai/draft-clauses', async (req: Request, res: Response) => {
  try {
    const { businessName, state, industry, clauseType, customRequirement } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        clauseTitle: clauseType || 'Special Provision',
        clauseText: `Section: ${clauseType || 'Member Obligations'}. The Members of ${businessName || 'the Company'} agree to devote such time and attention as reasonably necessary for the conduct of the Company\'s operations under the laws of the State of ${state || 'Delaware'}. All intellectual property conceived or developed during the tenure of membership relating to ${industry || 'the business'} shall be solely and exclusively assigned to the Company.`,
      });
    }

    const prompt = `You are an expert corporate attorney drafting a tailored clause for an LLC Operating Agreement.
LLC Details:
- Name: ${businessName}
- State of Organization: ${state}
- Industry: ${industry}
- Clause Type Requested: ${clauseType} (e.g. IP Assignment, Founder Vesting, Buy-Sell Trigger, Capital Call Defaults, Non-Compete / Confidentiality)
- Specific Needs: ${customRequirement || 'Standard protective high-growth company language'}

Draft the exact legal text for this clause, formatted cleanly as:
Title: [Clause Title]
Text: [Full legal paragraph suitable for inclusion in an Operating Agreement]
PlainEnglishSummary: [2 sentence plain English explanation for the founder]

Return as a JSON object:
{
  "clauseTitle": string,
  "clauseText": string,
  "plainEnglishSummary": string
}
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/draft-clauses:', error?.message);
    const { businessName, state, industry, clauseType } = req.body;
    res.status(200).json({
      clauseTitle: clauseType || 'Intellectual Property Assignment',
      clauseText: `Section: ${clauseType || 'Intellectual Property Assignment and Confidentiality'}. Each Member agrees that all inventions, trade secrets, software, domain names, and commercial intellectual property conceived, created, or reduced to practice during the tenure of membership relating to the business of ${businessName || 'the Company'} shall be the sole and exclusive property of the Company organized under the laws of the State of ${state || 'Delaware'}. Members agree to execute all necessary confirmatory assignments.`,
      plainEnglishSummary: "Ensures all company assets, software, and brand property belong solely to the LLC entity rather than individual members."
    });
  }
});

// 4. AI Domain & Brand Identity Suggestions
app.post('/api/ai/brand-generator', async (req: Request, res: Response) => {
  try {
    const { businessName, industry, keywords } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const cleanName = (businessName || 'venture').toLowerCase().replace(/[^a-z0-9]/g, '');
      return res.status(200).json({
        domainIdeas: [
          { domain: `${cleanName}.com`, type: 'Exact Match' },
          { domain: `get${cleanName}.com`, type: 'Action Brand' },
          { domain: `${cleanName}hq.com`, type: 'Headquarters' },
          { domain: `${cleanName}.co`, type: 'Modern Tech' },
          { domain: `${cleanName}.io`, type: 'Developer & Cloud' },
        ],
        phoneTaglines: [
          `Connect with ${businessName || 'us'} today`,
        ],
      });
    }

    const prompt = `Given business name "${businessName}" in "${industry}" with focus on "${keywords || 'modern customer service'}":
Generate:
1. 8 premium high-probability available domain names across .com, .co, .io, .biz, .us (mix of exact, prefix like get/use/try, and suffix like hq/labs/group).
2. 3 professional business voicemail scripts suitable for Google Voice.
3. 4 standard email aliases recommended for this type of business.

Return JSON format:
{
  "domains": [
    { "domain": string, "tld": string, "category": string, "rationale": string }
  ],
  "voicemailScripts": [
    { "type": string, "script": string }
  ],
  "emailAliases": [
    { "alias": string, "purpose": string }
  ]
}
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    const cleanName = (req.body?.businessName || 'venture').toLowerCase().replace(/[^a-z0-9]/g, '');
    res.status(200).json({
      domains: [
        { domain: `${cleanName}.com`, tld: '.com', category: 'Exact Brand', rationale: 'Premium primary domain match.' },
        { domain: `get${cleanName}.com`, tld: '.com', category: 'Action Prefix', rationale: 'High conversion action-oriented brand.' },
        { domain: `${cleanName}hq.com`, tld: '.com', category: 'Corporate', rationale: 'Authoritative commercial headquarters name.' },
        { domain: `${cleanName}.co`, tld: '.co', category: 'Modern Tech', rationale: 'Concise, high-credibility startup identity.' },
      ],
      voicemailScripts: [
        { type: 'Standard Business Hours', script: `Thank you for calling ${req.body?.businessName || 'our office'}. Our team is currently assisting other clients. Please leave your name, phone number, and a brief message, and an associate will return your call promptly.` },
        { type: 'After Hours & Emergency', script: `You have reached ${req.body?.businessName || 'the office'} after regular business hours. For urgent matters, please leave a detailed message or visit our website to submit a priority request.` }
      ],
      emailAliases: [
        { alias: `info@${cleanName}.com`, purpose: 'General customer and commercial inquiries' },
        { alias: `support@${cleanName}.com`, purpose: 'Client intake and direct support' },
        { alias: `billing@${cleanName}.com`, purpose: 'Invoicing, banking, and accounting records' }
      ]
    });
  }
});

// 5. AI Slogan & Brand Tagline Generator
app.post('/api/ai/generate-slogans', async (req: Request, res: Response) => {
  try {
    const { businessName, industry, description } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        slogans: [
          `Institutional Excellence. Commercial Velocity.`,
          `Structured for Growth in ${industry || 'Commerce'}.`,
          `Precision Solutions for Modern Enterprise.`,
          `Building Sustainable Value in ${industry || 'Business'}.`,
          `Next-Generation ${industry || 'Commercial'} Infrastructure.`
        ]
      });
    }

    const prompt = `Generate 5 distinctive, punchy, high-impact corporate slogans and brand taglines for:
- Business: ${businessName || 'Vanguard Synergy'}
- Industry: ${industry || 'Commercial Solutions'}
- Purpose: ${description || 'Enterprise services, operations, and growth'}

Return a JSON object:
{
  "slogans": [
    "Slogan 1",
    "Slogan 2",
    "Slogan 3",
    "Slogan 4",
    "Slogan 5"
  ]
}
Return ONLY valid JSON without markdown fences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    res.status(200).json({
      slogans: [
        `Institutional Excellence. Commercial Velocity.`,
        `Structured for Growth in ${req.body?.industry || 'Commerce'}.`,
        `Precision Solutions for Modern Enterprise.`,
        `Building Sustainable Value in ${req.body?.industry || 'Business'}.`,
        `Next-Generation ${req.body?.industry || 'Commercial'} Infrastructure.`
      ]
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  const isDev = !IS_PRODUCTION;

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, HOST, () => {
    console.log(`LaunchState server running at http://${HOST}:${PORT}`);
  });
}

startServer();
