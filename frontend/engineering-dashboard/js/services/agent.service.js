/**
 * ============================================================
 * MRStay AI
 * AI Agent Service
 * ------------------------------------------------------------
 * Handles all AI Agent related backend operations.
 * Enterprise Service Layer
 * ============================================================
 */

import apiClient from "../core/apiClient.js";

const ENDPOINTS = {

    STATUS: "/api/agent/status",

};

class AgentService {

    /**
     * Get AI Agent Status
     * @returns {Promise<Object>}
     */
    async getStatus() {

        try {

            return await apiClient.get(
                ENDPOINTS.STATUS
            );

        }

        catch (error) {

            console.error(
                "Failed to fetch Agent Status",
                error
            );

            throw error;

        }

    }

    /*
    ---------------------------------------------------------
    Future Ready Methods
    ---------------------------------------------------------
    */

    async getAll() {

        throw new Error(
            "getAll() not implemented yet."
        );

    }

    async get(id) {

        throw new Error(
            "get(id) not implemented yet."
        );

    }

    async restart(id) {

        throw new Error(
            "restart() not implemented yet."
        );

    }

    async enable(id) {

        throw new Error(
            "enable() not implemented yet."
        );

    }

    async disable(id) {

        throw new Error(
            "disable() not implemented yet."
        );

    }

    async health() {

        return this.getStatus();

    }

}

export default Object.freeze(
    new AgentService()
);