import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { LLCFormData, UsStateCode, MemberInfo } from '../types';
import { STATES_DATA } from '../data/statesData';

interface FormationWizardProps {
  llcData: LLCFormData;
  updateLLCData: (data: Partial<LLCFormData>) => void;
  onGenerateDocs: () => void;
  onGoToTab: (tabId: string) => void;
  onOpenAdvisorWithPrompt: (prompt: string) => void;
}

export const FormationWizard: React.FC<FormationWizardProps> = ({
  llcData,
  updateLLCData,
  onGenerateDocs,
  onGoToTab,
  onOpenAdvisorWithPrompt,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const selectedStateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  // Member Management
  const addMember = () => {
    const newMember: MemberInfo = {
      id: `mem-${Date.now()}`,
      fullName: '',
      title: 'Member',
      ownershipPercentage: 0,
      initialContribution: 1000,
      streetAddress: llcData.officeStreet || '',
      city: llcData.officeCity || '',
      state: llcData.officeState || llcData.formationState,
      zipCode: llcData.officeZip || '',
    };
    updateLLCData({ members: [...llcData.members, newMember] });
  };

  const removeMember = (id: string) => {
    if (llcData.members.length <= 1) return;
    updateLLCData({ members: llcData.members.filter((m) => m.id !== id) });
  };

  const updateMember = (id: string, updates: Partial<MemberInfo>) => {
    updateLLCData({
      members: llcData.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    });
  };

  const totalOwnership = llcData.members.reduce((sum, m) => sum + (Number(m.ownershipPercentage) || 0), 0);
  const isOwnershipBalanced = totalOwnership === 100;

  const steps = [
    { num: 1, title: 'Identity & Purpose', icon: Building2 },
    { num: 2, title: 'State & Agent', icon: MapPin },
    { num: 3, title: 'Management & Ownership', icon: Users },
    { num: 4, title: 'Address & EIN Details', icon: Briefcase },
    { num: 5, title: 'Review & Filing Packet', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Header / Hero */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>OFFICIAL FORMATION WORKFLOW</span>
              <span>·</span>
              <span>STATE COMPLIANT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Create Your LLC Online
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate state-certified Articles of Organization, complete an IRS Form SS-4 for your EIN, and unlock instant step-by-step state filing instructions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAdvisorWithPrompt(`Which state is best for my LLC: ${llcData.formationState} or Delaware / Wyoming?`)}
              className="px-3.5 py-2 text-xs font-medium bg-slate-700/80 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>State Selection Advice</span>
            </button>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-6 border-t border-slate-700/60">
          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                  isCurrent
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                    : isDone
                    ? 'bg-slate-900/60 text-slate-300 hover:bg-slate-900/90'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                    Step 0{s.num}
                  </div>
                  <div className="text-xs font-medium truncate">{s.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 shadow-xl">
        {/* STEP 1: IDENTITY & PURPOSE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                1. LLC Name & Business Purpose
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your business name must be unique in your formation state and end with an approved designator.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Proposed Business Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={llcData.businessName}
                  onChange={(e) => updateLLCData({ businessName: e.target.value })}
                  placeholder="e.g. Apex Horizon Ventures"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  LLC Legal Suffix <span className="text-rose-400">*</span>
                </label>
                <select
                  value={llcData.suffix}
                  onChange={(e) => updateLLCData({ suffix: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="LLC">LLC</option>
                  <option value="L.L.C.">L.L.C.</option>
                  <option value="Limited Liability Company">Limited Liability Company</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
              <div className="text-xs text-slate-300">
                <span className="text-slate-400">Official Registered Entity Name: </span>
                <span className="font-semibold text-emerald-400 font-mono">
                  {llcData.businessName.trim() || '[Your Business Name]'} {llcData.suffix}
                </span>
              </div>
              <button
                onClick={() => onOpenAdvisorWithPrompt(`Is the name "${llcData.businessName} ${llcData.suffix}" legally compliant and how should I check trademark and Secretary of State conflicts?`)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Check Name Rules
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Industry
                </label>
                <input
                  type="text"
                  value={llcData.industry}
                  onChange={(e) => updateLLCData({ industry: e.target.value })}
                  placeholder="e.g. Technology & Cloud Consulting, E-Commerce, Real Estate"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  NAICS Code / Activity Tag
                </label>
                <input
                  type="text"
                  value={llcData.naicsCode}
                  onChange={(e) => updateLLCData({ naicsCode: e.target.value })}
                  placeholder="e.g. 541512 - Computer Systems Design"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                General Business Purpose & Activity Description
              </label>
              <textarea
                rows={3}
                value={llcData.businessDescription}
                onChange={(e) => updateLLCData({ businessDescription: e.target.value })}
                placeholder="State the general nature of the business (e.g. engaging in lawful retail sales, professional technology consulting, and marketing services)."
                className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard legal wording: "To engage in any and all lawful business activities for which limited liability companies may be organized."
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: STATE & REGISTERED AGENT */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                2. Formation State & Registered Agent
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Most small businesses should register in their home state where they physically operate. Delaware or Wyoming are popular for out-of-state entities and venture funding.
              </p>
            </div>

            {/* State Selection Dropdown & Live Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Formation State <span className="text-rose-400">*</span>
                </label>
                <select
                  value={llcData.formationState}
                  onChange={(e) => updateLLCData({ formationState: e.target.value as UsStateCode })}
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {Object.values(STATES_DATA).map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.code}) - ${s.filingFee} State Fee
                    </option>
                  ))}
                </select>

                <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Statutory State Fee:</span>
                    <span className="font-semibold text-white font-mono">${selectedStateInfo.filingFee}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Online Processing:</span>
                    <span className="font-semibold text-emerald-400">{selectedStateInfo.processingTimeDays}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Annual Report Fee:</span>
                    <span className="font-semibold text-white font-mono">${selectedStateInfo.annualReportFee}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">State Corporate Tax:</span>
                    <span className="font-semibold text-slate-300">{selectedStateInfo.corporateTaxRate}</span>
                  </div>
                </div>
              </div>

              {/* State Details & Publication Warnings */}
              <div className="md:col-span-2 space-y-3">
                <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{selectedStateInfo.name} Filing Overview</span>
                      {selectedStateInfo.popularForNonResidents && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Non-Resident Favorite
                        </span>
                      )}
                    </h3>
                    <a
                      href={selectedStateInfo.statePortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      <span>SOS Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedStateInfo.franchiseTaxNotes}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    <strong className="text-slate-300">Annual Report Due:</strong> {selectedStateInfo.annualReportDue}
                  </p>
                </div>

                {selectedStateInfo.publicationRequired && (
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Mandatory Newspaper Publication Alert ({selectedStateInfo.code})
                      </h4>
                      <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                        {selectedStateInfo.publicationNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registered Agent Section */}
            <div className="pt-4 border-t border-slate-700/60">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Registered Agent in {selectedStateInfo.name}</h3>
                  <p className="text-xs text-slate-400">
                    A registered agent is required by law to receive legal process (service of process) during business hours.
                  </p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => updateLLCData({ agentType: 'self' })}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      llcData.agentType === 'self'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Act as Own Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => updateLLCData({ agentType: 'commercial' })}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      llcData.agentType === 'commercial'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Commercial Agent Service
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Registered Agent Full Name / Entity
                  </label>
                  <input
                    type="text"
                    value={llcData.agentName}
                    onChange={(e) => updateLLCData({ agentName: e.target.value })}
                    placeholder="Full individual name or Registered Agent company"
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Physical Street Address (No P.O. Boxes allowed by law)
                  </label>
                  <input
                    type="text"
                    value={llcData.agentAddress}
                    onChange={(e) => updateLLCData({ agentAddress: e.target.value })}
                    placeholder="e.g. 100 Congress Avenue, Suite 200"
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 md:col-span-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">City</label>
                    <input
                      type="text"
                      value={llcData.agentCity}
                      onChange={(e) => updateLLCData({ agentCity: e.target.value })}
                      placeholder="Austin"
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">State</label>
                    <input
                      type="text"
                      value={llcData.agentState}
                      onChange={(e) => updateLLCData({ agentState: e.target.value as UsStateCode })}
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      value={llcData.agentZip}
                      onChange={(e) => updateLLCData({ agentZip: e.target.value })}
                      placeholder="78701"
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: MANAGEMENT & OWNERSHIP */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                3. Management Structure & Members
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Specify who has the authority to make day-to-day decisions and the equity split among founding members.
              </p>
            </div>

            {/* Management Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateLLCData({ managementType: 'member-managed' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  llcData.managementType === 'member-managed'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">Member-Managed</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    Most Popular (90%+)
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All owners (members) participate directly in the management of the LLC. Recommended for single-member LLCs and small co-founder teams.
                </p>
              </button>

              <button
                type="button"
                onClick={() => updateLLCData({ managementType: 'manager-managed' })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  llcData.managementType === 'manager-managed'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-white">Manager-Managed</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    Passive Investors
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Members appoint designated managers (who can be non-owners) to run operations. Ideal if some investors are strictly passive.
                </p>
              </button>
            </div>

            {/* Members List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Founders & Members ({llcData.members.length})</h3>
                  <div className="text-xs text-slate-400">
                    Ownership Allocated: <span className={`font-mono font-bold ${isOwnershipBalanced ? 'text-emerald-400' : 'text-amber-400'}`}>{totalOwnership}%</span> of 100%
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addMember}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Co-Founder / Member</span>
                </button>
              </div>

              {!isOwnershipBalanced && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>The sum of all member ownership percentages must equal exactly 100% (currently {totalOwnership}%).</span>
                </div>
              )}

              {llcData.members.map((member, index) => (
                <div
                  key={member.id}
                  className="p-4 bg-slate-900/70 border border-slate-700/80 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      MEMBER 0{index + 1}
                    </span>
                    {llcData.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Full Legal Name
                      </label>
                      <input
                        type="text"
                        value={member.fullName}
                        onChange={(e) => updateMember(member.id, { fullName: e.target.value })}
                        placeholder="Founder Full Name"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Corporate Title
                      </label>
                      <input
                        type="text"
                        value={member.title}
                        onChange={(e) => updateMember(member.id, { title: e.target.value })}
                        placeholder="Managing Member, CEO, Member"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Equity %
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={member.ownershipPercentage}
                          onChange={(e) => updateMember(member.id, { ownershipPercentage: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Initial Capital ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={member.initialContribution}
                          onChange={(e) => updateMember(member.id, { initialContribution: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: ADDRESS & EIN DETAILS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                4. Principal Office & IRS EIN Information
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your company address and the responsible party information required by the IRS for your Employer Identification Number (EIN).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Principal Executive Office Street Address
                </label>
                <input
                  type="text"
                  value={llcData.officeStreet}
                  onChange={(e) => updateLLCData({ officeStreet: e.target.value })}
                  placeholder="e.g. 701 Brazos Street, Suite 500"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 md:col-span-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">City</label>
                  <input
                    type="text"
                    value={llcData.officeCity}
                    onChange={(e) => updateLLCData({ officeCity: e.target.value })}
                    placeholder="Austin"
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">State</label>
                  <input
                    type="text"
                    value={llcData.officeState}
                    onChange={(e) => updateLLCData({ officeState: e.target.value as UsStateCode })}
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Zip Code</label>
                  <input
                    type="text"
                    value={llcData.officeZip}
                    onChange={(e) => updateLLCData({ officeZip: e.target.value })}
                    placeholder="78701"
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* IRS EIN Specific Data */}
            <div className="p-4 bg-slate-900/80 border border-slate-700 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>IRS Form SS-4 Pre-Filing Details</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    IRS Responsible Party Full Name
                  </label>
                  <input
                    type="text"
                    value={llcData.responsiblePartyName}
                    onChange={(e) => updateLLCData({ responsiblePartyName: e.target.value })}
                    placeholder="Managing Founder Name"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    SSN / ITIN (Last 4 Digits for Worksheet)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={llcData.responsiblePartySSN_Last4}
                    onChange={(e) => updateLLCData({ responsiblePartySSN_Last4: e.target.value })}
                    placeholder="4821"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Privacy Note: Stored strictly in local browser memory.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Anticipated Employees in Next 12 Months
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={llcData.estimatedEmployees12Mo}
                    onChange={(e) => updateLLCData({ estimatedEmployees12Mo: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Closing Month of Accounting Year
                  </label>
                  <select
                    value={llcData.fiscalYearEndMonth}
                    onChange={(e) => updateLLCData({ fiscalYearEndMonth: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="December">December (Standard Calendar Year)</option>
                    <option value="January">January</option>
                    <option value="June">June</option>
                    <option value="September">September</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & GENERATE */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                5. Review Formation Profile & Automated Paperwork
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Your formation documents are compiled and ready for execution and state filing.
              </p>
            </div>

            {/* Entity Summary Card */}
            <div className="bg-slate-900/90 border border-slate-700 rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Entity Name</span>
                  <div className="text-lg font-extrabold text-white">
                    {llcData.businessName} {llcData.suffix}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Filing State</span>
                  <div className="text-sm font-bold text-emerald-400">
                    {selectedStateInfo.name} ({selectedStateInfo.code})
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Management:</span>
                  <span className="font-semibold text-slate-200 capitalize">{llcData.managementType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Filing Fee:</span>
                  <span className="font-semibold text-emerald-400 font-mono">${selectedStateInfo.filingFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Members:</span>
                  <span className="font-semibold text-slate-200">{llcData.members.length} Founding Member(s)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Registered Agent:</span>
                  <span className="font-semibold text-slate-200 truncate block">{llcData.agentName}</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-300">
                <span className="text-slate-400">Executive Office: </span>
                <span>{llcData.officeStreet}, {llcData.officeCity}, {llcData.officeState} {llcData.officeZip}</span>
              </div>
            </div>

            {/* Generated Documents Ready Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/60 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>Articles of Organization</span>
                </div>
                <p className="text-xs text-slate-300">
                  Pre-filled legal charter formatted for submission to the {selectedStateInfo.portalName}.
                </p>
                <button
                  onClick={() => onGoToTab('documents')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium pt-1 block"
                >
                  View & Print Articles →
                </button>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <FileText className="w-4 h-4" />
                  <span>LLC Operating Agreement</span>
                </div>
                <p className="text-xs text-slate-300">
                  Comprehensive 9-section governance agreement covering capital, profit shares, and limited liability protection.
                </p>
                <button
                  onClick={() => onGoToTab('documents')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium pt-1 block"
                >
                  Inspect Operating Agreement →
                </button>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>IRS Form SS-4 Packet</span>
                </div>
                <p className="text-xs text-slate-300">
                  Exact answers to every single IRS online interview question to get your free EIN in 5 minutes.
                </p>
                <button
                  onClick={() => onGoToTab('ein')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium pt-1 block"
                >
                  Open EIN Assistant →
                </button>
              </div>
            </div>

            {/* Official State Filing Portal Button */}
            <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold">
                  STEP 1: OFFICIAL STATE E-FILING
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  File directly with {selectedStateInfo.portalName}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Do not pay $300 middleman fees. Copy your generated Articles of Organization into the official state registry.
                </p>
              </div>
              <a
                href={selectedStateInfo.statePortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all shrink-0 cursor-pointer"
              >
                <span>Open {selectedStateInfo.code} SOS Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-700/60">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : 'bg-slate-700/80 hover:bg-slate-700 text-white'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-slate-400 font-mono">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onGoToTab('documents')}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>View Formation Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
