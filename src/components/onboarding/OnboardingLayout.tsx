"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { OnboardingAICore } from "./OnboardingAICore";
import { OnboardingProgress } from "./OnboardingProgress";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { Sparkles, ArrowLeft, ArrowRight, Wand2 } from "lucide-react";

interface OnboardingLayoutProps {
  currentStep: number;
  heading: string;
  subheading: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextText?: string;
  loading?: boolean;
}

export function OnboardingLayout({
  currentStep,
  heading,
  subheading,
  children,
  onNext,
  onBack,
  nextDisabled = false,
  nextText = "Continue",
  loading = false,
}: OnboardingLayoutProps) {
  const router = useRouter();
  const { state, loadDemoData } = useOnboarding();

  const handleDefaultBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    const prevRoutes: Record<number, string> = {
      2: "/onboarding/business",
      3: "/onboarding/products",
      4: "/onboarding/audience",
      5: "/onboarding/brand",
      6: "/onboarding/goals",
      7: "/onboarding/content",
    };
    if (prevRoutes[currentStep]) {
      router.push(prevRoutes[currentStep]);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05060A] text-white flex flex-col justify-between overflow-x-hidden">
      <InteractiveBackground />

      {/* Top Floating App Bar */}
      <header className="relative z-30 w-full px-4 sm:px-8 py-5 border-b border-white/[0.06] bg-[#05060A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:border-cyan-400/80 transition-colors">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <span className="font-extrabold tracking-widest text-lg text-white group-hover:text-cyan-300 transition-colors">
              SANKALP
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wider">
              ONBOARDING
            </span>
          </Link>

          {/* Quick Demo Pre-fill helper */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadDemoData();
              }}
              className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-cyan-300 border border-white/[0.1] transition-all flex items-center gap-1.5"
              title="Pre-fill realistic business data for instant testing"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Fill Sample Preset</span>
            </button>
            <Link
              href="/"
              className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: SANKALP AI Core 3D Learning Canvas */}
          <div className="lg:col-span-5 flex flex-col">
            <OnboardingAICore
              currentStep={currentStep}
              businessName={state.businessProfile.businessName}
            />
          </div>

          {/* Right Column: Step Form Container */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <GlassCard
              glow="none"
              className="p-6 sm:p-10 border-white/[0.1] shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex flex-col justify-between h-full min-h-[580px]"
            >
              <div>
                {/* Progress bar at top of form */}
                <div className="mb-8">
                  <OnboardingProgress currentStep={currentStep} />
                </div>

                {/* Step Heading & Subheading */}
                <div className="mb-8 text-left">
                  <motion.h1
                    key={`h1-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2"
                  >
                    {heading}
                  </motion.h1>
                  <motion.p
                    key={`p-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="text-xs sm:text-sm text-slate-400 leading-relaxed"
                  >
                    {subheading}
                  </motion.p>
                </div>

                {/* Form Fields & Interactive Step Body */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Action Buttons Footer */}
              <div className="pt-8 mt-8 border-t border-white/[0.08] flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <GlassButton
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleDefaultBack}
                    icon={<ArrowLeft className="w-4 h-4" />}
                    iconPosition="left"
                  >
                    Back
                  </GlassButton>
                ) : (
                  <div />
                )}

                <GlassButton
                  type="button"
                  variant="cyanGlow"
                  size="md"
                  onClick={onNext}
                  disabled={nextDisabled || loading}
                  icon={<ArrowRight className="w-4 h-4" />}
                  glow
                >
                  {loading ? "Processing..." : nextText}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full px-6 py-4 text-center text-[11px] font-mono text-slate-500 max-w-7xl mx-auto border-t border-white/[0.04]">
        <span>SANKALP Autonomous Setup Protocol • Phase 2</span>
      </footer>
    </div>
  );
}
