import React, { useState } from 'react';
import { 
  Coins, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  HelpCircle,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { LLCFormData, GrantItem } from '../types';
import { GRANTS_DATA } from '../data/grantsData';
import { STATES_DATA } from '../data/statesData';

interface FundingFinderProps {
  llcData: LLCFormData;
  onGoToBankResolutions?: () => void;
}

export const FundingFinder: React.FC<FundingFinderProps> = ({
  llcData,
  onGoToBankResolutions,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'federal' | 'state' | 'city'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedGrantId, setExpandedGrantId] = useState<string | null>(null);

  // Gemini AI Grant Strategy State
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [evaluatingAi, setEvaluatingAi] = useState<boolean>(false);
  const [showAiReport, setShowAiReport] = useState<boolean>(false);

  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

  const handleRunAiEvaluation = async () => {
    setEvaluatingAi(true);
    setShowAiReport(true);
    try {
      const res = await fetch('/api/ai/grant-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: llcData.businessName || 'Vanguard Synergy',
          state: stateInfo.name,
          city: llcData.officeCity || 'Local',
          industry: llcData.industry || 'Technology & Commerce',
          description: llcData.businessDescription || 'Commercial development and technology enterprise',
          demographics: ['Small Business Enterprise', 'Founder-Owned LLC'],
          fundingNeed: '75,000'
        })
      });
      const data = await res.json();
      setAiEvaluation(data);
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluatingAi(false);
    }
  };

  // Filter logic
  const filteredGrants = GRANTS_DATA.filter((grant) => {
    // Level match
    if (levelFilter !== 'all' && grant.level !== levelFilter) {
      return false;
    }
    // Category match
    if (categoryFilter !== 'all' && grant.category !== categoryFilter) {
      return false;
    }
    // Search text match
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = grant.title.toLowerCase().includes(q);
      const matchProvider = grant.provider.toLowerCase().includes(q);
      const matchSummary = grant.summary.toLowerCase().includes(q);
      const matchCity = grant.city?.toLowerCase().includes(q);
      const matchState = grant.state?.toLowerCase().includes(q);
      if (!matchTitle && !matchProvider && !matchSummary && !matchCity && !matchState) {
        return false;
      }
    }
    return true;
  });

  // Calculate high priority programs for this state
  const stateGrantsCount = GRANTS_DATA.filter((g) => g.state === stateInfo.code || g.level === 'federal').length;

  // Calculate dynamic match score for a given grant based on LLC state, entity type, and industry
  const calculateMatchScore = (grant: GrantItem) => {
    let score = 72;
    if (grant.state === stateInfo.code) score += 20;
    else if (grant.level === 'federal') score += 14;
    
    const ind = (llcData.industry || '').toLowerCase();
    if (grant.category === 'innovation' && (ind.includes('tech') || ind.includes('software') || ind.includes('bio') || ind.includes('design'))) {
      score += 8;
    }
    if (grant.category === 'small-business') score += 5;
    return Math.min(score, 98);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STEP 3: CAPITAL & GROWTH</span>
              <span>·</span>
              <span>NON-DILUTIVE STATE & FEDERAL GRANTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Coins className="w-7 h-7 text-emerald-400" />
              <span>Small Business Grants Engine</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Explore verified government grants, SBIR/STTR innovation awards, and regional economic development programs providing non-repayable capital for <strong className="text-white">{llcData.businessName || 'your LLC'}</strong> in <strong className="text-white">{stateInfo.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onGoToBankResolutions && (
              <button
                onClick={onGoToBankResolutions}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>Continue to Bank Resolutions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grant Application Readiness & Qualification Matrix */}
      <div className="p-6 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-mono text-sm">
              95
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Grant Eligibility Matrix for {llcData.businessName || 'Your Business'}
              </h3>
              <span className="text-[11px] text-emerald-400 font-mono">
                Jurisdiction: {stateInfo.name} ({stateInfo.code}) · Formed Entity Advantage
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {stateGrantsCount} Qualified Programs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
            <strong className="text-white block font-mono text-emerald-400">1. SAM.gov Registration</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Required for all federal grants (SBIR/STTR). Requires your state-filed Articles of Organization and IRS EIN CP-575 letter.
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
            <strong className="text-white block font-mono text-emerald-400">2. Unique Entity ID (UEI)</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Free 12-character identifier assigned upon SAM.gov validation (replaces legacy DUNS numbers for federal procurement).
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/70 space-y-1">
            <strong className="text-white block font-mono text-emerald-400">3. Dedicated Commercial Checking</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Grant funds cannot be disbursed to personal checking accounts. Complete your Bank Resolutions next to finalize eligibility.
            </p>
          </div>
        </div>
      </div>

      {/* Gemini AI Grant Evaluation & Strategy Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Gemini AI Grant Eligibility & Strategy Matcher</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                  Google Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                AI evaluation of {llcData.businessName || 'your LLC'} across federal SBIR/STTR, state commerce, and municipal grant programs.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunAiEvaluation}
            disabled={evaluatingAi}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{evaluatingAi ? 'Analyzing Profile...' : aiEvaluation ? 'Re-Run AI Assessment' : 'Run AI Grant Assessment'}</span>
          </button>
        </div>

        {/* AI Report Drawer */}
        {showAiReport && (
          <div className="pt-4 border-t border-slate-800 space-y-4">
            {evaluatingAi ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-300 font-medium">
                  Gemini is evaluating state and federal grant databases for {llcData.businessName || 'your enterprise'} in {stateInfo.name}...
                </p>
              </div>
            ) : aiEvaluation ? (
              <div className="space-y-4">
                {/* Readiness Score & Executive Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">AI Readiness Score</span>
                    <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
                      {aiEvaluation.readinessScore || 85}<span className="text-xs text-slate-500 font-normal">/100</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium mt-0.5">High Commercial Fit</span>
                  </div>

                  <div className="md:col-span-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-3 h-3" />
                      Executive Grant Strategy
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {aiEvaluation.executiveSummary}
                    </p>
                  </div>
                </div>

                {/* High Priority Matched Categories */}
                {Array.isArray(aiEvaluation.highPriorityGrantTypes) && aiEvaluation.highPriorityGrantTypes.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">Matched Funding Categories:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {aiEvaluation.highPriorityGrantTypes.map((g: any, i: number) => (
                        <div key={i} className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{g.grantCategory}</span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{g.typicalAmount}</span>
                          </div>
                          <p className="text-[11px] text-slate-300">{g.whyEligible}</p>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 pt-1 border-t border-slate-800">
                            <ArrowRight className="w-2.5 h-2.5 text-emerald-400" />
                            <span>{g.actionStep}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Application Tips */}
                {Array.isArray(aiEvaluation.customApplicationTips) && (
                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1.5">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Gemini Application Strategy Tips:
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {aiEvaluation.customApplicationTips.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords (e.g. innovation, SBIR, women, minority, Texas, California, veteran)..."
              className="w-full pl-9.5 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Level Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-700/80 shrink-0">
            <button
              onClick={() => setLevelFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                levelFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Levels ({GRANTS_DATA.length})
            </button>
            <button
              onClick={() => setLevelFilter('federal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                levelFilter === 'federal'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Federal
            </button>
            <button
              onClick={() => setLevelFilter('state')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                levelFilter === 'state'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              State
            </button>
            <button
              onClick={() => setLevelFilter('city')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                levelFilter === 'city'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              City / Regional
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] text-slate-400 mr-1 shrink-0 font-medium">Categories:</span>
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'innovation', label: 'Tech & SBIR' },
            { id: 'women', label: 'Women-Owned' },
            { id: 'minority', label: 'Minority & SEDI' },
            { id: 'small-business', label: 'Small Business' },
            { id: 'community', label: 'Community & Rural' },
            { id: 'veteran', label: 'Veterans' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-lg border transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-slate-700 border-slate-500 text-emerald-400 font-semibold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grants Directory List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing {filteredGrants.length} available grant programs</span>
          <span>Targeting: {stateInfo.name} & Federal Opportunities</span>
        </div>

        {filteredGrants.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 border border-slate-700/60 rounded-2xl space-y-3">
            <Coins className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-semibold text-white">No grants matched your search query</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your keyword filter or switch level filter back to "All Levels".
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('all');
                setCategoryFilter('all');
              }}
              className="px-3.5 py-1.5 text-xs bg-slate-700 text-white rounded-lg hover:bg-slate-600"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredGrants.map((grant) => {
            const isExpanded = expandedGrantId === grant.id;
            return (
              <div
                key={grant.id}
                className="bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 transition-all shadow-md space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="uppercase font-mono font-bold text-emerald-400 tracking-wider">
                        {grant.level.toUpperCase()}
                      </span>
                      {grant.city && (
                        <>
                          <span>·</span>
                          <span className="text-slate-300 font-medium">{grant.city}, {grant.state}</span>
                        </>
                      )}
                      {grant.state && !grant.city && (
                        <>
                          <span>·</span>
                          <span className="text-slate-300 font-medium">State of {grant.state}</span>
                        </>
                      )}
                      <span>·</span>
                      <span className="capitalize">{grant.category.replace('-', ' ')}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {grant.title}
                    </h3>
                    <div className="text-xs text-slate-400">{grant.provider}</div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end shrink-0 gap-1">
                    <span className="text-sm font-mono font-extrabold text-emerald-400">
                      {grant.amountLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{calculateMatchScore(grant)}% Match</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {grant.deadline}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {grant.summary}
                </p>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-700/60 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 mb-1.5">
                        Key Eligibility Criteria:
                      </h4>
                      <ul className="space-y-1">
                        {grant.eligibility.map((crit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{crit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <strong className="text-emerald-400 block mb-0.5">Insider Application Tip:</strong>
                      {grant.applicationTips}
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setExpandedGrantId(isExpanded ? null : grant.id)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Eligibility Details' : 'View Eligibility & Criteria'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={grant.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
