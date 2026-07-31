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

    // Setup AI Chat Widget logic
    setupAIChatWidget();
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
    
    // Construct render function name (e.g. #rag_pipeline -> renderRagPipeline)
    const functionName = 'render' + hash.charAt(0).toUpperCase() + hash.slice(1).replace(/_([a-z])/g, (m, p1) => p1.toUpperCase());
    
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
    
    // Metric 1: Tasks - Penalize if backlog outweighs done items significantly
    const doneCount = tasks['Done']?.length || 0;
    const backlogCount = tasks['Backlog']?.length || 0;
    if (backlogCount > doneCount * 2) {
        score -= 10;
    }
    
    // Metric 2: Backend - Penalize heavily for offline services
    const offlineServices = backend.services?.filter(s => s.status !== 'online').length || 0;
    score -= (offlineServices * 15);
    
    // Metric 3: Testing - Penalize for failed test cases
    let failedTests = 0;
    if (testing.suites) {
        testing.suites.forEach(suite => failedTests += suite.failed);
    }
    score -= (failedTests * 5);
    
    // Metric 4: Documentation - Minor penalty for poor documentation coverage
    if (!docs.items || docs.items.length === 0) {
        score -= 5;
    }
    
    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    // Save updated score back to OVERVIEW DB
    const overview = DB.load(DB.KEYS.OVERVIEW, window.DEFAULT_DATA.OVERVIEW);
    overview.healthScore = score;
    DB.save(DB.KEYS.OVERVIEW, overview);
    
    console.log(`System Health Score calculated: ${score}/100`);
    
    // Dispatch a custom event so the UI can update if Overview is currently visible
    window.dispatchEvent(new CustomEvent('healthScoreUpdated', { detail: score }));
}

function setupAIChatWidget() {
    const toggleBtn = document.getElementById('ai-chat-toggle');
    const panel = document.getElementById('ai-chat-panel');
    const closeBtn = document.getElementById('ai-chat-close');
    
    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('hidden');
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.classList.add('hidden');
            });
        }
        
        const sendBtn = document.getElementById('ai-chat-send');
        const inputField = document.getElementById('ai-chat-input');
        const messagesArea = document.getElementById('ai-chat-messages');
        
        if (sendBtn && inputField && messagesArea) {
            const handleSend = async () => {
                const text = inputField.value.trim();
                if (!text) return;
                
                // Add user message
                const userMsg = document.createElement('div');
                userMsg.className = 'chat-message user-message';
                userMsg.innerHTML = `<div class="message-content">${text}</div>`;
                messagesArea.appendChild(userMsg);
                inputField.value = '';
                
                // Scroll to bottom
                messagesArea.scrollTop = messagesArea.scrollHeight;
                
                // Add typing indicator
                const typingMsg = document.createElement('div');
                typingMsg.className = 'chat-message ai-message';
                typingMsg.id = 'ai-typing-indicator';
                typingMsg.innerHTML = `<div class="message-content"><i class="fas fa-spinner fa-spin"></i> Thinking...</div>`;
                messagesArea.appendChild(typingMsg);
                messagesArea.scrollTop = messagesArea.scrollHeight;

                try {
                    // Call Backend RAG API
                    const response = await window.API.queryRAG(text);
                    
                    // Remove typing indicator
                    const indicator = document.getElementById('ai-typing-indicator');
                    if (indicator) indicator.remove();

                    let answer = "Sorry, I could not process your request.";
                    let sourcesHtml = "";

                    if (response && response.success && response.data) {
                        answer = response.data.answer;
                        if (response.data.sources && response.data.sources.length > 0) {
                            sourcesHtml = '<div style="margin-top: 10px; font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 5px;"><strong>Sources:</strong><ul>';
                            response.data.sources.forEach(src => {
                                sourcesHtml += `<li>${src.document} (Score: ${src.score})</li>`;
                            });
                            sourcesHtml += '</ul></div>';
                        }
                    }

                    const aiMsg = document.createElement('div');
                    aiMsg.className = 'chat-message ai-message';
                    aiMsg.innerHTML = `<div class="message-content">${answer.replace(/\n/g, '<br>')}${sourcesHtml}</div>`;
                    messagesArea.appendChild(aiMsg);

                } catch (error) {
                    console.error("AI Chat Error:", error);
                    const indicator = document.getElementById('ai-typing-indicator');
                    if (indicator) indicator.remove();
                    
                    const errMsg = document.createElement('div');
                    errMsg.className = 'chat-message ai-message';
                    errMsg.innerHTML = `<div class="message-content" style="color: var(--danger);">An error occurred connecting to the AI.</div>`;
                    messagesArea.appendChild(errMsg);
                }

                messagesArea.scrollTop = messagesArea.scrollHeight;
            };
            
            sendBtn.addEventListener('click', handleSend);
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleSend();
            });
        }
    } else {
        console.warn('AI Chat Widget elements not fully found in DOM.');
    }
}
