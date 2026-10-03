import pytest
import time
import json
from datetime import datetime, timedelta
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient
import httpx

from app.main import app
from app.database.database import SessionLocal, Base, engine
from app.models.models import User, Business, ContentAsset, SocialAccount, PublicationLog, PublishedPost
from app.core.config import settings

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield


def create_test_business_and_asset(media_url="https://images.example.com/clean_photo.jpg", content_type="Post"):
    db = SessionLocal()
    try:
        suffix = int(time.time() * 1000)
        u_id = f"usr_{suffix}"
        user = User(id=u_id, email=f"{u_id}@test.com", name="Test User", hashed_password="pw")
        db.add(user)

        b_id = f"biz_{suffix}"
        biz = Business(id=b_id, owner_id=u_id, name="Test Brand", is_onboarded=True)
        db.add(biz)

        asset = ContentAsset(
            id=f"asset_{suffix}",
            business_id=biz.id,
            platform="instagram",
            content_type=content_type,
            title="Summer Drop Image Post",
            caption="Excited to unveil our newest collection! #SummerDrop",
            media_url=media_url,
            quality_status="PASS",
            status="approved",
        )
        db.add(asset)
        db.commit()
        return b_id, asset.id
    finally:
        db.close()


def add_instagram_account(business_id, access_token="VALID_TEST_TOKEN", account_id="17841400123456789", expired=False):
    db = SessionLocal()
    try:
        suffix = int(time.time() * 1000)
        exp_time = datetime.utcnow() - timedelta(days=2) if expired else datetime.utcnow() + timedelta(days=60)
        sa = SocialAccount(
            id=f"soc_ig_{suffix}",
            business_id=business_id,
            platform="instagram",
            account_name="@testbrand",
            account_id=account_id,
            is_connected=True,
            access_token=access_token,
            token_expires_at=exp_time,
        )
        db.add(sa)
        db.commit()
        return sa.id
    finally:
        db.close()


# =============================================================================
# TEST 1: Missing Instagram Account
# =============================================================================
def test_1_missing_instagram_account():
    biz_id, asset_id = create_test_business_and_asset()
    # No SocialAccount added for this business
    resp = client.post(f"/content/{asset_id}/publish")
    assert resp.status_code == 400
    assert "not connected" in resp.json()["detail"].lower()

    db = SessionLocal()
    try:
        asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
        assert asset.status == "failed"
        assert "not connected" in asset.publish_error.lower()
    finally:
        db.close()


# =============================================================================
# TEST 2: Missing Access Token
# =============================================================================
def test_2_missing_access_token():
    biz_id, asset_id = create_test_business_and_asset()
    add_instagram_account(biz_id, access_token=None)

    resp = client.post(f"/content/{asset_id}/publish")
    assert resp.status_code == 400
    assert "not connected" in resp.json()["detail"].lower()

    db = SessionLocal()
    try:
        asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
        assert asset.status == "failed"
    finally:
        db.close()


# =============================================================================
# TEST 3: Expired Token
# =============================================================================
def test_3_expired_token():
    biz_id, asset_id = create_test_business_and_asset()
    add_instagram_account(biz_id, expired=True)

    resp = client.post(f"/content/{asset_id}/publish")
    assert resp.status_code == 401
    assert "expired" in resp.json()["detail"].lower()

    db = SessionLocal()
    try:
        asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
        assert asset.status == "failed"
        assert "expired" in asset.publish_error.lower()
        assert asset.publish_error_code == "TOKEN_EXPIRED"
    finally:
        db.close()


# =============================================================================
# TEST 4: Missing Media URL
# =============================================================================
def test_4_missing_media_url():
    biz_id, asset_id = create_test_business_and_asset(media_url="")
    add_instagram_account(biz_id)

    resp = client.post(f"/content/{asset_id}/publish")
    assert resp.status_code == 400
    assert "media url is required" in resp.json()["detail"].lower()

    db = SessionLocal()
    try:
        asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
        assert asset.status == "failed"
        assert asset.publish_error_code == "MISSING_MEDIA_URL"
    finally:
        db.close()


# =============================================================================
# TEST 5: Non-HTTPS Media URL
# =============================================================================
def test_5_non_https_media_url():
    biz_id, asset_id = create_test_business_and_asset(media_url="http://insecure.site/photo.jpg")
    add_instagram_account(biz_id)

    resp = client.post(f"/content/{asset_id}/publish")
    assert resp.status_code == 400
    assert "https" in resp.json()["detail"].lower()

    db = SessionLocal()
    try:
        asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
        assert asset.status == "failed"
        assert asset.publish_error_code == "NON_HTTPS_MEDIA_URL"
    finally:
        db.close()


# =============================================================================
# TEST 6: Container Creation Failure
# =============================================================================
def test_6_container_creation_failure():
    biz_id, asset_id = create_test_business_and_asset()
    add_instagram_account(biz_id)

    mock_error_resp = MagicMock()
    mock_error_resp.status_code = 400
    mock_error_resp.text = json.dumps({
        "error": {
            "message": "Invalid aspect ratio for Instagram image container.",
            "type": "OAuthException",
            "code": 100,
            "error_subcode": 2207001,
            "fbtrace_id": "AbCdEf12345"
        }
    })
    mock_error_resp.json.return_value = json.loads(mock_error_resp.text)

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_error_resp

        resp = client.post(f"/content/{asset_id}/publish")
        assert resp.status_code == 502
        assert "Invalid aspect ratio" in resp.json()["detail"]

        db = SessionLocal()
        try:
            asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
            assert asset.status == "failed"
            assert "Invalid aspect ratio" in asset.publish_error
            assert asset.publish_error_code == "100"

            # Check audit log in PublicationLog
            log = db.query(PublicationLog).filter(PublicationLog.content_asset_id == asset_id).first()
            assert log is not None
            assert log.status == "failed"
            assert log.error_code == "100"
            assert "Invalid aspect ratio" in log.error_message
        finally:
            db.close()


# =============================================================================
# TEST 7: Container Processing Error
# =============================================================================
def test_7_container_processing_error():
    biz_id, asset_id = create_test_business_and_asset()
    add_instagram_account(biz_id)

    # 1. Container created successfully
    mock_create_resp = MagicMock()
    mock_create_resp.status_code = 200
    mock_create_resp.text = json.dumps({"id": "container_998877"})
    mock_create_resp.json.return_value = {"id": "container_998877"}

    # 2. Status polling returns ERROR
    mock_status_resp = MagicMock()
    mock_status_resp.status_code = 200
    mock_status_resp.text = json.dumps({"status_code": "ERROR", "status": "Corrupt image format"})
    mock_status_resp.json.return_value = {"status_code": "ERROR", "status": "Corrupt image format"}

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post, \
         patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
        mock_post.return_value = mock_create_resp
        mock_get.return_value = mock_status_resp

        resp = client.post(f"/content/{asset_id}/publish")
        assert resp.status_code == 502
        assert "Corrupt image format" in resp.json()["detail"]

        db = SessionLocal()
        try:
            asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
            assert asset.status == "failed"
            assert asset.publish_error_code == "CONTAINER_PROCESSING_ERROR"

            log = db.query(PublicationLog).filter(PublicationLog.content_asset_id == asset_id).first()
            assert log is not None
            assert log.status == "failed"
            assert log.container_id == "container_998877"
        finally:
            db.close()


# =============================================================================
# TEST 8: Container Processing Timeout
# =============================================================================
def test_8_container_processing_timeout():
    biz_id, asset_id = create_test_business_and_asset()
    add_instagram_account(biz_id)

    # 1. Container created
    mock_create_resp = MagicMock()
    mock_create_resp.status_code = 200
    mock_create_resp.text = json.dumps({"id": "container_timeout_123"})
    mock_create_resp.json.return_value = {"id": "container_timeout_123"}

    # 2. Status returns IN_PROGRESS forever
    mock_status_resp = MagicMock()
    mock_status_resp.status_code = 200
    mock_status_resp.text = json.dumps({"status_code": "IN_PROGRESS"})
    mock_status_resp.json.return_value = {"status_code": "IN_PROGRESS"}

    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post, \
         patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get, \
         patch("asyncio.sleep", new_callable=AsyncMock):  # Speed up polling in test
        mock_post.return_value = mock_create_resp
        mock_get.return_value = mock_status_resp

        resp = client.post(f"/content/{asset_id}/publish")
        assert resp.status_code == 502
        assert "timed out" in resp.json()["detail"].lower()

        db = SessionLocal()
        try:
            asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
            assert asset.status == "failed"
            assert asset.publish_error_code == "CONTAINER_TIMEOUT"
        finally:
            db.close()


# =============================================================================
# TEST 9: Successful Publication with Real Permalink Retrieval
# =============================================================================
def test_9_successful_publication():
    biz_id, asset_id = create_test_business_and_asset()
    add_instagram_account(biz_id)

    # 1. Container creation
    mock_create_resp = MagicMock()
    mock_create_resp.status_code = 200
    mock_create_resp.text = json.dumps({"id": "container_success_111"})
    mock_create_resp.json.return_value = {"id": "container_success_111"}

    # 2. Status check -> FINISHED
    mock_status_resp = MagicMock()
    mock_status_resp.status_code = 200
    mock_status_resp.text = json.dumps({"status_code": "FINISHED"})
    mock_status_resp.json.return_value = {"status_code": "FINISHED"}

    # 3. Media publish -> returns media ID
    mock_pub_resp = MagicMock()
    mock_pub_resp.status_code = 200
    mock_pub_resp.text = json.dumps({"id": "17999888777666555"})
    mock_pub_resp.json.return_value = {"id": "17999888777666555"}

    # 4. Permalink fetch
    mock_permalink_resp = MagicMock()
    mock_permalink_resp.status_code = 200
    real_permalink = "https://www.instagram.com/p/Cz98Yabcd12/"
    mock_permalink_resp.text = json.dumps({
        "id": "17999888777666555",
        "permalink": real_permalink,
        "shortcode": "Cz98Yabcd12"
    })
    mock_permalink_resp.json.return_value = {
        "id": "17999888777666555",
        "permalink": real_permalink,
        "shortcode": "Cz98Yabcd12"
    }

    async def mock_post_dispatch(*args, **kwargs):
        url = args[0] if args else kwargs.get("url", "")
        if "media_publish" in url:
            return mock_pub_resp
        return mock_create_resp

    async def mock_get_dispatch(*args, **kwargs):
        url = args[0] if args else kwargs.get("url", "")
        if "17999888777666555" in url:
            return mock_permalink_resp
        return mock_status_resp

    with patch("httpx.AsyncClient.post", side_effect=mock_post_dispatch), \
         patch("httpx.AsyncClient.get", side_effect=mock_get_dispatch):

        resp = client.post(f"/content/{asset_id}/publish")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "published"
        assert data["media_id"] == "17999888777666555"
        assert data["post_url"] == real_permalink
        assert data["permalink"] == real_permalink

        # Check DB updates
        db = SessionLocal()
        try:
            asset = db.query(ContentAsset).filter(ContentAsset.id == asset_id).first()
            assert asset.status == "published"
            assert asset.published_url == real_permalink
            assert asset.publish_error is None

            # Check PublicationLog audit record
            log = db.query(PublicationLog).filter(PublicationLog.content_asset_id == asset_id).first()
            assert log is not None
            assert log.status == "published"
            assert log.media_id == "17999888777666555"
            assert log.permalink == real_permalink
            assert log.container_id == "container_success_111"

            # Check PublishedPost record
            p_post = db.query(PublishedPost).filter(PublishedPost.content_asset_id == asset_id).first()
            assert p_post is not None
            assert p_post.post_url == real_permalink
        finally:
            db.close()


# =============================================================================
# TEST 10: Permalink Retrieval Failure (Graceful Fallback)
# =============================================================================
def test_10_permalink_retrieval_failure():
    biz_id, asset_id = create_test_business_and_asset()
    add_instagram_account(biz_id)

    mock_create_resp = MagicMock()
    mock_create_resp.status_code = 200
    mock_create_resp.json.return_value = {"id": "container_perm_fail"}

    mock_status_resp = MagicMock()
    mock_status_resp.status_code = 200
    mock_status_resp.json.return_value = {"status_code": "FINISHED"}

    mock_pub_resp = MagicMock()
    mock_pub_resp.status_code = 200
    mock_pub_resp.json.return_value = {"id": "17888111222333444"}

    # Permalink query returns 500 error
    mock_perm_err_resp = MagicMock()
    mock_perm_err_resp.status_code = 500
    mock_perm_err_resp.text = "Internal Graph API Error"

    async def mock_post_dispatch(*args, **kwargs):
        url = args[0] if args else kwargs.get("url", "")
        if "media_publish" in url:
            return mock_pub_resp
        return mock_create_resp

    async def mock_get_dispatch(*args, **kwargs):
        url = args[0] if args else kwargs.get("url", "")
        if "17888111222333444" in url:
            return mock_perm_err_resp
        return mock_status_resp

    with patch("httpx.AsyncClient.post", side_effect=mock_post_dispatch), \
         patch("httpx.AsyncClient.get", side_effect=mock_get_dispatch):

        resp = client.post(f"/content/{asset_id}/publish")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "published"
        assert data["media_id"] == "17888111222333444"
        # Must NOT construct a fake numerical /p/17888111222333444/ URL
        assert data.get("post_url") != "https://www.instagram.com/p/17888111222333444/"
