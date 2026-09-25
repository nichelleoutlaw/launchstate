import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  HelpCircle,
  FileCheck,
  Building,
  Info
} from 'lucide-react';
import { LLCFormData } from '../types';
import { STATES_DATA } from '../data/statesData';
import { generateFormSS4Packet } from '../utils/documentTemplates';

interface EinAssistantProps {
  llcData: LLCFormData;
  updateLLCData: (data: Partial<LLCFormData>) => void;
  onOpenAdvisorWithPrompt?: (prompt: string) => void;
}

export const EinAssistant: React.FC<EinAssistantProps> = ({
  llcData,
  updateLLCData,
  onOpenAdvisorWithPrompt,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  // Calculate if IRS online system is currently open (Mon-Fri 7:00 AM - 10:00 PM Eastern Time)
  const [isIrsOpen, setIsIrsOpen] = useState<boolean>(true);

  useEffect(() => {
    try {
      const now = new Date();
      // Format to Eastern Time
      const easternTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
      const [hourStr] = easternTimeStr.split(':');
      const hour = parseInt(hourStr, 10);
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekday = day >= 1 && day <= 5;
      const isOpenHours = hour >= 7 && hour < 22;
      setIsIrsOpen(isWeekday && isOpenHours);
    } catch (e) {
      setIsIrsOpen(true);
    }
  }, []);

  const ss4Content = generateFormSS4Packet(llcData);

  const handleCopySS4 = async () => {
    try {
      await navigator.clipboard.writeText(ss4Content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const irsSteps = [
    {
      step: 1,
      title: 'Entity Structure',
      irsQuestion: 'What type of legal structure is applying for an EIN?',
      yourAnswer: 'Limited Liability Company (LLC)',
      rationale: 'Select "Limited Liability Company (LLC)" - do NOT select Sole Proprietorship or Corporation unless you have already filed election forms.',
    },
    {
      step: 2,
      title: 'Number of Members & State',
      irsQuestion: 'How many members are in the LLC and what state was it organized in?',
      yourAnswer: `${llcData.members.length} Member(s) in ${stateInfo.name}`,
      rationale: `If 1 member: IRS defaults to Disregarded Entity (taxed like sole proprietorship). If 2+: IRS defaults to Partnership.`,
    },
    {
      step: 3,
      title: 'Responsible Party Details',
      irsQuestion: 'Who is the Responsible Party who controls, manages, or directs the applicant entity?',
      yourAnswer: `${llcData.responsiblePartyName || 'Founder Name'} (${llcData.responsiblePartyTitle || 'Managing Member'})`,
      rationale: 'Must be an individual person with a valid SSN or ITIN. Must be an owner or officer of the LLC.',
    },
    {
      step: 4,
      title: 'Physical Location',
      irsQuestion: 'Where is the physical location of the LLC?',
      yourAnswer: `${llcData.officeStreet}, ${llcData.officeCity}, ${llcData.officeState} ${llcData.officeZip}`,
      rationale: 'Physical US street address where business is conducted. Cannot be a P.O. Box.',
    },
    {
      step: 5,
      title: 'Reason for Applying',
      irsQuestion: 'Why is the LLC requesting an EIN?',
      yourAnswer: 'Started a new business',
      rationale: 'Select "Started a new business" and specify your primary line of business.',
    },
    {
      step: 6,
      title: 'Confirmation & CP 575 PDF',
      irsQuestion: 'How would you like to receive your EIN Confirmation Notice?',
      yourAnswer: 'Receive letter online (Immediate PDF Download)',
      rationale: 'Choose "Receive letter online" to immediately view and download your official CP 575 EIN letter in your browser.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>INTERNAL REVENUE SERVICE (IRS)</span>
              <span>·</span>
              <span>OFFICIAL FEDERAL TAX ID</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              IRS EIN (Employer Identification Number) Assistant
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              An Employer Identification Number (EIN) is your business's federal tax ID, essential for opening your business checking account, hiring employees, establishing wholesale vendor accounts, and filing federal tax returns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-colors"
            >
              <span>Launch Official IRS.gov Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Free IRS Warning Banner */}
      <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">
              The Official IRS EIN Application is 100% FREE
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
              Save $150 - $350
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Predatory formation companies often charge $150 to $350 to "file" for an EIN. In reality, the IRS provides this service completely free of charge to any business entity, issuing your official EIN and CP-575 confirmation notice instantly upon completion.
          </p>
        </div>
      </div>

      {/* IRS Portal Hours & Live Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-mono">IRS Online Hours</div>
              <div className="text-xs font-semibold text-white">Mon–Fri: 7:00am – 10:00pm ET</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-700">
            <span className={`w-2 h-2 rounded-full ${isIrsOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-[10px] font-mono font-medium text-slate-300">
              {isIrsOpen ? 'PORTAL OPEN' : 'AFTER HOURS'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-center gap-3">
          <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono">Issuance Speed</div>
            <div className="text-xs font-semibold text-white">Instantaneous PDF Download</div>
          </div>
        </div>

        <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-center gap-3">
          <Building className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono">Entity Match</div>
            <div className="text-xs font-semibold text-white truncate max-w-[170px]">
              {llcData.businessName} {llcData.suffix}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step IRS Portal Guide */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white">
              Official IRS Online Interview Walkthrough
            </h2>
            <p className="text-xs text-slate-400">
              Follow these exact answers during your 5-minute IRS online session to avoid processing delays.
            </p>
          </div>
          <button
            onClick={handleCopySS4}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700/80 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Full SS-4 Packet' : 'Copy Full SS-4 Packet'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {irsSteps.map((item) => (
            <div
              key={item.step}
              className="p-4 bg-slate-900/70 border border-slate-700/70 rounded-xl space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">
                  IRS QUESTION 0{item.step}
                </span>
                <span className="text-xs font-semibold text-slate-400">{item.title}</span>
              </div>
              <div className="text-xs text-slate-300 font-medium">{item.irsQuestion}</div>
              <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between">
                <span className="truncate">{item.yourAnswer}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-filled Form SS-4 Audit Summary Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Form SS-4 Pre-Filing Data Worksheet
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            IRS Form SS-4 Equivalent Line Items
          </span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
          {ss4Content}
        </div>
      </div>
    </div>
  );
};
