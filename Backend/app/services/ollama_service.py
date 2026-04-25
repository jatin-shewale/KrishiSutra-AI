import asyncio
from typing import Optional

import requests

from app.config import settings


def candidate_models() -> list[str]:
    models = [settings.OLLAMA_MODEL, "llama3", "llama3:8b"]
    unique_models = []
    for model in models:
        if model and model not in unique_models:
            unique_models.append(model)
    return unique_models


def _base_url() -> str:
    return settings.OLLAMA_BASE_URL.rstrip("/")


def generate_text(prompt: str, system: Optional[str] = None, timeout: int = 90) -> str:
    last_error = None

    for model in candidate_models():
        try:
            response = requests.post(
                f"{_base_url()}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "system": system,
                    "stream": False,
                },
                timeout=timeout,
            )
            response.raise_for_status()
            data = response.json()
            text = (data.get("response") or "").strip()
            if text:
                return text
        except Exception as exc:
            last_error = exc

    raise RuntimeError(f"Ollama request failed: {last_error}")


async def generate_text_async(prompt: str, system: Optional[str] = None, timeout: int = 90) -> str:
    return await asyncio.to_thread(generate_text, prompt, system, timeout)
