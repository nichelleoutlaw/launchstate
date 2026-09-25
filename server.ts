import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

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
      ? 'You are a Small Business Grant & Commercial Lending Strategist specializing in non-dilutive government grants (SBIR/STTR, state commerce programs), SBA loan qualification (7a, 504, microloans), and pitch preparation.'
      : 'You are an elite legal and small business formation advisor specializing in US corporate law, state LLC statutes, Secretary of State filing processes, operating agreements, and compliance management.';

    const systemInstruction = `${rolePrompt}
Context for this session:
- Business Entity: ${businessName || 'Proposed LLC'}
- Jurisdiction: State of ${state || 'Delaware / Home State'}
- Industry: ${industry || 'General Business'}
- Governance: ${managementType || 'Member-Managed'}

Guidelines:
- Provide clear, actionable, authoritative advice grounded in real state statutes and current procedures.
- Use Google Search to verify current state filing fees, recent administrative rules, and official state government portal URLs.
- Highlight common founder mistakes (commingling funds, missing annual reports, publication traps like NY Section 206).
- Format response with clean markdown headings and bullet points.
- Always include a brief standard disclaimer that this is educational formation guidance and not formal attorney-client legal counsel.`;

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
    let usedSearch = true;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (searchError) {
      console.warn('Fallback to standard generation without search tool:', searchError);
      usedSearch = false;
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction,
        },
      });
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
      source: usedSearch ? 'gemini-3.5-flash-search-grounded' : 'gemini-3.5-flash',
      groundingSources,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/business-advisor:', error);
    res.status(500).json({
      error: 'Failed to generate advisory response.',
      details: error.message,
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
    console.error('Error in /api/ai/grant-match:', error);
    res.status(500).json({
      error: 'Failed to analyze grant matches.',
      details: error.message,
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
    console.error('Error in /api/ai/draft-clauses:', error);
    res.status(500).json({
      error: 'Failed to draft clause.',
      details: error.message,
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
    console.error('Error in /api/ai/brand-generator:', error);
    res.status(500).json({
      error: 'Failed to generate brand items.',
      details: error.message,
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LaunchState server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
