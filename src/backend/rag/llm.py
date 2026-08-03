import os

from google import genai
from google.genai import types


class LLM:
    """
    Interface for the Large Language Model.
    Uses Google GenAI SDK.
    """

    def __init__(
        self,
        api_key: str = None,
        model_name="gemini-3.5-flash"
    ):

        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name

        if self.api_key and self.api_key != "your_gemini_api_key_here":

            self.client = genai.Client(
                api_key=self.api_key
            )

            self.is_configured = True

            print("LLM initialized using Gemini")

        else:

            self.client = None
            self.is_configured = False

            print("Gemini API Key not found.")

    def generate(self, prompt: str) -> str:

        if not self.is_configured:

            return (
                "[Mock LLM Response] "
                "Gemini API Key not configured."
            )

        try:

            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=2048,
                ),
            )

            return response.text

        except Exception as e:

            return f"Error generating response: {str(e)}"