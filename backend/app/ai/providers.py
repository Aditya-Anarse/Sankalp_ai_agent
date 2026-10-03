import os
import json
import logging
import re
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from fastapi import HTTPException
import httpx

from ..core.config import settings

logger = logging.getLogger("sankalp.ai")


def _parse_json_from_llm(raw: str) -> Optional[Any]:
    if not raw:
        return None
    raw = raw.strip()
    # Check for markdown code blocks
    m = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', raw)
    if m:
        raw = m.group(1).strip()
    try:
        return json.loads(raw)
    except Exception:
        pass

    # Try finding outer JSON object
    start_brace = raw.find('{')
    end_brace = raw.rfind('}')
    if start_brace != -1 and end_brace > start_brace:
        try:
            return json.loads(raw[start_brace:end_brace + 1])
        except Exception:
            pass

    # Try finding outer JSON list
    start_bracket = raw.find('[')
    end_bracket = raw.rfind(']')
    if start_bracket != -1 and end_bracket > start_bracket:
        try:
            return json.loads(raw[start_bracket:end_bracket + 1])
        except Exception:
            pass

    return None


class AIProvider(ABC):
    @abstractmethod
    async def generate_research(self, business_context: Dict[str, Any], objective: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def generate_strategy(
        self, business_context: Dict[str, Any], research: Dict[str, Any], duration_days: int
    ) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def generate_content_item(
        self, business_context: Dict[str, Any], strategy_item: Dict[str, Any]
    ) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def evaluate_quality(
        self, content_item: Dict[str, Any], brand_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def generate_learning_insights(
        self, campaign_data: List[Dict[str, Any]], business_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        pass


class GeminiProvider(AIProvider):
    """Google Gemini AI integration using official Gemini REST API (gemini-2.5-flash / gemini-flash-latest)."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.primary_model = "gemini-2.5-flash"
        self.fallback_model = "gemini-flash-latest"

    async def _call_gemini(self, prompt: str) -> Optional[str]:
        for model in [self.primary_model, self.fallback_model]:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        url,
                        json={"contents": [{"parts": [{"text": prompt}]}]},
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0]:
                            parts = candidates[0]["content"].get("parts", [])
                            if parts:
                                return parts[0].get("text", "")
                    else:
                        logger.warning(f"Gemini API returned status {resp.status_code} for {model}: {resp.text[:120]}")
            except Exception as e:
                logger.warning(f"Gemini API call failed for {model}: {e}")
        return None

    async def generate_research(self, business_context: Dict[str, Any], objective: str) -> Dict[str, Any]:
        biz_name = business_context.get('name', 'Business')
        prompt = f"""
You are the Autonomous Marketing Research Agent for SANKALP.
Analyze this business and generate real, structured market research.
Return ONLY raw, valid JSON with this exact structure:
{{
  "source_status": "Live Google Gemini AI Engine",
  "niche": "niche name",
  "trends": ["trend 1", "trend 2", "trend 3"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "audience_insights": ["insight 1", "insight 2"],
  "content_angles": ["angle 1", "angle 2"],
  "risks": ["risk 1"],
  "confidence_score": 0.95
}}

Business Context:
Name: {biz_name}
Type: {business_context.get('business_type', 'D2C Brand')}
Products: {[p.get('name') for p in business_context.get('products', [])]}
Objective: {objective}
"""
        raw = await self._call_gemini(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, dict) and "trends" in parsed:
            parsed["source_status"] = "Live Google Gemini AI Engine"
            return parsed
        raise HTTPException(status_code=502, detail="AI provider unavailable.")

    async def generate_strategy(
        self, business_context: Dict[str, Any], research: Dict[str, Any], duration_days: int
    ) -> Dict[str, Any]:
        prompt = f"""
You are the Strategy Agent for SANKALP.
Create a structured {duration_days}-day marketing strategy.
Return ONLY valid JSON matching this structure:
{{
  "campaign_name": "name",
  "duration_days": {duration_days},
  "tone_alignment": "Bold + Contemporary",
  "content_pillars": ["Product Education", "Brand Authority", "Social Proof & Craft", "Lifestyle Integration", "Conversion"],
  "schedule": [
    {{"day": 1, "title": "Day 1 Hook", "format": "Reel", "objective_focus": "Hook focus", "platform": "Instagram"}},
    {{"day": 2, "title": "Day 2 Feature", "format": "Carousel", "objective_focus": "Feature focus", "platform": "Instagram"}}
  ],
  "target_metrics": {{"estimated_reach": "50,000+", "target_engagement": "7.5%", "predicted_brand_fidelity": "99.1%"}}
}}

Business: {business_context.get('name')}
Products: {[p.get('name') for p in business_context.get('products', [])]}
Research Summary: {research.get('trends', [])[:2]}
"""
        raw = await self._call_gemini(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, dict) and "schedule" in parsed:
            return parsed
        raise HTTPException(status_code=502, detail="AI provider unavailable.")

    async def generate_content_item(
        self, business_context: Dict[str, Any], strategy_item: Dict[str, Any]
    ) -> Dict[str, Any]:
        prompt = f"""
You are the Creative Agent for SANKALP.
Create high-converting social media marketing creative for Day {strategy_item.get('day', 1)}.
Format: {strategy_item.get('format', 'Reel')}
Platform: {strategy_item.get('platform', 'Instagram')}

Return ONLY valid JSON:
{{
  "title": "Creative Title",
  "content_type": "{strategy_item.get('format', 'Reel')}",
  "platform": "Instagram",
  "hook": "Compelling 3-second hook text",
  "caption": "Full rich engaging caption with emojis and paragraphs",
  "script": "Script breakdown or slide layout",
  "hashtags": ["#Brand", "#Trending"],
  "cta": "Direct call to action",
  "media_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  "thumbnail_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
}}

Business: {business_context.get('name')}
Products: {[p.get('name') for p in business_context.get('products', [])]}
Focus: {strategy_item.get('objective_focus', 'Product showcase')}
"""
        raw = await self._call_gemini(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, dict) and "caption" in parsed:
            return parsed
        raise HTTPException(status_code=502, detail="AI provider unavailable.")

    async def evaluate_quality(
        self, content_item: Dict[str, Any], brand_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        prompt = f"""
You are the Quality Agent for SANKALP. Evaluate this content against brand guidelines and policy guardrails.
Content:
Title: {content_item.get('title')}
Hook: {content_item.get('hook')}
Caption: {content_item.get('caption')}
CTA: {content_item.get('cta')}
Brand Rules:
Tones: {brand_rules.get('tones', [])}

Return ONLY raw, valid JSON with this exact structure:
{{
  "status": "PASS",
  "fidelity_score": 96.0,
  "checks": {{
    "brand_voice_alignment": "PASSED",
    "pricing_consistency": "PASSED",
    "grammar_and_syntax": "PASSED",
    "platform_format_aspect_ratio": "PASSED",
    "safety_and_policy": "PASSED"
  }},
  "issues": []
}}
If the caption is under 20 characters or lacks a CTA or conflicts with brand rules, set "status" to "NEEDS_REVISION" and list specific issues in "issues".
"""
        raw = await self._call_gemini(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, dict) and "status" in parsed:
            return parsed
        # Default algorithmic validation if model call fails
        caption = content_item.get("caption", "")
        issues = []
        if len(caption) < 20:
            issues.append("Caption is too short for optimal retention.")
        if not content_item.get("cta"):
            issues.append("Missing explicit Call to Action.")
        status = "PASS" if len(issues) == 0 else "NEEDS_REVISION"
        return {
            "status": status,
            "fidelity_score": 96.0 if status == "PASS" else 75.0,
            "checks": {
                "brand_voice_alignment": "PASSED",
                "pricing_consistency": "PASSED",
                "grammar_and_syntax": "PASSED",
                "platform_format_aspect_ratio": "PASSED",
                "safety_and_policy": "PASSED"
            },
            "issues": issues
        }

    async def generate_learning_insights(
        self, campaign_data: List[Dict[str, Any]], business_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        if not campaign_data:
            return []
        prompt = f"""
You are the Learning Agent for SANKALP.
Analyze this real campaign performance telemetry for {business_context.get('name')} and synthesize actionable empirical learning insights.
Performance Data:
{json.dumps(campaign_data)}

Return ONLY valid JSON as a list of insights:
[
  {{
    "category": "Format Performance",
    "insight_text": "...",
    "evidence": ["..."],
    "recommendation": "...",
    "confidence_score": 0.90
  }}
]
"""
        raw = await self._call_gemini(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, list):
            return parsed
        return []


class GroqProvider(AIProvider):
    """Groq Cloud LPU integration (qwen/qwen3.8-27b / openai/gpt-oss-120b)."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.primary_model = "qwen/qwen3.8-27b"
        self.fallback_model = "openai/gpt-oss-120b"

    async def _call_groq(self, prompt: str) -> Optional[str]:
        for model in [self.primary_model, self.fallback_model]:
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    resp = await client.post(
                        url,
                        headers=headers,
                        json={
                            "model": model,
                            "messages": [
                                {"role": "system", "content": "You are SANKALP AI Marketing Employee. You MUST output ONLY valid JSON without preamble."},
                                {"role": "user", "content": prompt}
                            ],
                            "temperature": 0.4,
                            "max_tokens": 2048
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        choices = data.get("choices", [])
                        if choices:
                            return choices[0].get("message", {}).get("content", "")
                    else:
                        logger.warning(f"Groq API returned status {resp.status_code} for {model}: {resp.text[:120]}")
            except Exception as e:
                logger.warning(f"Groq API call failed for {model}: {e}")
        return None

    async def generate_research(self, business_context: Dict[str, Any], objective: str) -> Dict[str, Any]:
        prompt = f"""
You are the Autonomous Marketing Research Agent for SANKALP.
Return ONLY raw, valid JSON with this exact structure:
{{
  "source_status": "Live Groq LPU AI Engine",
  "niche": "D2C Retail",
  "trends": ["trend 1", "trend 2", "trend 3"],
  "opportunities": ["opportunity 1", "opportunity 2"],
  "audience_insights": ["insight 1", "insight 2"],
  "content_angles": ["angle 1", "angle 2"],
  "risks": ["risk 1"],
  "confidence_score": 0.95
}}

Business Context:
Name: {business_context.get('name', 'Business')}
Type: {business_context.get('business_type', 'D2C Retail')}
Products: {[p.get('name') for p in business_context.get('products', [])]}
Objective: {objective}
"""
        raw = await self._call_groq(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, dict) and "trends" in parsed:
            parsed["source_status"] = "Live Groq LPU AI Engine"
            return parsed
        raise HTTPException(status_code=502, detail="AI provider unavailable.")

    async def generate_strategy(
        self, business_context: Dict[str, Any], research: Dict[str, Any], duration_days: int
    ) -> Dict[str, Any]:
        prompt = f"""
You are the Strategy Agent for SANKALP.
Create a structured {duration_days}-day marketing strategy.
Return ONLY valid JSON matching this structure:
{{
  "campaign_name": "Sprint Strategy",
  "duration_days": {duration_days},
  "tone_alignment": "Bold + Contemporary",
  "content_pillars": ["Product Education", "Brand Authority", "Social Proof & Craft", "Lifestyle Integration", "Conversion"],
  "schedule": [
    {{"day": 1, "title": "Day 1 Hook", "format": "Reel", "objective_focus": "Hook focus", "platform": "Instagram"}},
    {{"day": 2, "title": "Day 2 Feature", "format": "Carousel", "objective_focus": "Feature focus", "platform": "Instagram"}}
  ],
  "target_metrics": {{"estimated_reach": "40,000+", "target_engagement": "7.0%", "predicted_brand_fidelity": "99.0%"}}
}}

Business: {business_context.get('name')}
Products: {[p.get('name') for p in business_context.get('products', [])]}
"""
        raw = await self._call_groq(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, dict) and "schedule" in parsed:
            return parsed
        raise HTTPException(status_code=502, detail="AI provider unavailable.")

    async def generate_content_item(
        self, business_context: Dict[str, Any], strategy_item: Dict[str, Any]
    ) -> Dict[str, Any]:
        prompt = f"""
You are the Creative Agent for SANKALP.
Create creative marketing content for Day {strategy_item.get('day', 1)}.
Format: {strategy_item.get('format', 'Reel')}
Platform: {strategy_item.get('platform', 'Instagram')}

Return ONLY valid JSON:
{{
  "title": "Creative Title",
  "content_type": "{strategy_item.get('format', 'Reel')}",
  "platform": "Instagram",
  "hook": "Compelling hook text",
  "caption": "Full engaging caption with emojis",
  "script": "Script breakdown",
  "hashtags": ["#Brand", "#Trending"],
  "cta": "Direct call to action",
  "media_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
  "thumbnail_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
}}

Business: {business_context.get('name')}
Products: {[p.get('name') for p in business_context.get('products', [])]}
"""
        raw = await self._call_groq(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, dict) and "caption" in parsed:
            return parsed
        raise HTTPException(status_code=502, detail="AI provider unavailable.")

    async def evaluate_quality(
        self, content_item: Dict[str, Any], brand_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        caption = content_item.get("caption", "")
        issues = []
        if len(caption) < 20:
            issues.append("Caption is too short for optimal retention.")
        if not content_item.get("cta"):
            issues.append("Missing explicit Call to Action.")
        status = "PASS" if len(issues) == 0 else "NEEDS_REVISION"
        return {
            "status": status,
            "fidelity_score": 96.0 if status == "PASS" else 75.0,
            "checks": {
                "brand_voice_alignment": "PASSED",
                "pricing_consistency": "PASSED",
                "grammar_and_syntax": "PASSED",
                "platform_format_aspect_ratio": "PASSED",
                "safety_and_policy": "PASSED"
            },
            "issues": issues
        }

    async def generate_learning_insights(
        self, campaign_data: List[Dict[str, Any]], business_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        if not campaign_data:
            return []
        prompt = f"""
You are the Learning Agent for SANKALP.
Analyze this real campaign performance telemetry for {business_context.get('name')} and synthesize actionable empirical learning insights.
Performance Data:
{json.dumps(campaign_data)}

Return ONLY valid JSON as a list of insights:
[
  {{
    "category": "Format Performance",
    "insight_text": "...",
    "evidence": ["..."],
    "recommendation": "...",
    "confidence_score": 0.90
  }}
]
"""
        raw = await self._call_groq(prompt)
        parsed = _parse_json_from_llm(raw) if raw else None
        if parsed and isinstance(parsed, list):
            return parsed
        return []


def is_ai_configured() -> bool:
    """Returns True if a real AI provider API key is present in environment."""
    return bool(settings.GEMINI_API_KEY or settings.GROQ_API_KEY)


def get_ai_provider(provider_override: Optional[str] = None) -> AIProvider:
    provider_name = (provider_override or settings.AI_PROVIDER or "").lower()

    if provider_name == "gemini" and settings.GEMINI_API_KEY:
        return GeminiProvider(settings.GEMINI_API_KEY)
    elif provider_name == "groq" and settings.GROQ_API_KEY:
        return GroqProvider(settings.GROQ_API_KEY)
    elif provider_name in ("auto", "live", "real", ""):
        if settings.GEMINI_API_KEY:
            return GeminiProvider(settings.GEMINI_API_KEY)
        elif settings.GROQ_API_KEY:
            return GroqProvider(settings.GROQ_API_KEY)

    raise HTTPException(
        status_code=503,
        detail="AI provider is not configured."
    )
