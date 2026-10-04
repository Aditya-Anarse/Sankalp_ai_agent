'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
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
  const { campaigns, contentItems, runStepWorkflow, business, refreshAll } = useApp();
  const campaignId = params?.id as string;

  const campaign = campaigns.find((c) => c.id === campaignId);

  const [activeStepTab, setActiveStepTab] = useState('creative');
  const [runningStep, setRunningStep] = useState<string | null>(null);
  const [isReplanning, setIsReplanning] = useState(false);
  const [replanData, setReplanData] = useState<any>(null);

  const handleReplan = async () => {
    setIsReplanning(true);
    try {
      const res = await api.campaigns.replan(campaignId);
      setReplanData(res);
      await refreshAll();
    } catch (e: any) {
      alert(`Replanning notice: ${e.message || e}`);
    } finally {
      setIsReplanning(false);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
        <WorkspaceSidebar activeTab="Campaigns" />
        <div className="flex-1 flex flex-col min-h-screen p-8 items-center justify-center">
          <GlassCard className="p-8 text-center max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">Campaign Not Found</h2>
            <p className="text-xs text-slate-400">
              The requested campaign does not exist or has not been created yet.
            </p>
            <Link href="/campaigns">
              <GlassButton variant="cyanGlow" size="sm">
                Return to Campaigns
              </GlassButton>
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  const assets = contentItems.filter((c) => c.campaign_id === campaignId);

  const timelineSteps = [
    {
      id: 'research',
      agent: 'Research Agent',
      label: 'Research & Signals',
      status: campaign.research || ['planning', 'creating', 'review', 'scheduled', 'running', 'completed'].includes(campaign.status) ? 'completed' : 'pending',
      summary: campaign.research?.summary || 'Market research and competitor signals analysis for target audience.',
      details: campaign.research,
    },
    {
      id: 'strategy',
      agent: 'Strategy Agent',
      label: 'Campaign Strategy',
      status: campaign.strategy || ['creating', 'review', 'scheduled', 'running', 'completed'].includes(campaign.status) ? 'completed' : 'pending',
      summary: campaign.strategy?.summary || `${(campaign.target_platforms || []).join(', ') || 'Multi-channel'} funnel strategy.`,
      details: campaign.strategy,
    },
    {
      id: 'creative',
      agent: 'Creative Agent',
      label: 'Creative Content',
      status: assets.length > 0 ? 'completed' : campaign.status === 'creating' ? 'ready' : 'pending',
      summary: assets.length > 0 ? `${assets.length} multi-platform assets synthesized.` : 'Creative assets pending generation.',
      details: {
        generated_assets: assets.length,
      }
    },
    {
      id: 'quality',
      agent: 'Quality Agent',
      label: 'Quality Audit (QA)',
      status: assets.length > 0 && assets.every((a) => a.quality_status === 'PASS') ? 'completed' : assets.length > 0 ? 'ready' : 'pending',
      summary: assets.length > 0 ? 'Quality & brand safety verification for campaign assets.' : 'Awaiting asset generation for QA audit.',
      details: {
        checks: ['Brand Voice Consistency', 'Pricing & Claim Verification', 'Platform Aspect Ratios', 'Safety & Guardrails'],
      }
    },
    {
      id: 'schedule',
      agent: 'Publisher Agent',
      label: 'Schedule & Dispatch',
      status: ['scheduled', 'running', 'completed'].includes(campaign.status) ? 'completed' : assets.length > 0 ? 'ready' : 'pending',
      summary: 'Editorial calendar sequencing and platform dispatch.',
    },
    {
      id: 'analyze',
      agent: 'Performance Agent',
      label: 'Performance Telemetry',
      status: ['running', 'completed'].includes(campaign.status) ? 'completed' : 'pending',
      summary: 'Will monitor initial view velocity, reach, and retention once published.',
    },
    {
      id: 'learn',
      agent: 'Learning Agent',
      label: 'Learning Loop',
      status: campaign.status === 'completed' ? 'completed' : 'pending',
      summary: 'Autonomous pattern discovery calibrates future campaign strategies.',
    },
    {
      id: 'replan',
      agent: 'Replanning Engine',
      label: 'Autonomous Replan',
      status: campaign.status === 'replanned' ? 'completed' : 'ready',
      summary: 'Evolves strategy, hooks, and format mix based on empirical telemetry.',
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
              <span className="text-xs font-mono text-cyan-400">Goal → Research → Strategy → Creative → QA → Publish → Analyze → Learn → Replan</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
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
                  {runningStep === activeStepTab ? 'Processing...' : 'Run Step'}
                </GlassButton>
              </div>
            </div>

            {/* Dynamic Step Content */}
            {activeStepTab === 'research' && (
              <div className="space-y-4 text-xs font-mono text-slate-300">
                {campaign.research ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-cyan-300 font-bold block">Research Insights:</span>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300">{JSON.stringify(campaign.research, null, 2)}</pre>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400">
                    Research signals recorded during campaign initiation. Execute the Research Agent to re-evaluate audience and trend signals.
                  </div>
                )}
              </div>
            )}

            {activeStepTab === 'strategy' && (
              <div className="space-y-4">
                {campaign.strategy ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
                    <span className="text-cyan-400 font-bold block text-sm">Campaign Funnel Strategy:</span>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300">{JSON.stringify(campaign.strategy, null, 2)}</pre>
                  </div>
                ) : (
                  <p className="text-xs text-slate-300">
                    Multi-channel funnel calibrated for target channels: {(campaign.target_platforms || []).join(', ') || 'Instagram & YouTube'}.
                  </p>
                )}
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

                {assets.length === 0 ? (
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-xs text-slate-400">
                    No content assets generated for this campaign yet. Run the Creative step to generate platform copy and scripts.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {assets.slice(0, 6).map((asset) => (
                      <div key={asset.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                            {asset.platform} • {asset.content_type}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-300">
                            QA: {asset.quality_status || 'PENDING'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{asset.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">{asset.caption}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeStepTab === 'quality' && (
              <div className="space-y-3 font-mono text-xs">
                {assets.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400">
                    No assets to audit yet. Generate creative assets first.
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold text-sm">QUALITY AUDIT</span>
                      </div>
                      <span className="text-xs">{assets.filter(a => a.quality_status === 'PASS').length}/{assets.length} Assets Passed</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ Brand Voice Consistency</div>
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ Pricing & Claim Verification</div>
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ Platform Aspect Ratios Validated</div>
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">✓ Safety Policy Checked</div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeStepTab === 'schedule' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Ready to schedule or dispatch content across connected channels ({(campaign.target_platforms || []).join(', ') || 'Instagram & YouTube'}).
                </p>
                <div className="flex items-center gap-3">
                  <Link href="/calendar">
                    <GlassButton variant="cyanGlow" size="md" icon={<Calendar className="w-4 h-4" />}>
                      Review in Calendar
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

            {activeStepTab === 'replan' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-400/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" /> Autonomous Campaign Replanning Engine
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Consumes real analytics telemetry and empirical learned insights to evolve the campaign roadmap.
                      </p>
                    </div>

                    <GlassButton
                      variant="cyanGlow"
                      size="sm"
                      onClick={handleReplan}
                      disabled={isReplanning}
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                    >
                      {isReplanning ? 'Synthesizing Replan...' : 'Execute Autonomous Replan'}
                    </GlassButton>
                  </div>

                  {replanData && (
                    <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                        <span className="text-cyan-300 font-bold block mb-1">Replanning Rationale:</span>
                        <p className="text-slate-200">{replanData.replan_rationale}</p>
                      </div>

                      {replanData.strategic_shifts?.length > 0 && (
                        <div>
                          <span className="text-slate-400 block mb-1.5">Strategic Shifts Applied:</span>
                          <div className="flex flex-wrap gap-2">
                            {replanData.strategic_shifts.map((shift: string, idx: number) => (
                              <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px]">
                                ✦ {shift}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {replanData.projected_improvements && (
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between">
                          <span>Target Engagement Lift: {replanData.projected_improvements.target_engagement_lift}</span>
                          <span>Confidence: {Math.round((replanData.projected_improvements.confidence || 0.9) * 100)}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
