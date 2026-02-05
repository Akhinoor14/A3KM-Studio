/**
 * A3KM Studio - Advanced Engineering Boot Sequence Splash Screen
 * Interactive, animated, with sound effects and particle system
 * Engineering/Tech themed startup experience
 */
(function() {
    'use strict';
    
    // Only show splash when running as installed app
    const isInstalledApp = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true;
    
    if (!isInstalledApp) {
        console.log('[Splash] Not an installed app - skipping splash screen');
        return;
    }
    
    // Check if splash already shown in this session
    if (sessionStorage.getItem('a3km_splash_shown') === 'true') {
        console.log('[Splash] Already shown in this session');
        return;
    }
    
    // Sound effects (optional - can be muted)
    const SOUNDS_ENABLED = localStorage.getItem('a3km_splash_sound') !== 'false';
    let audioContext;
    
    /**
     * Play startup beep sound
     */
    function playBeep(frequency = 800, duration = 100) {
        if (!SOUNDS_ENABLED) return;
        
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            console.log('[Splash] Audio not available');
        }
    }
    
    /**
     * Create particle system
     */
    function createParticles(container) {
        const canvas = document.createElement('canvas');
        canvas.className = 'splash-particles';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Animate particles
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#CC0000';
            
            particles.forEach(p => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // Draw particle
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw connections
                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.strokeStyle = '#CC0000';
                        ctx.globalAlpha = (1 - distance / 100) * 0.2;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        return canvas;
    }
    
    /**
     * Typing animation effect
     */
    function typeText(element, text, speed = 50) {
        return new Promise(resolve => {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    playBeep(600 + Math.random() * 200, 30);
                    i++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }
    
    /**
     * Create and show advanced splash screen
     */
    function showSplash() {
        sessionStorage.setItem('a3km_splash_shown', 'true');
        
        const splash = document.createElement('div');
        splash.id = 'a3km-app-splash';
        splash.innerHTML = `
            <canvas class="splash-particles"></canvas>
            
            <div class="splash-content">
                <!-- Stage 1: System Init -->
                <div class="boot-stage" id="stage1">
                    <div class="logo-circuit">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <defs>
                                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#CC0000;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#ff0000;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                            <circle class="circuit-ring" cx="50" cy="50" r="45" fill="none" stroke="url(#logoGrad)" stroke-width="2"/>
                            <circle class="circuit-ring pulse-ring" cx="50" cy="50" r="35" fill="none" stroke="#CC0000" stroke-width="1" opacity="0.3"/>
                            <text x="50" y="65" font-family="monospace" font-size="42" font-weight="700" fill="url(#logoGrad)" text-anchor="middle" class="logo-text">A3</text>
                        </svg>
                    </div>
                    <div class="boot-text" id="bootText1"></div>
                    <div class="progress-container">
                        <div class="progress-bar" id="progress1"></div>
                    </div>
                </div>
                
                <!-- Stage 2: Module Loading -->
                <div class="boot-stage hidden" id="stage2">
                    <div class="module-list" id="moduleList">
                        <div class="module-item">⚙️ Engineering Core</div>
                        <div class="module-item">📐 Project System</div>
                        <div class="module-item">🔧 Content Engine</div>
                        <div class="module-item">🚀 Analytics Module</div>
                    </div>
                    <div class="boot-text" id="bootText2"></div>
                </div>
                
                <!-- Stage 3: System Ready -->
                <div class="boot-stage hidden" id="stage3">
                    <div class="logo-3d">
                        <div class="logo-cube">
                            <div class="cube-face front">A3</div>
                            <div class="cube-face back">KM</div>
                            <div class="cube-face right">3D</div>
                            <div class="cube-face left">ENG</div>
                            <div class="cube-face top">⚡</div>
                            <div class="cube-face bottom">✓</div>
                        </div>
                    </div>
                    <h1 class="welcome-text">A3KM STUDIO</h1>
                    <p class="welcome-sub">Engineering • Innovation • Excellence</p>
                </div>
            </div>
            
            <!-- Sound toggle -->
            <button class="sound-toggle" id="soundToggle" title="Toggle sound">
                ${SOUNDS_ENABLED ? '🔊' : '🔇'}
            </button>
        `;
        `;
        
        // Add advanced styles
        const style = document.createElement('style');
        style.textContent = `
            #a3km-app-splash {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: splashFadeIn 0.3s ease-out;
            }
            
            #a3km-app-splash.fade-out {
                animation: splashFadeOut 0.5s ease-out forwards;
            }
            
            .splash-content {
                text-align: center;
                animation: splashContentIn 0.6s ease-out 0.2s backwards;
            }
            
            .splash-logo {
                margin-bottom: 24px;
                animation: logoFloat 2s ease-in-out infinite;
            }
            
            .splash-logo svg {
                filter: drop-shadow(0 0 20px rgba(204, 0, 0, 0.5));
            }
            
            .splash-title {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                font-size: 32px;
                font-weight: 700;
                color: #ffffff;
                margin: 0 0 8px 0;
                letter-spacing: 2px;
                text-shadow: 0 0 30px rgba(204, 0, 0, 0.8);
            }
            
            .splash-tagline {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                font-size: 14px;
                font-weight: 400;
                color: rgba(255, 255, 255, 0.6);
                margin: 0 0 40px 0;
                letter-spacing: 1px;
            }
            
            .splash-loader {
                width: 200px;
                height: 3px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                margin: 0 auto;
                overflow: hidden;
                position: relative;
            }
            
            .loader-bar {
                width: 50%;
                height: 100%;
                background: linear-gradient(90deg, transparent, #CC0000, transparent);
                border-radius: 2px;
                animation: loaderSlide 1.5s ease-in-out infinite;
                box-shadow: 0 0 10px #CC0000;
            }
            
            @keyframes splashFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes splashFadeOut {
                to { 
                    opacity: 0;
                    transform: scale(1.05);
                }
            }
            
            @keyframes splashContentIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes logoFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes loaderSlide {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(300%); }
            }
            
            /* Mobile adjustments */
            @media (max-width: 768px) {
                .splash-title {
                    font-size: 28px;
                }
                .splash-tagline {
                    font-size: 12px;
                }
                .splash-loader {
                    width: 150px;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(splash);
        
        console.log('[Splash] Showing app splash screen');
        
        return splash;
    }
    
    /**
     * Hide splash screen
     */
    function hideSplash() {
        const splash = document.getElementById('a3km-app-splash');
        if (!splash) return;
        
        splash.classList.add('fade-out');
        setTimeout(() => {
            splash.remove();
            console.log('[Splash] Hidden');
        }, 500);
    }
    
    /**
     * Initialize splash screen
     */
    function init() {
        // Show splash immediately
        const splash = showSplash();
        
        // Hide when page is fully loaded
        const hideWhenReady = () => {
            // Wait for minimum display time (1 second) and page load
            const minDisplayTime = 1000;
            const startTime = Date.now();
            
            const checkReady = () => {
                const elapsedTime = Date.now() - startTime;
                const isPageReady = document.readyState === 'complete';
                
                if (isPageReady && elapsedTime >= minDisplayTime) {
                    // Add small delay for smooth transition
                    setTimeout(hideSplash, 300);
                } else {
                    // Check again
                    setTimeout(checkReady, 100);
                }
            };
            
            checkReady();
        };
        
        if (document.readyState === 'complete') {
            hideWhenReady();
        } else {
            window.addEventListener('load', hideWhenReady);
        }
        
        // Fallback: force hide after 5 seconds
        setTimeout(() => {
            if (document.getElementById('a3km-app-splash')) {
                console.log('[Splash] Force hiding after timeout');
                hideSplash();
            }
        }, 5000);
    }
    
    // Run immediately (before DOM ready)
    init();
    
    console.log('[Splash] App splash screen initialized');
})();
