class PromptBuilder:
    """
    Constructs the prompt for the LLM using the user query and
    retrieved context. Enforces strict document-grounding so the
    LLM never blends in outside/training knowledge, and handles
    the case where retrieved documents disagree with each other.
    """

    def __init__(self, system_prompt: str = None):
        self.system_prompt = system_prompt or (
            "You are MRStay AI, a real estate assistant.\n\n"
            "STRICT RULES — follow all of them:\n"
            "1. Answer ONLY using the information inside the CONTEXT "
            "below. Do not use any outside knowledge, general "
            "real-estate facts, or information about websites, "
            "companies, or listings not present in the CONTEXT.\n"
            "2. If the CONTEXT does not contain the answer, say "
            "exactly: \"I don't have that information in the "
            "provided documents.\" Do not guess.\n"
            "3. If the CONTEXT contains multiple different or "
            "conflicting values for the same fact (e.g. two "
            "different prices), do NOT pick one or average them. "
            "State clearly that the documents show conflicting "
            "values, list them, and recommend the user verify with "
            "the sales team.\n"
            "4. Never invent a source, website, or number that is "
            "not explicitly present in the CONTEXT.\n"
            "5. Keep the answer concise and directly relevant to "
            "the question."
        )

    def build(self, query: str, context: str) -> str:
        """
        Builds the final prompt string.
        """
        return (
            f"{self.system_prompt}\n\n"
            f"CONTEXT:\n{context}\n\n"
            f"USER QUESTION:\n{query}\n\n"
            f"ANSWER (grounded strictly in the CONTEXT above):\n"
        )