// js/api.js
// Dedicated API Layer for fetching data from the FastAPI Backend

const API_BASE =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:8000"
        : "";

const API = {
    /**
     * Internal generic fetch wrapper
     */
    async _fetch(endpoint) {
        const isDemo = localStorage.getItem('mrstay_demo_mode') === 'true';
        if (isDemo) {
            console.log(`[DEMO MODE] Intercepted request to ${endpoint}`);
            return this._getMockData(endpoint);
        }

        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            if (!response.ok) {
                console.warn(`API Error on ${endpoint}: ${response.status}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Fetch failed for ${endpoint}:`, error);
            return null;
        }
    },

    /**
     * Mock data generator for Demo Mode
     */
    _getMockData(endpoint) {
        switch(endpoint) {
            case "/health":
                return {
                    status: "ok",
                    services: {
                        fastapi: "healthy (DEMO)",
                        gemini: "mocked",
                        chromadb: "mocked",
                        postgres: "mocked",
                        redis: "mocked"
                    }
                };
            case "/api/system/telemetry":
                return {
                    cpu_usage: "22% (DEMO)",
                    memory_usage: "4.1 GB (DEMO)",
                    server_uptime: "99 days",
                    python_version: "3.11.0",
                    fastapi_version: "0.104.1"
                };
            case "/api/system/git":
                return {
                    current_branch: "demo-branch",
                    latest_commit: "mock123",
                    commits_today: 42,
                    repository_name: "MRStay-Demo"
                };
            case "/api/system/testing":
                return {
                    unit_tests: "100% Pass",
                    api_tests: "100% Pass",
                    integration_tests: "100% Pass",
                    overall_coverage: "99%"
                };
            case "/api/agent/status":
                return {
                    agents: [
                        { name: "Reception Agent", status: "Online", progress: 100 },
                        { name: "Sales Agent", status: "In Progress", progress: 80 },
                        { name: "Support Agent", status: "Started", progress: 20 }
                    ]
                };
            default:
                return null;
        }
    },

    async getHealth() {
        return await this._fetch("/health");
    },

    async getTelemetry() {
        return await this._fetch("/api/system/telemetry");
    },

    async getGit() {
        return await this._fetch("/api/system/git");
    },

    async getTesting() {
        return await this._fetch("/api/system/testing");
    },

    async getAgentStatus() {
        return await this._fetch("/api/agent/status");
    },

    // --- RAG APIs ---

    async queryRAG(question) {
        const isDemo = localStorage.getItem('mrstay_demo_mode') === 'true';
        if (isDemo) {
            console.log(`[DEMO MODE] Intercepted RAG query: ${question}`);
            // Simulate network delay for effect
            await new Promise(r => setTimeout(r, 1000));
            return {
                success: true,
                message: "Query completed successfully",
                data: {
                    answer: "This is a simulated AI response. The cancellation policy allows full refund within 24 hours.",
                    sources: [
                        { document: "faq.md", section: "Cancellation Policy", score: 0.95 }
                    ]
                }
            };
        }

        try {
            const response = await fetch(`${API_BASE}/api/rag/query`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: question })
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Fetch failed for /api/rag/query:", error);
            return null;
        }
    },

    async ingestDocuments() {
        const isDemo = localStorage.getItem('mrstay_demo_mode') === 'true';
        if (isDemo) {
            await new Promise(r => setTimeout(r, 2000));
            return { success: true, message: "Ingestion mocked", data: { documents: 5, chunks: 20, vectors: 20 } };
        }

        try {
            const response = await fetch(`${API_BASE}/api/rag/ingest`, { method: "POST" });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error("Fetch failed for /api/rag/ingest:", error);
            return null;
        }
    },

    async getRAGStats() {
        const isDemo = localStorage.getItem('mrstay_demo_mode') === 'true';
        if (isDemo) {
            return {
                success: true,
                message: "Stats mocked",
                data: {
                    documents: 15,
                    chunks: 842,
                    vectors: 842,
                    last_sync: new Date().toISOString()
                }
            };
        }

        return await this._fetch("/api/rag/stats");
    }
};

// Make it globally available
window.API = API;
