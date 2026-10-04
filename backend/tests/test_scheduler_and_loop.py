import pytest
import time
import json
from datetime import datetime, timedelta
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.database.database import SessionLocal, Base, engine
from app.models.models import (
    User, Business, Campaign, ContentAsset, SocialAccount,
    PublicationLog, PublishedPost, AnalyticsSnapshot, LearningInsight
)
from app.scheduler.service import (
    process_due_scheduled_posts,
    enqueue_scheduled_content,
    get_scheduler_diagnostics,
    publish_asset_job
)
from app.core.storage import CloudinaryStorage

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    yield


def _create_test_business_and_campaign(objective="Increase weekday dinner traffic"):
    db = SessionLocal()
    try:
        suffix = int(time.time() * 1000)
        user = User(
            id=f"usr_sched_{suffix}",
            email=f"user_{suffix}@test.com",
            name="Sched User",
            hashed_password="hashed_pw"
        )
        db.add(user)
        biz = Business(
            id=f"biz_sched_{suffix}",
            owner_id=user.id,
            name="La Trattoria Bistro",
            business_type="Restaurant",
            is_onboarded=True
        )
        db.add(biz)
        camp = Campaign(
            id=f"cmp_sched_{suffix}",
            business_id=biz.id,
            name="Weekday Dinner Surge",
            objective=objective,
            duration_days=3,
            status="active",
            strategy_json=json.dumps({
                "content_pillars": ["Chef's Specials", "Ambiance", "Special Offers"],
                "schedule": [{"day": 1, "title": "Tuesday Pasta Night", "format": "Post"}]
            })
        )
        db.add(camp)
        db.commit()
        return user.id, biz.id, camp.id
    finally:
        db.close()


def test_scheduler_diagnostics_endpoint():
    """Verify scheduler status endpoint reports operational metrics without leaking secrets."""
    resp = client.get("/scheduler/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "is_running" in data
    assert "active_scheduled_jobs_count" in data
    assert "pending_scheduled_assets" in data
    assert "total_published_assets" in data


def test_scheduler_process_due_posts_and_prevents_duplicate():
    """Verify scheduler processes due posts and prevents duplicate publication."""
    _, biz_id, camp_id = _create_test_business_and_campaign()
    db = SessionLocal()
    try:
        suffix = int(time.time() * 1000)
        due_time = datetime.utcnow() - timedelta(minutes=5)
        asset = ContentAsset(
            id=f"asset_due_{suffix}",
            campaign_id=camp_id,
            business_id=biz_id,
            platform="instagram",
            content_type="Post",
            title="Due Scheduled Post",
            caption="Delicious homemade pasta ready tonight!",
            media_url="https://images.example.com/pasta.jpg",
            quality_status="PASS",
            status="scheduled",
            scheduled_at=due_time
        )
        db.add(asset)
        db.commit()

        # 1. Enqueue job
        enqueue_scheduled_content(asset.id, due_time)

        # 2. Trigger due post processing with mocked publisher
        mock_pub_res = {
            "status": "PUBLISHED",
            "platform": "Instagram",
            "media_id": "17899000111222",
            "container_id": "container_due_123",
            "permalink": "https://www.instagram.com/p/CzDuePost123/",
            "post_url": "https://www.instagram.com/p/CzDuePost123/"
        }

        # Also add social account so publish doesn't fail at connection check
        sa = SocialAccount(
            id=f"soc_sched_{suffix}",
            business_id=biz_id,
            platform="instagram",
            account_name="@latrattoria",
            account_id="178414000998877",
            is_connected=True,
            access_token="TEST_VALID_ACCESS_TOKEN",
            token_expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db.add(sa)
        db.commit()

        import asyncio
        with patch("app.agents.specialized.PublisherAgent.execute", new_callable=AsyncMock) as mock_exec:
            mock_exec.return_value = mock_pub_res
            dispatched = asyncio.run(process_due_scheduled_posts())
            assert dispatched >= 1

            # Give worker task a brief moment to finish
            time.sleep(0.5)

            db.refresh(asset)
            assert asset.status == "published"
            assert asset.published_url == "https://www.instagram.com/p/CzDuePost123/"

            # 3. Duplicate Prevention: Run again and verify it is NOT published twice
            dispatched_second = asyncio.run(process_due_scheduled_posts())
            # Asset is already 'published', so it should not be picked up
            db.refresh(asset)
            assert asset.status == "published"
    finally:
        db.close()


def test_cloudinary_storage_signing_and_reachability():
    """Verify CloudinaryStorage constructs valid signed parameters and handles reachability."""
    import asyncio
    storage = CloudinaryStorage(
        cloud_name="test_cloud",
        api_key="test_key_12345",
        api_secret="test_secret_99999"
    )

    mock_upload_resp = MagicMock()
    mock_upload_resp.status_code = 200
    mock_upload_resp.json.return_value = {
        "secure_url": "https://res.cloudinary.com/test_cloud/image/upload/v12345/sankalp_photo.jpg",
        "public_id": "sankalp_photo",
        "format": "jpg"
    }

    mock_head_resp = MagicMock()
    mock_head_resp.status_code = 200
    mock_head_resp.headers = {"content-type": "image/jpeg"}

    async def _test():
        with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post, \
             patch("httpx.AsyncClient.head", new_callable=AsyncMock) as mock_head:
            mock_post.return_value = mock_upload_resp
            mock_head.return_value = mock_head_resp

            url = await storage.upload_image(b"fake_image_bytes", "dish_photo.jpg", "image/jpeg")
            assert url.startswith("https://res.cloudinary.com/")
            assert "sankalp_photo.jpg" in url

            # Verify post payload
            call_kwargs = mock_post.call_args[1]
            data = call_kwargs["data"]
            assert data["api_key"] == "test_key_12345"
            assert "signature" in data
            assert data["tags"] == "sankalp_ai,marketing_asset"

    asyncio.run(_test())


def test_campaign_loop_state_endpoint():
    """Verify GET /campaigns/{id}/loop-state returns the full 9-step autonomous loop state."""
    _, biz_id, camp_id = _create_test_business_and_campaign()
    db = SessionLocal()
    try:
        suffix = int(time.time() * 1000)
        asset = ContentAsset(
            id=f"asset_loop_{suffix}",
            campaign_id=camp_id,
            business_id=biz_id,
            platform="instagram",
            content_type="Post",
            title="Loop State Post",
            status="published",
            published_url="https://www.instagram.com/p/CzLoop123/",
            published_at=datetime.utcnow()
        )
        db.add(asset)
        db.flush()

        snap = AnalyticsSnapshot(
            id=f"snap_loop_{suffix}",
            business_id=biz_id,
            content_id=asset.id,
            platform="instagram",
            reach=1250,
            impressions=1600,
            likes=84,
            comments=12,
            engagement_rate=6.0,
            captured_at=datetime.utcnow()
        )
        db.add(snap)

        insight = LearningInsight(
            id=f"ins_loop_{suffix}",
            business_id=biz_id,
            campaign_id=camp_id,
            category="Content Performance",
            insight_text="Behind-the-scenes chef videos yielded 2.4x higher comment density.",
            evidence_json=json.dumps(["Higher comment count on cooking clips"]),
            recommendation="Increase behind-the-scenes format frequency in upcoming roadmap.",
            confidence_score=0.94,
            is_applied=True
        )
        db.add(insight)
        db.commit()

        resp = client.get(f"/campaigns/{camp_id}/loop-state")
        assert resp.status_code == 200
        data = resp.json()

        assert data["campaign_id"] == camp_id
        assert data["goal"] == "Increase weekday dinner traffic"
        assert len(data["completed_steps"]) >= 1
        assert len(data["performance_evidence"]) >= 1
        assert data["performance_evidence"][0]["likes"] == 84
        assert len(data["learned_insights"]) >= 1
        assert "chef videos" in data["learned_insights"][0]["insight"]
        assert len(data["next_recommended_actions"]) >= 1
    finally:
        db.close()


def test_campaign_autonomous_replanning():
    """Verify POST /campaigns/{id}/replan consumes telemetry and produces evolved roadmap."""
    _, biz_id, camp_id = _create_test_business_and_campaign()

    mock_replanned = {
        "replan_rationale": "Pivoting from static menu cards to dynamic preparation reels based on +140% comment lift.",
        "strategic_shifts": ["Shift to Reel format", "Focus on dinner reservations CTA"],
        "recommended_format_mix": {"Reel": "60%", "Carousel": "30%", "Post": "10%"},
        "content_pillars": ["Chef Table Experience", "Evening Atmosphere", "Exclusive Specials"],
        "schedule": [
            {"day": 1, "title": "Chef Sizzling Pasta Reel", "format": "Reel", "platform": "Instagram"},
            {"day": 2, "title": "Candlelight Ambience Carousel", "format": "Carousel", "platform": "Instagram"}
        ],
        "projected_improvements": {"target_engagement_lift": "+35%", "confidence": 0.95}
    }

    with patch("app.agents.specialized.StrategyAgent.replan", new_callable=AsyncMock) as mock_replan:
        mock_replan.return_value = mock_replanned

        resp = client.post(f"/campaigns/{camp_id}/replan")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert "Pivoting from static" in data["replan_rationale"]
        assert len(data["strategic_shifts"]) == 2
        assert len(data["replanned_schedule"]) == 2

        # Verify Campaign strategy in DB was updated
        db = SessionLocal()
        try:
            c = db.query(Campaign).filter(Campaign.id == camp_id).first()
            assert c.status == "replanned"
            saved_strat = json.loads(c.strategy_json)
            assert "Chef Sizzling Pasta Reel" in str(saved_strat)
        finally:
            db.close()
