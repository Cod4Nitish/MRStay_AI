// js/pages/pages_ai.js

window.renderAIModules = async function() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div id="ai-modules-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">AI Modules</h2>
                    <p class="section-subtitle">Track the development and deployment of specific AI agents</p>
                </div>
            </div>
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
                Loading agent statuses...
            </div>
        </div>
    `;

    let agentData = await API.getAgentStatus();
    if (!agentData || !agentData.agents) {
        agentData = { agents: [] };
    }

    const agentsHtml = agentData.agents.map(agent => {
        let badgeColor = 'info';
        if (agent.status.toLowerCase().includes('progress')) badgeColor = 'warning';
        if (agent.status.toLowerCase().includes('started')) badgeColor = 'secondary';
        
        return `
            <div class="card">
                <div class="card-content">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                        <h3 style="margin: 0; color: var(--text-primary);">${agent.name}</h3>
                        <span class="badge badge-${badgeColor}">${agent.status}</span>
                    </div>
                    <div style="margin-bottom: var(--spacing-sm);">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                            <span class="card-label">Completion</span>
                            <span class="card-label" style="color: var(--${badgeColor});">${agent.progress}%</span>
                        </div>
                        <div style="width: 100%; height: 6px; background-color: var(--bg-primary); border-radius: 4px; overflow: hidden;">
                            <div style="width: ${agent.progress}%; height: 100%; background-color: var(--${badgeColor});"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    root.innerHTML = `
        <div id="ai-modules-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">AI Modules</h2>
                    <p class="section-subtitle">Track the development and deployment of specific AI agents</p>
                </div>
            </div>

            <div class="cards-grid">
                ${agentsHtml}
            </div>
        </div>
    `;
};

window.renderRAG = function() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div id="rag-pipeline-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Visual RAG Pipeline</h2>
                    <p class="section-subtitle">Real-time status of Retrieval-Augmented Generation processes</p>
                </div>
            </div>

            <div class="card" style="padding: var(--spacing-xl); overflow-x: auto;">
                <div style="display: flex; flex-direction: column; align-items: center; min-width: 800px; padding: 20px 0;">
                    
                    <style>
                        .rag-node {
                            background-color: var(--bg-card-hover);
                            border: 1px solid var(--border-color);
                            border-radius: var(--border-radius);
                            padding: var(--spacing-md) var(--spacing-lg);
                            min-width: 200px;
                            text-align: center;
                            position: relative;
                            box-shadow: var(--shadow-sm);
                            transition: all var(--transition-speed);
                        }
                        .rag-node:hover {
                            border-color: var(--accent-primary);
                            box-shadow: var(--shadow-glow);
                        }
                        .rag-title {
                            font-weight: 600;
                            color: var(--text-primary);
                            margin-bottom: 8px;
                            font-size: 16px;
                        }
                        .rag-status {
                            font-size: 12px;
                            color: var(--text-secondary);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 6px;
                        }
                        .rag-arrow {
                            height: 40px;
                            width: 2px;
                            background: var(--accent-gradient);
                            margin: 10px 0;
                            position: relative;
                        }
                        .rag-arrow::after {
                            content: '';
                            position: absolute;
                            bottom: -5px;
                            left: -4px;
                            width: 0;
                            height: 0;
                            border-left: 5px solid transparent;
                            border-right: 5px solid transparent;
                            border-top: 6px solid #8b5cf6;
                        }
                    </style>

                    <!-- Documents -->
                    <div class="rag-node">
                        <div class="rag-title">1. Raw Documents</div>
                        <div class="rag-status">
                            <span class="status-dot status-online"></span>
                            Ingesting (15k docs)
                        </div>
                        <div style="margin-top: 10px; width: 100%; height: 4px; background: var(--bg-primary); border-radius: 2px;">
                            <div style="width: 100%; height: 100%; background: var(--success); border-radius: 2px;"></div>
                        </div>
                    </div>

                    <div class="rag-arrow"></div>

                    <!-- Chunking -->
                    <div class="rag-node">
                        <div class="rag-title">2. Text Chunking</div>
                        <div class="rag-status">
                            <span class="status-dot status-pending"></span>
                            Processing (500 chunks/s)
                        </div>
                        <div style="margin-top: 10px; width: 100%; height: 4px; background: var(--bg-primary); border-radius: 2px;">
                            <div style="width: 65%; height: 100%; background: var(--warning); border-radius: 2px;"></div>
                        </div>
                    </div>

                    <div class="rag-arrow"></div>

                    <!-- Embeddings -->
                    <div class="rag-node">
                        <div class="rag-title">3. Embeddings</div>
                        <div class="rag-status">
                            <span class="status-dot status-pending"></span>
                            Generating (text-embedding-3-large)
                        </div>
                        <div style="margin-top: 10px; width: 100%; height: 4px; background: var(--bg-primary); border-radius: 2px;">
                            <div style="width: 40%; height: 100%; background: var(--warning); border-radius: 2px;"></div>
                        </div>
                    </div>

                    <div class="rag-arrow"></div>

                    <!-- Vector DB -->
                    <div class="rag-node" style="border-color: var(--accent-primary);">
                        <div class="rag-title">4. Vector Database</div>
                        <div class="rag-status">
                            <span class="status-dot status-online"></span>
                            Pinecone (1.2M vectors)
                        </div>
                        <div style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
                            Latency: 45ms | Health: 100%
                        </div>
                    </div>

                    <div class="rag-arrow"></div>

                    <!-- Retriever -->
                    <div class="rag-node">
                        <div class="rag-title">5. Retriever</div>
                        <div class="rag-status">
                            <span class="status-dot status-online"></span>
                            Active (Hybrid Search)
                        </div>
                        <div style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
                            Top-K: 5 | Alpha: 0.75
                        </div>
                    </div>

                    <div class="rag-arrow"></div>
                    
                    <!-- LLM Synthesis -->
                    <div class="rag-node">
                        <div class="rag-title">6. LLM Synthesis</div>
                        <div class="rag-status">
                            <span class="status-dot status-online"></span>
                            Ready (GPT-4o)
                        </div>
                        <div style="margin-top: 10px; width: 100%; height: 4px; background: var(--bg-primary); border-radius: 2px;">
                            <div style="width: 100%; height: 100%; background: var(--success); border-radius: 2px;"></div>
                        </div>
                    </div>

                    <div class="rag-arrow"></div>

                    <!-- Answer -->
                    <div class="rag-node" style="background: var(--accent-glow); border-color: var(--accent-secondary);">
                        <div class="rag-title" style="color: var(--accent-secondary);">7. Final Answer</div>
                        <div class="rag-status">
                            <span class="status-dot status-online"></span>
                            Delivered to User
                        </div>
                        <div style="margin-top: 10px; font-size: 12px; color: var(--text-primary);">
                            Avg Response Time: 1.2s
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;
};

window.renderKnowledge = async function() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div id="knowledge-base-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Knowledge Base</h2>
                    <p class="section-subtitle">Metrics and status for ingested knowledge data</p>
                </div>
                <button class="badge badge-success" style="cursor:pointer; border:none; padding: 8px 16px;" onclick="window.API.ingestDocuments().then(res => { if(res && res.success) { alert('Sync started successfully!'); window.location.reload(); } else { alert('Sync failed.'); } })">Sync Now</button>
            </div>
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
                Loading RAG stats...
            </div>
        </div>
    `;

    const res = await API.getRAGStats();
    let stats = { documents: 0, chunks: 0, vectors: 0, last_sync: 'Never' };
    if (res && res.success && res.data) {
        stats = res.data;
    }

    const lastSyncStr = stats.last_sync !== 'Never' ? new Date(stats.last_sync).toLocaleString() : 'Never';

    root.innerHTML = `
        <div id="knowledge-base-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Knowledge Base</h2>
                    <p class="section-subtitle">Metrics and status for ingested knowledge data</p>
                </div>
                <button class="badge badge-success" style="cursor:pointer; border:none; padding: 8px 16px;" onclick="window.API.ingestDocuments().then(res => { if(res && res.success) { alert('Sync finished successfully! Reloading...'); window.location.reload(); } else { alert('Sync failed.'); } })">Sync Now</button>
            </div>

            <div class="cards-grid">
                <div class="stat-card card">
                    <div class="card-content">
                        <p class="card-label">Total Documents</p>
                        <h3 class="card-value">${stats.documents.toLocaleString()}</h3>
                        <p class="card-label" style="color: var(--success); margin-top: 8px;">In /data/documents</p>
                    </div>
                </div>
                <div class="stat-card card">
                    <div class="card-content">
                        <p class="card-label">Total Chunks</p>
                        <h3 class="card-value">${stats.chunks.toLocaleString()}</h3>
                        <p class="card-label" style="color: var(--text-muted); margin-top: 8px;">Extracted via Chunker</p>
                    </div>
                </div>
                <div class="stat-card card">
                    <div class="card-content">
                        <p class="card-label">Embeddings Generated</p>
                        <h3 class="card-value">${stats.vectors.toLocaleString()}</h3>
                        <p class="card-label" style="color: var(--success); margin-top: 8px;">Gemini Text-Embedding</p>
                    </div>
                </div>
                <div class="stat-card card">
                    <div class="card-content">
                        <p class="card-label">Vector DB Count</p>
                        <h3 class="card-value">${stats.vectors.toLocaleString()}</h3>
                        <p class="card-label" style="color: var(--text-muted); margin-top: 8px;">ChromaDB stored vectors</p>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top: var(--spacing-lg);">
                <div class="card-content">
                    <h3 style="margin-bottom: var(--spacing-md); color: var(--text-primary);">Sync Status</h3>
                    
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary);">Last Successful Sync</span>
                        <span style="color: var(--text-primary);">${lastSyncStr}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary);">Database</span>
                        <span style="color: var(--text-primary);">ChromaDB Local</span>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.renderBusinessDocs = function() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div id="business-docs-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Business Documents</h2>
                    <p class="section-subtitle">Track status of product and business requirements</p>
                </div>
            </div>

            <div class="card" style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border-color); background-color: var(--bg-primary);">
                            <th style="padding: var(--spacing-md); color: var(--text-secondary); font-weight: 500;">Document Name</th>
                            <th style="padding: var(--spacing-md); color: var(--text-secondary); font-weight: 500;">Type</th>
                            <th style="padding: var(--spacing-md); color: var(--text-secondary); font-weight: 500;">Owner</th>
                            <th style="padding: var(--spacing-md); color: var(--text-secondary); font-weight: 500;">Status</th>
                            <th style="padding: var(--spacing-md); color: var(--text-secondary); font-weight: 500;">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">MRStay Platform PRD</td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">PRD</td>
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">Product Team</td>
                            <td style="padding: var(--spacing-md);"><span class="badge badge-success">Approved</span></td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">Oct 12, 2023</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">AI Integration BRD</td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">BRD</td>
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">Business Analysis</td>
                            <td style="padding: var(--spacing-md);"><span class="badge badge-warning">Under Review</span></td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">Oct 24, 2023</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">Q4 Marketing FAQs</td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">FAQ</td>
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">Marketing</td>
                            <td style="padding: var(--spacing-md);"><span class="badge badge-info">Received</span></td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">Nov 01, 2023</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">Sales Conversational Scripts</td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">Script</td>
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">Sales</td>
                            <td style="padding: var(--spacing-md);"><span class="badge badge-danger">Pending</span></td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">--</td>
                        </tr>
                        <tr>
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">User Personas V2</td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">Research</td>
                            <td style="padding: var(--spacing-md); color: var(--text-primary);">UX Team</td>
                            <td style="padding: var(--spacing-md);"><span class="badge badge-success">Approved</span></td>
                            <td style="padding: var(--spacing-md); color: var(--text-muted);">Sep 15, 2023</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

window.renderDocs = function() {
    const root = document.getElementById('app-root');
    root.innerHTML = `
        <div id="tech-docs-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Technical Documentation</h2>
                    <p class="section-subtitle">System architecture, APIs, and technical specs</p>
                </div>
            </div>

            <div class="cards-grid">
                <div class="card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; color: var(--text-primary);">System Architecture</h3>
                            <span class="badge badge-success">Up to Date</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">High-level overview of the microservices and AI agent topology.</p>
                        <div style="display: flex; gap: 8px;">
                            <button class="badge" style="background: var(--bg-primary); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-primary);">View Diagram</button>
                            <button class="badge" style="background: var(--bg-primary); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-primary);">Read Doc</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; color: var(--text-primary);">API Reference</h3>
                            <span class="badge badge-warning">Needs Update</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">REST and GraphQL endpoints for the core platform and AI gateway.</p>
                        <div style="display: flex; gap: 8px;">
                            <button class="badge" style="background: var(--bg-primary); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-primary);">Swagger UI</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; color: var(--text-primary);">Software Requirements (SRS)</h3>
                            <span class="badge badge-success">Approved</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Detailed functional and non-functional requirements for v1.0.</p>
                        <div style="display: flex; gap: 8px;">
                            <button class="badge" style="background: var(--bg-primary); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-primary);">View PDF</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; color: var(--text-primary);">Project README</h3>
                            <span class="badge badge-success">Maintained</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Developer onboarding, local setup instructions, and contribution guidelines.</p>
                        <div style="display: flex; gap: 8px;">
                            <button class="badge" style="background: var(--bg-primary); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-primary);">GitHub</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <h3 style="margin: 0; color: var(--text-primary);">System Logs Info</h3>
                            <span class="badge badge-info">Active</span>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">Documentation on log formats, tracing IDs, and debugging flows.</p>
                        <div style="display: flex; gap: 8px;">
                            <button class="badge" style="background: var(--bg-primary); border: 1px solid var(--border-color); cursor: pointer; color: var(--text-primary);">View Wiki</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
