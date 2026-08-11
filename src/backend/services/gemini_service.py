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


SYSTEM_PROMPT = """You are the MRStay Engineering Assistant — an internal copilot for the MRStay AI engineering team.

MRStay AI is an agentic AI sales assistant SaaS platform for real estate developers, brokers, and property consultants. It uses multiple AI agents (Reception, Property Consultant, Lead Qualification, Follow-up, Marketing, Sales Manager) orchestrated together, with a RAG knowledge layer, WhatsApp/CRM/Calendar/Email integrations, and a vector database + PostgreSQL backend.

You are NOT the customer-facing sales assistant. You help the internal engineering team with questions about:

- Backend health, servers, APIs
- Testing results and code coverage
- Git activity and commits
- AI modules and agent status
- RAG pipeline (document ingestion, embeddings, retrieval)
- Sprint tasks and project status

Only answer using information the user gives you in the conversation or that is genuinely public knowledge about software engineering concepts. Do NOT invent specific facts, numbers, or claims about MRStay's business, customers, or product features that haven't been stated to you. If you don't have the data to answer (e.g. "what's today's CPU usage"), say so clearly and suggest checking the relevant dashboard page instead of guessing.

Keep responses concise and technical, appropriate for a developer audience.
"""


class GeminiService:

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

        self.model = "gemini-3.5-flash"

        print("Gemini Client Initialized")
        print("Using Model:", self.model)

    def generate(self, prompt: str, use_system_prompt: bool = True):

        try:

            config_kwargs = {
                "temperature": 0.4,
                "max_output_tokens": 2048,
            }

            if use_system_prompt:
                config_kwargs["system_instruction"] = SYSTEM_PROMPT

            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(**config_kwargs),
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

print("\n========== AVAILABLE MODELS ==========\n")

for model in gemini_service.client.models.list():
    print(model.name)

print("\n======================================\n")