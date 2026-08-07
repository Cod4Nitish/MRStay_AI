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