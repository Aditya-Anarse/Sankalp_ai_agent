"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { useOnboarding } from "@/context/OnboardingContext";
import { Users, MapPin, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const AGE_RANGES = ["18–24", "25–34", "35–44", "45+"];

const LOCATIONS = [
  "Local Neighborhood",
  "City-Wide",
  "Multiple Cities",
  "All India",
  "Global Markets",
];

const AUDIENCE_TYPES = [
  "Students & Gen-Z",
  "Young Professionals",
  "Families & Parents",
  "Business Owners & B2B",
  "Creators & Artists",
  "Conscious Shoppers",
  "Tech Early Adopters",
  "Other",
];

export default function AudienceStepPage() {
  const router = useRouter();
  const { state, updateAudience, setCurrentStep } = useOnboarding();

  const [ageRange, setAgeRange] = useState<string[]>(
    state.audience.ageRange.length > 0 ? state.audience.ageRange : ["18–24", "25–34"]
  );
  const [locations, setLocations] = useState<string[]>(
    state.audience.locations.length > 0 ? state.audience.locations : ["City-Wide", "All India"]
  );
  const [types, setTypes] = useState<string[]>(
    state.audience.types.length > 0 ? state.audience.types : ["Young Professionals", "Conscious Shoppers"]
  );
  const [description, setDescription] = useState(
    state.audience.description || "Urban professionals and modern shoppers seeking high-quality, authentic products with great design."
  );

  const [error, setError] = useState("");

  const toggleItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      if (list.length > 1) {
        setList(list.filter((i) => i !== item));
      }
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    if (ageRange.length === 0 || locations.length === 0 || types.length === 0) {
      setError("Please select at least one option in each category.");
      return;
    }
    if (!description.trim() || description.length < 10) {
      setError("Please provide a short description of your ideal customer.");
      return;
    }

    updateAudience({
      ageRange,
      locations,
      types,
      description,
    });
    setCurrentStep(4);
    router.push("/onboarding/brand");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      heading="Who are you trying to reach?"
      subheading="SANKALP tunes its narrative hooks, tone, and viral angles based on who your customers are."
      onNext={handleNext}
    >
      <div className="space-y-6 text-left">
        {/* Age Range Section */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2.5">
            Target Age Demographics <span className="text-cyan-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {AGE_RANGES.map((range) => {
              const isSelected = ageRange.includes(range);
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => toggleItem(ageRange, setAgeRange, range)}
                  className={cn(
                    "px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-between border",
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)] font-bold"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-200"
                  )}
                >
                  <span>{range} yrs</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Geographic Reach Section */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2.5">
            Geographic Scope <span className="text-cyan-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => {
              const isSelected = locations.includes(loc);
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => toggleItem(locations, setLocations, loc)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border",
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)] font-bold"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-200"
                  )}
                >
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{loc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audience Types Section */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2.5">
            Customer Profile Types <span className="text-cyan-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AUDIENCE_TYPES.map((type) => {
              const isSelected = types.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleItem(types, setTypes, type)}
                  className={cn(
                    "p-2.5 rounded-xl text-xs text-left transition-all flex items-center justify-between border",
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)] font-semibold"
                      : "bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-slate-200"
                  )}
                >
                  <span className="truncate">{type}</span>
                  {isSelected && <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Qualitative Customer Description */}
        <GlassTextarea
          label="Ideal Customer Description"
          required
          rows={3}
          placeholder="Describe your ideal buyer, their daily struggles, taste preferences, and what triggers them to purchase..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (error) setError("");
          }}
          hint="Example: Young professionals looking for stylish streetwear that can transition from work to casual hangouts."
        />

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-mono">
            {error}
          </div>
        )}
      </div>
    </OnboardingLayout>
  );
}
