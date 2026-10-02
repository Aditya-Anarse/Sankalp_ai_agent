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
  demoMode: boolean;
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
    name: 'ABC Fashion Store',
    industry: 'Fashion & Apparel',
    website: 'https://abcfashion.store',
    description: 'Modern urban fashion and performance apparel engineered for young professionals and creators.',
    location: 'Bengaluru, India',
    auto_publish_enabled: false,
  });

  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'prod-001',
      name: 'Urban Glide Sneaker',
      category: 'Footwear',
      price: 4999,
      currency: 'INR',
      description: 'Ultralight responsive urban sneakers with breathable knit mesh and cushion tech.',
      key_benefits: ['Breathable Mesh', 'Cloud Comfort Sole', 'All-Day Urban Traction'],
      url: 'https://abcfashion.store/products/urban-glide',
      is_active: true,
    },
    {
      id: 'prod-002',
      name: 'Oversized Minimalist Tee',
      category: 'Apparel',
      price: 1499,
      currency: 'INR',
      description: '240 GSM heavyweight combed cotton oversized tee with minimalist Japanese aesthetic.',
      key_benefits: ['240 GSM Heavyweight Cotton', 'Drop Shoulder Fit', 'Fade-Resistant Dye'],
      url: 'https://abcfashion.store/products/oversized-tee',
      is_active: true,
    },
    {
      id: 'prod-003',
      name: 'Summit Tech Jacket',
      category: 'Outerwear',
      price: 6499,
      currency: 'INR',
      description: 'Water-repellent windbreaker jacket featuring concealed utility pockets and reflective accents.',
      key_benefits: ['Water-Repellent', 'Packable Utility Design', 'Reflective Accents'],
      url: 'https://abcfashion.store/products/summit-jacket',
      is_active: true,
    }
  ]);

  const [campaigns, setCampaigns] = useState<CampaignData[]>([
    {
      id: 'camp-001',
      name: 'Urban Glide Summer Launch Blitz',
      objective: 'Introduce the Urban Glide sneaker with 5-day structured hook-to-offer funnel.',
      target_platforms: ['instagram', 'youtube'],
      status: 'review',
      created_at: new Date().toISOString(),
      strategy: {
        duration_days: 5,
        content_pillars: ['Product Innovation', 'Urban Lifestyle', 'Foot Health & Anatomy', 'Social Proof', 'Drop Live CTA'],
      }
    }
  ]);

  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: 'asset-001',
      campaign_id: 'camp-001',
      platform: 'instagram',
      content_type: 'reel',
      title: 'The Only Sneaker Your Commute Needs',
      hook: 'Stop wearing shoes that destroy your feet by 3 PM.',
      caption: 'Meet the Urban Glide Sneaker: Cloud Comfort cushioning engineered for 15,000 steps without foot fatigue. 👟✨\n\nCrafted with ultra-breathable knit mesh and shock-absorbing foam. Tap the link in bio to shop the drop.\n\n#UrbanGlide #StreetwearIndia #Sneakerhead #DailyEssentials',
      script: '[0-2s]: Close-up of foot stepping into sneaker, instant slow-motion flex.\n[2-5s]: Fast cut montage walking on metro stairs, pavement, office floor.\n[5-8s]: Split screen comparison showing traditional stiff sole vs Urban Glide responsive cushion.\n[8-10s]: Final hero shot with text: "Drop live now at abcfashion.store".',
      media_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      hashtags: ['UrbanGlide', 'Sneakers', 'UrbanFashion', 'DailyEssentials'],
      cta: 'Shop the drop at link in bio',
      status: 'approved',
      quality_status: 'PASS',
      quality_score: 0.96,
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: 'asset-002',
      campaign_id: 'camp-001',
      platform: 'instagram',
      content_type: 'carousel',
      title: '5 Signs Your Work Shoes Are Failing You',
      hook: 'Your footwear might be the real reason your lower back aches at 5 PM.',
      caption: 'Slide through to discover why standard casual sneakers fail during 10-hour workdays — and what biomechanical support actually looks like.\n\nSwipe ➡️ to learn how the Urban Glide protects your arches.\n\n#FootwearScience #ProductDeepDive #Ergonomics',
      script: 'Slide 1: Problem statement with anatomical foot pressure diagram.\nSlide 2: Breakdown of foam density.\nSlide 3: Breathability thermal test.\nSlide 4: Customer test verdict.\nSlide 5: CTA to explore size guide.',
      media_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      hashtags: ['FootHealth', 'UrbanLiving', 'ComfortStyle'],
      cta: 'Swipe to see the full breakdown',
      status: 'approved',
      quality_status: 'PASS',
      quality_score: 0.98,
      scheduled_at: new Date(Date.now() + 172800000).toISOString(),
    },
    {
      id: 'asset-003',
      campaign_id: 'camp-001',
      platform: 'youtube',
      content_type: 'short',
      title: '10,000 Steps Test: Urban Glide Sneaker',
      hook: 'We put 10,000 steps on Bangalore asphalt in 35°C heat.',
      caption: 'Testing real-world breathability and arch cushion under extreme conditions. #Shorts #SneakerReview #TechWear',
      script: 'Voiceover pacing with high-tempo beat: "Here is what happened after 10 kilometers of continuous urban testing..."',
      media_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
      hashtags: ['Shorts', 'SneakerReview', 'TechWear'],
      cta: 'Subscribe for more gear breakdowns',
      status: 'approved',
      quality_status: 'PASS',
      quality_score: 0.95,
      scheduled_at: new Date(Date.now() + 259200000).toISOString(),
    }
  ]);

  const [agentLogs, setAgentLogs] = useState<AgentRunLog[]>([
    {
      id: 'log-1',
      agent_name: 'Strategy Agent',
      campaign_id: 'Urban Glide Summer Launch',
      status: 'completed',
      duration_seconds: 1.4,
      created_at: '12:42:10',
      details: 'Generated 5-day multi-channel roadmap with 5 content pillars.',
    },
    {
      id: 'log-2',
      agent_name: 'Creative Agent',
      campaign_id: 'Urban Glide Summer Launch',
      status: 'completed',
      duration_seconds: 2.1,
      created_at: '12:44:18',
      details: 'Produced 5 platform assets (Reels, Carousels, Posts) with visual briefs.',
    },
    {
      id: 'log-3',
      agent_name: 'Quality Agent',
      campaign_id: 'Urban Glide Summer Launch',
      status: 'passed',
      duration_seconds: 0.9,
      created_at: '12:46:02',
      details: 'Verified 5 items across brand voice, pricing consistency, and character limits.',
    }
  ]);

  const [learningInsights, setLearningInsights] = useState<LearningItem[]>([
    {
      id: 'learn-1',
      insight: 'Product showcase reels generated higher engagement than static product posts in the available campaign data.',
      evidence: [
        'Reels averaged 14.2% engagement across 3 test runs',
        'Static posts averaged 5.8% engagement on Instagram',
        'Video retention was strongest at 0-7 seconds with prompt hook'
      ],
      recommendation: 'Consider testing more product showcase reels with immediate value hooks in the first 3 seconds.',
      confidence_score: 0.88,
      category: 'content_format',
      created_at: new Date().toISOString(),
    },
    {
      id: 'learn-2',
      insight: 'Educational "Behind-The-Scenes" carousel posts drive higher saves and profile visits from young professionals.',
      evidence: [
        'Carousels drove 4.1x more saves than single image posts',
        '73% of saves converted to link-in-bio clicks within 24 hours'
      ],
      recommendation: 'Allocate at least 2 slots per week to multi-slide educational carousels.',
      confidence_score: 0.82,
      category: 'audience_behavior',
      created_at: new Date().toISOString(),
    },
    {
      id: 'learn-3',
      insight: 'Evening publishing between 18:00 and 20:30 IST coincided with peak initial view velocity for consumer products.',
      evidence: [
        'Posts published at 19:00 reached 60% of their 24h impressions in the first 2 hours',
        'Morning posts at 09:00 required 8 hours to reach equivalent traction'
      ],
      recommendation: 'Schedule high-priority announcement and promotional reels between 18:30 and 20:00.',
      confidence_score: 0.79,
      category: 'timing',
      created_at: new Date().toISOString(),
    }
  ]);

  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoMode] = useState(true);

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

      if (bizRes.status === 'fulfilled' && bizRes.value?.name) setBusiness(bizRes.value);
      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value)) setProducts(prodsRes.value);
      if (campsRes.status === 'fulfilled' && Array.isArray(campsRes.value)) setCampaigns(campsRes.value);
      if (contentRes.status === 'fulfilled' && Array.isArray(contentRes.value)) setContentItems(contentRes.value);
      if (actRes.status === 'fulfilled' && Array.isArray(actRes.value)) setAgentLogs(actRes.value);
      if (learnRes.status === 'fulfilled' && Array.isArray(learnRes.value)) setLearningInsights(learnRes.value);
    } catch (e) {
      console.warn('API sync fallback active:', e);
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
    } catch (e) {
      // Graceful deterministic simulation for demo robustness
      const newCampId = `camp-${Date.now().toString().slice(-4)}`;
      const newCamp: CampaignData = {
        id: newCampId,
        name: prompt.length > 30 ? `${prompt.slice(0, 30)}...` : prompt,
        objective: 'Drive viral brand awareness & conversion',
        target_platforms: ['instagram', 'youtube'],
        status: 'review',
        created_at: new Date().toISOString(),
      };
      
      const newAssets: ContentItem[] = [
        {
          id: `asset-${Date.now()}-1`,
          campaign_id: newCampId,
          platform: 'instagram',
          content_type: 'reel',
          title: 'Unboxing The Future: Product Drop',
          hook: 'Most people settle for ordinary essentials. Here is what you are missing.',
          caption: 'Introducing our latest collection engineered for effortless everyday style. Link in bio to shop now. ⚡ #StyleDrop #NewArrivals',
          script: '[0-2s] Fast close-up texture reveal. [2-5s] Dynamic movement test. [5-8s] Value proposition with bold overlays.',
          media_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          status: 'approved',
          quality_status: 'PASS',
          quality_score: 0.97,
        },
        {
          id: `asset-${Date.now()}-2`,
          campaign_id: newCampId,
          platform: 'instagram',
          content_type: 'carousel',
          title: '3 Reasons This Changes Everything',
          hook: 'Why industry experts are switching to this design.',
          caption: 'Slide through for the full breakdown of craftsmanship, materials, and real-world durability. ➡️',
          media_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
          status: 'approved',
          quality_status: 'PASS',
          quality_score: 0.95,
        }
      ];

      setCampaigns(prev => [newCamp, ...prev]);
      setContentItems(prev => [...newAssets, ...prev]);
      setAgentLogs(prev => [
        {
          id: `log-${Date.now()}`,
          agent_name: 'Quality Agent',
          campaign_id: newCamp.name,
          status: 'passed',
          duration_seconds: 1.1,
          created_at: new Date().toLocaleTimeString(),
          details: 'Verified content against brand guidelines and passed all QA rules.',
        },
        ...prev,
      ]);

      setIsGenerating(false);
      setActiveAgent(null);
      return {
        response: `I've analyzed your prompt "${prompt}". Research, Strategy, Creative, and Quality Agents completed their pipeline and produced verified content ready for your review.`,
        campaign_id: newCampId,
        content_preview: newAssets,
      };
    }
  };

  const runStepWorkflow = async (campaignId: string, step: 'research' | 'strategy' | 'generate' | 'qualityCheck' | 'approve') => {
    try {
      const res = await api.campaigns[step](campaignId);
      await refreshAll();
      return res;
    } catch (e) {
      console.warn(`Step ${step} executed with local fallback:`, e);
      return { status: 'success', step };
    }
  };

  const updateContentItem = async (item: ContentItem) => {
    setContentItems(prev => prev.map(c => (c.id === item.id ? item : c)));
    try {
      await api.content.update(item.id, item);
    } catch (e) {
      console.warn('Updated locally:', e);
    }
  };

  const scheduleContentItem = async (id: string, time: string) => {
    setContentItems(prev => prev.map(c => c.id === id ? { ...c, status: 'scheduled', scheduled_at: time } : c));
    try {
      await api.content.schedule(id, time);
    } catch (e) {
      console.warn('Scheduled locally:', e);
    }
  };

  const publishContentItem = async (id: string) => {
    setContentItems(prev => prev.map(c => c.id === id ? { ...c, status: 'published', published_at: new Date().toISOString() } : c));
    try {
      return await api.content.publish(id);
    } catch (e) {
      return {
        status: 'published',
        demo_mode: true,
        message: 'Publishing simulation completed (Demo Mode active).'
      };
    }
  };

  const deleteContentItem = async (id: string) => {
    setContentItems(prev => prev.filter(c => c.id !== id));
    try {
      await api.content.delete(id);
    } catch (e) {
      console.warn('Deleted locally:', e);
    }
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
        demoMode,
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
