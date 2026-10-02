'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Youtube,
  Clock,
  Sparkles,
  ShieldCheck,
  Plus,
} from 'lucide-react';

export default function CalendarPage() {
  const { contentItems, business } = useApp();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('week');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const daysOfWeek = [
    { day: 'Monday', date: 'Oct 05', count: 1 },
    { day: 'Tuesday', date: 'Oct 06', count: 0 },
    { day: 'Wednesday', date: 'Oct 07', count: 1 },
    { day: 'Thursday', date: 'Oct 08', count: 0 },
    { day: 'Friday', date: 'Oct 09', count: 2 },
    { day: 'Saturday', date: 'Oct 10', count: 1 },
    { day: 'Sunday', date: 'Oct 11', count: 0 },
  ];

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Calendar" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Content Calendar</h1>
              <span className="text-[11px] font-mono text-slate-400">
                Automated Dispatch & Publishing Scheduler
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-1">
              {(['week', 'month', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`text-xs px-3 py-1 rounded-lg font-mono uppercase transition-all ${
                    viewMode === mode
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Calendar Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 text-left">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">October 2026</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Pace: {business.auto_publish_enabled ? 'Auto-Dispatch' : 'Review Mode'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Peak Window: 18:30 - 20:00 IST</span>
            </div>
          </div>

          {/* Week View Grid */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {daysOfWeek.map((d, index) => {
                const dayItems = contentItems.slice(index % contentItems.length, (index % contentItems.length) + (d.count > 0 ? 1 : 0));
                return (
                  <GlassCard
                    key={d.day}
                    className={`p-4 border-white/[0.08] flex flex-col justify-between min-h-[320px] ${
                      d.count > 0 ? 'hover:border-cyan-500/40' : 'opacity-70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] mb-3">
                        <span className="text-xs font-bold text-white">{d.day}</span>
                        <span className="text-[10px] font-mono text-slate-400">{d.date}</span>
                      </div>

                      {d.count > 0 ? (
                        <div className="space-y-2">
                          {dayItems.map((item) => (
                            <Link href="/content-studio" key={item.id}>
                              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 hover:border-cyan-400 transition-all space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 flex items-center gap-1">
                                    {item.platform === 'instagram' ? <Instagram className="w-2.5 h-2.5" /> : <Youtube className="w-2.5 h-2.5" />}
                                    {item.content_type}
                                  </span>
                                  <span className="text-[9px] font-mono text-emerald-300">18:30</span>
                                </div>
                                <p className="text-xs font-semibold text-white line-clamp-2">{item.title}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center text-[11px] font-mono text-slate-600">
                          Rest Window
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/[0.04] text-[10px] font-mono text-slate-500">
                      {d.count > 0 ? `${d.count} drop scheduled` : 'No drops'}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-3">
              {contentItems.map((item, idx) => (
                <GlassCard
                  key={item.id}
                  className="p-4 border-white/[0.08] flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                      {item.platform === 'instagram' ? <Instagram className="w-6 h-6 text-pink-400" /> : <Youtube className="w-6 h-6 text-red-400" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.caption}</p>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-cyan-300">
                        <span>Format: {item.content_type.toUpperCase()}</span>
                        <span>•</span>
                        <span>Dispatch: Oct {5 + idx}, 18:30 IST</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      QA: {item.quality_status || 'PASS'}
                    </span>
                    <Link href="/content-studio">
                      <GlassButton variant="outline" size="sm">
                        Edit
                      </GlassButton>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Month View Placeholder Note */}
          {viewMode === 'month' && (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">Month Matrix View</span>
              <p className="text-sm text-slate-300">
                Full 30-day editorial pacing view synchronized with SANKALP's publishing scheduler.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
