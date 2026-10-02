"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { num: 1, name: "Business", path: "/onboarding/business" },
  { num: 2, name: "Products", path: "/onboarding/products" },
  { num: 3, name: "Audience", path: "/onboarding/audience" },
  { num: 4, name: "Brand", path: "/onboarding/brand" },
  { num: 5, name: "Goals", path: "/onboarding/goals" },
  { num: 6, name: "Content", path: "/onboarding/content" },
  { num: 7, name: "Connect", path: "/onboarding/connect" },
];

const PERCENTAGES: Record<number, number> = {
  1: 14,
  2: 28,
  3: 42,
  4: 57,
  5: 71,
  6: 85,
  7: 100,
};

export function OnboardingProgress({
  currentStep,
  totalSteps = 7,
}: OnboardingProgressProps) {
  const percentage = PERCENTAGES[currentStep] || Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Top Title & Progress numbers */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-medium">
          Building your SANKALP workspace
        </span>
        <div className="flex items-center gap-2">
          <span className="text-cyan-300 font-bold">{percentage}%</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">
            Step 0{currentStep} / 0{totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar with Glow */}
      <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 shadow-[0_0_12px_rgba(0,240,255,0.8)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step Pills Navigator */}
      <div className="hidden sm:flex items-center justify-between gap-1 pt-1">
        {STEPS.map((step) => {
          const isCurrent = step.num === currentStep;
          const isPassed = step.num < currentStep;

          return (
            <div
              key={step.num}
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-mono px-2 py-1 rounded-lg transition-all",
                isCurrent
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold"
                  : isPassed
                  ? "text-slate-400"
                  : "text-slate-600"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold",
                  isCurrent
                    ? "bg-cyan-400 text-black shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                    : isPassed
                    ? "bg-white/[0.1] text-cyan-300"
                    : "bg-white/[0.04] text-slate-600"
                )}
              >
                {step.num}
              </span>
              <span className="truncate">{step.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
