'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  ShieldCheck,
  Film,
  Lightbulb,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'sankalp';
  text: string;
  timestamp: string;
  steps?: { label: string; status: 'completed' | 'in_progress' | 'pending' }[];
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
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'sankalp',
      text: `Good morning! I am SANKALP, your autonomous AI marketing employee. I have your business context for ${business.name}, your ${products.length} products, and audience targets loaded into active memory.\n\nTell me what you'd like to achieve:`,
      timestamp: '10:00 AM',
    }
  ]);

  const quickPrompts = [
    'New summer collection launched. Create a 5-day Instagram campaign.',
    'Promote my Urban Glide sneakers with high-retention Reels.',
    'Plan my editorial content calendar for this week.',
    'Launch a 48-hour flash offer campaign on Instagram & YouTube.',
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

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
      text: 'Understanding your request and synthesizing business constraints...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      steps: [
        { label: 'Business context & brand voice loaded', status: 'completed' },
        { label: 'Product catalog & pricing loaded', status: 'completed' },
        { label: 'Research Agent: Analyzing content opportunities', status: 'in_progress' },
        { label: 'Strategy Agent: Structuring multi-day funnel', status: 'pending' },
        { label: 'Creative Agent: Generating hooks & scripts', status: 'pending' },
        { label: 'Quality Agent: Auditing brand tone & character limits', status: 'pending' },
      ],
    };

    setMessages((prev) => [...prev, userMsg, initialSankalpMsg]);
    setInput('');
    setLoading(true);

    try {
      // Step simulation timeline for high-fidelity interactive feel
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === sankalpMsgId && m.steps
              ? {
                  ...m,
                  steps: m.steps.map((s, idx) =>
                    idx <= 2
                      ? { ...s, status: 'completed' }
                      : idx === 3
                      ? { ...s, status: 'in_progress' }
                      : s
                  ),
                }
              : m
          )
        );
      }, 700);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === sankalpMsgId && m.steps
              ? {
                  ...m,
                  steps: m.steps.map((s, idx) =>
                    idx <= 4
                      ? { ...s, status: 'completed' }
                      : idx === 5
                      ? { ...s, status: 'in_progress' }
                      : s
                  ),
                }
              : m
          )
        );
      }, 1500);

      const res = await createCampaignChat(textToSend);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === sankalpMsgId
              ? {
                  ...m,
                  text: res.response || 'Campaign generation complete! All 7 specialized agents have executed their pipelines.',
                  steps: m.steps?.map((s) => ({ ...s, status: 'completed' })),
                  campaignReady: {
                    id: res.campaign_id || 'camp-001',
                    name: res.campaign_name || textToSend,
                    contentCount: res.workflow_summary?.content_count || 3,
                    preview: res.content_preview || [],
                  },
                }
              : m
          )
        );
        setLoading(false);
      }, 2200);
    } catch (e) {
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
                <span>SANKALP AI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  ● ACTIVE EMPLOYEE
                </span>
              </h1>
              <span className="text-[11px] font-mono text-slate-400 block -mt-0.5">
                Autonomous Marketing Orchestration Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.08]">
              Review Mode (Human-in-the-loop)
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto flex flex-col justify-between space-y-6">
          <div className="space-y-6 flex-1 overflow-y-auto pr-1">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'sankalp' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <GlassCard
                    className={`p-5 text-left ${
                      m.sender === 'user'
                        ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-50'
                        : 'bg-white/[0.03] border-white/[0.08] text-slate-200'
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{m.text}</p>

                    {/* Multi-Agent Execution Telemetry Steps */}
                    {m.steps && (
                      <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-2 font-mono text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 block mb-2">
                          Agent Execution Matrix:
                        </span>
                        {m.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between py-1 px-2 rounded bg-white/[0.02] border border-white/[0.04]"
                          >
                            <span className="flex items-center gap-2 text-slate-300">
                              {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              {step.status === 'in_progress' && <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                              {step.status === 'pending' && <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />}
                              <span>{step.label}</span>
                            </span>
                            <span
                              className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                                step.status === 'completed'
                                  ? 'bg-emerald-500/10 text-emerald-300'
                                  : step.status === 'in_progress'
                                  ? 'bg-cyan-500/10 text-cyan-300'
                                  : 'text-slate-600'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Campaign Ready Card */}
                    {m.campaignReady && (
                      <div className="mt-4 pt-4 border-t border-cyan-500/20 bg-cyan-950/20 p-4 rounded-xl border border-cyan-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">CAMPAIGN SYNTHESIZED</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              ALL QA PASSED (PASS)
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300">
                            {m.campaignReady.contentCount} Assets Generated
                          </span>
                        </div>

                        <p className="text-xs text-slate-300">
                          Strategy, hooks, carousels, and QA verified. Ready for business owner approval or scheduling.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                          <Link href={`/campaigns/${m.campaignReady.id}`}>
                            <GlassButton variant="cyanGlow" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                              Review Campaign Timeline
                            </GlassButton>
                          </Link>
                          <Link href="/content-studio">
                            <GlassButton variant="outline" size="sm">
                              Open in Content Studio
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

          {/* Quick Prompts & Input Bar */}
          <div className="space-y-3 pt-2 border-t border-white/[0.08]">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">Demo Prompts:</span>
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

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Instruct SANKALP (e.g. 'Create a 5-day campaign for our new shoes')..."
                disabled={loading}
                className="flex-1 bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-sans"
              />

              <GlassButton
                variant="cyanGlow"
                size="md"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                icon={<Send className="w-4 h-4" />}
              >
                {loading ? 'Synthesizing...' : 'Send'}
              </GlassButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
