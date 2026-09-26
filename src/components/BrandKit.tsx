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
  FileSpreadsheet,
  Upload,
  Image as ImageIcon,
  Trash2,
  X,
  Sliders,
  Phone,
  Globe,
  Mail,
  QrCode,
  Printer,
  RotateCw,
  Edit3
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
  
  // Custom monogram upload and slogan settings
  const [activeAssetTab, setActiveAssetTab] = useState<'generator' | 'upload'>(
    llcData.customLogoUrl ? 'upload' : 'generator'
  );
  const [includeSloganInEmblem, setIncludeSloganInEmblem] = useState<boolean>(true);
  const [customSloganInput, setCustomSloganInput] = useState<string>(llcData.tagline || '');

  // Business Card Suite State
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [showCardEditor, setShowCardEditor] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [printStatusMessage, setPrintStatusMessage] = useState<string | null>(null);
  const [cardFields, setCardFields] = useState({
    name: llcData.members[0]?.fullName || 'Alexander Vance',
    title: llcData.members[0]?.title || 'Managing Member',
    email: `founder@${(llcData.businessName || 'vanguardsynergy').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    phone: '+1 (512) 800-4921',
    website: `www.${(llcData.businessName || 'vanguardsynergy').toLowerCase().replace(/[^a-z0-9]/g, '')}.biz`,
  });

  const escapeXml = (unsafe: string) => {
    return (unsafe || '').replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  const generateCardSvg = (side: 'front' | 'back'): string => {
    const width = 1050;
    const height = 600;
    const primary = selectedPalette.primary;
    const secondary = selectedPalette.secondary;
    const accent = selectedPalette.accent;

    if (side === 'front') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" rx="28" fill="${primary}"/>
        <circle cx="950" cy="100" r="280" fill="${accent}" opacity="0.18"/>
        <rect x="70" y="70" width="130" height="130" rx="26" fill="${secondary}" stroke="${accent}" stroke-width="4"/>
        ${
          llcData.customLogoUrl
            ? `<image href="${llcData.customLogoUrl}" x="80" y="80" width="110" height="110" preserveAspectRatio="xMidYMid meet"/>`
            : `<text x="135" y="152" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-weight="bold" font-size="52">${escapeXml(initials)}</text>`
        }
        <text x="230" y="125" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="44" letter-spacing="0.5">${escapeXml(brandName)}</text>
        <text x="232" y="165" fill="${accent}" font-family="monospace" font-weight="bold" font-size="24" letter-spacing="2">${escapeXml(llcData.suffix)} · STATE OF ${escapeXml(llcData.formationState)}</text>
        ${
          llcData.tagline
            ? `<text x="232" y="215" fill="#CBD5E1" font-family="sans-serif" font-style="italic" font-weight="500" font-size="24">"${escapeXml(llcData.tagline)}"</text>`
            : ''
        }
        <line x1="70" y1="440" x2="980" y2="440" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2"/>
        <text x="70" y="380" fill="#FFFFFF" font-family="sans-serif" font-weight="bold" font-size="40">${escapeXml(cardFields.name)}</text>
        <text x="70" y="418" fill="#94A3B8" font-family="monospace" font-size="24">${escapeXml(cardFields.title)}</text>
        <text x="70" y="490" fill="#E2E8F0" font-family="monospace" font-size="24">${escapeXml(cardFields.email)}   ·   ${escapeXml(cardFields.phone)}</text>
        <text x="70" y="530" fill="#94A3B8" font-family="monospace" font-size="22">${escapeXml(llcData.officeCity || 'Corporate HQ')}, ${escapeXml(llcData.officeState || llcData.formationState)}   ·   ${escapeXml(cardFields.website)}</text>
        <circle cx="970" cy="80" r="14" fill="${accent}"/>
      </svg>`;
    } else {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" rx="28" fill="${primary}"/>
        <circle cx="525" cy="300" r="300" fill="${accent}" opacity="0.14"/>
        <text x="70" y="80" fill="#64748B" font-family="monospace" font-size="22" letter-spacing="3">STATUTORY ENTITY</text>
        <text x="980" y="80" text-anchor="end" fill="#64748B" font-family="monospace" font-size="22" letter-spacing="3">STATE OF ${escapeXml(llcData.formationState)}</text>
        <rect x="445" y="130" width="160" height="160" rx="34" fill="${secondary}" stroke="${accent}" stroke-width="5"/>
        ${
          llcData.customLogoUrl
            ? `<image href="${llcData.customLogoUrl}" x="460" y="145" width="130" height="130" preserveAspectRatio="xMidYMid meet"/>`
            : `<text x="525" y="235" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-weight="bold" font-size="68">${escapeXml(initials)}</text>`
        }
        <text x="525" y="360" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="46" letter-spacing="2">${escapeXml(brandName).toUpperCase()}</text>
        <text x="525" y="405" text-anchor="middle" fill="${accent}" font-family="monospace" font-weight="bold" font-size="26" letter-spacing="3">${escapeXml(cardFields.website)}</text>
        ${
          llcData.tagline
            ? `<text x="525" y="455" text-anchor="middle" fill="#CBD5E1" font-family="sans-serif" font-style="italic" font-weight="500" font-size="24">"${escapeXml(llcData.tagline)}"</text>`
            : ''
        }
        <line x1="70" y1="520" x2="980" y2="520" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="2"/>
        <text x="70" y="560" fill="#64748B" font-family="monospace" font-size="20">Official Business Card · 300 DPI</text>
        <text x="980" y="560" text-anchor="end" fill="#64748B" font-family="monospace" font-size="20">Limited Liability Company</text>
      </svg>`;
    }
  };

  const handleDownloadCardPng = (side: 'front' | 'back') => {
    setIsExporting(true);
    try {
      const svgString = generateCardSvg(side);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1050;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1050, 600);
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const pngUrl = URL.createObjectURL(pngBlob);
              const link = document.createElement('a');
              link.href = pngUrl;
              link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_business_card_${side}_300dpi.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(pngUrl);
            }
            setIsExporting(false);
          }, 'image/png');
        } else {
          setIsExporting(false);
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        setIsExporting(false);
        handleDownloadCardSvg(side);
      };
      img.src = url;
    } catch (err) {
      console.error(err);
      setIsExporting(false);
      handleDownloadCardSvg(side);
    }
  };

  const handleDownloadCardSvg = (side: 'front' | 'back') => {
    const svgString = generateCardSvg(side);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_business_card_${side}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTriggerBrowserPrint = () => {
    try {
      window.print();
    } catch (e) {
      setPrintStatusMessage("The browser sandbox prevented direct modal printing. Please download the 300 DPI PNG cards to print locally or upload directly to VistaPrint!");
    }
  };

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
    setCustomSloganInput(slogan);
  };

  // Upload Custom Monogram / Logo Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        updateLLCData({ customLogoUrl: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    updateLLCData({ customLogoUrl: undefined });
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
        {/* Left: Vector Logo Emblem Preview & Custom Upload */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Corporate Monogram Emblem
              </h3>
              <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-700">
                <button
                  onClick={() => setActiveAssetTab('generator')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors cursor-pointer ${
                    activeAssetTab === 'generator'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vector
                </button>
                <button
                  onClick={() => setActiveAssetTab('upload')}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    activeAssetTab === 'upload'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Upload</span>
                  {llcData.customLogoUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>}
                </button>
              </div>
            </div>

            {/* TAB 1: Built-in Vector Emblem with Slogan */}
            {activeAssetTab === 'generator' && (
              <div className="space-y-4">
                {/* Emblem Canvas */}
                <div 
                  className="w-full aspect-square rounded-2xl flex items-center justify-center p-6 transition-all duration-300 shadow-inner relative overflow-hidden"
                  style={{ backgroundColor: selectedPalette.primary }}
                >
                  {includeSloganInEmblem ? (
                    <svg 
                      id="brand-logo-svg" 
                      viewBox="0 0 240 240" 
                      className="w-full h-full filter drop-shadow-md"
                    >
                      {/* Top Crest */}
                      <g transform="translate(20, 10)">
                        {logoStyle === 'shield' && (
                          <path 
                            d="M100 10 L155 30 L155 75 C155 105 100 125 100 125 C100 125 45 105 45 75 L45 30 Z" 
                            fill={selectedPalette.secondary} 
                            stroke={selectedPalette.accent} 
                            strokeWidth="4" 
                          />
                        )}
                        {logoStyle === 'hexagon' && (
                          <polygon 
                            points="100,10 155,36 155,90 100,118 45,90 45,36" 
                            fill={selectedPalette.secondary} 
                            stroke={selectedPalette.accent} 
                            strokeWidth="4" 
                          />
                        )}
                        {logoStyle === 'circle' && (
                          <circle 
                            cx="100" 
                            cy="65" 
                            r="52" 
                            fill={selectedPalette.secondary} 
                            stroke={selectedPalette.accent} 
                            strokeWidth="4" 
                          />
                        )}
                        {logoStyle === 'monogram' && (
                          <rect 
                            x="50" 
                            y="15" 
                            width="100" 
                            height="100" 
                            rx="22" 
                            fill={selectedPalette.secondary} 
                            stroke={selectedPalette.accent} 
                            strokeWidth="4" 
                          />
                        )}
                        <text 
                          x="100" 
                          y="72" 
                          textAnchor="middle" 
                          dominantBaseline="middle" 
                          fill={selectedPalette.accent} 
                          fontSize="36" 
                          fontWeight="bold" 
                          fontFamily="'Plus Jakarta Sans', sans-serif" 
                          letterSpacing="2"
                        >
                          {initials}
                        </text>
                      </g>

                      {/* Brand Name in Seal */}
                      <text 
                        x="120" 
                        y="162" 
                        textAnchor="middle" 
                        fill="#FFFFFF" 
                        fontSize="13" 
                        fontWeight="800" 
                        fontFamily="'Plus Jakarta Sans', sans-serif" 
                        letterSpacing="1.5"
                      >
                        {brandName.toUpperCase()}
                      </text>

                      {/* Accent Divider Line */}
                      <line 
                        x1="55" 
                        y1="174" 
                        x2="185" 
                        y2="174" 
                        stroke={selectedPalette.accent} 
                        strokeWidth="1.5" 
                        strokeOpacity="0.8" 
                      />

                      {/* Active Slogan in Seal */}
                      <text 
                        x="120" 
                        y="194" 
                        textAnchor="middle" 
                        fill={selectedPalette.accent} 
                        fontSize="9" 
                        fontWeight="600" 
                        fontFamily="'Plus Jakarta Sans', sans-serif" 
                        letterSpacing="0.6"
                      >
                        {llcData.tagline 
                          ? (llcData.tagline.length > 38 ? `${llcData.tagline.slice(0, 36)}...` : llcData.tagline) 
                          : 'BUILDING SUSTAINABLE VALUE'}
                      </text>
                    </svg>
                  ) : (
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
                  )}
                </div>

                {/* Slogan Toggle & Style Row */}
                <div className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-xl border border-slate-700/80">
                  <span className="text-[11px] text-slate-300 font-medium">Emblem Slogan:</span>
                  <button
                    onClick={() => setIncludeSloganInEmblem(!includeSloganInEmblem)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-all cursor-pointer ${
                      includeSloganInEmblem 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {includeSloganInEmblem ? '✓ Slogan Included' : 'Compact (Initials Only)'}
                  </button>
                </div>

                {/* Emblem Style Selector */}
                <div className="grid grid-cols-4 gap-2">
                  {(['shield', 'hexagon', 'circle', 'monogram'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setLogoStyle(style)}
                      className={`py-1.5 text-xs font-semibold rounded-lg capitalize border transition-all cursor-pointer ${
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
            )}

            {/* TAB 2: Upload Custom Monogram / Logo */}
            {activeAssetTab === 'upload' && (
              <div className="space-y-4">
                <div 
                  className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 transition-all bg-slate-900/80 relative group"
                >
                  {llcData.customLogoUrl ? (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
                      <img 
                        src={llcData.customLogoUrl} 
                        alt="Custom Corporate Monogram" 
                        className="max-h-40 max-w-full object-contain filter drop-shadow-md rounded-lg"
                      />
                      <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Custom Logo Active</span>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer text-center space-y-3">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Click or drag your monogram / logo</p>
                        <p className="text-[10px] text-slate-400 mt-1">Supports SVG, PNG, JPG, WebP (up to 5MB)</p>
                      </div>
                      <span className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700">
                        Select File
                      </span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Uploaded Controls */}
                {llcData.customLogoUrl ? (
                  <div className="flex items-center gap-2">
                    <label className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace</span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </label>
                    <button
                      onClick={handleRemoveCustomLogo}
                      className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 leading-relaxed text-center">
                    Your custom monogram will automatically replace the generated initials on your executive business cards and company letterheads.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Export Actions Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
            {activeAssetTab === 'generator' ? (
              <>
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
              </>
            ) : llcData.customLogoUrl ? (
              <a
                href={llcData.customLogoUrl}
                download={`${brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_logo`}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Custom Logo</span>
              </a>
            ) : (
              <div className="text-[11px] text-slate-500 text-center w-full py-1">
                Upload a file to enable download
              </div>
            )}
          </div>
        </div>

        {/* Right 2 cols: Live Corporate Business Card & Letterhead Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Business Card Mockup & Suite */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  Executive Business Card Suite
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Standard 3.5" x 2" Ratio · Print-Ready Vector</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Front / Back Switcher */}
                <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setCardSide('front')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      cardSide === 'front'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Front Side
                  </button>
                  <button
                    onClick={() => setCardSide('back')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      cardSide === 'back'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Back Side</span>
                  </button>
                </div>

                {/* Direct 300 DPI Download Button */}
                <button
                  onClick={() => handleDownloadCardPng(cardSide)}
                  disabled={isExporting}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  title="Download Current Side as 300 DPI PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Generating...' : 'Download (300 DPI)'}</span>
                </button>

                {/* Print & Export Suite Modal Trigger */}
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open Print & Export Suite"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Print / Export Suite</span>
                </button>

                {/* Edit Card Fields Toggle */}
                <button
                  onClick={() => setShowCardEditor(!showCardEditor)}
                  className={`p-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    showCardEditor 
                      ? 'bg-slate-700 text-emerald-300 border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title="Customize Card Contact Details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Card Editor Drawer */}
            {showCardEditor && (
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Customize Card Details</span>
                  <button 
                    onClick={() => setShowCardEditor(false)}
                    className="text-slate-400 hover:text-white text-[11px]"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Executive Name</label>
                    <input
                      type="text"
                      value={cardFields.name}
                      onChange={(e) => setCardFields({ ...cardFields, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={cardFields.title}
                      onChange={(e) => setCardFields({ ...cardFields, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Business Email</label>
                    <input
                      type="text"
                      value={cardFields.email}
                      onChange={(e) => setCardFields({ ...cardFields, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Telephone Number</label>
                    <input
                      type="text"
                      value={cardFields.phone}
                      onChange={(e) => setCardFields({ ...cardFields, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-1">Commercial Website</label>
                    <input
                      type="text"
                      value={cardFields.website}
                      onChange={(e) => setCardFields({ ...cardFields, website: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* LIVE CARD CANVAS: FRONT OR BACK */}
            {cardSide === 'front' ? (
              /* FRONT SIDE */
              <div 
                className="w-full max-w-lg mx-auto aspect-[1.75/1] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl border transition-all duration-300 relative overflow-hidden group"
                style={{
                  backgroundColor: selectedPalette.primary,
                  borderColor: selectedPalette.secondary,
                  color: '#FFFFFF'
                }}
              >
                {/* Decorative accent background slash */}
                <div 
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-25 filter blur-2xl pointer-events-none"
                  style={{ backgroundColor: selectedPalette.accent }}
                />

                {/* Top Section: Logo, Company Name, Suffix & Full Slogan */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start gap-3.5">
                    {/* Monogram / Logo Mark */}
                    <div 
                      className="w-13 h-13 rounded-xl flex items-center justify-center font-bold font-mono text-sm border shadow-md overflow-hidden shrink-0 mt-0.5 bg-slate-900/60"
                      style={{
                        backgroundColor: selectedPalette.secondary,
                        borderColor: selectedPalette.accent,
                        color: selectedPalette.accent
                      }}
                    >
                      {llcData.customLogoUrl ? (
                        <img 
                          src={llcData.customLogoUrl} 
                          alt="Company Logo" 
                          className="w-full h-full object-contain p-1" 
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
                          {brandName}
                        </h4>
                        <span 
                          className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10"
                          style={{ color: selectedPalette.accent }}
                        >
                          {llcData.suffix} · {llcData.formationState}
                        </span>
                      </div>

                      {/* Full Slogan with graceful multi-line display (No truncation ellipsis) */}
                      {llcData.tagline && (
                        <p className="text-[11px] sm:text-[11.5px] leading-snug text-slate-200/95 italic font-medium pt-0.5 max-w-[360px]">
                          "{llcData.tagline}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div 
                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 shadow-sm"
                    style={{ backgroundColor: selectedPalette.accent }}
                  />
                </div>

                {/* Bottom Section: Executive Member Info & Contacts */}
                <div className="relative z-10 space-y-1.5 pt-3">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {cardFields.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-300 font-mono">
                      {cardFields.title}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[9.5px] sm:text-[10px] text-slate-300 font-mono">
                    <div className="flex items-center gap-3">
                      <span>{cardFields.email}</span>
                      <span>·</span>
                      <span>{cardFields.phone}</span>
                    </div>
                    <div className="text-slate-400">
                      <span>{llcData.officeCity || 'Corporate HQ'}, {llcData.officeState || llcData.formationState}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* BACK SIDE */
              <div 
                className="w-full max-w-lg mx-auto aspect-[1.75/1] rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-between shadow-2xl border transition-all duration-300 relative overflow-hidden text-center"
                style={{
                  backgroundColor: selectedPalette.primary,
                  borderColor: selectedPalette.secondary,
                  color: '#FFFFFF'
                }}
              >
                {/* Background glow and subtle geometry */}
                <div 
                  className="absolute inset-0 opacity-15 filter blur-3xl pointer-events-none"
                  style={{ backgroundColor: selectedPalette.accent }}
                />

                <div className="w-full flex items-center justify-between text-[9px] font-mono tracking-widest uppercase text-slate-400">
                  <span>STATUTORY ENTITY</span>
                  <span>STATE OF {llcData.formationState}</span>
                </div>

                {/* Center Corporate Seal */}
                <div className="flex flex-col items-center justify-center space-y-2 relative z-10 my-auto">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold font-mono text-xl border-2 shadow-2xl overflow-hidden bg-slate-900/80"
                    style={{
                      backgroundColor: selectedPalette.secondary,
                      borderColor: selectedPalette.accent,
                      color: selectedPalette.accent
                    }}
                  >
                    {llcData.customLogoUrl ? (
                      <img 
                        src={llcData.customLogoUrl} 
                        alt="Company Logo" 
                        className="w-full h-full object-contain p-1.5" 
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base sm:text-lg tracking-wider text-white uppercase">
                      {brandName}
                    </h4>
                    <span 
                      className="text-[10px] font-mono uppercase tracking-widest block font-semibold mt-0.5"
                      style={{ color: selectedPalette.accent }}
                    >
                      {cardFields.website}
                    </span>
                  </div>

                  {llcData.tagline && (
                    <p className="text-[10.5px] italic text-slate-300 max-w-xs leading-tight">
                      "{llcData.tagline}"
                    </p>
                  )}
                </div>

                <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>Official Business Card · 300 DPI</span>
                  <span>Limited Liability Company</span>
                </div>
              </div>
            )}
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

            {/* Custom Slogan Input Field */}
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-slate-900 rounded-xl border border-slate-700/80">
              <input
                type="text"
                value={customSloganInput}
                onChange={(e) => setCustomSloganInput(e.target.value)}
                placeholder="Type your custom company slogan or value proposition..."
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-medium"
              />
              <button
                onClick={() => {
                  if (customSloganInput.trim()) {
                    handleApplySlogan(customSloganInput.trim());
                  }
                }}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Set Active Slogan
              </button>
            </div>

            {/* Curated Slogans List */}
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
                          ? 'bg-emerald-500 text-slate-950 font-bold'
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

      {/* Print & Export Suite Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Executive Business Card Print & Export Suite</h3>
                  <p className="text-xs text-slate-400 font-mono">Standard 3.5" x 2" Ratio · 300 DPI High-Resolution Output</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPrintModal(false);
                  setPrintStatusMessage(null);
                }}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Print Sandbox Notice Banner */}
            <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div className="leading-relaxed">
                <strong>Commercial Print Guarantee:</strong> Web containers often sandbox browser-level <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded font-mono text-[11px]">window.print()</code> popups. Use the <strong>300 DPI PNG downloads</strong> below to get flawless pixel-perfect cards ready for local desktop printing or direct upload to <strong>VistaPrint, Staples, Office Depot, or Moo</strong>.
              </div>
            </div>

            {/* Side-by-Side Previews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Front Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Front Side (Contact & Slogan)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">1050 × 600 px (300 DPI)</span>
                </div>
                <div 
                  className="w-full aspect-[1.75/1] rounded-xl p-4 flex flex-col justify-between shadow-lg border relative overflow-hidden"
                  style={{
                    backgroundColor: selectedPalette.primary,
                    borderColor: selectedPalette.secondary,
                    color: '#FFFFFF'
                  }}
                >
                  <div className="flex items-start gap-2.5 relative z-10">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold font-mono text-xs border overflow-hidden shrink-0 bg-slate-900/60"
                      style={{
                        backgroundColor: selectedPalette.secondary,
                        borderColor: selectedPalette.accent,
                        color: selectedPalette.accent
                      }}
                    >
                      {llcData.customLogoUrl ? (
                        <img src={llcData.customLogoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-extrabold text-xs text-white leading-tight">{brandName}</div>
                      <div className="text-[8.5px] font-mono" style={{ color: selectedPalette.accent }}>
                        {llcData.suffix} · {llcData.formationState}
                      </div>
                      {llcData.tagline && (
                        <div className="text-[8.5px] text-slate-300 italic pt-0.5 line-clamp-1 max-w-[200px]">
                          "{llcData.tagline}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative z-10 space-y-0.5 pt-2">
                    <div className="text-[10.5px] font-bold text-white">{cardFields.name}</div>
                    <div className="text-[8px] text-slate-300 font-mono">{cardFields.title}</div>
                    <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[7.5px] text-slate-300 font-mono">
                      <span>{cardFields.email}</span>
                      <span>{cardFields.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleDownloadCardPng('front')}
                    disabled={isExporting}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Front (300 DPI PNG)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadCardSvg('front')}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    title="Download Front Vector SVG"
                  >
                    SVG
                  </button>
                </div>
              </div>

              {/* Back Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Back Side (Corporate Seal & URL)</span>
                  <span className="text-[10px] text-emerald-400 font-mono">1050 × 600 px (300 DPI)</span>
                </div>
                <div 
                  className="w-full aspect-[1.75/1] rounded-xl p-4 flex flex-col items-center justify-between shadow-lg border relative overflow-hidden text-center"
                  style={{
                    backgroundColor: selectedPalette.primary,
                    borderColor: selectedPalette.secondary,
                    color: '#FFFFFF'
                  }}
                >
                  <div className="w-full flex items-center justify-between text-[7px] font-mono tracking-widest uppercase text-slate-400">
                    <span>STATUTORY ENTITY</span>
                    <span>STATE OF {llcData.formationState}</span>
                  </div>

                  <div className="flex flex-col items-center my-auto space-y-1">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm border overflow-hidden bg-slate-900/80"
                      style={{
                        backgroundColor: selectedPalette.secondary,
                        borderColor: selectedPalette.accent,
                        color: selectedPalette.accent
                      }}
                    >
                      {llcData.customLogoUrl ? (
                        <img src={llcData.customLogoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="font-extrabold text-xs text-white uppercase">{brandName}</div>
                    <div className="text-[8px] font-mono font-semibold" style={{ color: selectedPalette.accent }}>
                      {cardFields.website}
                    </div>
                  </div>

                  <div className="w-full pt-1 border-t border-white/10 flex items-center justify-between text-[7px] font-mono text-slate-400">
                    <span>300 DPI Print Spec</span>
                    <span>Limited Liability Company</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleDownloadCardPng('back')}
                    disabled={isExporting}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Back (300 DPI PNG)</span>
                  </button>
                  <button
                    onClick={() => handleDownloadCardSvg('back')}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    title="Download Back Vector SVG"
                  >
                    SVG
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleTriggerBrowserPrint}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Open Browser Print Dialog</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleDownloadCardPng('front');
                    setTimeout(() => handleDownloadCardPng('back'), 400);
                  }}
                  className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-950/40"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete 2-Sided Set (300 DPI)</span>
                </button>
              </div>
            </div>

            {printStatusMessage && (
              <p className="text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-center font-mono">
                {printStatusMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
