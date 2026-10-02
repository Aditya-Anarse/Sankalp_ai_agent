from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

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
            "demo_mode": True,
            "has_real_data": False,
            "message": "No performance data available yet.",
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
    
    # Query snapshots
    since_date = datetime.utcnow() - timedelta(days=days)
    snapshots = db.query(AnalyticsSnapshot).filter(
        AnalyticsSnapshot.business_id == business.id,
        AnalyticsSnapshot.captured_at >= since_date
    ).order_by(AnalyticsSnapshot.captured_at.asc()).all()

    total_reach = sum(s.reach for s in snapshots) if snapshots else 0
    total_impressions = sum(s.impressions or s.views for s in snapshots) if snapshots else 0
    total_engagement = sum(s.likes + s.comments + s.shares + s.saves for s in snapshots) if snapshots else 0
    engagement_rate = (total_engagement / max(total_impressions, 1)) * 100 if snapshots else 0.0

    posts = db.query(ContentAsset).join(Campaign).filter(Campaign.business_id == business.id).all()

    # Determine if real data exists
    has_real_data = len(snapshots) > 0 and any((s.impressions or s.views) > 0 for s in snapshots)

    return {
        "demo_mode": not has_real_data,
        "has_real_data": has_real_data,
        "message": "Real telemetry synchronized" if has_real_data else "Demo Mode: Connect active social accounts or schedule posts to accumulate real-time telemetry.",
        "metrics": {
            "total_reach": total_reach if has_real_data else 48200,
            "total_impressions": total_impressions if has_real_data else 64500,
            "total_engagement": total_engagement if has_real_data else 5830,
            "engagement_rate": round(engagement_rate if has_real_data else 9.04, 2),
            "follower_growth": 340 if not has_real_data else sum(s.followers_count for s in snapshots),
            "total_posts": len(posts) if posts else 5
        },
        "timeline": [
            {
                "date": s.captured_at.strftime("%Y-%m-%d"),
                "reach": s.reach,
                "engagement": s.engagement_rate,
                "impressions": s.impressions or s.views
            } for s in snapshots
        ] if has_real_data else [
            {"date": (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d"), "reach": 1200 + i*150, "engagement": 8.2 + (i % 3)*0.5, "impressions": 1800 + i*220}
            for i in range(7, 0, -1)
        ],
        "top_performing_content": [
            {
                "id": p.id,
                "platform": p.platform,
                "content_type": p.content_type,
                "title": p.title,
                "caption": p.caption[:80] + "..." if len(p.caption or "") > 80 else p.caption,
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
            "demo_mode": True,
            "has_real_data": False,
            "message": "No real performance data available yet. Item is either in draft or simulation mode.",
            "metrics": {
                "reach": 14200,
                "impressions": 18500,
                "likes": 1240,
                "comments": 94,
                "shares": 312,
                "saves": 450,
                "clicks": 188,
                "watch_time_seconds": 14.2
            }
        }
    
    return {
        "content_id": content_id,
        "demo_mode": False,
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
