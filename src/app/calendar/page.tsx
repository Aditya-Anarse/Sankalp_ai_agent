'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import {
  Calendar as CalendarIcon,
  Instagram,
  Youtube,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  campaign_id?: string;
  platform: string;
  content_type: string;
  title: string;
  caption?: string;
  status: string;
  quality_status?: string;
  scheduled_at: string;
  date: string;
  time: string;
}

export default function CalendarPage() {
  const { business } = useApp();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendar = async () => {
      setLoading(true);
      try {
        const data = await api.calendar.get();
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.warn('Failed to fetch calendar events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendar();
  }, []);

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
                Scheduled Publishing & Multi-Channel Pipeline
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/content-studio">
              <GlassButton variant="cyanGlow" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                Schedule Content
              </GlassButton>
            </Link>
          </div>
        </header>

        {/* Calendar Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold text-white">Publishing Schedule</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {events.length} item{events.length === 1 ? '' : 's'} scheduled for dispatch.
              </p>
            </div>
          </div>

          {events.length === 0 ? (
            <GlassCard className="p-12 text-center border-dashed border-white/[0.1] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mx-auto">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">No scheduled content.</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Create and schedule content assets in Content Studio to populate your publishing calendar.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/content-studio">
                  <GlassButton variant="cyanGlow" size="sm">
                    Open Content Studio
                  </GlassButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => (
                <GlassCard key={ev.id} className="p-5 border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 capitalize flex items-center gap-1">
                      {ev.platform === 'instagram' ? <Instagram className="w-3 h-3 text-pink-400" /> : <Youtube className="w-3 h-3 text-red-400" />}
                      {ev.content_type}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 uppercase">
                      {ev.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white truncate">{ev.title}</h4>
                    {ev.caption && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{ev.caption}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Clock className="w-3 h-3" /> {ev.date} at {ev.time}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
