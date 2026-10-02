"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  gradientText?: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  badgeIcon,
  title,
  gradientText,
  description,
  centered = true,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col mb-16",
        centered ? "items-center text-center mx-auto max-w-3xl" : "items-start text-left",
        className
      )}
    >
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs font-semibold tracking-wider text-cyan-300 uppercase mb-4 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
        >
          {badgeIcon && <span className="text-cyan-400">{badgeIcon}</span>}
          <span>{badge}</span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
      >
        {title}{" "}
        {gradientText && (
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            {gradientText}
          </span>
        )}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
