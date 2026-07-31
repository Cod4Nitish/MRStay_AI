class PromptBuilder:
    """
    Constructs the prompt for the LLM using the user query and retrieved context.
    """
    def __init__(self, system_prompt: str = None):
        self.system_prompt = system_prompt or (
            "You are MRStay AI, a helpful and knowledgeable assistant. "
            "Use the provided context to answer the user's question accurately. "
            "If the answer is not contained in the context, say that you don't know based on the provided documents. "
            "Do not make up information."
        )

    def build(self, query: str, context: str) -> str:
        """
        Builds the final prompt string.
        """
        return f"{self.system_prompt}\n\nCONTEXT:\n{context}\n\nUSER QUESTION:\n{query}\n\nANSWER:\n"
