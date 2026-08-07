window.renderBackend = async function () {

    const root = document.getElementById("app-root");

    if (!root) return;

    // Loading Screen
    root.innerHTML = `
        <div id="backend-page" class="page-section active">

            <div class="section-header">
                <div>
                    <h2 class="section-title">Backend Health</h2>
                    <p class="section-subtitle">
                        Monitoring backend services and server health...
                    </p>
                </div>
            </div>

            <div style="
                padding:40px;
                text-align:center;
                color:var(--text-muted);
            ">
                Loading backend health...
            </div>

        </div>
    `;

    try {

        const [health, telemetry] = await Promise.all([
            API.getHealth(),
            API.getTelemetry()
        ]);

        console.log("Backend Health", {
            health,
            telemetry
        });

        root.innerHTML = `
            <div id="backend-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Backend Health</h2>
                        <p class="section-subtitle">
                            Monitoring backend services and server health...
                        </p>
                    </div>
                </div>

                <div class="cards-grid">

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>FastAPI</h3>
                            <h2>${health.services?.fastapi || "Unknown"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Gemini</h3>
                            <h2>${health.services?.gemini || "Unknown"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>CPU Usage</h3>
                            <h2>${telemetry.cpu_usage || "--"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Memory Usage</h3>
                            <h2>${telemetry.memory_usage || "--"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Server Uptime</h3>
                            <h2>${telemetry.server_uptime || "--"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Python</h3>
                            <h2>${telemetry.python_version || "--"}</h2>
                        </div>
                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Backend Health Error:", error);

        root.innerHTML = `
            <div id="backend-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Backend Health</h2>
                        <p style="margin:20px 0;color:var(--text-muted);">
                            Backend APIs are unavailable.
                        </p>
                        <button class="btn btn-primary" onclick="window.renderBackend()">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.renderTesting = async function () {

    const root = document.getElementById("app-root");

    if (!root) return;

    // Loading Screen
    root.innerHTML = `
        <div id="testing-page" class="page-section active">

            <div class="section-header">
                <div>
                    <h2 class="section-title">Testing</h2>
                    <p class="section-subtitle">
                        Live test suite results and code coverage...
                    </p>
                </div>
            </div>

            <div style="
                padding:40px;
                text-align:center;
                color:var(--text-muted);
            ">
                Loading testing data...
            </div>

        </div>
    `;

    try {

        const testing = await API.getTesting();

        console.log("Testing Data", testing);

        root.innerHTML = `
            <div id="testing-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Testing</h2>
                        <p class="section-subtitle">
                            Live test suite results and code coverage...
                        </p>
                    </div>
                </div>

                <div class="cards-grid">

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Unit Tests</h3>
                            <h2>${testing.unit_tests || "No data"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>API Tests</h3>
                            <h2>${testing.api_tests || "No data"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Integration Tests</h3>
                            <h2>${testing.integration_tests || "No data"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Overall Coverage</h3>
                            <h2>${testing.overall_coverage || "--"}</h2>
                        </div>
                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Testing Data Error:", error);

        root.innerHTML = `
            <div id="testing-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Testing data</h2>
                        <p style="margin:20px 0;color:var(--text-muted);">
                            Testing API is unavailable.
                        </p>
                        <button class="btn btn-primary" onclick="window.renderTesting()">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.renderGit = async function () {

    const root = document.getElementById("app-root");

    if (!root) return;

    // Loading Screen
    root.innerHTML = `
        <div id="git-page" class="page-section active">

            <div class="section-header">
                <div>
                    <h2 class="section-title">Git Activity</h2>
                    <p class="section-subtitle">
                        Live repository and commit tracking...
                    </p>
                </div>
            </div>

            <div style="
                padding:40px;
                text-align:center;
                color:var(--text-muted);
            ">
                Loading git activity...
            </div>

        </div>
    `;

    try {

        const git = await API.getGit();

        console.log("Git Data", git);

        root.innerHTML = `
            <div id="git-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Git Activity</h2>
                        <p class="section-subtitle">
                            Live repository and commit tracking...
                        </p>
                    </div>
                </div>

                <div class="cards-grid">

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Repository</h3>
                            <h2>${git.repository_name || "Unknown"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Current Branch</h3>
                            <h2>${git.current_branch || "--"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Latest Commit</h3>
                            <h2>${git.latest_commit || "--"}</h2>
                        </div>
                    </div>

                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Commits Today</h3>
                            <h2>${git.commits_today ?? "--"}</h2>
                        </div>
                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Git Data Error:", error);

        root.innerHTML = `
            <div id="git-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Git Activity</h2>
                        <p style="margin:20px 0;color:var(--text-muted);">
                            Git API is unavailable.
                        </p>
                        <button class="btn btn-primary" onclick="window.renderGit()">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.mrstayClearConsole = function () {
    window.API_ACTIVITY_LOG = [];
    window.renderConsole();
};

window.mrstayExportLogs = function () {
    const data = JSON.stringify(window.API_ACTIVITY_LOG || [], null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mrstay-console-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

window.renderConsole = async function () {

    const root = document.getElementById("app-root");
    if (!root) return;

    root.innerHTML = `
        <div id="console-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Developer Console</h2>
                    <p class="section-subtitle">Live engineering console...</p>
                </div>
            </div>
            <div style="padding:40px;text-align:center;color:var(--text-muted);">
                Loading console...
            </div>
        </div>
    `;

    try {

        const backendConnected = window.API_STATUS?.connected === true;
        const apiClientReady = typeof API !== "undefined";
        const authLoaded = typeof Auth !== "undefined";
        const apiBase = window.API_BASE || "http://127.0.0.1:8000";
        const log = window.API_ACTIVITY_LOG || [];

        const statusRow = (label, ok) => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;">
                <span style="color:${ok ? "#4ade80" : "#f87171"};">${ok ? "✓" : "✕"}</span>
                <span>${label}</span>
            </div>
        `;

        const logRows = log.length
            ? log.map(entry => `
                <div style="display:flex;gap:16px;padding:4px 0;font-family:monospace;font-size:13px;">
                    <span style="color:var(--text-muted);">[${entry.time}]</span>
                    <span>GET ${entry.endpoint}</span>
                    <span style="margin-left:auto;color:${entry.ok ? "#4ade80" : "#f87171"};">
                        ${entry.status} ${entry.ok ? "OK" : "ERROR"}
                    </span>
                </div>
            `).join("")
            : `<div style="color:var(--text-muted);padding:12px 0;">No API activity recorded yet in this session.</div>`;

        root.innerHTML = `
            <div id="console-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Developer Console</h2>
                        <p class="section-subtitle">Live engineering console...</p>
                    </div>
                </div>

                <div class="card" style="padding:20px;margin-bottom:16px;">
                    ${statusRow("Backend Connected", backendConnected)}
                    ${statusRow("Frontend Loaded", true)}
                    ${statusRow("API Client Ready", apiClientReady)}
                    ${statusRow("Authentication Loaded", authLoaded)}
                </div>

                <div class="card" style="padding:20px;margin-bottom:16px;">
                    <h3 style="margin-bottom:12px;">Recent API Activity</h3>
                    ${logRows}
                </div>

                <div class="card" style="padding:20px;margin-bottom:16px;">
                    <h3 style="margin-bottom:12px;">System Information</h3>
                    <div>Frontend : Online</div>
                    <div>Backend : ${backendConnected ? "Connected" : "Disconnected"}</div>
                    <div>API Base : ${apiBase}</div>
                    <div>Environment : Development</div>
                </div>

                <div style="display:flex;gap:12px;">
                    <button class="btn btn-primary" onclick="window.mrstayClearConsole()">Clear Console</button>
                    <button class="btn btn-primary" onclick="window.mrstayExportLogs()">Export Logs</button>
                </div>

            </div>
        `;

    } catch (error) {

        console.error("Console Render Error:", error);

        root.innerHTML = `
            <div id="console-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Developer Console</h2>
                        <button class="btn btn-primary" onclick="window.renderConsole()">Retry</button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.renderAnalytics = async function () {

    const root = document.getElementById("app-root");
    if (!root) return;

    root.innerHTML = `
        <div id="analytics-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Analytics</h2>
                    <p class="section-subtitle">Aggregated engineering metrics...</p>
                </div>
            </div>
            <div style="padding:40px;text-align:center;color:var(--text-muted);">
                Loading analytics...
            </div>
        </div>
    `;

    try {

        const [git, testing] = await Promise.all([
            API.getGit(),
            API.getTesting()
        ]);

        const log = window.API_ACTIVITY_LOG || [];
        const totalRequests = log.length;
        const successRequests = log.filter(e => e.ok).length;
        const failedRequests = totalRequests - successRequests;
        const successRate = totalRequests
            ? Math.round((successRequests / totalRequests) * 100)
            : 0;

        const backendConnected = window.API_STATUS?.connected === true;

        // Simple weighted health score
        const coverageNum = parseInt(testing.overall_coverage) || 0;
        let score = 0;
        if (backendConnected) score += 30;
        if (coverageNum >= 80) score += 30;
        else score += Math.round((coverageNum / 80) * 30);
        if (successRate >= 90) score += 25;
        else score += Math.round((successRate / 90) * 25);
        score += 15; // git always present if reached here
        score = Math.min(score, 100);

        root.innerHTML = `
            <div id="analytics-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Analytics</h2>
                        <p class="section-subtitle">Aggregated engineering metrics...</p>
                    </div>
                </div>

                <div class="card" style="padding:20px;margin-bottom:16px;text-align:center;">
                    <h3>System Health Score</h3>
                    <h1 style="font-size:48px;margin:8px 0;">${score} / 100</h1>
                </div>

                <div class="cards-grid" style="margin-bottom:16px;">
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Repository</h3>
                            <h2>${git.repository_name || "--"}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Branch</h3>
                            <h2>${git.current_branch || "--"}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Commits Today</h3>
                            <h2>${git.commits_today ?? "--"}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Latest Commit</h3>
                            <h2>${git.latest_commit || "--"}</h2>
                        </div>
                    </div>
                </div>

                <div class="cards-grid" style="margin-bottom:16px;">
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Unit Tests</h3>
                            <h2>${testing.unit_tests || "--"}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>API Tests</h3>
                            <h2>${testing.api_tests || "--"}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Integration Tests</h3>
                            <h2>${testing.integration_tests || "--"}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Coverage</h3>
                            <h2>${testing.overall_coverage || "--"}</h2>
                        </div>
                    </div>
                </div>

                <div class="cards-grid">
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Total Requests</h3>
                            <h2>${totalRequests}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Successful</h3>
                            <h2>${successRequests}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Failed</h3>
                            <h2>${failedRequests}</h2>
                        </div>
                    </div>
                    <div class="card stat-card">
                        <div class="card-content">
                            <h3>Success Rate</h3>
                            <h2>${successRate}%</h2>
                        </div>
                    </div>
                </div>

            </div>
        `;

    } catch (error) {

        console.error("Analytics Render Error:", error);

        root.innerHTML = `
            <div id="analytics-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Analytics</h2>
                        <button class="btn btn-primary" onclick="window.renderAnalytics()">Retry</button>
                    </div>
                </div>
            </div>
        `;
    }
};

window.renderActivity = async function () {

    const root = document.getElementById("app-root");
    if (!root) return;

    root.innerHTML = `
        <div id="activity-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Recent Activity</h2>
                    <p class="section-subtitle">Timeline of API calls and git activity...</p>
                </div>
            </div>
            <div style="padding:40px;text-align:center;color:var(--text-muted);">
                Loading activity...
            </div>
        </div>
    `;

    try {

        const git = await API.getGit();
        const log = window.API_ACTIVITY_LOG || [];

        const timelineItems = [];

        log.forEach(entry => {
            timelineItems.push({
                time: entry.time,
                text: `GET ${entry.endpoint}`,
                status: entry.ok ? "success" : "error",
                statusText: entry.ok ? `${entry.status} OK` : `${entry.status} ERROR`
            });
        });

        if (git && git.latest_commit) {
            timelineItems.push({
                time: "--",
                text: `Latest commit on ${git.current_branch}: ${git.latest_commit}`,
                status: "info",
                statusText: `${git.commits_today ?? 0} commits today`
            });
        }

        const rows = timelineItems.length
            ? timelineItems.map(item => `
                <div style="display:flex;gap:16px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="color:var(--text-muted);min-width:80px;font-family:monospace;">${item.time}</span>
                    <span style="flex:1;">${item.text}</span>
                    <span style="color:${
                        item.status === "success" ? "#4ade80" :
                        item.status === "error" ? "#f87171" : "#60a5fa"
                    };">${item.statusText}</span>
                </div>
            `).join("")
            : `<div style="color:var(--text-muted);padding:20px 0;">No activity recorded yet in this session. Visit other pages to generate activity.</div>`;

        root.innerHTML = `
            <div id="activity-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Recent Activity</h2>
                        <p class="section-subtitle">Timeline of API calls and git activity...</p>
                    </div>
                </div>

                <div class="card" style="padding:20px;">
                    ${rows}
                </div>

            </div>
        `;

    } catch (error) {

        console.error("Activity Render Error:", error);

        root.innerHTML = `
            <div id="activity-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Recent Activity</h2>
                        <button class="btn btn-primary" onclick="window.renderActivity()">Retry</button>
                    </div>
                </div>
            </div>
        `;
    }
};

