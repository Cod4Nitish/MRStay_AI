import apiClient from "../core/apiClient.js";

class SystemService {

    getHealth() {
        return apiClient.request("/health");
    }

    getTelemetry() {
        return apiClient.request("/api/system/telemetry");
    }

    getGit() {
        return apiClient.request("/api/system/git");
    }

    getTesting() {
        return apiClient.request("/api/system/testing");
    }

}

export default new SystemService();