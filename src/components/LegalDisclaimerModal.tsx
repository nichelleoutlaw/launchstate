import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FileText, 
  Check, 
  Lock, 
  Scale, 
  Printer, 
  Sparkles,
  Info
} from 'lucide-react';
import { LLCFormData, LegalAcknowledgment } from '../types';
import { STATES_DATA } from '../data/statesData';

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  llcData: LLCFormData;
  onSaveAcknowledgment: (ack: LegalAcknowledgment) => void;
}

export const LegalDisclaimerModal: React.FC<LegalDisclaimerModalProps> = ({
  isOpen,
  onClose,
  llcData,
  onSaveAcknowledgment,
}) => {
  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];
  const existingAck = llcData.legalAcknowledgment;

  // Signature Form State
  const [signerName, setSignerName] = useState<string>(
    existingAck?.signedName || llcData.responsiblePartyName || llcData.members[0]?.fullName || ''
  );
  const [signerCapacity, setSignerCapacity] = useState<string>(
    existingAck?.signerCapacity || 'Authorized Managing Member'
  );
  const [agreedNotLawFirm, setAgreedNotLawFirm] = useState<boolean>(
    existingAck?.agreedNotLawFirm ?? true
  );
  const [agreedNoAttorneyClient, setAgreedNoAttorneyClient] = useState<boolean>(
    existingAck?.agreedNoAttorneyClient ?? true
  );
  const [agreedSelfRepresentation, setAgreedSelfRepresentation] = useState<boolean>(
    existingAck?.agreedSelfRepresentation ?? true
  );
  const [agreedStateVerification, setAgreedStateVerification] = useState<boolean>(
    existingAck?.agreedStateVerification ?? true
  );
  const [justSigned, setJustSigned] = useState<boolean>(false);

  if (!isOpen) return null;

  const canSign =
    signerName.trim().length > 1 &&
    agreedNotLawFirm &&
    agreedNoAttorneyClient &&
    agreedSelfRepresentation &&
    agreedStateVerification;

  const handleSign = () => {
    if (!canSign) return;

    const newAck: LegalAcknowledgment = {
      isSigned: true,
      signedName: signerName.trim(),
      signatureDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
      signerCapacity: signerCapacity.trim() || 'Authorized Managing Member',
      agreedNotLawFirm: true,
      agreedNoAttorneyClient: true,
      agreedSelfRepresentation: true,
      agreedStateVerification: true,
      verificationHash: `VERIFIED-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 10000)}`,
    };

    onSaveAcknowledgment(newAck);
    setJustSigned(true);
    setTimeout(() => {
      setJustSigned(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Legal Disclaimer & Self-Help Services Agreement
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  U.S. Law Notice
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Mandatory disclosure regarding automated formation tools and Pro Se self-representation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Status Badge */}
          {existingAck?.isSigned ? (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">
                  Signed & Verified by {existingAck.signedName} on {existingAck.signatureDate}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {existingAck.verificationHash}
              </span>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Please review these statutory legal disclosures and provide your verified digital signature below.
              </span>
            </div>
          )}

          {/* Core Disclosures */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-emerald-400">
                1. Not a Law Firm & No Legal Advice
              </h4>
              <p className="text-slate-300">
                LaunchState is an automated technology software application that provides self-help legal document automation and educational business resources. <strong>LaunchState is NOT a law firm, is not a certified public accounting (CPA) firm, and does NOT provide legal, financial, or tax advice.</strong> Software operators and artificial intelligence co-pilots cannot substitute for the customized advice of a licensed attorney.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-emerald-400">
                2. No Attorney-Client Privilege
              </h4>
              <p className="text-slate-300">
                Your use of this platform, generation of documents, and interactions with AI advisors <strong>do NOT create an attorney-client relationship</strong>. Communications are not protected by attorney-client confidentiality or work-product privilege.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-emerald-400">
                3. Self-Representation (Pro Se)
              </h4>
              <p className="text-slate-300">
                You are representing yourself (acting <em>pro se</em>) in all corporate and administrative proceedings, including filing Articles of Organization with the {stateInfo.portalName}, securing an Employer Identification Number (EIN) with the Internal Revenue Service, and executing commercial contracts.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-emerald-400">
                4. Statutory Accuracy & State Variations
              </h4>
              <p className="text-slate-300">
                Corporate statutes, state filing fees, newspaper publication requirements, and administrative rules in the State of {stateInfo.name} and across the 50 US states change periodically. You are solely responsible for reviewing and verifying the accuracy and completeness of all legal documents prior to state submission.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-emerald-400">
                5. Funding & Loan Program Independent Underwriting
              </h4>
              <p className="text-slate-300">
                Grant matching scores and business loan qualification estimates are informational simulations. LaunchState is not a lender, broker, or funding guarantor. All loans and grants are subject to formal underwriting, credit evaluation, and sovereign or private grantor approval.
              </p>
            </div>
          </div>

          {/* Interactive Checkbox Affirmations */}
          <div className="space-y-2.5 pt-1">
            <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Mandatory Founder Declarations:
            </h4>

            <label className="flex items-start gap-2.5 p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={agreedNotLawFirm}
                onChange={(e) => setAgreedNotLawFirm(e.target.checked)}
                className="mt-0.5 accent-emerald-500 rounded"
              />
              <span className="text-slate-200">
                I understand LaunchState is an automated self-help software platform and <strong>NOT a law firm, accounting firm, or legal advisor</strong>.
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={agreedNoAttorneyClient}
                onChange={(e) => setAgreedNoAttorneyClient(e.target.checked)}
                className="mt-0.5 accent-emerald-500 rounded"
              />
              <span className="text-slate-200">
                I acknowledge that <strong>no attorney-client relationship is created</strong>, and my entries are not protected by legal privilege.
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={agreedSelfRepresentation}
                onChange={(e) => setAgreedSelfRepresentation(e.target.checked)}
                className="mt-0.5 accent-emerald-500 rounded"
              />
              <span className="text-slate-200">
                I confirm that I am acting <strong>pro se (representing myself)</strong> in creating and organizing <strong>{llcData.businessName} {llcData.suffix}</strong>.
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={agreedStateVerification}
                onChange={(e) => setAgreedStateVerification(e.target.checked)}
                className="mt-0.5 accent-emerald-500 rounded"
              />
              <span className="text-slate-200">
                I accept sole legal responsibility for verifying my paperwork and submitting filings to the <strong>State of {stateInfo.name}</strong> and IRS.
              </span>
            </label>
          </div>

          {/* Digital Signature Execution Section */}
          <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">Digital Signature & Execution Record</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Timestamped Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Signer Full Legal Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Title / Legal Capacity
                </label>
                <input
                  type="text"
                  value={signerCapacity}
                  onChange={(e) => setSignerCapacity(e.target.value)}
                  placeholder="Managing Member, Founder, Organizer"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {signerName && (
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Digital Signature Preview:</span>
                <span className="text-emerald-400 font-bold italic tracking-wide">
                  /{signerName}/
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            By signing, you generate a permanent verification record included in your formation binder.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!canSign || justSigned}
              onClick={handleSign}
              className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              {justSigned ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Signature Saved!</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>{existingAck?.isSigned ? 'Update Signed Acknowledgment' : 'Digitally Sign & Verify'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
