/**
 * 🎨 BACKEND STATUS UI COMPONENT
 * Beautiful real-time status indicator with live updates
 * Shows connection status, tokens, rate limits, and more
 */

class BackendStatusUI {
    constructor(connection, containerId = 'backend-status-container') {
        this.connection = connection;
        this.containerId = containerId;
        this.container = null;
        this.elements = {};
        
        this.init();
    }

    /**
     * Initialize UI
     */
    init() {
        this.createStatusBar();
        this.attachListeners();
    }

    /**
     * Create status bar HTML
     */
    createStatusBar() {
        // Find or create container
        this.container = document.getElementById(this.containerId);
        
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.containerId;
            document.body.appendChild(this.container);
        }

        // Create status bar
        this.container.innerHTML = `
            <div class="backend-status-bar">
                <div class="status-indicator">
                    <div class="status-dot" id="backend-status-dot"></div>
                    <span class="status-text" id="backend-status-text">Connecting...</span>
                </div>
                
                <div class="status-details">
                    <div class="status-item">
                        <i class="fas fa-key"></i>
                        <span id="backend-tokens-count">-</span>
                        <span class="status-label">Tokens</span>
                    </div>
                    
                    <div class="status-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span id="backend-rate-limit">-</span>
                        <span class="status-label">Rate/hr</span>
                    </div>
                    
                    <div class="status-item">
                        <i class="fas fa-clock"></i>
                        <span id="backend-uptime">-</span>
                        <span class="status-label">Uptime</span>
                    </div>
                </div>
                
                <div class="status-actions">
                    <button class="status-btn" id="backend-refresh-btn" title="Refresh connection">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="status-btn" id="backend-details-btn" title="View details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        `;

        // Add styles
        this.injectStyles();

        // Store element references
        this.elements = {
            dot: document.getElementById('backend-status-dot'),
            text: document.getElementById('backend-status-text'),
            tokens: document.getElementById('backend-tokens-count'),
            rateLimit: document.getElementById('backend-rate-limit'),
            uptime: document.getElementById('backend-uptime'),
            refreshBtn: document.getElementById('backend-refresh-btn'),
            detailsBtn: document.getElementById('backend-details-btn')
        };

        // Attach button listeners
        this.elements.refreshBtn.addEventListener('click', () => this.handleRefresh());
        this.elements.detailsBtn.addEventListener('click', () => this.showDetails());
    }

    /**
     * Attach connection listeners
     */
    attachListeners() {
        this.connection.on('connected', (status) => {
            this.updateStatus('connected', status);
        });

        this.connection.on('disconnected', (status) => {
            this.updateStatus('disconnected', status);
        });

        this.connection.on('status', (status) => {
            this.updateStatus(status.status, status);
        });

        this.connection.on('error', (data) => {
            console.error('Connection error:', data);
        });
    }

    /**
     * Update status UI
     */
    updateStatus(status, data = {}) {
        if (status === 'connected') {
            this.elements.dot.className = 'status-dot connected';
            this.elements.text.textContent = '✅ Connected';
            this.elements.text.style.color = '#28a745';
            
            this.elements.tokens.textContent = data.tokens || '0';
            this.elements.rateLimit.textContent = data.rateLimit || '60';
            this.elements.uptime.textContent = this.formatUptime(data.uptime);
            
        } else if (status === 'disconnected') {
            this.elements.dot.className = 'status-dot disconnected';
            this.elements.text.textContent = '❌ Disconnected';
            this.elements.text.style.color = '#dc3545';
            
            this.elements.tokens.textContent = 'N/A';
            this.elements.rateLimit.textContent = 'N/A';
            this.elements.uptime.textContent = 'N/A';
        }
    }

    /**
     * Handle refresh button
     */
    async handleRefresh() {
        this.elements.refreshBtn.disabled = true;
        this.elements.refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        await this.connection.forceReconnect();
        
        setTimeout(() => {
            this.elements.refreshBtn.disabled = false;
            this.elements.refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        }, 1000);
    }

    /**
     * Show detailed status
     */
    showDetails() {
        const status = this.connection.getStatus();
        
        const detailsHTML = `
            <div class="backend-details-modal" id="backend-details-modal">
                <div class="details-content">
                    <div class="details-header">
                        <h3>Backend Connection Details</h3>
                        <button class="close-btn" onclick="document.getElementById('backend-details-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="details-body">
                        <div class="detail-row">
                            <strong>Status:</strong>
                            <span style="color: ${status.isConnected ? '#28a745' : '#dc3545'}">
                                ${status.isConnected ? '✅ Connected' : '❌ Disconnected'}
                            </span>
                        </div>
                        
                        <div class="detail-row">
                            <strong>Backend URL:</strong>
                            <code>${this.connection.BACKEND_URL}</code>
                        </div>
                        
                        <div class="detail-row">
                            <strong>Uptime:</strong>
                            <span>${this.formatUptime(status.uptime)}</span>
                        </div>
                        
                        <div class="detail-row">
                            <strong>Retry Count:</strong>
                            <span>${status.retryCount}</span>
                        </div>
                        
                        ${status.lastStatus ? `
                        <div class="detail-row">
                            <strong>Last Check:</strong>
                            <span>${new Date(status.lastStatus.timestamp).toLocaleString()}</span>
                        </div>
                        ` : ''}
                        
                        ${status.lastStatus && status.lastStatus.error ? `
                        <div class="detail-row error">
                            <strong>Last Error:</strong>
                            <code>${status.lastStatus.error}</code>
                        </div>
                        ` : ''}
                        
                        <div class="detail-row">
                            <strong>Health Check Interval:</strong>
                            <span>${this.connection.HEALTH_CHECK_INTERVAL / 1000}s</span>
                        </div>
                        
                        <div class="detail-row">
                            <strong>Reconnect Interval:</strong>
                            <span>${this.connection.RECONNECT_INTERVAL / 1000}s</span>
                        </div>
                    </div>
                    
                    <div class="details-footer">
                        <button class="action-btn" onclick="document.getElementById('backend-details-modal').remove()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = detailsHTML;
        document.body.appendChild(modal.firstElementChild);
    }

    /**
     * Format uptime
     */
    formatUptime(milliseconds) {
        if (!milliseconds || milliseconds === 'unknown') return 'Unknown';
        
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h`;
        if (hours > 0) return `${hours}h ${minutes % 60}m`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    /**
     * Inject styles
     */
    injectStyles() {
        if (document.getElementById('backend-status-ui-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'backend-status-ui-styles';
        style.textContent = `
            .backend-status-bar {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 20px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .status-indicator {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .status-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                position: relative;
                animation: pulse 2s infinite;
            }

            .status-dot.connected {
                background: #28a745;
                box-shadow: 0 0 10px rgba(40, 167, 69, 0.8);
            }

            .status-dot.disconnected {
                background: #dc3545;
                box-shadow: 0 0 10px rgba(220, 53, 69, 0.8);
                animation: pulse 1s infinite;
            }

            .status-text {
                font-weight: 600;
                font-size: 1rem;
            }

            .status-details {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
            }

            .status-item {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(255, 255, 255, 0.1);
                padding: 6px 12px;
                border-radius: 8px;
            }

            .status-item i {
                opacity: 0.8;
            }

            .status-item span:first-of-type {
                font-weight: 700;
                font-size: 1.1rem;
            }

            .status-label {
                font-size: 0.75rem;
                opacity: 0.8;
                margin-left: 4px;
            }

            .status-actions {
                display: flex;
                gap: 10px;
            }

            .status-btn {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .status-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.05);
            }

            .status-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Details Modal */
            .backend-details-modal {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.3s;
            }

            .details-content {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            }

            .details-header {
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .details-header h3 {
                margin: 0;
                color: #667eea;
            }

            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #999;
                cursor: pointer;
                transition: color 0.3s;
            }

            .close-btn:hover {
                color: #333;
            }

            .details-body {
                padding: 20px;
            }

            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid #f0f0f0;
            }

            .detail-row strong {
                color: #333;
            }

            .detail-row code {
                background: #f5f5f5;
                padding: 4px 8px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                color: #667eea;
            }

            .detail-row.error code {
                background: #ffebee;
                color: #dc3545;
            }

            .details-footer {
                padding: 20px;
                border-top: 1px solid #e0e0e0;
                text-align: right;
            }

            .action-btn {
                background: #667eea;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: background 0.3s;
            }

            .action-btn:hover {
                background: #5568d3;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .backend-status-bar {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .status-details {
                    width: 100%;
                    justify-content: space-between;
                }

                .status-actions {
                    width: 100%;
                    justify-content: flex-end;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackendStatusUI;
}
