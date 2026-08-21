/**
 * ============================================================
 * MRStay AI
 * Gemini Service
 * ============================================================
 */

import apiClient from "../core/apiClient.js";

class GeminiService {

    /**
     * Send Prompt to Gemini
     * @param {string} prompt
     * @returns {Promise<Object>}
     */
    async generate(prompt) {

        if (!prompt || prompt.trim().length === 0) {
            throw new Error("Prompt cannot be empty.");
        }

        return await apiClient.request("/api/rag/query", {
            method: "POST",
            body: JSON.stringify({
                question: prompt.trim()
            })
        });

    }

}

export default new GeminiService();