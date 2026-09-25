import React from 'react';
import { 
  Building2, 
  FileText, 
  ShieldCheck, 
  Coins, 
  Banknote, 
  Globe, 
  MapPin, 
  Sparkles, 
  Download,
  Calendar
} from 'lucide-react';
import { LLCFormData, FormationStepState } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  llcData: LLCFormData;
  stepState: FormationStepState;
  onOpenAdvisor: () => void;
  onExportAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  llcData,
  stepState,
  onOpenAdvisor,
  onExportAll,
}) => {
  const steps = Object.values(stepState);
  const completedCount = steps.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const navItems = [
    { id: 'formation', label: 'LLC Formation', icon: Building2 },
    { id: 'documents', label: 'Legal Docs', icon: FileText },
    { id: 'ein', label: 'IRS EIN', icon: ShieldCheck },
    { id: 'compliance', label: 'Compliance Tracker', icon: Calendar },
    { id: 'funding', label: 'Grants & Funding', icon: Coins },
    { id: 'loans', label: 'Business Loans', icon: Banknote },
    { id: 'digital-identity', label: 'Voice, Email & Domain', icon: Globe },
    { id: 'state-directory', label: '50-State Guide', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('formation')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
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
                    LLC & Capital
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate max-w-[210px] sm:max-w-xs font-normal">
                  {llcData.businessName ? `${llcData.businessName} ${llcData.suffix}` : 'Automated Formation Engine'}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Progress indicator */}
            <div className="hidden sm:flex flex-col items-end pr-2 border-r border-slate-800">
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

            {/* AI Advisor Button */}
            <button
              onClick={onOpenAdvisor}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors shadow-sm"
              title="Ask AI Legal & Tax Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">AI Formation Advisor</span>
              <span className="sm:hidden">AI Advisor</span>
            </button>

            {/* Export Package Button */}
            <button
              onClick={onExportAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
              title="Export complete legal formation packet"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Download Binder</span>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Scrollable Nav Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs whitespace-nowrap font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
