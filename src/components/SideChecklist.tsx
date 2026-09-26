import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ExternalLink, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Palette, 
  Globe, 
  Server, 
  Coins, 
  CreditCard,
  PanelRightClose,
  PanelRightOpen,
  ArrowUpRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { LLCFormData, FormationStepState } from '../types';
import { STATES_DATA } from '../data/statesData';
import { MilestoneStep, SubTabId } from './Navbar';

interface SideChecklistProps {
  llcData: LLCFormData;
  stepState: FormationStepState;
  updateStepState: (key: keyof FormationStepState, value: boolean) => void;
  onNavigate: (milestone: MilestoneStep, subTab: SubTabId) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface ChecklistMilestoneGroup {
  id: MilestoneStep;
  title: string;
  stepNumber: number;
  items: {
    key: keyof FormationStepState;
    title: string;
    subTab: SubTabId;
    milestone: MilestoneStep;
    externalLink?: string;
  }[];
}

export const SideChecklist: React.FC<SideChecklistProps> = ({
  llcData,
  stepState,
  updateStepState,
  onNavigate,
  isOpen,
  onToggle,
}) => {
  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  const milestoneGroups: ChecklistMilestoneGroup[] = [
    {
      id: 'step1-legal',
      title: 'Step 1: Legal Foundation',
      stepNumber: 1,
      items: [
        {
          key: 'nameCheckCompleted',
          title: 'Check Name Availability',
          milestone: 'step1-legal',
          subTab: 'entity-setup',
          externalLink: stateInfo.statePortalUrl,
        },
        {
          key: 'registeredAgentSelected',
          title: 'Designate Registered Agent',
          milestone: 'step1-legal',
          subTab: 'entity-setup',
        },
        {
          key: 'articlesGenerated',
          title: 'Generate Articles of Organization',
          milestone: 'step1-legal',
          subTab: 'documents',
        },
        {
          key: 'stateFilingReady',
          title: `File with ${stateInfo.code} Secretary of State ($${stateInfo.filingFee})`,
          milestone: 'step1-legal',
          subTab: 'documents',
          externalLink: stateInfo.statePortalUrl,
        },
        {
          key: 'operatingAgreementDrafted',
          title: 'Execute Operating Agreement',
          milestone: 'step1-legal',
          subTab: 'documents',
        },
        {
          key: 'ss4Ready',
          title: 'Obtain IRS EIN (Form SS-4)',
          milestone: 'step1-legal',
          subTab: 'documents',
          externalLink: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
        },
      ],
    },
    {
      id: 'step2-brand',
      title: 'Step 2: Brand & Identity',
      stepNumber: 2,
      items: [
        {
          key: 'domainSearched',
          title: 'Generate Brand Kit & Monogram',
          milestone: 'step2-brand',
          subTab: 'brand-kit',
        },
        {
          key: 'businessEmailExplored',
          title: 'Claim Domain & Email Aliases',
          milestone: 'step2-brand',
          subTab: 'domain-email',
        },
        {
          key: 'googleVoiceExplored',
          title: 'Configure DNS (MX, SPF, DKIM, DMARC)',
          milestone: 'step2-brand',
          subTab: 'dns-advisor',
        },
      ],
    },
    {
      id: 'step3-capital',
      title: 'Step 3: Capital & Growth',
      stepNumber: 3,
      items: [
        {
          key: 'fundingSearched',
          title: 'Apply for State & Federal Grants',
          milestone: 'step3-capital',
          subTab: 'grants-engine',
        },
        {
          key: 'initialResolutionsDrafted' as any,
          title: 'Draft Bank Authorization Resolutions',
          milestone: 'step3-capital',
          subTab: 'bank-resolutions',
        },
      ],
    },
  ];

  // Calculate overall progress
  const allItemKeys = milestoneGroups.flatMap((g) => g.items.map((i) => i.key));
  const completedCount = allItemKeys.filter((k) => !!stepState[k]).length;
  const totalCount = allItemKeys.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // If collapsed on desktop, show slim clickable vertical pill
  if (!isOpen) {
    return (
      <aside className="hidden lg:flex flex-col items-center py-6 px-2 bg-slate-900/90 border-l border-slate-800 w-14 shrink-0 transition-all duration-300">
        <button
          onClick={onToggle}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          title="Expand Formation Checklist"
        >
          <PanelRightOpen className="w-5 h-5 text-emerald-400" />
        </button>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="text-[11px] font-mono font-bold text-emerald-400 -rotate-90 whitespace-nowrap tracking-wider">
            {progressPct}% DONE
          </div>
          <div className="w-1.5 h-32 bg-slate-800 rounded-full overflow-hidden mt-6">
            <div
              className="w-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ height: `${progressPct}%` }}
            />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 xl:w-92 shrink-0 bg-slate-900/95 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 z-30">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              Formation Checklist
            </h2>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar & Counter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Launch Readiness</span>
            <span className="text-emerald-400 font-bold">{completedCount}/{totalCount} ({progressPct}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* State Quick Info Badge */}
        <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono">SOS Filing Fee:</span>
          <span className="text-emerald-400 font-mono font-bold">${stateInfo.filingFee} ({stateInfo.code})</span>
        </div>
      </div>

      {/* Scrollable Milestone Steps List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
        {milestoneGroups.map((group) => {
          const groupCompleted = group.items.filter((i) => !!stepState[i.key]).length;

          return (
            <div key={group.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pb-1 border-b border-slate-800/80">
                <span>{group.title}</span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {groupCompleted}/{group.items.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isDone = !!stepState[item.key];

                  return (
                    <div
                      key={item.key}
                      className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 group ${
                        isDone
                          ? 'bg-slate-900/40 border-slate-800/80 text-slate-400'
                          : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => updateStepState(item.key, !isDone)}
                        className="mt-0.5 shrink-0 focus:outline-none cursor-pointer"
                        title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                        )}
                      </button>

                      {/* Content & Action Link */}
                      <div className="flex-1 min-w-0">
                        <div
                          onClick={() => onNavigate(item.milestone, item.subTab)}
                          className={`text-xs font-medium cursor-pointer leading-tight truncate hover:text-emerald-300 transition-colors ${
                            isDone ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                          title={item.title}
                        >
                          {item.title}
                        </div>

                        {/* Quick Jump Buttons */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => onNavigate(item.milestone, item.subTab)}
                            className="text-[10px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Open</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          {item.externalLink && (
                            <a
                              href={item.externalLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono text-slate-500 hover:text-slate-300 flex items-center gap-0.5"
                            >
                              <span>Official Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer with SOS Direct Portal */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs">
        <a
          href={stateInfo.statePortalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>{stateInfo.code} Secretary of State Portal</span>
          <ExternalLink className="w-3 h-3 text-emerald-400" />
        </a>
      </div>
    </aside>
  );
};
