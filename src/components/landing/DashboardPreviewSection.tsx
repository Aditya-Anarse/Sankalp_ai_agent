"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { MOCK_DASHBOARD_METRICS } from "@/data/landingData";
import {
  LayoutDashboard,
  Bot,
  Flame,
  Film,
  Calendar,
  BarChart2,
  Share2,
  Settings,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Layers,
  ArrowUpRight,
  Zap,
} from "lucide-react";

export function DashboardPreviewSection() {
  const [activeSidebar, setActiveSidebar] = useState("Overview");

  const sidebarItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "AI Manager", icon: Bot, badge: "Live" },
    { name: "Campaigns", icon: Flame },
    { name: "Content Studio", icon: Film },
    { name: "Calendar", icon: Calendar },
    { name: "Analytics", icon: BarChart2 },
    { name: "Connected Accounts", icon: Share2 },
    { name: "Settings", icon: Settings },
  ];

  const socialAccounts = [
    { name: "Instagram", icon: Instagram, handle: "@studioaura.co", status: "Optimal", reach: "124K" },
    { name: "LinkedIn", icon: Linkedin, handle: "Studio Aura Inc", status: "Optimal", reach: "82K" },
    { name: "X / Twitter", icon: Twitter, handle: "@aura_hq", status: "Syncing", reach: "94K" },
    { name: "YouTube", icon: Youtube, handle: "Studio Aura Shorts", status: "Optimal", reach: "48K" },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#080A10]/40" id="dashboard">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/[0.04] blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="High-Fidelity Command Interface"
          badgeIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
          title="YOUR MARKETING."
          gradientText="ONE COMMAND CENTER."
          description="A centralized panoramic view of every campaign, generated asset, queue calendar, and feedback telemetry metric."
        />

        {/* Big Liquid Glass Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto rounded-3xl bg-[#080A10]/90 backdrop-blur-2xl border border-white/[0.14] shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Mockup Window Title Bar */}
          <div className="px-6 py-3.5 bg-white/[0.03] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/70 border border-red-400/40" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70 border border-yellow-400/40" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/70 border border-emerald-400/40" />
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>app.sankalp.ai/command-center</span>
            </div>
            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              Workspace: Studio Aura
            </div>
          </div>

          {/* Dashboard Layout Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            {/* Sidebar */}
            <div className="lg:col-span-3 bg-white/[0.01] border-r border-white/[0.08] p-4 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Navigation
                </div>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeSidebar === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveSidebar(item.name)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-cyan-500/10 text-cyan-300 border border-cyan-400/30 font-semibold shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Agent Resource Meter */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] mt-6">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> AI Capacity
                  </span>
                  <span>Unlimited</span>
                </div>
                <div className="w-full h-1 rounded-full bg-white/[0.08] overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9 p-6 sm:p-8 space-y-6 overflow-y-auto">
              {/* Top Greeting Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    Good morning, Studio Aura 👋
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Your AI marketing manager is working autonomously. Next drop at 18:30 EST.</span>
                  </p>
                </div>
                <Badge variant="cyan" dot className="text-xs py-1">
                  All Channels Synchronized
                </Badge>
              </div>

              {/* 4 Performance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block mb-1">Total Monthly Reach</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {MOCK_DASHBOARD_METRICS.totalReach}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {MOCK_DASHBOARD_METRICS.reachDelta}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block mb-1">Avg. Engagement</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {MOCK_DASHBOARD_METRICS.avgEngagement}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {MOCK_DASHBOARD_METRICS.engagementDelta}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block mb-1">Posts Automated</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-cyan-300">
                      {MOCK_DASHBOARD_METRICS.postsAutomated}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">/ 45 target</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[11px] text-slate-400 block mb-1">Brand Consistency</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-300">
                      {MOCK_DASHBOARD_METRICS.brandConsistency}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      Grade A+
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Upcoming Queue & AI Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Upcoming Scheduled Content Queue */}
                <div className="lg:col-span-7 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      Upcoming Content Queue
                    </h4>
                    <span className="text-[10px] font-mono text-cyan-300">Auto-Dispatched</span>
                  </div>

                  <div className="space-y-2.5">
                    {MOCK_DASHBOARD_METRICS.upcomingQueue.map((item) => (
                      <div
                        key={item.title}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-slate-400">
                              {item.platform} • {item.type}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400">
                              {item.time}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations & Live Insight */}
                <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-indigo-950/20 to-transparent border border-cyan-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-300">
                    <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span>AI Recommendation</span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-300 leading-relaxed">
                      "Reels posted at <strong>18:30 EST</strong> generated <strong>2.4x higher watch retention</strong> than morning posts this week. SANKALP has auto-adjusted tomorrow's publication timetable."
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-slate-300 leading-relaxed">
                      "Audience comments show 68% interest in <em>Behind-the-Scenes material sourcing</em>. Drafting 3 video scripts for review."
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Accounts Status Bar */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Connected Channel Health
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {socialAccounts.map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <div
                        key={acc.name}
                        className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-slate-300" />
                          <div>
                            <span className="text-xs font-medium text-white block">
                              {acc.name}
                            </span>
                            <span className="text-[10px] text-slate-500 truncate">
                              {acc.handle}
                            </span>
                          </div>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
