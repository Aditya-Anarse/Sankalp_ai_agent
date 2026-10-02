import json
import time
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..models.models import (
    Business,
    Product,
    BrandProfile,
    AudienceProfile,
    MarketingGoal,
    ContentPreference,
    SocialAccount,
)
from ..schemas.schemas import (
    BusinessUpdate,
    BusinessResponse,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    BrandUpdate,
    BrandResponse,
    AudienceUpdate,
    AudienceResponse,
    GoalsUpdate,
    GoalsResponse,
    ContentPreferencesUpdate,
    ContentPreferencesResponse,
)


router = APIRouter(prefix="", tags=["Business & Onboarding"])

def get_default_business(db: Session) -> Business:
    biz = db.query(Business).filter(Business.name.ilike("%ABC Fashion%")).first()
    if not biz:
        biz = db.query(Business).filter(Business.id == "biz-demo-001").first()
    if not biz:
        biz = Business(
            id="biz-demo-001",
            owner_id="usr-demo-001",
            name="ABC Fashion Store",
            business_type="Fashion & Apparel",
            location="Bengaluru, India",
            description="Modern urban fashion and performance apparel engineered for young professionals and creators.",
            is_onboarded=True,
        )
        db.add(biz)
        db.commit()
        db.refresh(biz)
    return biz

# Business Endpoints
@router.get("/business", response_model=BusinessResponse)
def get_business(db: Session = Depends(get_db)):
    biz = get_default_business(db)
    return biz

@router.patch("/business", response_model=BusinessResponse)
def update_business(payload: BusinessUpdate, db: Session = Depends(get_db)):
    biz = get_default_business(db)
    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(biz, key, val)
    db.commit()
    db.refresh(biz)
    return biz

# Products Endpoints
@router.get("/business/products")
@router.get("/products")
def list_products(db: Session = Depends(get_db)):
    biz = get_default_business(db)
    products = db.query(Product).filter(Product.business_id == biz.id).all()
    if len(products) < 3:
        existing_names = {p.name for p in products}
        p_data = [
            ("Urban Glide Sneaker", "Footwear", "₹4,999", "Ultralight responsive urban sneakers with breathable knit mesh and cushion tech.", True),
            ("Oversized Minimalist Tee", "Apparel", "₹1,499", "240 GSM heavyweight combed cotton oversized tee with minimalist Japanese aesthetic.", False),
            ("Summit Tech Jacket", "Outerwear", "₹6,499", "Water-repellent windbreaker jacket featuring concealed utility pockets and reflective accents.", False)
        ]
        for idx, (p_name, p_cat, p_price, p_desc, p_hero) in enumerate(p_data):
            if p_name not in existing_names:
                new_p = Product(
                    id=f"prod-00{idx+1}",
                    business_id=biz.id,
                    name=p_name,
                    category=p_cat,
                    price=p_price,
                    description=p_desc,
                    image_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
                    is_hero=p_hero
                )
                db.add(new_p)
        db.commit()
        products = db.query(Product).filter(Product.business_id == biz.id).all()

    return products

@router.post("/business/products", response_model=ProductResponse)
@router.post("/products", response_model=ProductResponse)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    biz = get_default_business(db)
    p = Product(
        id=f"prod_{int(time.time()*1000)}",
        business_id=biz.id,
        name=payload.name,
        category=payload.category,
        price=payload.price,
        description=payload.description,
        image_url=payload.image_url or "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.delete("/business/products/{id}")
@router.delete("/products/{id}")
def delete_product(id: str, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(p)
    db.commit()
    return {"status": "deleted", "id": id}


# Brand Profile
@router.get("/business/brand", response_model=BrandResponse)
@router.get("/brand", response_model=BrandResponse)
def get_brand_profile(db: Session = Depends(get_db)):
    biz = get_default_business(db)
    brand = db.query(BrandProfile).filter(BrandProfile.business_id == biz.id).first()
    if not brand:
        brand = BrandProfile(
            id=f"brand_{biz.id}",
            business_id=biz.id,
            tones_json='["Friendly", "Bold"]',
            colors_json='["#00F0FF", "#8B5CF6", "#05060A"]',
            tagline="Style that moves with you.",
            languages_json='["English", "Hinglish"]',
        )
        db.add(brand)
        db.commit()
    return BrandResponse(
        tones=brand.tones,
        colors=brand.colors,
        logo_url=brand.logo_url,
        tagline=brand.tagline,
        languages=brand.languages,
    )

@router.patch("/business/brand", response_model=BrandResponse)
@router.patch("/brand", response_model=BrandResponse)
def update_brand_profile(payload: BrandUpdate, db: Session = Depends(get_db)):
    biz = get_default_business(db)
    brand = db.query(BrandProfile).filter(BrandProfile.business_id == biz.id).first()
    if not brand:
        brand = BrandProfile(id=f"brand_{biz.id}", business_id=biz.id)
        db.add(brand)
    
    brand.tones_json = json.dumps(payload.tones)
    brand.colors_json = json.dumps(payload.colors)
    brand.tagline = payload.tagline
    brand.languages_json = json.dumps(payload.languages)
    if payload.logo_url:
        brand.logo_url = payload.logo_url
        
    db.commit()
    return BrandResponse(
        tones=brand.tones,
        colors=brand.colors,
        logo_url=brand.logo_url,
        tagline=brand.tagline,
        languages=brand.languages,
    )

# Audience Profile
@router.get("/business/audience", response_model=AudienceResponse)
@router.get("/audience", response_model=AudienceResponse)
def get_audience_profile(db: Session = Depends(get_db)):
    biz = get_default_business(db)
    aud = db.query(AudienceProfile).filter(AudienceProfile.business_id == biz.id).first()
    if not aud:
        aud = AudienceProfile(
            id=f"aud_{biz.id}",
            business_id=biz.id,
            age_ranges_json='["18-24", "25-34"]',
            locations_json='["City-Wide", "All India"]',
            types_json='["Young Professionals", "Shoppers"]',
            description="Young urban professionals looking for affordable streetwear.",
        )
        db.add(aud)
        db.commit()
    return AudienceResponse(
        age_ranges=aud.age_ranges,
        locations=aud.locations,
        types=aud.types,
        description=aud.description,
    )

@router.patch("/business/audience", response_model=AudienceResponse)
@router.patch("/audience", response_model=AudienceResponse)
def update_audience_profile(payload: AudienceUpdate, db: Session = Depends(get_db)):
    biz = get_default_business(db)
    aud = db.query(AudienceProfile).filter(AudienceProfile.business_id == biz.id).first()
    if not aud:
        aud = AudienceProfile(id=f"aud_{biz.id}", business_id=biz.id)
        db.add(aud)
    
    aud.age_ranges_json = json.dumps(payload.age_ranges)
    aud.locations_json = json.dumps(payload.locations)
    aud.types_json = json.dumps(payload.types)
    aud.description = payload.description
    db.commit()

    return AudienceResponse(
        age_ranges=aud.age_ranges,
        locations=aud.locations,
        types=aud.types,
        description=aud.description,
    )

# Goals
@router.get("/business/goals", response_model=GoalsResponse)
@router.get("/goals", response_model=GoalsResponse)
def get_goals(db: Session = Depends(get_db)):
    biz = get_default_business(db)
    g = db.query(MarketingGoal).filter(MarketingGoal.business_id == biz.id).first()
    if not g:
        g = MarketingGoal(
            id=f"goal_{biz.id}",
            business_id=biz.id,
            primary_goal="Promote Products",
            secondary_goals_json='["Grow Reach", "Increase Engagement"]',
        )
        db.add(g)
        db.commit()
    return GoalsResponse(
        primary_goal=g.primary_goal,
        secondary_goals=g.secondary_goals,
    )

@router.patch("/business/goals", response_model=GoalsResponse)
@router.patch("/goals", response_model=GoalsResponse)
def update_goals(payload: GoalsUpdate, db: Session = Depends(get_db)):
    biz = get_default_business(db)
    g = db.query(MarketingGoal).filter(MarketingGoal.business_id == biz.id).first()
    if not g:
        g = MarketingGoal(id=f"goal_{biz.id}", business_id=biz.id)
        db.add(g)
    g.primary_goal = payload.primary_goal
    g.secondary_goals_json = json.dumps(payload.secondary_goals)
    db.commit()
    return GoalsResponse(
        primary_goal=g.primary_goal,
        secondary_goals=g.secondary_goals,
    )

# Content Preferences
@router.get("/business/content-preferences", response_model=ContentPreferencesResponse)
@router.get("/content-preferences", response_model=ContentPreferencesResponse)
def get_content_preferences(db: Session = Depends(get_db)):
    biz = get_default_business(db)
    cp = db.query(ContentPreference).filter(ContentPreference.business_id == biz.id).first()
    if not cp:
        cp = ContentPreference(
            id=f"cp_{biz.id}",
            business_id=biz.id,
            frequency="3x per week",
            formats_json='["Reel", "Carousel", "Post"]',
            posting_time="Evening (18:00 - 21:00)",
            styles_json='["Product Showcase", "Behind the Scenes", "Educational"]',
        )
        db.add(cp)
        db.commit()
    return ContentPreferencesResponse(
        frequency=cp.frequency,
        formats=cp.formats,
        posting_time=cp.posting_time,
        styles=cp.styles,
    )

@router.patch("/business/content-preferences", response_model=ContentPreferencesResponse)
@router.patch("/content-preferences", response_model=ContentPreferencesResponse)
def update_content_preferences(payload: ContentPreferencesUpdate, db: Session = Depends(get_db)):
    biz = get_default_business(db)
    cp = db.query(ContentPreference).filter(ContentPreference.business_id == biz.id).first()
    if not cp:
        cp = ContentPreference(id=f"cp_{biz.id}", business_id=biz.id)
        db.add(cp)
    cp.frequency = payload.frequency
    cp.formats_json = json.dumps(payload.formats)
    cp.posting_time = payload.posting_time
    cp.styles_json = json.dumps(payload.styles)
    db.commit()
    return ContentPreferencesResponse(
        frequency=cp.frequency,
        formats=cp.formats,
        posting_time=cp.posting_time,
        styles=cp.styles,
    )

