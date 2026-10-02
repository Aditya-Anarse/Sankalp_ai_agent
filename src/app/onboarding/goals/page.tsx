"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  MessageSquare,
  Rocket,
  RefreshCw,
  Star,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const GOALS = [
  {
    id: "Promote Products",
    title: "🛍 Promote Products",
    description: "Highlight product features, drops, benefits, and special offers to drive cart conversions.",
    icon: ShoppingBag,
  },
  {
    id: "Grow Reach",
    title: "📈 Grow Reach",
    description: "Maximize top-of-funnel discoverability and explore feed presence through trending formats.",
    icon: TrendingUp,
  },
  {
    id: "Build Audience",
    title: "👥 Build Audience",
    description: "Turn passive profile visitors into dedicated followers and community members.",
    icon: Users,
  },
  {
    id: "Increase Engagement",
    title: "💬 Increase Engagement",
    description: "Spark organic discussions, polls, and comments with relatable storytelling.",
    icon: MessageSquare,
  },
  {
    id: "Launch Campaigns",
    title: "🚀 Launch Campaigns",
    description: "Plan multi-week strategic rollouts for seasonal launches, events, or holidays.",
    icon: Rocket,
  },
  {
    id: "Stay Consistent",
    title: "🔁 Stay Consistent",
    description: "Maintain a steady 24/7 posting rhythm without burnout or creative blocks.",
    icon: RefreshCw,
  },
];

export default function GoalsStepPage() {
  const router = useRouter();
  const { state, updateGoals, setCurrentStep } = useOnboarding();

  const [primaryGoal, setPrimaryGoal] = useState<string>(
    state.goals.primary || "Promote Products"
  );
  const [secondaryGoals, setSecondaryGoals] = useState<string[]>(
    state.goals.secondary.length > 0 ? state.goals.secondary : ["Grow Reach", "Increase Engagement"]
  );

  const [error, setError] = useState("");

  const toggleSecondary = (goalId: string) => {
    if (goalId === primaryGoal) return;
    if (secondaryGoals.includes(goalId)) {
      setSecondaryGoals(secondaryGoals.filter((g) => g !== goalId));
    } else {
      setSecondaryGoals([...secondaryGoals, goalId]);
    }
  };

  const handleSetPrimary = (goalId: string) => {
    setPrimaryGoal(goalId);
    setSecondaryGoals(secondaryGoals.filter((g) => g !== goalId));
    if (error) setError("");
  };

  const handleNext = () => {
    if (!primaryGoal) {
      setError("Please select a primary marketing goal.");
      return;
    }

    updateGoals({
      primary: primaryGoal,
      secondary: secondaryGoals,
    });
    setCurrentStep(6);
    router.push("/onboarding/content");
  };

  return (
    <OnboardingLayout
      currentStep={5}
      heading="What should SANKALP help you achieve?"
      subheading="Select your core priority and supporting targets so SANKALP can balance promotional vs. viral content."
      onNext={handleNext}
    >
      <div className="space-y-6 text-left">
        {/* Primary Goal Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium">
              1. Select Primary Objective <span className="text-cyan-400">*</span>
            </label>
            <span className="text-[10px] font-mono text-cyan-400">Pillar Target</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GOALS.map((goal) => {
              const isPrimary = primaryGoal === goal.id;
              const Icon = goal.icon;
              return (
                <div
                  key={`primary-${goal.id}`}
                  onClick={() => handleSetPrimary(goal.id)}
                  className={cn(
                    "p-4 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between group",
                    isPrimary
                      ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                      : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.05]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                          isPrimary
                            ? "bg-cyan-400 text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                            : "bg-white/[0.05] text-slate-300"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          isPrimary ? "text-white" : "text-slate-200"
                        )}
                      >
                        {goal.title}
                      </span>
                    </div>

                    {isPrimary && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-400 text-black font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" /> PRIMARY
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{goal.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Supporting Targets */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-medium mb-2">
            2. Secondary Supporting Goals (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {GOALS.filter((g) => g.id !== primaryGoal).map((goal) => {
              const isSelected = secondaryGoals.includes(goal.id);
              return (
                <button
                  key={`sec-${goal.id}`}
                  type="button"
                  onClick={() => toggleSecondary(goal.id)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 border",
                    isSelected
                      ? "bg-indigo-500/15 border-indigo-400 text-white font-semibold shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                      : "bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white"
                  )}
                >
                  <span>{goal.title}</span>
                  {isSelected && <Check className="w-3 h-3 text-indigo-400 stroke-[3]" />}
                </button>
              );
            })}
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
