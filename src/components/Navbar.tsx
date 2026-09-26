import React from 'react';
import { 
  Building2, 
  FileText, 
  ShieldCheck, 
  Coins, 
  Globe, 
  Download,
  Palette,
  Server,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  PanelRight,
  Sparkles
} from 'lucide-react';
import { LLCFormData, FormationStepState } from '../types';

export type MilestoneStep = 'overview' | 'step1-legal' | 'step2-brand' | 'step3-capital';

export type SubTabId = 
  // Main Overview
  | 'overview-main'
  // Step 1: Legal Foundation
  | 'entity-setup'
  | 'documents'
  // Step 2: Brand & Identity
  | 'brand-kit'
  | 'domain-email'
  | 'dns-advisor'
  // Step 3: Capital & Growth
  | 'grants-engine'
  | 'bank-resolutions';

interface NavbarProps {
  activeMilestone: MilestoneStep;
  setActiveMilestone: (milestone: MilestoneStep) => void;
  activeSubTab: SubTabId;
  setActiveSubTab: (subTab: SubTabId) => void;
  llcData: LLCFormData;
  stepState: FormationStepState;
  onExportAll: () => void;
  sideChecklistOpen?: boolean;
  onToggleSideChecklist?: () => void;
  onOpenAiAdvisor?: () => void;
  onGoToOverview?: () => void;
}

interface MilestoneConfig {
  id: MilestoneStep;
  stepNumber: number;
  label: string;
  tagline: string;
  defaultSubTab: SubTabId;
  subTabs: {
    id: SubTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const MILESTONES: MilestoneConfig[] = [
  {
    id: 'step1-legal',
    stepNumber: 1,
    label: 'Legal Foundation',
    tagline: 'Charter & Contracts',
    defaultSubTab: 'entity-setup',
    subTabs: [
      { id: 'entity-setup', label: 'Entity Setup', icon: Building2 },
      { id: 'documents', label: 'Documents & Binder', icon: FileText },
    ],
  },
  {
    id: 'step2-brand',
    stepNumber: 2,
    label: 'Brand & Identity',
    tagline: 'Presence & DNS',
    defaultSubTab: 'brand-kit',
    subTabs: [
      { id: 'brand-kit', label: 'Brand Kit', icon: Palette },
      { id: 'domain-email', label: 'Domain & Email', icon: Globe },
      { id: 'dns-advisor', label: 'DNS Advisor', icon: Server },
    ],
  },
  {
    id: 'step3-capital',
    stepNumber: 3,
    label: 'Capital & Growth',
    tagline: 'Grants & Treasury',
    defaultSubTab: 'grants-engine',
    subTabs: [
      { id: 'grants-engine', label: 'Grants Engine', icon: Coins },
      { id: 'bank-resolutions', label: 'Bank Resolutions', icon: CreditCard },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeMilestone,
  setActiveMilestone,
  activeSubTab,
  setActiveSubTab,
  llcData,
  stepState,
  onExportAll,
  sideChecklistOpen,
  onToggleSideChecklist,
  onOpenAiAdvisor,
  onGoToOverview,
}) => {
  const steps = Object.values(stepState);
  const completedCount = steps.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const activeMilestoneConfig = MILESTONES.find((m) => m.id === activeMilestone);

  const handleMilestoneClick = (milestone: MilestoneConfig) => {
    setActiveMilestone(milestone.id);
    // If the currently active subtab does not belong to this milestone, switch to milestone's default
    const belongs = milestone.subTabs.some((t) => t.id === activeSubTab);
    if (!belongs) {
      setActiveSubTab(milestone.defaultSubTab);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Main Nav Row: Brand Logo, Stepper, and Actions */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Entity Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (onGoToOverview) {
                  onGoToOverview();
                } else {
                  setActiveMilestone('overview');
                  setActiveSubTab('overview-main');
                }
              }}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
              title="Return to Main Overview Page"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    LaunchState
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    LLC OS
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate max-w-[150px] sm:max-w-[200px] font-normal">
                  {llcData.businessName ? `${llcData.businessName} ${llcData.suffix}` : 'Automated Formation'}
                </p>
              </div>
            </button>
          </div>

          {/* Stepper Navigation: Main Overview + 3 Clear Milestone Steps (Desktop / Tablet) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800">
            {/* Overview Button */}
            <button
              onClick={() => {
                if (onGoToOverview) {
                  onGoToOverview();
                } else {
                  setActiveMilestone('overview');
                  setActiveSubTab('overview-main');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs font-bold ${
                activeMilestone === 'overview'
                  ? 'bg-slate-800 text-emerald-400 shadow-md border border-slate-700 ring-1 ring-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>Overview</span>
            </button>
            {MILESTONES.map((milestone, idx) => {
              const isCurrent = activeMilestone === milestone.id;
              const isPassed = MILESTONES.findIndex((m) => m.id === activeMilestone) > idx;

              return (
                <button
                  key={milestone.id}
                  onClick={() => handleMilestoneClick(milestone)}
                  className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800 text-white shadow-md border border-slate-700 ring-1 ring-emerald-500/30'
                      : isPassed
                      ? 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                  }`}
                >
                  {/* Step Badge */}
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : milestone.stepNumber}
                  </div>

                  {/* Label & Description */}
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold whitespace-nowrap ${isCurrent ? 'text-emerald-400' : 'text-slate-200'}`}>
                        Step {milestone.stepNumber}: {milestone.label}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Launch Readiness Progress */}
            <div className="hidden lg:flex flex-col items-end pr-2 border-r border-slate-800">
              <span className="text-[11px] text-slate-400">Launch Readiness</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400">{progressPercent}%</span>
              </div>
            </div>

            {/* Toggle Side Checklist Button */}
            {onToggleSideChecklist && (
              <button
                onClick={onToggleSideChecklist}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  sideChecklistOpen
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title="Toggle persistent side formation checklist"
              >
                <PanelRight className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Checklist</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-emerald-400">
                  {completedCount}/{steps.length}
                </span>
              </button>
            )}

            {/* AI Formation, Tax & Infrastructure Advisor Button */}
            {onOpenAiAdvisor && (
              <button
                onClick={onOpenAiAdvisor}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 text-emerald-300 border border-emerald-500/40 shadow-sm transition-all cursor-pointer"
                title="Open AI Legal, Tax & Infrastructure Advisor"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">AI Advisor</span>
              </button>
            )}

            {/* Export Formation Binder Button */}
            <button
              onClick={onExportAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
              title="Preview and download complete legal formation packet"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download Binder</span>
              <span className="md:hidden">Binder</span>
            </button>
          </div>
        </div>

        {/* Mobile Stepper (Horizontal) */}
        <div className="md:hidden flex items-center justify-between gap-1 py-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              if (onGoToOverview) {
                onGoToOverview();
              } else {
                setActiveMilestone('overview');
                setActiveSubTab('overview-main');
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs whitespace-nowrap font-medium rounded-lg transition-colors ${
              activeMilestone === 'overview'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Overview</span>
          </button>
          {MILESTONES.map((milestone) => {
            const isCurrent = activeMilestone === milestone.id;
            return (
              <button
                key={milestone.id}
                onClick={() => handleMilestoneClick(milestone)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs whitespace-nowrap font-medium rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`w-4 h-4 rounded text-[10px] font-mono flex items-center justify-center ${
                  isCurrent ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {milestone.stepNumber}
                </span>
                <span>{milestone.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-Navigation Ribbon (Subtabs for Active Milestone) */}
        {activeMilestoneConfig && (
          <div className="py-2.5 border-t border-slate-800/80 flex items-center justify-between overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline mr-1">
                Step {activeMilestoneConfig.stepNumber} Views:
              </span>

              {activeMilestoneConfig.subTabs.map((subTab) => {
                const Icon = subTab.icon;
                const isActive = activeSubTab === subTab.id;

                return (
                  <button
                    key={subTab.id}
                    onClick={() => setActiveSubTab(subTab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{subTab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Context Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>LLC State: <strong className="text-white">{llcData.formationState}</strong></span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
