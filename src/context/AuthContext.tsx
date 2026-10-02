"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string, businessName?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "sankalp_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load auth session from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      } catch (e) {
        console.warn("Failed to persist auth session", e);
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    // Simulated authentication for Phase 2 demo
    const namePart = email.split("@")[0] || "Founder";
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    
    // Check if there is already a stored business name in onboarding
    let existingBusinessName = "";
    try {
      const onboardingData = localStorage.getItem("sankalp_onboarding_data");
      if (onboardingData) {
        const parsed = JSON.parse(onboardingData);
        existingBusinessName = parsed?.businessProfile?.businessName || "";
      }
    } catch {}

    const mockUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: user?.name || formattedName,
      email: email,
      businessName: user?.businessName || existingBusinessName || "My Business",
      createdAt: user?.createdAt || new Date().toISOString(),
    };

    saveUser(mockUser);
    return true;
  };

  const signup = async (
    name: string,
    email: string,
    password?: string,
    businessName?: string
  ): Promise<boolean> => {
    const mockUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim(),
      businessName: businessName?.trim() || "My Business",
      createdAt: new Date().toISOString(),
    };

    saveUser(mockUser);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    const mockUser: User = {
      id: "usr_google_" + Math.random().toString(36).substring(2, 9),
      name: "Demo Founder",
      email: "founder@sankalpdrive.ai",
      businessName: "Aura Studio",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      createdAt: new Date().toISOString(),
    };

    saveUser(mockUser);
    return true;
  };

  const logout = () => {
    saveUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    saveUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
