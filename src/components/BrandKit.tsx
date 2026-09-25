import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { LLCFormData } from '../types';

interface BrandKitProps {
  llcData: LLCFormData;
  updateLLCData: (data: Partial<LLCFormData>) => void;
  onGoToDomainEmail?: () => void;
  onGoToDnsAdvisor?: () => void;
}

interface ColorPalette {
  id: string;
  name: string;
  category: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  description: string;
}

const PRESET_PALETTES: ColorPalette[] = [
  {
    id: 'navy-gold',
    name: 'Corporate Authority',
    category: 'Finance, Legal & Consulting',
    primary: '#0F172A',
    secondary: '#1E293B',
    accent: '#D97706',
    background: '#F8FAFC',
    text: '#0F172A',
    description: 'High-trust, conservative palette evoking institutional permanence and fiduciary excellence.'
  },
  {
    id: 'emerald-tech',
    name: 'Modern Venture',
    category: 'Technology & Growth',
    primary: '#064E3B',
    secondary: '#047857',
    accent: '#10B981',
    background: '#F0FDF4',
    text: '#064E3B',
    description: 'Vibrant emerald tones projecting vitality, sustainability, and forward-looking scale.'
  },
  {
    id: 'cobalt-executive',
    name: 'Executive Royal',
    category: 'Commercial & Enterprise',
    primary: '#1E3A8A',
    secondary: '#2563EB',
    accent: '#38BDF8',
    background: '#F0F9FF',
    text: '#0C4A6E',
    description: 'Direct, confident blue palette favored by Fortune 500 enterprises and commercial banks.'
  },
  {
    id: 'slate-minimalist',
    name: 'Nordic Slate',
    category: 'Design, Architecture & SaaS',
    primary: '#18181B',
    secondary: '#3F3F46',
    accent: '#71717A',
    background: '#FAFAFA',
    text: '#18181B',
    description: 'Restrained, timeless monochrome aesthetic emphasizing clean typography and precision.'
  },
  {
    id: 'burgundy-prestige',
    name: 'Imperial Crimson',
    category: 'Real Estate & Luxury',
    primary: '#4A0E17',
    secondary: '#881337',
    accent: '#F59E0B',
    background: '#FFFBEB',
    text: '#451A03',
    description: 'Rich heritage tones conveying prestige, private equity standards, and asset protection.'
  }
];

const FONT_PAIRINGS = [
  {
    id: 'modern-sans',
    name: 'Modern Executive',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    style: 'Clean, contemporary, highly readable on digital screens and official PDF filings.',
    sampleHeading: 'Strategic Capital & Asset Protection',
    sampleBody: 'Delivering disciplined corporate governance, institutional compliance, and structured commercial growth.'
  },
  {
    id: 'editorial-serif',
    name: 'Fiduciary Authority',
    headingFont: 'Playfair Display',
    bodyFont: 'Source Serif Pro',
    style: 'Prestigious serif balance ideal for advisory firms, legal practices, and real estate funds.',
    sampleHeading: 'Preserving Generational Value',
    sampleBody: 'Founded on statutory rigor and strict segregation of operational and personal fiduciary liabilities.'
  },
  {
    id: 'technical-mono',
    name: 'Engineered Precision',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    style: 'Geometric, authoritative presentation tailored for technology, logistics, and engineering ventures.',
    sampleHeading: 'Scalable Systems Architecture',
    sampleBody: 'Standardized operational pipelines with transparent commercial agreements and verifiable digital identity.'
  }
];

export const BrandKit: React.FC<BrandKitProps> = ({
  llcData,
  updateLLCData,
  onGoToDomainEmail,
  onGoToDnsAdvisor,
}) => {
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(PRESET_PALETTES[1]);
  const [selectedFont, setSelectedFont] = useState(FONT_PAIRINGS[0]);
  const [logoStyle, setLogoStyle] = useState<'shield' | 'hexagon' | 'circle' | 'monogram'>('shield');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Generate initials
  const initials = llcData.businessName
    ? llcData.businessName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : 'LS';

  const brandName = llcData.businessName || 'Vanguard Synergy';

  // Deterministic Slogans
  const slogans = [
    `Building Sustainable Value in ${llcData.industry || 'Commerce'}`,
    `Institutional Excellence. Commercial Velocity.`,
    `Structured for Growth. Protected by Law.`,
    `Precision Operational Solutions for Modern Enterprise`,
    `Next-Generation ${llcData.industry || 'Business'} Infrastructure`
  ];

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplySlogan = (slogan: string) => {
    updateLLCData({ tagline: slogan });
  };

  // Download SVG Emblem
  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('brand-logo-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_logo_mark.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STEP 2: BRAND & IDENTITY</span>
              <span>·</span>
              <span>CORPORATE ASSETS & VISUAL CREDIBILITY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Brand Kit & Visual Identity Suite
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Standardize your entity's color palettes, typography, corporate monogram emblem, and brand messaging to present enterprise credibility to clients, vendors, and underwriting banks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onGoToDomainEmail && (
              <button
                onClick={onGoToDomainEmail}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>Continue to Domain & Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Monogram Generator & Live Identity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Vector Logo Emblem Preview */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Corporate Monogram Emblem
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Vector SVG
              </span>
            </div>

            {/* Emblem Canvas */}
            <div 
              className="w-full aspect-square rounded-2xl flex items-center justify-center p-8 transition-all duration-300 shadow-inner"
              style={{ backgroundColor: selectedPalette.primary }}
            >
              <svg 
                id="brand-logo-svg" 
                viewBox="0 0 200 200" 
                className="w-40 h-40 filter drop-shadow-md"
              >
                {logoStyle === 'shield' && (
                  <path 
                    d="M100 20 L170 50 L170 115 C170 155 100 185 100 185 C100 185 30 155 30 115 L30 50 Z" 
                    fill={selectedPalette.secondary} 
                    stroke={selectedPalette.accent} 
                    strokeWidth="5" 
                  />
                )}
                {logoStyle === 'hexagon' && (
                  <polygon 
                    points="100,20 175,60 175,140 100,180 25,140 25,60" 
                    fill={selectedPalette.secondary} 
                    stroke={selectedPalette.accent} 
                    strokeWidth="5" 
                  />
                )}
                {logoStyle === 'circle' && (
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="80" 
                    fill={selectedPalette.secondary} 
                    stroke={selectedPalette.accent} 
                    strokeWidth="5" 
                  />
                )}
                {logoStyle === 'monogram' && (
                  <rect 
                    x="25" 
                    y="25" 
                    width="150" 
                    height="150" 
                    rx="30" 
                    fill={selectedPalette.secondary} 
                    stroke={selectedPalette.accent} 
                    strokeWidth="5" 
                  />
                )}
                <text 
                  x="100" 
                  y="115" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fill={selectedPalette.accent} 
                  fontSize="52" 
                  fontWeight="bold" 
                  fontFamily="'Plus Jakarta Sans', sans-serif" 
                  letterSpacing="2"
                >
                  {initials}
                </text>
              </svg>
            </div>

            {/* Emblem Style Selector */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {(['shield', 'hexagon', 'circle', 'monogram'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setLogoStyle(style)}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all ${
                    logoStyle === style
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
            <button
              onClick={handleDownloadSvg}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
            <button
              onClick={() => handleCopy(document.getElementById('brand-logo-svg')?.outerHTML || '', 'svg')}
              className="py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedItem === 'svg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedItem === 'svg' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Right 2 cols: Live Corporate Business Card & Letterhead Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Business Card Mockup */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Executive Business Card Preview
              </h3>
              <span className="text-xs text-slate-400 font-mono">Standard 3.5" x 2" Ratio</span>
            </div>

            <div 
              className="w-full max-w-md mx-auto aspect-[1.75/1] rounded-2xl p-6 flex flex-col justify-between shadow-2xl border transition-all duration-300 relative overflow-hidden"
              style={{
                backgroundColor: selectedPalette.primary,
                borderColor: selectedPalette.secondary,
                color: '#FFFFFF'
              }}
            >
              {/* Decorative accent slash */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 filter blur-xl"
                style={{ backgroundColor: selectedPalette.accent }}
              />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm border shadow-sm"
                    style={{
                      backgroundColor: selectedPalette.secondary,
                      borderColor: selectedPalette.accent,
                      color: selectedPalette.accent
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm tracking-tight">{brandName}</h4>
                    <span 
                      className="text-[10px] font-mono uppercase tracking-wider block"
                      style={{ color: selectedPalette.accent }}
                    >
                      {llcData.suffix} · {llcData.formationState}
                    </span>
                  </div>
                </div>

                <div 
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: selectedPalette.accent }}
                />
              </div>

              <div className="relative z-10 space-y-1">
                <div className="text-xs font-semibold">
                  {llcData.members[0]?.fullName || 'Executive Managing Member'}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  {llcData.members[0]?.title || 'Managing Member'}
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-300 font-mono">
                  <span>info@{brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                  <span>{llcData.officeCity || 'Corporate HQ'}, {llcData.officeState || llcData.formationState}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slogans & Taglines */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Brand Taglines & Value Propositions
              </h3>
              <span className="text-xs text-slate-400">Click to set active slogan</span>
            </div>

            <div className="space-y-2">
              {slogans.map((slogan, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-700/80 flex items-center justify-between gap-3 group transition-all"
                >
                  <p className="text-xs text-slate-200 font-medium">"{slogan}"</p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(slogan, `slogan-${idx}`)}
                      className="px-2 py-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 rounded flex items-center gap-1 transition-colors"
                    >
                      {copiedItem === `slogan-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedItem === `slogan-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => handleApplySlogan(slogan)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors ${
                        llcData.tagline === slogan
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                      }`}
                    >
                      {llcData.tagline === slogan ? 'Active Slogan' : 'Apply'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette Selector */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-emerald-400" />
            Curated Corporate Color Systems
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Selected for contrast compliance, commercial banking credibility, and formal legal document presentations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_PALETTES.map((pal) => {
            const isSelected = selectedPalette.id === pal.id;
            return (
              <div
                key={pal.id}
                onClick={() => setSelectedPalette(pal)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                    : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{pal.name}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block font-mono">{pal.category}</span>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{pal.description}</p>
                </div>

                {/* Swatches */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="grid grid-cols-4 gap-1.5 h-8 rounded-lg overflow-hidden">
                    <div style={{ backgroundColor: pal.primary }} title={`Primary: ${pal.primary}`} />
                    <div style={{ backgroundColor: pal.secondary }} title={`Secondary: ${pal.secondary}`} />
                    <div style={{ backgroundColor: pal.accent }} title={`Accent: ${pal.accent}`} />
                    <div style={{ backgroundColor: pal.background }} title={`Background: ${pal.background}`} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{pal.primary}</span>
                    <span>{pal.accent}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography System */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-emerald-400" />
            Executive Typography Hierarchy
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Engineered header and body font pairings matching institutional and tech-forward standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FONT_PAIRINGS.map((font) => {
            const isSelected = selectedFont.id === font.id;
            return (
              <div
                key={font.id}
                onClick={() => setSelectedFont(font)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{font.name}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <div className="text-[11px] font-mono text-emerald-400 mb-2">
                  {font.headingFont} + {font.bodyFont}
                </div>

                <p className="text-xs text-slate-400 mb-4">{font.style}</p>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-sm font-bold text-slate-200 truncate">{font.sampleHeading}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{font.sampleBody}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Milestone Step Action Bar */}
      <div className="p-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Brand Assets Standardized</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Proceed to configure your custom domain, Google Workspace email, and verified DNS security records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onGoToDomainEmail && (
            <button
              onClick={onGoToDomainEmail}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Next: Domain & Email Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
