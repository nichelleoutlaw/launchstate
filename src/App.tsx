import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FormationWizard } from './components/FormationWizard';
import { DocumentGenerator } from './components/DocumentGenerator';
import { EinAssistant } from './components/EinAssistant';
import { ComplianceTracker } from './components/ComplianceTracker';
import { FundingFinder } from './components/FundingFinder';
import { LoanMatcher } from './components/LoanMatcher';
import { DigitalPresenceHub } from './components/DigitalPresenceHub';
import { StateFilingDirectory } from './components/StateFilingDirectory';
import { FormationChecklist } from './components/FormationChecklist';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { LegalDisclaimerModal } from './components/LegalDisclaimerModal';
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
import { Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [llcData, setLlcData] = useState<LLCFormData>(loadSavedLLCData);
  const [stepState, setStepState] = useState<FormationStepState>(loadSavedStepState);
  const [activeTab, setActiveTab] = useState<string>('formation');
  const [advisorOpen, setAdvisorOpen] = useState<boolean>(false);
  const [advisorInitialPrompt, setAdvisorInitialPrompt] = useState<string>('');
  const [disclaimerOpen, setDisclaimerOpen] = useState<boolean>(false);

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

  // Persist step completion changes
  const updateStepState = (key: keyof FormationStepState, value: boolean) => {
    setStepState((prev) => {
      const next = { ...prev, [key]: value };
      saveStepState(next);
      return next;
    });
  };

  const handleOpenAdvisor = (prompt?: string) => {
    if (prompt) {
      setAdvisorInitialPrompt(prompt);
    } else {
      setAdvisorInitialPrompt('');
    }
    setAdvisorOpen(true);
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
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        llcData={llcData}
        stepState={stepState}
        onOpenAdvisor={() => handleOpenAdvisor()}
        onExportAll={handleExportAll}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Tab View */}
        {activeTab === 'formation' && (
          <div className="space-y-8">
            <FormationWizard
              llcData={llcData}
              updateLLCData={updateLLCData}
              onGenerateDocs={() => setActiveTab('documents')}
              onGoToTab={(tabId) => setActiveTab(tabId)}
              onOpenAdvisorWithPrompt={handleOpenAdvisor}
            />

            <FormationChecklist
              llcData={llcData}
              stepState={stepState}
              updateStepState={updateStepState}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
            />
          </div>
        )}

        {activeTab === 'documents' && (
          <DocumentGenerator
            llcData={llcData}
            onGoToEin={() => setActiveTab('ein')}
            onOpenAdvisorWithPrompt={handleOpenAdvisor}
            onOpenDisclaimerModal={() => setDisclaimerOpen(true)}
          />
        )}

        {activeTab === 'ein' && (
          <EinAssistant
            llcData={llcData}
            updateLLCData={updateLLCData}
            onOpenAdvisorWithPrompt={handleOpenAdvisor}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceTracker
            llcData={llcData}
            onOpenAdvisorWithPrompt={handleOpenAdvisor}
            userEmail="xMsOutlawx@gmail.com"
          />
        )}

        {activeTab === 'funding' && (
          <FundingFinder
            llcData={llcData}
            onOpenAdvisorWithPrompt={handleOpenAdvisor}
          />
        )}

        {activeTab === 'loans' && (
          <LoanMatcher
            llcData={llcData}
            onOpenAdvisorWithPrompt={handleOpenAdvisor}
          />
        )}

        {activeTab === 'digital-identity' && (
          <DigitalPresenceHub
            llcData={llcData}
            onOpenAdvisorWithPrompt={handleOpenAdvisor}
          />
        )}

        {activeTab === 'state-directory' && (
          <StateFilingDirectory
            selectedState={llcData.formationState}
            onSelectState={(st: UsStateCode) => {
              updateLLCData({ formationState: st });
              setActiveTab('formation');
            }}
          />
        )}
      </main>

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
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Disclaimer Verified ({llcData.legalAcknowledgment.signedName})</span>
              </button>
            ) : (
              <button
                onClick={() => setDisclaimerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-medium hover:bg-amber-500/25 transition-colors"
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
            <span className="font-bold text-slate-400">LaunchState LLC & Funding Engine</span>
            <span>·</span>
            <span>Automated Articles of Organization, Form SS-4 EIN & Capital Hub</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right flex items-center gap-3">
            <button
              onClick={() => setDisclaimerOpen(true)}
              className="text-slate-400 hover:text-white underline transition-colors"
            >
              Legal Terms & Disclaimers
            </button>
            <span>·</span>
            <span>Official 50-State SOS Direct Connections</span>
          </div>
        </div>
      </footer>

      {/* AI Advisor Modal */}
      <AiAdvisorModal
        isOpen={advisorOpen}
        onClose={() => setAdvisorOpen(false)}
        llcData={llcData}
        initialPrompt={advisorInitialPrompt}
      />

      {/* Legal Disclaimer & Self-Help Agreement Modal */}
      <LegalDisclaimerModal
        isOpen={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        llcData={llcData}
        onSaveAcknowledgment={handleSaveAcknowledgment}
      />
    </div>
  );
}
