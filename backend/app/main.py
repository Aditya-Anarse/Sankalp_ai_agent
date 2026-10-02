from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import json
import uuid

from .core.config import settings
from .core.security import get_password_hash
from .database.database import engine, Base, SessionLocal
from .models.models import (
    User, Business, Product, AudienceProfile, BrandProfile, MarketingGoal,
    ContentPreference, SocialAccount, Campaign, ContentAsset, LearningInsight, AgentRun
)
from .api import auth, business, campaigns, content, analytics, learning, agent, social_accounts, calendar, notifications

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SANKALP AI — Autonomous Marketing Employee API",
    description="Backend API powering SANKALP's 7-Agent Autonomous Marketing Employee Engine.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(business.router)
app.include_router(campaigns.router)
app.include_router(content.router)
app.include_router(analytics.router)
app.include_router(learning.router)
app.include_router(agent.router)
app.include_router(social_accounts.router)
app.include_router(calendar.router)
app.include_router(notifications.router)

@app.on_event("startup")
def seed_demo_data():
    """Initializes demo workspace for instant hackathon walkthrough if database is empty."""
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == "demo@sankalp.ai").first()
        if not existing_user:
            user = User(
                id="usr-demo-001",
                email="demo@sankalp.ai",
                name="Aditya Sharma",
                hashed_password=get_password_hash("sankalp2026"),
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.add(user)
            
            biz = Business(
                id="biz-demo-001",
                owner_id=user.id,
                name="ABC Fashion Store",
                business_type="Fashion & Apparel",
                website="https://abcfashion.store",
                description="Modern urban fashion and performance apparel engineered for young professionals and creators.",
                location="Bengaluru, India",
                auto_publish_enabled=False,
                is_onboarded=True,
                created_at=datetime.utcnow()
            )
            db.add(biz)
            
            # Products
            p1 = Product(
                id="prod-001",
                business_id=biz.id,
                name="Urban Glide Sneaker",
                category="Footwear",
                price="₹4,999",
                description="Ultralight responsive urban sneakers with breathable knit mesh and cushion tech.",
                image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                is_hero=True
            )
            p2 = Product(
                id="prod-002",
                business_id=biz.id,
                name="Oversized Minimalist Tee",
                category="Apparel",
                price="₹1,499",
                description="240 GSM heavyweight combed cotton oversized tee with minimalist Japanese aesthetic.",
                image_url="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
                is_hero=False
            )
            p3 = Product(
                id="prod-003",
                business_id=biz.id,
                name="Summit Tech Jacket",
                category="Outerwear",
                price="₹6,499",
                description="Water-repellent windbreaker jacket featuring concealed utility pockets and reflective accents.",
                image_url="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
                is_hero=False
            )
            db.add_all([p1, p2, p3])
            
            # Audience
            aud = AudienceProfile(
                id="aud-001",
                business_id=biz.id,
                age_ranges_json=json.dumps(["21-24", "25-34"]),
                locations_json=json.dumps(["Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad"]),
                types_json=json.dumps(["Young Professionals", "Creators", "Streetwear Enthusiasts"]),
                description="Urban professionals & creators aged 21-35 seeking breathable, versatile daily wear."
            )
            db.add(aud)
            
            # Brand Profile
            brand = BrandProfile(
                id="brand-001",
                business_id=biz.id,
                tones_json=json.dumps(["Bold", "Premium", "Energetic", "Conversational"]),
                colors_json=json.dumps(["#06B6D4", "#8B5CF6", "#090D16"]),
                tagline="Engineered for Everyday Movement.",
                languages_json=json.dumps(["English", "Hinglish"])
            )
            db.add(brand)
            
            # Goals
            goal = MarketingGoal(
                id="goal-001",
                business_id=biz.id,
                primary_goal="Product Promotion & Engagement",
                secondary_goals_json=json.dumps(["Brand Authority", "D2C Direct Orders"])
            )
            db.add(goal)
            
            # Content Preferences
            pref = ContentPreference(
                id="pref-001",
                business_id=biz.id,
                frequency="5x per week",
                formats_json=json.dumps(["Reel", "Carousel", "Post"]),
                posting_time="Evening (18:30 - 20:00)",
                styles_json=json.dumps(["Product Showcase", "Behind the Scenes", "Educational Breakdowns"])
            )
            db.add(pref)
            
            # Social Accounts (Demo)
            sa1 = SocialAccount(
                id="soc-001",
                business_id=biz.id,
                platform="instagram",
                account_name="@abcfashion_official",
                account_id="ig_demo_98231",
                is_connected=True,
                is_demo_mode=True,
                last_synced_at=datetime.utcnow()
            )
            sa2 = SocialAccount(
                id="soc-002",
                business_id=biz.id,
                platform="youtube",
                account_name="ABC Fashion Studio",
                account_id="yt_demo_channel_441",
                is_connected=True,
                is_demo_mode=True,
                last_synced_at=datetime.utcnow()
            )
            db.add_all([sa1, sa2])
            
            # Campaign Sample
            camp = Campaign(
                id="camp-001",
                business_id=biz.id,
                name="Urban Glide Summer Launch Blitz",
                objective="Introduce the Urban Glide sneaker with 5-day structured hook-to-offer funnel.",
                status="running",
                duration_days=5,
                platforms_json=json.dumps(["instagram", "youtube"]),
                brief="Focus on organic breathable fabric, aesthetic unboxing reels, and launch offer.",
                research_json=json.dumps({
                    "market_trends": ["Surging demand for breathable performance-casual footwear."],
                    "competitor_insights": ["Competitors lack transparent fabric origin stories."],
                    "recommended_angles": ["10,000 steps commuter stress test", "Ergonomic sole breakdown"]
                }),
                strategy_json=json.dumps({
                    "campaign_name": "Urban Glide Summer Launch Blitz",
                    "target_audience": "Urban Professionals & Commuters",
                    "core_message": "Cloud comfort engineered for 15,000 daily steps without fatigue."
                }),
                is_approved=True,
                brand_fidelity_score=99.2,
                created_at=datetime.utcnow()
            )
            db.add(camp)
            
            # Content Assets
            c1 = ContentAsset(
                id="asset-001",
                campaign_id=camp.id,
                business_id=biz.id,
                platform="instagram",
                content_type="Reel",
                title="The Only Sneaker Your Commute Needs",
                hook="Stop wearing shoes that destroy your feet by 3 PM.",
                caption="Meet the Urban Glide Sneaker: Cloud Comfort cushioning engineered for 15,000 steps without foot fatigue. 👟✨\n\nCrafted with ultra-breathable knit mesh and shock-absorbing foam. Tap the link in bio to shop the drop.\n\n#UrbanGlide #StreetwearIndia #Sneakerhead #DailyEssentials",
                script="[0-2s]: Close-up of foot stepping into sneaker, instant slow-motion flex.\n[2-5s]: Fast cut montage walking on metro stairs, pavement, office floor.\n[5-8s]: Split screen comparison showing traditional stiff sole vs Urban Glide responsive cushion.\n[8-10s]: Final hero shot with text: 'Drop live now at abcfashion.store'.",
                media_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                hashtags_json=json.dumps(["UrbanGlide", "Sneakers", "UrbanFashion", "DailyEssentials"]),
                cta="Shop the drop at link in bio",
                status="approved",
                quality_status="PASS",
                quality_notes_json=json.dumps([]),
                created_at=datetime.utcnow()
            )
            
            c2 = ContentAsset(
                id="asset-002",
                campaign_id=camp.id,
                business_id=biz.id,
                platform="instagram",
                content_type="Carousel",
                title="5 Signs Your Work Shoes Are Failing You",
                hook="Your footwear might be the real reason your lower back aches at 5 PM.",
                caption="Slide through to discover why standard casual sneakers fail during 10-hour workdays — and what biomechanical support actually looks like.\n\nSwipe ➡️ to learn how the Urban Glide protects your arches.\n\n#FootwearScience #ProductDeepDive #Ergonomics",
                script="Slide 1: Problem statement with anatomical foot pressure diagram.\nSlide 2: Breakdown of foam density.\nSlide 3: Breathability thermal test.\nSlide 4: Customer test verdict.\nSlide 5: CTA to explore size guide.",
                media_url="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
                hashtags_json=json.dumps(["FootHealth", "UrbanLiving", "ComfortStyle"]),
                cta="Swipe to see the full breakdown",
                status="approved",
                quality_status="PASS",
                quality_notes_json=json.dumps([]),
                created_at=datetime.utcnow()
            )
            
            c3 = ContentAsset(
                id="asset-003",
                campaign_id=camp.id,
                business_id=biz.id,
                platform="youtube",
                content_type="Shorts",
                title="10,000 Steps Test: Urban Glide Sneaker",
                hook="We put 10,000 steps on Bangalore asphalt in 35°C heat.",
                caption="Testing real-world breathability and arch cushion under extreme conditions. #Shorts #SneakerReview #TechWear",
                script="Voiceover pacing with high-tempo beat: 'Here is what happened after 10 kilometers of continuous urban testing...'",
                media_url="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
                hashtags_json=json.dumps(["Shorts", "SneakerReview", "TechWear"]),
                cta="Subscribe for more gear breakdowns",
                status="approved",
                quality_status="PASS",
                quality_notes_json=json.dumps([]),
                created_at=datetime.utcnow()
            )
            db.add_all([c1, c2, c3])
            
            db.commit()
            print("Successfully initialized SANKALP Demo Workspace with ABC Fashion Store.")
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "product": "SANKALP AI",
        "role": "Autonomous AI Marketing Employee for Businesses",
        "status": "operational",
        "engine_version": "2.0.0",
        "agents": [
            "ResearchAgent",
            "StrategyAgent",
            "CreativeAgent",
            "QualityAgent",
            "PublisherAgent",
            "PerformanceAgent",
            "LearningAgent"
        ],
        "documentation": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected",
        "demo_mode": True,
        "product": "SANKALP AI"
    }

