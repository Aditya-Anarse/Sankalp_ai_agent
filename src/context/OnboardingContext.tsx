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

const SAMPLE_DEMO_BUSINESS: OnboardingState = {
  businessProfile: {
    businessName: "Aura Botanicals",
    businessType: "D2C Brand",
    location: "Bengaluru",
    description: "Eco-luxury organic skincare made with cold-pressed Himalayan botanicals and zero synthetic chemicals.",
    website: "https://aurabotanicals.co",
  },
  products: [
    {
      id: "prod_1",
      name: "Himalayan Rose Glow Serum",
      category: "Skincare",
      price: "₹1,899",
      description: "Infused with cold-pressed wild rosehip and 24k gold flakes for instant 24h glass skin glow.",
    },
    {
      id: "prod_2",
      name: "Kashmir Saffron Night Elixir",
      category: "Skincare",
      price: "₹2,450",
      description: "Deep cell rejuvenation oil with pure Kashmiri saffron and sea buckthorn oil.",
    },
  ],
  audience: {
    ageRange: ["25–34", "35–44"],
    locations: ["City", "India", "Global"],
    types: ["Professionals", "Shoppers", "Creators"],
    description: "Conscious millennial consumers seeking clean luxury skincare routines backed by clean ingredients.",
  },
  brand: {
    tone: ["Luxury", "Minimal", "Trustworthy"],
    colors: ["#10B981", "#00F0FF", "#080A10"],
    tagline: "Purity distilled from the Himalayas.",
    language: ["English", "Hindi"],
  },
  goals: {
    primary: "Promote Products",
    secondary: ["Grow Reach", "Build Audience", "Increase Engagement"],
  },
  contentPreferences: {
    frequency: "Daily",
    formats: ["Reel", "Carousel", "Story"],
    postingTime: "Evening",
    styles: ["Behind the Scenes", "Product Showcase", "Educational"],
  },
  connectedAccounts: {
    instagram: {
      connected: true,
      handle: "@aurabotanicals.co",
      connectedAt: "Just now",
    },
    youtube: {
      connected: true,
      channelName: "Aura Botanicals Studio",
      connectedAt: "Just now",
    },
  },
  currentStep: 7,
  isCompleted: true,
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
  loadDemoData: () => void;
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

  const loadDemoData = () => {
    saveState(SAMPLE_DEMO_BUSINESS);
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
        loadDemoData,
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
