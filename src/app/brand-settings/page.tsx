'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  Settings,
  Sparkles,
  Save,
  CheckCircle2,
  Tag,
  ShoppingBag,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
} from 'lucide-react';

export default function BrandSettingsPage() {
  const { business, products } = useApp();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: business.name,
    industry: business.industry,
    website: business.website,
    description: business.description,
    location: business.location,
    brandTone: 'Bold, premium, energetic, authentic, conversational',
    tagline: 'Engineered for Everyday Movement.',
    targetDemographics: '21-35 years, Urban Professionals & Creators',
    autoPublish: business.auto_publish_enabled,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Brand Settings" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Brand Constitution & Catalog</h1>
              <span className="text-[11px] font-mono text-slate-400">
                Core Guardrails & Knowledge Base Loaded into SANKALP Memory
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-4xl w-full mx-auto space-y-6 text-left">
          {saved && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-400 text-emerald-200 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Brand constitution updated. All 7 agents re-calibrated.</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* General Business Info */}
            <GlassCard className="p-6 space-y-4 border-white/[0.08]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
                1. Business Identity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1">Industry / Category</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Business Narrative & Value Proposition</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </GlassCard>

            {/* Brand Voice & Rules */}
            <GlassCard className="p-6 space-y-4 border-white/[0.08]">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
                2. Brand Voice & Guardrails
              </h2>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Tone of Voice</label>
                <input
                  type="text"
                  value={formData.brandTone}
                  onChange={(e) => setFormData({ ...formData, brandTone: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Official Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-1 text-xs text-cyan-200 font-mono">
                <span className="font-bold block">Hardcoded Agent Guardrails (Active):</span>
                <p>• Never hallucinate unverified medical or health claims</p>
                <p>• Always maintain strict pricing parity with active product database</p>
                <p>• Always maintain clear call-to-action</p>
              </div>
            </GlassCard>

            {/* Product Database Preview */}
            <GlassCard className="p-6 space-y-4 border-white/[0.08]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">
                  3. Active Product Catalog ({products.length})
                </h2>
              </div>

              <div className="space-y-3">
                {products.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-300">
                        {p.category} • {p.currency} {p.price}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="flex items-center justify-end">
              <GlassButton type="submit" variant="cyanGlow" size="md" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </GlassButton>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
