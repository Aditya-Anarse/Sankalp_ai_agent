"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { AIStatusCard } from "@/components/workspace/AIStatusCard";
import { QuickActionCard } from "@/components/workspace/QuickActionCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Flame,
  Clock,
  Instagram,
  Youtube,
  Plus,
  RefreshCw,
  ShoppingBag,
  Calendar,
  BarChart2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function WorkspacePage() {
  const router = useRouter();
  const { state } = useOnboarding();
  const { business, campaigns, contentItems, refreshAll } = useApp();
  const { user } = useAuth();

  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);

  useEffect(() => {
    refreshAll();
    const fetchAccounts = async () => {
      try {
        const accs = await api.socialAccounts.list();
        if (Array.isArray(accs)) {
          setConnectedAccounts(accs);
        }
      } catch (e) {
        console.warn("Could not fetch accounts:", e);
      }
    };
    fetchAccounts();
  }, []);

  const businessName =
    business.name || state.businessProfile.businessName || user?.businessName || "My Business";

  const instagramAcc = connectedAccounts.find(
    (a) => a.platform === "instagram" && a.is_connected
  );
  const youtubeAcc = connectedAccounts.find(
    (a) => a.platform === "youtube" && a.is_connected
  );

  const scheduledItems = contentItems.filter(
    (c) => c.status === "scheduled" || c.scheduled_at
  );

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar */}
      <WorkspaceSidebar activeTab="Overview" />

      {/* Main Workspace Workspace */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Workspace: <strong className="text-white">{businessName}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/workspace/ai-manager">
              <GlassButton
                variant="cyanGlow"
                size="sm"
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                + Create Campaign
              </GlassButton>
            </Link>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Personalized Greeting Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06] text-left">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {businessName} Workspace
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
                <span>Autonomous marketing operations powered by 7 specialized agents.</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/brand-settings"
                className="text-xs font-mono px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Brand Settings</span>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard
                title="AI Manager Campaign"
                description="Prompt your AI marketing manager to research and launch a new campaign."
                icon={<ShoppingBag className="w-5 h-5" />}
                tag="Autonomous"
                accent="cyan"
                onClick={() => router.push("/workspace/ai-manager")}
              />

              <QuickActionCard
                title="Content Studio"
                description="Review, edit, quality-check, and schedule generated content assets."
                icon={<Flame className="w-5 h-5" />}
                tag="Creation"
                accent="amber"
                onClick={() => router.push("/content-studio")}
              />

              <QuickActionCard
                title="Content Calendar"
                description="Inspect scheduled publishing queue and multi-platform drops."
                icon={<Calendar className="w-5 h-5" />}
                tag="Schedule"
                accent="violet"
                onClick={() => router.push("/calendar")}
              />

              <QuickActionCard
                title="Performance & Insights"
                description="View telemetry, platform analytics, and autonomous learning patterns."
                icon={<BarChart2 className="w-5 h-5" />}
                tag="Telemetry"
                accent="emerald"
                onClick={() => router.push("/analytics")}
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
                  Active Campaigns
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">
                  {campaigns.length} Total
                </span>
              </div>

              <div className="space-y-3">
                {campaigns.length === 0 ? (
                  <GlassCard className="p-8 text-center border-dashed border-white/[0.1] space-y-3">
                    <p className="text-xs text-slate-400">No campaigns created yet.</p>
                    <Link href="/workspace/ai-manager">
                      <GlassButton variant="cyanGlow" size="sm">
                        Create Your First Campaign
                      </GlassButton>
                    </Link>
                  </GlassCard>
                ) : (
                  campaigns.map((camp) => (
                    <GlassCard
                      key={camp.id}
                      className="p-5 border-white/[0.08] hover:border-cyan-500/30 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-bold text-white">{camp.name}</h4>
                          <span className="text-xs text-slate-400 mt-0.5 block truncate max-w-sm">
                            {camp.objective}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                          {camp.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-white/[0.06] text-slate-400">
                        <span>Platforms: {camp.target_platforms?.join(", ") || "Instagram"}</span>
                        <Link href="/campaigns" className="text-cyan-400 hover:underline">
                          View Details →
                        </Link>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Queue */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Scheduled Publishing Queue
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">
                  {scheduledItems.length} Scheduled
                </span>
              </div>

              <div className="space-y-3">
                {scheduledItems.length === 0 ? (
                  <GlassCard className="p-8 text-center border-dashed border-white/[0.1] space-y-3">
                    <p className="text-xs text-slate-400">No scheduled content.</p>
                    <Link href="/content-studio">
                      <GlassButton variant="secondary" size="sm">
                        Open Content Studio
                      </GlassButton>
                    </Link>
                  </GlassCard>
                ) : (
                  scheduledItems.map((item) => (
                    <GlassCard
                      key={item.id}
                      className="p-4 border-white/[0.08] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-slate-400 capitalize">
                            {item.platform} • {item.content_type}
                          </span>
                          {item.scheduled_at && (
                            <span className="text-[10px] font-mono text-cyan-400">
                              {new Date(item.scheduled_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex-shrink-0 uppercase">
                        {item.status}
                      </span>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Connected Social Channel Status Banner */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Connected Platforms
              </span>
              <Link href="/connected-accounts" className="text-xs font-mono text-cyan-400 hover:underline">
                Manage Accounts →
              </Link>
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
                      {instagramAcc ? instagramAcc.account_name : "Not Connected"}
                    </span>
                  </div>
                </div>
                {instagramAcc ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600" title="Not Connected" />
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Youtube className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">YouTube Channel</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {youtubeAcc ? youtubeAcc.account_name : "Not Connected"}
                    </span>
                  </div>
                </div>
                {youtubeAcc ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600" title="Not Connected" />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
