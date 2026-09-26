import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Scale, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  CreditCard, 
  ExternalLink,
  Lock,
  Globe,
  Award,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Compass,
  FileCheck,
  Coins
} from 'lucide-react';
import { UsStateCode, LLCFormData } from '../types';
import { MilestoneStep, SubTabId } from './Navbar';
import { STATES_DATA } from '../data/statesData';
import { SAMPLE_PRESET_BUSINESSES } from '../utils/storage';

interface LandingPageProps {
  llcData: LLCFormData;
  onStartStep1: () => void;
  onOpenAiAdvisor: () => void;
  onOpenDisclaimerModal: () => void;
  onLoadSampleBusiness?: (sampleData: LLCFormData) => void;
  onNavigateTo?: (milestone: MilestoneStep, subTab: SubTabId) => void;
  onOpenPreview?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  llcData,
  onStartStep1,
  onOpenAiAdvisor,
  onOpenDisclaimerModal,
  onLoadSampleBusiness,
  onNavigateTo,
  onOpenPreview,
}) => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const selectedState = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  const stepsOverview = [
    {
      step: '01',
      title: 'Legal Foundation & Formation',
      subtitle: 'Entity Setup & Legal Binder',
      description: 'Custom Articles of Organization, Operating Agreement, IRS Form SS-4 EIN packet, and 50-state statutory filing directory with exact state fees.',
      tag: 'Statutory Core',
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400'
    },
    {
      step: '02',
      title: 'Brand & Corporate Identity',
      subtitle: 'Monogram, Seal & Business Cards',
      description: 'Upload custom logos or generate corporate vector seals, build executive 300 DPI business cards (Front & Back), and configure Google Workspace DNS records.',
      tag: 'Brand & DNS',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400'
    },
    {
      step: '03',
      title: 'Capital, Grants & Growth',
      subtitle: 'Financing & Banking Readiness',
      description: 'AI-grounded Federal & State grant qualification scoring, Initial Banking Resolutions, and Mercury/Relay business banking compliance packet.',
      tag: 'Funding & Banking',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400'
    }
  ];

  const limitations = [
    {
      title: 'Not an Attorney or Law Firm',
      desc: 'LaunchState is self-help legal software, not a law firm. We do not provide legal advice, representation, or individualized legal opinions.',
      icon: Scale
    },
    {
      title: 'Self-Filing & State Fees Apply',
      desc: 'This application prepares and validates your formation packet. You submit the final documents to your Secretary of State and pay official statutory state fees directly.',
      icon: Building2
    },
    {
      title: 'No Guarantees on Grant Awards',
      desc: 'Our AI Grant Matcher provides intelligence and qualification scores based on published guidelines. Grant awards are determined solely by government awarding agencies.',
      icon: Award
    },
    {
      title: 'Tax & Regulatory Compliance',
      desc: 'Federal (IRS) and state tax status (S-Corp elections, franchise tax, annual reports) require ongoing filings by your managing members or a licensed CPA.',
      icon: Lock
    }
  ];

  const faqs = [
    {
      q: 'How does LaunchState compare to LegalZoom or ZenBusiness?',
      a: 'Unlike traditional formation services that charge recurring subscription fees and upsell proprietary lock-in services, LaunchState empowers you with 100% self-hosted documents, transparent 50-state Secretary of State portal links, custom vector branding tools, and Google Gemini AI legal assistance without hidden service markups.'
    },
    {
      q: 'Can I use this app if I already have an LLC established?',
      a: 'Yes! Existing LLC owners frequently use LaunchState to generate updated Operating Agreements, adopt Initial Banking Resolutions for business loans, configure SPF/DKIM/DMARC email security, or evaluate eligibility for state and federal grants.'
    },
    {
      q: 'What role does Google Gemini 3.8 Flash AI play in this application?',
      a: 'Gemini powers 4 native features: (1) Multi-turn legal, tax, and infrastructure advisor with live Google Search grounding; (2) Federal/State grant readiness scoring; (3) Real-time operating agreement contract clause drafting; and (4) Corporate tagline and slogan generation tailored to your exact industry.'
    },
    {
      q: 'Are the documents generated legally binding?',
      a: 'Yes, when properly signed by your LLC organizers and members and filed with your respective Secretary of State (for Articles) or retained in company records (for Operating Agreement and Resolutions), they meet standard statutory requirements.'
    }
  ];

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Powered by Google Gemini 3.8 Flash & Official 50-State Statutory Portals</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Launch, Protect & Fund Your <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">LLC Enterprise</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            The end-to-end founder workstation for forming a state-compliant Limited Liability Company, 
            generating bespoke corporate identity assets, and unlocking federal & state growth capital.
          </p>

          {/* Quick CTA button cluster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onStartStep1}
              className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
            >
              <span>Begin Step 1: Legal Formation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenAiAdvisor}
              className="px-6 py-4 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Consult Gemini AI Advisor</span>
            </button>

            {onOpenPreview && (
              <button
                onClick={onOpenPreview}
                className="px-5 py-4 bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white font-medium text-sm rounded-xl border border-slate-700/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Instant legal document preview"
              >
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>Preview Legal Binder</span>
              </button>
            )}
          </div>

          {/* Quick Test Drive / Demo Presets Bar */}
          {onLoadSampleBusiness && (
            <div className="pt-3 pb-1 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium text-[11px]">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1-Click Showcase Demo:</span>
                </span>
                {SAMPLE_PRESET_BUSINESSES.map((preset) => {
                  const isCurrent = llcData.businessName === preset.data.businessName;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onLoadSampleBusiness(preset.data)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <span>{preset.data.businessName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({preset.data.formationState})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Micro stats banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div>
              <div className="font-mono font-bold text-lg text-white">50 States</div>
              <div className="text-slate-400 text-[11px]">Direct Secretary Portals</div>
            </div>
            <div>
              <div className="font-mono font-bold text-lg text-emerald-400">$0 Markup</div>
              <div className="text-slate-400 text-[11px]">Pay State Direct Only</div>
            </div>
            <div>
              <div className="font-mono font-bold text-lg text-blue-400">300 DPI</div>
              <div className="text-slate-400 text-[11px]">Executive Card Exports</div>
            </div>
            <div>
              <div className="font-mono font-bold text-lg text-amber-400">Gemini 3.8</div>
              <div className="text-slate-400 text-[11px]">AI Grounded Intelligence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Live Entity Progress Tracker Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">Active Entity Workspace</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedState.name} ({selectedState.code})
                </span>
              </div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{llcData.businessName} {llcData.suffix}</span>
                <span className="text-xs font-normal text-slate-400 hidden sm:inline">· {llcData.industry}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateTo && (
              <button
                onClick={() => onNavigateTo('step1-legal', 'documents')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Generated Legal Documents</span>
              </button>
            )}
            {onNavigateTo && (
              <button
                onClick={() => onNavigateTo('step3-capital', 'grants-engine')}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Qualified Grants</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Interactive Phase Checkpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
          <div 
            onClick={() => onNavigateTo?.('step1-legal', 'entity-setup')}
            className="p-3 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Phase 01</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
              Statutory Articles of Org
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ${selectedState.filingFee} State fee · {selectedState.portalName.slice(0, 22)}...
            </div>
          </div>

          <div 
            onClick={() => onNavigateTo?.('step1-legal', 'documents')}
            className="p-3 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Phase 02</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
              IRS SS-4 & EIN Packet
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Form SS-4 worksheet · Line-by-line audit
            </div>
          </div>

          <div 
            onClick={() => onNavigateTo?.('step2-brand', 'brand-kit')}
            className="p-3 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Phase 03</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
              Seal, Cards & Brand Kit
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              300 DPI vector business cards & seal
            </div>
          </div>

          <div 
            onClick={() => onNavigateTo?.('step3-capital', 'grants-engine')}
            className="p-3 bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Phase 04</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
              Banking & Grant Pipeline
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Mercury/Relay resolutions + Grants
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Architecture Section */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Architectural Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The 3 Milestones to Full Launch</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Structured in consecutive order to protect personal assets, secure brand ownership, and build commercial bankability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stepsOverview.map((item, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-b ${item.color} bg-slate-900/60 border flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-slate-600">{item.step}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <div className="text-xs font-semibold text-slate-300">{item.subtitle}</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx === 0 ? (
                <button
                  onClick={onStartStep1}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Start Step 1 Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="text-[11px] text-slate-500 font-mono text-center py-2 border-t border-slate-800/80">
                  Step {item.step} available in workflow navigation
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Advisories & Legal Limitations */}
      <div className="bg-slate-900/80 border border-amber-500/30 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Important Advisories & Legal Limitations
            </h2>
            <p className="text-xs text-slate-400">
              Please review these critical self-help notices before generating filings or applying for capital.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {limitations.map((limit, idx) => {
            const Icon = limit.icon;
            return (
              <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                  <Icon className="w-4 h-4" />
                  <span>{limit.title}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {limit.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-300">
            <span className="font-semibold text-amber-300">Pro Se Representation Notice:</span> By using LaunchState, you agree that you are representing yourself pro se in establishing your business entity.
          </div>
          <button
            onClick={onOpenDisclaimerModal}
            className="px-3.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors"
          >
            Review & Sign Disclaimer
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="text-center space-y-1 mb-6">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Founder Knowledgebase</span>
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-850/50 cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-semibold text-slate-200">{faq.q}</span>
                {faqOpen === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {faqOpen === idx && (
                <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Launch Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/30 text-center space-y-4 shadow-xl">
        <h3 className="text-xl font-bold text-white">Ready to initialize your company charter?</h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Currently configured for <strong>{selectedState.name}</strong> (${selectedState.filingFee} state filing fee).
          You can change your target formation state anytime in Step 1.
        </p>
        <button
          onClick={onStartStep1}
          className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-emerald-950/70 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <span>Get Started on Step 1: Legal Foundation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
