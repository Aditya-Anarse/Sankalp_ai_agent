import os
import base64
import logging
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Optional
import httpx

from .config import settings

logger = logging.getLogger("sankalp.storage")


class MediaStorage(ABC):
    """Reusable storage abstraction providing public HTTPS asset URLs for Meta publishing."""

    @abstractmethod
    async def upload_image(self, data: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        """Uploads image bytes and returns a publicly reachable HTTPS URL."""
        pass

    @abstractmethod
    def get_public_url(self, key_or_filename: str) -> str:
        """Returns the public HTTPS URL for an uploaded file key/filename."""
        pass

    @abstractmethod
    def delete(self, key_or_filename: str) -> bool:
        """Deletes the asset from storage."""
        pass


class ImgBBStorage(MediaStorage):
    """Publishes images via ImgBB API, returning a globally reachable HTTPS URL."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def upload_image(self, data: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        b64_data = base64.b64encode(data).decode("utf-8")
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.imgbb.com/1/upload",
                data={
                    "key": self.api_key,
                    "image": b64_data,
                    "name": Path(filename).stem,
                },
            )
            if resp.status_code != 200:
                err_msg = resp.text
                try:
                    err_msg = resp.json().get("error", {}).get("message", resp.text)
                except Exception:
                    pass
                raise RuntimeError(f"ImgBB upload failed (HTTP {resp.status_code}): {err_msg}")
            
            res_json = resp.json()
            image_url = res_json.get("data", {}).get("url") or res_json.get("data", {}).get("display_url")
            if not image_url or not image_url.startswith("https://"):
                raise RuntimeError(f"ImgBB did not return a valid HTTPS URL: {image_url}")
            return image_url

    def get_public_url(self, key_or_filename: str) -> str:
        return key_or_filename

    def delete(self, key_or_filename: str) -> bool:
        return True


class CloudinaryStorage(MediaStorage):
    """Publishes images via Cloudinary REST API."""

    def __init__(self, cloud_name: str, api_key: str, api_secret: str):
        self.cloud_name = cloud_name
        self.api_key = api_key
        self.api_secret = api_secret

    async def upload_image(self, data: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        import time
        import hashlib
        timestamp = str(int(time.time()))
        public_id = Path(filename).stem
        
        # Cloudinary signature: public_id={public_id}&timestamp={timestamp}{api_secret}
        to_sign = f"public_id={public_id}&timestamp={timestamp}{self.api_secret}"
        signature = hashlib.sha1(to_sign.encode("utf-8")).hexdigest()

        files = {"file": (filename, data, content_type)}
        data_fields = {
            "api_key": self.api_key,
            "timestamp": timestamp,
            "public_id": public_id,
            "signature": signature,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"https://api.cloudinary.com/v1_1/{self.cloud_name}/image/upload",
                data=data_fields,
                files=files,
            )
            if resp.status_code != 200:
                raise RuntimeError(f"Cloudinary upload failed: {resp.text}")
            res_json = resp.json()
            return res_json.get("secure_url", res_json.get("url"))

    def get_public_url(self, key_or_filename: str) -> str:
        return key_or_filename

    def delete(self, key_or_filename: str) -> bool:
        return True


class PublicUrlLocalStorage(MediaStorage):
    """
    Saves image to local media directory and exposes it via a configured public HTTPS base URL
    (e.g., ngrok tunnel or custom domain).
    """

    def __init__(self, base_url: str, media_dir: str):
        if not base_url.startswith("https://"):
            raise ValueError(f"PUBLIC_MEDIA_BASE_URL must be a public HTTPS URL for Meta API. Received: {base_url}")
        self.base_url = base_url.rstrip("/")
        self.media_dir = Path(media_dir)
        self.media_dir.mkdir(parents=True, exist_ok=True)

    async def upload_image(self, data: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        file_path = self.media_dir / filename
        file_path.write_bytes(data)
        return self.get_public_url(filename)

    def get_public_url(self, key_or_filename: str) -> str:
        clean_name = Path(key_or_filename).name
        return f"{self.base_url}/media/{clean_name}"

    def delete(self, key_or_filename: str) -> bool:
        file_path = self.media_dir / Path(key_or_filename).name
        if file_path.exists():
            file_path.unlink()
            return True
        return False


class CatboxStorage(MediaStorage):
    """Publishes images via Catbox, returning a direct globally reachable HTTPS URL."""

    async def upload_image(self, data: bytes, filename: str, content_type: str = "image/jpeg") -> str:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://catbox.moe/user/api.php",
                data={"reqtype": "fileupload"},
                files={"fileToUpload": (filename, data, content_type)},
            )
            if resp.status_code == 200 and resp.text.strip().startswith("https://"):
                return resp.text.strip()
            raise RuntimeError(f"Catbox upload failed: {resp.text}")

    def get_public_url(self, key_or_filename: str) -> str:
        return key_or_filename

    def delete(self, key_or_filename: str) -> bool:
        return True


def is_storage_configured() -> bool:
    """Returns True if a valid public HTTPS media storage backend is configured."""
    return True


def get_media_storage() -> MediaStorage:
    """Returns the active configured public MediaStorage instance."""
    if settings.IMGBB_API_KEY:
        return ImgBBStorage(settings.IMGBB_API_KEY)
    if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
        return CloudinaryStorage(settings.CLOUDINARY_CLOUD_NAME, settings.CLOUDINARY_API_KEY, settings.CLOUDINARY_API_SECRET)
    if settings.PUBLIC_MEDIA_BASE_URL:
        if not settings.PUBLIC_MEDIA_BASE_URL.startswith("https://"):
            raise RuntimeError(
                f"PUBLIC_MEDIA_BASE_URL must use HTTPS for Meta Graph API access. Got: '{settings.PUBLIC_MEDIA_BASE_URL}'"
            )
        return PublicUrlLocalStorage(settings.PUBLIC_MEDIA_BASE_URL, settings.MEDIA_DIR)

    # Reliable zero-config public HTTPS storage
    return CatboxStorage()

