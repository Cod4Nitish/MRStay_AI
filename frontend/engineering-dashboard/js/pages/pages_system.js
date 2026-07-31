// pages_system.js
// MRStay AI Engineering Control Center - Pages System Renderers

window.renderGit = async function() {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    root.innerHTML = `
        <div id="git-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Git Activity</h2>
                    <p class="section-subtitle">Version control and repository metrics</p>
                </div>
                <div class="section-actions">
                    <button class="btn" style="background: var(--accent-primary); color: white; border: none; padding: 8px 16px; border-radius: var(--border-radius-sm); cursor: pointer;">
                        <i class="fas fa-sync-alt"></i> Sync Repo
                    </button>
                </div>
            </div>
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
                Loading git metrics...
            </div>
        </div>
    `;

    let gitData = await API.getGit();
    if (!gitData) {
        gitData = { current_branch: 'N/A', latest_commit: 'N/A', commits_today: 0, repository_name: 'N/A' };
    }

    root.innerHTML = `
        <div id="git-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Git Activity</h2>
                    <p class="section-subtitle">Version control and repository metrics</p>
                </div>
                <div class="section-actions">
                    <button class="btn" style="background: var(--accent-primary); color: white; border: none; padding: 8px 16px; border-radius: var(--border-radius-sm); cursor: pointer;">
                        <i class="fas fa-sync-alt"></i> Sync Repo
                    </button>
                </div>
            </div>
            
            <div class="cards-grid">
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--info-bg); color: var(--info);">
                        <i class="fas fa-code-branch"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Current Branch</div>
                        <div class="card-value" style="font-size: 1.2rem;">${gitData.current_branch}</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--success-bg); color: var(--success);">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Latest Commit</div>
                        <div class="card-value">${gitData.latest_commit}</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--warning-bg); color: var(--warning);">
                        <i class="fas fa-code-commit"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Commits Today</div>
                        <div class="card-value">${gitData.commits_today}</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--info-bg); color: var(--info);">
                        <i class="fas fa-upload"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Last Push</div>
                        <div class="card-value" style="font-size: 1.2rem;">Live Sync</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--accent-glow); color: var(--accent-primary);">
                        <i class="fab fa-github"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Repository</div>
                        <div class="card-value" style="font-size: 1.2rem;">${gitData.repository_name}</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--danger-bg); color: var(--danger);">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Open Issues</div>
                        <div class="card-value">N/A</div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.renderAnalytics = function() {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    root.innerHTML = `
        <div id="analytics-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Analytics</h2>
                    <p class="section-subtitle">System performance and AI metrics</p>
                </div>
            </div>
            
            <div class="cards-grid">
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--info-bg); color: var(--info);">
                        <i class="fas fa-network-wired"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">API Requests</div>
                        <div class="card-value">12.4k</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--warning-bg); color: var(--warning);">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">RAG Queries</div>
                        <div class="card-value">842</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--accent-glow); color: var(--accent-primary);">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Gemini Calls</div>
                        <div class="card-value">1,204</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--success-bg); color: var(--success);">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Avg Response</div>
                        <div class="card-value">240ms</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--danger-bg); color: var(--danger);">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Error %</div>
                        <div class="card-value">0.12%</div>
                    </div>
                </div>
                
                <div class="card stat-card">
                    <div class="card-icon" style="background: var(--info-bg); color: var(--info);">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="card-content">
                        <div class="card-label">Vector Chunks</div>
                        <div class="card-value">45.2k</div>
                    </div>
                </div>
            </div>
            
            <div class="cards-grid" style="margin-top: var(--spacing-lg);">
                <div class="card">
                    <h3 style="margin-bottom: var(--spacing-md); color: var(--text-primary);">API Traffic Overview</h3>
                    <div style="height: 300px; width: 100%;">
                        <canvas id="apiTrafficChart"></canvas>
                    </div>
                </div>
                <div class="card">
                    <h3 style="margin-bottom: var(--spacing-md); color: var(--text-primary);">AI Model Usage</h3>
                    <div style="height: 300px; width: 100%;">
                        <canvas id="modelUsageChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize Chart.js charts if available
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            const apiCtx = document.getElementById('apiTrafficChart');
            if (apiCtx) {
                new Chart(apiCtx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Requests',
                            data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
                            borderColor: '#6366f1',
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#94a3b8' }
                            }
                        },
                        scales: {
                            x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
                            y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
                        }
                    }
                });
            }

            const modelCtx = document.getElementById('modelUsageChart');
            if (modelCtx) {
                new Chart(modelCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Embeddings'],
                        datasets: [{
                            data: [300, 700, 200],
                            backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
                            borderColor: '#151c2c',
                            borderWidth: 2
                        }]
                    },
                    options: { 
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { color: '#94a3b8', padding: 20 }
                            }
                        }
                    }
                });
            }
        }
    }, 100);
};

window.renderTesting = async function() {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    root.innerHTML = `
        <div id="testing-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Testing & QA</h2>
                    <p class="section-subtitle">Test coverage and build status</p>
                </div>
            </div>
            <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
                Loading testing metrics...
            </div>
        </div>
    `;

    let testData = await API.getTesting();
    if (!testData) {
        testData = { unit_tests: 'N/A', api_tests: 'N/A', integration_tests: 'N/A', overall_coverage: '0%' };
    }

    root.innerHTML = `
        <div id="testing-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Testing & QA</h2>
                    <p class="section-subtitle">Test coverage and build status</p>
                </div>
                <div class="section-actions">
                    <button class="btn" style="background: var(--accent-primary); color: white; border: none; padding: 8px 16px; border-radius: var(--border-radius-sm); cursor: pointer;">
                        <i class="fas fa-play"></i> Run All Tests
                    </button>
                </div>
            </div>
            
            <div class="cards-grid">
                <div class="card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                        <h3 class="card-label">Unit Tests</h3>
                        <span class="badge" style="background: var(--success-bg); color: var(--success); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem;">Passing</span>
                    </div>
                    <div class="card-value" style="margin-bottom: var(--spacing-md);">${testData.unit_tests}</div>
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                        <h3 class="card-label">API Tests</h3>
                        <span class="badge" style="background: var(--warning-bg); color: var(--warning); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem;">Flaky</span>
                    </div>
                    <div class="card-value" style="margin-bottom: var(--spacing-md);">${testData.api_tests}</div>
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                        <h3 class="card-label">Integration Tests</h3>
                        <span class="badge" style="background: var(--success-bg); color: var(--success); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem;">Passing</span>
                    </div>
                    <div class="card-value" style="margin-bottom: var(--spacing-md);">${testData.integration_tests}</div>
                </div>
                
                <div class="card">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                        <h3 class="card-label">Overall Coverage</h3>
                        <span class="badge" style="background: var(--info-bg); color: var(--info); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem;">Good</span>
                    </div>
                    <div class="card-value" style="margin-bottom: var(--spacing-md); font-size: 2rem; color: var(--accent-primary);">${testData.overall_coverage}</div>
                </div>
            </div>
        </div>
    `;
};

window.renderActivity = function() {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    root.innerHTML = `
        <div id="activity-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Activity Feed</h2>
                    <p class="section-subtitle">Recent system and user events</p>
                </div>
            </div>
            
            <div class="card" style="max-width: 800px;">
                <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);">
                    <div style="display: flex; gap: var(--spacing-md);">
                        <div style="color: var(--text-muted); font-size: 0.85rem; width: 50px; flex-shrink: 0;">16:20</div>
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--success-bg); color: var(--success); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-check"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">Task 4 Completed</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.4;">User 'theed' completed the UI mockups for the dashboard.</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: var(--spacing-md);">
                        <div style="color: var(--text-muted); font-size: 0.85rem; width: 50px; flex-shrink: 0;">15:45</div>
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--info-bg); color: var(--info); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-code-branch"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">Branch created</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.4;">New branch 'feature/dashboard-ui' created from 'main'.</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: var(--spacing-md);">
                        <div style="color: var(--text-muted); font-size: 0.85rem; width: 50px; flex-shrink: 0;">14:10</div>
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--warning-bg); color: var(--warning); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">High CPU Usage</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.4;">Server reported CPU usage above 90% for 5 minutes.</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: var(--spacing-md);">
                        <div style="color: var(--text-muted); font-size: 0.85rem; width: 50px; flex-shrink: 0;">11:00</div>
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent-glow); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">Deployment Successful</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.4;">Production deployment v1.2.4 completed successfully.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.renderNotifications = function() {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    root.innerHTML = `
        <div id="notifications-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">System Notifications</h2>
                    <p class="section-subtitle">Alerts and system messages</p>
                </div>
                <div class="section-actions">
                    <button style="background: transparent; color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: var(--border-radius-sm); cursor: pointer;">
                        Mark All as Read
                    </button>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: var(--spacing-sm); max-width: 800px;">
                <div class="card" style="border-left: 4px solid var(--danger);">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="badge" style="background: var(--danger-bg); color: var(--danger); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem; font-weight: bold;">ERROR</div>
                        <div style="flex: 1;">
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">Database Connection Timeout</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">Primary replica failed to respond in 30s.</p>
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.85rem;">10 mins ago</div>
                    </div>
                </div>
                
                <div class="card" style="border-left: 4px solid var(--warning);">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="badge" style="background: var(--warning-bg); color: var(--warning); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem; font-weight: bold;">WARNING</div>
                        <div style="flex: 1;">
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">Disk Space Low</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">Volume /var/log is at 85% capacity.</p>
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.85rem;">1 hour ago</div>
                    </div>
                </div>
                
                <div class="card" style="border-left: 4px solid var(--success); opacity: 0.8;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="badge" style="background: var(--success-bg); color: var(--success); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem; font-weight: bold;">SUCCESS</div>
                        <div style="flex: 1;">
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">Backup Completed</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">Daily snapshot created successfully.</p>
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.85rem;">4 hours ago</div>
                    </div>
                </div>
                
                <div class="card" style="border-left: 4px solid var(--info); opacity: 0.8;">
                    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                        <div class="badge" style="background: var(--info-bg); color: var(--info); padding: 4px 8px; border-radius: var(--border-radius-sm); font-size: 0.75rem; font-weight: bold;">INFO</div>
                        <div style="flex: 1;">
                            <h4 style="color: var(--text-primary); margin-bottom: 4px;">New User Registration</h4>
                            <p style="color: var(--text-muted); font-size: 0.9rem;">User admin@mrstay.com has joined.</p>
                        </div>
                        <div style="color: var(--text-muted); font-size: 0.85rem;">Yesterday</div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

window.renderSettings = function() {
    const root = document.getElementById('app-root');
    if (!root) return;
    
    // Load current demo mode state
    const isDemoMode = localStorage.getItem('mrstay_demo_mode') === 'true';
    
    root.innerHTML = `
        <div id="settings-page" class="page-section active">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Settings</h2>
                    <p class="section-subtitle">Configure your dashboard preferences</p>
                </div>
                <div class="section-actions">
                    <button class="btn" style="background: var(--accent-primary); color: white; border: none; padding: 8px 16px; border-radius: var(--border-radius-sm); cursor: pointer;" onclick="saveSettings()">
                        <i class="fas fa-save"></i> Save Changes
                    </button>
                </div>
            </div>
            
            <div class="cards-grid">
                <div class="card" style="border: 1px solid var(--accent-primary); box-shadow: 0 0 10px rgba(99, 102, 241, 0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-sm);">
                        <h3 style="color: var(--text-primary); margin: 0;">Presentation & Demo</h3>
                        <span class="badge" style="background: var(--accent-glow); color: var(--accent-primary);">Developer</span>
                    </div>
                    <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <label style="display: block; color: var(--text-primary); font-weight: 500;">Demo Mode</label>
                            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px; line-height: 1.4;">
                                Toggle ON to use Mock Data (ideal for presentations when backend is down).<br>
                                Toggle OFF to connect to Live FastAPI server.
                            </p>
                        </div>
                        <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 24px;">
                            <input type="checkbox" id="demoModeToggle" ${isDemoMode ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;" onchange="toggleDemoMode(this)">
                            <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isDemoMode ? 'var(--accent-primary)' : 'var(--bg-secondary)'}; transition: .4s; border-radius: 24px;">
                                <span style="position: absolute; content: ''; height: 16px; width: 16px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; transform: ${isDemoMode ? 'translateX(26px)' : 'translateX(0)'};"></span>
                            </span>
                        </label>
                    </div>
                </div>

                <div class="card">
                    <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-sm);">Appearance</h3>
                    <div style="margin-bottom: var(--spacing-md);">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Theme</label>
                        <select style="width: 100%; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px; border-radius: var(--border-radius-sm); outline: none;">
                            <option value="dark">Dark Theme (Default)</option>
                            <option value="light">Light Theme</option>
                            <option value="system">System Preference</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Accent Color</label>
                        <div style="display: flex; gap: var(--spacing-sm);">
                            <div style="width:24px; height:24px; border-radius:50%; background:var(--accent-primary); border:2px solid #fff; cursor:pointer;"></div>
                            <div style="width:24px; height:24px; border-radius:50%; background:var(--success); cursor:pointer;"></div>
                            <div style="width:24px; height:24px; border-radius:50%; background:var(--warning); cursor:pointer;"></div>
                            <div style="width:24px; height:24px; border-radius:50%; background:var(--danger); cursor:pointer;"></div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-sm);">Notifications</h3>
                    <div style="margin-bottom: 12px;">
                        <label style="display: flex; align-items: center; color: var(--text-secondary); cursor: pointer;">
                            <input type="checkbox" checked style="margin-right: 8px; accent-color: var(--accent-primary);"> 
                            Email Alerts for Critical Errors
                        </label>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <label style="display: flex; align-items: center; color: var(--text-secondary); cursor: pointer;">
                            <input type="checkbox" checked style="margin-right: 8px; accent-color: var(--accent-primary);"> 
                            Slack Integration Active
                        </label>
                    </div>
                    <div>
                        <label style="display: flex; align-items: center; color: var(--text-secondary); cursor: pointer;">
                            <input type="checkbox" style="margin-right: 8px; accent-color: var(--accent-primary);"> 
                            Daily Summary Reports
                        </label>
                    </div>
                </div>
                
                <div class="card">
                    <h3 style="color: var(--text-primary); margin-bottom: var(--spacing-md); border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-sm);">Project Configuration</h3>
                    <div style="margin-bottom: var(--spacing-md);">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Project Name</label>
                        <input type="text" style="width: 100%; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px; border-radius: var(--border-radius-sm); outline: none;" value="MRStay Core">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">API Endpoint</label>
                        <input type="text" id="apiEndpointInput" style="width: 100%; background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px; border-radius: var(--border-radius-sm); outline: none;" value="http://localhost:8000">
                    </div>
                </div>
            </div>
        </div>
    `;

    // Global toggle function
    window.toggleDemoMode = function(checkbox) {
        const isDemo = checkbox.checked;
        localStorage.setItem('mrstay_demo_mode', isDemo ? 'true' : 'false');
        
        // Update slider visually
        const sliderBg = checkbox.nextElementSibling;
        const sliderKnob = sliderBg.querySelector('span');
        if (isDemo) {
            sliderBg.style.backgroundColor = 'var(--accent-primary)';
            sliderKnob.style.transform = 'translateX(26px)';
        } else {
            sliderBg.style.backgroundColor = 'var(--bg-secondary)';
            sliderKnob.style.transform = 'translateX(0)';
        }
        
        // Show notification
        alert(isDemo ? "Demo Mode Activated. Dashboard is using Mock Data." : "Demo Mode Disabled. Dashboard is now connecting to Live Backend.");
        
        // Force reload page to apply changes in API client
        setTimeout(() => window.location.reload(), 500);
    };

    window.saveSettings = function() {
        alert("Settings saved successfully!");
    };
};
