import json
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    Float,
    DateTime,
    ForeignKey,
    Text,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from ..database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    businesses = relationship("Business", back_populates="owner")
    notifications = relationship("Notification", back_populates="user")


class Business(Base):
    __tablename__ = "businesses"

    id = Column(String(64), primary_key=True, index=True)
    owner_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    business_type = Column(String(100), default="D2C Brand")
    location = Column(String(255), default="Pune, India")
    description = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    is_onboarded = Column(Boolean, default=False)
    auto_publish_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="businesses")
    members = relationship("BusinessMember", back_populates="business", cascade="all, delete-orphan")
    products = relationship("Product", back_populates="business", cascade="all, delete-orphan")
    audience_profile = relationship("AudienceProfile", back_populates="business", uselist=False, cascade="all, delete-orphan")
    brand_profile = relationship("BrandProfile", back_populates="business", uselist=False, cascade="all, delete-orphan")
    marketing_goals = relationship("MarketingGoal", back_populates="business", uselist=False, cascade="all, delete-orphan")
    content_preferences = relationship("ContentPreference", back_populates="business", uselist=False, cascade="all, delete-orphan")
    social_accounts = relationship("SocialAccount", back_populates="business", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="business", cascade="all, delete-orphan")
    content_assets = relationship("ContentAsset", back_populates="business", cascade="all, delete-orphan")
    analytics_snapshots = relationship("AnalyticsSnapshot", back_populates="business", cascade="all, delete-orphan")
    learning_insights = relationship("LearningInsight", back_populates="business", cascade="all, delete-orphan")
    agent_runs = relationship("AgentRun", back_populates="business", cascade="all, delete-orphan")

    @property
    def industry(self):
        return self.business_type

    @industry.setter
    def industry(self, val):
        self.business_type = val


class BusinessMember(Base):
    __tablename__ = "business_members"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    role = Column(String(50), default="member")  # owner, admin, member, viewer
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="members")



class Product(Base):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="General")
    price = Column(String(50), default="₹1,999")
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_hero = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="products")


class AudienceProfile(Base):
    __tablename__ = "audience_profiles"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False, unique=True)
    age_ranges_json = Column(Text, default='["18-24", "25-34"]')
    locations_json = Column(Text, default='["City", "India"]')
    types_json = Column(Text, default='["Young Professionals", "Shoppers"]')
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="audience_profile")

    @property
    def age_ranges(self):
        return json.loads(self.age_ranges_json) if self.age_ranges_json else []

    @property
    def locations(self):
        return json.loads(self.locations_json) if self.locations_json else []

    @property
    def types(self):
        return json.loads(self.types_json) if self.types_json else []


class BrandProfile(Base):
    __tablename__ = "brand_profiles"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False, unique=True)
    tones_json = Column(Text, default='["Friendly", "Bold"]')
    colors_json = Column(Text, default='["#00F0FF", "#8B5CF6", "#05060A"]')
    logo_url = Column(String(500), nullable=True)
    tagline = Column(String(255), nullable=True)
    languages_json = Column(Text, default='["English", "Hinglish"]')
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="brand_profile")

    @property
    def tones(self):
        return json.loads(self.tones_json) if self.tones_json else []

    @property
    def colors(self):
        return json.loads(self.colors_json) if self.colors_json else []

    @property
    def languages(self):
        return json.loads(self.languages_json) if self.languages_json else []


class MarketingGoal(Base):
    __tablename__ = "marketing_goals"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False, unique=True)
    primary_goal = Column(String(100), default="Promote Products")
    secondary_goals_json = Column(Text, default='["Grow Reach", "Increase Engagement"]')
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="marketing_goals")

    @property
    def secondary_goals(self):
        return json.loads(self.secondary_goals_json) if self.secondary_goals_json else []


class ContentPreference(Base):
    __tablename__ = "content_preferences"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False, unique=True)
    frequency = Column(String(100), default="3x per week")
    formats_json = Column(Text, default='["Reel", "Carousel", "Post"]')
    posting_time = Column(String(100), default="Evening (18:00 - 21:00)")
    styles_json = Column(Text, default='["Product Showcase", "Behind the Scenes", "Educational"]')
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="content_preferences")

    @property
    def formats(self):
        return json.loads(self.formats_json) if self.formats_json else []

    @property
    def styles(self):
        return json.loads(self.styles_json) if self.styles_json else []


class SocialAccount(Base):
    __tablename__ = "social_accounts"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    platform = Column(String(50), nullable=False)  # instagram, youtube
    account_name = Column(String(255), nullable=False)
    account_id = Column(String(255), nullable=True)
    is_connected = Column(Boolean, default=False)
    permissions_json = Column(Text, default='["publish", "read_insights"]')
    access_token = Column(Text, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    last_synced_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="social_accounts")

    @property
    def permissions(self):
        return json.loads(self.permissions_json) if self.permissions_json else []

    @permissions.setter
    def permissions(self, val):
        self.permissions_json = json.dumps(val)


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    name = Column(String(500), nullable=False)
    objective = Column(Text, nullable=False)
    product_id = Column(String(64), ForeignKey("products.id"), nullable=True)
    status = Column(String(50), default="planning")  # planning, creating, review, scheduled, running, completed
    duration_days = Column(Integer, default=5)
    platforms_json = Column(Text, default='["instagram"]')
    brief = Column(Text, nullable=True)
    
    # Structured Agent Artifacts stored as JSON
    research_json = Column(Text, nullable=True)
    strategy_json = Column(Text, nullable=True)
    learnings_json = Column(Text, nullable=True)

    is_approved = Column(Boolean, default=False)
    brand_fidelity_score = Column(Float, default=99.2)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    business = relationship("Business", back_populates="campaigns")
    steps = relationship("CampaignStep", back_populates="campaign", cascade="all, delete-orphan")
    content_assets = relationship("ContentAsset", back_populates="campaign", cascade="all, delete-orphan")

    @property
    def platforms(self):
        return json.loads(self.platforms_json) if self.platforms_json else []

    @property
    def target_platforms(self):
        return self.platforms

    @target_platforms.setter
    def target_platforms(self, val):
        self.platforms_json = json.dumps(val)


class CampaignStep(Base):
    __tablename__ = "campaign_steps"

    id = Column(String(64), primary_key=True, index=True)
    campaign_id = Column(String(64), ForeignKey("campaigns.id"), nullable=False)
    stage = Column(String(50), nullable=False)  # research, strategy, creative, quality, schedule, publish, analyze, learn
    agent_name = Column(String(100), nullable=False)
    status = Column(String(50), default="pending")  # pending, running, completed, failed
    output_json = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    campaign = relationship("Campaign", back_populates="steps")


class ContentAsset(Base):
    __tablename__ = "content_assets"

    id = Column(String(64), primary_key=True, index=True)
    campaign_id = Column(String(64), ForeignKey("campaigns.id"), nullable=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    platform = Column(String(50), nullable=False)  # instagram, youtube
    content_type = Column(String(50), nullable=False)  # Post, Carousel, Reel, Story, Short Video
    title = Column(String(255), nullable=False)
    caption = Column(Text, nullable=True)
    hook = Column(String(500), nullable=True)
    script = Column(Text, nullable=True)
    media_url = Column(String(500), nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    hashtags_json = Column(Text, default='[]')
    cta = Column(String(255), nullable=True)
    
    quality_status = Column(String(50), default="PASS")  # PASS, NEEDS_REVISION
    quality_notes_json = Column(Text, default='[]')
    
    status = Column(String(50), default="draft")  # draft, approved, scheduled, publishing, published, failed
    published_url = Column(String(500), nullable=True)
    publish_error = Column(Text, nullable=True)
    publish_error_code = Column(String(50), nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="content_assets")
    campaign = relationship("Campaign", back_populates="content_assets")

    @property
    def hashtags(self):
        return json.loads(self.hashtags_json) if self.hashtags_json else []

    @property
    def quality_notes(self):
        return json.loads(self.quality_notes_json) if self.quality_notes_json else []

    @property
    def post_url(self):
        return self.published_url


class ScheduledPost(Base):
    __tablename__ = "scheduled_posts"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    campaign_id = Column(String(64), nullable=True)
    content_asset_id = Column(String(64), ForeignKey("content_assets.id"), nullable=False)
    platform = Column(String(50), nullable=False)
    scheduled_time = Column(DateTime, nullable=False)
    status = Column(String(50), default="queued")  # queued, publishing, published, failed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)


class PublishedPost(Base):
    __tablename__ = "published_posts"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    campaign_id = Column(String(64), nullable=True)
    content_asset_id = Column(String(64), ForeignKey("content_assets.id"), nullable=False)
    platform = Column(String(50), nullable=False)
    post_url = Column(String(500), nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(50), default="published")


class PublicationLog(Base):
    __tablename__ = "publication_logs"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    content_asset_id = Column(String(64), ForeignKey("content_assets.id"), nullable=False)
    platform = Column(String(50), nullable=False)
    provider = Column(String(50), default="meta_instagram")
    status = Column(String(50), nullable=False)  # published, failed
    container_id = Column(String(255), nullable=True)
    media_id = Column(String(255), nullable=True)
    permalink = Column(String(500), nullable=True)
    error_code = Column(String(100), nullable=True)
    error_message = Column(Text, nullable=True)
    raw_response = Column(Text, nullable=True)
    attempted_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    content_id = Column(String(64), ForeignKey("content_assets.id"), nullable=True)
    platform = Column(String(50), default="instagram")
    views = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    saves = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    followers_count = Column(Integer, default=0)
    watch_time_seconds = Column(Float, default=0.0)
    engagement_rate = Column(Float, default=0.0)
    captured_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="analytics_snapshots")

    @property
    def content_asset_id(self):
        return self.content_id

    @content_asset_id.setter
    def content_asset_id(self, val):
        self.content_id = val


class LearningInsight(Base):
    __tablename__ = "learning_insights"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    campaign_id = Column(String(64), nullable=True)
    category = Column(String(100), default="Content Performance")  # Formats, Timing, Hooks, Visuals
    insight_text = Column(Text, nullable=False)
    evidence_json = Column(Text, nullable=True)
    recommendation = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.92)
    is_applied = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="learning_insights")

    @property
    def insight(self):
        return self.insight_text

    @insight.setter
    def insight(self, val):
        self.insight_text = val

    @property
    def is_active(self):
        return self.is_applied

    @is_active.setter
    def is_active(self, val):
        self.is_applied = val

    @property
    def evidence(self):
        return json.loads(self.evidence_json) if self.evidence_json else []

    @evidence.setter
    def evidence(self, val):
        self.evidence_json = json.dumps(val)


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    campaign_id = Column(String(64), nullable=True)
    agent_name = Column(String(100), nullable=False)  # ResearchAgent, StrategyAgent, etc.
    action = Column(String(255), nullable=False)
    status = Column(String(50), default="completed")  # running, completed, failed
    duration_ms = Column(Integer, default=120)
    input_tokens = Column(Integer, default=1200)
    output_tokens = Column(Integer, default=650)
    decision_trace = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    business = relationship("Business", back_populates="agent_runs")

    @property
    def created_at(self):
        return self.timestamp

    @created_at.setter
    def created_at(self, val):
        self.timestamp = val

    @property
    def duration_seconds(self):
        return round(self.duration_ms / 1000.0, 2)


class AgentEvent(Base):
    __tablename__ = "agent_events"

    id = Column(String(64), primary_key=True, index=True)
    business_id = Column(String(64), ForeignKey("businesses.id"), nullable=False)
    campaign_id = Column(String(64), nullable=True)
    agent_name = Column(String(100), nullable=False)
    event_type = Column(String(100), nullable=False)  # start, step, retry, success, failure
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    business_id = Column(String(64), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="info")  # campaign_ready, quality_check, published, learning
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

    @property
    def type(self):
        return self.notification_type

    @type.setter
    def type(self, val):
        self.notification_type = val

