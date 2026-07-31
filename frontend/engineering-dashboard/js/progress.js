/**
 * progress.js — Sprint Tracker with localStorage
 */

const DEFAULT_SPRINT_DATA = {
  summary: { totalTasks: 45, completed: 19, inProgress: 8, remaining: 18 },
  weeks: [
    { name: 'Week 1', subtitle: 'Jul 1 — Jul 7', progress: 100, tasks: ['Project Setup', 'FastAPI Init', 'DB Design', 'Auth System'], allCompleted: true },
    { name: 'Week 2', subtitle: 'Jul 8 — Jul 14', progress: 100, tasks: ['Gemini Integration', 'ChromaDB Setup', 'Embedding Pipeline', 'API Scaffolding'], allCompleted: true },
    { name: 'Week 3', subtitle: 'Jul 15 — Jul 21', progress: 85, tasks: ['Document Chunking', 'RAG Query Engine', 'Vector Search', 'Testing Framework'], allCompleted: false },
    { name: 'Week 4', subtitle: 'Jul 22 — Jul 28', progress: 45, tasks: ['Reception Agent', 'Conversation Flow', 'Context Management', 'Agent Testing'], allCompleted: false },
    { name: 'Week 5', subtitle: 'Jul 29 — Aug 4', progress: 10, tasks: ['Sales Agent', 'Lead Routing', 'Multi-Agent Orchestration', 'Integration Tests'], allCompleted: false },
    { name: 'Week 6', subtitle: 'Aug 5 — Aug 11', progress: 0, tasks: ['Dashboard UI', 'Analytics', 'Documentation', 'Deployment Prep'], allCompleted: false }
  ]
};

function renderSprints() {
  const data = DB.load(DB.KEYS.SPRINTS, DEFAULT_SPRINT_DATA);
  const summaryContainer = document.getElementById('progressSummary');
  const trackerContainer = document.getElementById('sprintTracker');
  
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="progress-stat">
        <span class="progress-stat-value" style="color:var(--accent-primary)">${data.summary.totalTasks}</span>
        <span class="progress-stat-label">Total Tasks</span>
      </div>
      <div class="progress-stat">
        <span class="progress-stat-value" style="color:var(--success)">${data.summary.completed}</span>
        <span class="progress-stat-label">Completed</span>
      </div>
      <div class="progress-stat">
        <span class="progress-stat-value" style="color:var(--warning)">${data.summary.inProgress}</span>
        <span class="progress-stat-label">In Progress</span>
      </div>
      <div class="progress-stat">
        <span class="progress-stat-value" style="color:var(--text-muted)">${data.summary.remaining}</span>
        <span class="progress-stat-label">Remaining</span>
      </div>
    `;
  }
  
  if (trackerContainer) {
    const isAdmin = Auth.isAdmin();
    trackerContainer.innerHTML = data.weeks.map((week, idx) => {
      const taskTags = week.tasks.map(task => {
        const completed = week.allCompleted || week.progress >= 100 ? 'completed' : '';
        return `<span class="sprint-task-tag ${completed}">${task}</span>`;
      }).join('');
      
      return `
        <div class="sprint-week">
          <div class="sprint-week-header">
            <div>
              <span class="sprint-week-title">${week.name}</span>
              <span class="sprint-week-subtitle">${week.subtitle}</span>
            </div>
            <div style="display:flex;align-items:center;gap:var(--spacing-sm)">
              <span class="sprint-week-percent">${week.progress}%</span>
              ${isAdmin ? `<input type="range" min="0" max="100" value="${week.progress}" class="admin-only" style="width:80px;accent-color:var(--accent-primary);cursor:pointer" onchange="updateSprintProgress(${idx}, this.value)" title="Drag to update progress">` : ''}
            </div>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width:0%" data-progress="${week.progress}"></div>
          </div>
          <div class="sprint-tasks">${taskTags}</div>
        </div>
      `;
    }).join('');
    
    // Animate progress bars
    setTimeout(() => {
      trackerContainer.querySelectorAll('.progress-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.progress + '%';
      });
    }, 100);
  }
}

// Update sprint progress (admin only)
function updateSprintProgress(weekIndex, newProgress) {
  if (!Auth.isAdmin()) return;
  const data = DB.load(DB.KEYS.SPRINTS, DEFAULT_SPRINT_DATA);
  data.weeks[weekIndex].progress = parseInt(newProgress);
  if (parseInt(newProgress) >= 100) data.weeks[weekIndex].allCompleted = true;
  DB.save(DB.KEYS.SPRINTS, data);
  renderSprints();
}

document.addEventListener('DOMContentLoaded', renderSprints);
