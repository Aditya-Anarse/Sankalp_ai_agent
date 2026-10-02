"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { AIStatusCard } from "@/components/workspace/AIStatusCard";
import { QuickActionCard } from "@/components/workspace/QuickActionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  Flame,
  Calendar,
  Sparkles,
  ShoppingBag,
  Film,
  BarChart2,
  CheckCircle2,
  Clock,
  Instagram,
  Youtube,
  Zap,
  Tag,
  ArrowRight,
  RefreshCw,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkspacePage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("Overview");
  const [modalAction, setModalAction] = useState<string | null>(null);

  const businessName =
    state.businessProfile.businessName || user?.businessName || "My Business";
  const primaryProduct = state.products[0] || {
    name: "Premium Product",
    category: "General",
    price: "₹1,999",
    description: "Everyday flagship product.",
  };

  const activeCampaigns = [
    {
      title: `${primaryProduct.name} Spotlight Sprint`,
      channel: "Instagram",
      goal: state.goals.primary || "Promote Products",
      pace: state.contentPreferences.frequency || "3x per week",
      status: "Active",
      health: "Optimal (99.4%)",
    },
    {
      title: `${state.brand.tone[0] || "Modern"} Founder Narrative`,
      channel: "YouTube & Instagram",
      goal: "Build Audience",
      pace: "Weekly",
      status: "Active",
      health: "Optimal (98.8%)",
    },
  ];

  const upcomingQueue = [
    {
      title: `Why ${primaryProduct.name} is the standard in 2026`,
      time: `Today, ${state.contentPreferences.postingTime.split(" ")[0]}`,
      type: state.contentPreferences.formats[0] || "Reel",
      platform: "Instagram",
      status: "QA Approved",
    },
    {
      title: `Behind the Craft: Sourcing & Story`,
      time: "Tomorrow, 14:00",
      type: "Carousel",
      platform: "Instagram",
      status: "Ready to Dispatch",
    },
    {
      title: `Weekend VIP Drop & Exclusive Offer`,
      time: "Friday, 18:30",
      type: "Story Series",
      platform: "Instagram",
      status: "Generating Variations",
    },
  ];

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar */}
      <WorkspaceSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Floating Utility Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Workspace ID: <strong className="text-white">#WS-{businessName.substring(0, 3).toUpperCase()}-9842</strong>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              ● SYNC ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.08]">
              Demo Mode Active
            </span>
            <GlassButton
              variant="cyanGlow"
              size="sm"
              onClick={() => setModalAction("Create Campaign")}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              + Create Campaign
            </GlassButton>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Personalized Greeting Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] text-left">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Good morning, {businessName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
                <span>Your AI marketing employee is active and managing your roadmap.</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/onboarding/business"
                className="text-xs font-mono px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Adjust AI Brief</span>
              </Link>
            </div>
          </div>

          {/* AI Status Card */}
          <AIStatusCard />

          {/* 4 Quick Action Cards */}
          <div>
            <div className="flex items-center justify-between mb-3 text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
                Quick Actions
              </span>
              <span className="text-[11px] font-mono text-cyan-400">1-Click Dispatch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard
                title="Create Product Post"
                description={`Generate on-brand hooks & carousel slides for ${primaryProduct.name}.`}
                icon={<ShoppingBag className="w-5 h-5" />}
                tag="Generative"
                accent="cyan"
                onClick={() => setModalAction("Create Product Post")}
              />

              <QuickActionCard
                title="Launch Offer"
                description="Draft high-converting limited-time flash promotion across stories & reels."
                icon={<Flame className="w-5 h-5" />}
                tag="High-Velocity"
                accent="amber"
                onClick={() => setModalAction("Launch Offer")}
              />

              <QuickActionCard
                title="Plan This Week"
                description={`Synthesize a 7-day editorial calendar for ${state.contentPreferences.frequency}.`}
                icon={<Calendar className="w-5 h-5" />}
                tag="Strategy"
                accent="violet"
                onClick={() => setModalAction("Plan This Week")}
              />

              <QuickActionCard
                title="Analyze Performance"
                description="Inspect real-time engagement tensors, save ratios, and sentiment heatmaps."
                icon={<BarChart2 className="w-5 h-5" />}
                tag="Telemetry"
                accent="emerald"
                onClick={() => setModalAction("Analyze Performance")}
              />
            </div>
          </div>

          {/* Two Columns: Active Campaigns & Scheduled Content Queue */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Active Campaigns */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  Active Autonomous Campaigns
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">
                  {activeCampaigns.length} Sprints Running
                </span>
              </div>

              <div className="space-y-3">
                {activeCampaigns.map((camp) => (
                  <GlassCard
                    key={camp.title}
                    className="p-5 border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-white">{camp.title}</h4>
                        <span className="text-xs text-slate-400 mt-0.5 block">
                          Goal: {camp.goal} • Channel: {camp.channel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {camp.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/[0.06] text-slate-400">
                      <span>Pace: {camp.pace}</span>
                      <span className="text-cyan-300">Brand Fidelity: {camp.health}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Upcoming Queue */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Upcoming Auto-Dispatch Queue
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">Next drop today</span>
              </div>

              <div className="space-y-3">
                {upcomingQueue.map((item) => (
                  <GlassCard
                    key={item.title}
                    className="p-4 border-white/[0.08] flex items-center justify-between gap-3"
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

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex-shrink-0">
                      {item.status}
                    </span>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>

          {/* Connected Social Channel Status Banner */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Connected Channel Health
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Phase 2 Simulated State
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Instagram Business</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {state.connectedAccounts.instagram.handle || "@demo_business (Ready)"}
                    </span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">YouTube Shorts</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {state.connectedAccounts.youtube.channelName || "Channel (Ready)"}
                    </span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Simulated Action Modal */}
      <AnimatePresence>
        {modalAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalAction(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg"
            >
              <GlassCard className="p-6 sm:p-8 border-cyan-500/30 shadow-2xl space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{modalAction}</h3>
                  </div>

                  <button
                    onClick={() => setModalAction(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  SANKALP AI is executing <strong>{modalAction}</strong> using your brand constitution for{" "}
                  <strong>{businessName}</strong>.
                </p>

                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-2 font-mono text-xs text-slate-300">
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span>STATUS: EXECUTING IN BACKGROUND</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p>• Product Target: {primaryProduct.name} ({primaryProduct.price})</p>
                  <p>• Tone Alignment: {state.brand.tone.join(" + ")}</p>
                  <p>• Guardrail Check: PASSED (Fidelity 99.8%)</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <GlassButton
                    variant="cyanGlow"
                    size="sm"
                    onClick={() => setModalAction(null)}
                  >
                    Done
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
