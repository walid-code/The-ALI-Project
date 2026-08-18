import base64
import time
from pathlib import Path
import httpx
from typing import Optional
from core.config import settings
from core.personality import SYSTEM_PROMPT

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"}


class LLMEngine:
    def __init__(self):
        self.base_url = settings.ollama_host
        self.model = settings.model_name
        self.client = httpx.Client(base_url=self.base_url, timeout=120)

    def _generate_url(self) -> str:
        return f"{self.base_url}/api/chat"

    @staticmethod
    def _extract_image_paths(text: str) -> tuple[str, list[str]]:
        parts = text.split()
        image_paths = []
        clean_parts = []
        for p in parts:
            path = Path(p.strip("\"'"))
            if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
                image_paths.append(str(path.resolve()))
            else:
                clean_parts.append(p)
        return " ".join(clean_parts), image_paths

    @staticmethod
    def _encode_image(image_path: str) -> str:
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")

    def _check_vision_support(self) -> bool:
        try:
            resp = self.client.post(
                f"{self.base_url}/api/show",
                json={"model": self.model},
            )
            if resp.status_code == 200:
                data = resp.json()
                modelfile = data.get("modelfile", "") or ""
                capabilities = data.get("capabilities", []) or []
                return "vision" in capabilities or "vision" in modelfile
        except Exception:
            pass
        return False

    def chat(
        self,
        message: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        stream: bool = False,
        context: Optional[list[dict]] = None,
        images: Optional[list[str]] = None,
        model: Optional[str] = None,
    ) -> dict:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        else:
            messages.append({"role": "system", "content": SYSTEM_PROMPT})

        if context:
            messages.extend(context)

        user_msg: dict = {"role": "user", "content": message}
        if images:
            encoded = [self._encode_image(img) for img in images]
            user_msg["images"] = encoded
        messages.append(user_msg)

        payload = {
            "model": model or self.model,
            "messages": messages,
            "temperature": temperature if temperature is not None else settings.temperature,
            "top_p": settings.top_p,
            "top_k": settings.top_k,
            "repeat_penalty": settings.repeat_penalty,
            "num_ctx": settings.context_window,
            "max_tokens": settings.max_tokens,
            "stream": stream,
        }

        start = time.perf_counter()
        response = self.client.post(self._generate_url(), json=payload)
        elapsed = time.perf_counter() - start

        if response.status_code == 400:
            err = response.json().get("error", "")
            if "image input is not supported" in err:
                raise ValueError(
                    "Cannot read image (this model does not support image input). "
                    "Inform the user."
                )
        response.raise_for_status()

        result = response.json()
        result["_wall_time_s"] = round(elapsed, 3)
        result["_request_model"] = payload["model"]
        result["_temperature"] = payload["temperature"]
        return result

    def chat_with_images(
        self,
        text: str,
        image_paths: list[str],
        system_prompt: Optional[str] = None,
        context: Optional[list[dict]] = None,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
    ) -> dict:
        if not self._check_vision_support():
            raise ValueError(
                "Cannot read image (this model does not support image input). "
                "Inform the user."
            )
        return self.chat(
            message=text,
            system_prompt=system_prompt,
            context=context,
            images=image_paths,
            model=model,
            temperature=temperature,
        )

    def chat_stream(self, message: str, system_prompt: Optional[str] = None):
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        else:
            messages.append({"role": "system", "content": SYSTEM_PROMPT})
        messages.append({"role": "user", "content": message})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": settings.temperature,
            "top_p": settings.top_p,
            "top_k": settings.top_k,
            "repeat_penalty": settings.repeat_penalty,
            "num_ctx": settings.context_window,
            "stream": True,
        }

        with self.client.stream("POST", self._generate_url(), json=payload) as response:
            response.raise_for_status()
            for line in response.iter_lines():
                if line:
                    yield line

    def check_health(self) -> bool:
        try:
            resp = self.client.get(f"{self.base_url}/api/tags")
            return resp.status_code == 200
        except Exception:
            return False

    def list_models(self) -> list[dict]:
        resp = self.client.get(f"{self.base_url}/api/tags")
        resp.raise_for_status()
        return resp.json().get("models", [])
