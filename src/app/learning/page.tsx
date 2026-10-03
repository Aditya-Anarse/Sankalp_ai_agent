'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LearningCenterPage() {
  const { learningInsights, refreshAll } = useApp();
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError?: boolean } | null>(null);

  const handleTriggerAnalysis = async () => {
    setAnalyzing(true);
    setFeedback(null);
    try {
      const res = await api.learning.analyze();
      if (res.status === 'insufficient_data') {
        setFeedback({ message: res.message, isError: true });
      } else {
        setFeedback({ message: res.message || 'Learning Agent analysis completed.' });
        await refreshAll();
      }
    } catch (err: any) {
      setFeedback({ message: err.message || 'Failed to trigger learning analysis', isError: true });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Learning Center" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">SANKALP Learning Center</h1>
              <span className="text-[11px] font-mono text-slate-400">
                Empirical Performance Signals & Adaptive Optimization
              </span>
            </div>
          </div>

          <GlassButton
            variant="cyanGlow"
            size="sm"
            onClick={handleTriggerAnalysis}
            disabled={analyzing}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />}
          >
            {analyzing ? 'Analyzing Performance...' : 'Run Learning Agent'}
          </GlassButton>
        </header>

        {/* Learning Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 text-left">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-xs font-mono border flex items-center justify-between ${
                feedback.isError
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-400 text-emerald-200'
              }`}
            >
              <span>{feedback.message}</span>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">✕</button>
            </motion.div>
          )}

          {/* Core Philosophy Banner */}
          <GlassCard className="p-6 sm:p-8 border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <h2 className="text-base font-bold text-white">
                Empirical Learning System
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Learning insights are generated strictly from verified post performance and engagement data. SANKALP compares reach, watch-time, and conversion ratios across content formats to systematically improve subsequent campaign strategies.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-cyan-300">
              <span>• Zero Fabricated Insights</span>
              <span>• Strict Evidence Anchoring</span>
              <span>• Real Platform Telemetry</span>
            </div>
          </GlassCard>

          {/* Synthesized Insights Grid or Empty State */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Derived Insights ({learningInsights.length})
              </h3>
            </div>

            {learningInsights.length === 0 ? (
              <GlassCard className="p-12 text-center border-dashed border-white/[0.1] space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    Not enough performance data to generate learning insights.
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Publish content through your connected social accounts. As performance metrics accumulate, the Learning Agent will derive strategic insights.
                  </p>
                </div>
                <div className="pt-2">
                  <Link href="/workspace/ai-manager">
                    <GlassButton variant="cyanGlow" size="sm">
                      Create a Campaign
                    </GlassButton>
                  </Link>
                </div>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningInsights.map((item) => (
                  <GlassCard
                    key={item.id}
                    className="p-6 border-white/[0.08] space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.insight}</h4>
                      {item.evidence && item.evidence.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Evidence:</span>
                          <ul className="text-xs text-slate-400 list-disc list-inside space-y-0.5">
                            {item.evidence.map((ev, i) => (
                              <li key={i}>{ev}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] text-xs font-mono text-cyan-300">
                      Recommendation: {item.recommendation}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
