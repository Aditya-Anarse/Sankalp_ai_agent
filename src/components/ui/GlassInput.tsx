"use client";

import React, { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
          >
            {label}
            {props.required && <span className="text-cyan-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full px-4 py-3 rounded-xl text-sm font-normal text-white placeholder-slate-500",
              "bg-white/[0.04] backdrop-blur-md border transition-all duration-200 outline-none",
              "focus:bg-white/[0.07] focus:border-cyan-400/80 focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
              error
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/[0.1] hover:border-white/[0.2]",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-mono text-red-400 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-400" />
            {error}
          </p>
        ) : hint ? (
          <p className="text-[11px] text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
