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
import { Sparkles, ArrowRight, Lock, Mail, User, Chrome, Bot } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();
  const { updateBusinessProfile } = useOnboarding();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      // Initialize default business profile name if empty
      updateBusinessProfile({
        businessName: name.trim() ? `${name.trim()}'s Brand` : "",
      });
      router.push("/onboarding/business");
    } catch {
      setError("Failed to create workspace. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/onboarding/business");
    } catch {
      setError("Google signup failed.");
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
          {/* Top Badge */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  New Workspace
                </span>
                <div className="text-xs text-slate-400">Autonomous Setup</div>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Phase 1.4
            </span>
          </div>

          {/* Heading */}
          <div className="mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Build your AI marketing workspace.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Hire SANKALP to research, create, and scale your brand marketing.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <GlassInput
              label="Full Name"
              type="text"
              required
              placeholder="Aditya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <GlassInput
              label="Work Email"
              type="email"
              required
              placeholder="aditya@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <GlassInput
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <GlassInput
              label="Confirm Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

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
              {loading ? "Creating Workspace..." : "Create Workspace"}
            </GlassButton>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative px-3 bg-[#080A10] text-[11px] font-mono text-slate-500 uppercase">
              Or sign up with
            </span>
          </div>

          {/* Google signup option */}
          <GlassButton
            type="button"
            variant="secondary"
            size="md"
            className="w-full justify-center gap-2.5 text-xs"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <Chrome className="w-4 h-4 text-cyan-400" />
            <span>Sign up with Google</span>
          </GlassButton>

          {/* Switch to Login */}
          <div className="mt-8 pt-4 border-t border-white/[0.08] text-center text-xs text-slate-400">
            Already have a workspace?{" "}
            <Link
              href="/login"
              className="text-cyan-300 hover:text-cyan-200 font-semibold underline underline-offset-4"
            >
              Log In
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </AuthLayout>
  );
}
