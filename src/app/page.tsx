"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustStatement } from "@/components/landing/TrustStatement";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { AgentActivitySection } from "@/components/landing/AgentActivitySection";
import { CapabilitiesSection } from "@/components/landing/CapabilitiesSection";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreviewSection";
import { LearningLoopSection } from "@/components/landing/LearningLoopSection";
import { BusinessSection } from "@/components/landing/BusinessSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/layout/Footer";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { AuthModal } from "@/components/ui/AuthModal";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleOpenAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <main className="relative min-h-screen bg-[#05060A] text-white selection:bg-cyan-500/30 selection:text-white overflow-x-hidden">
      {/* Liquid Glass Interactive Background */}
      <InteractiveBackground />

      {/* Floating Glass Navigation */}
      <Navbar onOpenAuth={handleOpenAuth} />

      {/* 1. Hero Section with 3D AI Core */}
      <HeroSection
        onOpenAuth={() => handleOpenAuth("signup")}
      />

      {/* 2. Trust / Product Statement */}
      <TrustStatement />

      {/* 3. Continuous Workflow (01 Research -> 07 Learn) */}
      <WorkflowSection />

      {/* 4. Meet Your AI Marketing Employee (Live Terminal / Agent Console) */}
      <AgentActivitySection />

      {/* 5. 6 Capabilities Cards */}
      <CapabilitiesSection />

      {/* 6. Command Center Preview (Realistic Dashboard Mockup) */}
      <DashboardPreviewSection />

      {/* 7. Autonomous Learning Loop (Circular Orbital Visualization) */}
      <LearningLoopSection />

      {/* 8. Built for Businesses */}
      <BusinessSection />

      {/* 9. Final Cinematic CTA */}
      <CTASection onOpenAuth={() => handleOpenAuth("signup")} />

      {/* 10. Minimalist Dark Footer */}
      <Footer />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />
    </main>
  );
}
