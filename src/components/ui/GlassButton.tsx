"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyanGlow";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  glow?: boolean;
}

export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconPosition = "right",
  glow = false,
  onClick,
  disabled,
  ...props
}: GlassButtonProps) {
  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2 font-medium",
    lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5 font-semibold",
  };

  const variantStyles = {
    primary:
      "bg-white text-black hover:bg-slate-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] border border-white/80 shadow-lg",
    cyanGlow:
      "bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] border border-cyan-300/50",
    secondary:
      "bg-white/[0.06] text-white hover:bg-white/[0.12] border border-white/[0.12] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
    outline:
      "bg-transparent text-slate-200 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/[0.04]",
    ghost:
      "bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.05]",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center transition-all duration-200 outline-none select-none overflow-hidden group",
        sizeStyles[size],
        variantStyles[variant],
        glow && "shadow-[0_0_30px_rgba(0,240,255,0.35)]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      {...(props as any)}
    >
      {/* Subtle shine effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-700 transition-transform ease-in-out pointer-events-none" />

      {icon && iconPosition === "left" && (
        <span className="inline-flex items-center justify-center transition-transform group-hover:-translate-x-0.5">
          {icon}
        </span>
      )}
      <span className="relative z-10">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="inline-flex items-center justify-center transition-transform group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </motion.button>
  );
}
