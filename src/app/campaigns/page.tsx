'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  Flame,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Calendar,
  ShieldCheck,
  Clock,
  Instagram,
  Youtube,
} from 'lucide-react';

export default function CampaignsDirectoryPage() {
  const { campaigns, business, products } = useApp();
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Campaigns" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Campaigns Engine</h1>
              <span className="text-[11px] font-mono text-slate-400">
                {campaigns.length} Autonomous Marketing Sprints
              </span>
            </div>
          </div>

          <Link href="/campaigns/new">
            <GlassButton variant="cyanGlow" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
              New Campaign
            </GlassButton>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Campaign Sprints</h2>
              <p className="text-xs text-slate-400 mt-1">
                Multi-channel marketing funnels orchestrated by SANKALP's 7 specialized agents.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {['all', 'review', 'scheduled', 'running', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono capitalize transition-all ${
                    filter === tab
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                      : 'text-slate-400 hover:text-white bg-white/[0.02]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns
              .filter((c) => filter === 'all' || c.status.toLowerCase() === filter)
              .map((camp) => (
                <GlassCard
                  key={camp.id}
                  className="p-6 border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-white line-clamp-2">{camp.name}</h3>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                          camp.status === 'review'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : camp.status === 'scheduled'
                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{camp.objective}</p>

                    <div className="flex items-center gap-2 pt-2 text-xs text-slate-300">
                      <span className="flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5 text-pink-400" />
                        <Youtube className="w-3.5 h-3.5 text-red-400" />
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">•</span>
                      <span className="text-[11px] font-mono text-cyan-300">5 Content Assets</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      Created: {new Date(camp.created_at).toLocaleDateString()}
                    </span>

                    <Link href={`/campaigns/${camp.id}`}>
                      <GlassButton variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Manage Sprint
                      </GlassButton>
                    </Link>
                  </div>
                </GlassCard>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
