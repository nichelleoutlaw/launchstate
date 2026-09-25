import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileText,
  DollarSign,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { LLCFormData } from '../types';
import { STATES_DATA } from '../data/statesData';

interface BankResolutionsProps {
  llcData: LLCFormData;
  onGoToGrants?: () => void;
  onGoToDocuments?: () => void;
}

export const BankResolutions: React.FC<BankResolutionsProps> = ({
  llcData,
  onGoToGrants,
  onGoToDocuments,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>('Mercury Bank');
  const [dualSignThreshold, setDualSignThreshold] = useState<string>('10000');
  const [dailyWireLimit, setDailyWireLimit] = useState<string>('50000');
  const [includeCreditCardPower, setIncludeCreditCardPower] = useState<boolean>(true);
  const [includeBorrowingPower, setIncludeBorrowingPower] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Banking Checklist
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    articles: true,
    ein: true,
    operating: true,
    resolution: true,
    id: false,
    addressProof: false,
  });

  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];
  const entityName = `${llcData.businessName || 'Vanguard Synergy'} ${llcData.suffix}`;
  const effectiveDate = llcData.effectiveDate || new Date().toISOString().split('T')[0];

  const primarySigner = llcData.members[0]?.fullName || 'Authorized Managing Member';
  const primaryTitle = llcData.members[0]?.title || 'Managing Member';

  // Toggle checklist
  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Generate formal legal text
  const generateResolutionText = (): string => {
    const divider = '='.repeat(78);
    const subDivider = '-'.repeat(78);

    const membersList = (llcData.members.length > 0 ? llcData.members : [
      {
        fullName: primarySigner,
        title: primaryTitle,
        ownershipPercentage: 100,
        initialContribution: 1000,
      }
    ]).map((m, idx) => `  ${idx + 1}. ${m.fullName.toUpperCase()}, ${m.title} (Ownership: ${m.ownershipPercentage}%)`).join('\n');

    const signatureBlocks = (llcData.members.length > 0 ? llcData.members : [
      {
        fullName: primarySigner,
        title: primaryTitle,
      }
    ]).map((m) => `
_____________________________________________________
SIGNATURE: ${m.fullName.toUpperCase()}
TITLE: ${m.title}
DATE: ________________________
`).join('\n');

    return `${divider}
ACTION BY UNANIMOUS WRITTEN CONSENT OF THE MEMBERS
OF
${entityName.toUpperCase()}
AUTHORIZING OPENING OF CORPORATE DEPOSITORY & BANKING ACCOUNTS
${divider}

PURSUANT TO THE APPLICABLE LIMITED LIABILITY COMPANY ACT OF THE
STATE OF ${stateInfo.name.toUpperCase()} AND THE OPERATING AGREEMENT OF THE COMPANY:

The undersigned, constituting all the Members and Managers of ${entityName.toUpperCase()} (the "Company"), a limited liability company organized and existing under the laws of the State of ${stateInfo.name}, hereby adopt and ratify the following resolutions by unanimous written consent, with the same force and effect as if adopted at a formal meeting duly called and held on this ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}:

${subDivider}
I. SELECTION OF FINANCIAL DEPOSITORY
${subDivider}
RESOLVED, that ${selectedBank.toUpperCase()} (the "Bank"), be and hereby is designated as an authorized depository of the Company, and that the Company is authorized to establish and maintain commercial checking, savings, money market, and electronic treasury management accounts with the Bank.

${subDivider}
II. DESIGNATION OF AUTHORIZED SIGNERS
${subDivider}
RESOLVED, that the following individuals (the "Authorized Officers") are hereby authorized, empowered, and directed, in the name and on behalf of the Company, to execute banking agreements, open and close accounts, deposit funds, and execute checks, drafts, and electronic fund transfers:

${membersList}

FURTHER RESOLVED, that any check, draft, wire transfer, or disbursement of Company funds in excess of $${Number(dualSignThreshold).toLocaleString()} shall require the joint signatures or dual-factor administrative authorizations of at least two (2) Authorized Officers.

FURTHER RESOLVED, that the single-day outbound electronic wire transfer ceiling without prior written consent of a majority of voting equity shall be established at $${Number(dailyWireLimit).toLocaleString()}.

${subDivider}
III. BANKING POWERS & INSTRUMENTS
${subDivider}
RESOLVED, that the Bank is authorized to honor and pay all checks, drafts, and orders drawn on the Company's accounts, including those payable to the order of any Authorized Officer or employee signing the same, without inquiring into the circumstances of their issue or the disposition of the proceeds.

${includeCreditCardPower ? `RESOLVED, that the Authorized Officers are empowered to apply for, establish, and issue commercial debit and credit cards in the Company's name, provided that all charges incurred represent bona fide corporate business expenses.` : ''}

${includeBorrowingPower ? `RESOLVED, that the Authorized Officers are authorized to negotiate credit facilities, loans, and letters of credit with the Bank on terms deemed favorable to the Company.` : ''}

${subDivider}
IV. INCUMBENCY & CORPORATE VEIL PRESERVATION
${subDivider}
RESOLVED, that the Company shall at all times maintain complete financial segregation between Company funds and the personal finances of its Members. Commingling of personal and corporate assets is strictly prohibited under the statutory governance standards of ${stateInfo.name}.

RESOLVED, that the Secretary or Managing Member of the Company is authorized and directed to certify to the Bank a copy of these resolutions and the names, specimen signatures, and official titles of the Authorized Officers.

${subDivider}
V. RATIFICATION OF ORGANIZATIONAL ACTIONS
${subDivider}
RESOLVED, that all actions heretofore taken by the Organizer and initial Members of the Company in connection with the organization of the Company and the filing of its Articles of Organization with the Secretary of State of ${stateInfo.name} are hereby ratified, confirmed, and approved in all respects.

IN WITNESS WHEREOF, the undersigned Members and Managers have executed this Action by Unanimous Written Consent as of the effective date set forth above.

MEMBERS & MANAGERS SIGNATURES:
${signatureBlocks}
${divider}
END OF FORMAL RESOLUTION DOCUMENT
`;
  };

  const documentText = generateResolutionText();

  // Handlers
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(documentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([documentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${entityName.replace(/\s+/g, '_')}_Banking_Resolutions.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Banking Resolution - ${entityName}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; }
            pre { white-space: pre-wrap; font-family: 'Times New Roman', Times, serif; font-size: 13pt; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <pre>${documentText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
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

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STEP 3: CAPITAL & GROWTH</span>
              <span>·</span>
              <span>COMMERCIAL BANKING & TREASURY AUTHORIZATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Building2 className="w-7 h-7 text-emerald-400" />
              <span>Corporate Banking Resolutions & Readiness</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Generate the mandatory <strong className="text-white">Unanimous Written Consent of Members</strong> required by commercial banks (Mercury, Relay, Chase, BofA) to open your corporate checking account and preserve your corporate veil.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Resolution (.txt)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Parameters & Day-1 Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Resolution Configuration */}
        <div className="lg:col-span-1 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Resolution Parameters</span>
          </h3>

          {/* Depository Institution */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Financial Institution
            </label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Mercury Bank">Mercury Bank (Modern Tech & Startups)</option>
              <option value="Relay Financial">Relay Financial (Multi-Account Cash Flow)</option>
              <option value="JPMorgan Chase Bank, N.A.">JPMorgan Chase Bank, N.A.</option>
              <option value="Bank of America, N.A.">Bank of America, N.A.</option>
              <option value="Wells Fargo Bank, N.A.">Wells Fargo Bank, N.A.</option>
              <option value="Local Commercial Credit Union">Local Commercial Credit Union</option>
            </select>
          </div>

          {/* Dual Signature Threshold */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dual-Signature Limit ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={dualSignThreshold}
                onChange={(e) => setDualSignThreshold(e.target.value)}
                placeholder="10000"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Checks/wires over this amount require two signers.
            </span>
          </div>

          {/* Daily Outbound Wire Ceiling */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Daily Wire Transfer Limit ($)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={dailyWireLimit}
                onChange={(e) => setDailyWireLimit(e.target.value)}
                placeholder="50000"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Additional Authorizations */}
          <div className="space-y-2 pt-2 border-t border-slate-700/60 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCreditCardPower}
                onChange={(e) => setIncludeCreditCardPower(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
              />
              <span>Authorize Corporate Credit Cards</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBorrowingPower}
                onChange={(e) => setIncludeBorrowingPower(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
              />
              <span>Authorize Commercial Credit Lines</span>
            </label>
          </div>
        </div>

        {/* Right 2 cols: Day-1 Bank Opening Requirements Checklist */}
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Day-1 Bank Opening Readiness Audit</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Passes Underwriting
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Commercial underwriters at Mercury, Relay, and major national banks will ask for this exact paperwork bundle before issuing routing numbers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {[
              { id: 'articles', title: '1. Certified Articles of Organization', desc: `Stamped state charter from ${stateInfo.name} Secretary of State.` },
              { id: 'ein', title: '2. IRS Official EIN Letter (CP 575)', desc: 'Official federal tax ID verification issued by IRS.gov.' },
              { id: 'operating', title: '3. Executed LLC Operating Agreement', desc: 'Internal governing agreement showing ownership percentages.' },
              { id: 'resolution', title: '4. Signed Banking Resolution', desc: 'This document authorizing opening accounts and designated signers.' },
              { id: 'id', title: '5. Government Photo ID for 25%+ Owners', desc: 'Driver\'s License or Passport for all major equity owners.' },
              { id: 'addressProof', title: '6. Proof of Principal Physical Address', desc: 'Lease agreement, utility bill, or registered office documentation.' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  checklist[item.id]
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 transition-colors ${
                  checklist[item.id]
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                    : 'border-slate-600 bg-slate-800'
                }`}>
                  {checklist[item.id] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <strong className="block text-white text-[11px]">{item.title}</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-400">Apply directly online in under 10 minutes:</span>
            <a
              href="https://mercury.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Open Mercury Bank Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Live Document Preview & Actions */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Formal Written Resolution (Live Document Preview)
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                Statutory Authority: {stateInfo.name} LLC Act
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Paper Document Canvas */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-inner overflow-x-auto">
          <pre className="font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {documentText}
          </pre>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Full Formation & Capital Suite Configured</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            You can view and export your entire legal formation binder anytime from the top navigation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onGoToGrants && (
            <button
              onClick={onGoToGrants}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Back to Grants Engine
            </button>
          )}
          {onGoToDocuments && (
            <button
              onClick={onGoToDocuments}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Review All Legal Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
