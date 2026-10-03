'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  Activity,
  Bot,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Flame,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AgentActivityPage() {
  const { agentLogs } = useApp();
  const [filterAgent, setFilterAgent] = useState('all');

  const agents = ['all', 'Strategy Agent', 'Creative Agent', 'Quality Agent', 'Research Agent', 'Learning Agent'];

  const filteredLogs = agentLogs.filter((log) => {
    if (filterAgent === 'all') return true;
    return log.agent_name.toLowerCase().includes(filterAgent.toLowerCase().split(' ')[0]);
  });

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Agent Activity" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Agent Activity & Telemetry</h1>
              <span className="text-[11px] font-mono text-slate-400">
                Live Audit Stream of Autonomous Multi-Agent Reasoning
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              ● 7 Specialized Subagents Active
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-6 text-left">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/[0.06] overflow-x-auto">
            <div className="flex items-center gap-2">
              {agents.map((ag) => (
                <button
                  key={ag}
                  onClick={() => setFilterAgent(ag)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono transition-all whitespace-nowrap ${
                    filterAgent === ag
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'text-slate-400 hover:text-white bg-white/[0.02]'
                  }`}
                >
                  {ag}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-slate-500">
              Total Recorded Runs: {agentLogs.length}
            </span>
          </div>

          {/* Activity Log Stream or Empty State */}
          {filteredLogs.length === 0 ? (
            <GlassCard className="p-12 text-center border-dashed border-white/[0.1] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No agent activity yet.</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  When the 7 specialized agents execute campaigns, research market signals, or audit content, their real execution traces will appear here.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/workspace/ai-manager">
                  <GlassButton variant="cyanGlow" size="sm">
                    Run AI Campaign
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <GlassCard
                  key={log.id}
                  className="p-5 border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{log.agent_name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {log.status.toUpperCase()}
                        </span>
                        {log.campaign_id && (
                          <span className="text-[10px] font-mono text-slate-400">
                            [{log.campaign_id}]
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-mono leading-relaxed">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 font-mono text-xs text-slate-400 flex-shrink-0">
                    <span className="text-cyan-300">{log.created_at}</span>
                    <span className="text-[10px] text-slate-500">Duration: {log.duration_seconds}s</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
