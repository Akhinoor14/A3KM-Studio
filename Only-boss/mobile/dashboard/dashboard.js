// ============================================================================
// ONLY BOSS MOBILE - DASHBOARD LOGIC
// Frontend logic for mobile dashboard (Backend auth is same as desktop)
// ============================================================================

// Check authentication (uses same session as desktop)
async function checkAuth() {
    // Validate session using desktop's validation logic
    const isValid = await validateSession();
    
    if (!isValid) {
        window.location.href = '../auth/login.html';
        return false;
    }
    
    return true;
}

// Initialize dashboard
async function initDashboard() {
    // Verify auth first
    const authValid = await checkAuth();
    if (!authValid) return;
    
    // Update UI
    updateSessionTime();
    checkGitHubStatus();
    loadRecentActivity();
    
    // Start session timer
    setInterval(updateSessionTime, 1000);
}

// Update session time display
function updateSessionTime() {
    const authTime = sessionStorage.getItem('authTime');
    if (!authTime) return;
    
    const elapsed = Date.now() - parseInt(authTime);
    const remaining = (30 * 60 * 1000) - elapsed; // 30 min session
    
    if (remaining <= 0) {
        logoutUser();
        return;
    }
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    document.getElementById('sessionTime').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Warning at 5 minutes
    if (remaining <= 5 * 60 * 1000 && !document.body.classList.contains('session-warning')) {
        document.body.classList.add('session-warning');
        showNotification('⚠️ Session expires in 5 minutes', 'warning');
    }
}

// Check GitHub API status
async function checkGitHubStatus() {
    const token = localStorage.getItem('github_token');
    const statusElement = document.getElementById('githubStatus');
    
    if (!token) {
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>GitHub</span>';
        return;
    }
    
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        
        if (response.ok) {
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>GitHub</span>';
            statusElement.classList.add('connected');
        } else {
            statusElement.innerHTML = '<i class="fas fa-circle"></i><span>GitHub</span>';
        }
    } catch (error) {
        statusElement.innerHTML = '<i class="fas fa-circle"></i><span>Offline</span>';
    }
}

// Load recent activity
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    const authTime = sessionStorage.getItem('authTime');
    
    if (authTime) {
        const loginDate = new Date(parseInt(authTime));
        document.getElementById('loginTime').textContent = 
            formatTimeAgo(loginDate);
    }
    
    // Load from localStorage if available
    const recentActions = JSON.parse(localStorage.getItem('recent_actions') || '[]');
    
    if (recentActions.length > 0) {
        recentActions.slice(0, 5).forEach(action => {
            const item = createActivityItem(action);
            activityList.appendChild(item);
        });
    }
}

// Create activity item HTML
function createActivityItem(action) {
    const div = document.createElement('div');
    div.className = 'activity-item';
    div.innerHTML = `
        <div class="activity-icon">
            <i class="${action.icon || 'fas fa-info-circle'}"></i>
        </div>
        <div class="activity-info">
            <div class="activity-text">${action.text}</div>
            <div class="activity-time">${formatTimeAgo(new Date(action.time))}</div>
        </div>
    `;
    return div;
}

// Format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Navigation
function navigateTo(path) {
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    
    // Books manager is ready
    if (path.includes('books')) {
        window.location.href = '../managers/books/index.html';
        return;
    }
    
    // Videos manager is ready
    if (path.includes('videos')) {
        window.location.href = '../managers/videos/index.html';
        return;
    }
    
    // Posts manager is ready
    if (path.includes('posts')) {
        window.location.href = '../managers/posts/index.html';
        return;
    }
    
    // Papers manager is ready
    if (path.includes('papers')) {
        window.location.href = '../managers/papers/index.html';
        return;
    }
    
    // Courses manager is ready
    if (path.includes('courses')) {
        window.location.href = '../managers/courses/index.html';
        return;
    }
    
    // Arduino manager is ready
    if (path.includes('arduino')) {
        window.location.href = '../managers/arduino/index.html';
        return;
    }
    
    // Electronics manager is ready
    if (path.includes('electronics')) {
        window.location.href = '../managers/electronics/index.html';
        return;
    }
    
    // MATLAB manager is ready
    if (path.includes('matlab')) {
        window.location.href = '../managers/matlab/index.html';
        return;
    }
    
    // SolidWorks manager is ready
    if (path.includes('solidworks')) {
        window.location.href = '../managers/solidworks/index.html';
        return;
    }
    
    // Settings manager is ready
    if (path.includes('settings')) {
        window.location.href = '../managers/settings/index.html';
        return;
    }
    
    // Analytics manager is ready
    if (path.includes('analytics')) {
        window.location.href = '../managers/analytics/index.html';
        return;
    }
    
    // For now, show alert for other features (will be implemented later)
    showNotification('🚧 Feature coming soon!', 'info');
    
    // Uncomment when pages are ready:
    // window.location.href = path;
}

// Open GitHub Sync
function openGitHubSync() {
    const token = localStorage.getItem('github_token');
    
    if (!token) {
        if (confirm('GitHub token not configured. Go to settings?')) {
            navigateTo('../managers/settings/index.html');
        }
        return;
    }
    
    // GitHub Sync manager is ready
    window.location.href = '../managers/github-sync/index.html';
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'warning' ? '#FF9900' : type === 'error' ? '#FF3333' : '#0099FF'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Haptic feedback
    if (navigator.vibrate) {
        if (type === 'error') {
            navigator.vibrate([50, 30, 50]);
        } else {
            navigator.vibrate(20);
        }
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Side menu toggle
const menuBtn = document.getElementById('menuBtn');
const menuCloseBtn = document.getElementById('menuCloseBtn');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');

function openMenu() {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

function closeMenu() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

menuBtn.addEventListener('click', openMenu);
menuCloseBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// Logout
const logoutBtn = document.getElementById('logoutBtn');

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session (same as desktop)
        clearSession();
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
        }
        
        // Redirect to login
        window.location.href = '../auth/login.html';
    }
}

logoutBtn.addEventListener('click', logoutUser);

// Clear cache
function clearCache() {
    if (confirm('Clear all cached data?')) {
        localStorage.removeItem('recent_actions');
        showNotification('✅ Cache cleared!', 'info');
        closeMenu();
    }
}

// Prevent back button after logout
window.addEventListener('popstate', async () => {
    const isValid = await validateSession();
    if (!isValid) {
        window.location.href = '../auth/login.html';
    }
});

// Add keyboard listener for shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Q = Logout
    if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        logoutUser();
    }
    
    // Esc = Close menu
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
        closeMenu();
    }
});

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -20px); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translate(-50%, 0); opacity: 1; }
        to { transform: translate(-50%, -20px); opacity: 0; }
    }
`;
document.head.appendChild(style);
