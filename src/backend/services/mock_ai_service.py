"""
MRStay AI
Mock AI Service
"""


class MockAIService:

    def generate(self, prompt: str):

        prompt = prompt.lower()

        if "hello" in prompt:
            answer = "Hello! Welcome to MRStay AI."

        elif "health" in prompt:
            answer = "System Health: 96%. All critical services are operational."

        elif "dashboard" in prompt:
            answer = "Executive Dashboard is working correctly."

        elif "rag" in prompt:
            answer = "RAG Pipeline is connected successfully."

        else:
            answer = (
                "Mock AI Response\n\n"
                "Gemini is temporarily unavailable.\n"
                "Backend services are running normally."
            )

        return {
            "success": True,
            "response": answer
        }


mock_ai_service = MockAIService()