"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassButton } from "@/components/ui/GlassButton";
import { AICoreScene } from "@/components/three/AICoreScene";
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Bot,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  onOpenDemo?: () => void;
  onOpenAuth?: () => void;
}

export function HeroSection({ onOpenDemo, onOpenAuth }: HeroSectionProps) {
  return (
    <section className="relative min-h-[95vh] pt-32 pb-20 md:pt-40 md:pb-32 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content & Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Small Glowing Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/[0.08] border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin-slow" />
              <span>✦ AUTONOMOUS AI MARKETING</span>
            </motion.div>

            {/* Main Cinematic Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] text-white mb-6 uppercase"
            >
              YOUR AI <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                MARKETING
              </span>{" "}
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
                EMPLOYEE.
              </span>
            </motion.h1>

            {/* Alternative Supporting Line */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-2 text-base sm:text-lg font-medium text-cyan-300/90 mb-3"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Your business runs the shop. SANKALP runs your social media.</span>
            </motion.div>

            {/* Supporting Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl text-slate-400 max-w-xl font-normal leading-relaxed mb-8"
            >
              SANKALP researches, plans, creates, publishes and continuously improves your social-media marketing—100% autonomously without generic templates.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/signup" className="w-full sm:w-auto">
                <GlassButton
                  variant="cyanGlow"
                  size="lg"
                  glow
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Start Building
                </GlassButton>
              </Link>

              <GlassButton
                variant="secondary"
                size="lg"
                onClick={onOpenDemo}
                icon={<Play className="w-4 h-4 fill-white/80 text-white/80" />}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Watch Demo
              </GlassButton>
            </motion.div>

            {/* Micro Feature Bullets */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-10 mt-10 border-t border-white/[0.08] w-full"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Zero Manual Prompting</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Reinforced Learning</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Omnichannel Deployment</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D AI Marketing Core Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full flex items-center justify-center"
          >
            <div className="w-full max-w-[540px] aspect-square rounded-3xl relative">
              <AICoreScene />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
