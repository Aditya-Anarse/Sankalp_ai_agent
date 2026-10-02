"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "violet" | "blue" | "none";
  hoverEffect?: boolean;
  interactive?: boolean;
}

export function GlassCard({
  children,
  className = "",
  glow = "none",
  hoverEffect = true,
  interactive = false,
  ...props
}: GlassCardProps) {
  const glowStyles = {
    none: "",
    cyan: "shadow-[0_0_30px_-5px_rgba(0,240,255,0.15)] border-cyan-500/20",
    violet: "shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)] border-violet-500/20",
    blue: "shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] border-blue-500/20",
  };

  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -4,
              borderColor: "rgba(255, 255, 255, 0.22)",
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
      className={cn(
        "relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]",
        "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.06] before:to-transparent before:pointer-events-none",
        interactive && "cursor-pointer",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {/* Subtle top edge highlight */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
