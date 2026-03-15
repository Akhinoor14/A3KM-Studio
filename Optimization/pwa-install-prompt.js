/**
 * A3KM Studio - PWA Install Prompt
 * Professional install experience following global best practices
 * Shows beautiful themed prompt to encourage PWA installation
 */

class PWAInstallPrompt {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isDismissed = false;
        this.dismissCount = 0;
        this.lastDismissDate = null;
        this.autoDismissInterval = null; // For auto-hide countdown
        
        // Configuration
        this.DISMISS_LIMIT = 3; // Show max 3 times before permanent dismiss
        this.REMIND_AFTER_DAYS = 7; // Remind after 7 days if dismissed
        this.SHOW_DELAY_MS = 3000; // Show after 3 seconds of page load
        
        this.init();
    }
    
    /**
     * Initialize the install prompt system
     */
    init() {
        // Check if already installed
        if (this.isPWAInstalled()) {
            console.log('✅ PWA already installed');
            this.isInstalled = true;
            return;
        }
        
        // Load dismiss history
        this.loadDismissHistory();
        
        // Check if should show prompt
        if (!this.shouldShowPrompt()) {
            console.log('⏭️ Install prompt skipped (dismissed or limit reached)');
            return;
        }
        
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            console.log('📱 Install prompt ready');
            
            // Show custom prompt after delay
            setTimeout(() => {
                this.showInstallPrompt();
            }, this.SHOW_DELAY_MS);
        });
        
        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            this.handleSuccessfulInstall();
        });
        
        // Fallback for browsers that support PWA but no beforeinstallprompt
        // (like iOS Safari with Add to Home Screen)
        if (this.isIOSSafari() && !this.isPWAInstalled()) {
            setTimeout(() => {
                this.showIOSInstallInstructions();
            }, this.SHOW_DELAY_MS);
        }
    }
    
    /**
     * Check if PWA is installed
     */
    isPWAInstalled() {
        // Check display mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        
        // Check iOS standalone
        if (window.navigator.standalone === true) {
            return true;
        }
        
        // Check localStorage flag
        if (localStorage.getItem('a3km_pwa_installed') === 'true') {
            return true;
        }
        
        return false;
    }
    
    /**
     * Check if should show prompt based on dismiss history
     */
    shouldShowPrompt() {
        // Already dismissed too many times
        if (this.dismissCount >= this.DISMISS_LIMIT) {
            return false;
        }
        
        // Recently dismissed, check if enough time passed
        if (this.lastDismissDate) {
            const daysSinceDismiss = this.getDaysSince(this.lastDismissDate);
            if (daysSinceDismiss < this.REMIND_AFTER_DAYS) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Load dismiss history from localStorage
     */
    loadDismissHistory() {
        const history = localStorage.getItem('a3km_install_prompt_history');
        if (history) {
            try {
                const data = JSON.parse(history);
                this.dismissCount = data.dismissCount || 0;
                this.lastDismissDate = data.lastDismissDate || null;
            } catch (e) {
                console.error('Error loading dismiss history:', e);
            }
        }
    }
    
    /**
     * Save dismiss history to localStorage
     */
    saveDismissHistory() {
        const history = {
            dismissCount: this.dismissCount,
            lastDismissDate: new Date().toISOString()
        };
        localStorage.setItem('a3km_install_prompt_history', JSON.stringify(history));
    }
    
    /**
     * Calculate days since a date
     */
    getDaysSince(dateString) {
        const past = new Date(dateString);
        const now = new Date();
        const diff = now - past;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Check if iOS Safari
     */
    isIOSSafari() {
        const ua = window.navigator.userAgent;
        const iOS = /iPad|iPhone|iPod/.test(ua);
        const webkit = /WebKit/.test(ua);
        return iOS && webkit && !window.MSStream;
    }
    
    /**
     * Show beautiful themed install prompt
     */
    showInstallPrompt() {
        const prompt = document.createElement('div');
        prompt.id = 'pwa-install-prompt';
        prompt.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            animation: fadeIn 0.4s ease-out;
            padding: 20px;
        `;
        
        const card = document.createElement('div');
        card.style.cssText = `
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border: 2px solid rgba(139, 0, 0, 0.6);
            border-radius: 24px;
            padding: 48px 40px;
            max-width: 520px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(139, 0, 0, 0.5);
            animation: slideUpBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
        `;
        
        // Animated background
        const bgPattern = document.createElement('div');
        bgPattern.style.cssText = `
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.15) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
        `;
        card.appendChild(bgPattern);
        
        // Content
        const content = document.createElement('div');
        content.style.cssText = 'position: relative; z-index: 1;';
        content.innerHTML = `
            <!-- App Icon -->
            <div style="
                width: 100px;
                height: 100px;
                margin: 0 auto 24px;
                background: linear-gradient(135deg, #8B0000 0%, #580000 100%);
                border-radius: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 32px rgba(139, 0, 0, 0.6);
                animation: iconBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
            ">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2L2 7v10c0 5.52 3.84 10.68 10 12 6.16-1.32 10-6.48 10-12V7l-10-5zm0 18.5c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
                    <circle cx="12" cy="13.5" r="3"/>
                </svg>
            </div>
            
            <!-- Title -->
            <h2 style="
                font-size: 30px;
                font-weight: 900;
                color: #ffffff;
                margin: 0 0 12px 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                letter-spacing: -0.5px;
            ">
                Get Full Offline Access
            </h2>
            
            <!-- Subtitle -->
            <p style="
                font-size: 16px;
                color: rgba(255, 255, 255, 0.75);
                margin: 0 0 32px 0;
                line-height: 1.6;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            ">
                Install the A3KM Studio app for instant access to<br>
                all projects, documentation & content—even offline.
            </p>
            
            <!-- Features -->
            <div style="
                text-align: left;
                margin-bottom: 32px;
                padding: 0 20px;
            ">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                    <div style="
                        width: 28px;
                        height: 28px;
                        background: rgba(139, 0, 0, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#8B0000">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                    </div>
                    <span style="color: rgba(255, 255, 255, 0.9); font-size: 15px; font-weight: 500;">
                        Work without internet connection
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
                    <div style="
                        width: 28px;
                        height: 28px;
                        background: rgba(139, 0, 0, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#8B0000">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                    </div>
                    <span style="color: rgba(255, 255, 255, 0.9); font-size: 15px; font-weight: 500;">
                        Lightning-fast loading & performance
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                        width: 28px;
                        height: 28px;
                        background: rgba(139, 0, 0, 0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#8B0000">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                    </div>
                    <span style="color: rgba(255, 255, 255, 0.9); font-size: 15px; font-weight: 500;">
                        Native app-like experience
                    </span>
                </div>
            </div>
            
            <!-- Buttons -->
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button id="install-app-btn" style="
                    background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
                    color: white;
                    border: none;
                    padding: 18px 48px;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 700;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 20px rgba(139, 0, 0, 0.5);
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 28px rgba(139, 0, 0, 0.7)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(139, 0, 0, 0.5)';">
                    📱 Install App Now
                </button>
                <button id="dismiss-prompt-btn" style="
                    background: transparent;
                    color: rgba(255, 255, 255, 0.6);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                    padding: 14px 48px;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    transition: all 0.3s ease;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                " onmouseover="this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.color='rgba(255, 255, 255, 0.9)';" onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.color='rgba(255, 255, 255, 0.6)';">
                    Maybe Later
                </button>
            </div>
            
            <!-- Small text -->
            <p style="
                font-size: 12px;
                color: rgba(255, 255, 255, 0.4);
                margin: 16px 0 0 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            ">
                ~85MB download • Works on all devices
            </p>
        `;
        
        card.appendChild(content);
        prompt.appendChild(card);
        document.body.appendChild(prompt);
        
        // Button handlers
        document.getElementById('install-app-btn').addEventListener('click', () => {
            this.handleInstallClick(prompt);
        });
        
        document.getElementById('dismiss-prompt-btn').addEventListener('click', () => {
            this.handleDismiss(prompt);
        });
    }
    
    /**
     * Show iOS-specific install instructions
     */
    showIOSInstallInstructions() {
        const prompt = document.createElement('div');
        prompt.id = 'ios-install-instructions';
        prompt.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999999;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border: 2px solid rgba(139, 0, 0, 0.6);
            border-radius: 20px;
            padding: 24px 28px;
            max-width: 90%;
            width: 380px;
            box-shadow: 0 12px 40px rgba(139, 0, 0, 0.6);
            animation: slideUp 0.5s ease-out;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        `;
        
        prompt.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 16px;">
                <div style="
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #8B0000 0%, #580000 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2L2 7v10c0 5.52 3.84 10.68 10 12 6.16-1.32 10-6.48 10-12V7l-10-5z"/>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <div style="color: white; font-size: 16px; font-weight: 700; margin-bottom: 8px;">
                        Install A3KM Studio
                    </div>
                    <div style="color: rgba(255, 255, 255, 0.7); font-size: 14px; line-height: 1.5; margin-bottom: 12px;">
                        Tap <span style="color: #8B0000; font-weight: 600;">Share</span> button, then<br>
                        "<span style="color: #8B0000; font-weight: 600;">Add to Home Screen</span>"
                    </div>
                    <button id="ios-dismiss-btn" style="
                        background: transparent;
                        color: rgba(255, 255, 255, 0.5);
                        border: none;
                        padding: 0;
                        font-size: 13px;
                        cursor: pointer;
                        text-decoration: underline;
                    ">
                        Dismiss
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        document.getElementById('ios-dismiss-btn').addEventListener('click', () => {
            this.handleDismiss(prompt);
        });
    }
    
    /**
     * Show install progress tracker with percentage
     */
    showInstallProgress(promptElement) {
        // Replace prompt content with progress tracker
        const card = promptElement.querySelector('div[style*="background: linear-gradient"]');
        if (!card) return;
        
        card.innerHTML = `
            <div style="position: relative; z-index: 1; text-align: center; padding: 20px;">
                <!-- Installing Icon with Animation -->
                <div style="
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 32px;
                    background: linear-gradient(135deg, #8B0000 0%, #580000 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(139, 0, 0, 0.6);
                    position: relative;
                    animation: pulse 2s ease-in-out infinite;
                ">
                    <!-- Spinning Ring -->
                    <div style="
                        position: absolute;
                        width: 130px;
                        height: 130px;
                        border: 3px solid transparent;
                        border-top-color: #8B0000;
                        border-radius: 50%;
                        animation: spin 1.5s linear infinite;
                    "></div>
                    
                    <!-- Download Icon -->
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        <style>
                            @keyframes downloadMove {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-8px); }
                            }
                        </style>
                        <animateTransform attributeName="transform" type="translate" values="0 0; 0 3; 0 0" dur="1.5s" repeatCount="indefinite"/>
                    </svg>
                    
                    <!-- Percentage Text -->
                    <div id="install-percentage" style="
                        position: absolute;
                        bottom: -50px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 48px;
                        font-weight: 900;
                        color: #8B0000;
                        font-family: 'Inter', sans-serif;
                        text-shadow: 0 2px 10px rgba(139, 0, 0, 0.5);
                    ">0%</div>
                </div>
                
                <!-- Title -->
                <h2 style="
                    font-size: 32px;
                    font-weight: 900;
                    color: #ffffff;
                    margin: 60px 0 16px 0;
                    font-family: 'Inter', sans-serif;
                ">
                    Installing App...
                </h2>
                
                <!-- Status Text -->
                <p id="install-status-text" style="
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0 0 32px 0;
                    font-family: 'Inter', sans-serif;
                ">
                    Preparing your offline experience
                </p>
                
                <!-- Progress Bar -->
                <div style="
                    width: 100%;
                    height: 8px;
                    background: rgba(139, 0, 0, 0.2);
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 16px;
                ">
                    <div id="install-progress-bar" style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #8B0000 0%, #FF4444 100%);
                        border-radius: 10px;
                        transition: width 0.3s ease;
                        box-shadow: 0 0 10px rgba(139, 0, 0, 0.6);
                    "></div>
                </div>
                
                <!-- Files Counter -->
                <div id="install-files-counter" style="
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.5);
                    font-family: 'Inter', sans-serif;
                ">
                    Downloading core files...
                </div>
            </div>
        `;
        
        // Animate progress from 0 to 100
        this.animateInstallProgress();
    }
    
    /**
     * Animate install progress percentage
     * Can be driven by real service worker data via window.updateInstallProgress()
     */
    animateInstallProgress() {
        const percentageEl = document.getElementById('install-percentage');
        const progressBarEl = document.getElementById('install-progress-bar');
        const statusTextEl = document.getElementById('install-status-text');
        const filesCounterEl = document.getElementById('install-files-counter');
        
        if (!percentageEl || !progressBarEl) return;
        
        // Expose global function for real-time updates from service worker
        window.updateInstallProgress = (progress, cached, total, statusText) => {
            if (percentageEl) percentageEl.textContent = Math.floor(progress) + '%';
            if (progressBarEl) progressBarEl.style.width = progress + '%';
            if (statusTextEl && statusText) statusTextEl.textContent = statusText;
            if (filesCounterEl && cached !== undefined && total !== undefined) {
                filesCounterEl.textContent = `${cached} of ${total} files cached`;
            }
            
            // Auto-complete at 100%
            if (progress >= 100) {
                setTimeout(() => {
                    this.showInstallComplete();
                }, 500);
            }
        };
        
        // Fallback: Simulate progress if no real data comes in
        const stages = [
            { progress: 0, text: 'Preparing your offline experience', files: 'Initializing...' },
            { progress: 15, text: 'Downloading core files', files: '12 of 85 files cached' },
            { progress: 35, text: 'Caching essential resources', files: '30 of 85 files cached' },
            { progress: 55, text: 'Setting up offline mode', files: '47 of 85 files cached' },
            { progress: 75, text: 'Optimizing performance', files: '64 of 85 files cached' },
            { progress: 90, text: 'Finalizing installation', files: '76 of 85 files cached' },
            { progress: 100, text: 'Installation complete!', files: '85 of 85 files cached ✓' }
        ];
        
        let currentStage = 0;
        let simulationTimeout = null;
        
        const updateStage = () => {
            if (currentStage >= stages.length) {
                setTimeout(() => {
                    if (document.getElementById('install-percentage')) {
                        this.showInstallComplete();
                    }
                }, 500);
                return;
            }
            
            const stage = stages[currentStage];
            
            // Smooth percentage animation
            let currentProgress = parseInt(percentageEl.textContent) || 0;
            const targetProgress = stage.progress;
            const step = (targetProgress - currentProgress) / 20;
            
            const animatePercentage = () => {
                if (currentProgress < targetProgress) {
                    currentProgress += step;
                    if (currentProgress > targetProgress) currentProgress = targetProgress;
                    
                    percentageEl.textContent = Math.floor(currentProgress) + '%';
                    progressBarEl.style.width = currentProgress + '%';
                    
                    requestAnimationFrame(animatePercentage);
                } else {
                    if (statusTextEl) statusTextEl.textContent = stage.text;
                    if (filesCounterEl) filesCounterEl.textContent = stage.files;
                    
                    currentStage++;
                    simulationTimeout = setTimeout(updateStage, 800 + Math.random() * 400);
                }
            };
            
            animatePercentage();
        };
        
        // Start simulation after small delay (will be overridden if real data comes)
        setTimeout(updateStage, 300);
        
        // Listen for real service worker progress events
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'INSTALL_PROGRESS') {
                    // Clear simulation if real data arrives
                    if (simulationTimeout) {
                        clearTimeout(simulationTimeout);
                        simulationTimeout = null;
                    }
                    
                    const { progress, cached, total, status } = event.data;
                    window.updateInstallProgress(progress, cached, total, status);
                }
            });
        }
    }
    
    /**
     * Show installation complete message
     */
    showInstallComplete() {
        const prompt = document.getElementById('pwa-install-prompt');
        if (!prompt) return;
        
        const card = prompt.querySelector('div[style*="background: linear-gradient"]');
        if (!card) return;
        
        card.innerHTML = `
            <div style="position: relative; z-index: 1; text-align: center; padding: 40px;">
                <!-- Success Icon -->
                <div style="
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 32px;
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(34, 197, 94, 0.6);
                    animation: successBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                ">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                </div>
                
                <!-- Success Title -->
                <h2 style="
                    font-size: 36px;
                    font-weight: 900;
                    color: #22c55e;
                    margin: 0 0 16px 0;
                    font-family: 'Inter', sans-serif;
                ">
                    All Set! 🎉
                </h2>
                
                <!-- Success Message -->
                <p style="
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.8);
                    margin: 0 0 32px 0;
                    line-height: 1.6;
                    font-family: 'Inter', sans-serif;
                ">
                    A3KM Studio is now installed!<br>
                    <span style="font-size: 15px; color: rgba(255, 255, 255, 0.6);">
                        Access all content offline anytime
                    </span>
                </p>
                
                <!-- Close Button -->
                <button id="install-complete-close-btn" style="
                    background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
                    color: white;
                    border: none;
                    padding: 16px 48px;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 700;
                    cursor: pointer;
                    width: auto;
                    transition: all 0.3s ease;
                    box-shadow: 0 6px 20px rgba(139, 0, 0, 0.5);
                    font-family: 'Inter', sans-serif;
                ">
                    Get Started
                </button>
                
                <!-- Auto-dismiss countdown -->
                <p style="
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.4);
                    margin-top: 16px;
                    font-family: 'Inter', sans-serif;
                ">
                    Auto-closing in <span id="auto-dismiss-countdown">5</span>s...
                </p>
            </div>
        `;
        
        // Add success animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes successBounce {
                0% { transform: scale(0) rotate(-180deg); opacity: 0; }
                50% { transform: scale(1.1) rotate(10deg); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Close button handler
        const closeBtn = document.getElementById('install-complete-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.dismissInstallPrompt();
            });
        }
        
        // Auto-dismiss countdown (5 seconds)
        let countdown = 5;
        const countdownEl = document.getElementById('auto-dismiss-countdown');
        
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdownEl) {
                countdownEl.textContent = countdown;
            }
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                this.dismissInstallPrompt();
            }
        }, 1000);
        
        // Store interval ID to clear on manual dismiss
        this.autoDismissInterval = countdownInterval;
    }
    
    /**
     * Dismiss install prompt with animation
     */
    dismissInstallPrompt() {
        // Clear auto-dismiss interval if exists
        if (this.autoDismissInterval) {
            clearInterval(this.autoDismissInterval);
            this.autoDismissInterval = null;
        }
        
        const prompt = document.getElementById('pwa-install-prompt');
        if (prompt) {
            prompt.style.animation = 'fadeOut 0.4s ease-out';
            setTimeout(() => {
                prompt.remove();
            }, 400);
        }
    }
    
    /**
     * Handle install button click
     */
    async handleInstallClick(promptElement) {
        if (!this.deferredPrompt) {
            console.warn('⚠️ Install prompt not available');
            return;
        }

        // Close custom prompt immediately, then trigger native install UI.
        this.dismissInstallPrompt();

        // Show browser's install prompt
        this.deferredPrompt.prompt();
        
        // Wait for user's response
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted install');
        } else {
            console.log('❌ User dismissed install');
            this.dismissCount++;
            this.saveDismissHistory();
        }
        
        // Clear the deferred prompt
        this.deferredPrompt = null;
    }
    
    /**
     * Handle dismiss button click
     */
    handleDismiss(promptElement) {
        this.dismissCount++;
        this.saveDismissHistory();
        
        promptElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => promptElement.remove(), 300);
        
        console.log(`⏭️ Install prompt dismissed (${this.dismissCount}/${this.DISMISS_LIMIT})`);
    }
    
    /**
     * Handle successful installation
     */
    handleSuccessfulInstall() {
        localStorage.setItem('a3km_pwa_installed', 'true');
        localStorage.removeItem('a3km_install_prompt_history');
        
        // Show success toast
        this.showSuccessToast();
    }
    
    /**
     * Show success toast after installation
     */
    showSuccessToast() {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 15px;
            font-weight: 600;
            animation: slideInRight 0.5s ease-out;
        `;
        toast.textContent = '✅ App installed! Downloading content...';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}

// Initialize PWA Install Prompt
const pwaInstallPrompt = new PWAInstallPrompt();
window.PWAInstallPrompt = pwaInstallPrompt;

// Add animation styles
const installPromptStyles = document.createElement('style');
installPromptStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideUpBounce {
        0% { 
            opacity: 0; 
            transform: translateY(50px) scale(0.9); 
        }
        50% {
            transform: translateY(-10px) scale(1.02);
        }
        100% { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
        }
    }
    
    @keyframes iconBounce {
        0% { 
            opacity: 0; 
            transform: scale(0) rotate(-180deg); 
        }
        50% { 
            transform: scale(1.15) rotate(10deg); 
        }
        100% { 
            opacity: 1; 
            transform: scale(1) rotate(0); 
        }
    }
    
    @keyframes pulse {
        0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
        }
        50% { 
            opacity: 0.8; 
            transform: scale(1.05); 
        }
    }
    
    @keyframes slideUp {
        from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(100px); 
        }
        to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0); 
        }
    }
    
    @keyframes slideInRight {
        from { 
            opacity: 0; 
            transform: translateX(100px); 
        }
        to { 
            opacity: 1; 
            transform: translateX(0); 
        }
    }
    
    @keyframes slideOutRight {
        from { 
            opacity: 1; 
            transform: translateX(0); 
        }
        to { 
            opacity: 0; 
            transform: translateX(100px); 
        }
    }
    
    @keyframes spin {
        from { 
            transform: rotate(0deg); 
        }
        to { 
            transform: rotate(360deg); 
        }
    }
    
    @keyframes successBounce {
        0% { 
            transform: scale(0) rotate(-180deg); 
            opacity: 0; 
        }
        50% { 
            transform: scale(1.1) rotate(10deg); 
        }
        100% { 
            transform: scale(1) rotate(0deg); 
            opacity: 1; 
        }
    }
`;
document.head.appendChild(installPromptStyles);

console.log('📱 PWA Install Prompt system loaded');
