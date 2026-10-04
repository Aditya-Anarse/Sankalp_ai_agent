from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from ..scheduler.service import (
    get_scheduler_diagnostics,
    process_due_scheduled_posts,
)

router = APIRouter(prefix="/scheduler", tags=["Scheduler Diagnostics"])


@router.get("/status")
def get_status() -> Dict[str, Any]:
    """Returns safe operational metrics and status about the background scheduler."""
    return get_scheduler_diagnostics()


@router.post("/trigger")
async def trigger_due_posts() -> Dict[str, Any]:
    """Manually triggers evaluation of all due scheduled content assets."""
    dispatched = await process_due_scheduled_posts()
    return {
        "status": "triggered",
        "dispatched_count": dispatched,
        "message": f"Processed due queue. Dispatched {dispatched} publishing task(s).",
    }
