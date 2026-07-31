// js/db.js
const DB_PREFIX = 'mrstay_dashboard_';

const DB = {
    KEYS: {
        SESSION: 'session',
        OVERVIEW: 'overview',
        SPRINT_ROADMAP: 'sprint_roadmap',
        FOCUS: 'focus',
        TASKS: 'tasks',
        BACKEND: 'backend',
        CONSOLE: 'console',
        AI_MODULES: 'ai_modules',
        RAG_PIPELINE: 'rag_pipeline',
        KNOWLEDGE: 'knowledge',
        BUSINESS_DOCS: 'business_docs',
        DOCS: 'docs',
        GIT: 'git',
        ANALYTICS: 'analytics',
        TESTING: 'testing',
        RECENT_ACTIVITY: 'recent_activity',
        NOTIFICATIONS: 'notifications',
        SETTINGS: 'settings'
    },

    save: function(key, data) {
        try {
            localStorage.setItem(DB_PREFIX + key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to DB:', e);
            return false;
        }
    },

    load: function(key, defaultData = null) {
        try {
            const item = localStorage.getItem(DB_PREFIX + key);
            return item ? JSON.parse(item) : defaultData;
        } catch (e) {
            console.error('Error loading from DB:', e);
            return defaultData;
        }
    },

    remove: function(key) {
        try {
            localStorage.removeItem(DB_PREFIX + key);
        } catch (e) {
            console.error('Error removing from DB:', e);
        }
    },

    reset: function() {
        for (const key in this.KEYS) {
            if (this.KEYS[key] !== 'session') {
                localStorage.removeItem(DB_PREFIX + this.KEYS[key]);
            }
        }
        console.log('Database reset successfully.');
    }
};

window.DB = DB;
