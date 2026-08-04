// ======================================================
// MRStay AI
// Enterprise API Layer v2.0
// Author: MRStay Engineering
// ======================================================

const API_VERSION = "v1";

const API_BASE =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://127.0.0.1:8000"
        : "";

window.API_STATUS = {
    connected: false,
    lastUpdated: null,
    lastError: null
};

const API = {

    // ==================================================
    // Enterprise Configuration
    // ==================================================

    REQUEST_TIMEOUT: 10000,
    MAX_RETRIES: 2,

    // ==================================================
    // Generic GET Request
    // ==================================================

    async _fetch(endpoint, retry = 0) {

        const isDemo =
            localStorage.getItem("mrstay_demo_mode") === "true";

        if (isDemo) {
            console.log(`[DEMO] GET ${endpoint}`);
            return this._getMockData(endpoint);
        }

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, this.REQUEST_TIMEOUT);

        try {

            const response = await fetch(
                `${API_BASE}${endpoint}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }

            const data = await response.json();

            window.API_STATUS.connected = true;
            window.API_STATUS.lastUpdated =
                new Date().toISOString();
            window.API_STATUS.lastError = null;

                        return data;

        } catch (error) {

            clearTimeout(timeout);

            window.API_STATUS.connected = false;
            window.API_STATUS.lastUpdated =
                new Date().toISOString();

            window.API_STATUS.lastError =
                error.message;

            console.error(
                `[API ERROR] ${endpoint}`,
                error
            );

            if (
                retry < this.MAX_RETRIES &&
                error.name !== "AbortError"
            ) {

                console.warn(
                    `Retry ${retry + 1}/${this.MAX_RETRIES}`
                );

                return await this._fetch(
                    endpoint,
                    retry + 1
                );

            }

            return {
                success: false,
                endpoint,
                error: error.message,
                status:
                    error.name === "AbortError"
                        ? 408
                        : 500
            };

        }

    },

    // ==================================================
    // Generic POST Request
    // ==================================================

    async _post(endpoint, body = {}) {

        const isDemo =
            localStorage.getItem("mrstay_demo_mode") === "true";

        if (isDemo) {

            console.log(`[DEMO] POST ${endpoint}`);

            return {
                success: true,
                message: "Demo POST Request",
                data: body
            };

        }

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, this.REQUEST_TIMEOUT);

                try {

            const response = await fetch(
                `${API_BASE}${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body),
                    signal: controller.signal
                }
            );

            clearTimeout(timeout);

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }

            const data = await response.json();

            window.API_STATUS.connected = true;
            window.API_STATUS.lastUpdated =
                new Date().toISOString();

            window.API_STATUS.lastError = null;

            return data;

        } catch (error) {

            clearTimeout(timeout);

            window.API_STATUS.connected = false;

            window.API_STATUS.lastUpdated =
                new Date().toISOString();

            window.API_STATUS.lastError =
                error.message;

            console.error(
                `[POST ERROR] ${endpoint}`,
                error
            );

            return {
                success: false,
                endpoint,
                error: error.message
            };

        }

    },

    // ==================================================
    // Demo Mock Data
    // ==================================================

    _getMockData(endpoint) {

        switch (endpoint) {

            case "/health":

                return {
                    success: true,
                    status: "ok",
                    services: {
                        fastapi: "healthy",
                        gemini: "healthy",
                        chromadb: "healthy",
                        postgres: "healthy",
                        redis: "healthy"
                    }
                };

                            case "/api/system/telemetry":

                return {
                    success: true,
                    cpu_usage: "18%",
                    memory_usage: "4.2 GB",
                    server_uptime: "99 Days",
                    python_version: "3.13",
                    fastapi_version: "0.116"
                };

            case "/api/system/git":

                return {
                    success: true,
                    current_branch: "main",
                    latest_commit: "a8f9c2d",
                    commits_today: 14,
                    repository_name: "MRStay-AI"
                };

            case "/api/system/testing":

                return {
                    success: true,
                    unit_tests: "100%",
                    api_tests: "100%",
                    integration_tests: "100%",
                    overall_coverage: "98%"
                };

            case "/api/agent/status":

                return {
                    success: true,
                    agents: [
                        {
                            name: "Reception Agent",
                            status: "Online",
                            progress: 100
                        },
                        {
                            name: "Sales Agent",
                            status: "Running",
                            progress: 82
                        },
                        {
                            name: "Support Agent",
                            status: "Training",
                            progress: 41
                        }
                    ]
                };

            default:

                return {
                    success: false,
                    message: "No Mock Data Found"
                };

        }

    },

    // ==================================================
    // Public GET APIs
    // ==================================================

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

        // ==================================================
    // RAG APIs
    // ==================================================

    async queryRAG(question) {

        return await this._post(
            "/api/rag/query",
            {
                question
            }
        );

    },

    async ingestDocuments() {

        return await this._post(
            "/api/rag/ingest",
            {}
        );

    },

    async getRAGStats() {

        return await this._fetch(
            "/api/rag/stats"
        );

    },

    // ==================================================
    // API Status
    // ==================================================

    getConnectionStatus() {

        return window.API_STATUS;

    },

    // ==================================================
    // Health Check
    // ==================================================

    async ping() {

        const result = await this.getHealth();

        return result &&
            (result.success === true || result.status === "ok");

    }

};

// ======================================================
// Global API Object
// ======================================================

window.API = API;

console.log(
    "%cMRStay Enterprise API v2 Loaded",
    "color:#00d084;font-weight:bold;font-size:14px"
);

console.table({
    Version: API_VERSION,
    Timeout: API.REQUEST_TIMEOUT + " ms",
    Retries: API.MAX_RETRIES,
    Backend: API_BASE || "Same Origin"
});

// ======================================================
// End of File
// ======================================================