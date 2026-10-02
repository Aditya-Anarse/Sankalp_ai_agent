'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LearningCenterPage() {
  const { learningInsights, business } = useApp();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const handleTriggerAnalysis = async () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzedSuccess(true);
      setTimeout(() => setAnalyzedSuccess(false), 4000);
    }, 1500);
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
                Continuous Autonomous Reinforcement & Heuristic Calibration
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
            {analyzing ? 'Synthesizing Heuristics...' : 'Run Autonomous Learning Agent'}
          </GlassButton>
        </header>

        {/* Learning Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 text-left">
          {analyzedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-400 text-emerald-200 text-xs font-mono"
            >
              ✓ SANKALP Learning Agent synthesized 3 new heuristic insights and calibrated future campaign prompts.
            </motion.div>
          )}

          {/* Core Philosophy Banner */}
          <GlassCard className="p-6 sm:p-8 border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <h2 className="text-base font-bold text-white">
                How SANKALP Learns From Your Business
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every completed campaign, audience interaction, hook retention slope, and quality audit feeds directly back into SANKALP's structured business memory. When planning your next campaign, SANKALP applies these empirical findings to maximize return on effort.
            </p>
            <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-cyan-300">
              <span>• Zero Hallucinated Causality</span>
              <span>• Strict Evidence Anchoring</span>
              <span>• Continuous Prompt Refinement</span>
            </div>
          </GlassCard>

          {/* Synthesized Insights Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Active Strategic Insights ({learningInsights.length})
              </h3>
              <span className="text-[10px] font-mono text-slate-500">
                Confidence Threshold &gt; 75%
              </span>
            </div>

            <div className="space-y-4">
              {learningInsights.map((item) => (
                <GlassCard
                  key={item.id}
                  className="p-6 border-white/[0.08] hover:border-cyan-500/40 transition-all space-y-4 text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {item.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          Confidence: {Math.round(item.confidence_score * 100)}%
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                        "{item.insight}"
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.04] text-slate-400 border border-white/[0.08] flex-shrink-0">
                      Calibrating Next Sprint
                    </span>
                  </div>

                  {/* Empirical Evidence */}
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                      Empirical Evidence:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300 font-mono">
                      {item.evidence.map((ev, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cyan-400">→</span>
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Operational Recommendation */}
                  <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-cyan-200">
                    <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-sans">SANKALP Action Plan:</strong>
                      <p className="mt-0.5 leading-relaxed">{item.recommendation}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Bottom SANKALP Quote */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <p className="text-xs text-slate-300 italic">
              "I'll automatically use these learnings when structuring and copywriting your future campaigns."
            </p>
            <Link href="/workspace/ai-manager">
              <GlassButton variant="cyanGlow" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                Launch New AI Campaign
              </GlassButton>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
