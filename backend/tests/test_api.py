import pytest
import time
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app
from app.models.models import User, Business, Campaign, Product, ContentAsset
from app.agents.specialized import (
    ResearchAgent, StrategyAgent, CreativeAgent, QualityAgent,
    PublisherAgent, PerformanceAgent, LearningAgent
)
from app.ai.providers import MockAIProvider

client = TestClient(app)


def test_root_and_health():
    # Root endpoint
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["product"] == "SANKALP AI"
    assert data["status"] == "operational"
    assert len(data["agents"]) == 7

    # Health endpoint
    h_resp = client.get("/health")
    assert h_resp.status_code == 200
    h_data = h_resp.json()
    assert h_data["status"] == "healthy"
    assert h_data["database"] == "connected"


def test_auth_flow():
    # 1. Invalid credentials test
    bad_login = client.post(
        "/auth/login",
        json={"email": "nonexistent@sankalp.ai", "password": "wrongpassword123"}
    )
    assert bad_login.status_code == 401

    # 2. Signup new unique user
    unique_email = f"user_{int(time.time()*1000)}@testbrand.com"
    signup_resp = client.post(
        "/auth/signup",
        json={
            "name": "Kavita Rao",
            "email": unique_email,
            "password": "SecurePassword2026!",
            "business_name": "Aura Naturals"
        }
    )
    assert signup_resp.status_code == 200
    signup_data = signup_resp.json()
    assert "access_token" in signup_data
    assert signup_data["user"]["name"] == "Kavita Rao"

    # 3. Duplicate email signup rejection
    dup_resp = client.post(
        "/auth/signup",
        json={
            "name": "Duplicate User",
            "email": unique_email,
            "password": "Password123!"
        }
    )
    assert dup_resp.status_code == 400

    # 4. Successful login
    login_resp = client.post(
        "/auth/login",
        json={"email": unique_email, "password": "SecurePassword2026!"}
    )
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 5. Fetch Profile
    me_resp = client.get("/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == unique_email


def test_business_and_product_crud():
    # Login demo user
    auth_resp = client.post(
        "/auth/login",
        data={"username": "demo@sankalp.ai", "password": "sankalp2026"}
    )
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch business
    biz_resp = client.get("/business", headers=headers)
    assert biz_resp.status_code == 200
    assert "ABC Fashion Store" in biz_resp.json()["name"]

    # Update business
    update_resp = client.patch(
        "/business",
        json={"location": "Bengaluru, Tech Corridor", "auto_publish_enabled": False},
        headers=headers
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["location"] == "Bengaluru, Tech Corridor"

    # Fetch products
    prod_resp = client.get("/business/products", headers=headers)
    assert prod_resp.status_code == 200
    products = prod_resp.json()
    assert len(products) >= 3

    # Create new product
    create_prod = client.post(
        "/business/products",
        json={
            "name": "Audit Test Performance Hoodie",
            "category": "Apparel",
            "price": "₹3,999",
            "description": "Thermal wind-resistant commuter hoodie with hidden stash pockets."
        },
        headers=headers
    )
    assert create_prod.status_code == 200
    new_p_id = create_prod.json()["id"]

    # Delete product
    del_prod = client.delete(f"/business/products/{new_p_id}", headers=headers)
    assert del_prod.status_code == 200
    assert del_prod.json()["status"] == "deleted"

    # Delete non-existent product should 404
    del_404 = client.delete("/business/products/non_existent_999", headers=headers)
    assert del_404.status_code == 404


def test_brand_audience_goals_preferences():
    # Brand
    brand_resp = client.get("/business/brand")
    assert brand_resp.status_code == 200
    assert len(brand_resp.json()["tones"]) > 0

    # Update Brand
    b_update = client.patch(
        "/business/brand",
        json={
            "tones": ["Bold", "Visionary", "Conversational"],
            "colors": ["#00F0FF", "#8B5CF6", "#05060A"],
            "tagline": "Performance Engineered for Everyday Movement",
            "languages": ["English", "Hinglish"]
        }
    )
    assert b_update.status_code == 200
    assert "Visionary" in b_update.json()["tones"]

    # Audience
    aud_resp = client.get("/business/audience")
    assert aud_resp.status_code == 200

    # Goals
    goals_resp = client.get("/business/goals")
    assert goals_resp.status_code == 200

    # Preferences
    pref_resp = client.get("/business/content-preferences")
    assert pref_resp.status_code == 200


def test_agents_deterministic_execution():
    provider = MockAIProvider()
    
    # 1. Research Agent
    research_agent = ResearchAgent(provider)
    r_out = research_agent.run({"objective": "Promote summer collection", "brand": "ABC Fashion"})
    assert len(r_out["trends"]) > 0
    assert len(r_out["opportunities"]) > 0
    
    # 2. Strategy Agent
    strategy_agent = StrategyAgent(provider)
    s_out = strategy_agent.run({"objective": "Summer drop", "research": r_out})
    assert s_out["duration_days"] == 5
    assert len(s_out["content_pillars"]) >= 4
    
    # 3. Creative Agent
    creative_agent = CreativeAgent(provider)
    c_out = creative_agent.run({"strategy": s_out})
    assert len(c_out["content_assets"]) >= 3
    
    # 4. Quality Agent
    quality_agent = QualityAgent(provider)
    q_out = quality_agent.run({"content_assets": c_out["content_assets"]})
    assert q_out["status"] == "PASS"
    assert q_out["overall_score"] >= 0.90
    
    # 5. Publisher Agent
    pub_agent = PublisherAgent(provider)
    pub_out = pub_agent.run({"content_asset_id": "test-1", "platform": "instagram"})
    assert pub_out["demo_mode"] is True
    
    # 6. Performance Agent
    perf_agent = PerformanceAgent(provider)
    perf_out = perf_agent.run({"days": 30})
    assert "metrics" in perf_out
    
    # 7. Learning Agent
    learn_agent = LearningAgent(provider)
    learn_out = learn_agent.run({"analytics": perf_out})
    assert len(learn_out["insights"]) > 0


def test_quality_agent_rejection_and_acceptance():
    qa = QualityAgent()

    # Invalid Content (caption too short, no CTA)
    invalid_content = {
        "title": "Invalid Test",
        "caption": "Bad.",  # Under 20 chars
        "hook": "Hey",
        "cta": None
    }
    invalid_res = qa.run({"content_assets": [invalid_content]})
    assert invalid_res["status"] == "NEEDS_REVISION"
    assert len(invalid_res["issues"]) >= 1

    # Valid Content
    valid_content = {
        "title": "Valid Test Item",
        "caption": "Engineered for 15,000 daily steps with cloud comfort sole cushioning. Tap link in bio to shop.",
        "hook": "Why ordinary sneakers fail your commute.",
        "cta": "Tap link in bio to explore"
    }
    valid_res = qa.run({"content_assets": [valid_content]})
    assert valid_res["status"] == "PASS"
    assert len(valid_res["issues"]) == 0


def test_campaign_step_by_step_workflow():
    # 1. Create a campaign
    camp_resp = client.post(
        "/campaigns",
        json={
            "name": "Audit Test 5-Day Sprint",
            "objective": "Introduce our Urban Glide line to commuter demographic",
            "duration_days": 5,
            "platforms": ["instagram", "youtube"],
            "brief": "Focus on high-velocity commuter pain points and ergonomic arch support."
        }
    )
    assert camp_resp.status_code == 200
    camp_data = camp_resp.json()
    c_id = camp_data["campaign_id"]

    # 2. Execute Research Step
    res_step = client.post(f"/campaigns/{c_id}/research")
    assert res_step.status_code == 200
    assert "trends" in res_step.json()["research"]

    # 3. Execute Strategy Step
    strat_step = client.post(f"/campaigns/{c_id}/strategy")
    assert strat_step.status_code == 200
    assert "schedule" in strat_step.json()["strategy"]

    # 4. Execute Creative Generation Step
    gen_step = client.post(f"/campaigns/{c_id}/generate")
    assert gen_step.status_code == 200
    assert gen_step.json()["assets_created"] > 0

    # 5. Execute Quality Check Step
    qa_step = client.post(f"/campaigns/{c_id}/quality-check")
    assert qa_step.status_code == 200
    assert qa_step.json()["quality_status"] == "PASS"

    # 6. Approve Campaign
    app_step = client.post(f"/campaigns/{c_id}/approve")
    assert app_step.status_code == 200
    assert app_step.json()["status"] == "approved"

    # 7. Detail view
    detail = client.get(f"/campaigns/{c_id}")
    assert detail.status_code == 200
    assert len(detail.json()["assets"]) > 0


def test_content_studio_edit_and_qa_reverification():
    # Fetch content assets
    list_resp = client.get("/content")
    assert list_resp.status_code == 200
    assets = list_resp.json()
    assert len(assets) > 0
    asset_id = assets[0]["id"]

    # Edit content
    patch_resp = client.patch(
        f"/content/{asset_id}",
        json={
            "caption": "Updated caption engineered for verified comfort across daily urban travel. Check out the link in bio for full launch specs.",
            "cta": "Tap link in bio to shop now."
        }
    )
    assert patch_resp.status_code == 200
    assert patch_resp.json()["quality_status"] == "PASS"

    # Trigger explicit quality check
    qa_check = client.post(f"/content/{asset_id}/quality-check")
    assert qa_check.status_code == 200
    assert qa_check.json()["quality_status"] == "PASS"

    # Schedule content
    sched_resp = client.post(
        f"/content/{asset_id}/schedule",
        json={"scheduled_at": datetime.utcnow().isoformat()}
    )
    assert sched_resp.status_code == 200
    assert sched_resp.json()["status"] == "scheduled"

    # Publish content simulation
    pub_resp = client.post(f"/content/{asset_id}/publish")
    assert pub_resp.status_code == 200
    assert pub_resp.json()["status"] == "published"
    assert "Simulated dispatch" in pub_resp.json()["note"] or "Demo" in pub_resp.json()["note"]


def test_campaign_orchestration_ai_manager_chat():
    auth_resp = client.post(
        "/auth/login",
        data={"username": "demo@sankalp.ai", "password": "sankalp2026"}
    )
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Trigger conversational chat
    chat_resp = client.post(
        "/agent/chat",
        json={"message": "New summer collection launched. Create a 5-day Instagram campaign."},
        headers=headers
    )
    assert chat_resp.status_code == 200
    chat_data = chat_resp.json()
    assert "campaign_id" in chat_data
    assert chat_data["workflow_summary"]["quality_status"] == "PASS"
    assert len(chat_data["content_preview"]) > 0


def test_analytics_and_learning_separation():
    auth_resp = client.post(
        "/auth/login",
        data={"username": "demo@sankalp.ai", "password": "sankalp2026"}
    )
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Analytics
    an_resp = client.get("/analytics", headers=headers)
    assert an_resp.status_code == 200
    an_data = an_resp.json()
    assert "metrics" in an_data
    assert "total_reach" in an_data["metrics"]
    assert "demo_mode" in an_data

    # Learning
    learn_resp = client.get("/learning", headers=headers)
    assert learn_resp.status_code == 200
    learn_data = learn_resp.json()
    assert len(learn_data) > 0
    assert "evidence" in learn_data[0]

    # Trigger Learning Analysis synthesis
    analyze_resp = client.post("/learning/analyze", headers=headers)
    assert analyze_resp.status_code == 200
    assert analyze_resp.json()["status"] == "success"


def test_social_accounts_flow():
    auth_resp = client.post(
        "/auth/login",
        data={"username": "demo@sankalp.ai", "password": "sankalp2026"}
    )
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List social accounts
    soc_resp = client.get("/social-accounts", headers=headers)
    assert soc_resp.status_code == 200
    accounts = soc_resp.json()
    assert len(accounts) >= 2
    assert any(a["platform"] == "instagram" for a in accounts)

    # Connect YouTube channel
    conn_resp = client.post(
        "/social-accounts/connect",
        json={"platform": "youtube", "account_name": "ABC Fashion Studio Demo"},
        headers=headers
    )
    assert conn_resp.status_code == 200
    assert conn_resp.json()["account"]["platform"] == "youtube"


def test_content_calendar():
    auth_resp = client.post(
        "/auth/login",
        data={"username": "demo@sankalp.ai", "password": "sankalp2026"}
    )
    token = auth_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    cal_resp = client.get("/calendar", headers=headers)
    assert cal_resp.status_code == 200
    events = cal_resp.json()
    assert isinstance(events, list)
    if len(events) > 0:
        assert "scheduled_at" in events[0]
        assert "platform" in events[0]
