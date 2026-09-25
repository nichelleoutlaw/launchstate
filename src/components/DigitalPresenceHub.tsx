import React, { useState } from 'react';
import { 
  Globe, 
  Mail, 
  PhoneCall, 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Search,
  ArrowRight,
  Smartphone,
  Server
} from 'lucide-react';
import { LLCFormData } from '../types';
import { DIGITAL_TOOLS } from '../data/digitalToolsData';
import { STATES_DATA } from '../data/statesData';

interface DigitalPresenceHubProps {
  llcData: LLCFormData;
  onGoToDnsAdvisor?: () => void;
}

export const DigitalPresenceHub: React.FC<DigitalPresenceHubProps> = ({
  llcData,
  onGoToDnsAdvisor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'voice' | 'email' | 'domain' | 'banking'>('domain');
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);
  const [domainSearchQuery, setDomainSearchQuery] = useState<string>(
    llcData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'vanguardsynergy'
  );

  const cleanBrand = domainSearchQuery.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'company';
  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  // Generated Domain Suggestions
  const domainSuggestions = [
    { domain: `${cleanBrand}.com`, tld: '.com', tag: 'Standard Gold', price: '$12/yr', provider: 'Squarespace / Cloudflare' },
    { domain: `get${cleanBrand}.com`, tld: '.com', tag: 'High-Growth Action', price: '$12/yr', provider: 'Cloudflare' },
    { domain: `${cleanBrand}.co`, tld: '.co', tag: 'Modern Company', price: '$24/yr', provider: 'Namecheap' },
    { domain: `${cleanBrand}.io`, tld: '.io', tag: 'Tech & Engineering', price: '$35/yr', provider: 'Squarespace' },
    { domain: `${cleanBrand}hq.com`, tld: '.com', tag: 'Corporate HQ', price: '$12/yr', provider: 'Cloudflare' },
    { domain: `${cleanBrand}.biz`, tld: '.biz', tag: 'Commercial Trade', price: '$15/yr', provider: 'Namecheap' },
  ];

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedRecord(id);
      setTimeout(() => setCopiedRecord(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const primaryTool = DIGITAL_TOOLS.find((t) => t.category === activeSubTab) || DIGITAL_TOOLS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>DIGITAL INFRASTRUCTURE & REPUTATION</span>
              <span>·</span>
              <span>VERIFIED ENTITY PRESENCE</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Domain, Business Email & Google Voice Setup
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Equip your LLC with a custom domain, professional email on Google Workspace, a dedicated Google Voice business telephone line, and corporate banking to safeguard your personal identity and pass lender verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onGoToDnsAdvisor && (
              <button
                onClick={onGoToDnsAdvisor}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Server className="w-3.5 h-3.5" />
                <span>Open DNS Advisor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: 'domain', label: '1. Business Domain', icon: Globe },
          { id: 'email', label: '2. Google Workspace Email', icon: Mail },
          { id: 'voice', label: '3. Google Voice Line', icon: PhoneCall },
          { id: 'banking', label: '4. Business Checking', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DOMAIN SEARCH & REGISTRATION TAB */}
      {activeSubTab === 'domain' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  Secure Your LLC's Commercial Domain
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Owning your exact domain protects your trademark and prevents squatters from impersonating your business.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Free WHOIS Privacy Recommended</span>
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="flex gap-2 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={domainSearchQuery}
                  onChange={(e) => setDomainSearchQuery(e.target.value)}
                  placeholder="Enter your brand name without spaces..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Suggested Domains Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {domainSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.tag}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-300">{item.price}</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white mt-2 truncate">
                      {item.domain}
                    </div>
                    <div className="text-[11px] text-slate-400">Registrar: {item.provider}</div>
                  </div>

                  <a
                    href={`https://domains.squarespace.com/search?domain=${encodeURIComponent(item.domain)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 py-2 px-3 bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Check Availability</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* DNS Configuration Guide Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Essential Business DNS Records (Google Workspace & SPF)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">100% Inbox Deliverability</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once you purchase your domain, add these standard DNS records in your domain registrar control panel to ensure your business emails pass spam filters:
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">MX RECORD: </span>
                  <span className="text-slate-300">SMTP.GOOGLE.COM (Priority 1)</span>
                </div>
                <button
                  onClick={() => handleCopy('SMTP.GOOGLE.COM', 'mx')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded flex items-center gap-1"
                >
                  {copiedRecord === 'mx' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord === 'mx' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-400 font-bold">TXT (SPF): </span>
                  <span className="text-slate-300">v=spf1 include:_spf.google.com ~all</span>
                </div>
                <button
                  onClick={() => handleCopy('v=spf1 include:_spf.google.com ~all', 'spf')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded flex items-center gap-1"
                >
                  {copiedRecord === 'spf' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord === 'spf' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BUSINESS EMAIL TAB (GOOGLE WORKSPACE) */}
      {activeSubTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <span>OFFICIAL GOOGLE WORKSPACE PARTNER PATH</span>
                </div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  Google Workspace Custom Business Email
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Establish instant corporate authority with a personalized address like <span className="text-emerald-400 font-mono">founder@{cleanBrand}.com</span>.
                </p>
              </div>

              <a
                href="https://workspace.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Start Google Workspace 14-Day Free Trial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
                <span className="text-xs font-bold text-white block">Full Gmail Experience</span>
                <p className="text-[11px] text-slate-300">
                  Access familiar Gmail interface, Google Drive, Calendar, Docs, and Google Meet with zero ads.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
                <span className="text-xs font-bold text-white block">Unlimited Free Aliases</span>
                <p className="text-[11px] text-slate-300">
                  Route support@, billing@, sales@, and press@ directly into your single founder inbox at $0 extra cost.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
                <span className="text-xs font-bold text-white block">Lender & Bank Trust</span>
                <p className="text-[11px] text-slate-300">
                  Tier-1 banks (Chase, Wells Fargo, Mercury) and SBA underwriters require a domain email before approving credit lines.
                </p>
              </div>
            </div>

            {/* Step-by-Step Walkthrough */}
            <div className="pt-4 border-t border-slate-700/60 space-y-3">
              <h3 className="text-sm font-bold text-white">4-Step Google Workspace Onboarding</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {DIGITAL_TOOLS[1].setupGuideSteps.map((step) => (
                  <div key={step.step} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/70 space-y-1">
                    <span className="font-mono font-bold text-emerald-400 block text-[11px]">
                      STEP 0{step.step}: {step.title}
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. GOOGLE VOICE FOR BUSINESS TAB */}
      {activeSubTab === 'voice' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <span>PRIVACY & SEPARATION OF ASSETS</span>
                </div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  Google Voice Virtual Business Telephone
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Never put your personal cell phone number on public state Articles of Organization records or loan applications.
                </p>
              </div>

              <a
                href="https://workspace.google.com/products/voice/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Get Google Voice Number</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Why Google Voice is Essential */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-3">
              <h3 className="text-sm font-bold text-white">Why Every LLC Founder Needs Google Voice:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Total Personal Privacy:</strong> State SOS portals publish telephone numbers. Google Voice screens spam and shields your personal mobile.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Area Code Matching:</strong> Pick a local telephone area code matching your {stateInfo.name} office for customer trust.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Voicemail Transcriptions:</strong> Automatically converts customer voicemails into searchable text sent to your email.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Cross-Device Ringing:</strong> Answer business inquiries simultaneously from your phone, laptop, or browser.</span>
                </div>
              </div>
            </div>

            {/* Voicemail Greeting Script Generator */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Professional Voicemail Greeting Script:</span>
                <button
                  onClick={() => handleCopy(`Thank you for calling ${llcData.businessName} ${llcData.suffix}. Our team is currently assisting other clients or out in the field. Please leave your name, phone number, and a brief description of your inquiry, and an authorized representative will return your call promptly. You can also visit our website or text this line for faster assistance. Have a wonderful day.`, 'voicemail')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  {copiedRecord === 'voicemail' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRecord === 'voicemail' ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>
              <p className="font-mono text-xs text-slate-300 p-3 bg-slate-950 rounded-lg border border-slate-800 leading-relaxed italic">
                "Thank you for calling {llcData.businessName} {llcData.suffix}. Our team is currently assisting other clients or out in the field. Please leave your name, phone number, and a brief description of your inquiry, and an authorized representative will return your call promptly. You can also visit our website or text this line for faster assistance. Have a wonderful day."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. BUSINESS BANKING TAB */}
      {activeSubTab === 'banking' && (
        <div className="space-y-6">
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                  <span>PRESERVING THE CORPORATE VEIL</span>
                </div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  Zero-Fee Business Checking & Capital Ledger
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Commingling personal and business funds will pierce your LLC's limited liability shield. A dedicated business checking account is legally required.
                </p>
              </div>

              <a
                href="https://mercury.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Apply Online at Mercury Bank</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Requirements for Opening */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
                <span className="font-bold text-emerald-400 block font-mono">DOCUMENT 01</span>
                <strong className="text-white block">State Filed Articles</strong>
                <p className="text-slate-300 text-[11px]">
                  Certified stamped Articles of Organization from {stateInfo.name} Secretary of State.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
                <span className="font-bold text-emerald-400 block font-mono">DOCUMENT 02</span>
                <strong className="text-white block">IRS EIN Letter (CP 575)</strong>
                <p className="text-slate-300 text-[11px]">
                  Official tax identification number document generated through the IRS portal.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
                <span className="font-bold text-emerald-400 block font-mono">DOCUMENT 03</span>
                <strong className="text-white block">Operating Agreement</strong>
                <p className="text-slate-300 text-[11px]">
                  Executed Operating Agreement showing member banking authorizations and voting powers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
