---
title: "Analytics & Monitoring System - User Behavior Tracking"
description: "Comprehensive privacy-first analytics system with page view tracking, search history analysis, content engagement metrics, device statistics, AI-powered recommendations, and local storage-based data collection without third-party tracking"
date: 2026-02-12
lastUpdated: 2026-02-12
version: "1.8.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: analytics-monitoring
difficulty: advanced
readTime: "18 min"
wordCount: 3200
tags: [analytics, tracking, monitoring, statistics, insights, privacy, local-storage, behavior-analysis]
status: complete
featured: false
prerequisites:
  - "JavaScript knowledge"
  - "Understanding of localStorage"
  - "Basic statistics concepts"
relatedDocs:
  - "../04-content-management/content-studio-system.md"
  - "../09-projects-portfolio/projects-complete-guide.md"
  - "../11-performance-optimization/pwa-system-guide.md"
---

# 📊 Analytics & Monitoring System

> **🔍 Overview:** A sophisticated, privacy-first analytics platform tracking user behavior, content engagement, search patterns, and device statistics entirely through local storage without any third-party data transmission, featuring AI-powered content recommendations.

---

## 📋 Table of Contents

- [🎯 Analytics System Overview](#analytics-overview)
- [📊 Core Analytics Manager](#core-analytics)
- [🔍 Search History Tracking](#search-tracking)
- [🤖 AI Recommendations](#ai-recommendations)
- [📝 Comments & Engagement](#comments-system)
- [📊 Analytics Dashboard](#analytics-dashboard)
- [🔒 Privacy & Data Storage](#privacy-storage)
- [⚠️ Troubleshooting](#troubleshooting)

---

## 🎯 Analytics System Overview {#analytics-overview}

আমার website এ **built-in analytics system** আছে user behavior track করার জন্য।

### 🌟 **Tracking Features**

| Feature | Description | Storage Method |
|---------|-------------|----------------|
| 📊 **Page Views** | Track all page visits | localStorage |
| 🔍 **Search History** | Popular queries & patterns | localStorage |
| 👤 **User Behavior** | Click patterns, time spent | sessionStorage |
| 📱 **Device Stats** | Browser, OS, screen size | localStorage |
| 🌍 **Location** | Country/city (IP-based) | Not tracked |
| 🤖 **AI Recommendations** | Content suggestions | localStorage |
| 💬 **Comments** | User engagement | localStorage |

> **🔒 Privacy First:** সব data **locally stored** (localStorage), কোনো third-party server এ send করা হয় না।

## Analytics Core System

**File:** `Content Studio/analytics.js`

### Main Analytics Manager:

```javascript
class A3KMAnalytics {
    constructor() {
        this.storageKey = 'a3km_analytics';
        this.sessionKey = 'a3km_session';
        this.init();
    }
    
    init() {
        // Initialize analytics data structure
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                sessions: [],
                pageViews: {},
                searchQueries: [],
                contentViews: {},
                projectViews: {},
                downloads: [],
                userAgent: this.getUserAgent(),
                firstVisit: new Date().toISOString(),
                totalVisits: 0
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
        
        // Track current session
        this.startSession();
        
        // Track page view
        this.trackPageView();
    }
    
    startSession() {
        const sessionData = {
            id: this.generateSessionID(),
            startTime: new Date().toISOString(),
            device: this.getDeviceInfo(),
            browser: this.getBrowserInfo(),
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight
            },
            referrer: document.referrer || 'Direct',
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            pagesViewed: []
        };
        
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        
        // Save to analytics data
        const analytics = this.getAnalytics();
        analytics.sessions.push(sessionData);
        analytics.totalVisits++;
        this.saveAnalytics(analytics);
    }
    
    trackPageView(pageName = null) {
        const page = pageName || this.getCurrentPage();
        const timestamp = new Date().toISOString();
        
        // Update analytics
        const analytics = this.getAnalytics();
        
        if (!analytics.pageViews[page]) {
            analytics.pageViews[page] = {
                count: 0,
                firstView: timestamp,
                lastView: timestamp,
                totalTimeSpent: 0
            };
        }
        
        analytics.pageViews[page].count++;
        analytics.pageViews[page].lastView = timestamp;
        
        this.saveAnalytics(analytics);
        
        // Update session
        const session = this.getSession();
        if (session) {
            session.pagesViewed.push({
                page: page,
                timestamp: timestamp
            });
            sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        }
        
        console.log('📊 Page view tracked:', page);
    }
    
    trackSearch(query, results) {
        const analytics = this.getAnalytics();
        
        analytics.searchQueries.push({
            query: query,
            resultsCount: results.length,
            timestamp: new Date().toISOString(),
            clicked: []
        });
        
        // Keep only last 1000 searches
        if (analytics.searchQueries.length > 1000) {
            analytics.searchQueries = analytics.searchQueries.slice(-1000);
        }
        
        this.saveAnalytics(analytics);
        
        console.log('🔍 Search tracked:', query);
    }
    
    trackContentView(contentId, contentType) {
        const analytics = this.getAnalytics();
        const key = `${contentType}-${contentId}`;
        
        if (!analytics.contentViews[key]) {
            analytics.contentViews[key] = {
                id: contentId,
                type: contentType,
                viewCount: 0,
                totalTimeSpent: 0,
                lastViewed: null
            };
        }
        
        analytics.contentViews[key].viewCount++;
        analytics.contentViews[key].lastViewed = new Date().toISOString();
        
        this.saveAnalytics(analytics);
        
        console.log('📄 Content view tracked:', contentType, contentId);
    }
    
    trackProjectView(projectId, projectCategory) {
        const analytics = this.getAnalytics();
        const key = `${projectCategory}-${projectId}`;
        
        if (!analytics.projectViews[key]) {
            analytics.projectViews[key] = {
                id: projectId,
                category: projectCategory,
                viewCount: 0,
                lastViewed: null
            };
        }
        
        analytics.projectViews[key].viewCount++;
        analytics.projectViews[key].lastViewed = new Date().toISOString();
        
        this.saveAnalytics(analytics);
        
        console.log('🔧 Project view tracked:', projectCategory, projectId);
    }
    
    trackDownload(fileName, fileType, fileSize) {
        const analytics = this.getAnalytics();
        
        analytics.downloads.push({
            fileName: fileName,
            fileType: fileType,
            fileSize: fileSize,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 500 downloads
        if (analytics.downloads.length > 500) {
            analytics.downloads = analytics.downloads.slice(-500);
        }
        
        this.saveAnalytics(analytics);
        
        console.log('⬇️ Download tracked:', fileName);
    }
    
    // Helper functions
    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'Home';
        if (path.includes('projects')) return 'Projects';
        if (path.includes('about')) return 'About';
        if (path.includes('contact')) return 'Contact';
        if (path.includes('content-studio')) return 'Content Studio';
        return path;
    }
    
    getDeviceInfo() {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) return 'Mobile';
        if (/tablet/i.test(ua)) return 'Tablet';
        return 'Desktop';
    }
    
    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Other';
    }
    
    getUserAgent() {
        return {
            string: navigator.userAgent,
            platform: navigator.platform,
            vendor: navigator.vendor
        };
    }
    
    generateSessionID() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getAnalytics() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }
    
    saveAnalytics(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
    
    getSession() {
        const session = sessionStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }
    
    // Public API
    getStats() {
        const analytics = this.getAnalytics();
        
        return {
            totalVisits: analytics.totalVisits,
            totalSessions: analytics.sessions.length,
            totalPageViews: Object.values(analytics.pageViews)
                .reduce((sum, page) => sum + page.count, 0),
            totalSearches: analytics.searchQueries.length,
            totalDownloads: analytics.downloads.length,
            mostViewedPages: this.getMostViewedPages(5),
            popularSearches: this.getPopularSearches(10),
            mostViewedContent: this.getMostViewedContent(10),
            deviceBreakdown: this.getDeviceBreakdown()
        };
    }
    
    getMostViewedPages(limit = 10) {
        const analytics = this.getAnalytics();
        return Object.entries(analytics.pageViews)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit)
            .map(([page, data]) => ({
                page: page,
                views: data.count
            }));
    }
    
    getPopularSearches(limit = 10) {
        const analytics = this.getAnalytics();
        const queryCounts = {};
        
        analytics.searchQueries.forEach(search => {
            const query = search.query.toLowerCase();
            queryCounts[query] = (queryCounts[query] || 0) + 1;
        });
        
        return Object.entries(queryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([query, count]) => ({
                query: query,
                count: count
            }));
    }
    
    getMostViewedContent(limit = 10) {
        const analytics = this.getAnalytics();
        return Object.values(analytics.contentViews)
            .sort((a, b) => b.viewCount - a.viewCount)
            .slice(0, limit);
    }
    
    getDeviceBreakdown() {
        const analytics = this.getAnalytics();
        const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
        
        analytics.sessions.forEach(session => {
            devices[session.device] = (devices[session.device] || 0) + 1;
        });
        
        return devices;
    }
}

// Initialize analytics
const analytics = new A3KMAnalytics();

// Export for global use
window.A3KMAnalytics = analytics;
```

## Search History Tracker

**File:** `Content Studio/search-history.js`

```javascript
class SearchHistory {
    constructor() {
        this.storageKey = 'a3km_search_history';
        this.maxHistory = 50;
    }
    
    addSearch(query, resultsCount = 0) {
        const history = this.getHistory();
        
        history.unshift({
            query: query,
            resultsCount: resultsCount,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 searches
        if (history.length > this.maxHistory) {
            history.pop();
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(history));
        
        // Also track in analytics
        if (window.A3KMAnalytics) {
            window.A3KMAnalytics.trackSearch(query, []);
        }
    }
    
    getHistory() {
        const history = localStorage.getItem(this.storageKey);
        return history ? JSON.parse(history) : [];
    }
    
    getRecentSearches(limit = 10) {
        return this.getHistory().slice(0, limit);
    }
    
    getPopularSearches(limit = 10) {
        const history = this.getHistory();
        const queryCounts = {};
        
        history.forEach(search => {
            const query = search.query.toLowerCase();
            queryCounts[query] = (queryCounts[query] || 0) + 1;
        });
        
        return Object.entries(queryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([query, count]) => ({ query, count }));
    }
    
    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }
}

// Initialize
const searchHistory = new SearchHistory();
window.SearchHistory = searchHistory;
```

## AI Recommendations Engine

**File:** `Content Studio/ai-recommendations.js`

```javascript
class AIRecommendations {
    
    // Get recommended content based on user behavior
    getRecommendations(currentContentType = null, currentContentId = null, limit = 5) {
        const analytics = window.A3KMAnalytics.getAnalytics();
        
        // Get user's viewing history
        const viewedContent = Object.values(analytics.contentViews)
            .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed));
        
        // Get user's search queries
        const searches = analytics.searchQueries.slice(-20);
        
        // Calculate recommendations
        const recommendations = this.calculateRecommendations(
            viewedContent,
            searches,
            currentContentType,
            currentContentId
        );
        
        return recommendations.slice(0, limit);
    }
    
    calculateRecommendations(viewedContent, searches, currentType, currentId) {
        // Simple recommendation algorithm:
        // 1. Similar content type
        // 2. Related topics/keywords
        // 3. Popular content
        
        const scores = {};
        
        // Score based on content type
        viewedContent.forEach(content => {
            if (content.id === currentId) return;
            
            const key = `${content.type}-${content.id}`;
            scores[key] = scores[key] || { content, score: 0 };
            
            // Same type gets +10 points
            if (content.type === currentType) {
                scores[key].score += 10;
            }
            
            // Recent views get more points
            const hoursSinceView = (Date.now() - new Date(content.lastViewed)) / (1000 * 60 * 60);
            if (hoursSinceView < 24) {
                scores[key].score += 5;
            }
            
            // View count indicator
            scores[key].score += Math.min(content.viewCount, 10);
        });
        
        // Score based on search keywords
        searches.forEach(search => {
            const keywords = search.query.toLowerCase().split(' ');
            
            // Match keywords with content
            // (In real implementation, you'd fetch content metadata and match)
            // For now, simplified scoring
        });
        
        // Sort by score
        return Object.values(scores)
            .sort((a, b) => b.score - a.score)
            .map(item => item.content);
    }
    
    // Get trending content (most viewed in last 7 days)
    getTrending(contentType = null, limit = 10) {
        const analytics = window.A3KMAnalytics.getAnalytics();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        let content = Object.values(analytics.contentViews)
            .filter(c => {
                if (contentType && c.type !== contentType) return false;
                return new Date(c.lastViewed) > sevenDaysAgo;
            })
            .sort((a, b) => b.viewCount - a.viewCount);
        
        return content.slice(0, limit);
    }
    
    // Suggest search queries based on popular searches
    getSuggestedSearches(currentQuery, limit = 5) {
        const popular = window.SearchHistory.getPopularSearches(50);
        
        if (!currentQuery) {
            return popular.slice(0, limit).map(s => s.query);
        }
        
        // Filter suggestions that start with current query
        const suggestions = popular
            .filter(s => s.query.toLowerCase().startsWith(currentQuery.toLowerCase()))
            .slice(0, limit)
            .map(s => s.query);
        
        return suggestions;
    }
}

// Initialize
const aiRecommendations = new AIRecommendations();
window.AIRecommendations = aiRecommendations;
```

## Comments & Engagement System

**File:** `Content Studio/comments.js`

```javascript
class CommentsSystem {
    constructor() {
        this.storageKey = 'a3km_comments';
    }
    
    addComment(contentId, contentType, commentData) {
        const comments = this.getAllComments();
        
        const comment = {
            id: this.generateCommentID(),
            contentId: contentId,
            contentType: contentType,
            author: commentData.author || 'Anonymous',
            email: commentData.email || '',
            text: commentData.text,
            timestamp: new Date().toISOString(),
            likes: 0,
            replies: []
        };
        
        if (!comments[contentId]) {
            comments[contentId] = [];
        }
        
        comments[contentId].push(comment);
        
        localStorage.setItem(this.storageKey, JSON.stringify(comments));
        
        return comment;
    }
    
    getComments(contentId) {
        const comments = this.getAllComments();
        return comments[contentId] || [];
    }
    
    getAllComments() {
        const comments = localStorage.getItem(this.storageKey);
        return comments ? JSON.parse(comments) : {};
    }
    
    likeComment(contentId, commentId) {
        const comments = this.getAllComments();
        const contentComments = comments[contentId];
        
        if (contentComments) {
            const comment = contentComments.find(c => c.id === commentId);
            if (comment) {
                comment.likes++;
                localStorage.setItem(this.storageKey, JSON.stringify(comments));
            }
        }
    }
    
    generateCommentID() {
        return 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize
const commentsSystem = new CommentsSystem();
window.CommentsSystem = commentsSystem;
```

## Analytics Dashboard (Only Boss)

**File:** `Only-boss/dashboard/analytics-dashboard.html`

### Dashboard UI:

```html
<div class="analytics-dashboard">
    <header class="dashboard-header">
        <h1><i class="fas fa-chart-line"></i> Website Analytics</h1>
        <div class="date-range-selector">
            <select id="date-range">
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days" selected>Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
            </select>
        </div>
    </header>
    
    <!-- Summary Cards -->
    <div class="stats-cards">
        <div class="stat-card">
            <i class="fas fa-users"></i>
            <div class="stat-info">
                <h3 id="total-visits">0</h3>
                <p>Total Visits</p>
            </div>
        </div>
        
        <div class="stat-card">
            <i class="fas fa-eye"></i>
            <div class="stat-info">
                <h3 id="total-page-views">0</h3>
                <p>Page Views</p>
            </div>
        </div>
        
        <div class="stat-card">
            <i class="fas fa-search"></i>
            <div class="stat-info">
                <h3 id="total-searches">0</h3>
                <p>Searches</p>
            </div>
        </div>
        
        <div class="stat-card">
            <i class="fas fa-download"></i>
            <div class="stat-info">
                <h3 id="total-downloads">0</h3>
                <p>Downloads</p>
            </div>
        </div>
    </div>
    
    <!-- Charts -->
    <div class="charts-section">
        <!-- Most Viewed Pages -->
        <div class="chart-card">
            <h2>Most Viewed Pages</h2>
            <div id="pages-chart"></div>
        </div>
        
        <!-- Device Breakdown -->
        <div class="chart-card">
            <h2>Device Breakdown</h2>
            <div id="device-chart"></div>
        </div>
        
        <!-- Popular Searches -->
        <div class="chart-card">
            <h2>Popular Searches</h2>
            <div id="searches-list"></div>
        </div>
        
        <!-- Trending Content -->
        <div class="chart-card">
            <h2>Trending Content</h2>
            <div id="trending-content"></div>
        </div>
    </div>
    
    <!-- Export Data -->
    <div class="export-section">
        <button id="export-json"><i class="fas fa-file-download"></i> Export as JSON</button>
        <button id="export-csv"><i class="fas fa-file-csv"></i> Export as CSV</button>
        <button id="clear-analytics" class="danger"><i class="fas fa-trash"></i> Clear All Data</button>
    </div>
</div>

<script>
// Load analytics data
function loadAnalytics() {
    const stats = window.A3KMAnalytics.getStats();
    
    // Update summary cards
    document.getElementById('total-visits').textContent = stats.totalVisits;
    document.getElementById('total-page-views').textContent = stats.totalPageViews;
    document.getElementById('total-searches').textContent = stats.totalSearches;
    document.getElementById('total-downloads').textContent = stats.totalDownloads;
    
    // Render charts
    renderPagesChart(stats.mostViewedPages);
    renderDeviceChart(stats.deviceBreakdown);
    renderSearchesList(stats.popularSearches);
    renderTrendingContent();
}

function renderPagesChart(pages) {
    const container = document.getElementById('pages-chart');
    container.innerHTML = pages.map(page => `
        <div class="chart-bar">
            <span class="label">${page.page}</span>
            <div class="bar" style="width: ${page.views * 10}px">
                <span class="value">${page.views}</span>
            </div>
        </div>
    `).join('');
}

function renderDeviceChart(devices) {
    const total = Object.values(devices).reduce((sum, count) => sum + count, 0);
    const container = document.getElementById('device-chart');
    
    container.innerHTML = Object.entries(devices).map(([device, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        return `
            <div class="device-stat">
                <span class="device-name">${device}</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%"></div>
                </div>
                <span class="percentage">${percentage}% (${count})</span>
            </div>
        `;
    }).join('');
}

// Initialize
loadAnalytics();
</script>
```

## Export Analytics Data

```javascript
// Export as JSON
document.getElementById('export-json').addEventListener('click', () => {
    const analytics = window.A3KMAnalytics.getAnalytics();
    const blob = new Blob([JSON.stringify(analytics, null, 2)], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
});

// Export as CSV
document.getElementById('export-csv').addEventListener('click', () => {
    const stats = window.A3KMAnalytics.getStats();
    
    let csv = 'Page,Views\n';
    stats.mostViewedPages.forEach(page => {
        csv += `${page.page},${page.views}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
});
```

---

**শেষ Update:** 2026-02-12  
**Privacy:** Local storage only! 🔒
