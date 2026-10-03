'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface BusinessData {
  name: string;
  industry: string;
  website: string;
  description: string;
  location: string;
  auto_publish_enabled: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  key_benefits: string[];
  url?: string;
  is_active: boolean;
}

export interface ContentItem {
  id: string;
  campaign_id?: string;
  platform: 'instagram' | 'youtube' | string;
  content_type: 'post' | 'reel' | 'carousel' | 'story' | 'short' | 'video' | string;
  title: string;
  caption: string;
  hook?: string;
  script?: string;
  media_url?: string;
  hashtags?: string[];
  cta?: string;
  status: 'draft' | 'approved' | 'scheduled' | 'published' | 'failed' | string;
  published_url?: string;
  post_url?: string;
  publish_error?: string;
  quality_status?: 'PASS' | 'NEEDS_REVISION' | string;
  quality_score?: number;
  scheduled_at?: string;
  published_at?: string;
}

export interface CampaignData {
  id: string;
  name: string;
  objective: string;
  target_platforms: string[];
  status: 'planning' | 'creating' | 'review' | 'scheduled' | 'running' | 'completed' | string;
  created_at: string;
  research?: any;
  strategy?: any;
  content?: ContentItem[];
}

export interface AgentRunLog {
  id: string;
  agent_name: string;
  campaign_id?: string;
  status: string;
  duration_seconds: number;
  created_at: string;
  details: string;
}

export interface LearningItem {
  id: string;
  insight: string;
  evidence: string[];
  recommendation: string;
  confidence_score: number;
  category: string;
  created_at: string;
}

interface AppContextType {
  business: BusinessData;
  products: ProductItem[];
  campaigns: CampaignData[];
  contentItems: ContentItem[];
  agentLogs: AgentRunLog[];
  learningInsights: LearningItem[];
  activeAgent: string | null;
  isGenerating: boolean;
  refreshAll: () => Promise<void>;
  createCampaignChat: (prompt: string) => Promise<any>;
  runStepWorkflow: (campaignId: string, step: 'research' | 'strategy' | 'generate' | 'qualityCheck' | 'approve') => Promise<any>;
  updateContentItem: (item: ContentItem) => Promise<void>;
  scheduleContentItem: (id: string, time: string) => Promise<void>;
  publishContentItem: (id: string) => Promise<any>;
  deleteContentItem: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessData>({
    name: '',
    industry: '',
    website: '',
    description: '',
    location: '',
    auto_publish_enabled: false,
  });

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentRunLog[]>([]);
  const [learningInsights, setLearningInsights] = useState<LearningItem[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const refreshAll = async () => {
    try {
      const [bizRes, prodsRes, campsRes, contentRes, actRes, learnRes] = await Promise.allSettled([
        api.business.get(),
        api.business.getProducts(),
        api.campaigns.list(),
        api.content.list(),
        api.agent.activity(),
        api.learning.get(),
      ]);

      if (bizRes.status === 'fulfilled' && bizRes.value && bizRes.value.name) {
        setBusiness(bizRes.value);
      }
      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value)) {
        setProducts(prodsRes.value);
      }
      if (campsRes.status === 'fulfilled' && Array.isArray(campsRes.value)) {
        setCampaigns(campsRes.value);
      }
      if (contentRes.status === 'fulfilled' && Array.isArray(contentRes.value)) {
        setContentItems(contentRes.value);
      }
      if (actRes.status === 'fulfilled' && Array.isArray(actRes.value)) {
        setAgentLogs(actRes.value);
      }
      if (learnRes.status === 'fulfilled' && Array.isArray(learnRes.value)) {
        setLearningInsights(learnRes.value);
      }
    } catch (e) {
      console.warn('API sync warning:', e);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const createCampaignChat = async (prompt: string) => {
    setIsGenerating(true);
    setActiveAgent('Orchestrator');
    try {
      const res = await api.agent.chat(prompt);
      await refreshAll();
      setIsGenerating(false);
      setActiveAgent(null);
      return res;
    } catch (e: any) {
      setIsGenerating(false);
      setActiveAgent(null);
      throw e;
    }
  };

  const runStepWorkflow = async (campaignId: string, step: 'research' | 'strategy' | 'generate' | 'qualityCheck' | 'approve') => {
    const res = await api.campaigns[step](campaignId);
    await refreshAll();
    return res;
  };

  const updateContentItem = async (item: ContentItem) => {
    setContentItems(prev => prev.map(c => (c.id === item.id ? item : c)));
    await api.content.update(item.id, item);
    await refreshAll();
  };

  const scheduleContentItem = async (id: string, time: string) => {
    setContentItems(prev => prev.map(c => c.id === id ? { ...c, status: 'scheduled', scheduled_at: time } : c));
    await api.content.schedule(id, time);
    await refreshAll();
  };

  const publishContentItem = async (id: string) => {
    try {
      const res = await api.content.publish(id);
      setContentItems(prev => prev.map(c => c.id === id ? { ...c, status: 'published', published_at: new Date().toISOString() } : c));
      await refreshAll();
      return res;
    } catch (err: any) {
      setContentItems(prev => prev.map(c => c.id === id ? { ...c, status: 'failed' } : c));
      await refreshAll();
      throw err;
    }
  };

  const deleteContentItem = async (id: string) => {
    setContentItems(prev => prev.filter(c => c.id !== id));
    await api.content.delete(id);
    await refreshAll();
  };

  return (
    <AppContext.Provider
      value={{
        business,
        products,
        campaigns,
        contentItems,
        agentLogs,
        learningInsights,
        activeAgent,
        isGenerating,
        refreshAll,
        createCampaignChat,
        runStepWorkflow,
        updateContentItem,
        scheduleContentItem,
        publishContentItem,
        deleteContentItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
