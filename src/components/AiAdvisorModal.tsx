import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  ShieldAlert, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2,
  RefreshCw,
  Globe,
  ExternalLink,
  RotateCcw,
  Scale,
  Calculator,
  Coins,
  Server,
  AtSign
} from 'lucide-react';
import { LLCFormData } from '../types';
import { getApiUrl } from '../utils/api';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  groundingSources?: { title: string; uri: string }[];
  usedSearch?: boolean;
}

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  llcData: LLCFormData;
  initialPrompt?: string;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  llcData,
  initialPrompt,
}) => {
  const [question, setQuestion] = useState<string>('');
  const [activeRole, setActiveRole] = useState<'legal' | 'tax' | 'funding' | 'infra'>('legal');
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Hello! I am your Corporate Formation, Capital & Digital Infrastructure Advisor with live Google Search grounding. I can advise you on:
• Choosing between home-state vs. Delaware/Wyoming LLC formation
• Single-member vs. Multi-member Operating Agreement structuring
• S-Corporation tax election strategy (IRS Form 2553)
• Domain, DNS, Google Workspace (MX, SPF, DKIM, DMARC) email deliverability
• City, state, and federal grants, SBA loans, and banking qualification

What question can I clarify for **${llcData.businessName || 'your business'}** in **${llcData.formationState}**?`,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setQuestion(initialPrompt);
      handleAskQuestion(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  if (!isOpen) return null;

  const handleAskQuestion = async (customQ?: string) => {
    const q = customQ || question;
    if (!q.trim() || loading) return;

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: q,
    };

    // Format conversation history for multi-turn model (role: 'user' | 'model')
    const historyPayload = messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/ai/business-advisor'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          state: llcData.formationState,
          industry: llcData.industry,
          businessName: `${llcData.businessName} ${llcData.suffix}`,
          managementType: llcData.managementType,
          role: activeRole,
          conversationHistory: historyPayload,
        }),
      });

      const data = await res.json();
      const assistantMessage: MessageItem = {
        id: `assist-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'I am ready to help with your formation questions.',
        groundingSources: data.groundingSources || [],
        usedSearch: data.source?.includes('search'),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: 'Notice: Could not contact the advisor engine. Generally, an LLC provides personal liability separation from business activities when you maintain a separate bank account and do not commingle personal funds.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-fresh',
        role: 'assistant',
        text: `Conversation reset. I am ready to advise you on legal formation, IRS elections, or funding for **${llcData.businessName || 'your business'}** in **${llcData.formationState}**.`,
      },
    ]);
  };

  const sampleQuestions = [
    `Exact Google Workspace DNS (MX, SPF, DKIM) setup?`,
    `Home State (${llcData.formationState}) vs Delaware/Wyoming?`,
    'Member-Managed vs. Manager-Managed difference?',
    'When should my LLC elect S-Corp tax status?',
    'Can I be my own registered agent safely?',
    'How do I guarantee my LLC corporate veil isn\'t pierced?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full h-[90vh] sm:h-[82vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Gemini Formation & Capital Advisor
                </h3>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" />
                  <span>Search Grounded</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Context: {llcData.businessName || 'Your Business'} · {llcData.formationState} Jurisdiction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              title="Reset Conversation History"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role Switcher Tabs */}
        <div className="px-4 py-2 bg-slate-850 bg-slate-800/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-mono shrink-0">Persona:</span>
          {[
            { id: 'legal', label: 'Corporate Law & State Filings', icon: Scale },
            { id: 'tax', label: 'IRS Tax & S-Corp Elections', icon: Calculator },
            { id: 'funding', label: 'Grants & Business Loans', icon: Coins },
            { id: 'infra', label: 'Domain, DNS & Workspace', icon: Server },
          ].map((r) => {
            const Icon = r.icon;
            const isCurrent = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id as any)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Question Pills */}
        <div className="px-4 py-1.5 bg-slate-900 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0">Topics:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="text-[11px] whitespace-nowrap px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Multi-Turn Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-sm'
                }`}
              >
                {m.text}

                {/* Search Grounding Sources */}
                {m.groundingSources && m.groundingSources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-700/70 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>Verified Google Search Sources:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.groundingSources.slice(0, 3).map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-emerald-300 border border-slate-700 text-[10px] font-mono transition-colors"
                        >
                          <span className="truncate max-w-[170px]">{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-300">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Searching statutory frameworks and current regulations...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="px-4 py-1.5 bg-slate-950 text-[10px] text-slate-500 text-center border-t border-slate-800/60 shrink-0">
          Educational guidance only. Not formal attorney-client legal counsel. Confirm specific filings with your state Secretary of State.
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskQuestion();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={`Ask any legal, tax, or filing question for ${llcData.formationState}...`}
              className="flex-1 px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
