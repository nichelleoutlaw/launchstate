import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  ArrowUpDown, 
  CheckCircle2, 
  Building2,
  DollarSign
} from 'lucide-react';
import { UsStateCode, StateFilingInfo } from '../types';
import { STATES_DATA } from '../data/statesData';

interface StateFilingDirectoryProps {
  selectedState: UsStateCode;
  onSelectState: (state: UsStateCode) => void;
}

export const StateFilingDirectory: React.FC<StateFilingDirectoryProps> = ({
  selectedState,
  onSelectState,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'no-annual-report' | 'non-resident' | 'low-fee'>('all');
  const [sortKey, setSortKey] = useState<'name' | 'fee-asc' | 'fee-desc' | 'annual-asc'>('fee-asc');

  const allStates = Object.values(STATES_DATA);

  // Filter
  const filtered = allStates.filter((s) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchCode = s.code.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }

    if (filterMode === 'no-annual-report') {
      return s.annualReportFee === 0;
    }
    if (filterMode === 'non-resident') {
      return s.popularForNonResidents;
    }
    if (filterMode === 'low-fee') {
      return s.filingFee <= 70;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'fee-asc') return a.filingFee - b.filingFee;
    if (sortKey === 'fee-desc') return b.filingFee - a.filingFee;
    if (sortKey === 'annual-asc') return a.annualReportFee - b.annualReportFee;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STATUTORY JURISDICTION DIRECTORY</span>
              <span>·</span>
              <span>50 US STATES + DC</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              State LLC Filing Fees & SOS Directory
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Compare initial state formation fees, recurring annual report costs, publication rules, and corporate tax rates. Connect directly to official state registries with zero broker markups.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search state name or 2-letter abbreviation (e.g. Texas, TX, Delaware, DE)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="fee-asc">Filing Fee: Lowest First</option>
              <option value="fee-desc">Filing Fee: Highest First</option>
              <option value="annual-asc">Annual Fee: Lowest First</option>
              <option value="name">Alphabetical: A - Z</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            All 50 States + DC
          </button>
          <button
            onClick={() => setFilterMode('low-fee')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'low-fee'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            Low Cost (Under $70)
          </button>
          <button
            onClick={() => setFilterMode('no-annual-report')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'no-annual-report'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            $0 Annual Maintenance
          </button>
          <button
            onClick={() => setFilterMode('non-resident')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'non-resident'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900/60 text-slate-400 hover:text-white'
            }`}
          >
            Venture & Out-of-State Hubs
          </button>
        </div>
      </div>

      {/* States Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((s) => {
          const isSelected = selectedState === s.code;
          return (
            <div
              key={s.code}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-800/60 hover:bg-slate-800/80 border-slate-700/80'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{s.name}</span>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-700">
                        {s.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {s.portalName}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      ${s.filingFee}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">One-Time Fee</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PROCESSING</span>
                    <span className="font-semibold text-slate-200">{s.processingTimeDays}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ANNUAL REPORT</span>
                    <span className="font-semibold text-white">${s.annualReportFee}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CORP TAX</span>
                    <span className="text-slate-300">{s.corporateTaxRate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">EXPEDITED</span>
                    <span className="text-slate-300">{s.expeditedAvailable ? `+$${s.expeditedFee || 50}` : 'No'}</span>
                  </div>
                </div>

                {s.publicationRequired && (
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Mandatory newspaper publication required</span>
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {s.franchiseTaxNotes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => onSelectState(s.code)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-700/80 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{isSelected ? 'Current Formation State' : 'Form in ' + s.code}</span>
                </button>

                <a
                  href={s.statePortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 p-1"
                  title={`Open official ${s.name} SOS Portal`}
                >
                  <span>SOS Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
