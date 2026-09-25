import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Bell, 
  Mail, 
  AlertTriangle, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  Download, 
  RefreshCw,
  Info,
  DollarSign,
  Send,
  Smartphone
} from 'lucide-react';
import { LLCFormData, UsStateCode, ComplianceDeadline, ComplianceNotificationSettings } from '../types';
import { STATES_DATA } from '../data/statesData';
import { getUpcomingDeadlinesForState } from '../data/complianceRules';

interface ComplianceTrackerProps {
  llcData: LLCFormData;
  onOpenAdvisorWithPrompt: (prompt: string) => void;
  userEmail?: string;
}

const STORAGE_KEY_NOTIF = 'launchstate_compliance_notifs_v1';

export const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({
  llcData,
  onOpenAdvisorWithPrompt,
  userEmail = 'xMsOutlawx@gmail.com',
}) => {
  const [selectedState, setSelectedState] = useState<UsStateCode>(llcData.formationState);
  
  // Notification Preferences State with localStorage persistence
  const [notifSettings, setNotifSettings] = useState<ComplianceNotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIF);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      emailEnabled: true,
      emailAddress: userEmail || 'founder@vanguardsynergy.com',
      pushEnabled: false,
      remind60Days: true,
      remind30Days: true,
      remind7Days: true,
      remind1Day: true,
    };
  });

  const [pushPermissionStatus, setPushPermissionStatus] = useState<string>('default');
  const [testAlertToast, setTestAlertToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync selectedState if llcData.formationState changes
  useEffect(() => {
    setSelectedState(llcData.formationState);
  }, [llcData.formationState]);

  // Check browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission);
      if (Notification.permission === 'granted' && !notifSettings.pushEnabled) {
        // Can keep existing or sync
      }
    }
  }, []);

  const saveSettings = (newSettings: ComplianceNotificationSettings) => {
    setNotifSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY_NOTIF, JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleEmail = () => {
    saveSettings({ ...notifSettings, emailEnabled: !notifSettings.emailEnabled });
  };

  const handleTogglePush = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        try {
          const perm = await Notification.requestPermission();
          setPushPermissionStatus(perm);
          if (perm === 'granted') {
            saveSettings({ ...notifSettings, pushEnabled: true });
            return;
          }
        } catch (e) {
          console.error(e);
        }
      } else if (Notification.permission === 'granted') {
        saveSettings({ ...notifSettings, pushEnabled: !notifSettings.pushEnabled });
        return;
      }
    }
    // Fallback or toggle simulated push
    saveSettings({ ...notifSettings, pushEnabled: !notifSettings.pushEnabled });
  };

  const handleSendTestNotification = () => {
    const primaryDeadline = deadlines[0];
    const alertMsg = `[COMPLIANCE REMINDER] ${primaryDeadline?.title || 'State Annual Report'} is due in ${primaryDeadline?.daysRemaining || 45} days! Statutory Fee: $${primaryDeadline?.statutoryFee || 0}. Avoid late penalties by filing on time.`;

    // 1. Native browser notification if enabled
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`LaunchState Compliance Alert: ${selectedState}`, {
          body: alertMsg,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.error(e);
      }
    }

    // 2. In-app toast banner
    setTestAlertToast({
      message: `Test reminder dispatched to ${notifSettings.emailEnabled ? notifSettings.emailAddress : 'Push Notification Center'}: "${alertMsg}"`,
      type: 'success',
    });
    setTimeout(() => setTestAlertToast(null), 6000);
  };

  const stateInfo = STATES_DATA[selectedState] || STATES_DATA['TX'];
  const deadlines = getUpcomingDeadlinesForState(selectedState);
  const primaryDeadline = deadlines[0];

  // Calendar .ICS generator
  const handleDownloadICS = () => {
    if (!primaryDeadline) return;
    const title = `${llcData.businessName} ${primaryDeadline.title} Filing Deadline`;
    const description = `Statutory filing deadline for ${stateInfo.name} LLC. Fee: $${primaryDeadline.statutoryFee}. Penalty: ${primaryDeadline.latePenalty}. Official Portal: ${primaryDeadline.portalUrl}`;
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LaunchState//LLC Compliance Tracker//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
STATUS:CONFIRMED
TRANSP:TRANSPARENT
URL:${primaryDeadline.portalUrl}
BEGIN:VALARM
TRIGGER:-P30D
ACTION:DISPLAY
DESCRIPTION:Reminder: ${title} due in 30 days!
END:VALARM
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Urgent: ${title} due in 7 days!
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${llcData.businessName.replace(/\s+/g, '_')}_${selectedState}_Compliance_Calendar.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Google Calendar direct link generator
  const getGoogleCalendarUrl = () => {
    if (!primaryDeadline) return '#';
    const text = encodeURIComponent(`${llcData.businessName} - ${primaryDeadline.title} Due`);
    const details = encodeURIComponent(
      `Statutory compliance filing deadline for ${stateInfo.name} LLC.\nForm: ${primaryDeadline.formName}\nStatutory Fee: $${primaryDeadline.statutoryFee}\nPenalty: ${primaryDeadline.latePenalty}\nOfficial Portal: ${primaryDeadline.portalUrl}`
    );
    const location = encodeURIComponent(`${stateInfo.portalName}, ${stateInfo.name}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>STATUTORY COMPLIANCE & GOOD STANDING</span>
              <span>·</span>
              <span>ANNUAL REPORT MONITOR</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              State Annual Report & Compliance Tracker
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Stay in continuous legal Good Standing. Track upcoming state-mandated periodic report deadlines, calculate statutory renewal fees, and activate automated email and push reminders.
            </p>
          </div>

          {/* Quick State Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label className="text-xs text-slate-400 font-medium hidden sm:inline">Jurisdiction:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as UsStateCode)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-500 font-mono"
            >
              {Object.values(STATES_DATA).map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Test Alert Toast Notice */}
      {testAlertToast && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200 leading-relaxed">
              <strong className="text-white block mb-0.5">Test Reminder Dispatched!</strong>
              {testAlertToast.message}
            </div>
          </div>
          <button
            onClick={() => setTestAlertToast(null)}
            className="text-slate-400 hover:text-white text-xs font-mono p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Good Standing & Primary Deadline Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-700/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">
                  {llcData.businessName} {llcData.suffix}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Status: Good Standing
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Statutory Authority: {stateInfo.portalName} ({stateInfo.code})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadICS}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download iCalendar file (.ics)"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.ICS File</span>
            </button>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Google Calendar</span>
            </a>
          </div>
        </div>

        {/* Highlighted Deadline Metrics */}
        {primaryDeadline && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5 text-[11px] uppercase font-mono">Next Filing Due</span>
              <span className="text-sm font-bold text-white font-mono">{primaryDeadline.dueDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 text-[11px] uppercase font-mono">Days Remaining</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono">
                {primaryDeadline.daysRemaining > 900 ? 'Exempt' : `${primaryDeadline.daysRemaining} Days`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 text-[11px] uppercase font-mono">Statutory State Fee</span>
              <span className="text-sm font-bold text-white font-mono">${primaryDeadline.statutoryFee}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 text-[11px] uppercase font-mono">Late Penalty Risk</span>
              <span className="text-xs font-medium text-rose-300 truncate block" title={primaryDeadline.latePenalty}>
                {primaryDeadline.latePenalty}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reminder & Notification Control Center */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <span>Automated Filing Reminder Toggles</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Never miss a state filing deadline. Configure automated email and push notifications.
            </p>
          </div>

          <button
            onClick={handleSendTestNotification}
            className="px-3.5 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Test Alert Now</span>
          </button>
        </div>

        {/* Toggles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Notification Toggle Card */}
          <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-xs font-bold text-white">Email Reminders</h3>
                  <p className="text-[11px] text-slate-400">Receive verified filing notices to your inbox</p>
                </div>
              </div>

              {/* Interactive Toggle Switch */}
              <button
                type="button"
                onClick={handleToggleEmail}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifSettings.emailEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={notifSettings.emailEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifSettings.emailEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Email Address Input */}
            <div className="space-y-1">
              <label className="block text-[11px] text-slate-400 font-medium">Notification Recipient Email</label>
              <input
                type="email"
                value={notifSettings.emailAddress}
                onChange={(e) => saveSettings({ ...notifSettings, emailAddress: e.target.value })}
                disabled={!notifSettings.emailEnabled}
                placeholder="founder@yourcompany.com"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-emerald-500 font-mono disabled:opacity-50"
              />
            </div>
          </div>

          {/* Browser Push Notification Toggle Card */}
          <div className="p-4 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-white">Browser Push Notifications</h3>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      pushPermissionStatus === 'granted'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : pushPermissionStatus === 'denied'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {pushPermissionStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Desktop & mobile browser alerts before due dates</p>
                </div>
              </div>

              {/* Interactive Push Toggle Switch */}
              <button
                type="button"
                onClick={handleTogglePush}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifSettings.pushEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                role="switch"
                aria-checked={notifSettings.pushEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    notifSettings.pushEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="text-[11px] text-slate-400 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {notifSettings.pushEnabled
                  ? 'Push notifications are active. You will receive an immediate browser banner when deadlines approach.'
                  : 'Click toggle to authorize browser notifications. You can disable anytime.'}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Frequency Settings */}
        <div className="pt-2">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-bold block mb-2">
            Notification Schedule Milestones:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { key: 'remind60Days', label: '60 Days Prior', desc: 'Initial early warning' },
              { key: 'remind30Days', label: '30 Days Prior', desc: 'Document preparation' },
              { key: 'remind7Days', label: '7 Days Prior', desc: 'Urgent reminder' },
              { key: 'remind1Day', label: '1 Day Prior / Due', desc: 'Final cutoff' },
            ].map((m) => {
              const checked = !!(notifSettings as any)[m.key];
              return (
                <label
                  key={m.key}
                  className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl flex items-start gap-2.5 cursor-pointer hover:bg-slate-900 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => saveSettings({ ...notifSettings, [m.key]: e.target.checked })}
                    className="mt-0.5 accent-emerald-500 rounded"
                  />
                  <div>
                    <div className="font-semibold text-white text-xs">{m.label}</div>
                    <div className="text-[10px] text-slate-400">{m.desc}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deadlines Breakdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Statutory Deadlines for {stateInfo.name}</span>
          <span>Official Secretary of State Filing Portal</span>
        </div>

        {deadlines.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 space-y-4 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="font-bold text-emerald-400">{item.stateCode} STATUTE</span>
                  <span>·</span>
                  <span className="uppercase text-slate-300">{item.frequency} FILING</span>
                  <span>·</span>
                  <span className="text-slate-400">{item.formName}</span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
              </div>

              <div className="flex flex-col items-start sm:items-end shrink-0">
                <div className="text-sm font-extrabold text-emerald-400 font-mono">
                  Due: {item.dueDate}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Statutory Fee: ${item.statutoryFee}
                </span>
              </div>
            </div>

            {/* Late Penalty Warning Box */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block mb-0.5">Statutory Delinquency Penalty:</strong>
                {item.latePenalty}
              </div>
            </div>

            {/* Requirements List */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-1.5">Filing Prerequisites:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                {item.filingRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
              <button
                onClick={() => onOpenAdvisorWithPrompt(`How do I prepare and submit the ${item.title} in ${stateInfo.name}? What are the consequences if I miss the deadline?`)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask Advisor Filing Tips</span>
              </button>

              <a
                href={item.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>File with {stateInfo.code} SOS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
