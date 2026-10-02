'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Calendar,
  Send,
  BarChart2,
  Lightbulb,
  Layers,
  ChevronRight,
  Eye,
  Instagram,
  Youtube,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CampaignWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { campaigns, contentItems, runStepWorkflow, business } = useApp();
  const campaignId = (params?.id as string) || 'camp-001';

  const campaign = campaigns.find((c) => c.id === campaignId) || {
    id: campaignId,
    name: 'Urban Glide Summer Launch Blitz',
    objective: 'Introduce the Urban Glide sneaker with 5-day structured hook-to-offer funnel.',
    target_platforms: ['instagram', 'youtube'],
    status: 'review',
    created_at: new Date().toISOString(),
  };

  const assets = contentItems.filter((c) => c.campaign_id === campaignId || true);

  const [activeStepTab, setActiveStepTab] = useState('creative');
  const [runningStep, setRunningStep] = useState<string | null>(null);

  const timelineSteps = [
    {
      id: 'research',
      agent: 'Research Agent',
      label: 'Research & Signals',
      status: 'completed',
      summary: 'Analyzed trend spikes in breathable footwear and commuter ergonomics.',
      details: {
        trends: ['High interest in minimalist commuter sneakers', 'Search demand for all-day arch cushion'],
        audience_insights: ['21-35 age group values breathable materials and versatile street styling'],
        content_angles: ['10k Steps Street Test', 'Pain-point comparison: standard vs responsive foam', 'Craftsmanship breakdown'],
        risks: ['Avoid unsupported orthopedic or medical claims'],
      }
    },
    {
      id: 'strategy',
      agent: 'Strategy Agent',
      label: 'Campaign Strategy',
      status: 'completed',
      summary: '5-Day sequential funnel spanning Announcement, Feature Deep-Dive, Social Proof, and Launch Offer.',
      details: {
        duration: '5 Days',
        channels: ['Instagram (Reels, Carousels)', 'YouTube Shorts'],
        pillars: ['Day 1: Drop Announcement', 'Day 2: Biomechanical Tech Breakdown', 'Day 3: Commute Reel', 'Day 4: Community FAQ', 'Day 5: VIP Drop Access'],
        success_metric: 'Target Engagement > 8.5%, Save Ratio > 4.0%',
      }
    },
    {
      id: 'creative',
      agent: 'Creative Agent',
      label: 'Creative Content',
      status: 'completed',
      summary: `${assets.length} multi-platform assets synthesized with verified hooks, captions, and scripts.`,
      details: {
        generated_assets: assets.length,
        formats: ['Reel Script', 'Educational Carousel (5 slides)', 'YouTube Short Concept'],
      }
    },
    {
      id: 'quality',
      agent: 'Quality Agent',
      label: 'Quality Audit (QA)',
      status: 'completed',
      summary: 'Passed all 8 guardrails (Pricing parity, brand voice, character limits, policy safe).',
      details: {
        status: 'PASS',
        checks: ['Brand Voice Consistency: 100%', 'Pricing Consistency: Match INR 4,999', 'Safe Claims: No medical claims detected', 'Platform Aspect Ratios: Verified 9:16 & 4:5'],
      }
    },
    {
      id: 'schedule',
      agent: 'Publisher Agent',
      label: 'Schedule & Dispatch',
      status: campaign.status === 'scheduled' ? 'completed' : 'ready',
      summary: 'Editorial calendar sequenced with optimal publishing windows (18:30 IST).',
    },
    {
      id: 'analyze',
      agent: 'Performance Agent',
      label: 'Performance Telemetry',
      status: 'pending',
      summary: 'Will monitor initial view velocity, reach, and retention once published.',
    },
    {
      id: 'learn',
      agent: 'Learning Agent',
      label: 'Learning Loop',
      status: 'pending',
      summary: 'Autonomous pattern discovery will calibrate future campaign strategies.',
    }
  ];

  const handleExecuteStep = async (stepId: 'research' | 'strategy' | 'generate' | 'qualityCheck' | 'approve') => {
    setRunningStep(stepId);
    try {
      await runStepWorkflow(campaignId, stepId);
    } finally {
      setRunningStep(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Campaigns" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Link href="/campaigns" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{campaign.name}</h1>
              <span className="text-[10px] font-mono text-slate-400">
                Sprint ID: #{campaign.id.substring(0, 8)} • Status: {campaign.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/calendar">
              <GlassButton variant="outline" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
                View in Calendar
              </GlassButton>
            </Link>
            <Link href="/content-studio">
              <GlassButton variant="cyanGlow" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>
                Content Studio
              </GlassButton>
            </Link>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 text-left">
          {/* Objective Banner */}
          <GlassCard className="p-6 border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                Campaign Objective
              </span>
              <p className="text-sm text-slate-200">{campaign.objective}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                ● 7 Specialized Agents Aligned
              </span>
            </div>
          </GlassCard>

          {/* Autonomous Timeline Progression */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono uppercase tracking-wider text-slate-300 font-bold">
                Agent Lifecycle Pipeline
              </h2>
              <span className="text-xs font-mono text-cyan-400">Research → Strategy → Creative → QA → Publish → Learn</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {timelineSteps.map((step) => {
                const isSelected = activeStepTab === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStepTab(step.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono uppercase text-slate-400 truncate">{step.agent.split(' ')[0]}</span>
                      {step.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {step.status === 'ready' && <Clock className="w-3.5 h-3.5 text-cyan-400" />}
                      {step.status === 'pending' && <span className="w-2 h-2 rounded-full bg-slate-600" />}
                    </div>
                    <span className="text-xs font-bold text-white block truncate">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Deep-Dive Card */}
          <GlassCard className="p-6 sm:p-8 border-cyan-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Step Detail: {timelineSteps.find((s) => s.id === activeStepTab)?.agent}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {timelineSteps.find((s) => s.id === activeStepTab)?.label}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleExecuteStep(activeStepTab as any)}
                  disabled={runningStep !== null}
                >
                  {runningStep === activeStepTab ? 'Processing...' : 'Re-run Step'}
                </GlassButton>
              </div>
            </div>

            {/* Dynamic Step Content */}
            {activeStepTab === 'research' && (
              <div className="space-y-4 text-xs font-mono text-slate-300">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                  <span className="text-cyan-300 font-bold block">Audience & Trend Opportunities:</span>
                  <p>• High search demand identified for breathable lightweight city sneakers.</p>
                  <p>• Commuter fatigue is a core conversion pain-point.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                  <span className="font-bold block mb-1">Recommended Angles:</span>
                  <p>1. "Stop wearing shoes that destroy your feet by 3 PM"</p>
                  <p>2. "10,000 steps concrete test in Bangalore heat"</p>
                </div>
              </div>
            )}

            {activeStepTab === 'strategy' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  5-Day structured content funnel calibrated for peak organic retention:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 font-mono text-xs">
                  {['Day 1: Announcement', 'Day 2: Tech Breakdown', 'Day 3: Commute Reel', 'Day 4: Community Focus', 'Day 5: Drop Live Offer'].map((day, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                      <span className="text-cyan-400 font-bold block text-[10px]">STAGE {idx + 1}</span>
                      <span className="text-white mt-1 block">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStepTab === 'creative' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Synthesized Assets:</span>
                  <Link href="/content-studio" className="text-xs text-cyan-400 hover:underline">
                    Open in Content Studio →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {assets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                          {asset.platform} • {asset.content_type}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300">QA: PASS</span>
                      </div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{asset.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{asset.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStepTab === 'quality' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm">QUALITY STATUS: PASSED (100% Brand Fidelity)</span>
                  </div>
                  <span className="text-xs">Score: 0.98/1.0</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ Pricing matches catalog (₹4,999)</div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ No unsupported medical claims</div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ Platform aspect ratios valid</div>
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ Call-to-action is clear and unambiguous</div>
                </div>
              </div>
            )}

            {activeStepTab === 'schedule' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Ready to schedule or dispatch content across connected channels (Instagram & YouTube).
                </p>
                <div className="flex items-center gap-3">
                  <Link href="/calendar">
                    <GlassButton variant="cyanGlow" size="md" icon={<Calendar className="w-4 h-4" />}>
                      Review & Approve Schedule
                    </GlassButton>
                  </Link>
                </div>
              </div>
            )}

            {activeStepTab === 'analyze' && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400">
                Performance metrics will stream into the analytics engine once content publishing occurs.
              </div>
            )}

            {activeStepTab === 'learn' && (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
                Autonomous Learning Agent will continuously calibrate future hooks based on this sprint's engagement.
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
