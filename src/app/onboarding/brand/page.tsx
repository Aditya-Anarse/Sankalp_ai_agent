"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { GlassInput } from "@/components/ui/GlassInput";
import { useOnboarding } from "@/context/OnboardingContext";
import { Sparkles, Shield, Upload, Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const TONES = [
  { name: "Professional", desc: "Authoritative & credible" },
  { name: "Friendly", desc: "Warm, conversational & approachable" },
  { name: "Bold", desc: "Audacious, disruptive & punchy" },
  { name: "Minimal", desc: "Understated, clean & sleek" },
  { name: "Luxury", desc: "Exclusive, elegant & premium" },
  { name: "Playful", desc: "Witty, fun & meme-native" },
  { name: "Energetic", desc: "High-octane & motivating" },
  { name: "Trustworthy", desc: "Empathetic, clear & secure" },
];

const COLOR_PALETTES = [
  { name: "Obsidian & Electric Cyan", hexes: ["#00F0FF", "#080A10", "#FFFFFF"] },
  { name: "Midnight & Deep Violet", hexes: ["#8B5CF6", "#05060A", "#E2E8F0"] },
  { name: "Emerald & Minimal White", hexes: ["#10B981", "#0B0E14", "#F8FAFC"] },
  { name: "Sunset Crimson & Amber", hexes: ["#F43F5E", "#F59E0B", "#05060A"] },
];

const LANGUAGES = ["English", "Hindi", "Hinglish", "Marathi", "Tamil", "Other"];

export default function BrandStepPage() {
  const router = useRouter();
  const { state, updateBrand, setCurrentStep } = useOnboarding();

  const [tone, setTone] = useState<string[]>(
    state.brand.tone.length > 0 ? state.brand.tone : ["Friendly", "Bold"]
  );
  const [selectedPalette, setSelectedPalette] = useState<number>(0);
  const [tagline, setTagline] = useState(state.brand.tagline || "Style that moves with you.");
  const [language, setLanguage] = useState<string[]>(
    state.brand.language.length > 0 ? state.brand.language : ["English", "Hinglish"]
  );

  const [error, setError] = useState("");

  const toggleTone = (t: string) => {
    if (tone.includes(t)) {
      if (tone.length > 1) {
        setTone(tone.filter((item) => item !== t));
      }
    } else {
      setTone([...tone, t]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (language.includes(lang)) {
      if (language.length > 1) {
        setLanguage(language.filter((item) => item !== lang));
      }
    } else {
      setLanguage([...language, lang]);
    }
  };

  const handleNext = () => {
    if (tone.length === 0) {
      setError("Please select at least one brand tone.");
      return;
    }

    updateBrand({
      tone,
      colors: COLOR_PALETTES[selectedPalette].hexes,
      tagline,
      language,
    });
    setCurrentStep(5);
    router.push("/onboarding/goals");
  };

  return (
    <OnboardingLayout
      currentStep={4}
      heading="Teach me your brand."
      subheading="I'll use this to keep every future post, caption, video script, and graphic 100% on-brand."
      onNext={handleNext}
    >
      <div className="space-y-6 text-left">
        {/* Brand Tone Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2.5">
            Brand Tone of Voice <span className="text-cyan-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {TONES.map((item) => {
              const isSelected = tone.includes(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => toggleTone(item.name)}
                  className={cn(
                    "p-3 rounded-xl text-left transition-all flex flex-col justify-between border",
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold">{item.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand Tagline & Logo Upload Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput
            label="Brand Tagline or Motto"
            placeholder="e.g. Style that moves with you"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium">
              Brand Logo (Optional)
            </label>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-slate-400 cursor-pointer hover:border-cyan-400/40 transition-colors">
              <Upload className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate">Drop logo (.SVG / .PNG)</span>
            </div>
          </div>
        </div>

        {/* Color Palettes & Content Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2">
              Primary Color Palette
            </label>
            <div className="space-y-2">
              {COLOR_PALETTES.map((pal, idx) => (
                <button
                  key={pal.name}
                  type="button"
                  onClick={() => setSelectedPalette(idx)}
                  className={cn(
                    "w-full p-2 rounded-xl flex items-center justify-between border transition-all text-left",
                    selectedPalette === idx
                      ? "bg-cyan-500/10 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-white/20"
                  )}
                >
                  <span className="text-[11px] text-slate-300 truncate">{pal.name}</span>
                  <div className="flex items-center gap-1">
                    {pal.hexes.map((hex) => (
                      <span
                        key={hex}
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2">
              Content Language
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = language.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-mono transition-all border",
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold"
                        : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white"
                    )}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dynamic Brand Constitution Visual Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#080A10] via-cyan-950/20 to-[#080A10] border border-cyan-500/30">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                BRAND CONSTITUTION PREVIEW
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">● LIVE GUARDRAIL</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[10px] text-slate-500 block">Tone</span>
              <span className="text-white font-semibold">{tone.join(" + ")}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[10px] text-slate-500 block">Language</span>
              <span className="text-white font-semibold">{language.join(" + ")}</span>
            </div>
            <div className="p-2 rounded-lg bg-white/[0.02]">
              <span className="text-[10px] text-slate-500 block">Fidelity</span>
              <span className="text-cyan-300 font-bold">99.8% Match</span>
            </div>
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
