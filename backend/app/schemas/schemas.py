from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr

# Auth Schemas
class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    business_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    business_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Business Schemas
class BusinessCreate(BaseModel):
    name: str
    business_type: str = "D2C Brand"
    location: str = "Pune, India"
    description: Optional[str] = None
    website: Optional[str] = None

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    business_type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    auto_publish_enabled: Optional[bool] = None

class BusinessResponse(BaseModel):
    id: str
    name: str
    business_type: str
    location: str
    description: Optional[str]
    website: Optional[str]
    is_onboarded: bool
    auto_publish_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Product Schemas
class ProductCreate(BaseModel):
    name: str
    category: str = "General"
    price: str = "₹1,999"
    description: Optional[str] = None
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    price: str
    description: Optional[str]
    image_url: Optional[str]
    is_hero: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Audience Schemas
class AudienceUpdate(BaseModel):
    age_ranges: List[str]
    locations: List[str]
    types: List[str]
    description: Optional[str] = None

class AudienceResponse(BaseModel):
    age_ranges: List[str]
    locations: List[str]
    types: List[str]
    description: Optional[str]

# Brand Schemas
class BrandUpdate(BaseModel):
    tones: List[str]
    colors: List[str]
    logo_url: Optional[str] = None
    tagline: Optional[str] = None
    languages: List[str]

class BrandResponse(BaseModel):
    tones: List[str]
    colors: List[str]
    logo_url: Optional[str]
    tagline: Optional[str]
    languages: List[str]

# Marketing Goals
class GoalsUpdate(BaseModel):
    primary_goal: str
    secondary_goals: List[str]

class GoalsResponse(BaseModel):
    primary_goal: str
    secondary_goals: List[str]

# Content Preferences
class ContentPreferencesUpdate(BaseModel):
    frequency: str
    formats: List[str]
    posting_time: str
    styles: List[str]

class ContentPreferencesResponse(BaseModel):
    frequency: str
    formats: List[str]
    posting_time: str
    styles: List[str]

# Social Account
class SocialAccountConnect(BaseModel):
    platform: str
    account_name: str

class SocialAccountResponse(BaseModel):
    id: str
    platform: str
    account_name: str
    is_connected: bool
    last_synced_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Campaign Schemas
class CampaignCreate(BaseModel):
    name: str
    objective: str
    product_id: Optional[str] = None
    duration_days: int = 5
    platforms: List[str] = ["instagram"]
    brief: Optional[str] = None

class CampaignResponse(BaseModel):
    id: str
    name: str
    objective: str
    product_id: Optional[str]
    status: str
    duration_days: int
    platforms: List[str]
    brief: Optional[str]
    research: Optional[Dict[str, Any]]
    strategy: Optional[Dict[str, Any]]
    is_approved: bool
    brand_fidelity_score: float
    created_at: datetime

    class Config:
        from_attributes = True

# Content Asset Schemas
class ContentAssetCreate(BaseModel):
    campaign_id: Optional[str] = None
    platform: str
    content_type: str
    title: str
    caption: Optional[str] = None
    hook: Optional[str] = None
    script: Optional[str] = None
    media_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    hashtags: List[str] = []
    cta: Optional[str] = None
    scheduled_at: Optional[datetime] = None

class ContentAssetUpdate(BaseModel):
    title: Optional[str] = None
    caption: Optional[str] = None
    hook: Optional[str] = None
    script: Optional[str] = None
    media_url: Optional[str] = None
    hashtags: Optional[List[str]] = None
    cta: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    status: Optional[str] = None

class ContentAssetResponse(BaseModel):
    id: str
    campaign_id: Optional[str]
    platform: str
    content_type: str
    title: str
    caption: Optional[str]
    hook: Optional[str]
    script: Optional[str]
    media_url: Optional[str]
    thumbnail_url: Optional[str]
    hashtags: List[str]
    cta: Optional[str]
    quality_status: str
    quality_notes: List[str]
    status: str
    published_url: Optional[str] = None
    publish_error: Optional[str] = None
    scheduled_at: Optional[datetime]
    published_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics
class AnalyticsResponse(BaseModel):
    total_reach: int
    total_views: int
    total_likes: int
    total_comments: int
    total_shares: int
    avg_engagement_rate: float
    platform_breakdown: Dict[str, Any]
    content_performance: List[Dict[str, Any]]

# Learning
class LearningInsightResponse(BaseModel):
    id: str
    category: str
    insight_text: str
    evidence: List[str]
    recommendation: str
    confidence_score: float
    is_applied: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Agent Activity
class AgentRunResponse(BaseModel):
    id: str
    agent_name: str
    action: str
    status: str
    duration_ms: int
    decision_trace: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

# AI Chat Prompt
class AIChatRequest(BaseModel):
    prompt: str
    campaign_id: Optional[str] = None
