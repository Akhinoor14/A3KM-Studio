/**
 * ============================================================================
 * A3KM STUDIO - MOBILE SPLASH SCREEN
 * Engineering Boot Sequence for Mobile PWA
 * ============================================================================
 */
(function() {
    'use strict';
    
    // Only show splash when running as installed PWA
    const isInstalledApp = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true;
    
    // Check if already shown in this session
    if (sessionStorage.getItem('a3km_mobile_splash_shown') === 'true') {
        return;
    }
    
    // Don't show on subsequent navigations
    if (performance.navigation.type === performance.navigation.TYPE_NAVIGATE && sessionStorage.length > 0) {
        return;
    }
    
    // Boot sequence messages
    const bootMessages = [
        'Initializing A3KM Studio...',
        'Loading Engineering Systems...',
        'Connecting to Portfolio Data...',
        'Preparing User Interface...',
        'System Ready!'
    ];
    
    let currentMessageIndex = 0;
    let progress = 0;
    
    /**
     * Create and inject splash screen HTML
     */
    function createSplashScreen() {
        const splash = document.createElement('div');
        splash.id = 'a3km-mobile-splash';
        splash.innerHTML = `
            <style>
                #a3km-mobile-splash {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #1A0000 100%);
                    z-index: 999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                
                #a3km-mobile-splash::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        repeating-linear-gradient(0deg, rgba(204, 0, 0, 0.03) 0px, transparent 1px, transparent 2px, rgba(204, 0, 0, 0.03) 3px),
                        repeating-linear-gradient(90deg, rgba(204, 0, 0, 0.03) 0px, transparent 1px, transparent 2px, rgba(204, 0, 0, 0.03) 3px);
                    background-size: 20px 20px;
                    opacity: 0.3;
                    animation: gridScroll 20s linear infinite;
                }
                
                @keyframes gridScroll {
                    0% { background-position: 0 0; }
                    100% { background-position: 20px 20px; }
                }
                
                .splash-content {
                    position: relative;
                    text-align: center;
                    padding: 40px 20px;
                    width: 100%;
                    max-width: 400px;
                }
                
                .splash-logo {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto 30px;
                    position: relative;
                }
                
                .splash-logo-text {
                    font-size: 48px;
                    font-weight: 800;
                    color: #CC0000;
                    text-shadow: 0 0 20px rgba(204, 0, 0, 0.5);
                    letter-spacing: 4px;
                    animation: pulse 2s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                }
                
                .splash-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border: 3px solid rgba(204, 0, 0, 0.3);
                    border-radius: 50%;
                    animation: ringExpand 1.5s ease-out infinite;
                }
                
                .splash-ring:nth-child(1) { width: 100px; height: 100px; animation-delay: 0s; }
                .splash-ring:nth-child(2) { width: 100px; height: 100px; animation-delay: 0.5s; }
                .splash-ring:nth-child(3) { width: 100px; height: 100px; animation-delay: 1s; }
                
                @keyframes ringExpand {
                    0% {
                        width: 100px;
                        height: 100px;
                        opacity: 1;
                        border-color: rgba(204, 0, 0, 0.8);
                    }
                    100% {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                        border-color: rgba(204, 0, 0, 0);
                    }
                }
                
                .splash-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.95);
                    margin-bottom: 8px;
                    letter-spacing: 2px;
                }
                
                .splash-subtitle {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.5);
                    margin-bottom: 40px;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                }
                
                .splash-status {
                    height: 60px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .splash-message {
                    font-size: 13px;
                    color: #CC0000;
                    font-weight: 600;
                    text-align: center;
                    font-family: 'Courier New', monospace;
                    animation: blink 0.8s step-start infinite;
                }
                
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0.5; }
                }
                
                .splash-progress-container {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                    position: relative;
                    margin-bottom: 20px;
                }
                
                .splash-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #CC0000 0%, #FF0000 100%);
                    border-radius: 2px;
                    width: 0%;
                    transition: width 0.3s ease;
                    box-shadow: 0 0 10px rgba(204, 0, 0, 0.5);
                }
                
                .splash-progress-glow {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255, 255, 255, 0.3) 50%, 
                        transparent 100%);
                    animation: progressShine 1.5s linear infinite;
                }
                
                @keyframes progressShine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                
                .splash-percentage {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 600;
                    font-family: 'Courier New', monospace;
                }
                
                .splash-fade-out {
                    animation: fadeOut 0.6s ease forwards;
                }
                
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        visibility: hidden;
                    }
                }
                
                /* Corner brackets */
                .splash-content::before,
                .splash-content::after {
                    content: '';
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border: 2px solid rgba(204, 0, 0, 0.5);
                }
                
                .splash-content::before {
                    top: 0;
                    left: 0;
                    border-right: none;
                    border-bottom: none;
                }
                
                .splash-content::after {
                    bottom: 0;
                    right: 0;
                    border-left: none;
                    border-top: none;
                }
            </style>
            
            <div class="splash-content">
                <div class="splash-logo">
                    <div class="splash-ring"></div>
                    <div class="splash-ring"></div>
                    <div class="splash-ring"></div>
                    <div class="splash-logo-text">A3KM</div>
                </div>
                <h1 class="splash-title">A3KM Studio</h1>
                <p class="splash-subtitle">Engineering Portfolio</p>
                
                <div class="splash-status">
                    <p class="splash-message" id="splashMessage">${bootMessages[0]}</p>
                </div>
                
                <div class="splash-progress-container">
                    <div class="splash-progress-bar" id="splashProgressBar"></div>
                    <div class="splash-progress-glow"></div>
                </div>
                <p class="splash-percentage" id="splashPercentage">0%</p>
            </div>
        `;
        
        document.body.insertBefore(splash, document.body.firstChild);
        return splash;
    }
    
    /**
     * Update boot message
     */
    function updateMessage() {
        const messageEl = document.getElementById('splashMessage');
        if (messageEl && currentMessageIndex < bootMessages.length) {
            messageEl.textContent = bootMessages[currentMessageIndex];
            currentMessageIndex++;
            
            // Haptic feedback on message change
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }
    
    /**
     * Update progress bar
     */
    function updateProgress(percent) {
        const progressBar = document.getElementById('splashProgressBar');
        const percentageText = document.getElementById('splashPercentage');
        
        if (progressBar) {
            progressBar.style.width = percent + '%';
        }
        if (percentageText) {
            percentageText.textContent = Math.round(percent) + '%';
        }
    }
    
    /**
     * Animate boot sequence
     */
    function animateBootSequence(splash) {
        const totalDuration = 2500; // 2.5 seconds total
        const messageInterval = totalDuration / bootMessages.length;
        let elapsed = 0;
        
        const timer = setInterval(() => {
            elapsed += 50;
            progress = (elapsed / totalDuration) * 100;
            
            updateProgress(progress);
            
            // Update message at intervals
            if (elapsed % messageInterval < 50) {
                updateMessage();
            }
            
            // Complete
            if (elapsed >= totalDuration) {
                clearInterval(timer);
                completeBoot(splash);
            }
        }, 50);
    }
    
    /**
     * Complete boot and remove splash
     */
    function completeBoot(splash) {
        // Final haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
        }
        
        // Mark as shown
        sessionStorage.setItem('a3km_mobile_splash_shown', 'true');
        
        // Fade out
        setTimeout(() => {
            splash.classList.add('splash-fade-out');
            setTimeout(() => {
                splash.remove();
            }, 600);
        }, 300);
    }
    
    /**
     * Initialize splash screen
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const splash = createSplashScreen();
                setTimeout(() => animateBootSequence(splash), 100);
            });
        } else {
            const splash = createSplashScreen();
            setTimeout(() => animateBootSequence(splash), 100);
        }
    }
    
    // Run splash screen
    init();
})();
