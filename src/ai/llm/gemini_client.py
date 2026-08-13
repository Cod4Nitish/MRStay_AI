import json
import logging
import os
import time
from typing import Any, Dict, List, Optional

from google import genai
from google.genai import types

logger = logging.getLogger(__name__)


class GeminiClient:
    """
    ==========================================================
    MRStay AI
    Enterprise Gemini LLM Client
    Centralized wrapper for all Gemini text-generation calls
    (used by agents, intent detection, RAG answer generation)
    ==========================================================
    """

    def __init__(
        self,
        api_key: str = None,
        model: str = "gemini-3.1-flash-lite",
        max_retries: int = 3,
        retry_delay: float = 1.5,
        default_temperature: float = 0.3
    ):

        self.api_key = api_key or os.getenv("GEMINI_API_KEY")

        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            raise ValueError(
                "GEMINI_API_KEY is missing or invalid. "
                "Set it in your .env file."
            )

        self.model = model
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.default_temperature = default_temperature

        self.client = genai.Client(api_key=self.api_key)

        self.stats = {
            "total_requests": 0,
            "total_retries": 0,
            "total_failures": 0,
            "total_json_parse_failures": 0
        }

        logger.info("=" * 60)
        logger.info("Initializing Gemini Client")
        logger.info(f"Model : {self.model}")
        logger.info("=" * 60)

    # ======================================================
    # Core Generation
    # ======================================================

    def generate(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: Optional[float] = None,
        max_output_tokens: int = 1024
    ) -> str:
        """
        Generates plain text output from Gemini.
        Retries on transient failures with exponential backoff.
        """

        self.stats["total_requests"] += 1

        config = types.GenerateContentConfig(
            temperature=(
                temperature
                if temperature is not None
                else self.default_temperature
            ),
            max_output_tokens=max_output_tokens,
            system_instruction=system_instruction
        )

        for attempt in range(1, self.max_retries + 1):

            try:

                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=config
                )

                if not response or not response.text:
                    raise ValueError("Empty response from Gemini.")

                return response.text.strip()

            except Exception as e:

                self.stats["total_retries"] += 1

                logger.warning(
                    f"Gemini generate attempt {attempt}/{self.max_retries} "
                    f"failed: {e}"
                )

                if attempt == self.max_retries:
                    self.stats["total_failures"] += 1
                    logger.exception(e)
                    raise

                time.sleep(self.retry_delay * attempt)

    # ======================================================
    # Structured JSON Generation
    # ======================================================

    def generate_json(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.0,
        max_output_tokens: int = 512
    ) -> Dict[str, Any]:
        """
        Generates output constrained to strict JSON.
        Used for intent detection, structured extraction, routing decisions.
        Strips markdown code fences defensively before parsing.
        """

        json_instruction = (
            (system_instruction or "")
            + "\n\nIMPORTANT: Respond with ONLY valid JSON. "
              "No markdown, no code fences, no explanation text."
        )

        raw_text = self.generate(
            prompt=prompt,
            system_instruction=json_instruction,
            temperature=temperature,
            max_output_tokens=max_output_tokens
        )

        cleaned = (
            raw_text
            .strip()
            .removeprefix("```json")
            .removeprefix("```")
            .removesuffix("```")
            .strip()
        )

        try:
            return json.loads(cleaned)

        except json.JSONDecodeError as e:

            self.stats["total_json_parse_failures"] += 1

            logger.error(
                f"Failed to parse JSON from Gemini response: {e}\n"
                f"Raw response: {raw_text}"
            )

            raise ValueError(
                f"Gemini did not return valid JSON: {raw_text[:200]}"
            )

    # ======================================================
    # Multi-turn Chat (for future conversation memory use)
    # ======================================================

    def chat(
        self,
        messages: List[Dict[str, str]],
        system_instruction: Optional[str] = None,
        temperature: Optional[float] = None
    ) -> str:
        """
        messages: [{"role": "user"/"model", "content": "..."}]
        """

        self.stats["total_requests"] += 1

        contents = [
            types.Content(
                role=m["role"],
                parts=[types.Part.from_text(text=m["content"])]
            )
            for m in messages
        ]

        config = types.GenerateContentConfig(
            temperature=(
                temperature
                if temperature is not None
                else self.default_temperature
            ),
            system_instruction=system_instruction
        )

        for attempt in range(1, self.max_retries + 1):

            try:

                response = self.client.models.generate_content(
                    model=self.model,
                    contents=contents,
                    config=config
                )

                return response.text.strip()

            except Exception as e:

                self.stats["total_retries"] += 1

                logger.warning(
                    f"Gemini chat attempt {attempt}/{self.max_retries} "
                    f"failed: {e}"
                )

                if attempt == self.max_retries:
                    self.stats["total_failures"] += 1
                    logger.exception(e)
                    raise

                time.sleep(self.retry_delay * attempt)

    # ======================================================
    # Health Check
    # ======================================================

    def health(self) -> Dict[str, Any]:

        try:

            test = self.generate(
                "Reply with the single word: OK",
                max_output_tokens=10
            )

            return {
                "success": True,
                "model": self.model,
                "test_response": test
            }

        except Exception as e:

            logger.exception(e)

            return {
                "success": False,
                "error": str(e)
            }

    # ======================================================
    # Statistics
    # ======================================================

    def statistics(self) -> Dict[str, Any]:

        return {
            **self.stats,
            "model": self.model
        }