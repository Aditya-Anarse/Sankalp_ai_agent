from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from ..database.database import get_db
from ..models.models import AnalyticsSnapshot, Business, ContentAsset, Campaign
from ..api.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("")
def get_analytics(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    business = db.query(Business).filter(Business.owner_id == current_user.id).first()
    if not business:
        business = db.query(Business).first()
        
    if not business:
        return {
            "has_real_data": False,
            "message": "No business configured yet. Complete business setup to view analytics.",
            "metrics": {
                "total_reach": 0,
                "total_impressions": 0,
                "total_engagement": 0,
                "engagement_rate": 0.0,
                "follower_growth": 0,
                "total_posts": 0
            },
            "timeline": [],
            "top_performing_content": []
        }
    
    # Query real snapshots
    since_date = datetime.utcnow() - timedelta(days=days)
    snapshots = db.query(AnalyticsSnapshot).filter(
        AnalyticsSnapshot.business_id == business.id,
        AnalyticsSnapshot.captured_at >= since_date
    ).order_by(AnalyticsSnapshot.captured_at.asc()).all()

    total_reach = sum(s.reach for s in snapshots) if snapshots else 0
    total_impressions = sum(s.impressions or s.views for s in snapshots) if snapshots else 0
    total_engagement = sum(s.likes + s.comments + s.shares + s.saves for s in snapshots) if snapshots else 0
    engagement_rate = (total_engagement / max(total_impressions, 1)) * 100 if total_impressions > 0 else 0.0

    posts = (
        db.query(ContentAsset)
        .filter(ContentAsset.business_id == business.id, ContentAsset.status == "published")
        .all()
    )

    has_real_data = len(snapshots) > 0

    return {
        "has_real_data": has_real_data,
        "message": "Analytics synchronized with platform APIs." if has_real_data else "No analytics data yet. Publish content to start receiving real analytics.",
        "metrics": {
            "total_reach": total_reach,
            "total_impressions": total_impressions,
            "total_engagement": total_engagement,
            "engagement_rate": round(engagement_rate, 2),
            "follower_growth": sum(s.followers_count for s in snapshots) if snapshots else 0,
            "total_posts": len(posts)
        },
        "timeline": [
            {
                "date": s.captured_at.strftime("%Y-%m-%d"),
                "reach": s.reach,
                "engagement": s.engagement_rate,
                "impressions": s.impressions or s.views
            } for s in snapshots
        ],
        "top_performing_content": [
            {
                "id": p.id,
                "platform": p.platform,
                "content_type": p.content_type,
                "title": p.title,
                "caption": (p.caption[:80] + "...") if p.caption and len(p.caption) > 80 else (p.caption or ""),
                "status": p.status
            } for p in posts[:5]
        ]
    }


@router.get("/content/{content_id}")
def get_content_analytics(
    content_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    content = db.query(ContentAsset).filter(ContentAsset.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content asset not found")
    
    snapshot = db.query(AnalyticsSnapshot).filter(AnalyticsSnapshot.content_id == content_id).first()
    
    if not snapshot:
        return {
            "content_id": content_id,
            "has_real_data": False,
            "message": "No analytics data yet for this post.",
            "metrics": {
                "reach": 0,
                "impressions": 0,
                "likes": 0,
                "comments": 0,
                "shares": 0,
                "saves": 0,
                "clicks": 0,
                "watch_time_seconds": 0.0
            }
        }
    
    return {
        "content_id": content_id,
        "has_real_data": True,
        "metrics": {
            "reach": snapshot.reach,
            "impressions": snapshot.impressions or snapshot.views,
            "likes": snapshot.likes,
            "comments": snapshot.comments,
            "shares": snapshot.shares,
            "saves": snapshot.saves,
            "clicks": snapshot.clicks,
            "watch_time_seconds": snapshot.watch_time_seconds
        }
    }
