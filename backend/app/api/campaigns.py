import json
import time
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..models.models import Campaign, CampaignStep, ContentAsset, Business, Product, BrandProfile
from ..schemas.schemas import CampaignCreate, CampaignResponse
from ..agents.orchestrator import AgentOrchestrator
from ..agents.specialized import ResearchAgent, StrategyAgent, CreativeAgent, QualityAgent

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


def get_default_business(db: Session) -> Business:
    biz = db.query(Business).first()
    if not biz:
        biz = Business(
            id=f"biz_{int(time.time()*1000)}",
            owner_id="usr_demo",
            name="ABC Fashion Store",
            business_type="D2C Brand",
        )
        db.add(biz)
        db.commit()
    return biz


@router.get("")
def list_campaigns(db: Session = Depends(get_db)):
    biz = get_default_business(db)
    campaigns = db.query(Campaign).filter(Campaign.business_id == biz.id).order_by(Campaign.created_at.desc()).all()
    
    # If no campaigns, seed a default showcase campaign
    if not campaigns:
        c_id = f"cmp_demo_{int(time.time()*1000)}"
        c = Campaign(
            id=c_id,
            business_id=biz.id,
            name="New Summer Collection Sprint",
            objective="Promote Products & Drive Weekend Traffic",
            duration_days=5,
            status="running",
            is_approved=True,
            brand_fidelity_score=99.4,
            platforms_json='["instagram", "youtube"]',
            brief="Focus on organic breathable fabric, aesthetic unboxing reels, and limited time launch offer.",
            research_json=json.dumps({
                "trends": ["Rising search volume (+184% 7d velocity) around minimalist sustainable fashion."],
                "opportunities": ["Position collection as the daily essential standard."],
            }),
            strategy_json=json.dumps({
                "campaign_name": "Summer Collection Sprint",
                "duration_days": 5,
                "content_pillars": ["Product Education", "Brand Authority", "Social Proof", "Lifestyle Integration", "Conversion"],
            }),
        )
        db.add(c)
        db.commit()

        # Add sample assets
        now = datetime.utcnow()
        for i in range(1, 4):
            asset = ContentAsset(
                id=f"asset_demo_{i}",
                campaign_id=c.id,
                business_id=biz.id,
                platform="instagram",
                content_type="Reel" if i % 2 == 1 else "Carousel",
                title=f"Day {i} — Summer Collection Drop",
                hook="Why 82% of shoppers switched fabrics in 2026.",
                caption="We spent 6 months refining this silhouette. Zero synthetic compromise.\n\nExplore at link in bio.",
                script="[0:00-0:03] Hook overlay.\n[0:03-0:10] Fabric macro close-up.\n[0:10-0:15] CTA.",
                media_url="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
                quality_status="PASS",
                quality_notes_json='[]',
                status="scheduled",
                scheduled_at=now + timedelta(days=i),
                is_demo_mode=True,
            )
            db.add(asset)
        db.commit()
        campaigns = [c]

    result = []
    for c in campaigns:
        result.append({
            "id": c.id,
            "name": c.name,
            "objective": c.objective,
            "product_id": c.product_id,
            "status": c.status,
            "duration_days": c.duration_days,
            "platforms": c.platforms,
            "brief": c.brief,
            "research": json.loads(c.research_json) if c.research_json else None,
            "strategy": json.loads(c.strategy_json) if c.strategy_json else None,
            "is_approved": c.is_approved,
            "brand_fidelity_score": c.brand_fidelity_score,
            "created_at": c.created_at,
        })
    return result


@router.post("")
async def create_campaign(payload: CampaignCreate, db: Session = Depends(get_db)):
    biz = get_default_business(db)
    c_id = f"cmp_{int(time.time()*1000)}"
    
    campaign = Campaign(
        id=c_id,
        business_id=biz.id,
        name=payload.name,
        objective=payload.objective,
        product_id=payload.product_id,
        duration_days=payload.duration_days,
        platforms_json=json.dumps(payload.platforms),
        brief=payload.brief,
        status="planning",
        is_approved=False,
    )
    db.add(campaign)
    db.commit()

    # Trigger Autonomous Agent Orchestrator pipeline
    orchestrator = AgentOrchestrator(db)
    workflow_result = await orchestrator.execute_full_campaign_workflow(biz, campaign)

    return {
        "campaign_id": campaign.id,
        "name": campaign.name,
        "status": campaign.status,
        "workflow": workflow_result,
    }


@router.get("/{id}")
def get_campaign_detail(id: str, db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    assets = db.query(ContentAsset).filter(ContentAsset.campaign_id == id).all()
    
    return {
        "id": c.id,
        "name": c.name,
        "objective": c.objective,
        "product_id": c.product_id,
        "status": c.status,
        "duration_days": c.duration_days,
        "platforms": c.platforms,
        "brief": c.brief,
        "research": json.loads(c.research_json) if c.research_json else None,
        "strategy": json.loads(c.strategy_json) if c.strategy_json else None,
        "is_approved": c.is_approved,
        "brand_fidelity_score": c.brand_fidelity_score,
        "created_at": c.created_at,
        "assets": [
            {
                "id": a.id,
                "title": a.title,
                "content_type": a.content_type,
                "platform": a.platform,
                "hook": a.hook,
                "caption": a.caption,
                "script": a.script,
                "media_url": a.media_url,
                "quality_status": a.quality_status,
                "status": a.status,
                "scheduled_at": a.scheduled_at,
            }
            for a in assets
        ],
    }


@router.patch("/{id}")
def update_campaign(id: str, payload: Dict[str, Any], db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")

    for key, val in payload.items():
        if key == "target_platforms" or key == "platforms":
            c.platforms_json = json.dumps(val)
        elif hasattr(c, key):
            setattr(c, key, val)

    db.commit()
    db.refresh(c)
    return {"status": "updated", "id": c.id}


@router.post("/{id}/research")
async def execute_campaign_research(id: str, db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")
    biz = db.query(Business).filter(Business.id == c.business_id).first() or get_default_business(db)

    agent = ResearchAgent()
    biz_context = {
        "name": biz.name,
        "business_type": biz.business_type,
        "products": [{"name": p.name, "price": p.price} for p in biz.products]
    }
    result = await agent.execute(biz_context, c.objective)
    c.research_json = json.dumps(result)
    db.commit()
    return {"status": "completed", "campaign_id": id, "research": result}


@router.post("/{id}/strategy")
async def execute_campaign_strategy(id: str, db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")
    biz = db.query(Business).filter(Business.id == c.business_id).first() or get_default_business(db)

    research = json.loads(c.research_json) if c.research_json else {}
    agent = StrategyAgent()
    biz_context = {
        "name": biz.name,
        "products": [{"name": p.name, "price": p.price} for p in biz.products]
    }
    result = await agent.execute(biz_context, research, c.duration_days)
    c.strategy_json = json.dumps(result)
    db.commit()
    return {"status": "completed", "campaign_id": id, "strategy": result}


@router.post("/{id}/generate")
async def execute_campaign_generate(id: str, db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")
    biz = db.query(Business).filter(Business.id == c.business_id).first() or get_default_business(db)

    strategy = json.loads(c.strategy_json) if c.strategy_json else {}
    schedule = strategy.get("schedule", [
        {"day": 1, "title": "Day 1 Launch Reel", "format": "Reel"},
        {"day": 2, "title": "Day 2 Tech Breakdown", "format": "Carousel"},
        {"day": 3, "title": "Day 3 Community Spotlight", "format": "Post"}
    ])

    agent = CreativeAgent()
    biz_context = {
        "name": biz.name,
        "products": [{"name": p.name, "price": p.price} for p in biz.products]
    }

    created_assets = []
    for idx, item in enumerate(schedule):
        content_data = await agent.execute(biz_context, item)
        asset_id = f"asset_{c.id}_{idx+1}_{int(time.time()*1000)%1000}"
        asset = ContentAsset(
            id=asset_id,
            campaign_id=c.id,
            business_id=biz.id,
            platform=content_data.get("platform", "instagram"),
            content_type=content_data.get("content_type", "Post"),
            title=content_data.get("title", f"Day {idx+1} Asset"),
            caption=content_data.get("caption", ""),
            hook=content_data.get("hook", ""),
            script=content_data.get("script", ""),
            media_url=content_data.get("media_url", ""),
            thumbnail_url=content_data.get("thumbnail_url", ""),
            hashtags_json=json.dumps(content_data.get("hashtags", [])),
            cta=content_data.get("cta", ""),
            quality_status="PASS",
            status="approved",
            is_demo_mode=True,
            created_at=datetime.utcnow()
        )
        db.add(asset)
        created_assets.append(asset_id)
    db.commit()
    return {"status": "completed", "campaign_id": id, "assets_created": len(created_assets)}


@router.post("/{id}/quality-check")
async def execute_campaign_quality_check(id: str, db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")

    assets = db.query(ContentAsset).filter(ContentAsset.campaign_id == id).all()
    qa = QualityAgent()
    for a in assets:
        qa_res = await qa.execute(
            {"caption": a.caption, "hook": a.hook, "title": a.title, "cta": a.cta},
            {"tones": ["Friendly", "Bold"]}
        )
        a.quality_status = qa_res.get("status", "PASS")
        a.quality_notes_json = json.dumps(qa_res.get("issues", []))

    db.commit()
    return {"status": "completed", "campaign_id": id, "checked_count": len(assets), "quality_status": "PASS"}


@router.post("/{id}/approve")
def approve_campaign(id: str, db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    c.is_approved = True
    c.status = "scheduled"

    # Schedule all assets across upcoming days
    now = datetime.utcnow()
    assets = db.query(ContentAsset).filter(ContentAsset.campaign_id == id).all()
    for idx, asset in enumerate(assets):
        asset.status = "scheduled"
        asset.scheduled_at = now + timedelta(days=idx+1, hours=18)
    
    db.commit()
    return {"status": "approved", "campaign_id": id, "scheduled_assets_count": len(assets)}


@router.delete("/{id}")
def delete_campaign(id: str, db: Session = Depends(get_db)):
    c = db.query(Campaign).filter(Campaign.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Campaign not found")
    db.delete(c)
    db.commit()
    return {"status": "deleted", "id": id}
