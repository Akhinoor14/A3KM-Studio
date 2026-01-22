/**
 * Analytics Dashboard
 * Chart.js integration, trends, statistics
 * Version: 1.0.0
 * Last Updated: January 22, 2026
 */

class AnalyticsDashboard {
    constructor(projects = []) {
        this.projects = projects;
        this.charts = {};
    }

    /**
     * Update projects data
     * @param {Array} projects - Projects array
     */
    setProjects(projects) {
        this.projects = projects;
    }

    /**
     * Get statistics summary
     * @returns {object} - Statistics object
     */
    getStatistics() {
        const total = this.projects.length;
        const totalViews = this.projects.reduce((sum, p) => sum + (p.views || 0), 0);
        const totalDownloads = this.projects.reduce((sum, p) => sum + (p.downloads || 0), 0);
        const avgViews = total > 0 ? Math.round(totalViews / total) : 0;
        const avgDownloads = total > 0 ? Math.round(totalDownloads / total) : 0;

        // Category distribution
        const categoryDist = {};
        this.projects.forEach(p => {
            categoryDist[p.category] = (categoryDist[p.category] || 0) + 1;
        });

        // Top projects
        const topByViews = [...this.projects]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
        const topByDownloads = [...this.projects]
            .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
            .slice(0, 5);

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentProjects = this.projects.filter(p => 
            new Date(p.dateAdded) > sevenDaysAgo
        ).length;

        return {
            total,
            totalViews,
            totalDownloads,
            avgViews,
            avgDownloads,
            categoryDist,
            topByViews,
            topByDownloads,
            recentProjects
        };
    }

    /**
     * Get views trend data (last 30 days)
     * @returns {object} - Trend data for Chart.js
     */
    getViewsTrend() {
        const days = 30;
        const labels = [];
        const data = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            
            // Simulate trend data (in real scenario, you'd have daily logs)
            const dayViews = this.projects.reduce((sum, p) => {
                const projectDate = new Date(p.dateAdded);
                if (projectDate.toDateString() === date.toDateString()) {
                    return sum + (p.views || 0);
                }
                return sum;
            }, 0);
            
            data.push(dayViews);
        }

        return { labels, data };
    }

    /**
     * Get category distribution data for pie chart
     * @returns {object} - Category data for Chart.js
     */
    getCategoryDistribution() {
        const dist = {};
        this.projects.forEach(p => {
            dist[p.category] = (dist[p.category] || 0) + 1;
        });

        return {
            labels: Object.keys(dist),
            data: Object.values(dist)
        };
    }

    /**
     * Get top 10 projects by views
     * @returns {object} - Top projects data for Chart.js
     */
    getTopProjects(limit = 10) {
        const sorted = [...this.projects]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, limit);

        return {
            labels: sorted.map(p => p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title),
            data: sorted.map(p => p.views || 0)
        };
    }

    /**
     * Get monthly activity heatmap data
     * @returns {Array} - Heatmap data (day of week, count)
     */
    getActivityHeatmap() {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const activity = new Array(7).fill(0);

        this.projects.forEach(p => {
            const date = new Date(p.dateAdded);
            const day = date.getDay();
            activity[day]++;
        });

        return {
            labels: daysOfWeek,
            data: activity
        };
    }

    /**
     * Destroy all charts
     */
    destroyCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// ===== UI COMPONENTS =====

/**
 * Create full analytics dashboard
 * @param {string} containerId - Container element ID
 * @param {AnalyticsDashboard} dashboard - Dashboard instance
 * @returns {object} - Dashboard controller
 */
function createAnalyticsDashboard(containerId, dashboard) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center; background: #2d2d2d; border-radius: 12px;">
                <h3 style="color: #fff; margin-bottom: 20px;">
                    <i class="fas fa-exclamation-triangle"></i> Chart.js Required
                </h3>
                <p style="color: #aaa; margin-bottom: 20px;">
                    Please include Chart.js to view analytics:
                </p>
                <code style="background: #1e1e1e; padding: 10px 20px; border-radius: 6px; color: #2196F3; display: inline-block;">
                    &lt;script src="https://cdn.jsdelivr.net/npm/chart.js"&gt;&lt;/script&gt;
                </code>
            </div>
        `;
        return null;
    }

    const stats = dashboard.getStatistics();

    container.innerHTML = `
        <div style="padding: 30px; background: #1e1e1e; border-radius: 12px;">
            <h2 style="color: #fff; margin-bottom: 30px;">
                <i class="fas fa-chart-line"></i> Analytics Dashboard
            </h2>

            <!-- Statistics Cards -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; color: white;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <i class="fas fa-project-diagram" style="font-size: 2.5rem; opacity: 0.8;"></i>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700;">${stats.total}</div>
                            <div style="opacity: 0.9;">Total Projects</div>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 25px; border-radius: 12px; color: white;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <i class="fas fa-eye" style="font-size: 2.5rem; opacity: 0.8;"></i>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700;">${stats.totalViews.toLocaleString()}</div>
                            <div style="opacity: 0.9;">Total Views</div>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 25px; border-radius: 12px; color: white;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <i class="fas fa-download" style="font-size: 2.5rem; opacity: 0.8;"></i>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700;">${stats.totalDownloads.toLocaleString()}</div>
                            <div style="opacity: 0.9;">Total Downloads</div>
                        </div>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 25px; border-radius: 12px; color: white;">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <i class="fas fa-clock" style="font-size: 2.5rem; opacity: 0.8;"></i>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700;">${stats.recentProjects}</div>
                            <div style="opacity: 0.9;">Added This Week</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px;">
                <!-- Views Trend -->
                <div style="background: #2d2d2d; padding: 25px; border-radius: 12px;">
                    <h3 style="color: #fff; margin-bottom: 20px;">
                        <i class="fas fa-chart-line"></i> Views Trend (30 Days)
                    </h3>
                    <canvas id="viewsTrendChart"></canvas>
                </div>

                <!-- Category Distribution -->
                <div style="background: #2d2d2d; padding: 25px; border-radius: 12px;">
                    <h3 style="color: #fff; margin-bottom: 20px;">
                        <i class="fas fa-chart-pie"></i> Category Distribution
                    </h3>
                    <canvas id="categoryChart"></canvas>
                </div>

                <!-- Top Projects -->
                <div style="background: #2d2d2d; padding: 25px; border-radius: 12px;">
                    <h3 style="color: #fff; margin-bottom: 20px;">
                        <i class="fas fa-trophy"></i> Top 10 Projects
                    </h3>
                    <canvas id="topProjectsChart"></canvas>
                </div>

                <!-- Activity Heatmap -->
                <div style="background: #2d2d2d; padding: 25px; border-radius: 12px;">
                    <h3 style="color: #fff; margin-bottom: 20px;">
                        <i class="fas fa-calendar-alt"></i> Activity by Day
                    </h3>
                    <canvas id="activityChart"></canvas>
                </div>
            </div>

            <!-- Export Button -->
            <div style="text-align: center; margin-top: 30px;">
                <button id="exportChartsBtn" style="padding: 12px 30px; background: #2196F3; color: white; 
                        border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    <i class="fas fa-download"></i> Export Analytics Report
                </button>
            </div>
        </div>
    `;

    // Create charts
    const charts = {};

    // 1. Views Trend Line Chart
    const viewsTrend = dashboard.getViewsTrend();
    charts.viewsTrend = new Chart(
        document.getElementById('viewsTrendChart'),
        {
            type: 'line',
            data: {
                labels: viewsTrend.labels,
                datasets: [{
                    label: 'Views',
                    data: viewsTrend.data,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#fff',
                        bodyColor: '#aaa',
                        borderColor: '#444',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: { 
                        grid: { color: '#333' },
                        ticks: { color: '#aaa' }
                    },
                    y: { 
                        grid: { color: '#333' },
                        ticks: { color: '#aaa' },
                        beginAtZero: true
                    }
                }
            }
        }
    );

    // 2. Category Pie Chart
    const categoryDist = dashboard.getCategoryDistribution();
    charts.category = new Chart(
        document.getElementById('categoryChart'),
        {
            type: 'doughnut',
            data: {
                labels: categoryDist.labels,
                datasets: [{
                    data: categoryDist.data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fff' }
                    },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#fff',
                        bodyColor: '#aaa',
                        borderColor: '#444',
                        borderWidth: 1
                    }
                }
            }
        }
    );

    // 3. Top Projects Bar Chart
    const topProjects = dashboard.getTopProjects(10);
    charts.topProjects = new Chart(
        document.getElementById('topProjectsChart'),
        {
            type: 'bar',
            data: {
                labels: topProjects.labels,
                datasets: [{
                    label: 'Views',
                    data: topProjects.data,
                    backgroundColor: '#4CAF50'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#fff',
                        bodyColor: '#aaa',
                        borderColor: '#444',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: { 
                        grid: { color: '#333' },
                        ticks: { color: '#aaa' },
                        beginAtZero: true
                    },
                    y: { 
                        grid: { display: false },
                        ticks: { color: '#aaa' }
                    }
                }
            }
        }
    );

    // 4. Activity Heatmap Bar Chart
    const activity = dashboard.getActivityHeatmap();
    charts.activity = new Chart(
        document.getElementById('activityChart'),
        {
            type: 'bar',
            data: {
                labels: activity.labels,
                datasets: [{
                    label: 'Projects',
                    data: activity.data,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#E74C3C'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e1e1e',
                        titleColor: '#fff',
                        bodyColor: '#aaa',
                        borderColor: '#444',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#aaa' }
                    },
                    y: { 
                        grid: { color: '#333' },
                        ticks: { 
                            color: '#aaa',
                            stepSize: 1
                        },
                        beginAtZero: true
                    }
                }
            }
        }
    );

    // Export button
    document.getElementById('exportChartsBtn').onclick = () => {
        const report = {
            generatedAt: new Date().toISOString(),
            statistics: stats,
            viewsTrend: viewsTrend,
            categoryDist: categoryDist,
            topProjects: topProjects,
            activity: activity
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('✅ Analytics report exported!');
    };

    return {
        charts: charts,
        refresh: () => {
            // Destroy old charts and recreate
            Object.values(charts).forEach(chart => chart.destroy());
            createAnalyticsDashboard(containerId, dashboard);
        }
    };
}

// Export
window.AnalyticsDashboard = AnalyticsDashboard;
window.createAnalyticsDashboard = createAnalyticsDashboard;

console.log('✅ Analytics Dashboard loaded');
