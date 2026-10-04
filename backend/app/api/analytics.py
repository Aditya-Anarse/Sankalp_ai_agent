import uuid
import logging
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx

from ..database.database import get_db
from ..models.models import AnalyticsSnapshot, Business, ContentAsset, Campaign, SocialAccount, PublicationLog
from ..api.auth import get_current_user
from ..core.config import settings

logger = logging.getLogger("sankalp.analytics")

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
    
    snapshot = db.query(AnalyticsSnapshot).filter(AnalyticsSnapshot.content_id == content_id).order_by(AnalyticsSnapshot.captured_at.desc()).first()
    
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


@router.post("/sync")
async def sync_platform_analytics(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Synchronizes actual performance metrics from connected social platforms (Meta Graph API)
    for all published posts, creating timestamped AnalyticsSnapshot audit records.
    Never invents metrics.
    """
    business = db.query(Business).filter(Business.owner_id == current_user.id).first()
    if not business:
        business = db.query(Business).first()
    if not business:
        raise HTTPException(status_code=404, detail="No business workspace found.")

    # Find connected social account
    social_acc = db.query(SocialAccount).filter(
        SocialAccount.business_id == business.id,
        SocialAccount.platform == "instagram",
        SocialAccount.is_connected == True
    ).first()

    if not social_acc or not social_acc.access_token:
        return {
            "status": "not_connected",
            "message": "No verified Instagram account connected. Connect an account to synchronize live metrics.",
            "synced_count": 0,
            "posts": []
        }

    # Query published assets
    published_assets = db.query(ContentAsset).filter(
        ContentAsset.business_id == business.id,
        ContentAsset.status == "published"
    ).all()

    if not published_assets:
        return {
            "status": "no_published_content",
            "message": "No published content assets found to synchronize.",
            "synced_count": 0,
            "posts": []
        }

    token = social_acc.access_token
    api_v = settings.INSTAGRAM_API_VERSION or "v21.0"
    synced_results = []

    async with httpx.AsyncClient(timeout=20.0) as client:
        for asset in published_assets:
            # Look up media_id from PublicationLog
            pub_log = db.query(PublicationLog).filter(
                PublicationLog.content_asset_id == asset.id,
                PublicationLog.status == "published",
                PublicationLog.media_id != None
            ).order_by(PublicationLog.attempted_at.desc()).first()

            media_id = pub_log.media_id if pub_log else None
            likes = 0
            comments = 0
            reach = 0
            impressions = 0
            saves = 0
            insights_note = None

            if media_id:
                # 1. Fetch likes and comments
                try:
                    m_resp = await client.get(
                        f"https://graph.instagram.com/{api_v}/{media_id}",
                        params={"fields": "id,like_count,comments_count,timestamp", "access_token": token}
                    )
                    if m_resp.status_code == 200:
                        m_data = m_resp.json()
                        likes = m_data.get("like_count", 0)
                        comments = m_data.get("comments_count", 0)
                except Exception as ex:
                    logger.warning(f"Error fetching basic metrics for media {media_id}: {ex}")

                # 2. Fetch insights (reach, impressions, saved) if permitted
                try:
                    ins_resp = await client.get(
                        f"https://graph.instagram.com/{api_v}/{media_id}/insights",
                        params={"metric": "impressions,reach,saved", "access_token": token}
                    )
                    if ins_resp.status_code == 200:
                        ins_data = ins_resp.json().get("data", [])
                        for item in ins_data:
                            name = item.get("name")
                            val = 0
                            values = item.get("values", [])
                            if values:
                                val = values[0].get("value", 0)
                            if name == "impressions":
                                impressions = val
                            elif name == "reach":
                                reach = val
                            elif name == "saved":
                                saves = val
                        insights_note = "Synchronized via Meta Graph API insights"
                    else:
                        insights_note = "Basic counts synchronized; insights require instagram_manage_insights permission"
                except Exception as ex:
                    insights_note = f"Insights query notice: {str(ex)}"
            else:
                insights_note = "No external media ID associated with this asset"

            engagement_rate = round(((likes + comments) / max(impressions, 1)) * 100, 2) if impressions > 0 else 0.0

            # Store snapshot
            snapshot = AnalyticsSnapshot(
                id=f"snap_{uuid.uuid4().hex[:12]}",
                business_id=business.id,
                content_id=asset.id,
                platform=asset.platform or "instagram",
                views=impressions,
                impressions=impressions,
                reach=reach,
                likes=likes,
                comments=comments,
                shares=0,
                saves=saves,
                engagement_rate=engagement_rate,
                captured_at=datetime.utcnow()
            )
            db.add(snapshot)
            synced_results.append({
                "asset_id": asset.id,
                "title": asset.title,
                "media_id": media_id,
                "likes": likes,
                "comments": comments,
                "reach": reach,
                "impressions": impressions,
                "saves": saves,
                "engagement_rate": engagement_rate,
                "insights_note": insights_note
            })

        db.commit()

    return {
        "status": "success",
        "message": f"Successfully synchronized analytics for {len(synced_results)} published post(s).",
        "synced_count": len(synced_results),
        "posts": synced_results
    }
