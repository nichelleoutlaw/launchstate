import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Eye, 
  Download, 
  Copy, 
  Printer, 
  Check, 
  FileText, 
  Scale, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  Search, 
  ExternalLink,
  CheckCircle2,
  Building2,
  MapPin,
  Users,
  Shield,
  Maximize2,
  Minimize2
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

export type PreviewDocType = 'articles' | 'operating' | 'ss4' | 'resolutions' | 'disclaimer' | 'binder';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  llcData: LLCFormData;
  onConfirmExport: () => void;
  initialDoc?: PreviewDocType;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isOpen,
  onClose,
  llcData,
  onConfirmExport,
  initialDoc = 'articles',
}) => {
  const [activeDoc, setActiveDoc] = useState<PreviewDocType>(initialDoc);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('sm');
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(false);
  const [verifiedDetails, setVerifiedDetails] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  useEffect(() => {
    if (initialDoc && isOpen) {
      setActiveDoc(initialDoc);
    }
  }, [initialDoc, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build document contents
  const docContents = useMemo(() => {
    const articles = generateArticlesOfOrganization(llcData);
    const operating = generateOperatingAgreement(llcData);
    const ss4 = generateFormSS4Packet(llcData);
    const resolutions = generateInitialResolutions(llcData);
    const disclaimer = generateDisclaimerAcknowledgment(llcData);

    const separator = '\n' + '='.repeat(80) + '\n';
    const banner = `LAUNCHSTATE COMPLETE LLC FORMATION & CAPITAL BINDER
Entity Name: ${llcData.businessName} ${llcData.suffix}
Governing State: ${stateInfo.name} (${stateInfo.code})
Date Compiled: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Principal Office: ${llcData.officeStreet}, ${llcData.officeCity}, ${llcData.officeState} ${llcData.officeZip}
Official State Filing Portal: ${stateInfo.statePortalUrl}
${separator}`;

    const binder = `${banner}
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
${separator}`;

    return {
      articles,
      operating,
      ss4,
      resolutions,
      disclaimer,
      binder,
    };
  }, [llcData, stateInfo]);

  if (!isOpen) return null;

  const currentContent = docContents[activeDoc];

  // Document labels and metadata
  const docMeta: Record<PreviewDocType, { title: string; subtitle: string; icon: React.ElementType; badge: string }> = {
    articles: {
      title: `Articles of Organization (${stateInfo.name})`,
      subtitle: `Statutory Charter for ${stateInfo.portalName}`,
      icon: FileText,
      badge: 'State Filing Charter',
    },
    operating: {
      title: 'LLC Operating Agreement',
      subtitle: `${llcData.members.length} Member(s) · ${llcData.managementType === 'manager-managed' ? 'Manager' : 'Member'}-Managed`,
      icon: Scale,
      badge: 'Internal Governance',
    },
    ss4: {
      title: 'IRS Form SS-4 (EIN Worksheet)',
      subtitle: 'Line-by-line pre-filing audit for IRS online portal',
      icon: ShieldCheck,
      badge: 'Federal Tax ID',
    },
    resolutions: {
      title: 'Initial Written Consent & Resolutions',
      subtitle: 'Corporate bank authorization & officer ratification',
      icon: Check,
      badge: 'Banking Authority',
    },
    disclaimer: {
      title: 'Self-Help Legal & Pro Se Acknowledgment',
      subtitle: llcData.legalAcknowledgment?.isSigned ? 'Digitally Executed & Verified' : 'Pending Founder Signature',
      icon: Lock,
      badge: 'Statutory Disclosure',
    },
    binder: {
      title: 'Complete LLC Formation & Capital Binder',
      subtitle: 'Master compiled document set with filing instructions',
      icon: Building2,
      badge: 'Complete Packet (All 5 Docs)',
    },
  };

  const currentMeta = docMeta[activeDoc];
  const CurrentIcon = currentMeta.icon;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${currentMeta.title} - ${llcData.businessName} ${llcData.suffix}</title>
            <style>
              body { font-family: monospace; white-space: pre-wrap; font-size: 11pt; line-height: 1.5; padding: 24px; color: #111; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>${currentContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  // Filter text or highlight lines if search query is provided
  const lines = currentContent.split('\n');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`bg-slate-900 border border-slate-700 rounded-2xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullScreen 
            ? 'w-full h-full rounded-none' 
            : 'max-w-6xl w-full h-[92vh]'
        }`}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-800/95 border-b border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  <span>Pre-Export Legal Document Preview</span>
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Read-Only Inspection
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify factual accuracy for <strong>{llcData.businessName} {llcData.suffix}</strong> before downloading or state submission.
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
              title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Preview'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
              title="Close Preview (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Summary Fact-Check Bar */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3 text-slate-300">
            <span className="text-slate-500 font-mono uppercase text-[10px] font-bold">Key Facts:</span>
            <div className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-white">{llcData.businessName} {llcData.suffix}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{stateInfo.name} (${stateInfo.filingFee} State Fee)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{llcData.members.length} Member(s)</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agent: {llcData.agentName || 'Self'}</span>
            </div>
          </div>

          {/* Quick confirmation checkbox */}
          <label className="flex items-center gap-2 text-[11px] cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={verifiedDetails}
              onChange={(e) => setVerifiedDetails(e.target.checked)}
              className="accent-emerald-500 rounded cursor-pointer"
            />
            <span>I have verified entity names & addresses</span>
          </label>
        </div>

        {/* Document Navigation Tabs */}
        <div className="px-5 py-2 bg-slate-850 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {(['articles', 'operating', 'ss4', 'resolutions', 'disclaimer', 'binder'] as PreviewDocType[]).map((tabKey) => {
              const meta = docMeta[tabKey];
              const Icon = meta.icon;
              const isActive = activeDoc === tabKey;
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setActiveDoc(tabKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{meta.title.split(' ')[0]} {tabKey === 'operating' ? 'Operating Agreement' : tabKey === 'binder' ? 'All-In-One Binder' : ''}</span>
                </button>
              );
            })}
          </div>

          {/* Document Display Controls (Search, Font Size, Line Numbers) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Search within document */}
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in doc..."
                className="pl-7 pr-2.5 py-1 bg-slate-900 border border-slate-700 rounded-md text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-28 lg:w-36"
              />
            </div>

            {/* Font size toggles */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-md p-0.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'sm' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400'}`}
                title="Small text"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFontSize('base')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'base' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400'}`}
                title="Standard text"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`px-1.5 py-0.5 rounded ${fontSize === 'lg' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400'}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Line numbers toggle */}
            <button
              type="button"
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`px-2 py-1 text-[11px] font-mono rounded-md border transition-colors ${
                showLineNumbers 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle line numbers"
            >
              # Lines
            </button>
          </div>
        </div>

        {/* Active Document Subheader Banner */}
        <div className="px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <CurrentIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-white">{currentMeta.title}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{currentMeta.subtitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {lines.length} lines · {Math.round(currentContent.length / 1024 * 10) / 10} KB
            </span>
          </div>
        </div>

        {/* Read-Only Document Paper Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8 font-mono select-text selection:bg-emerald-500/30 selection:text-emerald-200">
          <div className="max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-xl p-6 sm:p-10 shadow-2xl">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const matchesSearch = searchQuery.trim() && line.toLowerCase().includes(searchQuery.toLowerCase().trim());
              return (
                <div 
                  key={idx} 
                  className={`flex leading-relaxed ${matchesSearch ? 'bg-amber-500/20 text-amber-200 rounded px-1' : ''}`}
                >
                  {showLineNumbers && (
                    <span className="w-10 text-slate-600 select-none text-right pr-4 shrink-0 text-[11px]">
                      {lineNum}
                    </span>
                  )}
                  <span 
                    className={`flex-1 whitespace-pre-wrap ${
                      fontSize === 'sm' ? 'text-xs' : fontSize === 'base' ? 'text-sm' : 'text-base'
                    } ${
                      line.startsWith('===') || line.startsWith('ARTICLE') || line.startsWith('DOCUMENT') || line.startsWith('SECTION')
                        ? 'text-emerald-300 font-bold'
                        : 'text-slate-200'
                    }`}
                  >
                    {line || '\u00A0'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className={`w-4 h-4 ${verifiedDetails ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>
              {verifiedDetails ? 'Information verified by founder.' : 'Please inspect corporate details before exporting.'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy active document text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            {/* Confirm & Export Full Binder Button */}
            <button
              type="button"
              onClick={() => {
                onConfirmExport();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Formation Binder (.txt)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
