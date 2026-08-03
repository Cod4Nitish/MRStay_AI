"""
MRStay AI
Gemini Service (Latest Google GenAI SDK)
"""

from google import genai
from google.genai import types

from src.backend.config.settings import GEMINI_API_KEY


print("=" * 60)
print("MRStay AI - Gemini Service")
print("Using Google GenAI SDK")
print("Gemini Key Loaded:", GEMINI_API_KEY[:12] + "...")
print("=" * 60)


class GeminiService:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

        self.model = "gemini-2.5-flash-lite"

        print("Gemini Client Initialized")
        print("Using Model:", self.model)

    def generate(self, prompt: str):

        try:

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.4,
                    max_output_tokens=2048,
                ),
            )

            return {
                "success": True,
                "response": response.text
            }

        except Exception as e:

            import traceback
            traceback.print_exc()

            return {
                "success": False,
                "error": str(e)
            }


gemini_service = GeminiService() 