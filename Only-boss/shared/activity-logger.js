/**
 * A3KM Studio - Universal Activity Logger
 * Centralized activity tracking system for all managers
 * Usage: import this file and call ActivityLogger.log()
 */

class ActivityLogger {
    static STORAGE_KEY = 'a3km_activity_logs';
    static SECURITY_KEY = 'a3km_security_logs';

    /**
     * Log an activity
     * @param {string} type - Activity type: 'upload', 'edit', 'delete', 'login', 'system'
     * @param {string} activity - Description of the activity
     * @param {string} user - User who performed the action (default: 'Admin')
     * @param {string} status - Status: 'success', 'error', 'warning'
     * @param {string} details - Additional details
     */
    static log(type, activity, user = 'Admin', status = 'success', details = '') {
        const logs = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        
        const log = {
            id: Date.now() + Math.random(), // Unique ID
            timestamp: new Date().toISOString(),
            type,
            activity,
            user,
            status,
            details,
            ip: this.getUserIP(),
            browser: this.getBrowserInfo()
        };
        
        logs.unshift(log);
        
        // Keep only last 1000 logs to prevent storage overflow
        if (logs.length > 1000) {
            logs.splice(1000);
        }
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
        
        // Trigger custom event for real-time updates
        window.dispatchEvent(new CustomEvent('activityLogged', { detail: log }));
        
        return log;
    }

    /**
     * Log a security event
     * @param {string} event - Security event description
     * @param {string} severity - 'low', 'medium', 'high', 'critical'
     * @param {string} details - Additional details
     */
    static logSecurity(event, severity = 'medium', details = '') {
        const securityLogs = JSON.parse(localStorage.getItem(this.SECURITY_KEY) || '[]');
        
        const log = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            event,
            severity,
            details,
            ip: this.getUserIP(),
            browser: this.getBrowserInfo()
        };
        
        securityLogs.unshift(log);
        
        // Keep only last 500 security logs
        if (securityLogs.length > 500) {
            securityLogs.splice(500);
        }
        
        localStorage.setItem(this.SECURITY_KEY, JSON.stringify(securityLogs));
        
        return log;
    }

    /**
     * Get all activity logs
     * @param {number} limit - Number of logs to retrieve (default: all)
     * @returns {Array} Array of log objects
     */
    static getLogs(limit = null) {
        const logs = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        return limit ? logs.slice(0, limit) : logs;
    }

    /**
     * Get security logs
     * @param {number} limit - Number of logs to retrieve
     * @returns {Array} Array of security log objects
     */
    static getSecurityLogs(limit = null) {
        const logs = JSON.parse(localStorage.getItem(this.SECURITY_KEY) || '[]');
        return limit ? logs.slice(0, limit) : logs;
    }

    /**
     * Clear all activity logs
     */
    static clearLogs() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.dispatchEvent(new Event('activityLogsCleared'));
    }

    /**
     * Filter logs by criteria
     * @param {Object} filters - Filter criteria {type, dateFrom, dateTo, user}
     * @returns {Array} Filtered logs
     */
    static filterLogs(filters) {
        const logs = this.getLogs();
        
        return logs.filter(log => {
            if (filters.type && log.type !== filters.type) return false;
            if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
            if (filters.dateFrom && new Date(log.timestamp) < new Date(filters.dateFrom)) return false;
            if (filters.dateTo && new Date(log.timestamp) > new Date(filters.dateTo)) return false;
            return true;
        });
    }

    /**
     * Get user IP address (cached)
     */
    static getUserIP() {
        if (this._cachedIP) return this._cachedIP;
        
        // Try to detect IP (will be 'detecting...' until async fetch completes)
        this.detectIP();
        return sessionStorage.getItem('user_ip') || 'Detecting...';
    }

    /**
     * Detect user IP using external API
     */
    static async detectIP() {
        if (this._ipDetectionInProgress) return;
        
        this._ipDetectionInProgress = true;
        
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            this._cachedIP = data.ip;
            sessionStorage.setItem('user_ip', data.ip);
        } catch (e) {
            this._cachedIP = 'Unable to detect';
            sessionStorage.setItem('user_ip', 'Unable to detect');
        }
        
        this._ipDetectionInProgress = false;
    }

    /**
     * Get browser information
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edg')) browser = 'Edge';
        else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
        
        return browser;
    }

    /**
     * Get activity statistics
     * @returns {Object} Statistics object
     */
    static getStatistics() {
        const logs = this.getLogs();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        return {
            total: logs.length,
            today: logs.filter(l => new Date(l.timestamp) >= today).length,
            thisWeek: logs.filter(l => new Date(l.timestamp) >= weekAgo).length,
            thisMonth: logs.filter(l => new Date(l.timestamp) >= monthStart).length,
            byType: this.getLogsByType(logs),
            byHour: this.getLogsByHour(logs)
        };
    }

    /**
     * Get logs grouped by type
     */
    static getLogsByType(logs) {
        const types = {};
        logs.forEach(log => {
            types[log.type] = (types[log.type] || 0) + 1;
        });
        return types;
    }

    /**
     * Get logs grouped by hour (24-hour format)
     */
    static getLogsByHour(logs) {
        const hours = new Array(24).fill(0);
        logs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            hours[hour]++;
        });
        return hours;
    }
}

// Initialize IP detection on load
if (typeof window !== 'undefined') {
    ActivityLogger.detectIP();
}

// Make it globally available
if (typeof window !== 'undefined') {
    window.ActivityLogger = ActivityLogger;
}
