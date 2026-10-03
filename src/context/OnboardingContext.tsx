"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  location: string;
  description: string;
  website?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  image?: string;
}

export interface AudienceProfile {
  ageRange: string[];
  locations: string[];
  types: string[];
  description: string;
}

export interface BrandProfile {
  tone: string[];
  colors: string[];
  logo?: string;
  tagline?: string;
  language: string[];
}

export interface GoalsProfile {
  primary: string;
  secondary: string[];
}

export interface ContentPreferences {
  frequency: string;
  formats: string[];
  postingTime: string;
  styles: string[];
}

export interface ConnectedAccounts {
  instagram: {
    connected: boolean;
    handle?: string;
    connectedAt?: string;
  };
  youtube: {
    connected: boolean;
    channelName?: string;
    connectedAt?: string;
  };
}

export interface OnboardingState {
  businessProfile: BusinessProfile;
  products: ProductItem[];
  audience: AudienceProfile;
  brand: BrandProfile;
  goals: GoalsProfile;
  contentPreferences: ContentPreferences;
  connectedAccounts: ConnectedAccounts;
  currentStep: number;
  isCompleted: boolean;
}

const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  businessProfile: {
    businessName: "",
    businessType: "D2C Brand",
    location: "Mumbai",
    description: "",
    website: "",
  },
  products: [
    {
      id: "prod_1",
      name: "Premium Aero Sneakers",
      category: "Footwear",
      price: "₹2,499",
      description: "Everyday ultra-lightweight breathable sneakers with high-cushion responsive foam.",
    },
  ],
  audience: {
    ageRange: ["18–24", "25–34"],
    locations: ["City", "India"],
    types: ["Young Professionals", "Shoppers"],
    description: "Young urban professionals and creators looking for stylish, comfortable everyday footwear.",
  },
  brand: {
    tone: ["Friendly", "Bold", "Modern"],
    colors: ["#00F0FF", "#8B5CF6", "#05060A"],
    logo: "",
    tagline: "Style that moves at the speed of thought.",
    language: ["English", "Hinglish"],
  },
  goals: {
    primary: "Promote Products",
    secondary: ["Grow Reach", "Increase Engagement"],
  },
  contentPreferences: {
    frequency: "3x per week",
    formats: ["Reel", "Carousel", "Post"],
    postingTime: "Evening",
    styles: ["Product Showcase", "Customer Stories", "Educational"],
  },
  connectedAccounts: {
    instagram: {
      connected: false,
    },
    youtube: {
      connected: false,
    },
  },
  currentStep: 1,
  isCompleted: false,
};


const STORAGE_KEY = "sankalp_onboarding_data";

interface OnboardingContextType {
  state: OnboardingState;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => void;
  setProducts: (products: ProductItem[]) => void;
  addProduct: (product: Omit<ProductItem, "id">) => void;
  updateProduct: (id: string, product: Partial<ProductItem>) => void;
  removeProduct: (id: string) => void;
  updateAudience: (audience: Partial<AudienceProfile>) => void;
  updateBrand: (brand: Partial<BrandProfile>) => void;
  updateGoals: (goals: Partial<GoalsProfile>) => void;
  updateContentPreferences: (preferences: Partial<ContentPreferences>) => void;
  connectAccount: (platform: "instagram" | "youtube", details: { handle?: string; channelName?: string }) => void;
  disconnectAccount: (platform: "instagram" | "youtube") => void;
  setCurrentStep: (step: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(DEFAULT_ONBOARDING_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (e) {
      console.warn("Failed to load onboarding state from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveState = (newState: OnboardingState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn("Failed to persist onboarding state", e);
    }
  };

  const updateBusinessProfile = (profile: Partial<BusinessProfile>) => {
    saveState({
      ...state,
      businessProfile: { ...state.businessProfile, ...profile },
    });
  };

  const setProducts = (products: ProductItem[]) => {
    saveState({
      ...state,
      products,
    });
  };

  const addProduct = (product: Omit<ProductItem, "id">) => {
    const newProduct: ProductItem = {
      ...product,
      id: "prod_" + Date.now().toString(36),
    };
    saveState({
      ...state,
      products: [...state.products, newProduct],
    });
  };

  const updateProduct = (id: string, updates: Partial<ProductItem>) => {
    saveState({
      ...state,
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const removeProduct = (id: string) => {
    saveState({
      ...state,
      products: state.products.filter((p) => p.id !== id),
    });
  };

  const updateAudience = (audience: Partial<AudienceProfile>) => {
    saveState({
      ...state,
      audience: { ...state.audience, ...audience },
    });
  };

  const updateBrand = (brand: Partial<BrandProfile>) => {
    saveState({
      ...state,
      brand: { ...state.brand, ...brand },
    });
  };

  const updateGoals = (goals: Partial<GoalsProfile>) => {
    saveState({
      ...state,
      goals: { ...state.goals, ...goals },
    });
  };

  const updateContentPreferences = (preferences: Partial<ContentPreferences>) => {
    saveState({
      ...state,
      contentPreferences: { ...state.contentPreferences, ...preferences },
    });
  };

  const connectAccount = (
    platform: "instagram" | "youtube",
    details: { handle?: string; channelName?: string }
  ) => {
    saveState({
      ...state,
      connectedAccounts: {
        ...state.connectedAccounts,
        [platform]: {
          connected: true,
          ...details,
          connectedAt: "Just now",
        },
      },
    });
  };

  const disconnectAccount = (platform: "instagram" | "youtube") => {
    saveState({
      ...state,
      connectedAccounts: {
        ...state.connectedAccounts,
        [platform]: {
          connected: false,
        },
      },
    });
  };

  const setCurrentStep = (step: number) => {
    saveState({
      ...state,
      currentStep: step,
    });
  };

  const completeOnboarding = () => {
    saveState({
      ...state,
      isCompleted: true,
      currentStep: 7,
    });
  };

  const resetOnboarding = () => {
    saveState(DEFAULT_ONBOARDING_STATE);
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        updateBusinessProfile,
        setProducts,
        addProduct,
        updateProduct,
        removeProduct,
        updateAudience,
        updateBrand,
        updateGoals,
        updateContentPreferences,
        connectAccount,
        disconnectAccount,
        setCurrentStep,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
