"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GlassButton } from "@/components/ui/GlassButton";
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenAuth?: (mode: "login" | "signup") => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Product", href: "#product" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Capabilities", href: "#capabilities" },
    { name: "Dashboard", href: "#dashboard" },
    { name: "Learning Loop", href: "#learning-loop" },
    { name: "For Business", href: "#business" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 py-4 sm:py-6 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-5 py-3 rounded-full transition-all duration-300",
          scrolled
            ? "bg-[#05060A]/80 backdrop-blur-2xl border border-white/[0.14] shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-full max-w-5xl"
            : "bg-white/[0.04] backdrop-blur-xl border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-5xl"
        )}
      >
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/30 to-violet-500/20 border border-cyan-400/30 shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:border-cyan-400/60 transition-colors">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
          <span className="font-extrabold tracking-widest text-lg text-white group-hover:text-cyan-300 transition-colors">
            SANKALP
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wider">
            AI v1.4
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3.5 py-1.5 text-xs lg:text-sm font-medium text-slate-300 hover:text-white rounded-full hover:bg-white/[0.06] transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs lg:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
          >
            Log In
          </Link>
          <Link href="/signup">
            <GlassButton
              variant="cyanGlow"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get Started
            </GlassButton>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-20 inset-x-4 p-6 rounded-3xl bg-[#080A10]/95 backdrop-blur-2xl border border-white/[0.15] shadow-2xl z-50 pointer-events-auto flex flex-col gap-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="h-[1px] bg-white/[0.1] my-2" />

            <div className="flex flex-col gap-3">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <GlassButton
                  variant="secondary"
                  size="md"
                  className="w-full justify-center"
                >
                  Log In
                </GlassButton>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <GlassButton
                  variant="cyanGlow"
                  size="md"
                  className="w-full justify-center"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Get Started
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
