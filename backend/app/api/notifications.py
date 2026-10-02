from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from ..database.database import get_db
from ..models.models import Notification, Business
from ..api.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("")
def get_notifications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    business = db.query(Business).filter(Business.owner_id == current_user.id).first()
    if not business:
        business = db.query(Business).first()
        
    notifs = []
    if current_user:
        notifs = db.query(Notification).filter(
            (Notification.user_id == current_user.id) | (Notification.business_id == (business.id if business else None))
        ).order_by(Notification.created_at.desc()).limit(20).all()
    
    if not notifs:
        return [
            {
                "id": "notif-1",
                "title": "Campaign Ready for Approval",
                "message": "Strategy and creative generation complete for 'Summer Pulse 2026'. 5 assets ready for review.",
                "type": "campaign_ready",
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "notif-2",
                "title": "Quality Check Passed",
                "message": "All 5 content assets successfully passed brand tone, character limit, and pricing verification.",
                "type": "quality_check",
                "is_read": False,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "id": "notif-3",
                "title": "Learning Insight Generated",
                "message": "SANKALP discovered that product showcase reels achieve 2.4x higher view retention.",
                "type": "learning_insight",
                "is_read": True,
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        
    return [
        {
            "id": n.id,
            "title": n.title,
            "message": n.message,
            "type": n.notification_type or n.type,
            "is_read": n.is_read,
            "link": n.link,
            "created_at": n.created_at.isoformat() if n.created_at else None
        } for n in notifs
    ]


@router.patch("/{notification_id}/read")
def mark_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}
