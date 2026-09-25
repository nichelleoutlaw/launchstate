import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Download, 
  Printer, 
  Check, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Scale, 
  PlusCircle, 
  HelpCircle, 
  Lock, 
  PenTool, 
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { LLCFormData } from '../types';
import { STATES_DATA } from '../data/statesData';
import { 
  generateArticlesOfOrganization, 
  generateOperatingAgreement, 
  generateFormSS4Packet, 
  generateInitialResolutions,
  generateDisclaimerAcknowledgment
} from '../utils/documentTemplates';

interface DocumentGeneratorProps {
  llcData: LLCFormData;
  onGoToEin: () => void;
  onOpenAdvisorWithPrompt: (prompt: string) => void;
  onOpenDisclaimerModal: () => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  llcData,
  onGoToEin,
  onOpenAdvisorWithPrompt,
  onOpenDisclaimerModal,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<'articles' | 'operating' | 'ss4' | 'resolutions' | 'disclaimer'>('articles');
  const [copied, setCopied] = useState<boolean>(false);
  const [customClauses, setCustomClauses] = useState<{ title: string; text: string }[]>([]);
  const [isDraftingClause, setIsDraftingClause] = useState<boolean>(false);
  const [clauseModalOpen, setClauseModalOpen] = useState<boolean>(false);
  const [clauseType, setClauseType] = useState<string>('Intellectual Property Assignment');
  const [clauseInstruction, setClauseInstruction] = useState<string>('');

  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];
  const ack = llcData.legalAcknowledgment;

  // Paperwork completion analysis
  const docStatuses = [
    {
      id: 'articles' as const,
      num: 1,
      title: 'Articles of Organization',
      shortTitle: 'Articles',
      formNumber: `State Form (${stateInfo.code})`,
      purpose: 'Official legal charter filed with the Secretary of State to establish corporate existence.',
      statutoryAuthority: stateInfo.portalName,
      isReady: Boolean(llcData.businessName && llcData.formationState && llcData.agentName && llcData.officeStreet),
      missingReason: !llcData.agentName ? 'Requires Registered Agent Name' : !llcData.officeStreet ? 'Requires Principal Office Address' : '',
      icon: FileText,
      badgeText: 'State Charter',
    },
    {
      id: 'operating' as const,
      num: 2,
      title: 'LLC Operating Agreement',
      shortTitle: 'Operating Agreement',
      formNumber: `${llcData.members.length}-Member Contract`,
      purpose: 'Internal governing contract establishing member voting rights, capital allocations, and asset protection.',
      statutoryAuthority: 'Internal Company Records',
      isReady: Boolean(llcData.members && llcData.members.length > 0 && llcData.businessName),
      missingReason: llcData.members.length === 0 ? 'Requires At Least 1 Founding Member' : '',
      icon: Scale,
      badgeText: `${llcData.managementType === 'manager-managed' ? 'Manager' : 'Member'}-Managed`,
    },
    {
      id: 'ss4' as const,
      num: 3,
      title: 'IRS Form SS-4 (EIN Worksheet)',
      shortTitle: 'Form SS-4 / EIN',
      formNumber: 'Treasury Form SS-4',
      purpose: 'Pre-filing packet providing exact answers for the official IRS.gov federal tax ID application.',
      statutoryAuthority: 'Internal Revenue Service',
      isReady: Boolean(llcData.responsiblePartyName && llcData.responsiblePartySSN_Last4),
      missingReason: !llcData.responsiblePartyName ? 'Requires IRS Responsible Party Name' : '',
      icon: ShieldCheck,
      badgeText: 'Federal Tax ID',
    },
    {
      id: 'resolutions' as const,
      num: 4,
      title: 'Initial Written Consent & Resolutions',
      shortTitle: 'Resolutions',
      formNumber: 'Unanimous Consent',
      purpose: 'Formal resolutions adopting the operating agreement and authorizing commercial bank accounts.',
      statutoryAuthority: 'Corporate Banking Records',
      isReady: Boolean(llcData.businessName && llcData.members.length > 0),
      missingReason: '',
      icon: Check,
      badgeText: 'Banking Authority',
    },
    {
      id: 'disclaimer' as const,
      num: 5,
      title: 'Self-Help Legal & Pro Se Acknowledgment',
      shortTitle: 'Disclaimer & Signature',
      formNumber: 'Legal Acknowledgment',
      purpose: 'Statutory non-attorney disclosure and founder pro se self-representation agreement.',
      statutoryAuthority: 'Mandatory UPL Shield',
      isReady: Boolean(ack?.isSigned),
      missingReason: !ack?.isSigned ? 'Requires Founder Digital Signature' : '',
      icon: Lock,
      badgeText: ack?.isSigned ? 'Verified Signature' : 'Signature Required',
    },
  ];

  const completedCount = docStatuses.filter((d) => d.isReady).length;
  const totalCount = docStatuses.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const pendingDocs = docStatuses.filter((d) => !d.isReady);

  // Generate base texts
  let docContent = '';
  let docTitle = '';
  let docFileName = '';

  if (selectedDoc === 'articles') {
    docContent = generateArticlesOfOrganization(llcData);
    docTitle = `Articles of Organization (${stateInfo.name})`;
    docFileName = `${llcData.businessName.replace(/\s+/g, '_')}_Articles_of_Organization_${stateInfo.code}.txt`;
  } else if (selectedDoc === 'operating') {
    docContent = generateOperatingAgreement(llcData);
    if (customClauses.length > 0) {
      docContent += '\n\n' + customClauses.map((c) => `=== SPECIAL AMENDMENT CLAUSE: ${c.title.toUpperCase()} ===\n${c.text}\n`).join('\n');
    }
    docTitle = 'LLC Operating Agreement';
    docFileName = `${llcData.businessName.replace(/\s+/g, '_')}_Operating_Agreement.txt`;
  } else if (selectedDoc === 'ss4') {
    docContent = generateFormSS4Packet(llcData);
    docTitle = 'IRS Form SS-4 Application Worksheet';
    docFileName = `${llcData.businessName.replace(/\s+/g, '_')}_Form_SS4_Packet.txt`;
  } else if (selectedDoc === 'disclaimer') {
    docContent = generateDisclaimerAcknowledgment(llcData);
    docTitle = 'Self-Help Legal Services & Pro Se Acknowledgment';
    docFileName = `${llcData.businessName.replace(/\s+/g, '_')}_Legal_Disclaimer_Acknowledgment.txt`;
  } else {
    docContent = generateInitialResolutions(llcData);
    docTitle = 'Organizer & Member Initial Written Consent';
    docFileName = `${llcData.businessName.replace(/\s+/g, '_')}_Initial_Resolutions.txt`;
  }

  // Copy handler
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(docContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Download handler
  const handleDownload = () => {
    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = docFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print handler
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback to window.print if popup blocked
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docTitle} - ${llcData.businessName}</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              line-height: 1.6;
              padding: 40px;
              color: #111;
              max-width: 800px;
              margin: 0 auto;
            }
            pre {
              white-space: pre-wrap;
              font-family: 'Times New Roman', Times, serif;
              font-size: 13pt;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <pre>${docContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  // AI Clause Drafter
  const handleDraftAiClause = async () => {
    setIsDraftingClause(true);
    try {
      const res = await fetch('/api/ai/draft-clauses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: `${llcData.businessName} ${llcData.suffix}`,
          state: stateInfo.name,
          industry: llcData.industry,
          clauseType,
          customRequirement: clauseInstruction,
        }),
      });
      const data = await res.json();
      if (data.clauseText) {
        setCustomClauses((prev) => [
          ...prev,
          {
            title: data.clauseTitle || clauseType,
            text: data.clauseText,
          },
        ]);
        setClauseModalOpen(false);
        setClauseInstruction('');
      }
    } catch (e) {
      console.error('Failed to draft clause', e);
    } finally {
      setIsDraftingClause(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span>AUTOMATED LEGAL ENGINE</span>
            <span>·</span>
            <span>50-STATE COMPLIANT</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Generated Formation Documents
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Custom-drafted legal documents tailored to {llcData.businessName || 'Your Business'} {llcData.suffix} under the laws of {stateInfo.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={stateInfo.statePortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-colors"
          >
            <span>File in {stateInfo.code}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* LLC Paperwork Generation Progress Indicator */}
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Formation Paperwork Completion Progress
              </h2>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                completedCount === totalCount
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {completedCount === totalCount ? '100% COMPLETE' : `${completedCount} OF ${totalCount} READY`}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {completedCount === totalCount
                ? `All 5 foundational legal documents are fully generated and ready for ${stateInfo.name} filing.`
                : `${completedCount} document(s) generated. ${pendingDocs.length} pending generation or signature before final state upload.`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
            <div className="text-right">
              <span className="text-xl font-mono font-extrabold text-emerald-400">{progressPercent}%</span>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Generated</span>
            </div>
            <div className="w-24 sm:w-32 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/60">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step-by-Step Document Status Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
          {docStatuses.map((doc) => {
            const Icon = doc.icon;
            const isSelected = selectedDoc === doc.id;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => {
                  setSelectedDoc(doc.id);
                  if (doc.id === 'disclaimer' && !doc.isReady) {
                    onOpenDisclaimerModal();
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-emerald-500/70 shadow-md ring-1 ring-emerald-500/30'
                    : doc.isReady
                    ? 'bg-slate-900/60 border-slate-700/70 hover:bg-slate-900 hover:border-slate-600'
                    : 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      DOC 0{doc.num}
                    </span>
                    {doc.isReady ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse" title={doc.missingReason}>
                        <AlertCircle className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {doc.shortTitle}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                    {doc.badgeText}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className={doc.isReady ? 'text-emerald-400 font-medium' : 'text-amber-400 font-semibold'}>
                    {doc.isReady ? 'Generated' : 'Pending'}
                  </span>
                  <span className="text-slate-500 group-hover:text-slate-300 transition-colors">
                    Inspect →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pending Documents Callout Notice if any */}
        {pendingDocs.length > 0 && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Pending Paperwork Action: </strong>
                {pendingDocs.map((p) => `${p.title} (${p.missingReason || 'Missing details'})`).join(' · ')}
              </div>
            </div>

            {pendingDocs.some((p) => p.id === 'disclaimer') && (
              <button
                type="button"
                onClick={onOpenDisclaimerModal}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shrink-0 self-start sm:self-auto transition-colors cursor-pointer"
              >
                Sign Acknowledgment Now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Document Selection Tabs & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/70">
        {/* Document Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedDoc('articles')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedDoc === 'articles'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Articles of Organization</span>
          </button>

          <button
            onClick={() => setSelectedDoc('operating')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedDoc === 'operating'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Operating Agreement</span>
            {customClauses.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-900 text-emerald-300 text-[10px] flex items-center justify-center font-mono">
                +{customClauses.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedDoc('ss4')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedDoc === 'ss4'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Form SS-4 (EIN Worksheet)</span>
          </button>

          <button
            onClick={() => setSelectedDoc('resolutions')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedDoc === 'resolutions'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Initial Resolutions</span>
          </button>

          <button
            onClick={() => setSelectedDoc('disclaimer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedDoc === 'disclaimer'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Self-Help & Disclaimer</span>
            {ack?.isSigned ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {selectedDoc === 'disclaimer' && (
            <button
              onClick={onOpenDisclaimerModal}
              className="px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              <span>{ack?.isSigned ? 'Re-Sign / View Certificate' : 'Sign Acknowledgment'}</span>
            </button>
          )}

          {selectedDoc === 'operating' && (
            <button
              onClick={() => setClauseModalOpen(true)}
              className="px-2.5 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-1 transition-colors"
              title="Add custom AI legal clause"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Add AI Clause</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-700/80 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            title="Copy text to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-700/80 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            title="Download document text"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-700/80 hover:bg-slate-700 rounded-lg flex items-center gap-1 transition-colors"
            title="Print document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Document Information Banner */}
      <div className="p-3.5 bg-slate-800/40 border border-slate-700/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-white">{docTitle}</span>
          <span>·</span>
          <span className="text-slate-400">Statutory Governing State: {stateInfo.name}</span>
        </div>
        {selectedDoc === 'articles' && (
          <span className="text-emerald-400 font-mono text-[11px]">
            Ready for {stateInfo.code} Secretary of State upload
          </span>
        )}
        {selectedDoc === 'ss4' && (
          <button
            onClick={onGoToEin}
            className="text-emerald-400 hover:text-emerald-300 font-medium text-left"
          >
            Launch IRS Online Guide →
          </button>
        )}
        {selectedDoc === 'disclaimer' && (
          <div className="flex items-center gap-2">
            {ack?.isSigned ? (
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Digitally Signed ({ack.verificationHash})</span>
              </span>
            ) : (
              <span className="text-amber-400 font-mono text-[11px] flex items-center gap-1">
                <span>Pending Digital Execution</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Document Preview Paper Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
        <div className="max-w-4xl mx-auto font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/30 selection:text-emerald-200">
          {docContent}
        </div>
      </div>

      {/* AI Clause Drafter Modal */}
      {clauseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Draft Custom Operating Agreement Clause
              </h3>
              <button
                onClick={() => setClauseModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select a standard protective legal clause or provide custom requirements for Gemini to draft compliant contractual language under {stateInfo.name} law.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Clause Type
              </label>
              <select
                value={clauseType}
                onChange={(e) => setClauseType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Intellectual Property Assignment">Intellectual Property Assignment & Confidentiality</option>
                <option value="Founder Equity Vesting Schedule">Founder Equity 4-Year Vesting Schedule (1-year cliff)</option>
                <option value="Buy-Sell Agreement & Right of First Refusal">Buy-Sell Trigger / Deadlock Resolution</option>
                <option value="Non-Compete and Non-Solicitation">Non-Compete & Non-Solicitation of Clients</option>
                <option value="Capital Call Obligations & Dilution">Capital Call Defaults & Member Dilution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Special Instructions (Optional)
              </label>
              <textarea
                rows={3}
                value={clauseInstruction}
                onChange={(e) => setClauseInstruction(e.target.value)}
                placeholder="e.g. Include specific 48-month monthly vesting with single-trigger acceleration upon company sale."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setClauseModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDraftingClause}
                onClick={handleDraftAiClause}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isDraftingClause ? 'Drafting Clause...' : 'Generate & Append Clause'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
