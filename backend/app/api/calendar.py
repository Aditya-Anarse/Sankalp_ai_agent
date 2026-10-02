from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from ..database.database import get_db
from ..models.models import ContentAsset, Campaign, Business, ScheduledPost
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
        
    posts = db.query(ContentAsset).join(Campaign).filter(Campaign.business_id == business.id).all()
    
    events = []
    base_time = datetime.utcnow()
    
    for idx, p in enumerate(posts):
        # Assign schedule if missing for calendar view
        sched_time = p.scheduled_at or (base_time + timedelta(days=idx+1, hours=18, minutes=30))
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
            "scheduled_at": sched_time.isoformat(),
            "date": sched_time.strftime("%Y-%m-%d"),
            "time": sched_time.strftime("%H:%M")
        })
        
    return events
