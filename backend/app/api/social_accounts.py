import json
import time
import uuid
import logging
import urllib.parse
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx

from ..database.database import get_db
from ..models.models import SocialAccount, Business, User
from .auth import get_optional_current_user
from ..core.config import settings

logger = logging.getLogger("sankalp.social")

router = APIRouter(prefix="/social-accounts", tags=["Connected Social Accounts"])


def get_current_business(db: Session, current_user: Optional[User]) -> Optional[Business]:
    if current_user:
        biz = db.query(Business).filter(Business.owner_id == current_user.id).first()
        if biz:
            return biz
    return db.query(Business).first()


@router.get("")
def get_social_accounts(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    business = get_current_business(db, current_user)
    if not business:
        return []

    # Return ONLY actual verified accounts belonging to this business
    accounts = db.query(SocialAccount).filter(
        SocialAccount.business_id == business.id,
        SocialAccount.is_connected == True
    ).all()

    res = []
    for a in accounts:
        # Determine honest production state: CONNECTED, EXPIRED, or ERROR
        has_token = bool(a.access_token)
        is_expired = bool(a.token_expires_at and a.token_expires_at <= datetime.utcnow())
        
        if has_token and not is_expired:
            account_status = "CONNECTED"
            status_message = "Connected via Official API"
        elif is_expired:
            account_status = "EXPIRED"
            status_message = "Access token expired. Re-authentication required."
        else:
            account_status = "NOT_CONNECTED"
            status_message = "Not connected"

        res.append({
            "id": a.id,
            "platform": a.platform,
            "account_name": a.account_name,
            "account_id": a.account_id,
            "is_connected": a.is_connected and not is_expired,
            "status": account_status,
            "has_real_token": has_token and not is_expired,
            "permissions": a.permissions or [],
            "last_synced_at": a.last_synced_at.isoformat() if a.last_synced_at else None,
            "status_message": status_message
        })
    return res


@router.get("/diagnostics")
async def get_social_diagnostics():
    """Performs live connectivity verification against Meta Graph API and Google APIs."""
    ig_status = {"configured": False, "meta_app_verified": False, "app_name": None, "error": None}
    yt_status = {"configured": False, "google_oauth_verified": False, "error": None}

    # 1. Test Instagram / Meta App Configuration
    if settings.INSTAGRAM_CLIENT_ID and settings.INSTAGRAM_CLIENT_SECRET:
        ig_status["configured"] = True
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(
                    "https://graph.facebook.com/oauth/access_token",
                    params={
                        "client_id": settings.INSTAGRAM_CLIENT_ID,
                        "client_secret": settings.INSTAGRAM_CLIENT_SECRET,
                        "grant_type": "client_credentials"
                    }
                )
                if resp.status_code == 200:
                    ig_status["meta_app_verified"] = True
                    app_token = resp.json().get("access_token")
                    app_resp = await client.get(
                        f"https://graph.facebook.com/{settings.INSTAGRAM_CLIENT_ID}?access_token={app_token}&fields=id,name"
                    )
                    if app_resp.status_code == 200:
                        ig_status["app_name"] = app_resp.json().get("name")
                else:
                    err = resp.json().get("error", {})
                    ig_status["error"] = err.get("message", "Meta client_credentials verification failed")
        except Exception as e:
            ig_status["error"] = f"Meta connection error: {str(e)}"

    # 2. Test YouTube / Google OAuth Configuration
    yt_client_id = settings.sanitized_youtube_client_id
    if yt_client_id and settings.YOUTUBE_CLIENT_SECRET:
        yt_status["configured"] = True
        try:
            auth_url = (
                f"https://accounts.google.com/o/oauth2/v2/auth?client_id={yt_client_id}"
                f"&redirect_uri={settings.YOUTUBE_REDIRECT_URI}&response_type=code"
                f"&scope=https://www.googleapis.com/auth/youtube.readonly&access_type=offline"
            )
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=False) as client:
                resp = await client.get(auth_url)
                if resp.status_code in (200, 302):
                    yt_status["google_oauth_verified"] = True
                else:
                    yt_status["error"] = f"Google OAuth init status {resp.status_code}"
        except Exception as e:
            yt_status["error"] = f"Google OAuth error: {str(e)}"

    return {
        "instagram": ig_status,
        "youtube": yt_status,
        "description": "Real OAuth configuration state. Live accounts require user authentication."
    }


# ==========================================
# META / INSTAGRAM OAUTH FLOW
# ==========================================

@router.get("/instagram/oauth-debug")
def instagram_oauth_debug():
    """Diagnostic endpoint displaying safe OAuth parameters and exact generated authorization URL without secrets."""
    client_id_masked = f"{settings.INSTAGRAM_CLIENT_ID[:4]}...{settings.INSTAGRAM_CLIENT_ID[-4:]}" if settings.INSTAGRAM_CLIENT_ID and len(settings.INSTAGRAM_CLIENT_ID) > 8 else "***"
    scopes = "instagram_business_basic,instagram_business_content_publish"
    params = {
        "client_id": settings.INSTAGRAM_CLIENT_ID or "",
        "redirect_uri": settings.INSTAGRAM_REDIRECT_URI,
        "response_type": "code",
        "scope": scopes,
    }
    encoded_query = urllib.parse.urlencode(params)
    full_auth_url = f"https://www.instagram.com/oauth/authorize?{encoded_query}"
    
    return {
        "INSTAGRAM_CLIENT_ID": client_id_masked,
        "Generated_redirect_uri": settings.INSTAGRAM_REDIRECT_URI,
        "Registered_redirect_uri": "http://localhost:8000/social-accounts/instagram/callback",
        "OAuth_endpoint": "https://www.instagram.com/oauth/authorize",
        "OAuth_host": "www.instagram.com",
        "Scope": scopes,
        "Frontend_URL": "http://localhost:3000/connected-accounts",
        "Backend_URL": "http://localhost:8000/social-accounts/instagram/callback",
        "Token_exchange_endpoint": "https://api.instagram.com/oauth/access_token",
        "Token_exchange_redirect_uri": settings.INSTAGRAM_REDIRECT_URI,
        "Encoded_redirect_uri_in_query": urllib.parse.quote(settings.INSTAGRAM_REDIRECT_URI, safe=""),
        "Decoded_redirect_uri_verification": urllib.parse.unquote(urllib.parse.quote(settings.INSTAGRAM_REDIRECT_URI, safe="")),
        "Complete_authorization_url": full_auth_url
    }


@router.get("/instagram/authorize")
def authorize_instagram(redirect: bool = False):
    """Generates official Instagram API with Instagram Login OAuth URL."""
    if not settings.INSTAGRAM_CLIENT_ID:
        raise HTTPException(status_code=400, detail="INSTAGRAM_CLIENT_ID not configured in environment")

    scopes = "instagram_business_basic,instagram_business_content_publish"
    client_id_masked = f"{settings.INSTAGRAM_CLIENT_ID[:4]}...{settings.INSTAGRAM_CLIENT_ID[-4:]}" if settings.INSTAGRAM_CLIENT_ID and len(settings.INSTAGRAM_CLIENT_ID) > 8 else "***"

    # Safe development debug logging per specification (Section 1)
    print("\n" + "=" * 50)
    print("INSTAGRAM OAUTH DEBUG")
    print("-" * 21)
    print(f"Client ID: {client_id_masked}")
    print(f"Redirect URI: {settings.INSTAGRAM_REDIRECT_URI}")
    print("OAuth Host: www.instagram.com")
    print(f"Scopes: {scopes}")
    print("=" * 50 + "\n", flush=True)

    logger.info(
        f"INSTAGRAM OAUTH DEBUG | Client ID: {client_id_masked} | "
        f"Redirect URI: {settings.INSTAGRAM_REDIRECT_URI} | "
        f"OAuth Host: www.instagram.com | Scopes: {scopes}"
    )

    # Encode query parameters exactly once (Section 8 & 9)
    params = {
        "client_id": settings.INSTAGRAM_CLIENT_ID,
        "redirect_uri": settings.INSTAGRAM_REDIRECT_URI,
        "response_type": "code",
        "scope": scopes,
    }
    encoded_query = urllib.parse.urlencode(params)
    url = f"https://www.instagram.com/oauth/authorize?{encoded_query}"

    if redirect:
        return RedirectResponse(url=url, status_code=307)
    return {"oauth_url": url, "platform": "instagram", "scopes": scopes.split(",")}


@router.get("/instagram/callback")
async def instagram_callback(
    code: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    error_description: Optional[str] = Query(None),
    error_reason: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Handles Instagram Login OAuth redirect.
    Flow: Authorize -> OAuth callback -> authorization code -> token exchange -> account lookup -> token validation -> save account -> Connected.
    If any step fails: show actual failure honestly. Never mark connected before successful validation.
    """
    if error or not code:
        err_msg = error_description or error_reason or error or "Authorization code missing"
        logger.warning(f"Instagram OAuth authorization failed: {err_msg}")
        return RedirectResponse(url=f"http://localhost:3000/connected-accounts?error={err_msg}")

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            # 1. Exchange authorization code for access token
            token_resp = await client.post(
                "https://api.instagram.com/oauth/access_token",
                data={
                    "client_id": settings.INSTAGRAM_CLIENT_ID,
                    "client_secret": settings.INSTAGRAM_CLIENT_SECRET,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.INSTAGRAM_REDIRECT_URI,
                    "code": code
                }
            )
            if token_resp.status_code != 200:
                try:
                    err_payload = token_resp.json()
                    err_detail = err_payload.get("error_message") or err_payload.get("error", {}).get("message") or "Token exchange failed"
                except Exception:
                    err_detail = f"HTTP {token_resp.status_code} during token exchange"
                logger.error(f"Instagram token exchange error: {err_detail}")
                return RedirectResponse(url=f"http://localhost:3000/connected-accounts?error={err_detail}")

            token_data = token_resp.json()
            short_token = token_data.get("access_token")
            user_id = token_data.get("user_id")

            if not short_token:
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=token_missing")

            # 2. Exchange for long-lived token (60 days)
            final_token = short_token
            try:
                long_resp = await client.get(
                    "https://graph.instagram.com/access_token",
                    params={
                        "grant_type": "ig_exchange_token",
                        "client_secret": settings.INSTAGRAM_CLIENT_SECRET,
                        "access_token": short_token
                    }
                )
                if long_resp.status_code == 200:
                    final_token = long_resp.json().get("access_token", short_token)
            except Exception as ex:
                logger.warning(f"Long-lived token exchange notice: {ex}")

            # 3. Lookup connected Instagram account profile
            me_resp = await client.get(
                f"https://graph.instagram.com/{settings.INSTAGRAM_API_VERSION}/me",
                params={
                    "fields": "id,username,name,account_type",
                    "access_token": final_token
                }
            )
            if me_resp.status_code != 200:
                me_resp = await client.get(
                    "https://graph.instagram.com/me",
                    params={
                        "fields": "id,username,name,account_type",
                        "access_token": final_token
                    }
                )

            if me_resp.status_code != 200:
                err_msg = me_resp.json().get("error", {}).get("message", "Profile lookup rejected by Meta API")
                logger.error(f"Instagram profile lookup error: {err_msg}")
                return RedirectResponse(url=f"http://localhost:3000/connected-accounts?error={err_msg}")

            profile_data = me_resp.json()
            ig_acc_id = profile_data.get("id") or (str(user_id) if user_id else None)
            ig_username = profile_data.get("username") or profile_data.get("name")

            if not ig_acc_id or not ig_username:
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=failed_to_identify_instagram_account")

            # 4. Save to database ONLY upon verified authorization & real account identification
            business = db.query(Business).first()
            if not business:
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=no_business_found")

            sa = db.query(SocialAccount).filter(
                SocialAccount.business_id == business.id,
                SocialAccount.platform == "instagram"
            ).first()
            if not sa:
                sa = SocialAccount(id=f"soc_ig_{uuid.uuid4().hex[:8]}", business_id=business.id, platform="instagram")
                db.add(sa)

            sa.account_name = f"@{ig_username.lstrip('@')}"
            sa.account_id = str(ig_acc_id)
            sa.is_connected = True
            sa.access_token = final_token
            sa.token_expires_at = datetime.utcnow() + timedelta(days=60)
            sa.permissions_json = json.dumps(["instagram_business_basic", "instagram_business_content_publish"])
            sa.last_synced_at = datetime.utcnow()
            db.commit()

        return RedirectResponse(url="http://localhost:3000/connected-accounts?status=instagram_success")
    except Exception as e:
        logger.error(f"Instagram callback exception: {str(e)}")
        return RedirectResponse(url=f"http://localhost:3000/connected-accounts?error={str(e)}")


# ==========================================
# GOOGLE / YOUTUBE OAUTH FLOW
# ==========================================

@router.get("/youtube/authorize")
def authorize_youtube(redirect: bool = False):
    """Generates official Google OAuth 2.0 authorization URL for YouTube."""
    yt_cid = settings.sanitized_youtube_client_id
    if not yt_cid:
        raise HTTPException(status_code=400, detail="YOUTUBE_CLIENT_ID not configured in environment")

    scopes = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly"
    url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={yt_cid}"
        f"&redirect_uri={settings.YOUTUBE_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope={scopes}"
        f"&access_type=offline"
        f"&prompt=consent"
    )
    if redirect:
        return RedirectResponse(url=url, status_code=307)
    return {"oauth_url": url, "platform": "youtube", "scopes": scopes.split(" ")}


@router.get("/youtube/callback")
async def youtube_callback(
    code: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Handles Google OAuth redirect, exchanges code for access token, looks up channel, and persists real account."""
    if error or not code:
        err_msg = error or "Authorization code missing"
        return RedirectResponse(url=f"http://localhost:3000/connected-accounts?error={err_msg}")

    yt_cid = settings.sanitized_youtube_client_id
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            token_resp = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": yt_cid,
                    "client_secret": settings.YOUTUBE_CLIENT_SECRET,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": settings.YOUTUBE_REDIRECT_URI
                }
            )
            if token_resp.status_code != 200:
                logger.error(f"Google token exchange error: {token_resp.text}")
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=google_token_exchange_failed")

            t_data = token_resp.json()
            access_token = t_data.get("access_token")

            # Look up authenticated channel
            ch_resp = await client.get(
                "https://www.googleapis.com/youtube/v3/channels",
                headers={"Authorization": f"Bearer {access_token}"},
                params={"part": "snippet,statistics", "mine": "true"}
            )
            if ch_resp.status_code != 200:
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=youtube_channel_lookup_failed")

            items = ch_resp.json().get("items", [])
            if not items:
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=no_youtube_channel_found")

            channel_title = items[0].get("snippet", {}).get("title")
            channel_id = items[0].get("id")

            if not channel_title or not channel_id:
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=invalid_channel_data")

            business = db.query(Business).first()
            if not business:
                return RedirectResponse(url="http://localhost:3000/connected-accounts?error=no_business_found")

            sa = db.query(SocialAccount).filter(
                SocialAccount.business_id == business.id,
                SocialAccount.platform == "youtube"
            ).first()
            if not sa:
                sa = SocialAccount(id=f"soc_yt_{uuid.uuid4().hex[:8]}", business_id=business.id, platform="youtube")
                db.add(sa)

            sa.account_name = channel_title
            sa.account_id = channel_id
            sa.is_connected = True
            sa.access_token = access_token
            sa.last_synced_at = datetime.utcnow()
            db.commit()

        return RedirectResponse(url="http://localhost:3000/connected-accounts?status=youtube_success")
    except Exception as e:
        logger.error(f"YouTube callback exception: {e}")
        return RedirectResponse(url=f"http://localhost:3000/connected-accounts?error={str(e)}")


@router.delete("/{account_id}")
def disconnect_social_account(
    account_id: str,
    db: Session = Depends(get_db)
):
    account = db.query(SocialAccount).filter(SocialAccount.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Social account not found")

    account.is_connected = False
    account.access_token = None
    db.commit()

    return {"status": "disconnected", "message": f"{account.platform.capitalize()} account disconnected."}
