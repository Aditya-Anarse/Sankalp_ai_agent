"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { X, Sparkles, Bot, ArrowRight, ShieldCheck, Mail, Lock, Building } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-md"
        >
          <GlassCard className="p-8 border-cyan-500/30 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <span className="font-extrabold text-sm tracking-widest text-white">
                  SANKALP AI
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto text-emerald-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Access Granted</h4>
                <p className="text-xs text-slate-300">
                  Connecting to SANKALP Autonomous Neural Command Mesh...
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {mode === "login" ? "Welcome back to SANKALP" : "Deploy Your AI Employee"}
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  {mode === "login"
                    ? "Log in to view active autonomous marketing campaigns."
                    : "Create your dedicated AI agent workspace in 30 seconds."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "signup" && (
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                        Business Name
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Acme Botanicals"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="founder@company.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <GlassButton
                    type="submit"
                    variant="cyanGlow"
                    size="md"
                    className="w-full justify-center mt-2"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {mode === "login" ? "Sign In to Console" : "Launch AI Employee"}
                  </GlassButton>
                </form>

                <div className="mt-6 pt-4 border-t border-white/[0.08] text-center text-xs text-slate-400">
                  {mode === "login" ? (
                    <span>
                      Don't have a workspace yet?{" "}
                      <button
                        onClick={() => setMode("signup")}
                        className="text-cyan-300 hover:underline font-semibold"
                      >
                        Sign Up
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{" "}
                      <button
                        onClick={() => setMode("login")}
                        className="text-cyan-300 hover:underline font-semibold"
                      >
                        Log In
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
