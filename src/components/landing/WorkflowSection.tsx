"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { WORKFLOW_STEPS } from "@/data/landingData";
import {
  Compass,
  Cpu,
  Sparkles,
  ShieldCheck,
  Send,
  BarChart3,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Send: <Send className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
};

export function WorkflowSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const activeStep = WORKFLOW_STEPS[activeStepIndex];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="how-it-works">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-[-10%] w-[500px] h-[500px] bg-cyan-500/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] bg-violet-600/[0.04] blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="End-to-End Autonomous Pipeline"
          badgeIcon={<Layers className="w-3.5 h-3.5" />}
          title="FROM IDEA"
          gradientText="TO IMPACT."
          description="SANKALP executes every phase of modern marketing in a frictionless, continuous loop that learns and improves after every single post."
        />

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Vertical Connected Step List */}
          <div className="lg:col-span-5 flex flex-col gap-3 relative">
            {/* Glowing Connector Track */}
            <div className="hidden sm:block absolute left-7 top-6 bottom-6 w-[2px] bg-white/[0.08]" />

            {WORKFLOW_STEPS.map((step, index) => {
              const isActive = index === activeStepIndex;
              return (
                <motion.div
                  key={step.step}
                  onClick={() => {
                    setActiveStepIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    "relative z-10 flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300",
                    isActive
                      ? "bg-white/[0.08] backdrop-blur-xl border border-cyan-400/40 shadow-[0_0_25px_rgba(0,240,255,0.15)]"
                      : "bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06]"
                  )}
                >
                  {/* Step Number & Icon Disc */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl font-mono text-xs font-bold transition-colors flex-shrink-0",
                      isActive
                        ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                        : "bg-white/[0.06] text-slate-400 border border-white/[0.1]"
                    )}
                  >
                    {step.step}
                  </div>

                  {/* Title & Tag */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={cn(
                          "text-sm sm:text-base font-semibold transition-colors truncate",
                          isActive ? "text-white" : "text-slate-300"
                        )}
                      >
                        {step.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.05]">
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {step.shortDesc}
                    </p>
                  </div>

                  {/* Active Indicator Chevron */}
                  {isActive && (
                    <motion.div
                      layoutId="activeArrow"
                      className="text-cyan-400 flex-shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Deep-Dive Stage Inspector */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <GlassCard className="p-6 sm:p-8 border-cyan-500/20 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                        {ICONS_MAP[activeStep.iconName]}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-cyan-400 tracking-wider">
                          STAGE {activeStep.step} OF 07
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                          {activeStep.title}
                        </h3>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{activeStep.systemMetric}</span>
                    </div>
                  </div>

                  {/* Full Description */}
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
                    {activeStep.fullDesc}
                  </p>

                  {/* Generated Artifact Deliverables */}
                  <div className="space-y-4">
                    <div className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                      Autonomous Deliverables:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeStep.deliverables.map((deliverable) => (
                        <div
                          key={deliverable}
                          className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-2.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-200 font-medium leading-snug">
                            {deliverable}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Continuous Loop Indicator Footer */}
                  <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span>Process feeds into Stage {((activeStepIndex + 1) % 7 + 1).toString().padStart(2, "0")} instantly</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsAutoPlaying(!isAutoPlaying);
                      }}
                      className="text-xs font-mono text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                    >
                      {isAutoPlaying ? "⏸ Pause Auto-Tour" : "▶ Resume Auto-Tour"}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
