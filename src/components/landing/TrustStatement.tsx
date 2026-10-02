"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Shield, RefreshCw, Zap, LineChart } from "lucide-react";

export function TrustStatement() {
  const metrics = [
    {
      icon: Zap,
      label: "Zero Human Prompts Needed",
      desc: "Self-directing agent architecture",
    },
    {
      icon: Shield,
      label: "Strict Brand Guardrails",
      desc: "100% adherence to tone & style guidelines",
    },
    {
      icon: LineChart,
      label: "Data-Driven Feedback Loop",
      desc: "Compounds performance over time",
    },
    {
      icon: RefreshCw,
      label: "Perpetual 24/7 Execution",
      desc: "Never misses an algorithmic peak window",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 border-y border-white/[0.06] bg-[#080A10]/40 overflow-hidden" id="product">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold tracking-widest text-cyan-300 uppercase mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>THE AUTONOMOUS ADVANTAGE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase leading-[1.08] mb-6"
          >
            ONE BRIEF. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              ONE AI EMPLOYEE.
            </span> <br />
            CONTINUOUS MARKETING.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            From business goals to published content and performance insights, SANKALP brings the entire marketing workflow into one intelligent system.
          </motion.p>
        </div>

        {/* 4 Feature highlight pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full border-white/[0.06] hover:border-cyan-500/30">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center mb-4 text-cyan-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    {item.label}
                  </h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    {item.desc}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
