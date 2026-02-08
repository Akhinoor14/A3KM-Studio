// Analytics Manager - Mobile Admin
let analyticsData = {
    totalViews: 0,
    managersUsed: new Set(),
    timeSpent: 0,
    downloads: 0,
    activities: [],
    managerUsage: {},
    contentBreakdown: {},
    hourlyUsage: Array(24).fill(0)
};

let currentRange = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadAnalyticsData();
    renderAnalytics();
    trackPageView();
});

// Load Analytics Data from localStorage
function loadAnalyticsData() {
    const stored = localStorage.getItem('analytics_data');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            analyticsData = {
                ...analyticsData,
                ...parsed,
                managersUsed: new Set(parsed.managersUsed || []),
                activities: parsed.activities || []
            };
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
    
    // Initialize default values
    analyticsData.managerUsage = analyticsData.managerUsage || {};
    analyticsData.contentBreakdown = analyticsData.contentBreakdown || {
        books: 0,
        videos: 0,
        posts: 0,
        papers: 0,
        courses: 0,
        projects: 0
    };
}

// Save Analytics Data
function saveAnalyticsData() {
    const toSave = {
        ...analyticsData,
        managersUsed: Array.from(analyticsData.managersUsed)
    };
    localStorage.setItem('analytics_data', JSON.stringify(toSave));
}

// Track Page View (called from other managers)
function trackPageView() {
    analyticsData.totalViews++;
    
    // Track current hour
    const hour = new Date().getHours();
    analyticsData.hourlyUsage[hour]++;
    
    saveAnalyticsData();
}

// Track Manager Usage
function trackManagerUsage(managerName) {
    analyticsData.managersUsed.add(managerName);
    analyticsData.managerUsage[managerName] = (analyticsData.managerUsage[managerName] || 0) + 1;
    
    addActivity(`Opened ${managerName}`, 'fa-folder-open');
    saveAnalyticsData();
}

// Track Download
function trackDownload(itemName, category) {
    analyticsData.downloads++;
    analyticsData.contentBreakdown[category] = (analyticsData.contentBreakdown[category] || 0) + 1;
    
    addActivity(`Downloaded ${itemName}`, 'fa-download');
    saveAnalyticsData();
}

// Add Activity
function addActivity(text, icon) {
    const activity = {
        text,
        icon,
        time: Date.now()
    };
    
    analyticsData.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (analyticsData.activities.length > 50) {
        analyticsData.activities = analyticsData.activities.slice(0, 50);
    }
    
    saveAnalyticsData();
}

// Render All Analytics
function renderAnalytics() {
    renderOverviewStats();
    renderManagerUsageChart();
    renderContentBreakdown();
    renderActivityTimeline();
    renderHourlyChart();
}

// Render Overview Stats
function renderOverviewStats() {
    document.getElementById('totalViews').textContent = formatNumber(analyticsData.totalViews);
    document.getElementById('managersUsed').textContent = analyticsData.managersUsed.size;
    document.getElementById('totalTime').textContent = formatTime(analyticsData.timeSpent);
    document.getElementById('totalDownloads').textContent = formatNumber(analyticsData.downloads);
}

// Render Manager Usage Chart
function renderManagerUsageChart() {
    const chart = document.getElementById('managerChart');
    const usage = analyticsData.managerUsage;
    
    if (Object.keys(usage).length === 0) {
        // Generate demo data
        usage['Books'] = 45;
        usage['Videos'] = 38;
        usage['Posts'] = 32;
        usage['Arduino'] = 28;
        usage['Settings'] = 15;
    }
    
    // Sort by usage
    const sorted = Object.entries(usage).sort((a, b) => b[1] - a[1]);
    const maxValue = Math.max(...sorted.map(([, v]) => v));
    
    chart.innerHTML = sorted.slice(0, 8).map(([name, count]) => {
        const percentage = (count / maxValue) * 100;
        return `
            <div class="bar-item">
                <div class="bar-label">${name}</div>
                <div class="bar-wrapper">
                    <div class="bar-fill" style="width: ${percentage}%">
                        <span class="bar-value">${count}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Content Breakdown
function renderContentBreakdown() {
    const breakdown = document.getElementById('contentBreakdown');
    const data = analyticsData.contentBreakdown;
    
    // Generate demo data if empty
    if (Object.values(data).every(v => v === 0)) {
        data.books = 23;
        data.videos = 45;
        data.posts = 12;
        data.papers = 8;
        data.courses = 15;
        data.projects = 63;
    }
    
    const items = [
        { key: 'books', label: 'Books', icon: 'fa-book' },
        { key: 'videos', label: 'Videos', icon: 'fa-video' },
        { key: 'posts', label: 'Posts', icon: 'fa-file-alt' },
        { key: 'papers', label: 'Papers', icon: 'fa-file-pdf' },
        { key: 'courses', label: 'Courses', icon: 'fa-graduation-cap' },
        { key: 'projects', label: 'Projects', icon: 'fa-code' }
    ];
    
    breakdown.innerHTML = items.map(item => `
        <div class="breakdown-item">
            <div class="breakdown-icon ${item.key}">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="breakdown-count">${data[item.key] || 0}</div>
            <div class="breakdown-label">${item.label}</div>
        </div>
    `).join('');
}

// Render Activity Timeline
function renderActivityTimeline() {
    const timeline = document.getElementById('activityTimeline');
    const empty = document.getElementById('emptyActivity');
    const activities = analyticsData.activities;
    
    // Generate demo activities if empty
    if (activities.length === 0) {
        const demoActivities = [
            { text: 'Opened Books Manager', icon: 'fa-book', time: Date.now() - 300000 },
            { text: 'Downloaded Arduino Project', icon: 'fa-download', time: Date.now() - 600000 },
            { text: 'Viewed Video Content', icon: 'fa-video', time: Date.now() - 1200000 },
            { text: 'Opened Settings', icon: 'fa-cog', time: Date.now() - 1800000 },
            { text: 'GitHub Sync Complete', icon: 'fa-sync-alt', time: Date.now() - 3600000 }
        ];
        
        timeline.innerHTML = demoActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${formatTimeAgo(new Date(activity.time))}</div>
                </div>
            </div>
        `).join('');
        
        timeline.style.display = 'flex';
        empty.style.display = 'none';
        return;
    }
    
    timeline.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${formatTimeAgo(new Date(activity.time))}</div>
            </div>
        </div>
    `).join('');
    
    timeline.style.display = 'flex';
    empty.style.display = 'none';
}

// Render Hourly Chart
function renderHourlyChart() {
    const chart = document.getElementById('hourChart');
    const hourly = analyticsData.hourlyUsage;
    
    // Generate demo data if all zeros
    if (hourly.every(h => h === 0)) {
        for (let i = 0; i < 24; i++) {
            hourly[i] = Math.floor(Math.random() * 10);
        }
    }
    
    const maxValue = Math.max(...hourly);
    
    chart.innerHTML = hourly.map((value, index) => {
        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
        const label = index === 0 ? '12a' : 
                     index === 12 ? '12p' : 
                     index < 12 ? `${index}a` : `${index - 12}p`;
        
        return `
            <div class="hour-bar" style="height: ${height}%" title="${value} views at ${label}">
                <span class="hour-label">${label}</span>
            </div>
        `;
    }).join('');
}

// Select Time Range
function selectRange(range) {
    currentRange = range;
    
    // Update button states
    document.querySelectorAll('.range-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.range === range) {
            btn.classList.add('active');
        }
    });
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    
    // In real implementation, filter data by range
    showToast(`Showing ${range === 'all' ? 'all time' : range} data`, 'info');
}

// Format Number
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Format Time
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Format Time Ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Export Analytics
function exportAnalytics() {
    const data = {
        overview: {
            totalViews: analyticsData.totalViews,
            managersUsed: Array.from(analyticsData.managersUsed),
            timeSpent: analyticsData.timeSpent,
            downloads: analyticsData.downloads
        },
        managerUsage: analyticsData.managerUsage,
        contentBreakdown: analyticsData.contentBreakdown,
        hourlyUsage: analyticsData.hourlyUsage,
        recentActivities: analyticsData.activities.slice(0, 20),
        exportDate: new Date().toISOString()
    };
    
    // CSV format
    let csv = 'OnlyBoss Analytics Report\n\n';
    csv += 'Overview\n';
    csv += `Total Views,${data.overview.totalViews}\n`;
    csv += `Managers Used,${data.overview.managersUsed.length}\n`;
    csv += `Time Spent,${formatTime(data.overview.timeSpent)}\n`;
    csv += `Downloads,${data.overview.downloads}\n\n`;
    
    csv += 'Manager Usage\n';
    csv += 'Manager,Count\n';
    Object.entries(data.managerUsage).forEach(([name, count]) => {
        csv += `${name},${count}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onlyboss-analytics-${Date.now()}.csv`;
    a.click();
    
    URL.revokeObjectURL(url);
    showToast('✓ Analytics exported!', 'success');
}

// Clear Analytics
function clearAnalytics() {
    const confirmed = confirm('Clear all analytics data?\n\nThis will reset all statistics and cannot be undone.');
    if (!confirmed) return;
    
    analyticsData = {
        totalViews: 0,
        managersUsed: new Set(),
        timeSpent: 0,
        downloads: 0,
        activities: [],
        managerUsage: {},
        contentBreakdown: {},
        hourlyUsage: Array(24).fill(0)
    };
    
    saveAnalyticsData();
    renderAnalytics();
    
    showToast('✓ Analytics data cleared!', 'success');
}

// Refresh Analytics
function refreshAnalytics() {
    loadAnalyticsData();
    renderAnalytics();
    showToast('✓ Refreshed!', 'success');
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(20);
    }
}

// Show Toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #F44336 0%, #E57373 100%)';
    } else if (type === 'warning') {
        toast.style.background = 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)';
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Navigation
function goBack() {
    window.location.href = '../../dashboard/index.html';
}

// Export tracking functions for use in other managers
window.trackManagerUsage = trackManagerUsage;
window.trackDownload = trackDownload;
window.addActivity = addActivity;
