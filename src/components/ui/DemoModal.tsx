"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { X, Play, Sparkles, CheckCircle2, Bot, ArrowRight, Zap } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 w-full max-w-4xl"
        >
          <GlassCard className="p-0 border-white/[0.15] shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white/[0.04] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <Play className="w-4 h-4 fill-cyan-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    SANKALP Autonomous Workflow Walkthrough
                  </h3>
                  <p className="text-[10px] font-mono text-cyan-400">
                    4K Interactive Prototype Preview
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Simulation Canvas */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="relative aspect-video rounded-2xl bg-gradient-to-tr from-[#05060A] via-[#0B0E14] to-[#080A10] border border-white/[0.1] flex flex-col items-center justify-center p-6 text-center overflow-hidden group">
                {/* Background glow and tech grid */}
                <div className="absolute inset-0 bg-tech-grid opacity-30" />
                <div className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-[90px]" />

                <div className="relative z-10 space-y-4 max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-300 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                    <Bot className="w-8 h-8 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Simulating 7-Stage Autonomous Cycle
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Watch how SANKALP autonomously ingests a brand brief, scans live trend APIs, drafts a 7-day social campaign, performs QA, and queues publishing across 5 platforms.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono text-emerald-300">
                      Live Simulation Ready
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons inside modal */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <Zap className="w-3.5 h-3.5" /> 100% Autonomous
                  </span>
                  <span>•</span>
                  <span>Instant Setup</span>
                </div>

                <div className="flex items-center gap-3">
                  <GlassButton variant="secondary" size="sm" onClick={onClose}>
                    Close Preview
                  </GlassButton>
                  <GlassButton
                    variant="cyanGlow"
                    size="sm"
                    onClick={() => {
                      onClose();
                      window.location.href = "/workspace";
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Enter Demo Workspace
                  </GlassButton>

                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
