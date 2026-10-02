'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  BarChart2,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Sparkles,
  Instagram,
  Youtube,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { business, contentItems } = useApp();
  const [timeRange, setTimeRange] = useState('7d');

  // Honest telemetry metadata
  const isDemo = true;

  const metrics = [
    { label: 'Total Reach', value: '48.2K', change: '+14.2%', icon: Users, accent: 'cyan' },
    { label: 'Total Impressions', value: '64.5K', change: '+18.7%', icon: Eye, accent: 'violet' },
    { label: 'Engagement Rate', value: '9.04%', change: '+2.1%', icon: Heart, accent: 'pink' },
    { label: 'Save / Share Ratio', value: '4.8%', change: '+0.8%', icon: Bookmark, accent: 'emerald' },
  ];

  const contentRankings = [
    { title: 'The Only Sneaker Your Commute Needs', type: 'Reel', platform: 'Instagram', views: '24.1K', engagement: '14.2%', saves: '840' },
    { title: '5 Signs Your Work Shoes Are Failing You', type: 'Carousel', platform: 'Instagram', views: '18.4K', engagement: '8.9%', saves: '1,120' },
    { title: '10,000 Steps Test: Urban Glide Sneaker', type: 'Short', platform: 'YouTube', views: '12.8K', engagement: '11.4%', saves: '410' },
  ];

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Analytics" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Performance Telemetry</h1>
              <span className="text-[11px] font-mono text-slate-400">
                Multi-Channel Retention & Engagement Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              ● Demo Mode (Simulated Telemetry)
            </span>
          </div>
        </header>

        {/* Analytics Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 text-left">
          {/* Honest Demo Mode Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 text-xs text-amber-200/90 font-mono">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Notice:</strong> Real-time production analytics require active Instagram Graph API & YouTube Data API OAuth tokens configured in your <code>.env</code>. The metrics below represent calibrated benchmark simulations for {business.name}.
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold text-white">Audience & Reach Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated across active connected channels.</p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              {['24h', '7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`text-xs px-3 py-1 rounded font-mono uppercase transition-all ${
                    timeRange === r
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <GlassCard key={m.label} className="p-5 border-white/[0.08] space-y-3 text-left">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">{m.label}</span>
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-white tracking-tight">{m.value}</span>
                    <span className="text-xs font-mono text-emerald-400 font-semibold">{m.change}</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Retention Curve & Platform Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Velocity Curve */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Engagement & Reach Velocity
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">7-Day Moving Average</span>
              </div>

              <GlassCard className="p-6 border-white/[0.08] space-y-4">
                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                  {[42, 58, 65, 52, 78, 88, 95].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-300">{val}%</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500/20 to-cyan-400/80 border-t border-cyan-300"
                        style={{ height: `${val * 1.5}px` }}
                      />
                      <span className="text-[9px] font-mono text-slate-500">Day {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Platform Distribution */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Platform Share
              </h3>

              <GlassCard className="p-6 border-white/[0.08] space-y-4">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-white">
                        <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram
                      </span>
                      <span className="font-mono text-slate-400">68%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500" style={{ width: '68%' }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-white">
                        <Youtube className="w-3.5 h-3.5 text-red-400" /> YouTube
                      </span>
                      <span className="font-mono text-slate-400">32%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-amber-500" style={{ width: '32%' }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-cyan-300">
                  ⚡ Learning Signal: Reels drive 2.4x higher initial retention than static posts.
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Top Performing Content Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Content Performance Breakdown
            </h3>

            <div className="space-y-2">
              {contentRankings.map((c, idx) => (
                <GlassCard
                  key={idx}
                  className="p-4 border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center font-mono text-xs font-bold text-cyan-300">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {c.platform} • {c.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Views</span>
                      <span className="text-white font-bold">{c.views}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Engagement</span>
                      <span className="text-emerald-400 font-bold">{c.engagement}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Saves</span>
                      <span className="text-cyan-300 font-bold">{c.saves}</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
