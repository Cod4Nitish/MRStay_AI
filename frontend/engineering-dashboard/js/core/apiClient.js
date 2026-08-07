/*
============================================================
MRStay AI
Enterprise API Client
------------------------------------------------------------
Single HTTP Client for the entire application.

Responsibilities
- Handle all HTTP requests
- Manage request timeout
- Standardize API responses
- Support JSON & FormData
- Future JWT Authentication
- Future Request / Response Interceptors
============================================================
*/

import { CONFIG } from "../config/config.js";

class APIClient {

    constructor() {

        this.baseURL = CONFIG.API_BASE;
        this.timeout = CONFIG.API_TIMEOUT;

    }

    /**
     * --------------------------------------------------------
     * Generic HTTP Request
     * --------------------------------------------------------
     */

    async request(endpoint, options = {}) {

        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, this.timeout);

        try {

            const url = `${this.baseURL}${endpoint}`;

            const isFormData =
                options.body instanceof FormData;

            const headers = {

                ...(isFormData
                    ? {}
                    : {
                        "Content-Type": "application/json"
                    }),

                /*
                 * Future Authentication
                 */
                // Authorization:
                // `Bearer ${localStorage.getItem("access_token")}`,

                ...(options.headers || {})

            };

            console.groupCollapsed(
                `🌐 ${options.method || "GET"} ${endpoint}`
            );

            console.time("API Request");

            const response = await fetch(url, {

                ...options,

                headers,

                signal: controller.signal

            });

            console.timeEnd("API Request");

            clearTimeout(timeoutId);

            let data = null;

            const contentType =
                response.headers.get("content-type");

            if (
                contentType &&
                contentType.includes("application/json")
            ) {

                data = await response.json();

            }

            else {

                data = await response.text();

            }

            console.log("Status :", response.status);
            console.log("Response :", data);

            console.groupEnd();

            return {

                success: response.ok,

                status: response.status,

                data,

                error: null

            };

        }

        catch (error) {

            clearTimeout(timeoutId);

            let message = "Unknown Error";

            if (error.name === "AbortError") {

                message = "Request Timeout";

            }

            else {

                message = error.message;

            }

            console.groupCollapsed("❌ API Error");

            console.error(message);

            console.groupEnd();

            return {

                success: false,

                status: 500,

                data: null,

                error: message

            };

        }

    }

    /*
    ------------------------------------------------------------
    HTTP Helpers
    ------------------------------------------------------------
    */

    get(endpoint) {

        return this.request(endpoint);

    }

    post(endpoint, body = {}) {

        return this.request(endpoint, {

            method: "POST",

            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body)

        });

    }

    put(endpoint, body = {}) {

        return this.request(endpoint, {

            method: "PUT",

            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body)

        });

    }

    patch(endpoint, body = {}) {

        return this.request(endpoint, {

            method: "PATCH",

            body:
                body instanceof FormData
                    ? body
                    : JSON.stringify(body)

        });

    }

    delete(endpoint) {

        return this.request(endpoint, {

            method: "DELETE"

        });

    }

}

export default Object.freeze(new APIClient());