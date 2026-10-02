"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { AICoreScene } from "@/components/three/AICoreScene";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Bot,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  ShoppingBag,
  Users,
  Target,
  Share2,
  Activity,
  Loader2,
} from "lucide-react";

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { state, completeOnboarding } = useOnboarding();
  const { updateUser } = useAuth();

  const [isInitializing, setIsInitializing] = useState(false);
  const [initStage, setInitStage] = useState(0);

  const initSteps = [
    "Loading business foundational matrix...",
    "Embedding brand voice & tone guardrails...",
    "Structuring audience persona clusters...",
    "Calibrating weekly content rhythm...",
    "Establishing omnichannel publishing pipeline...",
    "SANKALP AI Workspace ready.",
  ];

  const handleLaunchWorkspace = () => {
    setIsInitializing(true);
    completeOnboarding();
    updateUser({
      businessName: state.businessProfile.businessName || "My Business",
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setInitStage(current);
      if (current >= initSteps.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          router.push("/workspace");
        }, 900);
      }
    }, 550);
  };

  const business = state.businessProfile;
  const audience = state.audience;
  const brand = state.brand;
  const goals = state.goals;
  const content = state.contentPreferences;
  const accounts = state.connectedAccounts;

  return (
    <div className="relative min-h-screen bg-[#05060A] text-white flex flex-col justify-between overflow-x-hidden p-4 sm:p-8">
      <InteractiveBackground />

      <main className="relative z-20 max-w-5xl w-full mx-auto my-auto py-10">
        {!isInitializing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard
              glow="cyan"
              className="p-8 sm:p-12 border-cyan-500/30 shadow-[0_24px_80px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
            >
              {/* Background ambient radial glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/[0.08] blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                {/* Header badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ONBOARDING COMPLETE</span>
                </div>

                {/* Main Heading */}
                <div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight mb-2">
                    Your AI employee is ready.
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 font-normal">
                    SANKALP has learned about{" "}
                    <strong className="text-cyan-300">{business.businessName || "your business"}</strong>{" "}
                    and is ready to research, create, and scale your social presence.
                  </p>
                </div>

                {/* SANKALP Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-left">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> Business
                    </span>
                    <p className="text-sm font-bold text-white truncate">
                      {business.businessName || "ABC Fashion Store"}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {business.businessType} • {business.location}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <Users className="w-3.5 h-3.5 text-cyan-400" /> Audience
                    </span>
                    <p className="text-sm font-bold text-white truncate">
                      {audience.types[0] || "Young Professionals"}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {audience.ageRange.join(", ")}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" /> Brand Tone
                    </span>
                    <p className="text-sm font-bold text-white truncate">
                      {brand.tone.join(" + ")}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {brand.language.join(", ")}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <Target className="w-3.5 h-3.5 text-cyan-400" /> Primary Goal
                    </span>
                    <p className="text-sm font-bold text-white truncate">
                      {goals.primary || "Promote Products"}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {goals.secondary.length} secondary goals
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" /> Content Engine
                    </span>
                    <p className="text-sm font-bold text-white truncate">
                      {content.frequency.split(" ")[0]}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {content.formats.join(", ")}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Channels
                    </span>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="text-pink-400">
                        IG {accounts.instagram.connected ? "✓" : "○"}
                      </span>
                      <span className="text-red-400">
                        YT {accounts.youtube.connected ? "✓" : "○"}
                      </span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {accounts.instagram.handle || "Ready for sync"}
                    </span>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <GlassButton
                    variant="cyanGlow"
                    size="lg"
                    glow
                    onClick={handleLaunchWorkspace}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto px-10 py-4 text-base font-bold"
                  >
                    Launch My Workspace
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          /* Cinematic Workspace Initialization Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-xl mx-auto space-y-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_40px_rgba(0,240,255,0.4)]">
              <Bot className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase mb-1">
                INITIALIZING SANKALP NEURAL MESH
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Preparing {business.businessName || "Workspace"}...
              </h2>
            </div>

            {/* Initialization checklist logs */}
            <div className="p-6 rounded-2xl bg-[#080A10]/90 border border-white/[0.1] text-left space-y-2.5 font-mono text-xs shadow-2xl">
              {initSteps.map((step, idx) => {
                const isDone = idx < initStage;
                const isCurrent = idx === initStage;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2.5 transition-colors ${
                      isDone
                        ? "text-emerald-400 font-semibold"
                        : isCurrent
                        ? "text-cyan-300 font-bold"
                        : "text-slate-600"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400 flex-shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>

      <footer className="relative z-20 text-center text-[11px] font-mono text-slate-500">
        SANKALP AI Employee • Autonomous Protocol v1.4
      </footer>
    </div>
  );
}
