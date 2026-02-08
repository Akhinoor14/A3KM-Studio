/**
 * ============================================================================
 * A3KM STUDIO - ADVANCED MOBILE SPLASH SCREEN
 * Desktop-Quality Engineering Boot Sequence for Mobile PWA
 * Features: Particles, Sound Effects, 3D Logo, Progressive Loading
 * ============================================================================
 */
(function() {
    'use strict';
    
    // Show splash for all visits (not just PWA) - user wants it to always show
    const isInstalledApp = true; // Always show for best experience
    
    // Check if already shown in this session (avoid duplicate on navigation)
    if (sessionStorage.getItem('a3km_mobile_splash_shown') === 'true') {
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
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime); // Quieter for mobile
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (e) {
            // Audio not available - silent fail
        }
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
     * Create particle system (mobile-optimized)
     */
    function createParticles(container) {
        const canvas = document.createElement('canvas');
        canvas.className = 'splash-particles';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 30; // Fewer particles for mobile performance
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Animate particles
        let animationId;
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
                
                // Draw connections to nearby particles
                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 80) {
                        ctx.strokeStyle = '#CC0000';
                        ctx.globalAlpha = (1 - distance / 80) * 0.2;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            
            animationId = requestAnimationFrame(animate);
        }
        
        animate();
        
        return {
            canvas,
            stop: () => {
                if (animationId) cancelAnimationFrame(animationId);
            }
        };
    }
    
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
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
                    z-index: 10;
                }
                
                /* 3D Rotating Cube Logo */
                .splash-logo {
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 30px;
                    position: relative;
                    perspective: 600px;
                }
                
                .logo-3d {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    transform-style: preserve-3d;
                    animation: rotateCube 8s linear infinite;
                }
                
                .cube-face {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    font-weight: 800;
                    color: #CC0000;
                    background: rgba(10, 10, 10, 0.9);
                    border: 2px solid #CC0000;
                    box-shadow: 0 0 20px rgba(204, 0, 0, 0.5), inset 0 0 20px rgba(204, 0, 0, 0.1);
                }
                
                .cube-face.front  { transform: translateZ(50px); }
                .cube-face.back   { transform: rotateY(180deg) translateZ(50px); }
                .cube-face.right  { transform: rotateY(90deg) translateZ(50px); font-size: 24px; }
                .cube-face.left   { transform: rotateY(-90deg) translateZ(50px); font-size: 24px; }
                .cube-face.top    { transform: rotateX(90deg) translateZ(50px); }
                .cube-face.bottom { transform: rotateX(-90deg) translateZ(50px); }
                
                @keyframes rotateCube {
                    0% { transform: rotateX(0deg) rotateY(0deg); }
                    100% { transform: rotateX(360deg) rotateY(360deg); }
                }
                
                /* Fallback - Simple logo with rings */
                .splash-logo-text {
                    font-size: 48px;
                    font-weight: 800;
                    color: #CC0000;
                    text-shadow: 0 0 20px rgba(204, 0, 0, 0.8), 0 0 40px rgba(204, 0, 0, 0.4);
                    letter-spacing: 4px;
                    animation: pulse 2s ease-in-out infinite;
                    position: relative;
                    z-index: 10;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.9; }
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
                
                .splash-ring:nth-child(1) { width: 90px; height: 90px; animation-delay: 0s; }
                .splash-ring:nth-child(2) { width: 90px; height: 90px; animation-delay: 0.5s; }
                .splash-ring:nth-child(3) { width: 90px; height: 90px; animation-delay: 1s; }
                
                @keyframes ringExpand {
                    0% {
                        width: 90px;
                        height: 90px;
                        opacity: 1;
                        border-color: rgba(204, 0, 0, 0.8);
                    }
                    100% {
                        width: 180px;
                        height: 180px;
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
                
                /* Sound toggle button */
                .sound-toggle {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(204, 0, 0, 0.5);
                    border-radius: 50%;
                    background: rgba(10, 10, 10, 0.8);
                    color: #CC0000;
                    font-size: 18px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 20;
                }
                
                .sound-toggle:active {
                    transform: scale(0.9);
                    background: rgba(204, 0, 0, 0.2);
                }
                
                .splash-fade-out {
                    animation: fadeOut 0.6s ease forwards;
                }
                
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        visibility: hidden;
                        transform: scale(1.05);
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
            
            <!-- Sound toggle button -->
            <button class="sound-toggle" id="soundToggle" title="Toggle sound">
                ${SOUNDS_ENABLED ? '🔊' : '🔇'}
            </button>
            
            <div class="splash-content">
                <div class="splash-logo">
                    <div class="logo-3d">
                        <div class="cube-face front">A3</div>
                        <div class="cube-face back">KM</div>
                        <div class="cube-face right">3D</div>
                        <div class="cube-face left">ENG</div>
                        <div class="cube-face top">⚡</div>
                        <div class="cube-face bottom">✓</div>
                    </div>
                    <!-- Fallback for older browsers -->
                    <div class="splash-ring"></div>
                    <div class="splash-ring"></div>
                    <div class="splash-ring"></div>
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
        
        // Setup sound toggle
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                const newState = localStorage.getItem('a3km_splash_sound') !== 'false' ? 'false' : 'true';
                localStorage.setItem('a3km_splash_sound', newState);
                soundToggle.textContent = newState === 'true' ? '🔊' : '🔇';
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(20);
                }
                
                // Play test beep if enabled
                if (newState === 'true') {
                    playBeep(600, 100);
                }
            });
        }
        
        // Add particles
        const particleSystem = createParticles(splash);
        
        return { splash, particleSystem };
    }
    
    /**
     * Update boot message
     */
    function updateMessage() {
        const messageEl = document.getElementById('splashMessage');
        if (messageEl && currentMessageIndex < bootMessages.length) {
            messageEl.textContent = bootMessages[currentMessageIndex];
            playBeep(600 + Math.random() * 200, 50); // Sound effect
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
    function animateBootSequence(splashData) {
        const totalDuration = 3000; // 3 seconds total for quality experience
        const messageInterval = totalDuration / bootMessages.length;
        let elapsed = 0;
        
        // Initial beep
        playBeep(800, 100);
        
        const timer = setInterval(() => {
            elapsed += 50;
            progress = (elapsed / totalDuration) * 100;
            
            updateProgress(progress);
            
            // Update message at intervals
            if (elapsed % messageInterval < 50 && currentMessageIndex < bootMessages.length) {
                updateMessage();
            }
            
            // Complete
            if (elapsed >= totalDuration) {
                clearInterval(timer);
                completeBoot(splashData);
            }
        }, 50);
    }
    
    /**
     * Complete boot and remove splash
     */
    function completeBoot(splashData) {
        const { splash, particleSystem } = splashData;
        
        // Final success beep sequence
        playBeep(600, 50);
        setTimeout(() => playBeep(800, 50), 80);
        setTimeout(() => playBeep(1000, 100), 160);
        
        // Final haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([30, 50, 30]);
        }
        
        // Mark as shown
        sessionStorage.setItem('a3km_mobile_splash_shown', 'true');
        
        // Fade out
        setTimeout(() => {
            splash.classList.add('splash-fade-out');
            
            // Stop particles and remove splash
            setTimeout(() => {
                if (particleSystem) particleSystem.stop();
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
                const splashData = createSplashScreen();
                setTimeout(() => animateBootSequence(splashData), 100);
            });
        } else {
            const splashData = createSplashScreen();
            setTimeout(() => animateBootSequence(splashData), 100);
        }
    }
    
    // Run splash screen immediately
    init();
    
    console.log('[A3KM Mobile Splash] Advanced splash screen initialized with particles & sound');
})();
