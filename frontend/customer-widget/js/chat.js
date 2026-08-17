// ==========================================================
// MRStay AI — Chat Widget Controller
// Wires DOM elements to state/api/session. Kept intentionally
// simple (vanilla JS, no framework) so the widget stays
// dependency-free and fast to load on any customer website.
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const elements = {
        messageList: document.getElementById("mrstay-message-list"),
        input: document.getElementById("mrstay-input"),
        sendButton: document.getElementById("mrstay-send-btn"),
        typingIndicator: document.getElementById("mrstay-typing"),
        brandName: document.getElementById("mrstay-brand-name"),
        tagline: document.getElementById("mrstay-tagline"),
    };

    function init() {
        elements.brandName.textContent = MRStayConfig.brandName;
        elements.tagline.textContent = MRStayConfig.tagline;

        MRStayState.init();

        if (MRStayState.messages.length > 0) {
            // Restore previous conversation on reload
            MRStayState.messages.forEach((msg) => {
                renderMessage(msg.role, msg.text);
            });
        } else {
            // Fresh session — show and save the welcome message
            renderMessage("assistant", MRStayConfig.welcomeMessage);
            MRStayState.addMessage("assistant", MRStayConfig.welcomeMessage);
        }

        elements.sendButton.addEventListener("click", handleSend);
        elements.input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });
    }

    async function handleSend() {
        const text = elements.input.value.trim();

        if (!text || MRStayState.isLoading) {
            return;
        }

        elements.input.value = "";
        MRStayState.addMessage("user", text);
        renderMessage("user", text);

        setLoadingUI(true);

        try {
            const sessionId = MRStaySession.getSessionId();
            const result = await MRStayApi.sendMessage(text, sessionId);

            if (result.success) {
                MRStayState.addMessage("assistant", result.response);
                renderMessage("assistant", result.response);
            } else {
                renderMessage(
                    "assistant",
                    result.response ||
                    "Sorry, something went wrong. Please try again."
                );
            }

        } catch (err) {
            renderMessage("assistant", err.message);

        } finally {
            setLoadingUI(false);
        }
    }

    function renderMessage(role, text) {
        const bubble = document.createElement("div");
        bubble.className = `mrstay-message mrstay-message--${role}`;
        bubble.textContent = text;

        elements.messageList.appendChild(bubble);
        elements.messageList.scrollTop = elements.messageList.scrollHeight;
    }

    function setLoadingUI(isLoading) {
        MRStayState.setLoading(isLoading);
        elements.typingIndicator.style.display = isLoading ? "flex" : "none";
        elements.sendButton.disabled = isLoading;

        if (isLoading) {
            elements.messageList.scrollTop = elements.messageList.scrollHeight;
        }
    }

    init();
});