// ==========================================================
// MRStay AI — Session Management
// Keeps a stable session_id per browser tab for the lifetime
// of the page (sessionStorage — cleared on tab close). This
// is what lets the backend's session-aware lead qualification
// flow work correctly across multiple messages.
// ==========================================================

const MRStaySession = {
    STORAGE_KEY: "mrstay_session_id",

    getSessionId() {
        let id = sessionStorage.getItem(this.STORAGE_KEY);

        if (!id) {
            id = this._generateId();
            sessionStorage.setItem(this.STORAGE_KEY, id);
        }

        return id;
    },

    resetSession() {
        sessionStorage.removeItem(this.STORAGE_KEY);
    },

    _generateId() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    },
};