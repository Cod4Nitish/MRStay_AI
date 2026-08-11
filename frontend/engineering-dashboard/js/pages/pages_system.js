function renderToAppRoot(html) {
    const root = document.getElementById("app-root");
    if (!root) return;
    root.innerHTML = html;
}

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

window.renderNotifications = async function () {

    const root = document.getElementById("app-root");
    if (!root) return;

    root.innerHTML = `
        <div id="notifications-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Notifications</h2>
                    <p class="section-subtitle">System-generated alerts from live data...</p>
                </div>
            </div>
            <div style="padding:40px;text-align:center;color:var(--text-muted);">
                Loading notifications...
            </div>
        </div>
    `;

    try {

        const [git, testing] = await Promise.all([
            API.getGit(),
            API.getTesting()
        ]);

        const backendConnected = window.API_STATUS?.connected === true;
        const log = window.API_ACTIVITY_LOG || [];
        const successCount = log.filter(e => e.ok).length;

        const notifications = [];

        notifications.push({
            icon: backendConnected ? "🟢" : "🔴",
            title: backendConnected ? "Backend Connected" : "Backend Disconnected",
            body: backendConnected
                ? "Backend connection established successfully."
                : "Backend is currently unreachable."
        });

        if (testing && testing.unit_tests) {
            notifications.push({
                icon: "🟢",
                title: "Testing Completed",
                body: `Unit Tests — ${testing.unit_tests}`
            });
        }

        if (git && git.latest_commit) {
            notifications.push({
                icon: "🟢",
                title: "Git Repository Updated",
                body: `Latest commit on ${git.current_branch}: ${git.latest_commit} (${git.commits_today ?? 0} commits today)`
            });
        }

        if (log.length > 0) {
            notifications.push({
                icon: "🟢",
                title: "API Activity",
                body: `${successCount} successful API request(s) in this session.`
            });
        }

        const rows = notifications.length
            ? notifications.map(n => `
                <div style="display:flex;gap:14px;padding:16px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:20px;">${n.icon}</span>
                    <div>
                        <div style="font-weight:600;">${n.title}</div>
                        <div style="color:var(--text-muted);font-size:14px;">${n.body}</div>
                    </div>
                </div>
            `).join("")
            : `<div style="color:var(--text-muted);padding:20px 0;">No notifications yet.</div>`;

        root.innerHTML = `
            <div id="notifications-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Notifications</h2>
                        <p class="section-subtitle">System-generated alerts from live data...</p>
                    </div>
                </div>

                <div class="card" style="padding:20px;">
                    ${rows}
                </div>

            </div>
        `;

    } catch (error) {

        console.error("Notifications Render Error:", error);

        root.innerHTML = `
            <div id="notifications-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Notifications</h2>
                        <button class="btn btn-primary" onclick="window.renderNotifications()">Retry</button>
                    </div>
                </div>
            </div>
        `;
    }
};

// ============ SETTINGS HELPERS ============

window.mrstayApplyAutoRefresh = function () {
    if (window._mrstayRefreshTimer) {
        clearInterval(window._mrstayRefreshTimer);
        window._mrstayRefreshTimer = null;
    }

    const interval = localStorage.getItem("mrstay_auto_refresh") || "off";
    if (interval === "off") return;

    const ms = parseInt(interval, 10);
    if (!ms) return;

    window._mrstayRefreshTimer = setInterval(() => {
        const hash = (window.location.hash || "").replace("#", "");
        const map = {
            backend: "renderBackend",
            testing: "renderTesting",
            git: "renderGit",
            console: "renderConsole",
            analytics: "renderAnalytics",
            activity: "renderActivity",
            notifications: "renderNotifications",
            settings: "renderSettings"
        };
        const fn = map[hash];
        if (fn && typeof window[fn] === "function") {
            window[fn]();
        }
    }, ms);
};

window.mrstaySaveSettings = function () {
    const demoMode = document.getElementById("set-demo-mode").checked;
    const autoRefresh = document.getElementById("set-auto-refresh").value;
    const apiBase = document.getElementById("set-api-base").value.trim();
    const timeout = document.getElementById("set-timeout").value.trim();
    const retries = document.getElementById("set-retries").value.trim();
    const rememberPage = document.getElementById("set-remember-page").checked;
    const apiLogging = document.getElementById("set-api-logging").checked;
    const debugMode = document.getElementById("set-debug-mode").checked;
    const consoleLogs = document.getElementById("set-console-logs").checked;

    localStorage.setItem("mrstay_demo_mode", demoMode ? "true" : "false");
    localStorage.setItem("mrstay_auto_refresh", autoRefresh);
    localStorage.setItem("mrstay_api_base", apiBase);
    localStorage.setItem("mrstay_request_timeout", timeout);
    localStorage.setItem("mrstay_retry_count", retries);
    localStorage.setItem("mrstay_remember_page", rememberPage ? "true" : "false");
    localStorage.setItem("mrstay_api_logging", apiLogging ? "true" : "false");
    localStorage.setItem("mrstay_debug_mode", debugMode ? "true" : "false");
    localStorage.setItem("mrstay_console_logs", consoleLogs ? "true" : "false");

    window.mrstayApplyAutoRefresh();

    alert("Settings saved. Reload the page for API Base/Timeout/Retry changes to fully apply.");
};

window.mrstayTestBackend = async function () {
    const resultEl = document.getElementById("set-test-result");
    resultEl.textContent = "Testing...";

    const base = localStorage.getItem("mrstay_api_base") || "http://127.0.0.1:8000";

    try {
        const res = await fetch(`${base}/health`);
        if (res.ok) {
            resultEl.textContent = "✅ Backend reachable (200 OK)";
            resultEl.style.color = "#4ade80";
        } else {
            resultEl.textContent = `⚠️ Backend responded with ${res.status}`;
            resultEl.style.color = "#facc15";
        }
    } catch (err) {
        resultEl.textContent = "❌ Backend unreachable";
        resultEl.style.color = "#f87171";
    }
};

window.mrstayClearActivity = function () {
    window.API_ACTIVITY_LOG = [];
    alert("API Activity cleared.");
};

window.mrstayClearCache = function () {
    const keep = ["mrstay_demo_mode", "mrstay_api_base"];
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("mrstay_") && !keep.includes(key)) {
            localStorage.removeItem(key);
        }
    });
    alert("Local cache cleared (core settings kept).");
};

window.mrstayResetDashboard = function () {
    if (!confirm("This will reset all dashboard settings and reload. Continue?")) return;
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("mrstay_")) localStorage.removeItem(key);
    });
    location.reload();
};

window.mrstayExportSettings = function () {
    const data = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("mrstay_")) data[key] = localStorage.getItem(key);
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mrstay-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

window.mrstayImportSettingsFile = function (input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            Object.keys(data).forEach(key => {
                if (key.startsWith("mrstay_")) localStorage.setItem(key, data[key]);
            });
            alert("Settings imported. Reloading...");
            location.reload();
        } catch (err) {
            alert("Invalid settings file.");
        }
    };
    reader.readAsText(file);
};

// ============ RENDER SETTINGS ============

window.renderSettings = async function () {

    const root = document.getElementById("app-root");
    if (!root) return;

    root.innerHTML = `
        <div id="settings-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Settings</h2>
                    <p class="section-subtitle">System configuration and preferences...</p>
                </div>
            </div>
            <div style="padding:40px;text-align:center;color:var(--text-muted);">
                Loading settings...
            </div>
        </div>
    `;

    try {

        const demoMode = localStorage.getItem("mrstay_demo_mode") === "true";
        const autoRefresh = localStorage.getItem("mrstay_auto_refresh") || "off";
        const apiBase = localStorage.getItem("mrstay_api_base") || window.API_BASE || "http://127.0.0.1:8000";
        const timeout = localStorage.getItem("mrstay_request_timeout") || "10000";
        const retries = localStorage.getItem("mrstay_retry_count") || "2";
        const rememberPage = localStorage.getItem("mrstay_remember_page") === "true";
        const apiLogging = localStorage.getItem("mrstay_api_logging") !== "false";
        const debugMode = localStorage.getItem("mrstay_debug_mode") === "true";
        const consoleLogs = localStorage.getItem("mrstay_console_logs") !== "false";

        const backendConnected = window.API_STATUS?.connected === true;
        const lastSync = window.API_STATUS?.lastUpdated
            ? new Date(window.API_STATUS.lastUpdated).toLocaleTimeString()
            : "--";

        const section = (title, innerHtml) => `
            <div class="card" style="padding:20px;margin-bottom:16px;">
                <h3 style="margin-bottom:14px;">${title}</h3>
                ${innerHtml}
            </div>
        `;

        const row = (labelHtml, controlHtml) => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                <span>${labelHtml}</span>
                <span>${controlHtml}</span>
            </div>
        `;

        root.innerHTML = `
            <div id="settings-page" class="page-section active">

                <div class="section-header">
                    <div>
                        <h2 class="section-title">Settings</h2>
                        <p class="section-subtitle">System configuration and preferences...</p>
                    </div>
                </div>

                ${section("System Configuration", `
                    ${row("Demo Mode", `<input type="checkbox" id="set-demo-mode" ${demoMode ? "checked" : ""}>`)}
                    ${row("Auto Refresh", `
                        <select id="set-auto-refresh">
                            <option value="off" ${autoRefresh === "off" ? "selected" : ""}>Off</option>
                            <option value="5000" ${autoRefresh === "5000" ? "selected" : ""}>5 sec</option>
                            <option value="10000" ${autoRefresh === "10000" ? "selected" : ""}>10 sec</option>
                            <option value="30000" ${autoRefresh === "30000" ? "selected" : ""}>30 sec</option>
                            <option value="60000" ${autoRefresh === "60000" ? "selected" : ""}>1 min</option>
                        </select>
                    `)}
                    ${row("API Base URL", `<input type="text" id="set-api-base" value="${apiBase}" style="width:220px;">`)}
                    ${row("Request Timeout (ms)", `<input type="number" id="set-timeout" value="${timeout}" style="width:100px;">`)}
                    ${row("Retry Count", `<input type="number" id="set-retries" value="${retries}" style="width:60px;">`)}
                    <div style="margin-top:12px;display:flex;align-items:center;gap:12px;">
                        <button class="btn btn-primary" onclick="window.mrstayTestBackend()">Test Backend</button>
                        <span id="set-test-result" style="color:var(--text-muted);"></span>
                    </div>
                `)}

                ${section("Developer Preferences", `
                    ${row("Remember Last Open Page", `<input type="checkbox" id="set-remember-page" ${rememberPage ? "checked" : ""}>`)}
                    ${row("Enable API Activity Logging", `<input type="checkbox" id="set-api-logging" ${apiLogging ? "checked" : ""}>`)}
                    ${row("Show Debug Information", `<input type="checkbox" id="set-debug-mode" ${debugMode ? "checked" : ""}>`)}
                    ${row("Enable Console Logs", `<input type="checkbox" id="set-console-logs" ${consoleLogs ? "checked" : ""}>`)}
                `)}

                ${section("Diagnostics", `
                    ${row("Frontend", `<span style="color:#4ade80;">✅ Online</span>`)}
                    ${row("Backend", backendConnected ? `<span style="color:#4ade80;">✅ Connected</span>` : `<span style="color:#f87171;">❌ Disconnected</span>`)}
                    ${row("API Client", `<span style="color:#4ade80;">✅ Ready</span>`)}
                    ${row("Last Sync", lastSync)}
                `)}

                ${section("Maintenance", `
                    <div style="display:flex;gap:12px;flex-wrap:wrap;">
                        <button class="btn btn-primary" onclick="window.mrstayClearActivity()">Clear API Activity</button>
                        <button class="btn btn-primary" onclick="window.mrstayClearCache()">Clear Local Cache</button>
                        <button class="btn btn-primary" onclick="window.mrstayResetDashboard()">Reset Dashboard</button>
                        <button class="btn btn-primary" onclick="window.mrstayExportSettings()">Export Settings</button>
                        <label class="btn btn-primary" style="cursor:pointer;">
                            Import Settings
                            <input type="file" accept=".json" style="display:none;" onchange="window.mrstayImportSettingsFile(this)">
                        </label>
                    </div>
                `)}

                ${section("About", `
                    ${row("Dashboard Version", "v1.0")}
                    ${row("Environment", "Development")}
                    ${row("Browser", navigator.userAgent.split(") ")[0] + ")")}
                    ${row("Platform", navigator.platform || "Unknown")}
                `)}

                <div style="margin-top:8px;">
                    <button class="btn btn-primary" onclick="window.mrstaySaveSettings()">Save Settings</button>
                </div>

            </div>
        `;

    } catch (error) {

        console.error("Settings Render Error:", error);

        root.innerHTML = `
            <div id="settings-page" class="page-section active">
                <div class="card">
                    <div class="card-content" style="text-align:center;padding:40px;">
                        <h2>Unable to load Settings</h2>
                        <button class="btn btn-primary" onclick="window.renderSettings()">Retry</button>
                    </div>
                </div>
            </div>
        `;
    }
};


