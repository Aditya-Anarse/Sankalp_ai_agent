'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  ShieldCheck,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'sankalp' | 'system';
  text: string;
  timestamp: string;
  isError?: boolean;
  steps?: { label: string; status: 'completed' | 'in_progress' | 'pending' | 'failed' }[];
  campaignReady?: {
    id: string;
    name: string;
    contentCount: number;
    preview: any[];
  };
}

export default function AIManagerPage() {
  const router = useRouter();
  const { business, products, createCampaignChat } = useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // Check AI Provider configuration status
    fetch('http://localhost:8000/ai/status')
      .then((res) => res.json())
      .then((data) => {
        setAiConfigured(data.configured);
      })
      .catch(() => {
        setAiConfigured(true);
      });
  }, []);

  const businessName = business.name || '';
  const isBusinessConfigured = Boolean(businessName);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!isBusinessConfigured) {
      setMessages([
        {
          id: 'm-setup',
          sender: 'sankalp',
          text: 'Welcome to SANKALP. Complete your business setup before starting an AI campaign.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      setMessages([
        {
          id: 'm1',
          sender: 'sankalp',
          text: `Good morning! I am SANKALP, your autonomous AI marketing employee. I have your business context for ${businessName}, your ${products.length} products, and brand target rules loaded.\n\nWhat marketing campaign or editorial objective should we execute today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isBusinessConfigured, businessName, products.length]);

  const quickPrompts = [
    'Create a 5-day multi-channel campaign for our product drop.',
    'Promote our flagship products with high-retention Reels and carousels.',
    'Plan our editorial content calendar for this week.',
    'Launch a 48-hour promotional offer sequence.',
  ];

  const handleSend = async (customText?: string) => {
    const rawText = customText !== undefined ? customText : input;
    const textToSend = (rawText || '').trim();

    if (!textToSend) {
      setValidationError('Please enter a marketing directive or campaign objective before dispatching.');
      return;
    }
    setValidationError(null);
    if (loading) return;

    if (!isBusinessConfigured) {
      setMessages((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          sender: 'user',
          text: textToSend,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: 'Complete your business setup before starting an AI campaign.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        },
      ]);
      setInput('');
      return;
    }

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const sankalpMsgId = `sankalp-${Date.now()}`;
    const initialSankalpMsg: Message = {
      id: sankalpMsgId,
      sender: 'sankalp',
      text: 'Analyzing directive against your brand profile and executing the 7-agent pipeline...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      steps: [
        { label: 'Business context & brand parameters verified', status: 'completed' },
        { label: 'Research Agent: Extracting market signals', status: 'in_progress' },
        { label: 'Strategy Agent: Structuring editorial roadmap', status: 'pending' },
        { label: 'Creative Agent: Writing hooks, scripts & visual copy', status: 'pending' },
        { label: 'Quality Agent: Brand audit & compliance check', status: 'pending' },
      ],
    };

    setMessages((prev) => [...prev, userMsg, initialSankalpMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await createCampaignChat(textToSend);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === sankalpMsgId
            ? {
                ...m,
                text: res.response || 'Campaign execution complete. All 7 agents have executed in sequence.',
                steps: m.steps?.map((s) => ({ ...s, status: 'completed' })),
                campaignReady: {
                  id: res.campaign_id,
                  name: res.campaign_name || textToSend,
                  contentCount: res.workflow_summary?.content_count || 0,
                  preview: res.content_preview || [],
                },
              }
            : m
        )
      );
      setLoading(false);
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred during agent execution.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === sankalpMsgId
            ? {
                ...m,
                text: errorMsg.includes('AI provider is not configured')
                  ? 'AI Service Not Configured. Please set GEMINI_API_KEY or GROQ_API_KEY in your environment configuration to enable AI generation.'
                  : `Execution stopped: ${errorMsg}`,
                isError: true,
                steps: m.steps?.map((s) => (s.status === 'in_progress' ? { ...s, status: 'failed' } : s)),
              }
            : m
        )
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="AI Manager" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                <span>SANKALP AI Manager</span>
                {aiConfigured === false ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30">
                    AI NOT CONFIGURED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    ● ACTIVE
                  </span>
                )}
              </h1>
              <span className="text-[11px] font-mono text-slate-400 block -mt-0.5">
                Autonomous Executive Coordinating 7 Specialized Agents
              </span>
            </div>
          </div>
        </header>

        {/* Warning Banner if AI is not configured */}
        {aiConfigured === false && (
          <div className="bg-amber-950/30 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between text-xs font-mono text-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>AI Service Not Configured: Set GEMINI_API_KEY or GROQ_API_KEY in your environment to activate AI generation.</span>
            </div>
          </div>
        )}

        {/* Warning Banner if Business is not configured */}
        {!isBusinessConfigured && (
          <div className="bg-cyan-950/40 border-b border-cyan-500/30 px-6 py-3 flex items-center justify-between text-xs font-mono text-cyan-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>No business configured yet. Complete setup to run autonomous marketing campaigns.</span>
            </div>
            <Link href="/onboarding/business">
              <GlassButton variant="cyanGlow" size="sm">
                Complete Business Setup
              </GlassButton>
            </Link>
          </div>
        )}

        {/* Chat Stream */}
        <main className="flex-1 p-6 sm:p-8 max-w-4xl w-full mx-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4 flex-1 overflow-y-auto">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender !== 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl text-left ${m.sender === 'user' ? 'order-1' : 'order-2'}`}>
                  <GlassCard
                    className={`p-4 sm:p-5 ${
                      m.sender === 'user'
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                        : m.isError
                        ? 'bg-red-950/30 border-red-500/30 text-red-200'
                        : 'border-white/[0.08] text-slate-200'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{m.text}</p>

                    {/* Step progress indicators */}
                    {m.steps && (
                      <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                          7-Agent Autonomous Pipeline Execution:
                        </span>
                        {m.steps.map((st, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-mono">
                            {st.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                            {st.status === 'in_progress' && <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin flex-shrink-0" />}
                            {st.status === 'pending' && <span className="w-3.5 h-3.5 rounded-full border border-slate-600 flex-shrink-0" />}
                            {st.status === 'failed' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                            <span
                              className={
                                st.status === 'completed'
                                  ? 'text-slate-300'
                                  : st.status === 'in_progress'
                                  ? 'text-cyan-300 font-semibold'
                                  : st.status === 'failed'
                                  ? 'text-red-300 font-semibold'
                                  : 'text-slate-500'
                              }
                            >
                              {st.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Campaign Ready Card */}
                    {m.campaignReady && (
                      <div className="mt-4 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-cyan-400" />
                            {m.campaignReady.name}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Ready for Review
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {m.campaignReady.contentCount} platform content assets generated and audited by Quality Agent.
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <Link href="/content-studio">
                            <GlassButton variant="cyanGlow" size="sm" className="flex items-center gap-1.5">
                              <span>Open Content Studio</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </GlassButton>
                          </Link>
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] font-mono text-slate-500 block mt-2 text-right">
                      {m.timestamp}
                    </span>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Suggested Directives & Input Bar */}
          <div className="space-y-3 pt-2 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">Suggested Directives:</span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp)}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all flex-shrink-0 text-left"
                >
                  {qp}
                </button>
              ))}
            </div>

            {validationError && (
              <div className="text-xs font-mono text-red-400 bg-red-950/30 border border-red-500/30 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Instruct SANKALP AI Manager (e.g. 'Create a 5-day campaign for our new drop')..."
                disabled={loading}
                className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-sans"
              />
              <GlassButton
                variant="cyanGlow"
                size="md"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex items-center gap-1.5"
              >
                <span>Dispatch</span>
                <Send className="w-3.5 h-3.5" />
              </GlassButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
