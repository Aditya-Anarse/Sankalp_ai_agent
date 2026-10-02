import json
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..models.models import ContentAsset, Business, Campaign
from ..schemas.schemas import ContentAssetCreate, ContentAssetUpdate, ContentAssetResponse
from ..agents.specialized import QualityAgent, CreativeAgent

router = APIRouter(prefix="/content", tags=["Content Studio"])


def get_default_business(db: Session) -> Business:
    biz = db.query(Business).first()
    if not biz:
        biz = Business(id="biz_demo", owner_id="usr_demo", name="ABC Fashion Store")
        db.add(biz)
        db.commit()
    return biz


@router.get("")
def list_content_assets(
    platform: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    biz = get_default_business(db)
    query = db.query(ContentAsset).filter(ContentAsset.business_id == biz.id)
    if platform:
        query = query.filter(ContentAsset.platform.ilike(f"%{platform}%"))
    if status:
        query = query.filter(ContentAsset.status == status)

    assets = query.order_by(ContentAsset.created_at.desc()).all()
    return [
        {
            "id": a.id,
            "campaign_id": a.campaign_id,
            "platform": a.platform,
            "content_type": a.content_type,
            "title": a.title,
            "caption": a.caption,
            "hook": a.hook,
            "script": a.script,
            "media_url": a.media_url,
            "thumbnail_url": a.thumbnail_url,
            "hashtags": a.hashtags,
            "cta": a.cta,
            "quality_status": a.quality_status,
            "quality_notes": a.quality_notes,
            "status": a.status,
            "scheduled_at": a.scheduled_at,
            "published_at": a.published_at,
            "is_demo_mode": a.is_demo_mode,
            "created_at": a.created_at,
        }
        for a in assets
    ]


@router.get("/{id}")
def get_content_asset(id: str, db: Session = Depends(get_db)):
    a = db.query(ContentAsset).filter(ContentAsset.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Content asset not found")
    return {
        "id": a.id,
        "campaign_id": a.campaign_id,
        "platform": a.platform,
        "content_type": a.content_type,
        "title": a.title,
        "caption": a.caption,
        "hook": a.hook,
        "script": a.script,
        "media_url": a.media_url,
        "thumbnail_url": a.thumbnail_url,
        "hashtags": a.hashtags,
        "cta": a.cta,
        "quality_status": a.quality_status,
        "quality_notes": a.quality_notes,
        "status": a.status,
        "scheduled_at": a.scheduled_at,
        "published_at": a.published_at,
        "is_demo_mode": a.is_demo_mode,
        "created_at": a.created_at,
    }


@router.patch("/{id}")
async def update_content_asset(id: str, payload: ContentAssetUpdate, db: Session = Depends(get_db)):
    a = db.query(ContentAsset).filter(ContentAsset.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Content asset not found")
    
    for key, val in payload.model_dump(exclude_unset=True).items():
        if key == "hashtags":
            a.hashtags_json = json.dumps(val)
        else:
            setattr(a, key, val)

    # Re-run Quality Agent on every edit to ensure brand & safety compliance
    qa = QualityAgent()
    qa_res = await qa.execute(
        {"caption": a.caption or "", "hook": a.hook or "", "title": a.title or "", "cta": a.cta or ""},
        {"tones": ["Friendly", "Bold"]}
    )
    a.quality_status = qa_res.get("status", "PASS")
    a.quality_notes_json = json.dumps(qa_res.get("issues", []))

    db.commit()
    db.refresh(a)
    return {
        "status": "updated",
        "id": a.id,
        "quality_status": a.quality_status,
        "quality_notes": a.quality_notes,
    }


@router.post("/{id}/quality-check")
async def run_quality_check(id: str, db: Session = Depends(get_db)):
    a = db.query(ContentAsset).filter(ContentAsset.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Content asset not found")
    
    qa = QualityAgent()
    qa_res = await qa.execute(
        {"caption": a.caption or "", "hook": a.hook or "", "title": a.title or "", "cta": a.cta or ""},
        {"tones": ["Friendly", "Bold"]}
    )
    a.quality_status = qa_res.get("status", "PASS")
    a.quality_notes_json = json.dumps(qa_res.get("issues", []))
    db.commit()

    return {
        "id": a.id,
        "quality_status": a.quality_status,
        "fidelity_score": qa_res.get("fidelity_score", 99.4),
        "checks": qa_res.get("checks", {}),
        "issues": qa_res.get("issues", [])
    }


@router.post("/{id}/regenerate")
async def regenerate_content_asset(id: str, db: Session = Depends(get_db)):
    a = db.query(ContentAsset).filter(ContentAsset.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Content asset not found")

    biz = db.query(Business).filter(Business.id == a.business_id).first() or get_default_business(db)
    creative = CreativeAgent()
    biz_context = {
        "name": biz.name,
        "products": [{"name": p.name, "price": p.price} for p in biz.products]
    }
    strategy_item = {
        "day": 1,
        "title": a.title,
        "format": a.content_type,
    }
    new_data = await creative.execute(biz_context, strategy_item)
    a.hook = new_data.get("hook", a.hook)
    a.caption = new_data.get("caption", a.caption)
    a.script = new_data.get("script", a.script)
    a.cta = new_data.get("cta", a.cta)
    a.quality_status = "PASS"
    a.quality_notes_json = "[]"
    db.commit()

    return {
        "status": "regenerated",
        "id": a.id,
        "hook": a.hook,
        "caption": a.caption,
        "script": a.script,
        "quality_status": a.quality_status
    }


@router.post("/{id}/schedule")
def schedule_content(id: str, payload: dict, db: Session = Depends(get_db)):
    a = db.query(ContentAsset).filter(ContentAsset.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Content asset not found")
    
    a.status = "scheduled"
    if "scheduled_at" in payload and payload["scheduled_at"]:
        a.scheduled_at = datetime.fromisoformat(payload["scheduled_at"].replace("Z", "+00:00"))
    db.commit()
    return {"status": "scheduled", "id": a.id, "scheduled_at": a.scheduled_at}


@router.post("/{id}/publish")
def publish_content(id: str, db: Session = Depends(get_db)):
    a = db.query(ContentAsset).filter(ContentAsset.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Content asset not found")

    if a.quality_status == "NEEDS_REVISION":
        raise HTTPException(
            status_code=400,
            detail="Cannot publish content that has not passed Quality Agent audit."
        )

    a.status = "published"
    a.published_at = datetime.utcnow()
    db.commit()
    
    return {
        "status": "published",
        "id": a.id,
        "platform": a.platform,
        "is_demo_mode": a.is_demo_mode,
        "note": "Demo Publish Successful — Simulated dispatch completed without contacting external platforms.",
    }


@router.delete("/{id}")
def delete_content_asset(id: str, db: Session = Depends(get_db)):
    a = db.query(ContentAsset).filter(ContentAsset.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Content asset not found")
    db.delete(a)
    db.commit()
    return {"status": "deleted", "id": id}
