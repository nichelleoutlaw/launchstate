import React, { useState } from 'react';
import { Navbar, MilestoneStep, SubTabId } from './components/Navbar';
import { FormationWizard } from './components/FormationWizard';
import { DocumentGenerator } from './components/DocumentGenerator';
import { BrandKit } from './components/BrandKit';
import { DigitalPresenceHub } from './components/DigitalPresenceHub';
import { DnsAdvisor } from './components/DnsAdvisor';
import { FundingFinder } from './components/FundingFinder';
import { BankResolutions } from './components/BankResolutions';
import { EinAssistant } from './components/EinAssistant';
import { StateFilingDirectory } from './components/StateFilingDirectory';
import { SideChecklist } from './components/SideChecklist';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
import { DocumentPreview, PreviewDocType } from './components/DocumentPreview';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { LandingPage } from './components/LandingPage';
import { LLCFormData, FormationStepState, UsStateCode, LegalAcknowledgment } from './types';
import { 
  loadSavedLLCData, 
  saveLLCData, 
  loadSavedStepState, 
  saveStepState 
} from './utils/storage';
import { 
  generateArticlesOfOrganization, 
  generateOperatingAgreement, 
  generateFormSS4Packet, 
  generateInitialResolutions,
  generateDisclaimerAcknowledgment
} from './utils/documentTemplates';
import { STATES_DATA } from './data/statesData';
import { Scale, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [llcData, setLlcData] = useState<LLCFormData>(loadSavedLLCData);
  const [stepState, setStepState] = useState<FormationStepState>(loadSavedStepState);
  
  // 3 Clear Milestone Steps Navigation + Main Overview Landing Page
  const [activeMilestone, setActiveMilestone] = useState<MilestoneStep>('overview');
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('overview-main');
  const [sideChecklistOpen, setSideChecklistOpen] = useState<boolean>(true);

  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewInitialDoc, setPreviewInitialDoc] = useState<PreviewDocType>('binder');
  const [aiAdvisorOpen, setAiAdvisorOpen] = useState<boolean>(false);

  // Persist LLC state changes
  const updateLLCData = (updates: Partial<LLCFormData>) => {
    setLlcData((prev) => {
      const next = { ...prev, ...updates };
      saveLLCData(next);
      return next;
    });
  };

  const handleSaveAcknowledgment = (ack: LegalAcknowledgment) => {
    updateLLCData({ legalAcknowledgment: ack });
  };

  // Open live read-only document preview modal
  const handleOpenPreview = (doc: PreviewDocType = 'binder') => {
    setPreviewInitialDoc(doc);
    setPreviewOpen(true);
  };

  // Persist step completion changes
  const updateStepState = (key: keyof FormationStepState, value: boolean) => {
    setStepState((prev) => {
      const next = { ...prev, [key]: value };
      saveStepState(next);
      return next;
    });
  };

  // Helper to switch view and ensure milestone matches
  const navigateTo = (milestone: MilestoneStep, subTab: SubTabId) => {
    setActiveMilestone(milestone);
    setActiveSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Full Formation Binder Exporter
  const handleExportAll = () => {
    // If user hasn't signed the legal disclaimer acknowledgment, prompt them to sign
    if (!llcData.legalAcknowledgment?.isSigned) {
      setDisclaimerOpen(true);
      return;
    }

    const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];
    const separator = '\n' + '='.repeat(80) + '\n';
    const banner = `LAUNCHSTATE COMPLETE LLC FORMATION & CAPITAL BINDER
Entity Name: ${llcData.businessName} ${llcData.suffix}
Governing State: ${stateInfo.name} (${stateInfo.code})
Date Compiled: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Principal Office: ${llcData.officeStreet}, ${llcData.officeCity}, ${llcData.officeState} ${llcData.officeZip}
Official State Filing Portal: ${stateInfo.statePortalUrl}
${separator}`;

    const articles = generateArticlesOfOrganization(llcData);
    const operating = generateOperatingAgreement(llcData);
    const ss4 = generateFormSS4Packet(llcData);
    const resolutions = generateInitialResolutions(llcData);
    const disclaimer = generateDisclaimerAcknowledgment(llcData);

    const fullBinder = `${banner}
DOCUMENT 01: ARTICLES OF ORGANIZATION / CERTIFICATE OF FORMATION
${separator}
${articles}
${separator}
DOCUMENT 02: LIMITED LIABILITY COMPANY OPERATING AGREEMENT
${separator}
${operating}
${separator}
DOCUMENT 03: IRS FORM SS-4 APPLICATION PRE-FILING AUDIT WORKSHEET
${separator}
${ss4}
${separator}
DOCUMENT 04: ACTION BY UNANIMOUS WRITTEN CONSENT OF ORGANIZER & MEMBERS
${separator}
${resolutions}
${separator}
DOCUMENT 05: ACKNOWLEDGMENT OF SELF-HELP LEGAL SERVICES & PRO SE REPRESENTATION
${separator}
${disclaimer}
${separator}
STATE FILING CHECKLIST & NEXT STEPS:
1. Log in to ${stateInfo.portalName} at: ${stateInfo.statePortalUrl}
2. Upload or paste Document 01 (Articles of Organization) and pay the state filing fee ($${stateInfo.filingFee}).
3. Upon state approval, open https://www.irs.gov/ to obtain your official EIN using Document 03.
4. Sign Document 02 (Operating Agreement) and Document 04 (Resolutions) with all founders.
5. Retain signed Document 05 (Disclaimer Acknowledgment) in your permanent company records.
6. Bring these documents to Mercury Bank, Relay Financial, or your local bank to open a dedicated commercial checking account.
`;

    const blob = new Blob([fullBinder], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${llcData.businessName.replace(/\s+/g, '_')}_Complete_LLC_Formation_Binder.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Stepper Navigation (3 Clear Milestone Steps) */}
      <Navbar
        activeMilestone={activeMilestone}
        setActiveMilestone={setActiveMilestone}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        llcData={llcData}
        stepState={stepState}
        onExportAll={() => handleOpenPreview('binder')}
        sideChecklistOpen={sideChecklistOpen}
        onToggleSideChecklist={() => setSideChecklistOpen(!sideChecklistOpen)}
        onOpenAiAdvisor={() => setAiAdvisorOpen(true)}
        onGoToOverview={() => navigateTo('overview', 'overview-main')}
      />

      {/* Main Content Layout with Persistent Side Checklist */}
      <div className="flex-1 flex w-full relative">
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-w-0">
          
          {/* ==================================================================== */}
          {/* MAIN PAGE: OVERVIEW, LIMITATIONS & ADVISORIES                       */}
          {/* ==================================================================== */}
          {activeMilestone === 'overview' && (
            <LandingPage
              llcData={llcData}
              onStartStep1={() => navigateTo('step1-legal', 'entity-setup')}
              onOpenAiAdvisor={() => setAiAdvisorOpen(true)}
              onOpenDisclaimerModal={() => setDisclaimerOpen(true)}
            />
          )}

          {/* ==================================================================== */}
          {/* STEP 1: LEGAL FOUNDATION (Entity Setup & Documents)                 */}
          {/* ==================================================================== */}
          {activeSubTab === 'entity-setup' && (
            <div className="space-y-8">
              <FormationWizard
                llcData={llcData}
                updateLLCData={updateLLCData}
                onGenerateDocs={() => navigateTo('step1-legal', 'documents')}
                onGoToTab={(tabId) => {
                  if (tabId === 'documents') navigateTo('step1-legal', 'documents');
                  else navigateTo('step1-legal', 'entity-setup');
                }}
              />

              {/* 50-State Statutory Secretary of State Directory & Fee Matrix */}
              <StateFilingDirectory
                selectedState={llcData.formationState}
                onSelectState={(st: UsStateCode) => {
                  updateLLCData({ formationState: st });
                }}
              />
            </div>
          )}

          {activeSubTab === 'documents' && (
            <DocumentGenerator
              llcData={llcData}
              onGoToEin={() => navigateTo('step1-legal', 'documents')}
              onOpenDisclaimerModal={() => setDisclaimerOpen(true)}
              onOpenPreviewModal={handleOpenPreview}
            />
          )}

        {/* ==================================================================== */}
        {/* STEP 2: BRAND & IDENTITY (Brand Kit, Domain & Email, DNS Advisor)    */}
        {/* ==================================================================== */}
        {activeSubTab === 'brand-kit' && (
          <BrandKit
            llcData={llcData}
            updateLLCData={updateLLCData}
            onGoToDomainEmail={() => navigateTo('step2-brand', 'domain-email')}
            onGoToDnsAdvisor={() => navigateTo('step2-brand', 'dns-advisor')}
          />
        )}

        {activeSubTab === 'domain-email' && (
          <DigitalPresenceHub
            llcData={llcData}
            onGoToDnsAdvisor={() => navigateTo('step2-brand', 'dns-advisor')}
          />
        )}

        {activeSubTab === 'dns-advisor' && (
          <DnsAdvisor
            llcData={llcData}
            onGoToGrants={() => navigateTo('step3-capital', 'grants-engine')}
            onGoToBankResolutions={() => navigateTo('step3-capital', 'bank-resolutions')}
          />
        )}

        {/* ==================================================================== */}
        {/* STEP 3: CAPITAL & GROWTH (Grants Engine, Bank Resolutions)          */}
        {/* ==================================================================== */}
        {activeSubTab === 'grants-engine' && (
          <FundingFinder
            llcData={llcData}
            onGoToBankResolutions={() => navigateTo('step3-capital', 'bank-resolutions')}
          />
        )}

        {activeSubTab === 'bank-resolutions' && (
          <BankResolutions
            llcData={llcData}
            onGoToGrants={() => navigateTo('step3-capital', 'grants-engine')}
            onGoToDocuments={() => navigateTo('step1-legal', 'documents')}
          />
        )}
      </main>

      {/* Persistent Side Checklist Companion */}
      <SideChecklist
        llcData={llcData}
        stepState={stepState}
        updateStepState={updateStepState}
        onNavigate={navigateTo}
        isOpen={sideChecklistOpen}
        onToggle={() => setSideChecklistOpen(!sideChecklistOpen)}
      />
    </div>

      {/* Persistent Legal Notice & Disclaimer Banner */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 py-3.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2 text-slate-400">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>LEGAL NOTICE:</strong> LaunchState is an automated self-help platform and not a law firm or CPA. Communications are not privileged; users represent themselves (Pro Se).
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {llcData.legalAcknowledgment?.isSigned ? (
              <button
                onClick={() => setDisclaimerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Disclaimer Verified ({llcData.legalAcknowledgment.signedName})</span>
              </button>
            ) : (
              <button
                onClick={() => setDisclaimerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-medium hover:bg-amber-500/25 transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Review & Sign Disclaimer Acknowledgment</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-400">LaunchState LLC & Capital Engine</span>
            <span>·</span>
            <span>Automated Articles of Organization, Operating Agreements & Treasury Hub</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right flex items-center gap-3">
            <button
              onClick={() => setDisclaimerOpen(true)}
              className="text-slate-400 hover:text-white underline transition-colors cursor-pointer"
            >
              Legal Terms & Disclaimers
            </button>
            <span>·</span>
            <span>Official 50-State SOS Direct Connections</span>
          </div>
        </div>
      </footer>

      {/* Legal Disclaimer & Self-Help Agreement Modal */}
      <LegalDisclaimerModal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        llcData={llcData}
        onSaveAcknowledgment={handleSaveAcknowledgment}
      />

      {/* Pre-Export Live Read-Only Document Preview Modal */}
      <DocumentPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        llcData={llcData}
        initialDoc={previewInitialDoc}
        onConfirmExport={handleExportAll}
      />

      {/* Floating AI Advisor Action Button (Always Accessible) */}
      <button
        onClick={() => setAiAdvisorOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-full shadow-2xl shadow-emerald-950/80 flex items-center gap-2.5 border border-emerald-400/40 transition-all hover:scale-105 cursor-pointer group"
        title="Open Gemini AI Legal, Tax & Infrastructure Advisor"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <Sparkles className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
        <span>Gemini AI Advisor</span>
      </button>

      {/* Gemini AI Multi-Turn Business & Legal Advisor Modal */}
      <AiAdvisorModal
        isOpen={aiAdvisorOpen}
        onClose={() => setAiAdvisorOpen(false)}
        llcData={llcData}
      />
    </div>
  );
};
