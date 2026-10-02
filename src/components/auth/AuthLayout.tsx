"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#05060A] text-white flex flex-col justify-between overflow-x-hidden">
      <InteractiveBackground />

      {/* Top Floating Minimal Bar */}
      <header className="relative z-20 w-full px-6 py-6 flex items-center justify-between max-w-6xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:border-cyan-400/80 transition-colors">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span className="font-extrabold tracking-widest text-lg text-white group-hover:text-cyan-300 transition-colors">
            SANKALP
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.08]">
            AI EMPLOYEE
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
        >
          ← Back to Overview
        </Link>
      </header>

      {/* Centered Main Container */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Bottom Status Footer */}
      <footer className="relative z-20 w-full px-6 py-6 text-center text-xs font-mono text-slate-500 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/[0.05]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted Workspace Architecture</span>
        </div>
        <span>© 2026 SANKALP AI Systems</span>
      </footer>
    </div>
  );
}
