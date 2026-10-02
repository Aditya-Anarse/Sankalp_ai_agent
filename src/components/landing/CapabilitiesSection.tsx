"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { CAPABILITIES } from "@/data/landingData";
import {
  Search,
  Target,
  Wand2,
  Layers,
  Activity,
  BrainCircuit,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const ICONS_MAP: Record<string, React.ReactNode> = {
  Search: <Search className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Wand2: <Wand2 className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  BrainCircuit: <BrainCircuit className="w-5 h-5" />,
};

export function CapabilitiesSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="capabilities">
      {/* Background glow accents */}
      <div className="absolute top-1/4 right-[-5%] w-[450px] h-[450px] bg-cyan-500/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-[-5%] w-[450px] h-[450px] bg-violet-600/[0.04] blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Autonomous Intelligence Engines"
          badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
          title="AUTONOMOUS"
          gradientText="CAPABILITIES."
          description="Six integrated AI modules working in harmony to replace fragmented agencies, uncoordinated tools, and manual guesswork."
        />

        {/* 6 Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((capability, index) => {
            return (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <GlassCard className="p-7 sm:p-8 h-full flex flex-col justify-between group border-white/[0.08] hover:border-cyan-500/30">
                  <div>
                    {/* Card Top: Number, Badge, Icon */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.1] group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 flex items-center justify-center text-cyan-300 transition-all duration-300 shadow-sm">
                        {ICONS_MAP[capability.iconName]}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                          {capability.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-400/70">
                          {capability.num}
                        </span>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {capability.title}
                    </h3>
                    <p className="text-xs font-medium text-cyan-400/80 mb-4 tracking-wide">
                      {capability.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed mb-6 font-normal">
                      {capability.description}
                    </p>
                  </div>

                  {/* Highlights & Metrics */}
                  <div className="pt-6 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{capability.metrics.label}</span>
                      <span className="text-cyan-300 font-bold">
                        {capability.metrics.value}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {capability.highlights.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-400 border border-white/[0.05]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
