"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { GlassButton } from "@/components/ui/GlassButton";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  Instagram,
  Youtube,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";

export default function ConnectStepPage() {
  const router = useRouter();
  const { state, setCurrentStep } = useOnboarding();
  const [realAccounts, setRealAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.socialAccounts.list();
        if (Array.isArray(res)) {
          setRealAccounts(res);
        }
      } catch (err) {
        console.warn("Could not fetch accounts:", err);
      }
    };
    fetchAccounts();
  }, []);

  const instagramAccount = realAccounts.find(
    (a) => a.platform === "instagram" && a.is_connected
  );
  const youtubeAccount = realAccounts.find(
    (a) => a.platform === "youtube" && a.is_connected
  );

  const handleConnectInstagram = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/social-accounts/instagram/authorize?redirect=true`;
  };

  const handleConnectYoutube = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/social-accounts/youtube/authorize?redirect=true`;
  };

  const handleNext = () => {
    setCurrentStep(7);
    router.push("/onboarding/complete");
  };

  return (
    <OnboardingLayout
      currentStep={7}
      heading="Connect Your Social Channels"
      subheading="Connect your authentic Instagram and YouTube accounts via OAuth for autonomous publishing and real analytics."
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
                {instagramAccount ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30">
                    Not Connected
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                {instagramAccount
                  ? `Connected as ${instagramAccount.account_name}. Verified with Meta Graph API.`
                  : "Connect your official Instagram Business account via Meta OAuth to enable publishing and analytics."}
              </p>
            </div>
          </div>

          <div>
            {instagramAccount ? (
              <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <GlassButton
                type="button"
                variant="cyanGlow"
                size="sm"
                onClick={handleConnectInstagram}
                className="flex items-center gap-1.5"
              >
                <span>Connect Instagram</span>
                <ExternalLink className="w-3.5 h-3.5" />
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
                {youtubeAccount ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30">
                    Not Connected
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                {youtubeAccount
                  ? `Connected as ${youtubeAccount.account_name}. Verified with Google API.`
                  : "Connect your verified YouTube channel via Google OAuth for automated scheduling."}
              </p>
            </div>
          </div>

          <div>
            {youtubeAccount ? (
              <span className="text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <GlassButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleConnectYoutube}
                className="flex items-center gap-1.5"
              >
                <span>Connect YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </GlassButton>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 flex items-center justify-between">
          <span>You can link or manage accounts anytime from your Connected Accounts page.</span>
        </div>
      </div>
    </OnboardingLayout>
  );
}
