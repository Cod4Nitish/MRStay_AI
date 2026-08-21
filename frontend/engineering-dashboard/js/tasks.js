/**
 * tasks.js — Kanban Board Task Management with localStorage
 * Supports: Add, Edit, Delete, Persist tasks
 */

const DEFAULT_TASKS = [
  { id: 1, title: 'Setup FastAPI project structure', priority: 'High', status: 'completed', dueDate: 'Jul 15' },
  { id: 2, title: 'Design database schema', priority: 'High', status: 'completed', dueDate: 'Jul 17' },
  { id: 3, title: 'Implement Gemini API integration', priority: 'High', status: 'completed', dueDate: 'Jul 20' },
  { id: 4, title: 'ChromaDB setup and configuration', priority: 'High', status: 'completed', dueDate: 'Jul 22' },
  { id: 5, title: 'Document chunking pipeline', priority: 'High', status: 'in-progress', dueDate: 'Jul 30' },
  { id: 6, title: 'RAG query endpoint implementation', priority: 'High', status: 'in-progress', dueDate: 'Aug 1' },
  { id: 7, title: 'Embeddings generation service', priority: 'Medium', status: 'in-progress', dueDate: 'Aug 2' },
  { id: 8, title: 'Reception Agent conversation flow', priority: 'Medium', status: 'in-progress', dueDate: 'Aug 5' },
  { id: 9, title: 'Multi-agent orchestration layer', priority: 'High', status: 'todo', dueDate: 'Aug 8' },
  { id: 10, title: 'Sales Agent recommendation engine', priority: 'Medium', status: 'todo', dueDate: 'Aug 12' },
  { id: 11, title: 'Lead routing agent logic', priority: 'Medium', status: 'todo', dueDate: 'Aug 15' },
  { id: 12, title: 'Frontend dashboard integration', priority: 'Low', status: 'todo', dueDate: 'Aug 18' },
  { id: 13, title: 'API rate limiting middleware', priority: 'Low', status: 'todo', dueDate: 'Aug 20' },
  { id: 14, title: 'Unit test coverage for agents', priority: 'Medium', status: 'todo', dueDate: 'Aug 22' },
  { id: 15, title: 'Performance optimization pass', priority: 'Low', status: 'todo', dueDate: 'Aug 25' }
];

function getTasksData() {
  return DB.load(DB.KEYS.TASKS, DEFAULT_TASKS);
}

function saveTasksData(tasks) {
  DB.save(DB.KEYS.TASKS, tasks);
}

function renderKanban() {
  const container = document.getElementById('kanbanBoard');
  if (!container) return;
  
  const tasks = getTasksData();
  const grouped = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };
  
  const columns = [
    { key: 'todo', title: 'To Do', icon: 'circle-dot', color: 'var(--text-muted)' },
    { key: 'in-progress', title: 'In Progress', icon: 'loader', color: 'var(--warning)' },
    { key: 'completed', title: 'Completed', icon: 'check-circle-2', color: 'var(--success)' }
  ];
  
  const priorityMap = { 'High': 'high', 'Medium': 'medium', 'Low': 'low' };
  const isAdmin = Auth.isAdmin();
  
  container.innerHTML = columns.map(col => {
    const colTasks = grouped[col.key] || [];
    return `
      <div class="kanban-column">
        <div class="kanban-header">
          <div class="kanban-title" style="color:${col.color}">
            <i data-lucide="${col.icon}" style="width:16px;height:16px;"></i>
            ${col.title}
          </div>
          <span class="kanban-count">${colTasks.length}</span>
        </div>
        <div class="kanban-cards">
          ${colTasks.map(task => `
            <div class="task-card ${isAdmin ? 'clickable' : ''}" data-id="${task.id}" ${isAdmin ? `onclick="openEditTask(${task.id})" style="cursor:pointer"` : ''}>
              <div class="task-card-header">
                <span class="task-card-title">${task.title}</span>
              </div>
              <div class="task-card-meta">
                <span class="badge badge-${priorityMap[task.priority]}">${task.priority}</span>
                <span class="task-card-date"><i data-lucide="calendar" style="width:12px;height:12px;"></i> ${task.dueDate}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  lucide.createIcons();
}

// Open task modal for editing
function openEditTask(id) {
  if (!Auth.isAdmin()) return;
  const tasks = getTasksData();
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  document.getElementById('editTaskId').value = task.id;
  document.getElementById('taskTitleInput').value = task.title;
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskDueDate').value = task.dueDate;
  document.getElementById('taskStatus').value = task.status;
  document.getElementById('taskModalTitle').textContent = 'Edit Task';
  document.getElementById('deleteTaskBtn').style.display = 'block';
  document.getElementById('taskModal').classList.add('active');
}

// Setup task modal
function setupTaskModal() {
  const addBtn = document.getElementById('addTaskBtn');
  const modal = document.getElementById('taskModal');
  const closeBtn = document.getElementById('closeTaskModal');
  const form = document.getElementById('taskForm');
  const deleteBtn = document.getElementById('deleteTaskBtn');
  
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!Auth.isAdmin()) return;
      document.getElementById('editTaskId').value = '';
      form.reset();
      document.getElementById('taskModalTitle').textContent = 'Add Task';
      document.getElementById('deleteTaskBtn').style.display = 'none';
      modal.classList.add('active');
    });
  }
  
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const tasks = getTasksData();
      const editId = document.getElementById('editTaskId').value;
      
      const taskData = {
        title: document.getElementById('taskTitleInput').value.trim(),
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value.trim() || 'TBD',
        status: document.getElementById('taskStatus').value
      };
      
      if (editId) {
        const idx = tasks.findIndex(t => t.id == editId);
        if (idx !== -1) { tasks[idx] = { ...tasks[idx], ...taskData }; }
      } else {
        taskData.id = Date.now();
        tasks.push(taskData);
      }
      
      saveTasksData(tasks);
      modal.classList.remove('active');
      renderKanban();
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const editId = document.getElementById('editTaskId').value;
      if (!editId) return;
      if (!confirm('Delete this task?')) return;
      let tasks = getTasksData();
      tasks = tasks.filter(t => t.id != editId);
      saveTasksData(tasks);
      modal.classList.remove('active');
      renderKanban();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderKanban();
  setupTaskModal();
});
