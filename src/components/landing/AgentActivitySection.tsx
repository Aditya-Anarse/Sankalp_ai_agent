"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { MOCK_AGENT_LOGS } from "@/data/landingData";
import {
  Bot,
  Terminal,
  Cpu,
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Activity,
  ShieldAlert,
  Database,
  Layers,
} from "lucide-react";

export function AgentActivitySection() {
  const [currentLogs, setCurrentLogs] = useState(MOCK_AGENT_LOGS.slice(0, 4));
  const [activeTab, setActiveTab] = useState<"terminal" | "memory" | "constitution">("terminal");
  const [progress, setProgress] = useState(74);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 20 : prev + 4));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const agentSkills = [
    { name: "Deep Research Radar", status: "Active", latency: "14ms" },
    { name: "Brand Voice Guardrail", status: "Active", latency: "8ms" },
    { name: "Multi-Modal Synthesizer", status: "Active", latency: "32ms" },
    { name: "Algorithmic Peak Dispatcher", status: "Active", latency: "11ms" },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#080A10]/30" id="ai-employee">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-cyan-500/[0.03] blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Autonomous Agent In Action"
          badgeIcon={<Bot className="w-3.5 h-3.5" />}
          title="MEET YOUR AI"
          gradientText="MARKETING EMPLOYEE."
          description="SANKALP operates continuously in the background—researching trends, generating on-brand content, checking quality, and orchestrating deployment without needing human supervision."
        />

        {/* Futuristic Glass Agent Command Console */}
        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-0 border-white/[0.12] shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Console Header Bar */}
            <div className="px-6 py-4 bg-white/[0.04] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                  <Bot className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#05060A] animate-ping" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#05060A]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-wide">
                      SANKALP
                    </h3>
                    <Badge variant="cyan" dot className="text-[10px] py-0 px-2">
                      WORKING
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-slate-400">
                    AI MARKETING MANAGER • MESH ID: #SNK-9842
                  </p>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.06] text-xs font-mono text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Agent Latency: 18ms</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Autonomy: Level 4</span>
                </div>
              </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="px-6 py-2 bg-white/[0.02] border-b border-white/[0.06] flex items-center gap-4 text-xs font-mono">
              <button
                onClick={() => setActiveTab("terminal")}
                className={`flex items-center gap-1.5 py-2 border-b-2 transition-colors ${
                  activeTab === "terminal"
                    ? "border-cyan-400 text-cyan-300 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Live Activity Stream</span>
              </button>
              <button
                onClick={() => setActiveTab("memory")}
                className={`flex items-center gap-1.5 py-2 border-b-2 transition-colors ${
                  activeTab === "memory"
                    ? "border-cyan-400 text-cyan-300 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Neural Brand Memory</span>
              </button>
              <button
                onClick={() => setActiveTab("constitution")}
                className={`flex items-center gap-1.5 py-2 border-b-2 transition-colors ${
                  activeTab === "constitution"
                    ? "border-cyan-400 text-cyan-300 font-semibold"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Guardrails & Persona</span>
              </button>
            </div>

            {/* Console Content Area */}
            <div className="p-6 sm:p-8">
              {activeTab === "terminal" && (
                <div className="space-y-6">
                  {/* Current Active Pipeline Step */}
                  <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                    <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2">
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4 animate-spin text-cyan-400" />
                        Current Task: Synthesizing Omnichannel Growth Sprint (Week 41)
                      </span>
                      <span>{progress}% complete</span>
                    </div>
                    {/* Glowing Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_12px_rgba(0,240,255,0.8)]"
                        style={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                      />
                    </div>
                  </div>

                  {/* Terminal Log Stream */}
                  <div className="space-y-3 font-mono text-xs">
                    <div className="text-[11px] text-slate-500 tracking-wider uppercase mb-2">
                      Live Telemetry Feed:
                    </div>
                    {MOCK_AGENT_LOGS.map((log, index) => (
                      <motion.div
                        key={log.time}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                        className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                      >
                        <span className="text-slate-500 select-none">{log.time}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {log.tag}
                        </span>
                        <span className="text-slate-300 flex-1">{log.message}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Sub-agents Mesh Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.08]">
                    {agentSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-1"
                      >
                        <span className="text-[11px] text-slate-400">{skill.name}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {skill.status}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            {skill.latency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "memory" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="text-cyan-300 font-bold">CORE KNOWLEDGE BASES MOUNTED:</div>
                    <ul className="space-y-1.5 text-slate-300">
                      <li>• Brand Guidelines (Typography: Minimalist, Color Palette: Obsidian / Cyan, Tone: Confident, Authoritative, Visionary)</li>
                      <li>• Historical High-Performers: 142 viral hooks indexed with &gt;12% conversion rates</li>
                      <li>• Excluded Angles: Hard sales pitch, generic stock photos, discount spamming</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400">
                    Memory Mesh automatically fine-tunes prompt contextual vectors after every published asset batch.
                  </div>
                </div>
              )}

              {activeTab === "constitution" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="text-emerald-300 font-bold">ACTIVE SAFETY & QUALITY FILTERS:</div>
                    <ul className="space-y-1.5 text-slate-300">
                      <li>✓ Zero Hallucination Policy: All statistics and claims cross-verified against brand source documents</li>
                      <li>✓ Anti-Repetition Filter: Enforces narrative variety across 14-day rolling windows</li>
                      <li>✓ Platform-Native Aspect Ratio Enforcer (4:5 Feed, 9:16 Reels/TikTok, 16:9 Landscape)</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
