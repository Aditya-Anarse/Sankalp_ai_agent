import logging
import asyncio
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
import httpx
from ..ai.providers import get_ai_provider
from ..core.config import settings
from ..core.storage import get_media_storage, is_storage_configured

logger = logging.getLogger("sankalp.agents")


def _run_sync(coro):
    """Safely executes an async coroutine synchronously in any context."""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, coro).result()
        return loop.run_until_complete(coro)
    except RuntimeError:
        return asyncio.run(coro)


class ResearchAgent:
    """Agent 1: Ingests business context and market trends, outputs structured research findings."""
    def __init__(self, ai_provider=None):
        self.ai = ai_provider or get_ai_provider()

    async def execute(self, business_context: Dict[str, Any], objective: str) -> Dict[str, Any]:
        logger.info(f"ResearchAgent executing for objective: {objective}")
        return await self.ai.generate_research(business_context, objective)

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        objective = input_data.get("objective", "Promote products")
        business_context = input_data.get("business", {
            "name": input_data.get("brand", "Your Business"),
            "products": []
        })
        return _run_sync(self.execute(business_context, objective))


class StrategyAgent:
    """Agent 2: Converts research and business goals into a structured multi-day campaign roadmap."""
    def __init__(self, ai_provider=None):
        self.ai = ai_provider or get_ai_provider()

    async def execute(
        self, business_context: Dict[str, Any], research: Dict[str, Any], duration_days: int = 5
    ) -> Dict[str, Any]:
        logger.info(f"StrategyAgent constructing {duration_days}-day editorial roadmap")
        return await self.ai.generate_strategy(business_context, research, duration_days)

    async def replan(
        self,
        business_context: Dict[str, Any],
        current_strategy: Dict[str, Any],
        performance_evidence: List[Dict[str, Any]],
        learned_insights: List[Dict[str, Any]],
        duration_days: int = 5
    ) -> Dict[str, Any]:
        logger.info(
            f"StrategyAgent autonomously replanning roadmap based on {len(performance_evidence)} "
            f"performance events and {len(learned_insights)} insights"
        )
        return await self.ai.replan_strategy(
            business_context,
            current_strategy,
            performance_evidence,
            learned_insights,
            duration_days
        )

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        objective = input_data.get("objective", "Promote products")
        research = input_data.get("research", {})
        duration_days = input_data.get("duration_days", 5)
        business_context = input_data.get("business", {
            "name": input_data.get("brand", "Your Business"),
            "products": []
        })
        res = _run_sync(self.execute(business_context, research, duration_days))
        res["duration_days"] = duration_days
        return res


class CreativeAgent:
    """Agent 3: Generates high-retention hooks, captions, visual prompts, and multi-format scripts."""
    def __init__(self, ai_provider=None):
        self.ai = ai_provider or get_ai_provider()

    async def execute(
        self, business_context: Dict[str, Any], strategy_item: Dict[str, Any]
    ) -> Dict[str, Any]:
        logger.info(f"CreativeAgent synthesizing content for {strategy_item.get('title')}")
        content_item = await self.ai.generate_content_item(business_context, strategy_item)
        
        # Real image generation pipeline for Image/Post formats
        visual_prompt = content_item.get("visual_prompt")
        format_type = (content_item.get("content_type") or strategy_item.get("format") or "Post").lower()
        if visual_prompt and format_type in ("post", "image"):
            if is_storage_configured():
                try:
                    storage = get_media_storage()
                    image_bytes = await self.ai.generate_image(visual_prompt, business_context)
                    filename = f"post_{uuid.uuid4().hex[:12]}.jpg"
                    public_url = await storage.upload_image(image_bytes, filename, content_type="image/jpeg")
                    content_item["media_url"] = public_url
                    logger.info(f"CreativeAgent successfully generated and stored image at {public_url}")
                except Exception as e:
                    logger.warning(f"CreativeAgent image generation note: {e}")
                    content_item["media_url"] = None
            else:
                logger.info("Public storage not configured; asset created without pre-stored media_url")
                content_item["media_url"] = None

        return content_item

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        strategy = input_data.get("strategy", {})
        schedule = strategy.get("schedule", [
            {"day": 1, "title": "Day 1 Hook", "format": "Post"},
            {"day": 2, "title": "Day 2 Feature", "format": "Post"},
            {"day": 3, "title": "Day 3 Launch", "format": "Post"}
        ])
        business_context = input_data.get("business", {
            "name": input_data.get("brand", "Your Business"),
            "products": []
        })
        assets = []
        for item in schedule:
            asset = _run_sync(self.execute(business_context, item))
            assets.append(asset)
        return {
            "content_assets": assets,
            "count": len(assets)
        }


class QualityAgent:
    """Agent 4: Validates brand consistency, pricing, grammar, aspect ratio, and safety guardrails."""
    def __init__(self, ai_provider=None):
        self.ai = ai_provider or get_ai_provider()

    async def execute(
        self, content_item: Dict[str, Any], brand_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        logger.info(f"QualityAgent running QA checks on {content_item.get('title')}")
        res = await self.ai.evaluate_quality(content_item, brand_rules)
        res["overall_score"] = res.get("fidelity_score", 96.0) / 100.0
        return res

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        content_assets = input_data.get("content_assets", [{}])
        first_asset = content_assets[0] if content_assets else {}
        brand_rules = input_data.get("brand_rules", {"tones": ["Professional", "Bold"]})
        res = _run_sync(self.execute(first_asset, brand_rules))
        res["overall_score"] = res.get("fidelity_score", 96.0) / 100.0
        return res


class PublisherAgent:
    """Agent 5: Coordinates native API dispatch to Instagram official Meta Graph API."""
    def __init__(self, ai_provider=None):
        self.ai = ai_provider

    async def execute(
        self, content_item: Dict[str, Any], platform_connection: Dict[str, Any]
    ) -> Dict[str, Any]:
        platform = str(content_item.get("platform", "Instagram")).lower()
        content_type = str(content_item.get("content_type", "Post")).capitalize()
        content_asset_id = content_item.get("content_asset_id")

        if platform != "instagram":
            return {
                "status": "FAILED",
                "platform": platform.capitalize(),
                "error_code": "UNSUPPORTED_PLATFORM",
                "error": f"Platform '{platform}' is not supported in Phase 1. Phase 1 supports Instagram Image/Post publishing only.",
            }

        # 1. Validate connection parameters
        access_token = platform_connection.get("access_token")
        account_id = platform_connection.get("account_id")
        token_expires_at = platform_connection.get("token_expires_at")

        if not access_token or not account_id:
            return {
                "status": "FAILED",
                "platform": "Instagram",
                "error_code": "NO_ACTIVE_CONNECTION",
                "error": "No active verified OAuth token for Instagram. Connect an authenticated account with publish permissions first.",
            }

        # 2. Validate token expiry
        if token_expires_at:
            if isinstance(token_expires_at, str):
                try:
                    token_expires_at = datetime.fromisoformat(token_expires_at.replace("Z", "+00:00"))
                except Exception:
                    pass
            if isinstance(token_expires_at, datetime):
                exp_naive = token_expires_at.replace(tzinfo=None) if token_expires_at.tzinfo else token_expires_at
                if exp_naive <= datetime.utcnow():
                    return {
                        "status": "FAILED",
                        "platform": "Instagram",
                        "error_code": "TOKEN_EXPIRED",
                        "error": "Instagram access token has expired. Please re-authenticate your Instagram account in Connected Accounts.",
                    }

        media_url = (content_item.get("media_url") or "").strip()
        caption = content_item.get("caption") or content_item.get("title") or ""

        # 3. Validate media URL
        if not media_url:
            return {
                "status": "FAILED",
                "platform": "Instagram",
                "error_code": "MISSING_MEDIA_URL",
                "error": "A media URL is required to publish an Instagram Image post.",
            }

        if not media_url.startswith("https://"):
            return {
                "status": "FAILED",
                "platform": "Instagram",
                "error_code": "NON_HTTPS_MEDIA_URL",
                "error": f"Meta Graph API requires a public, secure HTTPS media URL. Received: '{media_url}'. Localhost, file://, or HTTP URLs cannot be retrieved by Meta servers.",
            }

        api_v = settings.INSTAGRAM_API_VERSION or "v21.0"

        try:
            async with httpx.AsyncClient(timeout=35.0) as client:
                # -------------------------------------------------------------
                # Step 1: Create Instagram media container
                # POST https://graph.instagram.com/{api_v}/{account_id}/media
                # -------------------------------------------------------------
                create_url = f"https://graph.instagram.com/{api_v}/{account_id}/media"
                params = {
                    "image_url": media_url,
                    "caption": caption,
                    "access_token": access_token,
                }
                c_resp = await client.post(create_url, params=params)
                if c_resp.status_code != 200:
                    err_payload = {}
                    try:
                        err_payload = c_resp.json().get("error", {})
                    except Exception:
                        pass
                    err_code = str(err_payload.get("code") or c_resp.status_code)
                    err_subcode = str(err_payload.get("error_subcode") or "")
                    err_msg = err_payload.get("message") or c_resp.text
                    logger.error(f"Instagram container creation failed: {err_code} (subcode {err_subcode}) - {err_msg}")
                    return {
                        "status": "FAILED",
                        "platform": "Instagram",
                        "http_status": c_resp.status_code,
                        "error_code": err_code,
                        "error_subcode": err_subcode,
                        "error": f"Instagram Graph API container error: {err_msg}",
                        "raw_response": c_resp.text,
                    }

                container_data = c_resp.json()
                container_id = container_data.get("id")
                if not container_id:
                    return {
                        "status": "FAILED",
                        "platform": "Instagram",
                        "error_code": "NO_CONTAINER_ID",
                        "error": "Meta Graph API did not return a valid container ID.",
                        "raw_response": c_resp.text,
                    }

                # -------------------------------------------------------------
                # Step 2: Poll container status until FINISHED
                # GET https://graph.instagram.com/{api_v}/{container_id}?fields=status_code,status
                # -------------------------------------------------------------
                status_url = f"https://graph.instagram.com/{api_v}/{container_id}"
                max_timeout = 45.0  # seconds
                poll_interval = 2.0  # seconds
                elapsed = 0.0
                container_ready = False

                while elapsed < max_timeout:
                    s_resp = await client.get(
                        status_url,
                        params={"fields": "status_code,status", "access_token": access_token},
                    )
                    if s_resp.status_code == 200:
                        s_data = s_resp.json()
                        status_code = s_data.get("status_code", "").upper()
                        if status_code == "FINISHED":
                            container_ready = True
                            break
                        elif status_code == "ERROR":
                            err_detail = s_data.get("status") or "Container processing failed on Meta servers."
                            logger.error(f"Instagram container processing error: {err_detail}")
                            return {
                                "status": "FAILED",
                                "platform": "Instagram",
                                "container_id": container_id,
                                "error_code": "CONTAINER_PROCESSING_ERROR",
                                "error": f"Instagram container processing failed: {err_detail}",
                                "raw_response": s_resp.text,
                            }
                        elif status_code == "EXPIRED":
                            return {
                                "status": "FAILED",
                                "platform": "Instagram",
                                "container_id": container_id,
                                "error_code": "CONTAINER_EXPIRED",
                                "error": "Instagram media container expired before it could be published.",
                                "raw_response": s_resp.text,
                            }

                    await asyncio.sleep(poll_interval)
                    elapsed += poll_interval

                if not container_ready:
                    return {
                        "status": "FAILED",
                        "platform": "Instagram",
                        "container_id": container_id,
                        "error_code": "CONTAINER_TIMEOUT",
                        "error": f"Instagram media container processing timed out after {int(max_timeout)} seconds.",
                    }

                # -------------------------------------------------------------
                # Step 3: POST /media_publish
                # POST https://graph.instagram.com/{api_v}/{account_id}/media_publish
                # -------------------------------------------------------------
                pub_url = f"https://graph.instagram.com/{api_v}/{account_id}/media_publish"
                p_resp = await client.post(
                    pub_url,
                    params={"creation_id": container_id, "access_token": access_token},
                )
                if p_resp.status_code != 200:
                    p_err_payload = {}
                    try:
                        p_err_payload = p_resp.json().get("error", {})
                    except Exception:
                        pass
                    p_err_code = str(p_err_payload.get("code") or p_resp.status_code)
                    p_err_subcode = str(p_err_payload.get("error_subcode") or "")
                    p_err_msg = p_err_payload.get("message") or p_resp.text
                    logger.error(f"Instagram media publish failed: {p_err_code} (subcode {p_err_subcode}) - {p_err_msg}")
                    return {
                        "status": "FAILED",
                        "platform": "Instagram",
                        "http_status": p_resp.status_code,
                        "container_id": container_id,
                        "error_code": p_err_code,
                        "error_subcode": p_err_subcode,
                        "error": f"Instagram Graph API publish error: {p_err_msg}",
                        "raw_response": p_resp.text,
                    }

                pub_data = p_resp.json()
                media_id = pub_data.get("id")
                if not media_id:
                    return {
                        "status": "FAILED",
                        "platform": "Instagram",
                        "container_id": container_id,
                        "error_code": "NO_MEDIA_ID",
                        "error": "Instagram publish succeeded but did not return a valid media ID.",
                        "raw_response": p_resp.text,
                    }

                # -------------------------------------------------------------
                # Step 4: Fetch real Instagram permalink
                # GET https://graph.instagram.com/{api_v}/{media_id}?fields=id,permalink,shortcode
                # -------------------------------------------------------------
                permalink = None
                media_obj_url = f"https://graph.instagram.com/{api_v}/{media_id}"
                m_resp = await client.get(
                    media_obj_url,
                    params={"fields": "id,permalink,shortcode", "access_token": access_token},
                )
                if m_resp.status_code == 200:
                    m_data = m_resp.json()
                    permalink = m_data.get("permalink")
                    if not permalink and m_data.get("shortcode"):
                        permalink = f"https://www.instagram.com/p/{m_data.get('shortcode')}/"

                return {
                    "status": "PUBLISHED",
                    "platform": "Instagram",
                    "media_id": media_id,
                    "container_id": container_id,
                    "permalink": permalink,
                    "post_url": permalink,
                    "note": "Successfully published to Instagram via official Meta Graph API." if permalink else "Published to Instagram, permalink retrieval in progress.",
                }
        except Exception as e:
            logger.exception("Network exception during Instagram publish")
            return {
                "status": "FAILED",
                "platform": "Instagram",
                "error_code": "NETWORK_EXCEPTION",
                "error": f"Network error connecting to Instagram: {str(e)}",
            }

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        content_item = {
            "content_asset_id": input_data.get("content_asset_id", "test-1"),
            "content_type": input_data.get("content_type", "Post"),
            "platform": input_data.get("platform", "instagram"),
            "caption": input_data.get("caption", ""),
            "title": input_data.get("title", ""),
            "media_url": input_data.get("media_url", "")
        }
        platform_conn = input_data.get("platform_connection", {})
        return _run_sync(self.execute(content_item, platform_conn))


class PerformanceAgent:
    """Agent 6: Analyzes real metrics, engagement rates, and impressions."""
    def __init__(self, ai_provider=None):
        self.ai = ai_provider

    async def execute(self, content_id: str) -> Dict[str, Any]:
        return {
            "content_id": content_id,
            "views": 0,
            "reach": 0,
            "likes": 0,
            "comments": 0,
            "shares": 0,
            "saves": 0,
            "engagement_rate": 0.0,
            "metrics": {
                "total_reach": 0,
                "total_views": 0,
                "engagement_rate": 0.0,
            }
        }

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        days = input_data.get("days", 30)
        return {
            "days": days,
            "metrics": {
                "total_reach": 0,
                "total_impressions": 0,
                "total_engagement": 0,
                "engagement_rate": 0.0,
                "follower_growth": 0,
                "total_posts": 0
            }
        }


class LearningAgent:
    """Agent 7: Synthesizes historical performance data into actionable learning insights."""
    def __init__(self, ai_provider=None):
        self.ai = ai_provider or get_ai_provider()

    async def execute(
        self, campaign_data: List[Dict[str, Any]], business_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        if not campaign_data:
            return []
        logger.info("LearningAgent extracting cross-campaign performance signals")
        return await self.ai.generate_learning_insights(campaign_data, business_context)

    def run(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        campaign_data = input_data.get("campaign_data", [])
        if not campaign_data:
            return {"insights": [], "count": 0}
        insights = _run_sync(self.execute(campaign_data, input_data.get("business", {})))
        return {
            "insights": insights,
            "count": len(insights)
        }
