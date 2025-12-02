// Analytics Dashboard - Advanced Analytics Engine
// Author: Only Boss System
// Real-time website analytics with smart insights

// ============================================
// CONFIGURATION & STATE
// ============================================

const STORAGE_KEY = 'analytics_data';
const ACTIVITY_KEY = 'activity_log';
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds
let currentTimeRange = '7d';
let autoRefreshTimer = null;

// Mock Analytics Data Generator (Replace with real API calls)
const analyticsData = {
    stats: {
        totalVisitors: 0,
        pageViews: 0,
        avgSessionDuration: 0,
        bounceRate: 0
    },
    visitors: [],
    trafficSources: [],
    popularPages: [],
    activities: []
};

// ============================================
// DATA INITIALIZATION
// ============================================

function initAnalytics() {
    console.log('🚀 Initializing Analytics Dashboard...');
    
    // Load existing data or generate initial
    loadAnalyticsData();
    
    // Render all sections
    renderStats();
    renderVisitorsChart();
    renderTrafficSources();
    renderPopularPages();
    renderActivityFeed();
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Track this session
    trackActivity('Dashboard Opened', 'Admin opened analytics dashboard', 'info');
    
    console.log('✅ Analytics Dashboard Ready');
}

function loadAnalyticsData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        Object.assign(analyticsData, data);
        console.log('📊 Loaded analytics data from storage');
    } else {
        generateMockData();
        saveAnalyticsData();
    }
}

function saveAnalyticsData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(analyticsData));
}

// ============================================
// MOCK DATA GENERATOR
// ============================================

function generateMockData() {
    console.log('🎲 Generating mock analytics data...');
    
    // Generate stats
    analyticsData.stats = {
        totalVisitors: Math.floor(Math.random() * 10000) + 5000,
        pageViews: Math.floor(Math.random() * 50000) + 20000,
        avgSessionDuration: Math.floor(Math.random() * 300) + 120, // seconds
        bounceRate: Math.floor(Math.random() * 40) + 30 // percentage
    };
    
    // Generate visitor trends (last 7 days)
    const days = currentTimeRange === '7d' ? 7 : currentTimeRange === '30d' ? 30 : 90;
    analyticsData.visitors = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        analyticsData.visitors.push({
            date: date.toISOString().split('T')[0],
            visitors: Math.floor(Math.random() * 500) + 200,
            pageViews: Math.floor(Math.random() * 2000) + 800
        });
    }
    
    // Traffic sources
    analyticsData.trafficSources = [
        { source: 'Direct', icon: 'fa-globe', visitors: Math.floor(Math.random() * 3000) + 1500, percentage: 0 },
        { source: 'Google', icon: 'fa-google', visitors: Math.floor(Math.random() * 2500) + 1200, percentage: 0 },
        { source: 'Social Media', icon: 'fa-share-nodes', visitors: Math.floor(Math.random() * 1500) + 800, percentage: 0 },
        { source: 'Referral', icon: 'fa-link', visitors: Math.floor(Math.random() * 1000) + 500, percentage: 0 }
    ];
    
    // Calculate percentages
    const totalTraffic = analyticsData.trafficSources.reduce((sum, s) => sum + s.visitors, 0);
    analyticsData.trafficSources.forEach(s => {
        s.percentage = Math.round((s.visitors / totalTraffic) * 100);
    });
    
    // Popular pages
    const pages = [
        { title: 'Home Page', path: '/index.html', icon: 'fa-home' },
        { title: 'Arduino Projects', path: '/arduino-mobile.html', icon: 'fa-microchip' },
        { title: 'Electronics Tools', path: '/electronics-mobile.html', icon: 'fa-screwdriver-wrench' },
        { title: 'About Us', path: '/about.html', icon: 'fa-info-circle' },
        { title: 'Contact', path: '/contact.html', icon: 'fa-envelope' }
    ];
    
    analyticsData.popularPages = pages.map((page, index) => ({
        ...page,
        rank: index + 1,
        views: Math.floor(Math.random() * 5000) + 1000,
        avgTime: Math.floor(Math.random() * 300) + 60,
        bounceRate: Math.floor(Math.random() * 50) + 20
    })).sort((a, b) => b.views - a.views);
    
    // Recent activities
    generateRecentActivities();
}

function generateRecentActivities() {
    const activities = [
        { type: 'visit', icon: 'fa-user', title: 'New Visitor', details: 'from Dhaka, Bangladesh', color: '#2196F3' },
        { type: 'page', icon: 'fa-file', title: 'Page View', details: 'viewed Arduino Projects', color: '#4CAF50' },
        { type: 'download', icon: 'fa-download', title: 'Resource Downloaded', details: 'downloaded LED Calculator', color: '#FF9800' },
        { type: 'contact', icon: 'fa-envelope', title: 'Contact Form', details: 'submitted contact form', color: '#9C27B0' },
        { type: 'search', icon: 'fa-search', title: 'Site Search', details: 'searched for "capacitor"', color: '#00BCD4' }
    ];
    
    analyticsData.activities = [];
    for (let i = 0; i < 20; i++) {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const minutesAgo = Math.floor(Math.random() * 60);
        analyticsData.activities.push({
            ...activity,
            timestamp: Date.now() - (minutesAgo * 60000),
            minutesAgo
        });
    }
    
    analyticsData.activities.sort((a, b) => b.timestamp - a.timestamp);
}

// ============================================
// RENDER FUNCTIONS
// ============================================

function renderStats() {
    const stats = [
        {
            title: 'Total Visitors',
            value: formatNumber(analyticsData.stats.totalVisitors),
            icon: 'fa-users',
            change: '+' + (Math.random() * 20 + 5).toFixed(1) + '%',
            positive: true
        },
        {
            title: 'Page Views',
            value: formatNumber(analyticsData.stats.pageViews),
            icon: 'fa-eye',
            change: '+' + (Math.random() * 15 + 8).toFixed(1) + '%',
            positive: true
        },
        {
            title: 'Avg. Session',
            value: formatDuration(analyticsData.stats.avgSessionDuration),
            icon: 'fa-clock',
            change: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 10 + 2).toFixed(1) + '%',
            positive: Math.random() > 0.5
        },
        {
            title: 'Bounce Rate',
            value: analyticsData.stats.bounceRate + '%',
            icon: 'fa-arrow-right-from-bracket',
            change: '-' + (Math.random() * 5 + 1).toFixed(1) + '%',
            positive: true
        }
    ];
    
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-title">${stat.title}</div>
                <div class="stat-icon">
                    <i class="fas ${stat.icon}"></i>
                </div>
            </div>
            <div class="stat-value">${stat.value}</div>
            <div class="stat-change ${stat.positive ? 'positive' : 'negative'}">
                <i class="fas ${stat.positive ? 'fa-arrow-up' : 'fa-arrow-down'}"></i>
                ${stat.change} from last period
            </div>
        </div>
    `).join('');
}

function renderVisitorsChart() {
    const container = document.getElementById('visitorsChart');
    
    const maxVisitors = Math.max(...analyticsData.visitors.map(v => v.visitors));
    const chartHeight = 250;
    const chartWidth = container.offsetWidth || 800;
    const barWidth = (chartWidth / analyticsData.visitors.length) * 0.7;
    const spacing = (chartWidth / analyticsData.visitors.length) * 0.3;
    
    const bars = analyticsData.visitors.map((day, index) => {
        const barHeight = (day.visitors / maxVisitors) * chartHeight * 0.9;
        const x = index * (barWidth + spacing) + spacing / 2;
        const y = chartHeight - barHeight;
        
        return `
            <div style="
                position: absolute;
                left: ${x}px;
                bottom: 0;
                width: ${barWidth}px;
                height: ${barHeight}px;
                background: linear-gradient(to top, #cc0000, #ff3333);
                border-radius: 4px 4px 0 0;
                transition: all 0.3s ease;
                cursor: pointer;
            " 
            onmouseover="this.style.opacity='0.8'"
            onmouseout="this.style.opacity='1'"
            title="${day.date}: ${day.visitors} visitors">
            </div>
        `;
    }).join('');
    
    const labels = analyticsData.visitors.map((day, index) => {
        const x = index * (barWidth + spacing) + spacing / 2 + barWidth / 2;
        const date = new Date(day.date);
        const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
            <div style="
                position: absolute;
                bottom: -25px;
                left: ${x - 30}px;
                width: 60px;
                text-align: center;
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.5);
            ">${label}</div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%;">
            ${bars}
            ${labels}
        </div>
    `;
}

function renderTrafficSources() {
    const container = document.getElementById('trafficSources');
    
    container.innerHTML = analyticsData.trafficSources.map(source => `
        <div class="traffic-item">
            <div class="traffic-header">
                <div class="traffic-source">
                    <i class="fas ${source.icon}"></i>
                    <span>${source.source}</span>
                </div>
                <div class="traffic-percentage">${source.percentage}%</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${source.percentage}%"></div>
            </div>
            <div class="traffic-count">${formatNumber(source.visitors)} visitors</div>
        </div>
    `).join('');
}

function renderPopularPages() {
    const container = document.getElementById('popularPages');
    
    container.innerHTML = analyticsData.popularPages.slice(0, 5).map(page => `
        <div class="page-item">
            <div class="page-info">
                <div class="page-rank">${page.rank}</div>
                <div class="page-details">
                    <h4><i class="fas ${page.icon}"></i> ${page.title}</h4>
                    <p>${page.path}</p>
                </div>
            </div>
            <div class="page-stats">
                <div class="page-stat-item">
                    <h5>Views</h5>
                    <p>${formatNumber(page.views)}</p>
                </div>
                <div class="page-stat-item">
                    <h5>Avg. Time</h5>
                    <p>${formatDuration(page.avgTime)}</p>
                </div>
                <div class="page-stat-item">
                    <h5>Bounce</h5>
                    <p>${page.bounceRate}%</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderActivityFeed() {
    const container = document.getElementById('activityFeed');
    
    container.innerHTML = analyticsData.activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon" style="background-color: ${activity.color}20; color: ${activity.color}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-details">${activity.details}</div>
                <div class="activity-time">${getTimeAgo(activity.timestamp)}</div>
            </div>
        </div>
    `).join('');
}

// ============================================
// USER INTERACTIONS
// ============================================

function refreshData() {
    console.log('🔄 Refreshing analytics data...');
    
    // Show loading state
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Refreshing data...</p></div>';
    
    // Simulate API call delay
    setTimeout(() => {
        generateMockData();
        saveAnalyticsData();
        
        renderStats();
        renderVisitorsChart();
        renderTrafficSources();
        renderPopularPages();
        renderActivityFeed();
        
        trackActivity('Data Refreshed', 'Analytics data manually refreshed', 'info');
        console.log('✅ Data refreshed');
    }, 800);
}

function setTimeRange(range) {
    currentTimeRange = range;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Regenerate visitor data for new range
    generateMockData();
    saveAnalyticsData();
    renderVisitorsChart();
    
    trackActivity('Time Range Changed', `View changed to ${range}`, 'info');
}

function startAutoRefresh() {
    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    
    autoRefreshTimer = setInterval(() => {
        console.log('⚡ Auto-refreshing real-time data...');
        generateRecentActivities();
        renderActivityFeed();
    }, AUTO_REFRESH_INTERVAL);
}

// ============================================
// ACTIVITY TRACKING
// ============================================

function trackActivity(title, details, type = 'info') {
    const activity = {
        title,
        details,
        type,
        timestamp: Date.now()
    };
    
    let activities = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    activities.unshift(activity);
    activities = activities.slice(0, 100); // Keep last 100
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
}

function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

// ============================================
// INITIALIZATION
// ============================================

// Start when page loads
window.addEventListener('DOMContentLoaded', initAnalytics);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (autoRefreshTimer) clearInterval(autoRefreshTimer);
    trackActivity('Dashboard Closed', 'Admin closed analytics dashboard', 'info');
});

// ============================================
// EXPORT FOR CONSOLE ACCESS
// ============================================

window.analytics = {
    data: analyticsData,
    refresh: refreshData,
    export: () => {
        const dataStr = JSON.stringify(analyticsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${Date.now()}.json`;
        link.click();
        trackActivity('Data Exported', 'Analytics data exported to JSON', 'success');
    }
};

console.log('📊 Analytics Dashboard System Ready');
console.log('💡 Access via: window.analytics');
