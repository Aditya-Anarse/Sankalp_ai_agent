import pytest
import io
from PIL import Image
from unittest.mock import patch, MagicMock

from app.ai.providers import LocalImageProvider, get_image_provider
from app.core.config import settings


def test_local_image_provider_initialization():
    """Verify provider initializes with default model name and maps to official Hugging Face repo."""
    provider = LocalImageProvider()
    assert provider.model_name in ("sd-turbo", "stabilityai/sd-turbo")
    assert provider.repo_id == "stabilityai/sd-turbo"


def test_local_image_provider_availability():
    """Verify provider detects torch and diffusers availability."""
    provider = LocalImageProvider()
    assert provider.is_available() is True


def test_local_image_provider_factory():
    """Verify factory returns LocalImageProvider when IMAGE_PROVIDER is 'local'."""
    with patch.object(settings, "IMAGE_PROVIDER", "local"):
        provider = get_image_provider()
        assert isinstance(provider, LocalImageProvider)


def test_local_image_provider_generate_image_structure():
    """Test LocalImageProvider with a mock pipeline to verify async execution and byte formatting."""
    import asyncio

    async def _run_test():
        mock_pipeline = MagicMock()
        mock_img = Image.new("RGB", (512, 512), color="red")
        mock_output = MagicMock()
        mock_output.images = [mock_img]
        mock_pipeline.return_value = mock_output

        provider = LocalImageProvider()
        with patch.object(provider, "_get_pipeline", return_value=mock_pipeline):
            image_bytes = await provider.generate_image("A test prompt")
            assert isinstance(image_bytes, bytes)
            assert len(image_bytes) > 0

            # Verify Pillow can load the resulting bytes and dimensions match
            loaded_img = Image.open(io.BytesIO(image_bytes))
            assert loaded_img.size == (512, 512)
            assert loaded_img.format == "JPEG"

    asyncio.run(_run_test())
