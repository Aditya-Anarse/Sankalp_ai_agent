"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

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
const AUTH_TOKEN_KEY = "sankalp_token";

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

  const saveUser = (userData: User | null, token?: string) => {
    setUser(userData);
    if (userData) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        if (token) {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        }
      } catch (e) {
        console.warn("Failed to persist auth session", e);
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const login = async (email: string, password: string = "password123"): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email, password });
      if (res && res.user) {
        const u: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          businessName: res.user.business_name || "",
          createdAt: res.user.created_at || new Date().toISOString(),
        };
        saveUser(u, res.access_token);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string = "password123",
    businessName?: string
  ): Promise<boolean> => {
    try {
      const res = await api.auth.signup({
        name: name.trim(),
        email: email.trim(),
        password,
        business_name: businessName?.trim() || "",
      });
      if (res && res.user) {
        const u: User = {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          businessName: res.user.business_name || businessName || "",
          createdAt: res.user.created_at || new Date().toISOString(),
        };
        saveUser(u, res.access_token);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Honest redirection or indication if Google OAuth is not configured
    alert("Google OAuth is not configured. Please use Email / Password signup.");
    return false;
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
