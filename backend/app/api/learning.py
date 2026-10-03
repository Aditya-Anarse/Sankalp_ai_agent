import json
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..models.models import LearningInsight, Business, Campaign, ContentAsset, AnalyticsSnapshot
from ..api.auth import get_current_user
from ..agents.specialized import LearningAgent

router = APIRouter(prefix="/learning", tags=["Learning Center"])


@router.get("")
def get_learning_insights(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    business = db.query(Business).filter(Business.owner_id == current_user.id).first()
    if not business:
        business = db.query(Business).first()
    if not business:
        return []
    
    query = db.query(LearningInsight).filter(LearningInsight.business_id == business.id)
    if category:
        query = query.filter(LearningInsight.category == category)
        
    insights = query.order_by(LearningInsight.created_at.desc()).all()
    
    return [
        {
            "id": i.id,
            "campaign_id": i.campaign_id,
            "category": i.category,
            "insight": i.insight_text,
            "evidence": i.evidence or [],
            "recommendation": i.recommendation,
            "confidence_score": i.confidence_score,
            "is_active": i.is_applied,
            "created_at": i.created_at.isoformat() if i.created_at else None
        } for i in insights
    ]


@router.post("/analyze")
async def trigger_learning_analysis(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    business = db.query(Business).filter(Business.owner_id == current_user.id).first()
    if not business:
        business = db.query(Business).first()
    if not business:
        raise HTTPException(status_code=404, detail="No business configured yet. Complete business setup first.")
        
    # Gather actual published posts and telemetry snapshots
    snapshots = db.query(AnalyticsSnapshot).filter(AnalyticsSnapshot.business_id == business.id).all()
    published_assets = db.query(ContentAsset).filter(
        ContentAsset.business_id == business.id,
        ContentAsset.status == "published"
    ).all()

    if not snapshots and not published_assets:
        return {
            "status": "insufficient_data",
            "message": "Not enough performance data to generate learning insights.",
            "insights_generated": 0
        }

    campaign_data = []
    for asset in published_assets:
        # Match snapshot if available
        snap = next((s for s in snapshots if s.content_id == asset.id), None)
        campaign_data.append({
            "content_id": asset.id,
            "title": asset.title,
            "platform": asset.platform,
            "content_type": asset.content_type,
            "reach": snap.reach if snap else 0,
            "impressions": (snap.impressions or snap.views) if snap else 0,
            "engagement_rate": snap.engagement_rate if snap else 0.0,
            "likes": snap.likes if snap else 0,
        })

    if not campaign_data:
        return {
            "status": "insufficient_data",
            "message": "Not enough performance data to generate learning insights.",
            "insights_generated": 0
        }

    agent = LearningAgent()
    business_context = {
        "name": business.name,
        "industry": business.business_type
    }
    
    insights = await agent.execute(campaign_data, business_context)

    saved_insights = []
    for item in insights:
        db_insight = LearningInsight(
            id=f"insight_{uuid.uuid4().hex[:12]}",
            business_id=business.id,
            category=item.get("category", "Content Performance"),
            insight_text=item.get("insight_text") or item.get("insight", "Performance pattern observed"),
            evidence_json=json.dumps(item.get("evidence", [])),
            recommendation=item.get("recommendation", "Optimize format mix based on performance data."),
            confidence_score=item.get("confidence_score", 0.90),
            is_applied=True,
            created_at=datetime.utcnow()
        )
        db.add(db_insight)
        saved_insights.append(db_insight)
        
    db.commit()
    
    return {
        "status": "success",
        "message": f"Synthesized {len(saved_insights)} real learning insights from performance data.",
        "insights_generated": len(saved_insights)
    }
