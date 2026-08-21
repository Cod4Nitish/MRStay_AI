// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    // Initialize Lucide icons if available globally
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize Authentication
    if (typeof Auth !== 'undefined') {
        Auth.init();
        if (!Auth.isLoggedIn()) return; // Stop initializing dashboard if not logged in
    } else {
        console.warn('Auth module not found.');
    }

    // Initialize Dashboard Clock
    setupClock();

    // Setup Sidebar Interactions
    setupSidebar();

    // Setup Hash Router
    window.addEventListener('hashchange', handleHashChange);
    
    // Trigger initial route
    if (!window.location.hash) {
        window.location.hash = '#overview';
    } else {
        handleHashChange();
    }

    // Calculate dynamic Health Score based on local DB metrics
    calculateHealthScore();
    
    // Periodic health check (every 5 minutes)
    setInterval(calculateHealthScore, 5 * 60 * 1000);
}

function setupClock() {
    const clockEl = document.getElementById('dashboard-clock');
    if (!clockEl) return;
    
    const updateTime = () => {
        const now = new Date();
        clockEl.textContent = now.toLocaleString();
    };
    updateTime();
    setInterval(updateTime, 1000);
}

function setupSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function handleHashChange() {
    const hash = window.location.hash.substring(1) || 'overview';
    const appRoot = document.getElementById('app-root');
    
    if (appRoot) {
        appRoot.innerHTML = ''; // Clear main content container
    }
    
    // Reflect active state in sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + hash) {
            link.classList.add('active');
        }
    });
    
    const ROUTES = {
        overview: "renderOverview",
        sprint: "renderSprint",
        focus: "renderFocus",
        kanban: "renderKanban",

        backend: "renderBackend",
        console: "renderConsole",
        testing: "renderTesting",
        git: "renderGit",

        ai_modules: "renderAiModules",
        rag: "renderRAG",
        knowledge: "renderKnowledge",
        business_docs: "renderBusinessDocs",
        docs: "renderDocs",
        analytics: "renderAnalytics",

        activity: "renderActivity",
        notifications: "renderNotifications",
        settings: "renderSettings"
    };

    const functionName =
        ROUTES[hash] ||
        (
            "render" +
            hash.charAt(0).toUpperCase() +
            hash.slice(1).replace(/_([a-z])/g, (_, c) => c.toUpperCase())
        );
    
    // Call the corresponding module's render function
    if (typeof window[functionName] === 'function') {
        window[functionName](appRoot);
    } else {
        if (appRoot) {
            appRoot.innerHTML = `
            <div class="page-section active" id="${hash}-page">
                <div class="section-header">
                    <h2 class="section-title">${hash.replace(/_/g, ' ').toUpperCase()}</h2>
                    <p class="section-subtitle">Module under construction.</p>
                </div>
                <div class="card">
                    <div class="card-content">
                        <p>The module <code>${functionName}</code> is currently being built.</p>
                    </div>
                </div>
            </div>`;
        }
        console.warn(`Render function ${functionName} not found.`);
    }
    
    // Re-initialize icons for newly added DOM elements
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function calculateHealthScore() {
    if (!window.DB || !window.DEFAULT_DATA) {
        console.warn('DB or DEFAULT_DATA not initialized. Health score skipped.');
        return;
    }
    
    const tasks = DB.load(DB.KEYS.TASKS, window.DEFAULT_DATA.TASKS);
    const backend = DB.load(DB.KEYS.BACKEND, window.DEFAULT_DATA.BACKEND);
    const testing = DB.load(DB.KEYS.TESTING, window.DEFAULT_DATA.TESTING);
    const docs = DB.load(DB.KEYS.DOCS, window.DEFAULT_DATA.DOCS);
    
    let score = 100;
    
    const doneCount = tasks['Done']?.length || 0;
    const backlogCount = tasks['Backlog']?.length || 0;
    if (backlogCount > doneCount * 2) {
        score -= 10;
    }
    
    const offlineServices = backend.services?.filter(s => s.status !== 'online').length || 0;
    score -= (offlineServices * 15);
    
    let failedTests = 0;
    if (testing.suites) {
        testing.suites.forEach(suite => failedTests += suite.failed);
    }
    score -= (failedTests * 5);
    
    if (!docs.items || docs.items.length === 0) {
        score -= 5;
    }
    
    score = Math.max(0, Math.min(100, score));
    
    const overview = DB.load(DB.KEYS.OVERVIEW, window.DEFAULT_DATA.OVERVIEW);
    overview.healthScore = score;
    DB.save(DB.KEYS.OVERVIEW, overview);
    
    console.log(`System Health Score calculated: ${score}/100`);
    
    window.dispatchEvent(new CustomEvent('healthScoreUpdated', { detail: score }));
}

/*
--------------------------------------------------
Top Navigation Date
--------------------------------------------------
*/

function updateNavDate() {
    const navDate = document.getElementById("navDate");
    if (!navDate) return;

    const now = new Date();
    navDate.textContent = now.toLocaleString("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

updateNavDate();
setInterval(updateNavDate, 60000);