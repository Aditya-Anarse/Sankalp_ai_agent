"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useOnboarding } from "@/context/OnboardingContext";
import { Bot, CheckCircle2, Zap, Activity, ShieldCheck, Database } from "lucide-react";

export function AIStatusCard() {
  const { state } = useOnboarding();

  const readinessChecks = [
    { name: "Business understanding", status: "Ready", detail: state.businessProfile.businessType || "D2C" },
    { name: "Brand memory", status: "Ready", detail: `${state.brand.tone.length} tones active` },
    { name: "Audience profile", status: "Ready", detail: `${state.audience.ageRange.join(", ")}` },
    { name: "Content preferences", status: "Ready", detail: state.contentPreferences.frequency || "3x/week" },
  ];

  return (
    <GlassCard glow="cyan" className="p-6 border-cyan-500/30 text-left relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.06] blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: AI Avatar & Status */}
        <div className="flex items-start gap-4">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.3)]">
            <Bot className="w-7 h-7 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#05060A] animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#05060A]" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-white">SANKALP AI</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 font-medium">
              "Your workspace is configured and ready to execute marketing campaigns."
            </p>

            <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-cyan-300">
                <Zap className="w-3.5 h-3.5" /> Neural Mesh v1.4
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Zero Hallucination Guardrail Active
              </span>
            </div>
          </div>
        </div>

        {/* Right: 4 Readiness Pillars */}
        <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto">
          {readinessChecks.map((check) => (
            <div
              key={check.name}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-3 min-w-[170px]"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">
                  {check.name}
                </span>
                <span className="text-xs font-semibold text-white truncate block">
                  {check.detail}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
