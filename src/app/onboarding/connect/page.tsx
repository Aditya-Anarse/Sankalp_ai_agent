"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Instagram,
  Youtube,
  CheckCircle2,
  Share2,
  Sparkles,
  ShieldCheck,
  X,
  Bot,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConnectStepPage() {
  const router = useRouter();
  const { state, connectAccount, disconnectAccount, setCurrentStep } = useOnboarding();

  const [modalPlatform, setModalPlatform] = useState<"instagram" | "youtube" | null>(null);
  const [handleInput, setHandleInput] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleOpenModal = (platform: "instagram" | "youtube") => {
    const defaultHandle =
      platform === "instagram"
        ? `@${state.businessProfile.businessName.toLowerCase().replace(/\s+/g, "_") || "demo_brand"}`
        : `${state.businessProfile.businessName || "Demo Brand"} Channel`;
    setHandleInput(defaultHandle);
    setModalPlatform(platform);
  };

  const handleSimulateConnect = () => {
    if (!modalPlatform) return;
    setConnecting(true);

    setTimeout(() => {
      if (modalPlatform === "instagram") {
        connectAccount("instagram", { handle: handleInput || "@demo_business" });
      } else {
        connectAccount("youtube", { channelName: handleInput || "Demo Channel" });
      }
      setConnecting(false);
      setModalPlatform(null);
    }, 1200);
  };

  const handleNext = () => {
    setCurrentStep(7);
    router.push("/onboarding/complete");
  };

  const isInstagramConnected = state.connectedAccounts.instagram.connected;
  const isYoutubeConnected = state.connectedAccounts.youtube.connected;

  return (
    <OnboardingLayout
      currentStep={7}
      heading="Where should SANKALP work?"
      subheading="Connect your social media accounts so your AI marketing employee can prepare and schedule campaigns."
      nextText="Review & Complete"
      onNext={handleNext}
    >
      <div className="space-y-6 text-left">
        {/* Instagram Connection Card */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.1] hover:border-white/[0.2] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 flex-shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
              <Instagram className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Instagram Business</h3>
                {isInstagramConnected ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    Primary Channel
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                {isInstagramConnected
                  ? `Connected as ${state.connectedAccounts.instagram.handle}. SANKALP is ready to generate feed carousels, reels, and story drops.`
                  : "Connect your Instagram business account to let SANKALP prepare high-converting carousels, reels, and stories."}
              </p>
            </div>
          </div>

          <div>
            {isInstagramConnected ? (
              <button
                type="button"
                onClick={() => disconnectAccount("instagram")}
                className="text-xs font-mono text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <GlassButton
                type="button"
                variant="cyanGlow"
                size="sm"
                onClick={() => handleOpenModal("instagram")}
              >
                Connect Instagram
              </GlassButton>
            )}
          </div>
        </div>

        {/* YouTube Connection Card */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.1] hover:border-white/[0.2] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <Youtube className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">YouTube Shorts & Channel</h3>
                {isYoutubeConnected && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                {isYoutubeConnected
                  ? `Connected as ${state.connectedAccounts.youtube.channelName}. SANKALP will script and schedule Shorts campaigns.`
                  : "Connect your YouTube channel for future video publishing and analytics."}
              </p>
            </div>
          </div>

          <div>
            {isYoutubeConnected ? (
              <button
                type="button"
                onClick={() => disconnectAccount("youtube")}
                className="text-xs font-mono text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] transition-colors"
              >
                Disconnect
              </button>
            ) : (
              <GlassButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleOpenModal("youtube")}
              >
                Connect YouTube
              </GlassButton>
            )}
          </div>
        </div>

        {/* Simulated Connect Modal */}
        <AnimatePresence>
          {modalPlatform && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalPlatform(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-md"
              >
                <GlassCard className="p-6 sm:p-8 border-cyan-500/30 shadow-2xl space-y-5 text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        Connect {modalPlatform === "instagram" ? "Instagram" : "YouTube"}
                      </h4>
                    </div>

                    <button
                      onClick={() => setModalPlatform(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    This simulated demo connection will configure SANKALP's dispatch mesh for{" "}
                    <strong>{modalPlatform === "instagram" ? "Instagram" : "YouTube"}</strong>.
                  </p>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300">
                      {modalPlatform === "instagram" ? "Instagram Handle" : "Channel Name"}
                    </label>
                    <input
                      type="text"
                      value={handleInput}
                      onChange={(e) => setHandleInput(e.target.value)}
                      placeholder={modalPlatform === "instagram" ? "@yourbusiness" : "Your Channel"}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.15] text-white text-xs font-mono outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Read-Only & Scheduled Dispatch Permissions</span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <GlassButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setModalPlatform(null)}
                    >
                      Cancel
                    </GlassButton>
                    <GlassButton
                      type="button"
                      variant="cyanGlow"
                      size="sm"
                      disabled={connecting}
                      onClick={handleSimulateConnect}
                    >
                      {connecting ? "Connecting..." : "Connect Demo Account"}
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Note */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 flex items-center justify-between">
          <span>You can link additional channels anytime from your Workspace Settings.</span>
        </div>
      </div>
    </OnboardingLayout>
  );
}
