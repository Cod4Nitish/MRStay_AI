/**
 * auth.js — MRStay Dashboard Authentication
 * Handles login, logout, session management.
 * Uses localStorage for session persistence.
 */

const Auth = {
  // Hardcoded user credentials
  // CHANGE THESE BEFORE HOSTING!
  users: [
    {
      username: 'admin',
      password: 'admin@123',
      displayName: 'Admin',
      role: 'admin',      // admin = full edit + view
      avatar: 'AD'
    },
    {
      username: 'manager',
      password: 'manager@123',
      displayName: 'Manager',
      role: 'manager',    // manager = view only
      avatar: 'MG'
    }
  ],

  // Session expiry time (8 hours in milliseconds)
  SESSION_EXPIRY: 8 * 60 * 60 * 1000,

  /**
   * Attempt login with username and password
   * @returns {object|null} User object on success, null on failure
   */
  login(username, password) {
    const user = Auth.users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    
    if (user) {
      const session = {
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
        loginTime: Date.now(),
        expiresAt: Date.now() + Auth.SESSION_EXPIRY
      };
      DB.save(DB.KEYS.SESSION, session);
      return session;
    }
    return null;
  },

  /**
   * Logout — clear session and reload
   */
  logout() {
    DB.remove(DB.KEYS.SESSION);
    window.location.reload();
  },

  /**
   * Check if user is currently logged in (with valid session)
   * @returns {boolean}
   */
  isLoggedIn() {
    const session = DB.load(DB.KEYS.SESSION);
    if (!session) return false;
    
    // Check expiry
    if (Date.now() > session.expiresAt) {
      DB.remove(DB.KEYS.SESSION);
      return false;
    }
    return true;
  },

  /**
   * Get current logged-in user session
   * @returns {object|null}
   */
  getCurrentUser() {
    if (!Auth.isLoggedIn()) return null;
    return DB.load(DB.KEYS.SESSION);
  },

  /**
   * Check if current user is admin
   * @returns {boolean}
   */
  isAdmin() {
    const user = Auth.getCurrentUser();
    return user && user.role === 'admin';
  },

  /**
   * Initialize auth — show login if not authenticated, otherwise show dashboard
   */
  init() {
    const loginOverlay = document.getElementById('loginOverlay');
    const dashboardLayout = document.querySelector('.dashboard-layout');
    
    if (Auth.isLoggedIn()) {
      // User is logged in — hide login, show dashboard
      if (loginOverlay) loginOverlay.style.display = 'none';
      if (dashboardLayout) dashboardLayout.style.display = '';
      Auth.updateUI();
    } else {
      // Not logged in — show login, hide dashboard
      if (loginOverlay) loginOverlay.style.display = 'flex';
      if (dashboardLayout) dashboardLayout.style.display = 'none';
    }
    
    // Setup login form
    Auth.setupLoginForm();
    Auth.setupLogout();
  },

  /**
   * Setup login form event handlers
   */
  setupLoginForm() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
          Auth.showLoginError('Please enter username and password');
          return;
        }
        
        const session = Auth.login(username, password);
        if (session) {
          // Success — reload to show dashboard
          window.location.reload();
        } else {
          Auth.showLoginError('Invalid username or password');
          // Shake animation
          const card = document.querySelector('.login-card');
          if (card) {
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
          }
        }
      });
    }
  },

  /**
   * Show login error message
   */
  showLoginError(message) {
    const errorEl = document.getElementById('loginError');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  },

  /**
   * Setup logout button
   */
  setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
      });
    }
  },

  /**
   * Update UI elements with current user info
   */
  updateUI() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    
    // Update sidebar footer
    const userName = document.getElementById('userDisplayName');
    const userRole = document.getElementById('userDisplayRole');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) userName.textContent = user.displayName;
    if (userRole) userRole.textContent = user.role === 'admin' ? 'Administrator' : 'Manager';
    if (userAvatar) userAvatar.textContent = user.avatar;
    
    // Update profile avatars
    const profileAvatars = document.querySelectorAll('.profile-avatar');
    profileAvatars.forEach(el => { el.textContent = user.avatar; });
    
    // Hide edit buttons for non-admin users
    if (!Auth.isAdmin()) {
      document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = 'none';
      });
    }
  }
};
