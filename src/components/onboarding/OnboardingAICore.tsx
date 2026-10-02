"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AICoreScene } from "@/components/three/AICoreScene";
import { Bot, Sparkles, BrainCircuit, Activity, CheckCircle2 } from "lucide-react";

interface OnboardingAICoreProps {
  currentStep: number;
  businessName?: string;
}

const STEP_LABELS: Record<number, { title: string; subtitle: string; tag: string }> = {
  1: {
    title: "UNDERSTANDING BUSINESS",
    subtitle: "Analyzing industry niche & value proposition",
    tag: "INGESTING FOUNDATIONAL DATA",
  },
  2: {
    title: "LEARNING PRODUCTS",
    subtitle: "Mapping catalog, pricing & hero features",
    tag: "CATALOG SYNTHESIS",
  },
  3: {
    title: "UNDERSTANDING AUDIENCE",
    subtitle: "Structuring demographic & psychographic personas",
    tag: "PERSONA CALIBRATION",
  },
  4: {
    title: "LEARNING BRAND",
    subtitle: "Calibrating tone of voice & visual constitution",
    tag: "VOICE NEURAL MESH",
  },
  5: {
    title: "UNDERSTANDING GOALS",
    subtitle: "Aligning growth targets & campaign algorithms",
    tag: "STRATEGIC OBJECTIVE MATRIX",
  },
  6: {
    title: "LEARNING PREFERENCES",
    subtitle: "Configuring formats, frequencies & peak windows",
    tag: "DISPATCH RULES ENGINE",
  },
  7: {
    title: "CONNECTING CHANNELS",
    subtitle: "Establishing secure publishing pipelines",
    tag: "OMNICHANNEL SYNC",
  },
};

export function OnboardingAICore({ currentStep, businessName }: OnboardingAICoreProps) {
  const stepInfo = STEP_LABELS[currentStep] || STEP_LABELS[1];

  return (
    <div className="relative w-full h-full min-h-[360px] lg:min-h-[580px] flex flex-col items-center justify-between p-6 sm:p-8 rounded-3xl bg-[#080A10]/60 backdrop-blur-2xl border border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/[0.08] blur-[100px] pointer-events-none" />

      {/* Top Header info */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Bot className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-widest text-white">
              SANKALP AI
            </span>
            <div className="text-[10px] font-mono text-cyan-400">
              ACTIVE LEARNING PROTOCOL
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYNAPSE ONLINE</span>
        </span>
      </div>

      {/* Center: 3D AI Core Canvas */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] aspect-square my-2">
        <AICoreScene />
      </div>

      {/* Bottom: Dynamic Learning HUD Tag */}
      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/20 shadow-lg text-left"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                {stepInfo.tag}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                STAGE 0{currentStep} / 07
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" />
              <span>{stepInfo.title}</span>
            </h4>

            <p className="text-xs text-slate-400 mt-1 font-normal">
              {stepInfo.subtitle}
              {businessName ? ` for ${businessName}.` : "."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
