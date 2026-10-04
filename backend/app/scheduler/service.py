import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.date import DateTrigger

from ..database.database import SessionLocal
from ..models.models import ContentAsset, SocialAccount, PublicationLog, PublishedPost
from ..agents.specialized import PublisherAgent

logger = logging.getLogger("sankalp.scheduler")

_scheduler: Optional[AsyncIOScheduler] = None
_lock = asyncio.Lock()


def get_scheduler() -> AsyncIOScheduler:
    """Returns the singleton AsyncIOScheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = AsyncIOScheduler(timezone="UTC")
    return _scheduler


async def publish_asset_job(asset_id: str) -> Dict[str, Any]:
    """
    Executes publication for a specific scheduled ContentAsset.
    Guarantees idempotency and prevents duplicate publication.
    """
    db = SessionLocal()
    try:
        asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
        if not asset:
            logger.warning(f"Scheduler job aborted: Asset '{asset_id}' not found.")
            return {"status": "not_found", "asset_id": asset_id}

        # Prevent duplicate publication
        if asset.status == "published":
            logger.info(f"Scheduler: Asset '{asset_id}' is already published. Skipping.")
            return {"status": "already_published", "asset_id": asset_id}

        if asset.status == "publishing":
            logger.info(f"Scheduler: Asset '{asset_id}' is currently publishing. Skipping duplicate run.")
            return {"status": "already_running", "asset_id": asset_id}

        # Mark publishing state atomically
        asset.status = "publishing"
        db.commit()

        # Check QA status
        if asset.quality_status == "NEEDS_REVISION":
            asset.status = "failed"
            asset.publish_error = "Asset failed Quality Audit. Revisions required before automated publishing."
            asset.publish_error_code = "QA_FAILED"
            db.commit()
            return {"status": "failed", "error": asset.publish_error}

        # Check social account connection
        platform_name = (asset.platform or "instagram").lower()
        social_acc = (
            db.query(SocialAccount)
            .filter(
                SocialAccount.business_id == asset.business_id,
                SocialAccount.platform == platform_name,
                SocialAccount.is_connected == True,
            )
            .first()
        )

        if not social_acc or not social_acc.access_token:
            asset.status = "failed"
            asset.publish_error = f"{asset.platform.capitalize()} is not connected. Connect an authenticated account with publish permissions first."
            asset.publish_error_code = "NOT_CONNECTED"
            db.commit()
            return {"status": "failed", "error": asset.publish_error}

        # Check token expiration
        if social_acc.token_expires_at:
            exp = (
                social_acc.token_expires_at.replace(tzinfo=None)
                if social_acc.token_expires_at.tzinfo
                else social_acc.token_expires_at
            )
            if exp <= datetime.utcnow():
                asset.status = "failed"
                asset.publish_error = "Social account access token has expired. Please re-authenticate."
                asset.publish_error_code = "TOKEN_EXPIRED"
                db.commit()
                return {"status": "failed", "error": asset.publish_error}

        # Dispatch publication
        publisher = PublisherAgent()
        platform_conn = {
            "access_token": social_acc.access_token,
            "account_id": social_acc.account_id,
            "token_expires_at": social_acc.token_expires_at,
        }
        content_item = {
            "content_asset_id": asset.id,
            "content_type": asset.content_type or "Post",
            "platform": asset.platform,
            "media_url": asset.media_url or "",
            "caption": asset.caption or asset.title or "",
            "title": asset.title or "",
        }

        pub_res = await publisher.execute(content_item, platform_conn)

        if pub_res.get("status") == "PUBLISHED":
            permalink = pub_res.get("permalink") or pub_res.get("post_url")
            media_id = pub_res.get("media_id")
            container_id = pub_res.get("container_id")

            asset.status = "published"
            asset.published_at = datetime.utcnow()
            asset.published_url = permalink
            asset.publish_error = None
            asset.publish_error_code = None

            # Audit record
            pub_log = PublicationLog(
                id=f"publog_{uuid.uuid4().hex[:12]}",
                business_id=asset.business_id,
                content_asset_id=asset.id,
                platform=asset.platform,
                provider="meta_instagram",
                status="published",
                container_id=container_id,
                media_id=media_id,
                permalink=permalink,
                attempted_at=datetime.utcnow(),
                completed_at=datetime.utcnow(),
            )
            db.add(pub_log)

            pub_post = PublishedPost(
                id=f"post_{uuid.uuid4().hex[:12]}",
                business_id=asset.business_id,
                campaign_id=asset.campaign_id,
                content_asset_id=asset.id,
                platform=asset.platform,
                post_url=permalink,
                published_at=datetime.utcnow(),
                status="published",
            )
            db.add(pub_post)
            db.commit()
            logger.info(f"Scheduler successfully published asset '{asset.id}' to {asset.platform}")
            return {"status": "published", "media_id": media_id, "permalink": permalink}
        else:
            err_msg = pub_res.get("error", "Publishing failed")
            err_code = pub_res.get("error_code", "PUBLISH_FAILED")

            asset.status = "failed"
            asset.publish_error = err_msg
            asset.publish_error_code = err_code

            pub_log = PublicationLog(
                id=f"publog_{uuid.uuid4().hex[:12]}",
                business_id=asset.business_id,
                content_asset_id=asset.id,
                platform=asset.platform,
                provider="meta_instagram",
                status="failed",
                container_id=pub_res.get("container_id"),
                error_code=err_code,
                error_message=err_msg,
                raw_response=pub_res.get("raw_response"),
                attempted_at=datetime.utcnow(),
                completed_at=datetime.utcnow(),
            )
            db.add(pub_log)
            db.commit()
            logger.warning(f"Scheduler publication failed for asset '{asset.id}': {err_msg}")
            return {"status": "failed", "error": err_msg, "code": err_code}
    except Exception as ex:
        logger.error(f"Scheduler execution error for asset '{asset_id}': {ex}", exc_info=True)
        if asset:
            asset.status = "failed"
            asset.publish_error = f"Scheduler execution error: {str(ex)}"
            asset.publish_error_code = "SCHEDULER_EXCEPTION"
            db.commit()
        return {"status": "error", "message": str(ex)}
    finally:
        db.close()


async def process_due_scheduled_posts() -> int:
    """
    Periodic job that checks the database for any scheduled posts whose scheduled_at is now or past.
    This guarantees posts survive application restarts!
    """
    async with _lock:
        db = SessionLocal()
        dispatched_count = 0
        try:
            now = datetime.utcnow()
            # Fetch all scheduled assets whose scheduled_at <= now
            due_assets = (
                db.query(ContentAsset)
                .filter(
                    ContentAsset.status == "scheduled",
                    ContentAsset.scheduled_at != None,
                    ContentAsset.scheduled_at <= now,
                )
                .all()
            )

            for asset in due_assets:
                logger.info(f"Scheduler found due asset '{asset.id}' scheduled for {asset.scheduled_at}. Dispatching...")
                dispatched_count += 1
                asyncio.create_task(publish_asset_job(asset.id))

        except Exception as e:
            logger.error(f"Error in process_due_scheduled_posts: {e}", exc_info=True)
        finally:
            db.close()
        return dispatched_count


def enqueue_scheduled_content(content_asset_id: str, scheduled_at: datetime) -> None:
    """
    Registers or updates a precise scheduled publication job in the scheduler.
    """
    sched = get_scheduler()
    job_id = f"publish_asset_{content_asset_id}"

    # Ensure scheduled_at is in UTC
    if scheduled_at.tzinfo is not None:
        run_date = scheduled_at.astimezone(timezone.utc).replace(tzinfo=None)
    else:
        run_date = scheduled_at

    try:
        sched.add_job(
            publish_asset_job,
            trigger=DateTrigger(run_date=run_date),
            args=[content_asset_id],
            id=job_id,
            replace_existing=True,
            misfire_grace_time=3600,  # 1 hour grace time if late
        )
        logger.info(f"Enqueued scheduler job '{job_id}' for {run_date} UTC")
    except Exception as e:
        logger.warning(f"Could not add direct DateTrigger job for '{job_id}': {e}. Periodic poll will handle it.")


def get_scheduler_diagnostics() -> Dict[str, Any]:
    """Returns safe operational metrics and status about the background scheduler."""
    sched = get_scheduler()
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        pending_scheduled = (
            db.query(ContentAsset)
            .filter(ContentAsset.status == "scheduled")
            .count()
        )
        total_published = (
            db.query(ContentAsset)
            .filter(ContentAsset.status == "published")
            .count()
        )
        total_failed = (
            db.query(ContentAsset)
            .filter(ContentAsset.status == "failed")
            .count()
        )
        recent_logs = (
            db.query(PublicationLog)
            .order_by(PublicationLog.attempted_at.desc())
            .limit(5)
            .all()
        )

        job_list = []
        for job in sched.get_jobs():
            job_list.append({
                "id": job.id,
                "name": job.name,
                "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
            })

        return {
            "is_running": sched.running,
            "scheduler_type": "AsyncIOScheduler",
            "active_scheduled_jobs_count": len(job_list),
            "pending_scheduled_assets": pending_scheduled,
            "total_published_assets": total_published,
            "total_failed_assets": total_failed,
            "current_utc_time": now.isoformat(),
            "jobs": job_list[:10],
            "recent_logs": [
                {
                    "content_asset_id": log.content_asset_id,
                    "platform": log.platform,
                    "status": log.status,
                    "attempted_at": log.attempted_at.isoformat() if log.attempted_at else None,
                    "permalink": log.permalink,
                    "error_code": log.error_code,
                }
                for log in recent_logs
            ],
        }
    finally:
        db.close()


def start_scheduler() -> None:
    """Starts the AsyncIOScheduler and registers the periodic poll job."""
    sched = get_scheduler()
    if not sched.running:
        # Register persistent due-check job every 15 seconds
        sched.add_job(
            process_due_scheduled_posts,
            trigger=IntervalTrigger(seconds=15),
            id="periodic_due_posts_poll",
            replace_existing=True,
            coalesce=True,
            max_instances=1,
        )
        sched.start()
        logger.info("Autonomous APScheduler started with 15s interval polling.")


def shutdown_scheduler() -> None:
    """Stops the scheduler safely without blocking shutdown."""
    sched = get_scheduler()
    if sched.running:
        sched.shutdown(wait=False)
        logger.info("APScheduler stopped.")
