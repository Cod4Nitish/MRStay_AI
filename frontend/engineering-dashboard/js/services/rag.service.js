/**
 * ============================================================
 * MRStay AI
 * RAG Service
 * ------------------------------------------------------------
 * Enterprise Service Layer
 * Handles all Retrieval-Augmented Generation operations.
 * ============================================================
 */

import apiClient from "../core/apiClient.js";

const ENDPOINTS = {
    QUERY: "/api/rag/query",
    STATS: "/api/rag/stats",
    INGEST: "/api/rag/ingest",
    DOCUMENTS: "/api/rag/documents",
    UPLOAD: "/api/rag/upload"
};

class RAGService {

    async getStats() {

        try {
            return await apiClient.request(ENDPOINTS.STATS);
        } catch (error) {
            console.error("Failed to load RAG statistics:", error);
            throw error;
        }

    }

    async query(question) {

        if (!question?.trim()) {
            throw new Error("Question cannot be empty.");
        }

        try {

            return await apiClient.request(ENDPOINTS.QUERY, {
                method: "POST",
                body: JSON.stringify({
                    question: question.trim()
                })
            });

        } catch (error) {

            console.error("RAG Query Failed:", error);
            throw error;

        }

    }

    async ingestDocuments() {

        try {

            return await apiClient.request(ENDPOINTS.INGEST, {
                method: "POST"
            });

        } catch (error) {

            console.error("Document ingestion failed:", error);
            throw error;

        }

    }

    async getDocuments() {

        try {

            return await apiClient.request(ENDPOINTS.DOCUMENTS);

        } catch (error) {

            console.error("Failed to fetch documents:", error);
            throw error;

        }

    }

    async uploadDocument(formData) {

        try {

            return await apiClient.request(ENDPOINTS.UPLOAD, {
                method: "POST",
                body: formData
            });

        } catch (error) {

            console.error("Document upload failed:", error);
            throw error;

        }

    }

}

export default Object.freeze(new RAGService());