"use client";

import React from "react";
import { Sparkles, Twitter, Linkedin, Instagram, Github, ArrowUpRight } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    { name: "Product", href: "#product" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Capabilities", href: "#capabilities" },
    { name: "Command Center", href: "#dashboard" },
    { name: "Learning Loop", href: "#learning-loop" },
    { name: "For Business", href: "#business" },
  ];

  return (
    <footer className="relative border-t border-white/[0.08] bg-[#05060A] text-slate-400 py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          {/* Logo & Vision */}
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <span className="font-extrabold tracking-widest text-lg text-white">
                SANKALP
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              "Your Autonomous AI Marketing Employee." Researches, plans, creates, publishes and continuously learns for your business.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-cyan-300 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              aria-label="X / Twitter"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright and System Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">All Autonomous Systems Operational</span>
            <span className="text-slate-600">•</span>
            <span>99.98% Model Uptime</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 SANKALP AI. All rights reserved.</span>
            <button
              onClick={scrollToTop}
              className="hover:text-cyan-300 transition-colors flex items-center gap-1"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
