// ============================================================
// 1. Executive Overview (Enterprise Version)
// ============================================================

window.renderOverview = async function () {

    renderToAppRoot(`
        <div class="page-section active">
            <div class="card">
                <div class="card-content">
                    <h2>Loading Executive Dashboard...</h2>
                    <p>Please wait while MRStay AI connects to backend services.</p>
                </div>
            </div>
        </div>
    `);

    try {

        const [
            health,
            telemetry,
            git,
            testing,
            agents
        ] = await Promise.all([

            API.getHealth(),
            API.getTelemetry(),
            API.getGit(),
            API.getTesting(),
            API.getAgentStatus()

        ]);

        console.log("Executive Overview", { 
            health,
            telemetry,
            git,
            testing,
            agents
        });

        // =====================================================
        // Live Values
        // =====================================================

        const backendStatus =
            health?.status === "ok"
                ? "Online"
                : "Offline";

        const healthScore =
            health?.status === "ok"
                ? 100
                : 0;

        const cpu =
            telemetry?.cpu_usage || "N/A";

        const memory =
            telemetry?.memory_usage || "N/A";

        const uptime =
            telemetry?.server_uptime || "N/A";

        const branch =
            git?.current_branch || "Unknown";

        const commit =
            git?.latest_commit || "Unknown";

        const coverage =
            testing?.overall_coverage || "N/A";

        const totalAgents =
            agents?.agents?.length || 0;

        const html = ` 

                    <div class="page-section active" id="overview-page">

                <div class="section-header">

                    <div>

                        <h2 class="section-title">
                            Executive Overview
                        </h2>

                        <p class="section-subtitle">
                            Enterprise Live Dashboard
                        </p>

                    </div>

                    <div class="badge badge-success">
                        ${backendStatus}
                    </div>

                </div>

                <div class="cards-grid">

                    <!-- Health -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--success-bg);color:var(--success);">

                            <i data-lucide="activity"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                System Health
                            </div>

                            <div class="card-value">
                                ${healthScore}%
                            </div>

                        </div>

                    </div>

                    <!-- CPU -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--warning-bg);color:var(--warning);">

                            <i data-lucide="cpu"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                CPU Usage
                            </div>

                            <div class="card-value">
                                ${cpu}
                            </div>

                        </div>

                    </div>

                    <!-- Memory -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--info-bg);color:var(--info);">

                            <i data-lucide="database"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                Memory Usage
                            </div>

                            <div class="card-value">
                                ${memory}
                            </div>

                        </div>

                    </div>

                    <!-- Uptime -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--accent-glow);color:var(--accent-primary);">

                            <i data-lucide="clock"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                Server Uptime
                            </div>

                            <div class="card-value">
                                ${uptime}
                            </div>

                        </div>

                    </div>

                                        <!-- Git Branch -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--accent-glow);color:var(--accent-primary);">

                            <i data-lucide="git-branch"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                Git Branch
                            </div>

                            <div class="card-value">
                                ${branch}
                            </div>

                        </div>

                    </div>

                    <!-- Latest Commit -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--info-bg);color:var(--info);">

                            <i data-lucide="git-commit"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                Latest Commit
                            </div>

                            <div class="card-value"
                                 style="font-size:1rem;font-family:monospace;">
                                ${commit}
                            </div>

                        </div>

                    </div>

                    <!-- Test Coverage -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--success-bg);color:var(--success);">

                            <i data-lucide="shield-check"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                Test Coverage
                            </div>

                            <div class="card-value">
                                ${coverage}
                            </div>

                        </div>

                    </div>

                    <!-- AI Agents -->

                    <div class="card stat-card">

                        <div class="card-icon"
                             style="background:var(--warning-bg);color:var(--warning);">

                            <i data-lucide="bot"></i>

                        </div>

                        <div class="card-content">

                            <div class="card-label">
                                Active AI Agents
                            </div>

                            <div class="card-value">
                                ${totalAgents}
                            </div>

                        </div>

                    </div>

                </div>

                <div class="card"
                     style="margin-top:var(--spacing-lg);">

                    <div class="card-content">

                        <h3 style="margin-bottom:20px;">
                            System Summary
                        </h3>

                        <div class="cards-grid">

                                                    <div class="card stat-card">

                                <div class="card-content">

                                    <div class="card-label">
                                        Backend Status
                                    </div>

                                    <div class="card-value"
                                         style="color:${backendStatus === "Online"
                                            ? "var(--success)"
                                            : "var(--danger)"};">
                                        ${backendStatus}
                                    </div>

                                </div>

                            </div>

                            <div class="card stat-card">

                                <div class="card-content">

                                    <div class="card-label">
                                        Python Version
                                    </div>

                                    <div class="card-value">
                                        ${telemetry?.python_version || "N/A"}
                                    </div>

                                </div>

                            </div>

                            <div class="card stat-card">

                                <div class="card-content">

                                    <div class="card-label">
                                        FastAPI Version
                                    </div>

                                    <div class="card-value">
                                        ${telemetry?.fastapi_version || "N/A"}
                                    </div>

                                </div>

                            </div>

                            <div class="card stat-card">

                                <div class="card-content">

                                    <div class="card-label">
                                        Repository
                                    </div>

                                    <div class="card-value">
                                        ${git?.repository_name || "MRStay AI"}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

        `;

                renderToAppRoot(html);

        console.log(
            "✅ Executive Overview Loaded Successfully"
        );

    } catch (error) {

        console.error(
            "❌ Executive Overview Error",
            error
        );

        renderToAppRoot(`

            <div class="page-section active">

                <div class="card">

                    <div class="card-content"
                         style="text-align:center;padding:50px;">

                        <i data-lucide="triangle-alert"
                           style="
                                width:60px;
                                height:60px;
                                color:var(--danger);
                                margin-bottom:20px;
                           ">
                        </i>

                        <h2>
                            Unable to load Executive Dashboard
                        </h2>

                        <p
                           style="
                                color:var(--text-muted);
                                margin:20px 0;
                           ">
                            Backend is unavailable or one of the APIs failed.
                        </p>

                        <button
                            class="btn btn-primary"
                            onclick="window.renderOverview()">

                            Retry

                        </button>

                    </div>

                </div>

            </div>

        `);

    }

};

// =====================================================
// Enterprise Auto Refresh
// Refresh every 60 seconds
// =====================================================

if (!window.__overviewRefresh__) {

    window.__overviewRefresh__ = setInterval(() => {

        if (
            window.location.hash === "#overview"
        ) {

            window.renderOverview();

        }

    }, 60000);

}

console.log(
    "%cMRStay Executive Overview Loaded",
    "color:#00d084;font-weight:bold;font-size:14px"
);