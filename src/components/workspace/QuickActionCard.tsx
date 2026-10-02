"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  tag?: string;
  onClick?: () => void;
  accent?: "cyan" | "violet" | "emerald" | "amber";
}

export function QuickActionCard({
  title,
  description,
  icon,
  tag,
  onClick,
  accent = "cyan",
}: QuickActionCardProps) {
  const accentStyles = {
    cyan: "group-hover:border-cyan-400/40 text-cyan-300 group-hover:bg-cyan-500/10",
    violet: "group-hover:border-violet-400/40 text-violet-300 group-hover:bg-violet-500/10",
    emerald: "group-hover:border-emerald-400/40 text-emerald-300 group-hover:bg-emerald-500/10",
    amber: "group-hover:border-amber-400/40 text-amber-300 group-hover:bg-amber-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer text-left h-full group"
    >
      <GlassCard className="p-5 h-full flex flex-col justify-between border-white/[0.08] hover:border-white/[0.2] transition-all">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                "w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center transition-colors",
                accentStyles[accent]
              )}
            >
              {icon}
            </div>

            <div className="flex items-center gap-2">
              {tag && (
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                  {tag}
                </span>
              )}
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>

          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
            {title}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
