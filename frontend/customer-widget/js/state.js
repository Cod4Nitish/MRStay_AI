// ==========================================================
// MRStay AI — Chat State
// Persists conversation history.
// Minimal safe deduplication added.
// ==========================================================

const MRStayState = {
    STORAGE_KEY: "mrstay_messages",
    messages: [],
    isLoading: false,

    init() {
        const saved = sessionStorage.getItem(this.STORAGE_KEY);
        this.messages = saved ? JSON.parse(saved) : [];
    },

    addMessage(role, text) {
        // Safe deduplication: Prevent double rendering of the EXACT same assistant response within 2 seconds
        if (role === "assistant" && this.messages.length > 0) {
            const lastMsg = this.messages[this.messages.length - 1];
            const now = Date.now();
            if (lastMsg.role === "assistant" && lastMsg.text === text && (now - lastMsg.timestamp < 2000)) {
                // Duplicate detected, ignore.
                return null;
            }
        }

        const msg = { role, text, timestamp: Date.now() };
        this.messages.push(msg);
        this._persist();
        return msg;
    },

    setLoading(value) {
        this.isLoading = value;
    },

    _persist() {
        sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.messages));
    },
};