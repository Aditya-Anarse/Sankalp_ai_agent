"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { OnboardingProvider } from "@/context/OnboardingContext";
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <AppProvider>{children}</AppProvider>
      </OnboardingProvider>
    </AuthProvider>
  );
}

