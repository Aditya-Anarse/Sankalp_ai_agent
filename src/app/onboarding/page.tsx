"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OnboardingIndexPage() {
  const router = useRouter();
  const { state } = useOnboarding();

  useEffect(() => {
    if (state.isCompleted) {
      router.replace("/workspace");
    } else {
      router.replace("/onboarding/business");
    }
  }, [router, state.isCompleted]);

  return (
    <div className="min-h-screen bg-[#05060A] flex items-center justify-center text-white">
      <div className="text-xs font-mono text-cyan-300 animate-pulse">
        Initializing SANKALP Onboarding Protocol...
      </div>
    </div>
  );
}
