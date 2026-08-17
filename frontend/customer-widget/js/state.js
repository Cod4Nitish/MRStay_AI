// ==========================================================
// MRStay AI — Chat State
// Persists conversation history in sessionStorage so a page
// reload doesn't lose the conversation — tied to the same
// session_id the backend uses for lead-qualification context.
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