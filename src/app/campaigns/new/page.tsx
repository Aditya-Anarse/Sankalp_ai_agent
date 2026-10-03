'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  ArrowLeft,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  ShoppingBag,
  Users,
  Film,
  Zap,
} from 'lucide-react';

export default function NewCampaignPage() {
  const router = useRouter();
  const { products, business, createCampaignChat } = useApp();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    objective: '',
    productId: products[0]?.id || '',
    targetAudience: '',
    platforms: ['instagram', 'youtube'],
    durationDays: '5',
    frequency: 'Daily',
    formats: ['Reels', 'Carousels', 'Shorts'],
    brief: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createCampaignChat(
        `Create a ${formData.durationDays}-day campaign named "${formData.name}". Objective: ${formData.objective}. Target formats: ${formData.formats.join(', ')}.`
      );
      if (res && res.campaign_id) {
        router.push(`/campaigns/${res.campaign_id}`);
      } else {
        router.push('/campaigns');
      }
    } catch (err) {
      router.push('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Campaigns" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Link href="/campaigns" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Campaign Creator Wizard</h1>
              <span className="text-[10px] font-mono text-cyan-400">7-Agent Autonomous Pipeline</span>
            </div>
          </div>
        </header>

        {/* Form Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-4xl w-full mx-auto space-y-6">
          <div className="text-left pb-4 border-b border-white/[0.06]">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Configure Marketing Campaign</h2>
            <p className="text-xs text-slate-400 mt-1">
              Provide campaign goals. SANKALP will autonomously perform research, strategy planning, copy generation, and quality checks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <GlassCard className="p-6 space-y-5 border-white/[0.08]">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Q4 Growth Sprint or New Product Drop"
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                  Campaign Objective
                </label>
                <textarea
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  placeholder="e.g. Drive organic sales and brand awareness with educational short-form video and carousels."
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                    Focus Product
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full bg-[#0d111c] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.currency} {p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                    min={1}
                    max={30}
                    className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 block mb-1.5">
                  Creative Brief & Angles
                </label>
                <textarea
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </GlassCard>

            <div className="flex items-center justify-end gap-3">
              <Link href="/campaigns">
                <GlassButton variant="outline" size="md">
                  Cancel
                </GlassButton>
              </Link>

              <GlassButton
                type="submit"
                variant="cyanGlow"
                size="md"
                disabled={loading}
                icon={<Sparkles className="w-4 h-4" />}
              >
                {loading ? 'Orchestrating 7 Agents...' : 'Start Agent Workflow'}
              </GlassButton>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
