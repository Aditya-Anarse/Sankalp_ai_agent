'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { useApp } from '@/context/AppContext';
import { api } from '@/lib/api';
import {
  Share2,
  Instagram,
  Youtube,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Trash2,
} from 'lucide-react';

interface SocialAccountData {
  id: string;
  platform: string;
  account_name: string;
  account_id: string;
  is_connected: boolean;
  status: 'NOT_CONNECTED' | 'CONNECTING' | 'CONNECTED' | 'EXPIRED' | 'ERROR';
  has_real_token?: boolean;
  token_valid?: boolean;
  permissions: string[];
  last_synced_at: string | null;
  status_message: string;
}

export default function ConnectedAccountsPage() {
  const { business } = useApp();
  const [connecting, setConnecting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<SocialAccountData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.socialAccounts.list();
      if (Array.isArray(data)) {
        setAccounts(data);
      }
    } catch (err: any) {
      console.warn('Error loading connected accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const err = urlParams.get('error');
      if (status === 'instagram_success') {
        setFeedback('Instagram Official Account successfully authorized and connected via Meta OAuth.');
        loadData();
      } else if (status === 'youtube_success') {
        setFeedback('YouTube Channel successfully authorized and connected via Google OAuth.');
        loadData();
      } else if (err) {
        setFeedback(`OAuth Connection Failed: ${err}`);
      }
    }
  }, []);

  const handleStartOAuth = async (platform: string) => {
    setConnecting(platform);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      let businessId = '';
      try {
        const biz = await api.business.get();
        if (biz && biz.id) businessId = biz.id;
      } catch (e) {
        // ignore if not logged in
      }
      const queryParam = businessId ? `&business_id=${encodeURIComponent(businessId)}` : '';
      window.location.href = `${backendUrl}/social-accounts/${platform}/authorize?redirect=true${queryParam}`;
    } catch (err: any) {
      setFeedback(err.message || 'Failed to initialize authorization');
      setConnecting(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      await api.socialAccounts.disconnect(id);
      setFeedback('Account disconnected.');
      await loadData();
    } catch (err: any) {
      setFeedback(err.message || 'Failed to disconnect account.');
    }
  };

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram Business',
      icon: Instagram,
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-500/10 border-pink-500/30',
      description: 'Publishes single image, carousels, and reels via Meta Graph API.',
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts & Channel',
      icon: Youtube,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/10 border-red-500/30',
      description: 'Uploads and schedules video shorts via Google Cloud YouTube Data API.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#05060A] text-white flex flex-col lg:flex-row overflow-x-hidden">
      <WorkspaceSidebar activeTab="Connected Accounts" />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 bg-[#080A10]/70 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Connected Social Accounts</h1>
              <span className="text-[11px] font-mono text-slate-400">
                Official Platform OAuth & Publishing Dispatch
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-5xl w-full mx-auto space-y-6 text-left">
          {feedback && (
            <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-400 text-cyan-200 text-xs font-mono flex items-center justify-between">
              <span>{feedback}</span>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
          )}

          {/* Security Notice */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed font-mono flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-white font-bold block mb-0.5">Production OAuth Protocol</span>
              Accounts are authenticated directly with official Meta and Google APIs. Real access tokens are verified before any account is marked connected.
            </div>
          </div>

          <div className="space-y-4">
            {platforms.map((p) => {
              const connectedAcc = accounts.find((a) => a.platform === p.id && a.is_connected && a.token_valid !== false);
              const Icon = p.icon;

              return (
                <GlassCard
                  key={p.id}
                  className="p-6 border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${p.iconBg} ${p.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{p.name}</h3>

                        {connectedAcc ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Connected & Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700">
                            Not Connected
                          </span>
                        )}
                      </div>

                      {connectedAcc ? (
                        <div>
                          <p className="text-xs font-mono text-cyan-300 font-semibold">{connectedAcc.account_name}</p>
                          <p className="text-[11px] font-mono text-slate-400 mt-1">
                            Account ID: <span className="text-slate-300">{connectedAcc.account_id}</span>
                            {connectedAcc.last_synced_at && (
                              <span className="ml-2">• Synced: {new Date(connectedAcc.last_synced_at).toLocaleDateString()}</span>
                            )}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">{p.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {connectedAcc ? (
                      <button
                        onClick={() => handleDisconnect(connectedAcc.id)}
                        className="text-xs font-mono text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.08] transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Disconnect
                      </button>
                    ) : (
                      <GlassButton
                        variant="cyanGlow"
                        size="sm"
                        onClick={() => handleStartOAuth(p.id)}
                        disabled={connecting === p.id}
                        className="flex items-center gap-1.5"
                      >
                        <span>{connecting === p.id ? 'Connecting...' : `Connect ${p.name.split(' ')[0]}`}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </GlassButton>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
