import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  Mail,
  Coins,
  Banknote,
  Globe,
  Calendar
} from 'lucide-react';
import { LLCFormData, FormationStepState } from '../types';
import { STATES_DATA } from '../data/statesData';

interface FormationChecklistProps {
  llcData: LLCFormData;
  stepState: FormationStepState;
  updateStepState: (key: keyof FormationStepState, value: boolean) => void;
  onNavigateTab: (tabId: string) => void;
}

export const FormationChecklist: React.FC<FormationChecklistProps> = ({
  llcData,
  stepState,
  updateStepState,
  onNavigateTab,
}) => {
  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  const roadmapItems: {
    key: keyof FormationStepState;
    title: string;
    description: string;
    tabTarget: string;
    icon: any;
    actionLabel: string;
    externalLink?: string;
  }[] = [
    {
      key: 'nameCheckCompleted',
      title: '1. LLC Name Search & Reservation',
      description: `Confirm "${llcData.businessName} ${llcData.suffix}" is distinguishable in ${stateInfo.name}.`,
      tabTarget: 'formation',
      icon: Building2,
      actionLabel: 'Edit Name & Suffix',
      externalLink: stateInfo.statePortalUrl,
    },
    {
      key: 'registeredAgentSelected',
      title: '2. Appoint Registered Agent',
      description: `Appointed: ${llcData.agentName} (${llcData.agentType === 'self' ? 'Acting as Own Agent' : 'Commercial Agent'}).`,
      tabTarget: 'formation',
      icon: ShieldCheck,
      actionLabel: 'Review Agent Details',
    },
    {
      key: 'articlesGenerated',
      title: '3. Generate Articles of Organization',
      description: `Pre-filled state charter compiled for the ${stateInfo.portalName} ($${stateInfo.filingFee} fee).`,
      tabTarget: 'documents',
      icon: FileText,
      actionLabel: 'View & Print Articles',
    },
    {
      key: 'stateFilingReady',
      title: '4. File with Secretary of State',
      description: `Submit your Articles of Organization online. Expected processing time: ${stateInfo.processingTimeDays}.`,
      tabTarget: 'documents',
      icon: ExternalLink,
      actionLabel: `Open ${stateInfo.code} SOS Portal`,
      externalLink: stateInfo.statePortalUrl,
    },
    {
      key: 'operatingAgreementDrafted',
      title: '5. Execute LLC Operating Agreement',
      description: `Full 9-section agreement drafted for ${llcData.members.length} member(s) to protect personal assets.`,
      tabTarget: 'documents',
      icon: FileText,
      actionLabel: 'Inspect Agreement',
    },
    {
      key: 'ss4Ready',
      title: '6. Obtain IRS Employer ID Number (EIN)',
      description: 'Free 5-minute federal tax ID application through IRS.gov (Generates Form CP 575 notice).',
      tabTarget: 'ein',
      icon: ShieldCheck,
      actionLabel: 'Open EIN Assistant',
    },
    {
      key: 'domainSearched',
      title: '7. Register Domain & Protect Brand',
      description: `Claim your domain matching "${llcData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com".`,
      tabTarget: 'digital-identity',
      icon: Globe,
      actionLabel: 'Search Domains',
    },
    {
      key: 'businessEmailExplored',
      title: '8. Set Up Google Workspace Business Email',
      description: 'Create professional addresses (founder@yourcompany.com) with 14-day free trial.',
      tabTarget: 'digital-identity',
      icon: Mail,
      actionLabel: 'Setup Email Guide',
    },
    {
      key: 'googleVoiceExplored',
      title: '9. Activate Google Voice Business Phone',
      description: `Private business telephone with dedicated ${stateInfo.name} local area code.`,
      tabTarget: 'digital-identity',
      icon: Globe,
      actionLabel: 'Google Voice Guide',
    },
    {
      key: 'fundingSearched',
      title: '10. Search City, State & Federal Funding',
      description: 'Apply for non-dilutive grants, SBIR innovation awards, and low-interest SBA microloans.',
      tabTarget: 'funding',
      icon: Coins,
      actionLabel: 'Explore Funding',
    },
  ];

  const completed = Object.values(stepState).filter(Boolean).length;
  const total = roadmapItems.length;
  const progressPct = Math.round((completed / total) * 100);

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Master Entrepreneur Formation Roadmap</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step execution tracker for {llcData.businessName} {llcData.suffix} in {stateInfo.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-28 h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">{progressPct}% Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {roadmapItems.map((item) => {
          const isDone = !!stepState[item.key];
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                isDone
                  ? 'bg-slate-900/80 border-slate-700/80'
                  : 'bg-slate-900/40 border-slate-800'
              }`}
            >
              <button
                type="button"
                onClick={() => updateStepState(item.key, !isDone)}
                className="mt-0.5 shrink-0 focus:outline-none"
                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className={`text-xs font-bold truncate ${isDone ? 'text-white' : 'text-slate-300'}`}>
                    {item.title}
                  </h3>
                  <button
                    onClick={() => onNavigateTab(item.tabTarget)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium shrink-0 flex items-center gap-0.5"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Tracker Callout */}
      <div className="pt-2">
        <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{stateInfo.name} Ongoing Compliance & Annual Report Tracker</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {stateInfo.annualReportFee === 0 ? '$0 State Fee' : `$${stateInfo.annualReportFee} Annual`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Maintain good standing with email & push reminders for statutory filing deadlines.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('compliance')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <span>Open Compliance Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
