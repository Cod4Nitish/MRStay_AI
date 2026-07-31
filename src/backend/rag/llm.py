import os
import google.generativeai as genai

class LLM:
    """
    Interface for the Large Language Model.
    Currently configured to use Gemini 1.5 Flash or Pro.
    """
    def __init__(self, api_key: str = None, model_name: str = "models/gemini-1.5-flash"):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model_name = model_name
        
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
            self.is_configured = True
        else:
            self.model = None
            self.is_configured = False

    def generate(self, prompt: str) -> str:
        """
        Sends the prompt to the LLM and returns the response.
        """
        if not self.is_configured:
            return "[Mock LLM Response] The Gemini API key is not configured. This is a simulated response based on the RAG context."

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating response: {str(e)}"
