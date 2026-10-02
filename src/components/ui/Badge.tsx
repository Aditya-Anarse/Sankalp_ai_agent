import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "cyan" | "violet" | "emerald" | "default" | "outline";
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = "default",
  className = "",
  dot = false,
}: BadgeProps) {
  const variantStyles = {
    default: "bg-white/[0.06] text-slate-300 border-white/[0.1]",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]",
    violet: "bg-violet-500/10 text-violet-300 border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.2)]",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]",
    outline: "bg-transparent text-slate-400 border-white/[0.12]",
  };

  const dotStyles = {
    default: "bg-slate-400",
    cyan: "bg-cyan-400 shadow-[0_0_8px_#00f0ff]",
    violet: "bg-violet-400 shadow-[0_0_8px_#8b5cf6]",
    emerald: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
    outline: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border tracking-wide uppercase",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            dotStyles[variant]
          )}
        />
      )}
      {children}
    </span>
  );
}
