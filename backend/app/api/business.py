import json
import time
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.database import get_db
from ..models.models import (
    Business,
    Product,
    BrandProfile,
    AudienceProfile,
    MarketingGoal,
    ContentPreference,
    User,
)
from ..schemas.schemas import (
    BusinessCreate,
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
from .auth import get_optional_current_user

router = APIRouter(prefix="", tags=["Business & Onboarding"])


def get_current_business(db: Session, current_user: Optional[User] = None) -> Optional[Business]:
    if current_user:
        biz = db.query(Business).filter(Business.owner_id == current_user.id).first()
        if biz:
            return biz
    return db.query(Business).first()


# Business Endpoints
@router.get("/business", response_model=BusinessResponse)
def get_business(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No business configured yet."
        )
    return biz


@router.post("/business", response_model=BusinessResponse)
def create_business(
    payload: BusinessCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    owner_id = current_user.id if current_user else f"usr_{int(time.time()*1000)}"
    biz = Business(
        id=f"biz_{int(time.time()*1000)}",
        owner_id=owner_id,
        name=payload.name,
        business_type=payload.business_type,
        location=payload.location,
        description=payload.description,
        website=payload.website,
        is_onboarded=True,
    )
    db.add(biz)
    db.commit()
    db.refresh(biz)
    return biz


@router.patch("/business", response_model=BusinessResponse)
def update_business(
    payload: BusinessUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No business configured yet."
        )
    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(biz, key, val)
    db.commit()
    db.refresh(biz)
    return biz


# Products Endpoints
@router.get("/business/products", response_model=List[ProductResponse])
@router.get("/products", response_model=List[ProductResponse])
def list_products(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        return []
    return db.query(Product).filter(Product.business_id == biz.id).all()


@router.post("/business/products", response_model=ProductResponse)
@router.post("/products", response_model=ProductResponse)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=400, detail="No business configured yet. Complete business setup first.")

    p = Product(
        id=f"prod_{int(time.time()*1000)}",
        business_id=biz.id,
        name=payload.name,
        category=payload.category,
        price=payload.price,
        description=payload.description,
        image_url=payload.image_url,
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
def get_brand_profile(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
    brand = db.query(BrandProfile).filter(BrandProfile.business_id == biz.id).first()
    if not brand:
        return BrandResponse(
            tones=[],
            colors=[],
            logo_url=None,
            tagline="",
            languages=[],
        )
    return BrandResponse(
        tones=brand.tones,
        colors=brand.colors,
        logo_url=brand.logo_url,
        tagline=brand.tagline,
        languages=brand.languages,
    )


@router.patch("/business/brand", response_model=BrandResponse)
@router.patch("/brand", response_model=BrandResponse)
def update_brand_profile(
    payload: BrandUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
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
def get_audience_profile(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
    aud = db.query(AudienceProfile).filter(AudienceProfile.business_id == biz.id).first()
    if not aud:
        return AudienceResponse(
            age_ranges=[],
            locations=[],
            types=[],
            description="",
        )
    return AudienceResponse(
        age_ranges=aud.age_ranges,
        locations=aud.locations,
        types=aud.types,
        description=aud.description,
    )


@router.patch("/business/audience", response_model=AudienceResponse)
@router.patch("/audience", response_model=AudienceResponse)
def update_audience_profile(
    payload: AudienceUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
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
def get_goals(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
    g = db.query(MarketingGoal).filter(MarketingGoal.business_id == biz.id).first()
    if not g:
        return GoalsResponse(
            primary_goal="Product Promotion",
            secondary_goals=[],
        )
    return GoalsResponse(
        primary_goal=g.primary_goal,
        secondary_goals=g.secondary_goals,
    )


@router.patch("/business/goals", response_model=GoalsResponse)
@router.patch("/goals", response_model=GoalsResponse)
def update_goals(
    payload: GoalsUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
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
def get_content_preferences(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
    cp = db.query(ContentPreference).filter(ContentPreference.business_id == biz.id).first()
    if not cp:
        return ContentPreferencesResponse(
            frequency="3x per week",
            formats=["Reel", "Carousel", "Post"],
            posting_time="18:00 - 20:00",
            styles=[],
        )
    return ContentPreferencesResponse(
        frequency=cp.frequency,
        formats=cp.formats,
        posting_time=cp.posting_time,
        styles=cp.styles,
    )


@router.patch("/business/content-preferences", response_model=ContentPreferencesResponse)
@router.patch("/content-preferences", response_model=ContentPreferencesResponse)
def update_content_preferences(
    payload: ContentPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    biz = get_current_business(db, current_user)
    if not biz:
        raise HTTPException(status_code=404, detail="No business configured yet.")
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
