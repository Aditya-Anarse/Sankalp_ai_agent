"use client";

import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Option {
  value: string;
  label: string;
}

export interface GlassSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  hint?: string;
}

export const GlassSelect = forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ label, options, error, hint, className = "", id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium"
          >
            {label}
            {props.required && <span className="text-cyan-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full px-4 py-3 pr-10 rounded-xl text-sm text-white appearance-none",
              "bg-[#080A10]/90 backdrop-blur-md border transition-all duration-200 outline-none cursor-pointer",
              "focus:border-cyan-400/80 focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
              error
                ? "border-red-500/60 focus:border-red-400"
                : "border-white/[0.1] hover:border-white/[0.2]",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#080A10] text-white py-2">
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
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

GlassSelect.displayName = "GlassSelect";
