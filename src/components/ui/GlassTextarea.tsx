"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ label, error, hint, className = "", id, rows = 4, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
          >
            {label}
            {props.required && <span className="text-cyan-400 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 rounded-xl text-sm font-normal text-white placeholder-slate-500",
            "bg-white/[0.04] backdrop-blur-md border transition-all duration-200 outline-none resize-none",
            "focus:bg-white/[0.07] focus:border-cyan-400/80 focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
            error
              ? "border-red-500/60 focus:border-red-400"
              : "border-white/[0.1] hover:border-white/[0.2]",
            className
          )}
          {...props}
        />

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

GlassTextarea.displayName = "GlassTextarea";
