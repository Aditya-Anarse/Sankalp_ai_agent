from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database.database import get_db
from ..models.models import ContentAsset, Campaign, Business
from ..api.auth import get_current_user

router = APIRouter(prefix="/calendar", tags=["Content Calendar"])


@router.get("")
def get_calendar_events(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    business = db.query(Business).filter(Business.owner_id == current_user.id).first()
    if not business:
        business = db.query(Business).first()
    if not business:
        return []
        
    # Only return content that is actually scheduled or published with a real timestamp
    posts = (
        db.query(ContentAsset)
        .filter(
            ContentAsset.business_id == business.id,
            (ContentAsset.scheduled_at != None) | (ContentAsset.published_at != None)
        )
        .order_by(ContentAsset.scheduled_at.asc())
        .all()
    )
    
    events = []
    for p in posts:
        event_time = p.scheduled_at or p.published_at
        if not event_time:
            continue
            
        events.append({
            "id": p.id,
            "campaign_id": p.campaign_id,
            "platform": p.platform,
            "content_type": p.content_type,
            "title": p.title,
            "caption": p.caption,
            "status": p.status,
            "quality_status": p.quality_status,
            "media_url": p.media_url,
            "scheduled_at": event_time.isoformat(),
            "date": event_time.strftime("%Y-%m-%d"),
            "time": event_time.strftime("%H:%M")
        })
        
    return events
