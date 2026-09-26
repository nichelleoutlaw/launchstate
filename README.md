# LaunchState (`launchstate.io`) 🚀
### The Open-Source LLC Formation, Brand Kit & Capital OS

**Live App**: [launchstatellc.me](https://launchstatellc.me) • **License**: [MIT](./LICENSE)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](./LICENSE)
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS-teal.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)

> **Stop paying $500+ to corporate filing mills for standard templates.**  
> LaunchState is a fast, deterministic, client-side operating system that guides founders through 50-state LLC formation, brand identity generation, email/DNS deliverability setup, and small business capital acquisition in under 60 seconds.

---

## 🎯 3-Milestone Architecture

LaunchState organizes the entire entrepreneur launch journey into three clear milestones accompanied by a **persistent side flight checklist**:

### Step 1: Legal Foundation
* **Charter Wizard (`FormationWizard`)**:
  * Configures legal name, entity suffix (`LLC`, `L.L.C.`, `Limited Liability Company`), and principal business office.
  * 50-state Secretary of State statutory fee and online portal integration.
  * Self or commercial registered agent designation.
  * Multi-member equity splits, capital contribution ledgers, and manager/member voting structures.
* **Statutory Documents Generator (`DocumentGenerator`)**:
  * **Articles of Organization / Certificate of Formation** tailored to state statutes.
  * **LLC Operating Agreement** with a 1-click **Protective Clauses Library**:
    * Intellectual Property (IP) Assignment to the Company
    * 4-Year Founder Equity Vesting with 1-Year Cliff
    * Buy-Sell Provisions & Deadlock Resolution
    * Non-Solicitation & Trade Secret Covenants
    * Capital Call Dilution Formulas
  * **IRS Form SS-4 Application Worksheet** for instant online EIN retrieval.
  * **Action by Unanimous Written Consent** of Organizer and Initial Members.
  * **Pro Se Self-Help Legal Disclaimer** with cryptographic timestamp acknowledgment.
  * **Live Full-Screen Document Preview & 1-Click Formation Binder Exporter**.

---

### Step 2: Brand & Identity
* **Brand Kit Studio (`BrandKit`)**:
  * 5 Curated corporate palettes (Corporate Authority, Modern Venture, Executive Royal, Nordic Slate, Imperial Crimson) with 1-click HEX code copying.
  * Premium corporate typography pairings with live specimen test drives.
  * Value proposition and tagline generator.
  * **Vector SVG Monogram & Logo Emblem Generator** (Shield, Hexagon, Circle, Monogram) with instant `.svg` export.
  * Realistic executive business card and corporate identity mockup preview.
* **Domain & Digital Presence (`DigitalPresenceHub`)**:
  * Live TLD search across `.com`, `.co`, `.io`, and action-oriented prefixes.
  * Step-by-step Google Workspace professional email configuration guide.
  * Department email alias architectures (`info@`, `billing@`, `support@`, `legal@`).
  * Dedicated business phone setup (Google Voice) and professional voicemail script generator.
* **DNS Deliverability Advisor (`DnsAdvisor`)**:
  * Exact copy-paste DNS records for Google Workspace & Microsoft 365:
    * **MX Record**: `SMTP.GOOGLE.COM` (Priority 1, TTL 3600)
    * **SPF TXT Record**: `v=spf1 include:_spf.google.com ~all`
    * **DKIM TXT Record**: 2048-bit domainkey setup walkthrough
    * **DMARC TXT Record**: Strict deliverability policy (`p=quarantine; pct=100; sp=none`)
  * Tabbed registrar guides (Cloudflare, GoDaddy, Namecheap, Squarespace, AWS Route 53).
  * 5-point DNS deliverability checklist and live validation links.

---

### Step 3: Capital & Growth
* **Grants Discovery Engine (`FundingFinder`)**:
  * Searchable and filterable directory of non-dilutive federal (SBIR/STTR), state commerce, and municipal grant programs.
  * Pre-qualification checklist (SAM.gov registration, Unique Entity Identifier, NAICS codes).
  * Direct links to official government application portals.
* **Bank Resolutions Generator (`BankResolutions`)**:
  * Generates formal **Action by Unanimous Written Consent of Members Authorizing Opening of Corporate Depository Accounts**.
  * Compatible with startup commercial banks (Mercury Bank, Relay Financial, Chase, Bank of America, Credit Unions).
  * Configurable authorized signers, daily wire limits, and dual-signature expenditure thresholds.
  * Day-1 bank underwriting audit checklist (Articles, CP-575 EIN, Operating Agreement, Photo IDs).

---

## ⚡ Always-On Side Flight Checklist (`SideChecklist`)
* **Docked on Desktop**: Stays pinned right beside your active workspace so you can fill out forms, edit documents, or view DNS records without losing your place.
* **1-Click Expand / Collapse**: Easily collapse into a minimal vertical progress pill (`45% DONE`) when you want maximum screen width for drafting documents.
* **Jump-To-Action**: Clicking any item immediately jumps to that exact step and subtab.
* **Local Storage Persistence**: Checkbox completions and progress percentages are saved automatically to your browser.

---

## 🛠️ Tech Stack

* **Frontend**: React 19 (TypeScript)
* **Styling**: Tailwind CSS v4
* **Build Tool**: Vite 6
* **Icons**: Lucide React
* **State & Storage**: Client-side localStorage persistence (100% private, no cloud leaks)
* **Typography**: Plus Jakarta Sans & JetBrains Mono

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/launchstate.git
cd launchstate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🌐 Deployment (Frontend + Backend Split)

### Frontend (GitHub Pages)
Deploy the Vite `dist` output to GitHub Pages (via GitHub Actions) and host only the React app there.

Set this in the frontend build environment:

```bash
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

This makes frontend API calls target your deployed backend instead of same-origin `/api/*`.

### Backend (Render / Node host)
This repo includes `render.yaml` for deploying the Express/Gemini API service separately.

Required backend environment variables:

- `GEMINI_API_KEY` (required)
- `FRONTEND_ORIGIN` (required in production, e.g. `https://launchstatellc.me` or comma-separated allowed origins)
- `PORT` is provided automatically by Render (you can set it locally for manual runs)

Health check endpoint:

- `GET /health` → `{ "status": "ok" }`

### Connecting frontend ↔ backend
1. Deploy backend first (example URL: `https://your-backend-service.onrender.com`).
2. Set frontend `VITE_API_BASE_URL` to that backend URL before building/deploying the frontend.
3. Set backend `FRONTEND_ORIGIN` to your frontend domain(s), for example:
   - `https://launchstatellc.me`
   - `https://nichelleoutlaw.github.io`

Manual platform settings still required:
- Add `GEMINI_API_KEY` and `FRONTEND_ORIGIN` in your Render dashboard.
- Add `VITE_API_BASE_URL` in the environment used to build/deploy the GitHub Pages frontend.

### Local development
Run the app with same-origin API calls (default):

```bash
npm run dev
```

Optional `.env` examples for local split testing:

```bash
# Backend
GEMINI_API_KEY=your_key
FRONTEND_ORIGIN=http://localhost:5173
PORT=3000

# Frontend (optional; leave blank for same-origin in combined dev)
VITE_API_BASE_URL=http://localhost:3000
```

---

## 💼 Ways to Monetize or Expand This Project

1. **Affiliate Links**: Add affiliate partner links for Registered Agents (e.g. Northwest Registered Agent, ZenBusiness), Business Banking (Mercury, Relay), and Google Workspace ($50–$250 per referral).
2. **Micro-SaaS**: Charge a one-time $29 fee for official state-specific watermarked PDF export packages with digital signature seals.
3. **Open-Source Authority**: Showcase it on Product Hunt, Hacker News (*Show HN*), or GitHub as a clean, high-utility developer portfolio piece.

---

## ⚖️ Legal Notice & Disclaimer

> **IMPORTANT**: LaunchState is an automated self-help informational platform, NOT a law firm, accounting firm, or CPA. LaunchState does not provide legal advice, tax advice, or attorney representation. Communications with LaunchState are not protected by attorney-client privilege. LLC formation laws and corporate formalities vary by state. Users represent themselves (Pro Se) in all interactions with state departments and the Internal Revenue Service.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.
