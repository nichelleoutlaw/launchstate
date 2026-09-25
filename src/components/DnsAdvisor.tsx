import React, { useState } from 'react';
import { 
  Server, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  HelpCircle,
  Globe,
  Mail,
  Lock,
  FileCheck
} from 'lucide-react';
import { LLCFormData } from '../types';

interface DnsAdvisorProps {
  llcData: LLCFormData;
  onGoToGrants?: () => void;
  onGoToBankResolutions?: () => void;
}

export const DnsAdvisor: React.FC<DnsAdvisorProps> = ({
  llcData,
  onGoToGrants,
  onGoToBankResolutions,
}) => {
  const [provider, setProvider] = useState<'google' | 'microsoft'>('google');
  const [activeRegistrar, setActiveRegistrar] = useState<'godaddy' | 'namecheap' | 'cloudflare' | 'squarespace' | 'route53'>('cloudflare');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Interactive Checklist State
  const [verifiedRecords, setVerifiedRecords] = useState<{ [key: string]: boolean }>({
    mx: false,
    spf: false,
    dkim: false,
    dmarc: false,
    purgeOld: false,
  });

  const domain = (llcData.businessName || 'vanguardsynergy')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') + '.com';

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleVerified = (key: string) => {
    setVerifiedRecords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const verifiedCount = Object.values(verifiedRecords).filter(Boolean).length;
  const healthPercent = Math.round((verifiedCount / 5) * 100);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STEP 2: BRAND & IDENTITY</span>
              <span>·</span>
              <span>TECHNICAL INFRASTRUCTURE & AUTHENTICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <Server className="w-7 h-7 text-emerald-400" />
              <span>DNS MX, SPF, DKIM & DMARC Advisor</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Configure your exact DNS records for <span className="text-emerald-400 font-mono font-bold">{domain}</span> to guarantee 100% email deliverability and satisfy bank underwriting security audits.
            </p>
          </div>

          {/* Health Score Pill */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[11px] font-mono text-slate-400">DNS HEALTH SCORE</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">{healthPercent}%</div>
            </div>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Provider Switcher: Google Workspace vs Microsoft 365 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 p-1 bg-slate-800/80 border border-slate-700 rounded-xl">
          <button
            onClick={() => setProvider('google')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              provider === 'google'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Workspace (Gmail)
          </button>
          <button
            onClick={() => setProvider('microsoft')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              provider === 'microsoft'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Microsoft 365 (Exchange)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Target Domain: <strong className="text-white">{domain}</strong></span>
        </div>
      </div>

      {/* Primary DNS Records Table */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Exact DNS Records to Copy & Paste</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add these records in your domain registrar's DNS management console.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            TTL: 3600 (1 hour)
          </span>
        </div>

        <div className="space-y-4">
          {/* 1. MX RECORD */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded text-[11px] font-mono font-bold">
                  MX
                </span>
                <span className="text-xs font-bold text-white">Mail Exchange (Inbound Routing)</span>
              </div>
              <button
                onClick={() => handleCopy(provider === 'google' ? 'SMTP.GOOGLE.COM' : `${domain.replace('.com', '')}-com.mail.protection.outlook.com`, 'mx')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                {copiedId === 'mx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'mx' ? 'Copied' : 'Copy Value'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Host / Name</span>
                <span className="text-emerald-400 font-bold">@ (or blank)</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Priority</span>
                <span className="text-amber-400 font-bold">1</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 sm:col-span-2">
                <span className="text-[10px] text-slate-500 block uppercase">Points To / Server Target</span>
                <span className="text-slate-200 font-bold truncate block">
                  {provider === 'google' ? 'SMTP.GOOGLE.COM' : `${domain.replace('.com', '')}-com.mail.protection.outlook.com`}
                </span>
              </div>
            </div>
          </div>

          {/* 2. SPF RECORD */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-mono font-bold">
                  TXT (SPF)
                </span>
                <span className="text-xs font-bold text-white">Sender Policy Framework (Anti-Spoofing)</span>
              </div>
              <button
                onClick={() => handleCopy(provider === 'google' ? 'v=spf1 include:_spf.google.com ~all' : 'v=spf1 include:spf.protection.outlook.com -all', 'spf')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                {copiedId === 'spf' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'spf' ? 'Copied' : 'Copy Value'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Host / Name</span>
                <span className="text-emerald-400 font-bold">@ (or blank)</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 sm:col-span-3">
                <span className="text-[10px] text-slate-500 block uppercase">TXT Value</span>
                <span className="text-slate-200 font-bold truncate block">
                  {provider === 'google' ? 'v=spf1 include:_spf.google.com ~all' : 'v=spf1 include:spf.protection.outlook.com -all'}
                </span>
              </div>
            </div>

            {/* SPF Critical Warning */}
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-[11px] text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Crucial Rule:</strong> Never create two separate SPF TXT records. If you already have one for SendGrid, Shopify, or Mailchimp, merge them: <code className="text-white">v=spf1 include:_spf.google.com include:sendgrid.net ~all</code>.
              </span>
            </div>
          </div>

          {/* 3. DKIM RECORD */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-purple-500/15 text-purple-400 border border-purple-500/30 rounded text-[11px] font-mono font-bold">
                  TXT (DKIM)
                </span>
                <span className="text-xs font-bold text-white">DomainKeys Identified Mail (Cryptographic Signature)</span>
              </div>
              <button
                onClick={() => handleCopy('google._domainkey', 'dkim-host')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                {copiedId === 'dkim-host' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'dkim-host' ? 'Copied' : 'Copy Hostname'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Host / Name</span>
                <span className="text-emerald-400 font-bold">google._domainkey</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 sm:col-span-3">
                <span className="text-[10px] text-slate-500 block uppercase">Value / Public Key</span>
                <span className="text-slate-300 text-[11px] block italic truncate">
                  v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA... (Generated in Google Admin Console)
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <strong className="text-white">How to generate your unique DKIM public key:</strong>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                <li>Log in to <strong className="text-white">admin.google.com</strong> with your admin account.</li>
                <li>Go to <strong className="text-white">Apps &gt; Google Workspace &gt; Gmail &gt; Authenticate email</strong>.</li>
                <li>Select domain <code className="text-emerald-400">{domain}</code>, click <strong>Generate New Record</strong> (2048-bit key).</li>
                <li>Paste the key into DNS, then return to Google Admin and click <strong>Start Authentication</strong>.</li>
              </ol>
            </div>
          </div>

          {/* 4. DMARC RECORD */}
          <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded text-[11px] font-mono font-bold">
                  TXT (DMARC)
                </span>
                <span className="text-xs font-bold text-white">Domain-based Message Authentication & Reporting</span>
              </div>
              <button
                onClick={() => handleCopy(`v=DMARC1; p=quarantine; rua=mailto:admin@${domain}; pct=100; sp=none`, 'dmarc')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
              >
                {copiedId === 'dmarc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'dmarc' ? 'Copied' : 'Copy Value'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Host / Name</span>
                <span className="text-emerald-400 font-bold">_dmarc</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 sm:col-span-3">
                <span className="text-[10px] text-slate-500 block uppercase">TXT Value</span>
                <span className="text-slate-200 font-bold truncate block">
                  v=DMARC1; p=quarantine; rua=mailto:admin@{domain}; pct=100; sp=none
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registrar-Specific Step-by-Step Instructions */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white">Registrar-Specific Navigation Walkthrough</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click your domain registrar to view exact button clicks and menu paths:
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'cloudflare', label: 'Cloudflare' },
            { id: 'godaddy', label: 'GoDaddy' },
            { id: 'namecheap', label: 'Namecheap' },
            { id: 'squarespace', label: 'Squarespace (Google Domains)' },
            { id: 'route53', label: 'AWS Route 53' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRegistrar(r.id as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                activeRegistrar === r.id
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Selected Registrar Instructions */}
        <div className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs space-y-2 text-slate-300">
          {activeRegistrar === 'cloudflare' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Log in to the <strong>Cloudflare Dashboard</strong> and select your domain (<code className="text-emerald-400">{domain}</code>).</li>
              <li>Click <strong>DNS &gt; Records</strong> in the left navigation sidebar.</li>
              <li>Click <strong>Add Record</strong>: Select Type <strong>MX</strong>, Name: <code className="text-white">@</code>, Mail Server: <code className="text-white">SMTP.GOOGLE.COM</code>, Priority: <code className="text-white">1</code>.</li>
              <li>Click <strong>Save</strong>. Cloudflare will automatically set the proxy status to <em>DNS Only</em> for MX records.</li>
              <li>Repeat <strong>Add Record</strong> for your SPF (<code className="text-white">TXT</code>, <code className="text-white">@</code>) and DMARC (<code className="text-white">TXT</code>, <code className="text-white">_dmarc</code>).</li>
            </ol>
          )}

          {activeRegistrar === 'godaddy' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Log in to your <strong>GoDaddy Domain Portfolio</strong> and click on <code className="text-emerald-400">{domain}</code>.</li>
              <li>Click <strong>Manage DNS</strong> (or DNS tab).</li>
              <li>Scroll down to the <strong>Records</strong> list and delete any pre-existing default MX records pointing to <code className="text-rose-400">mail.secureserver.net</code>.</li>
              <li>Click <strong>Add New Record</strong> &gt; Type: <strong>MX</strong>, Name: <code className="text-white">@</code>, Value: <code className="text-white">SMTP.GOOGLE.COM</code>, Priority: <code className="text-white">1</code>, TTL: 1 hour.</li>
              <li>Click <strong>Save</strong>. Add TXT records for SPF and DMARC.</li>
            </ol>
          )}

          {activeRegistrar === 'namecheap' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Log in to <strong>Namecheap</strong> &gt; Click <strong>Domain List</strong> &gt; Click <strong>Manage</strong> next to <code className="text-emerald-400">{domain}</code>.</li>
              <li>Click the <strong>Advanced DNS</strong> tab at the top.</li>
              <li>Under <strong>Mail Settings</strong>, change the dropdown from <em>Namecheap Email</em> or <em>Private Email</em> to <strong>Gmail</strong> (or Custom MX).</li>
              <li>Add the MX record: Host: <code className="text-white">@</code>, Value: <code className="text-white">SMTP.GOOGLE.COM</code>, Priority: <code className="text-white">1</code>.</li>
              <li>Under Host Records, click <strong>Add New Record</strong> to insert the TXT records for SPF and DMARC.</li>
            </ol>
          )}

          {activeRegistrar === 'squarespace' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Log in to the <strong>Squarespace Domains</strong> dashboard and select <code className="text-emerald-400">{domain}</code>.</li>
              <li>Click <strong>DNS Settings</strong>.</li>
              <li>Under <strong>Custom Records</strong>, click <strong>Add Record</strong>.</li>
              <li>Set Record: <strong>MX</strong>, Host: <code className="text-white">@</code>, Priority: <code className="text-white">1</code>, Data: <code className="text-white">SMTP.GOOGLE.COM</code>.</li>
              <li>Click <strong>Save</strong> and repeat for SPF and DMARC TXT entries.</li>
            </ol>
          )}

          {activeRegistrar === 'route53' && (
            <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
              <li>Open the <strong>AWS Management Console</strong> and navigate to <strong>Route 53 Hosted Zones</strong>.</li>
              <li>Select the hosted zone for <code className="text-emerald-400">{domain}</code>.</li>
              <li>Click <strong>Create Record</strong> &gt; Routing policy: <em>Simple</em>.</li>
              <li>Define Record: Record type: <strong>MX</strong>, Record name: blank, Value: <code className="text-white">1 SMTP.GOOGLE.COM</code>, TTL: 300 or 3600.</li>
              <li>Click <strong>Create Records</strong>.</li>
            </ol>
          )}
        </div>
      </div>

      {/* Interactive Verification & Deliverability Checklist */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Interactive DNS Verification Checklist</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {verifiedCount} of 5 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'purgeOld', label: 'Purged old registrar placeholder MX records' },
            { id: 'mx', label: 'Added Google Workspace MX record (SMTP.GOOGLE.COM)' },
            { id: 'spf', label: 'Added unified SPF TXT record without duplicates' },
            { id: 'dkim', label: 'Generated and added 2048-bit DKIM TXT record' },
            { id: 'dmarc', label: 'Added DMARC TXT record for inbox policy protection' },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleVerified(item.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                verifiedRecords[item.id]
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-colors ${
                verifiedRecords[item.id]
                  ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                  : 'border-slate-600 bg-slate-800'
              }`}>
                {verifiedRecords[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* External Validation Tools Links */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-slate-400">Verify live propagation worldwide (15-60 min propagation):</span>
        <div className="flex items-center gap-3 font-mono">
          <a
            href={`https://mxtoolbox.com/SuperTool.aspx?action=mx%3a${encodeURIComponent(domain)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>MXToolbox</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>·</span>
          <a
            href={`https://www.whatsmydns.net/#MX/${encodeURIComponent(domain)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>WhatsMyDNS</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Footer Milestone Navigation */}
      <div className="p-6 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">Brand & Digital Identity Completed</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Your LLC now possesses institutional brand assets and verified email authentication. Next: Capital & Growth.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onGoToGrants && (
            <button
              onClick={onGoToGrants}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Step 3: Grants & Capital</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
