"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  isRadio?: boolean;
  className?: string;
}

export function SelectionCard({
  selected,
  onClick,
  title,
  description,
  icon,
  badge,
  isRadio = false,
  className = "",
}: SelectionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between",
        selected
          ? "bg-cyan-500/[0.08] border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.2)]"
          : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.05]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0",
                selected
                  ? "bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                  : "bg-white/[0.05] text-slate-300 border border-white/[0.08]"
              )}
            >
              {icon}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4
                className={cn(
                  "text-sm font-semibold transition-colors",
                  selected ? "text-white font-bold" : "text-slate-200"
                )}
              >
                {title}
              </h4>
              {badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Selection Glyph */}
        <div
          className={cn(
            "w-5 h-5 flex items-center justify-center transition-all flex-shrink-0",
            isRadio ? "rounded-full" : "rounded-md",
            selected
              ? "bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]"
              : "border border-white/[0.2] bg-white/[0.02]"
          )}
        >
          {selected && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>

      {description && (
        <p className="text-xs text-slate-400 leading-relaxed pl-0.5">{description}</p>
      )}
    </motion.div>
  );
}
