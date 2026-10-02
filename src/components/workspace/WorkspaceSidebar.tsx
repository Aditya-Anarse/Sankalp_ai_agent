"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Sparkles,
  LayoutDashboard,
  Bot,
  Flame,
  Film,
  Calendar,
  BarChart2,
  Share2,
  Settings,
  LogOut,
  RefreshCw,
  Lightbulb,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function WorkspaceSidebar({ activeTab: propActiveTab }: WorkspaceSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { state } = useOnboarding();

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/workspace" },
    { name: "AI Manager", icon: Bot, href: "/workspace/ai-manager", badge: "Live" },
    { name: "Campaigns", icon: Flame, href: "/campaigns" },
    { name: "Content Studio", icon: Film, href: "/content-studio" },
    { name: "Calendar", icon: Calendar, href: "/calendar" },
    { name: "Analytics", icon: BarChart2, href: "/analytics" },
    { name: "Learning Center", icon: Lightbulb, href: "/learning", badge: "AI Loop" },
    { name: "Agent Activity", icon: Activity, href: "/agent-activity" },
    { name: "Connected Accounts", icon: Share2, href: "/connected-accounts" },
    { name: "Brand Settings", icon: Settings, href: "/brand-settings" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleReconfigure = () => {
    router.push("/onboarding/business");
  };

  return (
    <aside className="w-full lg:w-64 bg-[#080A10]/95 backdrop-blur-2xl border-r border-white/[0.08] p-5 flex flex-col justify-between min-h-screen">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="font-extrabold tracking-widest text-base text-white block">
              SANKALP
            </span>
            <span className="text-[10px] font-mono text-cyan-400 block -mt-1">
              AI EMPLOYEE
            </span>
          </div>
        </Link>

        {/* Business Selector Pill */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-left">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">
            Active Workspace
          </span>
          <p className="text-xs font-bold text-white truncate">
            {state.businessProfile.businessName || user?.businessName || "ABC Fashion Store"}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400">
              {state.businessProfile.businessType || "Fashion & Apparel"}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-3 block mb-1">
            Workspace Hub
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected =
              pathname === item.href ||
              (item.href === "/workspace" && pathname === "/workspace") ||
              propActiveTab === item.name;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left",
                  isSelected
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-bold shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="space-y-2 pt-6 border-t border-white/[0.08]">
        <button
          onClick={handleReconfigure}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-white/[0.04] transition-colors text-left"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Edit Brand Onboarding</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-white/[0.04] transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
