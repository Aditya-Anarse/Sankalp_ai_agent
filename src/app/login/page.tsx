"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { Bot, ArrowRight, Lock, Mail, Sparkles, Chrome } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const { state: onboardingState } = useOnboarding();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // If user already completed onboarding, go to workspace, otherwise continue onboarding
      if (onboardingState.isCompleted) {
        router.push("/workspace");
      } else {
        router.push("/onboarding/business");
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onboardingState.isCompleted) {
        router.push("/workspace");
      } else {
        router.push("/onboarding/business");
      }
    } catch {
      setError("Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard
          glow="cyan"
          className="p-8 sm:p-10 border-cyan-500/20 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
        >
          {/* Top AI Indicator */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  AI Employee Gateway
                </span>
                <div className="text-xs text-slate-400">Neural Sync: Active</div>
              </div>
            </div>

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Heading */}
          <div className="mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Welcome back.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Your AI marketing employee is ready.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <GlassInput
              label="Work Email"
              type="email"
              required
              placeholder="founder@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="space-y-1">
              <GlassInput
                label="Password"
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <div className="text-right">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Demo password reset link generated. You can log in with any sample password for this preview.");
                  }}
                  className="text-[11px] font-mono text-cyan-300 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 font-mono">
                {error}
              </div>
            )}

            <GlassButton
              type="submit"
              variant="cyanGlow"
              size="lg"
              className="w-full justify-center mt-2"
              disabled={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {loading ? "Authenticating..." : "Continue"}
            </GlassButton>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative px-3 bg-[#080A10] text-[11px] font-mono text-slate-500 uppercase">
              Or continue with
            </span>
          </div>

          {/* Social login */}
          <GlassButton
            type="button"
            variant="secondary"
            size="md"
            className="w-full justify-center gap-2.5 text-xs"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="w-4 h-4 text-cyan-400" />
            <span>Continue with Google</span>
          </GlassButton>

          {/* Switch to Signup */}
          <div className="mt-8 pt-4 border-t border-white/[0.08] text-center text-xs text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-4"
            >
              Create account
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </AuthLayout>
  );
}
