"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Sparkles,
  RefreshCw,
  Send,
  LineChart,
  BrainCircuit,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LoopNode {
  id: string;
  name: string;
  angle: number; // degrees
  icon: React.ElementType;
  tag: string;
  short: string;
  explanation: string;
  signalOutput: string;
}

const LOOP_NODES: LoopNode[] = [
  {
    id: "create",
    name: "Create",
    angle: 270, // Top
    icon: Sparkles,
    tag: "Generative Stage",
    short: "Synthesizes multi-format assets with tested hook archetypes.",
    explanation: "Constructs copy, carousel blueprints, visual prompts, and video outlines using proven high-retention frameworks tailored to your brand.",
    signalOutput: "Prompt embedding vectors & aesthetic parameters",
  },
  {
    id: "publish",
    name: "Publish",
    angle: 342, // Top-right
    icon: Send,
    tag: "Orchestration Stage",
    short: "Dispatches content at peak algorithmic engagement velocity.",
    explanation: "Coordinates native deployment across Instagram, LinkedIn, X, TikTok, and YouTube Shorts timed to your exact audience's active hours.",
    signalOutput: "Time-of-day engagement velocity markers",
  },
  {
    id: "measure",
    name: "Measure",
    angle: 54, // Bottom-right
    icon: LineChart,
    tag: "Telemetry Stage",
    short: "Tracks retention curves, sentiment delta, and save ratios.",
    explanation: "Captures granular interaction telemetry beyond superficial likes—indexing comment sentiment, bookmark velocities, and drop-off points.",
    signalOutput: "Granular retention & sentiment tensors",
  },
  {
    id: "learn",
    name: "Learn",
    angle: 126, // Bottom-left
    icon: BrainCircuit,
    tag: "Neural Stage",
    short: "Translates raw analytics into prompt calibration weights.",
    explanation: "Isolates which hook structures, color contrasts, topics, and rhythms drove outsized performance, updating internal memory weights.",
    signalOutput: "Reinforcement gradient adjustments",
  },
  {
    id: "improve",
    name: "Improve",
    angle: 198, // Top-left
    icon: Zap,
    tag: "Optimization Stage",
    short: "Adapts next cycle strategy for compounding growth.",
    explanation: "Directly modifies upcoming campaign roadmaps and creative prompts so each week performs better than the previous one.",
    signalOutput: "Updated campaign roadmap delta",
  },
];

export function LearningLoopSection() {
  const [activeNodeId, setActiveNodeId] = useState<string>("learn");

  const activeNode = LOOP_NODES.find((n) => n.id === activeNodeId) || LOOP_NODES[0];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="learning-loop">
      {/* Background glow lamps */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/[0.04] blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Reinforcement Learning Architecture"
          badgeIcon={<RefreshCw className="w-3.5 h-3.5 text-cyan-400" />}
          title="IT DOESN'T JUST POST."
          gradientText="IT LEARNS."
          description="Every campaign generates real performance signals. SANKALP uses these signals to continuously calibrate future copy, hooks, visuals, and timing."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Circular Orbital Visualization */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[380px] sm:min-h-[460px]">
            {/* Outer Orbital Orbit Ring */}
            <div className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full border border-white/[0.08] pointer-events-none" />
            <div className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full border border-cyan-400/20 border-dashed animate-spin-slow pointer-events-none" />

            {/* Inner Ring */}
            <div className="absolute w-[170px] sm:w-[220px] h-[170px] sm:h-[220px] rounded-full border border-white/[0.05] pointer-events-none" />

            {/* Center: SANKALP AI Core */}
            <div className="relative z-20 flex flex-col items-center justify-center w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-gradient-to-tr from-[#080A10] via-cyan-950/40 to-[#080A10] border border-cyan-400/50 shadow-[0_0_40px_rgba(0,240,255,0.25)] text-center p-2 backdrop-blur-xl">
              <div className="relative w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 mb-1">
                <BrainCircuit className="w-4 h-4 animate-pulse" />
              </div>
              <span className="font-extrabold text-xs sm:text-sm tracking-widest text-white">
                SANKALP
              </span>
              <span className="text-[9px] font-mono text-cyan-300 uppercase tracking-wider">
                CORE AI
              </span>
            </div>

            {/* Orbital Nodes */}
            {LOOP_NODES.map((node) => {
              const Icon = node.icon;
              const isSelected = activeNodeId === node.id;
              // Calculate position on 380px circle (radius = 150px on mobile, 190px on desktop)
              const rad = (node.angle * Math.PI) / 180;
              // We'll use CSS transform for responsive placement
              return (
                <div
                  key={node.id}
                  style={{
                    transform: `rotate(${node.angle}deg) translate(clamp(130px, 18vw, 175px)) rotate(-${node.angle}deg)`,
                  }}
                  className="absolute z-30 transition-transform duration-500"
                >
                  <button
                    onClick={() => setActiveNodeId(node.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-300 group shadow-lg backdrop-blur-xl focus:outline-none",
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_25px_rgba(0,240,255,0.4)] scale-110 border"
                        : "bg-[#080A10]/80 border-white/[0.1] text-slate-300 hover:border-white/30 border"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-cyan-400 text-black"
                          : "bg-white/[0.05] text-slate-400 group-hover:text-white"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap">
                      {node.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Interactive Signal Card */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className="p-6 sm:p-8 border-cyan-500/20 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between gap-4 mb-5 pb-5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                        {React.createElement(activeNode.icon, { className: "w-5 h-5" })}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                          {activeNode.tag}
                        </span>
                        <h3 className="text-2xl font-bold text-white">
                          {activeNode.name}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      Step in Autonomous Loop
                    </span>
                  </div>

                  <p className="text-base text-slate-300 leading-relaxed mb-6 font-normal">
                    {activeNode.explanation}
                  </p>

                  {/* Signal Output Box */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1.5 mb-6">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Emitted Feedback Signal:
                    </span>
                    <p className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      {activeNode.signalOutput}
                    </p>
                  </div>

                  {/* Why it compounds */}
                  <div className="flex items-start gap-3 text-xs text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      Signals automatically tune subsequent batch prompts without requiring user intervention.
                    </span>
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
