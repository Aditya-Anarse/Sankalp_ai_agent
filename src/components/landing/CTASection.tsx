"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useOnboarding } from "@/context/OnboardingContext";
import { Sparkles, ArrowRight, CheckCircle2, Bot, Zap } from "lucide-react";

interface CTASectionProps {
  onOpenAuth?: (mode: "signup") => void;
}

export function CTASection({ onOpenAuth }: CTASectionProps) {
  const router = useRouter();
  const { updateBusinessProfile } = useOnboarding();
  const [businessName, setBusinessName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      router.push("/signup");
      return;
    }

    updateBusinessProfile({ businessName: businessName.trim() });
    setSubmitted(true);
  };

  const handleProceedToSetup = () => {
    router.push("/onboarding/business");
  };

  return (
    <section className="relative py-24 md:py-36 overflow-hidden" id="cta">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[400px] bg-gradient-to-r from-cyan-500/10 via-indigo-600/10 to-violet-500/10 blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <GlassCard
            glow="cyan"
            className="p-8 sm:p-14 lg:p-16 text-center border-cyan-500/30 relative overflow-hidden"
          >
            {/* Ambient inner radial highlight */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-400/[0.08] blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-semibold tracking-wider text-cyan-300 uppercase mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>PHASE 2 WORKSPACE ONBOARDING</span>
              </div>

              {/* Huge Cinematic CTA Heading */}
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1] mb-6">
                LET SANKALP <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  RUN YOUR MARKETING.
                </span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-10">
                Give your business an autonomous AI marketing employee that never stops researching, planning, creating and learning.
              </p>

              {/* Interactive Brief Input or Button */}
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3"
                >
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name..."
                    className="w-full px-5 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.15] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400/80 focus:bg-white/[0.08] transition-all"
                  />
                  <GlassButton
                    type="submit"
                    variant="cyanGlow"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto flex-shrink-0 font-bold"
                  >
                    Start Building
                  </GlassButton>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-left max-w-md w-full space-y-3"
                >
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                    <Bot className="w-4 h-4" />
                    <span>Workspace Allocated for {businessName}!</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    SANKALP is ready to ingest your products, brand tone, and audience profile.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs font-mono text-slate-400 hover:text-white underline"
                    >
                      Change Name
                    </button>
                    <GlassButton
                      type="button"
                      variant="cyanGlow"
                      size="sm"
                      onClick={handleProceedToSetup}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Begin Setup (Step 1)
                    </GlassButton>
                  </div>
                </motion.div>
              )}

              {/* Trust guarantees */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Instant 2-Minute Onboarding
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  No Credit Card Required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  Full Brand Voice Control
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
