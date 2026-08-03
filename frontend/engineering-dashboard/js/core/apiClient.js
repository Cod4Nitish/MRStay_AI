/*
----------------------------------------------------
MRStay AI
Central API Client
----------------------------------------------------
*/

import { CONFIG } from "../config/config.js";

class APIClient {

    async request(endpoint, options = {}) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, CONFIG.API_TIMEOUT);

        try {

            console.log(`API Request -> ${endpoint}`);

            const response = await fetch(
                `${CONFIG.API_BASE}${endpoint}`,
                {
                    ...options,
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json",
                        ...(options.headers || {})
                    }
                }
            );

            clearTimeout(timeout);

            const data = await response.json();

            return {
                success: response.ok,
                status: response.status,
                data
            };

        } catch (error) {

            clearTimeout(timeout);

            console.error("API Error:", error);

            return {
                success: false,
                status: 500,
                data: null,
                error: error.message
            };
        }

    }

}

export default new APIClient();