// pages_core.js - Modular JS Page Renderers (Part 1)

// Helper function to safely set HTML and update icons
function renderToAppRoot(html) {
  const root = document.getElementById('app-root');
  if (root) {
    root.innerHTML = html;
    if (window.lucide && lucide.createIcons) {
      lucide.createIcons();
    }
  } else {
    console.error("Error: 'app-root' element not found in DOM.");
  }
}

// 1. Executive Overview
window.renderOverview = function() {
  const html = `
    <div class="page-section active" id="overview-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Executive Overview</h2>
          <p class="section-subtitle">Real-time project status and health</p>
        </div>
      </div>
      
      <div class="cards-grid">
        <div class="card stat-card" style="grid-column: span 2; display: flex; align-items: center; justify-content: space-between;">
          <div class="card-content">
            <div class="card-label">Project Health Score</div>
            <div class="card-value" style="font-size: 3rem; color: var(--success); display: flex; align-items: center; gap: 10px;">
              92%
              <i data-lucide="trending-up" style="width: 32px; height: 32px;"></i>
            </div>
          </div>
          <div class="progress-circle" style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(var(--success) 92%, var(--border-color) 0); display: flex; align-items: center; justify-content: center;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--bg-card); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">Good</div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="card-icon" style="background: var(--info-bg); color: var(--info);">
            <i data-lucide="folder"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Project Name</div>
            <div class="card-value">MRStay AI Control Center</div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="card-icon" style="background: var(--warning-bg); color: var(--warning);">
            <i data-lucide="timer"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Active Sprint</div>
            <div class="card-value">Sprint 2</div>
          </div>
        </div>

        <div class="card stat-card">
          <div class="card-icon" style="background: var(--accent-glow); color: var(--accent-primary);">
            <i data-lucide="git-merge"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Current Version</div>
            <div class="card-value">v1.2.0-beta</div>
          </div>
        </div>
      </div>
    </div>
  `;
  renderToAppRoot(html);
};

// 2. Sprint Roadmap
window.renderSprint = function() {
  const sprints = [
    { week: 1, title: 'Foundation & Setup', progress: 100, status: 'completed' },
    { week: 2, title: 'Backend & Data Pipelines', progress: 65, status: 'in-progress' },
    { week: 3, title: 'AI Integration & Logic', progress: 10, status: 'pending' },
    { week: 4, title: 'Testing & Deployment', progress: 0, status: 'pending' }
  ];

  const html = `
    <div class="page-section active" id="sprint-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Sprint Roadmap</h2>
          <p class="section-subtitle">4-Week Development Cycle</p>
        </div>
      </div>
      
      <div class="cards-grid" style="grid-template-columns: 1fr;">
        ${sprints.map(s => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-sm);">
              <h3 style="margin: 0; font-size: 1.1rem;">Week ${s.week}: ${s.title}</h3>
              <span class="badge badge-${s.status === 'completed' ? 'success' : s.status === 'in-progress' ? 'warning' : 'secondary'}">
                ${s.progress}% ${s.status === 'completed' ? 'Done' : s.status === 'in-progress' ? 'Active' : 'Pending'}
              </span>
            </div>
            <div style="width: 100%; height: 12px; background: var(--border-color); border-radius: var(--border-radius-sm); overflow: hidden;">
              <div style="width: ${s.progress}%; height: 100%; background: var(--${s.status === 'completed' ? 'success' : 'accent-primary'}); transition: width var(--transition-speed);"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  renderToAppRoot(html);
};

// 3. Current Focus
window.renderFocus = function() {
  const html = `
    <div class="page-section active" id="focus-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Current Focus</h2>
          <p class="section-subtitle">Immediate objectives and milestones</p>
        </div>
      </div>
      
      <div class="cards-grid">
        <div class="card" style="border-left: 4px solid var(--warning);">
          <div class="card-icon" style="background: var(--warning-bg); color: var(--warning); margin-bottom: var(--spacing-md);">
            <i data-lucide="target"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Today's Goal</div>
            <div class="card-value" style="font-size: 1.25rem; margin-top: var(--spacing-sm);">Finalize modular JS page renderers</div>
            <p style="color: var(--text-muted); margin-top: var(--spacing-sm); font-size: 0.9rem;">
              Ensure all rendering functions correctly inject HTML and initialize icons.
            </p>
          </div>
        </div>

        <div class="card" style="border-left: 4px solid var(--accent-primary);">
          <div class="card-icon" style="background: var(--accent-glow); color: var(--accent-primary); margin-bottom: var(--spacing-md);">
            <i data-lucide="flag"></i>
          </div>
          <div class="card-content">
            <div class="card-label">Next Milestone</div>
            <div class="card-value" style="font-size: 1.25rem; margin-top: var(--spacing-sm);">Dashboard Integration</div>
            <p style="color: var(--text-muted); margin-top: var(--spacing-sm); font-size: 0.9rem;">
              Connect the frontend modules to live backend telemetry and task endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
  renderToAppRoot(html);
};

// 4. Kanban Board
window.renderKanban = function() {
  // Mock tasks
  const tasks = [
    { id: 101, title: 'Draft schema', priority: 'High', assignee: 'Alice', sprint: 'Sprint 2', tags: 'DB', status: 'backlog' },
    { id: 102, title: 'API Auth', priority: 'High', assignee: 'Bob', sprint: 'Sprint 2', tags: 'Security', status: 'todo' },
    { id: 103, title: 'Dashboard UI', priority: 'Medium', assignee: 'Charlie', sprint: 'Sprint 2', tags: 'Frontend', status: 'in-progress' },
    { id: 104, title: 'User routes', priority: 'Low', assignee: 'Alice', sprint: 'Sprint 2', tags: 'Backend', status: 'review' },
    { id: 105, title: 'Integration tests', priority: 'High', assignee: 'Diana', sprint: 'Sprint 2', tags: 'QA', status: 'testing' },
    { id: 106, title: 'Setup Repo', priority: 'High', assignee: 'Eve', sprint: 'Sprint 1', tags: 'Infra', status: 'done' }
  ];

  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'var(--text-muted)', icon: 'archive' },
    { id: 'todo', title: 'To Do', color: 'var(--info)', icon: 'circle' },
    { id: 'in-progress', title: 'In Progress', color: 'var(--warning)', icon: 'clock' },
    { id: 'review', title: 'Review', color: 'var(--accent-secondary)', icon: 'eye' },
    { id: 'testing', title: 'Testing', color: 'var(--danger)', icon: 'beaker' },
    { id: 'done', title: 'Done', color: 'var(--success)', icon: 'check-circle' }
  ];

  const priorityColors = { 'High': 'danger', 'Medium': 'warning', 'Low': 'info' };

  const html = `
    <div class="page-section active" id="kanban-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Kanban Board</h2>
          <p class="section-subtitle">Task tracking and workflow management</p>
        </div>
      </div>
      
      <div class="kanban-board" style="display: flex; gap: var(--spacing-md); overflow-x: auto; padding-bottom: var(--spacing-md);">
        ${columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return `
          <div class="kanban-column" style="flex: 1; min-width: 280px; background: var(--bg-card); border-radius: var(--border-radius); padding: var(--spacing-md); display: flex; flex-direction: column; gap: var(--spacing-md);" 
               ondragover="event.preventDefault();" 
               ondrop="window.handleKanbanDrop(event, '${col.id}')">
            <div class="kanban-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: var(--spacing-sm);">
              <h3 style="font-size: 1rem; color: ${col.color}; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="${col.icon}" style="width: 16px; height: 16px;"></i>
                ${col.title}
              </h3>
              <span class="badge" style="background: var(--bg-secondary);">${colTasks.length}</span>
            </div>
            <div class="kanban-cards" style="display: flex; flex-direction: column; gap: var(--spacing-sm); min-height: 100px;">
              ${colTasks.map(task => `
                <div class="card task-card" draggable="true" ondragstart="window.handleKanbanDragStart(event, ${task.id})" 
                     style="padding: var(--spacing-sm); cursor: grab; background: var(--bg-secondary); border-left: 3px solid var(--${priorityColors[task.priority]});">
                  <div style="font-weight: 500; margin-bottom: 8px;">${task.title}</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                    <span class="badge badge-${priorityColors[task.priority]}" style="font-size: 0.7rem;">${task.priority}</span>
                    <span class="badge" style="background: var(--bg-primary); font-size: 0.7rem;">${task.sprint}</span>
                    <span class="badge" style="background: var(--accent-glow); color: var(--accent-primary); font-size: 0.7rem;">${task.tags}</span>
                  </div>
                  <div style="display: flex; justify-content: flex-end; font-size: 0.75rem; color: var(--text-muted);">
                    <i data-lucide="user" style="width: 12px; height: 12px; margin-right: 4px;"></i> ${task.assignee}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  renderToAppRoot(html);
  
  // Attach drag and drop logic to window
  if (!window.handleKanbanDragStart) {
    window.handleKanbanDragStart = function(event, taskId) {
      event.dataTransfer.setData('text/plain', taskId);
    };
    window.handleKanbanDrop = function(event, columnId) {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain');
      console.log(`Moved task ${taskId} to ${columnId}`);
      // Here you would normally update the state and re-render
      // For now we just alert to demonstrate the JS hook
      // alert(`Dropped task ${taskId} into ${columnId}`);
    };
  }
};

// 5. Backend Health
window.renderBackend = async function() {
  const htmlLoading = `
    <div class="page-section active" id="backend-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Backend Health</h2>
          <p class="section-subtitle">Live service status and monitoring</p>
        </div>
      </div>
      <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
        Loading backend telemetry...
      </div>
    </div>
  `;
  renderToAppRoot(htmlLoading);

  let healthData = await API.getHealth();
  if (!healthData || !healthData.services) {
      healthData = { services: { fastapi: 'offline', gemini: 'offline', chromadb: 'offline', postgres: 'offline', redis: 'offline' } };
  }

  // Format response for UI
  const svcs = healthData.services;
  const services = [
    { name: 'FastAPI Core', status: svcs.fastapi === 'healthy' ? 'online' : 'offline', latency: 'live' },
    { name: 'Gemini Models', status: svcs.gemini === 'not_configured' ? 'warning' : 'offline', latency: 'N/A' },
    { name: 'ChromaDB', status: svcs.chromadb === 'not_connected' ? 'warning' : 'offline', latency: 'N/A' },
    { name: 'PostgreSQL', status: svcs.postgres === 'not_connected' ? 'warning' : 'offline', latency: 'N/A' },
    { name: 'Redis Cache', status: svcs.redis === 'not_connected' ? 'warning' : 'offline', latency: 'N/A' }
  ];

  const html = `
    <div class="page-section active" id="backend-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Backend Health</h2>
          <p class="section-subtitle">Live service status and monitoring</p>
        </div>
      </div>
      
      <div class="cards-grid">
        ${services.map(srv => {
          const statusColor = srv.status === 'online' ? 'var(--success)' : (srv.status === 'warning' ? 'var(--warning)' : 'var(--danger)');
          const icon = srv.status === 'online' ? 'check-circle' : (srv.status === 'warning' ? 'alert-triangle' : 'x-circle');
          
          return `
            <div class="card stat-card" style="border-top: 3px solid ${statusColor};">
              <div class="card-icon" style="background: ${statusColor}22; color: ${statusColor};">
                <i data-lucide="${icon}"></i>
              </div>
              <div class="card-content">
                <div class="card-label" style="font-weight: 600; color: var(--text-primary);">${srv.name}</div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--spacing-xs);">
                  <span style="color: ${statusColor}; font-size: 0.85rem; text-transform: uppercase; font-weight: 700;">${srv.status}</span>
                  <span style="color: var(--text-muted); font-family: monospace; font-size: 0.85rem;">${srv.latency}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  renderToAppRoot(html);
};

// 6. Developer Console
window.renderConsole = async function() {
  const htmlLoading = `
    <div class="page-section active" id="console-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Developer Console</h2>
          <p class="section-subtitle">System configuration and telemetry</p>
        </div>
      </div>
      <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
        Loading telemetry...
      </div>
    </div>
  `;
  renderToAppRoot(htmlLoading);

  let tel = await API.getTelemetry();
  if (!tel) {
    tel = { cpu_usage: 'N/A', memory_usage: 'N/A', server_uptime: 'offline', python_version: 'N/A', fastapi_version: 'N/A' };
  }

  const envData = [
    { key: 'CPU Usage', value: tel.cpu_usage },
    { key: 'Memory Usage', value: tel.memory_usage },
    { key: 'Server Uptime', value: tel.server_uptime },
    { key: 'Python Version', value: tel.python_version },
    { key: 'FastAPI Version', value: tel.fastapi_version }
  ];

  const html = `
    <div class="page-section active" id="console-page">
      <div class="section-header">
        <div>
          <h2 class="section-title">Developer Console</h2>
          <p class="section-subtitle">System configuration and telemetry</p>
        </div>
      </div>
      
      <div class="card" style="background: #000; border: 1px solid var(--border-color); font-family: monospace;">
        <div style="padding: var(--spacing-sm) var(--spacing-md); background: #1a1a1a; border-bottom: 1px solid #333; display: flex; gap: 8px;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--danger);"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--warning);"></div>
          <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--success);"></div>
        </div>
        <div style="padding: var(--spacing-md); color: var(--success);">
          <div style="margin-bottom: var(--spacing-md);">root@mrstay-ai-core:~# systemctl status engine</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-sm);">
            ${envData.map(env => `
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #333; padding-bottom: 4px;">
                <span style="color: var(--info);">${env.key}:</span>
                <span style="color: var(--text-primary);">${env.value}</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: var(--spacing-lg); color: var(--warning);">
            > Telemetry stream connected. Live data fetched successfully.
          </div>
        </div>
      </div>
    </div>
  `;
  renderToAppRoot(html);
};
