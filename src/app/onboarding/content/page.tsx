"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Calendar,
  Layers,
  Clock,
  Sparkles,
  Check,
  Film,
  Image as ImageIcon,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FREQUENCIES = ["Daily (7 posts/wk)", "3x per week (Recommended)", "Weekly (1-2 posts/wk)", "Custom Pace"];
const FORMATS = ["Reel", "Carousel", "Post", "Story", "Short Video"];
const POSTING_TIMES = ["Morning (08:00 - 10:00)", "Afternoon (12:00 - 15:00)", "Evening (18:00 - 21:00)", "Algorithm Auto-Tune"];
const STYLES = [
  "Product Showcase",
  "Educational & How-To",
  "Behind the Scenes",
  "Customer Stories & UGC",
  "Offers & Flash Drops",
  "Trending Audio & Memes",
];

export default function ContentStepPage() {
  const router = useRouter();
  const { state, updateContentPreferences, setCurrentStep } = useOnboarding();

  const [frequency, setFrequency] = useState<string>(
    state.contentPreferences.frequency || "3x per week (Recommended)"
  );
  const [formats, setFormats] = useState<string[]>(
    state.contentPreferences.formats.length > 0
      ? state.contentPreferences.formats
      : ["Reel", "Carousel", "Post"]
  );
  const [postingTime, setPostingTime] = useState<string>(
    state.contentPreferences.postingTime || "Evening (18:00 - 21:00)"
  );
  const [styles, setStyles] = useState<string[]>(
    state.contentPreferences.styles.length > 0
      ? state.contentPreferences.styles
      : ["Product Showcase", "Behind the Scenes", "Educational & How-To"]
  );

  const [error, setError] = useState("");

  const toggleFormat = (f: string) => {
    if (formats.includes(f)) {
      if (formats.length > 1) {
        setFormats(formats.filter((item) => item !== f));
      }
    } else {
      setFormats([...formats, f]);
    }
  };

  const toggleStyle = (s: string) => {
    if (styles.includes(s)) {
      if (styles.length > 1) {
        setStyles(styles.filter((item) => item !== s));
      }
    } else {
      setStyles([...styles, s]);
    }
  };

  const handleNext = () => {
    if (formats.length === 0 || styles.length === 0) {
      setError("Please select at least one format and one content style.");
      return;
    }

    updateContentPreferences({
      frequency,
      formats,
      postingTime,
      styles,
    });
    setCurrentStep(7);
    router.push("/onboarding/connect");
  };

  return (
    <OnboardingLayout
      currentStep={6}
      heading="How should your AI employee create content?"
      subheading="Set your pacing and output preferences. SANKALP will generate the content calendar around this formula."
      onNext={handleNext}
    >
      <div className="space-y-6 text-left">
        {/* Frequency & Times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2">
              Posting Cadence <span className="text-cyan-400">*</span>
            </label>
            <div className="space-y-1.5">
              {FREQUENCIES.map((freq) => {
                const isSelected = frequency === freq;
                return (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={cn(
                      "w-full p-2.5 rounded-xl text-xs font-mono text-left transition-all flex items-center justify-between border",
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                        : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                    )}
                  >
                    <span>{freq}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2">
              Preferred Release Window
            </label>
            <div className="space-y-1.5">
              {POSTING_TIMES.map((time) => {
                const isSelected = postingTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setPostingTime(time)}
                    className={cn(
                      "w-full p-2.5 rounded-xl text-xs font-mono text-left transition-all flex items-center justify-between border",
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                        : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                    )}
                  >
                    <span>{time}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Formats Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2">
            Asset Formats <span className="text-cyan-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FORMATS.map((fmt) => {
              const isSelected = formats.includes(fmt);
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => toggleFormat(fmt)}
                  className={cn(
                    "p-2.5 rounded-xl text-xs font-mono text-center transition-all border",
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400 text-white font-bold shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                      : "bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white"
                  )}
                >
                  {fmt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Styles Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2">
            Narrative Content Styles <span className="text-cyan-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STYLES.map((style) => {
              const isSelected = styles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={cn(
                    "p-2.5 rounded-xl text-xs text-left transition-all flex items-center justify-between border",
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400 text-white font-semibold"
                      : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                  )}
                >
                  <span className="truncate">{style}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Live "YOUR CONTENT STYLE" Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-[#080A10] to-indigo-950/30 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.08]">
            <span className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> YOUR CONTENT ENGINE PREVIEW
            </span>
            <span className="text-[10px] font-mono text-slate-400">Pacing Configured</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-300">
            <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.1] text-white font-semibold">
              {frequency.split(" ")[0]}
            </span>
            <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.1] text-cyan-300">
              {formats.join(" + ")}
            </span>
            <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.1] text-indigo-300">
              {postingTime.split(" ")[0]}
            </span>
            <span className="px-2 py-1 rounded bg-white/[0.05] border border-white/[0.1] text-emerald-300">
              {state.brand.tone.slice(0, 2).join(" + ") || "On-Brand Tone"}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-mono">
            {error}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
