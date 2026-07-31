// js/data.js

const DEFAULT_OVERVIEW = {
    healthScore: 85,
    activeTasks: 12,
    codeCoverage: 78,
    systemUptime: '99.9%'
};

const DEFAULT_SPRINT_ROADMAP = [
    { id: 1, title: 'Sprint 14: RAG Pipeline Optimization', status: 'active', progress: 65, startDate: '2026-07-20', endDate: '2026-08-03' },
    { id: 2, title: 'Sprint 15: AI Module Expansion', status: 'planned', progress: 0, startDate: '2026-08-04', endDate: '2026-08-18' }
];

const DEFAULT_FOCUS = {
    currentObjective: 'Improve retrieval latency by 20%',
    priority: 'High',
    notes: 'Vector DB query time is currently the bottleneck.'
};

const DEFAULT_TASKS = {
    'Backlog': [{ id: 't1', title: 'Update dependencies', priority: 'medium' }, { id: 't2', title: 'Refactor auth module', priority: 'low' }],
    'To Do': [{ id: 't3', title: 'Write tests for vector search', priority: 'high' }],
    'In Progress': [{ id: 't4', title: 'Implement Semantic Routing', priority: 'high' }],
    'Review': [{ id: 't5', title: 'New UI components', priority: 'medium' }],
    'Testing': [{ id: 't6', title: 'Integration testing for RAG', priority: 'high' }],
    'Done': [{ id: 't7', title: 'Initial Dashboard Setup', priority: 'medium' }]
};

const DEFAULT_BACKEND = {
    services: [
        { name: 'FastAPI Core', status: 'online', latency: '45ms' },
        { name: 'Gemini Integration', status: 'online', latency: '120ms' },
        { name: 'Redis Cache', status: 'online', latency: '5ms' },
        { name: 'PostgreSQL DB', status: 'online', latency: '15ms' }
    ]
};

const DEFAULT_CONSOLE = {
    logs: [
        { timestamp: '2026-07-30T10:00:00', level: 'INFO', message: 'System startup complete.' },
        { timestamp: '2026-07-30T10:05:00', level: 'WARN', message: 'High memory usage detected in indexing worker.' },
        { timestamp: '2026-07-30T10:15:00', level: 'ERROR', message: 'Failed to connect to monitoring service.' }
    ]
};

const DEFAULT_AI_MODULES = [
    { id: 'm1', name: 'Text Summarization', status: 'active', usage: 'High' },
    { id: 'm2', name: 'Code Generation', status: 'active', usage: 'Medium' },
    { id: 'm3', name: 'Sentiment Analysis', status: 'inactive', usage: 'Low' }
];

const DEFAULT_RAG_PIPELINE = {
    nodes: [
        { id: 'docs', name: 'Document Ingestion', status: 'success' },
        { id: 'chunking', name: 'Semantic Chunking', status: 'success' },
        { id: 'embeddings', name: 'Vector Embeddings', status: 'success' },
        { id: 'vectordb', name: 'Vector Database', status: 'success' },
        { id: 'retriever', name: 'Context Retriever', status: 'warning' },
        { id: 'llm', name: 'LLM Generation', status: 'success' },
        { id: 'answer', name: 'Final Answer', status: 'success' }
    ]
};

const DEFAULT_KNOWLEDGE = {
    documents: [
        { id: 'd1', title: 'Architecture Diagram v2', type: 'diagram', updated: '2026-07-28' },
        { id: 'd2', title: 'API Specification', type: 'markdown', updated: '2026-07-29' }
    ]
};

const DEFAULT_BUSINESS_DOCS = {
    documents: [
        { id: 'b1', title: 'Q3 Financials', type: 'spreadsheet', updated: '2026-07-15' },
        { id: 'b2', title: 'Product Roadmap 2026', type: 'presentation', updated: '2026-07-20' }
    ]
};

const DEFAULT_DOCS = {
    items: [
        { id: 'doc1', title: 'Getting Started Guide', category: 'General' },
        { id: 'doc2', title: 'Developer Onboarding', category: 'Engineering' }
    ]
};

const DEFAULT_GIT = {
    branches: ['main', 'dev', 'feature/rag-upgrade'],
    recentCommits: [
        { hash: 'a1b2c3d', message: 'Fix vector retrieval bug', author: 'Alex', date: '2026-07-29' },
        { hash: 'e4f5g6h', message: 'Update UI components', author: 'Sam', date: '2026-07-28' }
    ]
};

const DEFAULT_ANALYTICS = {
    dailyActiveUsers: 1250,
    apiRequests: 45000,
    errorRate: '0.5%'
};

const DEFAULT_TESTING = {
    suites: [
        { name: 'Unit Tests', passed: 450, failed: 2, coverage: '85%' },
        { name: 'Integration Tests', passed: 120, failed: 0, coverage: '70%' },
        { name: 'E2E Tests', passed: 35, failed: 1, coverage: '60%' }
    ]
};

const DEFAULT_RECENT_ACTIVITY = [
    { id: 1, type: 'deploy', description: 'Backend service deployed to production', timestamp: '2026-07-30T09:30:00' },
    { id: 2, type: 'commit', description: 'Merged pull request #45', timestamp: '2026-07-30T11:15:00' },
    { id: 3, type: 'alert', description: 'Redis memory usage warning', timestamp: '2026-07-30T14:20:00' }
];

const DEFAULT_NOTIFICATIONS = [
    { id: 1, title: 'System Update', message: 'v2.4.1 installed successfully', read: false },
    { id: 2, title: 'Task Assigned', message: 'You have been assigned to "Write tests"', read: true }
];

const DEFAULT_SETTINGS = {
    theme: 'dark',
    notificationsEnabled: true,
    autoRefresh: true
};

window.DEFAULT_DATA = {
    OVERVIEW: DEFAULT_OVERVIEW,
    SPRINT_ROADMAP: DEFAULT_SPRINT_ROADMAP,
    FOCUS: DEFAULT_FOCUS,
    TASKS: DEFAULT_TASKS,
    BACKEND: DEFAULT_BACKEND,
    CONSOLE: DEFAULT_CONSOLE,
    AI_MODULES: DEFAULT_AI_MODULES,
    RAG_PIPELINE: DEFAULT_RAG_PIPELINE,
    KNOWLEDGE: DEFAULT_KNOWLEDGE,
    BUSINESS_DOCS: DEFAULT_BUSINESS_DOCS,
    DOCS: DEFAULT_DOCS,
    GIT: DEFAULT_GIT,
    ANALYTICS: DEFAULT_ANALYTICS,
    TESTING: DEFAULT_TESTING,
    RECENT_ACTIVITY: DEFAULT_RECENT_ACTIVITY,
    NOTIFICATIONS: DEFAULT_NOTIFICATIONS,
    SETTINGS: DEFAULT_SETTINGS
};
