import pytest
import time
from fastapi.testclient import TestClient
from datetime import datetime
from unittest.mock import patch, MagicMock

from app.main import app
from app.database.database import SessionLocal, Base, engine
from app.models.models import User, Business, Campaign, Product, ContentAsset, SocialAccount
from app.ai.providers import get_ai_provider, is_ai_configured
from app.core.config import settings

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_clean_db():
    """Ensure database tables exist before each test."""
    Base.metadata.create_all(bind=engine)
    yield


def test_root_and_health():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["product"] == "SANKALP AI"
    assert data["status"] == "operational"
    assert len(data["agents"]) == 7

    h_resp = client.get("/health")
    assert h_resp.status_code == 200
    h_data = h_resp.json()
    assert h_data["status"] == "healthy"
    assert h_data["database"] == "connected"


def test_1_no_demo_business_created():
    """1. No demo business (ABC Fashion Store) is automatically created on startup."""
    db = SessionLocal()
    try:
        biz = db.query(Business).filter(Business.name == "ABC Fashion Store").first()
        assert biz is None, "ABC Fashion Store demo business must not exist automatically."
    finally:
        db.close()


def test_2_no_fake_social_account_created():
    """2. Connected Accounts must contain ONLY actual OAuth-connected accounts; no fake seeds."""
    db = SessionLocal()
    try:
        accounts = db.query(SocialAccount).all()
        for a in accounts:
            assert a.account_name != "ABC Fashion Studio", "Fake demo social account must not exist"
            assert "@abcfashion_official" not in a.account_name, "Fake demo social account must not exist"
    finally:
        db.close()


def test_3_no_mock_ai_provider_in_system():
    """3. MockAIProvider must be completely removed from production app."""
    import app.ai.providers as providers
    assert not hasattr(providers, "MockAIProvider"), "MockAIProvider must be removed from providers.py"


def test_4_ai_fails_honestly_when_no_api_key():
    """4. If no valid AI API key is configured, fail honestly with 'AI provider is not configured.'"""
    with patch.object(settings, "GEMINI_API_KEY", ""), patch.object(settings, "GROQ_API_KEY", ""):
        from fastapi import HTTPException
        with pytest.raises(HTTPException) as exc_info:
            get_ai_provider()
        assert exc_info.value.status_code == 503
        assert "AI provider is not configured" in exc_info.value.detail


def test_5_publishing_requires_real_social_connection():
    """5. Publishing requires a real social connection. Fails honestly if not connected."""
    db = SessionLocal()
    try:
        # Create user and business
        u_id = f"usr_{int(time.time()*1000)}"
        user = User(id=u_id, email=f"{u_id}@test.com", name="Test User", hashed_password="pw")
        db.add(user)
        biz = Business(id=f"biz_{int(time.time()*1000)}", owner_id=u_id, name="Real Brand", is_onboarded=True)
        db.add(biz)
        
        asset = ContentAsset(
            id=f"asset_test_{int(time.time()*1000)}",
            business_id=biz.id,
            platform="instagram",
            content_type="Post",
            title="Real Post Test",
            caption="Real post caption testing verification.",
            media_url="https://images.example.com/photo.jpg",
            quality_status="PASS",
            status="approved"
        )
        db.add(asset)
        db.commit()

        # Attempt to publish without connected social account
        resp = client.post(f"/content/{asset.id}/publish")
        assert resp.status_code == 400
        assert "not connected" in resp.json()["detail"].lower()
        
        # Verify asset status is failed, NOT published
        db.refresh(asset)
        assert asset.status == "failed"
    finally:
        db.close()


def test_6_no_simulated_publishing_occurs():
    """6. Publishing must actually call Instagram API and fail honestly if external API fails."""
    db = SessionLocal()
    try:
        u_id = f"usr_{int(time.time()*1000)}"
        user = User(id=u_id, email=f"{u_id}@test.com", name="Test User", hashed_password="pw")
        db.add(user)
        biz = Business(id=f"biz_{int(time.time()*1000)}", owner_id=u_id, name="Real Brand", is_onboarded=True)
        db.add(biz)

        # Add a connected account with invalid token
        account = SocialAccount(
            id=f"soc_{int(time.time()*1000)}",
            business_id=biz.id,
            platform="instagram",
            account_name="real_instagram_user",
            account_id="17841400000000000",
            is_connected=True,
            access_token="INVALID_MOCK_TOKEN"
        )
        db.add(account)

        asset = ContentAsset(
            id=f"asset_test_{int(time.time()*1000)}",
            business_id=biz.id,
            platform="instagram",
            content_type="Post",
            title="Real Publish Test",
            caption="Testing real Meta API publish handling.",
            media_url="https://images.example.com/real_photo.jpg",
            quality_status="PASS",
            status="approved"
        )
        db.add(asset)
        db.commit()

        # Attempt publish with invalid token -> should fail at Meta Graph API call, NOT succeed simulated
        resp = client.post(f"/content/{asset.id}/publish")
        assert resp.status_code in [502, 400]
        db.refresh(asset)
        assert asset.status == "failed"
    finally:
        db.close()


def test_7_analytics_returns_empty_state_when_no_real_data():
    """7. Analytics returns empty state (0s, no fabricated graph) when no real data exists."""
    unique_email = f"analytics_{int(time.time()*1000)}@test.com"
    signup_resp = client.post(
        "/auth/signup",
        json={"name": "Analytics User", "email": unique_email, "password": "Password123!", "business_name": "New Brand"}
    )
    token = signup_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    an_resp = client.get("/analytics", headers=headers)
    assert an_resp.status_code == 200
    data = an_resp.json()
    assert data["has_real_data"] is False
    assert data["metrics"]["total_reach"] == 0
    assert data["metrics"]["total_impressions"] == 0
    assert data["metrics"]["total_engagement"] == 0
    assert data["timeline"] == []
    assert "No analytics data yet" in data["message"]


def test_8_oauth_failure_handling():
    """8. OAuth failure is handled correctly and redirects with honest error."""
    resp = client.get(
        "/social-accounts/instagram/callback?error=access_denied&error_description=User+denied+request",
        follow_redirects=False
    )
    assert resp.status_code == 307
    assert "User+denied+request" in resp.headers["location"] or "error=" in resp.headers["location"]


def test_9_successful_oauth_callback_flow():
    """9. Successful OAuth creates a real SocialAccount."""
    db = SessionLocal()
    try:
        u_id = f"usr_oauth_{int(time.time()*1000)}"
        user = User(id=u_id, email=f"{u_id}@test.com", name="OAuth User", hashed_password="pw")
        db.add(user)
        biz = Business(id=f"biz_oauth_{int(time.time()*1000)}", owner_id=u_id, name="OAuth Brand")
        db.add(biz)
        db.commit()

        with patch("httpx.AsyncClient.post") as mock_post, patch("httpx.AsyncClient.get") as mock_get:
            # Mock Instagram token exchange
            mock_post_resp = MagicMock()
            mock_post_resp.status_code = 200
            mock_post_resp.json.return_value = {
                "access_token": "EAAG_real_token_12345",
                "user_id": "17841400012345678"
            }
            mock_post.return_value = mock_post_resp

            # Mock Instagram user info
            mock_get_resp = MagicMock()
            mock_get_resp.status_code = 200
            mock_get_resp.json.return_value = {
                "id": "17841400012345678",
                "username": "authentic_brand_handle",
                "account_type": "BUSINESS"
            }
            mock_get.return_value = mock_get_resp

            resp = client.get("/social-accounts/instagram/callback?code=mock_valid_auth_code", follow_redirects=False)
            assert resp.status_code == 307
            assert "instagram_success" in resp.headers["location"]

            # Check DB
            acc = db.query(SocialAccount).filter(SocialAccount.account_name == "@authentic_brand_handle").first()
            assert acc is not None
            assert acc.is_connected is True
    finally:
        db.close()


def test_10_learning_requires_real_data():
    """10. Real learning system returns 'insufficient_data' when no performance data exists."""
    unique_email = f"learn_{int(time.time()*1000)}@test.com"
    signup_resp = client.post(
        "/auth/signup",
        json={"name": "Learn User", "email": unique_email, "password": "Password123!", "business_name": "Insight Brand"}
    )
    token = signup_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Query learning list
    list_resp = client.get("/learning", headers=headers)
    assert list_resp.status_code == 200
    assert list_resp.json() == []

    # Trigger learning analysis without performance data
    analyze_resp = client.post("/learning/analyze", headers=headers)
    assert analyze_resp.status_code == 200
    assert analyze_resp.json()["status"] == "insufficient_data"
    assert "Not enough performance data" in analyze_resp.json()["message"]


def test_11_agent_chat_payload_contract():
    """11. AI Manager /agent/chat accepts 'message', 'prompt', or 'instruction', and rejects empty payloads."""
    unique_email = f"chat_{int(time.time()*1000)}@test.com"
    signup_resp = client.post(
        "/auth/signup",
        json={"name": "Chat User", "email": unique_email, "password": "Password123!", "business_name": "Chat Brand"}
    )
    assert signup_resp.status_code == 200
    token = signup_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Ensure business is marked onboarded for campaign generation
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == unique_email).first()
        biz = db.query(Business).filter(Business.owner_id == user.id).first()
        biz.is_onboarded = True
        db.commit()
    finally:
        db.close()

    # 1. Rejection of empty/missing message
    r_empty_msg = client.post("/agent/chat", json={"message": "   "}, headers=headers)
    assert r_empty_msg.status_code == 400
    assert "Message is required" in r_empty_msg.json()["detail"]

    r_empty_prompt = client.post("/agent/chat", json={"prompt": ""}, headers=headers)
    assert r_empty_prompt.status_code == 400
    assert "Message is required" in r_empty_prompt.json()["detail"]

    r_empty_obj = client.post("/agent/chat", json={}, headers=headers)
    assert r_empty_obj.status_code == 400
    assert "Message is required" in r_empty_obj.json()["detail"]

    # 2. Acceptance of frontend contract with 'prompt'
    with patch("app.agents.orchestrator.AgentOrchestrator.run_campaign_pipeline") as mock_pipeline:
        mock_pipeline.return_value = {
            "campaign_id": "cmp_mock_1",
            "status": "review",
            "content": [
                {
                    "id": "asset_mock_1",
                    "title": "Post 1",
                    "platform": "instagram",
                    "content_type": "Post",
                    "caption": "Test caption",
                    "quality_status": "PASS",
                    "status": "approved"
                }
            ],
            "quality": {"status": "PASS", "fidelity_score": 98.0}
        }

        # Send with 'prompt' (previous frontend payload format)
        res_prompt = client.post(
            "/agent/chat",
            json={"prompt": "Launch a 5-day promotional sequence"},
            headers=headers
        )
        assert res_prompt.status_code == 200
        data_p = res_prompt.json()
        assert "Launch a 5-day promotional sequence" in data_p["response"]
        assert data_p["workflow_summary"]["research_complete"] is True
        assert data_p["workflow_summary"]["strategy_created"] is True

        # Send with 'message' (standard backend payload format)
        res_msg = client.post(
            "/agent/chat",
            json={"message": "Increase weekday dinner traffic"},
            headers=headers
        )
        assert res_msg.status_code == 200
        data_m = res_msg.json()
        assert "Increase weekday dinner traffic" in data_m["response"]
        assert data_m["workflow_summary"]["content_count"] == 1

