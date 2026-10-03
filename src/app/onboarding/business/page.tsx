"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassSelect } from "@/components/ui/GlassSelect";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { useOnboarding } from "@/context/OnboardingContext";
import { useAuth } from "@/context/AuthContext";
import { Building2, MapPin, Globe, Sparkles } from "lucide-react";

const BUSINESS_TYPES = [
  { value: "D2C Brand", label: "D2C Brand (Direct to Consumer)" },
  { value: "Local Shop", label: "Local Shop & Boutique" },
  { value: "Retail", label: "Retail & Multi-Brand Store" },
  { value: "Restaurant", label: "Restaurant & Dining" },
  { value: "Cafe", label: "Cafe & Bakery" },
  { value: "Salon", label: "Salon, Spa & Wellness" },
  { value: "Startup", label: "Tech & Software Startup" },
  { value: "Creator", label: "Creator / Solopreneur" },
  { value: "Service Business", label: "Consulting / Agency / Services" },
  { value: "Other", label: "Other Business" },
];

export default function BusinessStepPage() {
  const router = useRouter();
  const { state, updateBusinessProfile, setCurrentStep } = useOnboarding();
  const { updateUser } = useAuth();

  const [form, setForm] = useState({
    businessName: state.businessProfile.businessName || "",
    businessType: state.businessProfile.businessType || "D2C Brand",
    location: state.businessProfile.location || "",
    description: state.businessProfile.description || "",
    website: state.businessProfile.website || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.businessName.trim()) {
      errs.businessName = "Business name is required.";
    }
    if (!form.location.trim()) {
      errs.location = "City or operating area is required.";
    }
    if (!form.description.trim() || form.description.length < 15) {
      errs.description = "Please provide at least 15 characters describing what your business does.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    updateBusinessProfile(form);
    updateUser({ businessName: form.businessName });
    setCurrentStep(2);
    router.push("/onboarding/products");
  };

  return (
    <OnboardingLayout
      currentStep={1}
      heading="Tell me about your business."
      subheading="I'll use this information to understand what your business offers and who you serve."
      onNext={handleNext}
    >
      <div className="space-y-4 text-left">
        <GlassInput
          label="Business / Brand Name"
          required
          placeholder="e.g. Acme Studio or Aura Organics"
          value={form.businessName}
          onChange={(e) => {
            setForm({ ...form, businessName: e.target.value });
            if (errors.businessName) setErrors({ ...errors, businessName: "" });
          }}
          error={errors.businessName}
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassSelect
            label="Business Type"
            required
            options={BUSINESS_TYPES}
            value={form.businessType}
            onChange={(e) => setForm({ ...form, businessType: e.target.value })}
          />

          <GlassInput
            label="Primary Location (City / Area)"
            required
            placeholder="e.g. Mumbai, Pune, or Bengaluru"
            value={form.location}
            onChange={(e) => {
              setForm({ ...form, location: e.target.value });
              if (errors.location) setErrors({ ...errors, location: "" });
            }}
            error={errors.location}
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        </div>

        <GlassTextarea
          label="Business Description"
          required
          rows={4}
          placeholder="Tell SANKALP what your business does, your main offerings, and what makes you unique (e.g. We sell affordable men's & women's urban streetwear with sustainable organic cotton...)"
          value={form.description}
          onChange={(e) => {
            setForm({ ...form, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: "" });
          }}
          error={errors.description}
          hint="SANKALP uses this to establish your foundational knowledge graph."
        />

        <GlassInput
          label="Website or Store URL (Optional)"
          placeholder="https://yourstore.com"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          leftIcon={<Globe className="w-4 h-4" />}
        />
      </div>
    </OnboardingLayout>
  );
}
