'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import {
  BarChart2,
  Users,
  Eye,
  Heart,
  Bookmark,
  Share2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { business } = useApp();
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await api.analytics.get(days);
        setAnalyticsData(data);
      } catch (err) {
        console.warn('Could not fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [days]);

  const hasRealData = analyticsData?.has_real_data === true;
  const metrics = analyticsData?.metrics || {
    total_reach: 0,
    total_impressions: 0,
    total_engagement: 0,
    engagement_rate: 0.0,
    follower_growth: 0,
    total_posts: 0,
  };
  const timeline = analyticsData?.timeline || [];
  const topContent = analyticsData?.top_performing_content || [];

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
                Official API Telemetry & Verified Engagement
              </span>
            </div>
          </div>
        </header>

        {/* Analytics Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 text-left">
          {/* Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold text-white">Audience & Reach Overview</h2>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated metrics from connected platforms.</p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`text-xs px-3 py-1 rounded font-mono uppercase transition-all ${
                    days === d
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-5 border-white/[0.08] space-y-3 text-left">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Total Reach</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {metrics.total_reach.toLocaleString()}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-white/[0.08] space-y-3 text-left">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Impressions / Views</span>
                <Eye className="w-4 h-4 text-violet-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {metrics.total_impressions.toLocaleString()}
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-white/[0.08] space-y-3 text-left">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Engagement Rate</span>
                <Heart className="w-4 h-4 text-pink-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {metrics.engagement_rate}%
                </span>
              </div>
            </GlassCard>

            <GlassCard className="p-5 border-white/[0.08] space-y-3 text-left">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono uppercase tracking-wider">Published Posts</span>
                <Bookmark className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  {metrics.total_posts}
                </span>
              </div>
            </GlassCard>
          </div>

          {/* Empty State or Real Data Visualization */}
          {!hasRealData || timeline.length === 0 ? (
            <GlassCard className="p-12 text-center border-dashed border-white/[0.1] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No analytics data yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Connect your social accounts and publish content through SANKALP to start receiving real platform performance telemetry.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link href="/connected-accounts">
                  <GlassButton variant="cyanGlow" size="sm">
                    Connect Accounts
                  </GlassButton>
                </Link>
                <Link href="/content-studio">
                  <GlassButton variant="secondary" size="sm">
                    Open Content Studio
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <div className="space-y-6">
              {/* Timeline chart */}
              <GlassCard className="p-6 border-white/[0.08] space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Reach & Engagement Telemetry
                </h3>
                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                  {timeline.map((point: any, idx: number) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-300">{point.reach}</span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-cyan-500/20 to-cyan-400/80 border-t border-cyan-300"
                        style={{ height: `${Math.min(point.reach / 10, 150)}px` }}
                      />
                      <span className="text-[9px] font-mono text-slate-500">{point.date}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Top Performing Content */}
              {topContent.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                    Published Content Performance
                  </h3>
                  <div className="space-y-2">
                    {topContent.map((c: any, idx: number) => (
                      <GlassCard
                        key={c.id || idx}
                        className="p-4 border-white/[0.08] flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white">{c.title}</h4>
                          <span className="text-[10px] font-mono text-slate-400 capitalize">
                            {c.platform} • {c.content_type}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase">
                          {c.status}
                        </span>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
