// GitHub Sync Manager - Mobile Admin
let githubToken = '';
let repoOwner = '';
let repoName = '';
let currentBranch = 'main';
let commitHistory = [];
let fileChanges = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubConfig();
    checkConnection();
    loadCommitHistory();
    
    // Setup form handler
    document.getElementById('commitForm').addEventListener('submit', handleCommit);
    
    // Close overlay
    document.getElementById('overlay').addEventListener('click', () => {
        closeCommitSheet();
    });
});

// Load GitHub Configuration
function loadGitHubConfig() {
    githubToken = localStorage.getItem('github_token') || '';
    const repo = localStorage.getItem('github_repo') || 'Akhinoor14/A3KM-Studio';
    
    if (!githubToken) {
        showStatusBar('disconnected', 'Not configured. Go to Settings to add GitHub token.');
        document.getElementById('repoName').textContent = 'Not configured';
        return false;
    }
    
    // Parse repo owner and name
    const parts = repo.split('/');
    if (parts.length === 2) {
        repoOwner = parts[0];
        repoName = parts[1];
        document.getElementById('repoName').textContent = repo;
    } else {
        showStatusBar('disconnected', 'Invalid repository format');
        return false;
    }
    
    return true;
}

// Check GitHub Connection
async function checkConnection() {
    if (!githubToken) {
        showStatusBar('disconnected', 'Not configured');
        return false;
    }
    
    showStatusBar('checking', 'Checking connection...');
    
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            showStatusBar('connected', `Connected as ${user.login}`);
            return true;
        } else {
            showStatusBar('disconnected', 'Unable to authenticate. Check token in Settings.');
            return false;
        }
    } catch (error) {
        showStatusBar('disconnected', 'Connection error. Check your internet connection.');
        return false;
    }
}

// Show Status Bar
function showStatusBar(status, message) {
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    
    statusIcon.className = `status-icon ${status}`;
    statusText.textContent = message;
}

// Refresh Status
async function refreshStatus() {
    const refreshBtn = document.querySelector('.refresh-btn');
    refreshBtn.classList.add('spinning');
    
    await checkConnection();
    await loadCommitHistory();
    
    setTimeout(() => {
        refreshBtn.classList.remove('spinning');
    }, 1000);
    
    showToast('✓ Refreshed', 'success');
}

// Load Commit History
async function loadCommitHistory() {
    if (!githubToken || !repoOwner || !repoName) {
        showCommitsEmpty();
        return;
    }
    
    showCommitsLoading();
    
    try {
        const response = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=20`,
            {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );
        
        if (response.ok) {
            commitHistory = await response.json();
            renderCommits();
            updateLastSync();
        } else {
            throw new Error('Failed to load commits');
        }
    } catch (error) {
        console.error('Error loading commits:', error);
        showCommitsEmpty();
        showToast('✗ Failed to load commits', 'error');
    }
}

// Show Commits Loading
function showCommitsLoading() {
    document.getElementById('commitsList').style.display = 'none';
    document.getElementById('commitsEmpty').style.display = 'none';
    document.getElementById('commitsLoading').style.display = 'flex';
}

// Show Commits Empty
function showCommitsEmpty() {
    document.getElementById('commitsList').style.display = 'none';
    document.getElementById('commitsLoading').style.display = 'none';
    document.getElementById('commitsEmpty').style.display = 'flex';
}

// Render Commits
function renderCommits() {
    const commitsList = document.getElementById('commitsList');
    
    if (commitHistory.length === 0) {
        showCommitsEmpty();
        return;
    }
    
    document.getElementById('commitsLoading').style.display = 'none';
    document.getElementById('commitsEmpty').style.display = 'none';
    document.getElementById('commitsList').style.display = 'flex';
    
    commitsList.innerHTML = commitHistory.map(commit => {
        const author = commit.commit.author;
        const message = commit.commit.message.split('\n')[0]; // First line only
        const sha = commit.sha.substring(0, 7);
        const date = new Date(author.date);
        const timeAgo = formatTimeAgo(date);
        
        // Get author initials
        const initials = author.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
        
        return `
            <div class="commit-card" onclick="openCommitDetails('${commit.sha}')">
                <div class="commit-header">
                    <div class="commit-avatar">
                        ${commit.author && commit.author.avatar_url ? 
                            `<img src="${commit.author.avatar_url}" alt="${author.name}">` :
                            initials
                        }
                    </div>
                    <div class="commit-author">
                        <div class="commit-author-name">${author.name}</div>
                        <div class="commit-time">${timeAgo}</div>
                    </div>
                </div>
                <div class="commit-message">${message}</div>
                <span class="commit-sha">${sha}</span>
            </div>
        `;
    }).join('');
}

// Format Time Ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
}

// Update Last Sync Time
function updateLastSync() {
    const lastSyncTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('lastSync').textContent = lastSyncTime;
    localStorage.setItem('last_sync_time', Date.now().toString());
}

// Open Commit Details
function openCommitDetails(sha) {
    const commit = commitHistory.find(c => c.sha === sha);
    if (!commit) return;
    
    const url = `https://github.com/${repoOwner}/${repoName}/commit/${sha}`;
    window.open(url, '_blank');
}

// Switch Tab
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load data for the tab
    if (tabName === 'changes') {
        loadFileChanges();
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Load File Changes (simulated - requires server-side git operations)
function loadFileChanges() {
    // In a real implementation, this would call a backend API to get git status
    // For now, we'll show a message
    document.getElementById('changesList').style.display = 'none';
    document.getElementById('changesLoading').style.display = 'none';
    document.getElementById('changesEmpty').style.display = 'flex';
}

// Show Commit Sheet
function showCommitSheet() {
    if (!githubToken) {
        if (confirm('GitHub token not configured. Go to Settings?')) {
            window.location.href = '../settings/index.html';
        }
        return;
    }
    
    document.getElementById('commitSheet').classList.add('open');
    document.getElementById('overlay').classList.add('visible');
    
    // Update file count (simulated)
    document.getElementById('filesCount').textContent = '0';
}

// Close Commit Sheet
function closeCommitSheet() {
    document.getElementById('commitSheet').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
}

// Handle Commit
async function handleCommit(e) {
    e.preventDefault();
    
    const message = document.getElementById('commitMessage').value.trim();
    const description = document.getElementById('commitDescription').value.trim();
    const pushAfter = document.getElementById('pushAfterCommit').checked;
    
    if (!message) {
        showToast('⚠️ Commit message is required', 'warning');
        return;
    }
    
    const fullMessage = description ? `${message}\n\n${description}` : message;
    
    showToast('🚧 Commit functionality requires backend API', 'info');
    
    // Note: Actual commit & push requires a backend service
    // GitHub API doesn't support direct commits without file contents
    // You would need to:
    // 1. Get current tree SHA
    // 2. Create blobs for changed files
    // 3. Create new tree
    // 4. Create commit
    // 5. Update branch reference
    
    // For demonstration purposes:
    setTimeout(() => {
        closeCommitSheet();
        showToast('✓ Commit created (demo mode)', 'success');
        document.getElementById('commitForm').reset();
    }, 1000);
}

// Pull Changes
async function pullChanges() {
    if (!githubToken) {
        showToast('⚠️ Configure GitHub token first', 'warning');
        return;
    }
    
    showToast('🚧 Pull functionality requires backend service', 'info');
    
    // In real implementation, this would:
    // 1. Fetch latest from remote
    // 2. Merge or rebase with local files
    // 3. Update working directory
    // This requires server-side git operations
}

// Sync All
async function syncAll() {
    if (!githubToken) {
        showToast('⚠️ Configure GitHub token first', 'warning');
        return;
    }
    
    showToast('🔄 Syncing...', 'info');
    
    // Refresh commit history
    await loadCommitHistory();
    
    showToast('✓ Sync complete', 'success');
}

// Show Toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #238636 0%, #2ea043 100%)';
        toast.style.color = 'white';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #f85149 0%, #ff6b6b 100%)';
        toast.style.color = 'white';
    } else if (type === 'warning') {
        toast.style.background = 'linear-gradient(135deg, #d29922 0%, #f0ad4e 100%)';
        toast.style.color = 'white';
    } else {
        toast.style.background = 'linear-gradient(135deg, #58a6ff 0%, #79b8ff 100%)';
        toast.style.color = 'white';
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        if (type === 'error') {
            navigator.vibrate([50, 30, 50]);
        } else {
            navigator.vibrate(20);
        }
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Navigation
function goBack() {
    window.location.href = '../../dashboard/index.html';
}

// Note: Full GitHub sync functionality requires a backend service
// The GitHub API has limitations:
// - Cannot directly commit without file contents
// - Cannot perform git pull/push operations
// - Rate limits apply (5000 requests/hour for authenticated users)
//
// For production, you would need:
// 1. A Node.js/Python backend service
// 2. Server-side git operations using libraries like nodegit or GitPython
// 3. Webhook integration for real-time updates
// 4. Proper authentication and authorization
//
// This implementation provides:
// - Commit history viewer (working)
// - Connection status (working)
// - UI for commit/push/pull (frontend only, requires backend)
