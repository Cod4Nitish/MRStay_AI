console.log("VERSION_CHECK_999");

// frontend/engineering-dashboard/js/ai-chat.js
// Connects existing AI Chat widget to real backend /api/gemini/chat

(function () {

    const messagesEl = document.getElementById("ai-chat-messages");
    const inputEl = document.getElementById("ai-chat-input");
    const sendBtn = document.getElementById("ai-chat-send");
    const toggleBtn = document.getElementById("ai-chat-toggle");
    const closeBtn = document.getElementById("ai-chat-close");
    const clearBtn = document.getElementById("ai-chat-clear");
    const panelEl = document.getElementById("ai-chat-panel");
    const widgetEl = document.getElementById("ai-chat-widget");

    if (!messagesEl || !inputEl || !sendBtn) {
        console.warn("AI Chat: widget elements not found, skipping init.");
        return;
    }

    function getApiBase() {
        return localStorage.getItem("mrstay_api_base") ||
               window.API_BASE ||
               "http://127.0.0.1:8000";
    }

    function appendMessage(text, sender) {
        const wrapper = document.createElement("div");
        wrapper.className = `chat-message ${sender === "user" ? "user-message" : "ai-message"}`;

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = text;

        wrapper.appendChild(content);
        messagesEl.appendChild(wrapper);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        return wrapper;
    }

    function appendLoading() {
        const wrapper = document.createElement("div");
        wrapper.className = "chat-message ai-message";
        wrapper.id = "ai-chat-loading";

        const content = document.createElement("div");
        content.className = "message-content";
        content.textContent = "Thinking...";
        content.style.opacity = "0.6";

        wrapper.appendChild(content);
        messagesEl.appendChild(wrapper);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeLoading() {
        const loadingEl = document.getElementById("ai-chat-loading");
        if (loadingEl) loadingEl.remove();
    }

    async function sendMessage() {
        const prompt = inputEl.value.trim();
        if (!prompt) return;

        appendMessage(prompt, "user");
        inputEl.value = "";
        sendBtn.disabled = true;
        appendLoading();

        try {

            const res = await fetch(`${getApiBase()}/api/gemini/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt })
            });

            removeLoading();

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            if (data && data.success && data.response) {
                appendMessage(data.response, "ai");

                if (window.API_ACTIVITY_LOG) {
                    window.API_ACTIVITY_LOG.unshift({
                        time: new Date().toLocaleTimeString(),
                        endpoint: "/api/gemini/chat",
                        status: res.status,
                        ok: true
                    });
                }
            } else {
                appendMessage("Sorry, I couldn't generate a response right now.", "ai");
            }

        } catch (error) {

            removeLoading();
            console.error("AI Chat Error:", error);
            appendMessage("⚠️ Unable to reach the AI backend. Please check the server and try again.", "ai");

            if (window.API_ACTIVITY_LOG) {
                window.API_ACTIVITY_LOG.unshift({
                    time: new Date().toLocaleTimeString(),
                    endpoint: "/api/gemini/chat",
                    status: 500,
                    ok: false
                });
            }

        } finally {
            sendBtn.disabled = false;
            inputEl.focus();
        }
    }

    sendBtn.addEventListener("click", sendMessage);

    inputEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    if (toggleBtn && panelEl) {
        toggleBtn.addEventListener("click", function () {
            panelEl.classList.toggle("open");
            widgetEl.classList.toggle("open");
        });
    }

    if (closeBtn && panelEl) {
    closeBtn.addEventListener("click", function () {
        panelEl.classList.remove("open");
        widgetEl.classList.remove("open");
    });
}

if (clearBtn) {
    clearBtn.addEventListener("click", function () {
        messagesEl.innerHTML = "";
        appendMessage("Hello! I am the MRStay Engineering Assistant. How can I help you today?", "ai");
    });
}

    console.log("%cMRStay AI Chat connected to /api/gemini/chat", "color:#00d084;font-weight:bold;");

})();