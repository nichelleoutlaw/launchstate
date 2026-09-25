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
  FileCheck
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

  const stateInfo = STATES_DATA[llcData.formationState] || STATES_DATA['TX'];

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

                  <div className="flex flex-col items-start sm:items-end shrink-0">
                    <span className="text-sm font-mono font-extrabold text-emerald-400">
                      {grant.amountLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Deadline: {grant.deadline}
                    </span>
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
