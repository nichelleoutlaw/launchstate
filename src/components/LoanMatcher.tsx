import React, { useState, useMemo } from 'react';
import { 
  Banknote, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  HelpCircle, 
  Sparkles,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { LLCFormData, LoanProgram } from '../types';
import { LOANS_DATA } from '../data/loansData';

interface LoanMatcherProps {
  llcData: LLCFormData;
  onOpenAdvisorWithPrompt: (prompt: string) => void;
}

export const LoanMatcher: React.FC<LoanMatcherProps> = ({
  llcData,
  onOpenAdvisorWithPrompt,
}) => {
  // Calculator & Match inputs
  const [loanAmount, setLoanAmount] = useState<number>(35000);
  const [creditScore, setCreditScore] = useState<number>(680);
  const [timeInBusinessMonths, setTimeInBusinessMonths] = useState<number>(0); // 0 = startup
  const [annualRevenue, setAnnualRevenue] = useState<number>(60000);
  const [activeTab, setActiveTab] = useState<'all' | 'startup' | 'sba' | 'low-interest'>('all');

  // Interactive Match Scoring
  const matchedPrograms = useMemo(() => {
    return LOANS_DATA.map((prog) => {
      let score = 100;
      const reasons: string[] = [];

      // Credit score check
      if (creditScore < prog.minCreditScore) {
        score -= 35;
        reasons.push(`Credit score (${creditScore}) is below program preferred (${prog.minCreditScore}+)`);
      }

      // Time in business check
      if (timeInBusinessMonths < prog.timeInBusinessMonths) {
        score -= 30;
        reasons.push(`Requires at least ${prog.timeInBusinessMonths} months operating history`);
      }

      // Revenue check
      if (annualRevenue < prog.minRevenueAnnual && prog.minRevenueAnnual > 0) {
        score -= 25;
        reasons.push(`Preferred revenue is $${prog.minRevenueAnnual.toLocaleString()}+/yr`);
      }

      // Loan amount check
      if (loanAmount > prog.maxAmount) {
        score -= 40;
        reasons.push(`Exceeds maximum loan cap ($${prog.maxAmount.toLocaleString()})`);
      }

      let matchLevel: 'High Match' | 'Good Match' | 'Conditional' = 'High Match';
      if (score < 60) matchLevel = 'Conditional';
      else if (score < 85) matchLevel = 'Good Match';

      return {
        ...prog,
        score: Math.max(10, score),
        matchLevel,
        reasons,
      };
    }).sort((a, b) => b.score - a.score);
  }, [loanAmount, creditScore, timeInBusinessMonths, annualRevenue]);

  // Estimated Monthly Payment Calculation (amortized approximation)
  const estimatedMonthlyPayment = useMemo(() => {
    const principal = loanAmount;
    const annualRate = 0.105; // 10.5% average SBA / small biz rate
    const monthlyRate = annualRate / 12;
    const months = 84; // 7 years average term
    const payment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return isNaN(payment) ? 0 : Math.round(payment);
  }, [loanAmount]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>COMMERCIAL & SBA DEBT CAPITAL</span>
              <span>·</span>
              <span>QUALIFICATION MATCHER</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Business Loans & SBA Capital Finder
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Find the lowest APR capital for your LLC: compare SBA 7(a) government-guaranteed loans, SBA Microloans for startups, CDFI community capital, and 0% interest non-profit funding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAdvisorWithPrompt(`Analyze my loan qualification for a $${loanAmount.toLocaleString()} SBA loan with a credit score of ${creditScore} for my new LLC "${llcData.businessName}". What documents do banks require?`)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Underwriting Readiness</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Eligibility & Loan Calculator */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Instant Loan Eligibility & Payment Calculator
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Real-time underwriting evaluation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Target Amount */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Loan Amount Desired:</span>
              <span className="font-mono text-emerald-400 font-bold">${loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$5,000</span>
              <span>$100,000</span>
              <span>$250,000+</span>
            </div>
          </div>

          {/* Credit Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Personal Credit Score:</span>
              <span className="font-mono text-emerald-400 font-bold">{creditScore}</span>
            </div>
            <input
              type="range"
              min="550"
              max="820"
              step="10"
              value={creditScore}
              onChange={(e) => setCreditScore(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>550 (Fair)</span>
              <span>680 (Good)</span>
              <span>800+ (Excellent)</span>
            </div>
          </div>

          {/* Time in Business */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Operating History:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {timeInBusinessMonths === 0 ? 'Brand New Startup' : `${timeInBusinessMonths} Months`}
              </span>
            </div>
            <select
              value={timeInBusinessMonths}
              onChange={(e) => setTimeInBusinessMonths(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="0">Day 1 Startup (New LLC)</option>
              <option value="6">6 Months Operating</option>
              <option value="12">1 Year Operating</option>
              <option value="24">2+ Years Operating</option>
            </select>
          </div>

          {/* Monthly Payment Estimate Card */}
          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div className="text-[11px] text-slate-400 uppercase font-mono">
              Estimated Monthly Payment
            </div>
            <div className="text-2xl font-extrabold text-white font-mono my-1">
              ${estimatedMonthlyPayment.toLocaleString()}
              <span className="text-xs text-slate-400 font-normal"> /mo</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Based on ~10.5% APR over 7-year amortization
            </div>
          </div>
        </div>
      </div>

      {/* Matched Loan Programs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Ranked by match compatibility for your profile</span>
          <span>SBA Guarantees & Low-Cost Facilities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchedPrograms.map((loan) => (
            <div
              key={loan.id}
              className="bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 transition-all shadow-md flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                      {loan.type.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {loan.name}
                    </h3>
                    <div className="text-xs text-slate-400">{loan.provider}</div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                        loan.matchLevel === 'High Match'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : loan.matchLevel === 'Good Match'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {loan.matchLevel} ({loan.score}%)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">MAX CAPITAL</span>
                    <span className="font-bold text-white">{loan.amountRange}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ESTIMATED RATE</span>
                    <span className="font-bold text-emerald-400">{loan.interestRate}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block text-[10px]">TERM LENGTH</span>
                    <span className="text-slate-300">{loan.termLength}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block text-[10px]">MIN CREDIT</span>
                    <span className="text-slate-300">{loan.minCreditScore === 0 ? 'No Minimum' : `${loan.minCreditScore}+`}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Best For: </strong>
                  {loan.bestFor}
                </p>

                {loan.reasons.length > 0 && (
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300 space-y-1">
                    <div className="font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>Approval Considerations:</span>
                    </div>
                    {loan.reasons.map((r, i) => (
                      <div key={i} className="pl-4">· {r}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
                <button
                  onClick={() => onOpenAdvisorWithPrompt(`What are the specific lender requirements and required documents for the ${loan.name}?`)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Check Checklist</span>
                </button>

                <a
                  href={loan.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Apply with SBA Lenders</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lender Underwriting Documentation Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            SBA & Commercial Loan Application Binder Checklist
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          When approaching an SBA Preferred Lender (PLP) or bank, having this binder prepared cuts your underwriting cycle from 60 days to 14 days:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block font-mono">01. Entity Papers</span>
            <span className="text-slate-300">Certified Articles of Organization, signed Operating Agreement, IRS EIN Letter.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block font-mono">02. Financial Projections</span>
            <span className="text-slate-300">3-Year month-by-month profit & loss projections, balance sheet, and cash flow forecast.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block font-mono">03. SBA Form 413</span>
            <span className="text-slate-300">Personal Financial Statement required for all owners holding 20% or more equity.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block font-mono">04. Bank Records</span>
            <span className="text-slate-300">3-6 months personal and business checking statements demonstrating liquidity.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
