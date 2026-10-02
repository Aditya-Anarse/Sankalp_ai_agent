"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { BUSINESS_SEGMENTS } from "@/data/landingData";
import {
  Store,
  Briefcase,
  Rocket,
  Sparkles,
  UserCheck,
  Users,
  CheckCircle2,
  Building2,
  ArrowRight,
} from "lucide-react";

const ICONS_MAP: Record<string, React.ReactNode> = {
  Store: <Store className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
  Sparkle: <Sparkles className="w-5 h-5" />,
  UserCheck: <UserCheck className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
};

export function BusinessSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#080A10]/30" id="business">
      {/* Background ambient lights */}
      <div className="absolute top-1/3 left-[-5%] w-[450px] h-[450px] bg-cyan-500/[0.03] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-[-5%] w-[450px] h-[450px] bg-violet-600/[0.03] blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Tailored For Every Operator"
          badgeIcon={<Building2 className="w-3.5 h-3.5" />}
          title="BUILT FOR BUSINESSES"
          gradientText="THAT HAVE BETTER THINGS TO DO."
          description="Whether you run a high-street boutique or a fast-paced software startup, SANKALP automates your marketing so you can focus entirely on your core product and clients."
        />

        {/* 6 Business Segment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {BUSINESS_SEGMENTS.map((seg, index) => (
            <motion.div
              key={seg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <GlassCard className="p-7 h-full flex flex-col justify-between group border-white/[0.07] hover:border-cyan-500/30">
                <div>
                  {/* Top: Icon + Agents active tag */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.1] group-hover:border-cyan-400/40 group-hover:bg-cyan-500/10 flex items-center justify-center text-cyan-300 transition-colors">
                      {ICONS_MAP[seg.iconName]}
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {seg.activeAgents}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {seg.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mb-4">
                    {seg.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                    {seg.description}
                  </p>

                  {/* Struggle vs SANKALP Solution Callout */}
                  <div className="space-y-3 pt-4 border-t border-white/[0.06] text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-slate-400 font-medium block mb-1">
                        Typical Bottleneck:
                      </span>
                      <p className="text-slate-300 italic">"{seg.currentStruggle}"</p>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                      <span className="text-cyan-300 font-medium block mb-1">
                        SANKALP Automation:
                      </span>
                      <p className="text-slate-200">{seg.sankalpSolution}</p>
                    </div>
                  </div>
                </div>

                {/* Key feature footer */}
                <div className="pt-5 mt-5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Core Feature:</span>
                  <span className="text-cyan-300 font-semibold">{seg.keyFeature}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
