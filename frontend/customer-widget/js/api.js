// ==========================================================
// MRStay AI — API Client
// Only this file talks to the backend. Handles timeout and
// network/HTTP error cases so the UI layer never has to deal
// with raw fetch() failures.
// ==========================================================

const MRStayApi = {
    async sendMessage(message, sessionId) {
        const url = MRStayConfig.apiBaseUrl + MRStayConfig.chatEndpoint;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: message,
                    session_id: sessionId,
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            return await response.json();

        } catch (err) {
            clearTimeout(timeoutId);

            if (err.name === "AbortError") {
                throw new Error(
                    "Request timed out. Please check your connection and try again."
                );
            }

            throw new Error(
                "Unable to reach MRStay AI right now. Please try again in a moment."
            );
        }
    },
};