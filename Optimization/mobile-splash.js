/**
 * A3KM Studio - Universal PWA Splash Screen (Mobile + Desktop)
 * Fast, smooth animations with premium sound effects
 * Responsive design optimized for all screen sizes
 */
(function() {
    'use strict';
    
    console.log('[A3KM Splash] Script loaded');
    
    // Enhanced detection for installed PWA
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    const isWindowsPWA = window.location.href.includes('ms-appx://');
    const hasWindowControlsOverlay = window.matchMedia('(display-mode: window-controls-overlay)').matches;
    
    // Force splash for testing (add ?splash=true to URL)
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get('splash') === 'true' || 
                      localStorage.getItem('a3km_splash_debug') === 'true';
    
    const isInstalledApp = isStandaloneMode || isIOSStandalone || isWindowsPWA || 
                          hasWindowControlsOverlay || forceShow;
    
    console.log('[A3KM Splash] Detection:', {
        standalone: isStandaloneMode,
        iOS: isIOSStandalone,
        windowsPWA: isWindowsPWA,
        windowControls: hasWindowControlsOverlay,
        force: forceShow,
        isInstalled: isInstalledApp
    });
    
    if (!isInstalledApp) {
        console.log('[A3KM Splash] Not installed app, skipping');
        return;
    }
    
    if (sessionStorage.getItem('a3km_splash_shown') === 'true') {
        console.log('[A3KM Splash] Already shown in this session');
        return;
    }
    
    console.log('[A3KM Splash] Starting splash screen');
    
    let SOUNDS_ENABLED = localStorage.getItem('a3km_splash_sound') !== 'false';
    
    // Audio context for sounds
    let audioContext;
    
    function playStartupSound() {
        if (!SOUNDS_ENABLED) return;
        try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            
            // PREMIUM C major chord with reverb and warmth
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            const volumes = [0.12, 0.10, 0.08];
            
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                const delay = audioContext.createDelay();
                const delayGain = audioContext.createGain();
                
                // Warm sine wave
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                // Warm low-pass filter for richness
                filter.type = 'lowpass';
                filter.frequency.value = 4000;
                filter.Q.value = 1;
                
                // Subtle reverb/echo effect
                delay.delayTime.value = 0.03;
                delayGain.gain.value = 0.3;
                
                // Audio chain: Oscillator → Filter → [Gain + Echo] → Output
                osc.connect(filter);
                filter.connect(gain);
                filter.connect(delay);
                delay.connect(delayGain);
                gain.connect(audioContext.destination);
                delayGain.connect(audioContext.destination);
                
                // Smooth envelope (ADSR-like)
                const noteDelay = i * 0.08; // Staggered for richness
                gain.gain.setValueAtTime(0, now + noteDelay);
                gain.gain.linearRampToValueAtTime(volumes[i], now + noteDelay + 0.08); // Attack
                gain.gain.exponentialRampToValueAtTime(0.001, now + noteDelay + 0.8); // Decay + Release
                
                osc.start(now + noteDelay);
                osc.stop(now + noteDelay + 0.8);
            });
            
            // Add subtle "whoosh" sound for modern feel
            const noise = audioContext.createBufferSource();
            const noiseGain = audioContext.createGain();
            const noiseFilter = audioContext.createBiquadFilter();
            
            // Create white noise buffer
            const bufferSize = audioContext.sampleRate * 0.3;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            noise.buffer = buffer;
            
            // Shape the noise
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = 2000;
            noiseFilter.Q.value = 0.5;
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            
            // Subtle whoosh envelope
            noiseGain.gain.setValueAtTime(0, now);
            noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.05);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            
            noise.start(now);
        } catch(e) {
            console.log('[A3KM Splash] Audio error:', e);
        }
    }
    
    function playCompleteSound() {
        if (!SOUNDS_ENABLED) return;
        try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            
            // PREMIUM ascending G major arpeggio with sparkle
            const notes = [783.99, 987.77, 1174.66]; // G5, B5, D6
            const volumes = [0.10, 0.08, 0.06];
            
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                const delay = audioContext.createDelay();
                const delayGain = audioContext.createGain();
                
                // Bright sine wave
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                // Bright filter for clarity
                filter.type = 'lowpass';
                filter.frequency.value = 5000;
                filter.Q.value = 1.2;
                
                // Echo for shimmer
                delay.delayTime.value = 0.05;
                delayGain.gain.value = 0.25;
                
                // Audio chain
                osc.connect(filter);
                filter.connect(gain);
                filter.connect(delay);
                delay.connect(delayGain);
                gain.connect(audioContext.destination);
                delayGain.connect(audioContext.destination);
                
                // Quick cascade envelope
                const noteDelay = i * 0.06;
                gain.gain.setValueAtTime(0, now + noteDelay);
                gain.gain.linearRampToValueAtTime(volumes[i], now + noteDelay + 0.04); // Fast attack
                gain.gain.exponentialRampToValueAtTime(0.001, now + noteDelay + 0.5); // Medium release
                
                osc.start(now + noteDelay);
                osc.stop(now + noteDelay + 0.5);
            });
            
            // Add high sparkle note for "completion" feel
            const sparkle = audioContext.createOscillator();
            const sparkleGain = audioContext.createGain();
            const sparkleFilter = audioContext.createBiquadFilter();
            
            sparkle.type = 'sine';
            sparkle.frequency.value = 2093; // High C (C7)
            
            sparkleFilter.type = 'highpass';
            sparkleFilter.frequency.value = 1000;
            
            sparkle.connect(sparkleFilter);
            sparkleFilter.connect(sparkleGain);
            sparkleGain.connect(audioContext.destination);
            
            // Delicate sparkle envelope
            sparkleGain.gain.setValueAtTime(0, now + 0.15);
            sparkleGain.gain.linearRampToValueAtTime(0.04, now + 0.18);
            sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            
            sparkle.start(now + 0.15);
            sparkle.stop(now + 0.35);
        } catch(e) {
            console.log('[A3KM Splash] Audio error:', e);
        }
    }
    
    function createSplashElement() {
        console.log('[A3KM Splash] Creating splash element');
        
        const splash = document.createElement('div');
        splash.id = 'a3km-mobile-splash';
        splash.innerHTML = `
            <canvas id="splash-particles"></canvas>
            <div class="splash-content">
                <div class="splash-stage" id="stage-1">
                    <div class="splash-logo">
                        <div class="logo-ring"></div>
                        <div class="logo-text">A3KM</div>
                    </div>
                    <div class="splash-text" id="text-1">Initializing System...</div>
                    <div class="splash-progress">
                        <div class="splash-progress-bar" id="progress-1"></div>
                    </div>
                </div>
                <div class="splash-stage hidden" id="stage-2">
                    <div class="splash-modules">
                        <div class="splash-module">⚙️ Core System</div>
                        <div class="splash-module">📐 Projects</div>
                        <div class="splash-module">🔧 Content</div>
                        <div class="splash-module">🚀 Analytics</div>
                    </div>
                    <div class="splash-text" id="text-2">Loading Modules...</div>
                </div>
                <div class="splash-stage hidden" id="stage-3">
                    <div class="splash-logo-large">A3KM</div>
                    <h1 class="splash-title">A3KM STUDIO</h1>
                    <p class="splash-subtitle">Engineering Excellence</p>
                </div>
            </div>
            <button class="splash-sound-btn" id="sound-btn">${SOUNDS_ENABLED ? '🔊' : '🔇'}</button>
        `;
        
        const css = `
            #a3km-mobile-splash {
                position: fixed;
                inset: 0;
                z-index: 999999;
                background: radial-gradient(circle at 50% 50%, #1a0505 0%, #0a0a0a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                opacity: 1;
                transition: opacity 0.5s ease-out;
            }
            #a3km-mobile-splash.fade-out {
                opacity: 0;
            }
            #splash-particles {
                position: absolute;
                inset: 0;
                opacity: 0.5;
            }
            .splash-content {
                position: relative;
                z-index: 2;
                text-align: center;
                width: 90vw;
                max-width: 400px;
            }
            .splash-stage {
                animation: slideUp 0.5s ease-out;
                transition: opacity 0.4s ease-out, transform 0.4s ease-out;
            }
            .splash-stage.hidden {
                display: none;
            }
            .splash-logo {
                position: relative;
                width: 120px;
                height: 120px;
                margin: 0 auto 30px;
                animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .logo-ring {
                position: absolute;
                inset: 0;
                border: 3px solid #CC0000;
                border-radius: 50%;
                animation: rotate 3s linear infinite, pulse 2s ease-in-out infinite;
            }
            .logo-text {
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                font-weight: 700;
                color: #CC0000;
                text-shadow: 0 0 20px #CC0000, 0 0 40px rgba(204,0,0,0.5);
                animation: glow 1.5s ease-in-out infinite;
            }
            .splash-text {
                color: #0f0;
                font-size: 14px;
                margin: 20px 0;
                letter-spacing: 1px;
                animation: fadeIn 0.5s ease-out;
            }
            .splash-progress {
                width: 100%;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                overflow: hidden;
                margin: 20px 0;
            }
            .splash-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #CC0000, #ff0000);
                width: 0;
                transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 0 10px #CC0000;
            }
            .splash-modules {
                display: grid;
                gap: 12px;
                margin-bottom: 30px;
            }
            .splash-module {
                padding: 12px 20px;
                background: rgba(204,0,0,0.1);
                border: 1px solid rgba(204,0,0,0.3);
                border-radius: 8px;
                color: #fff;
                font-size: 13px;
                text-align: left;
                opacity: 0;
                transform: translateX(-30px);
                animation: slideIn 0.3s ease-out forwards;
            }
            .splash-module:nth-child(1) { animation-delay: 0s; }
            .splash-module:nth-child(2) { animation-delay: 0.1s; }
            .splash-module:nth-child(3) { animation-delay: 0.2s; }
            .splash-module:nth-child(4) { animation-delay: 0.3s; }
            .splash-logo-large {
                font-size: 64px;
                font-weight: 700;
                color: #CC0000;
                text-shadow: 0 0 30px #CC0000, 0 0 60px rgba(204,0,0,0.5);
                animation: logoEntry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                margin-bottom: 20px;
            }
            .splash-title {
                font-size: 28px;
                font-weight: 700;
                color: #fff;
                margin: 0 0 10px;
                letter-spacing: 3px;
                text-shadow: 0 0 20px #CC0000;
                animation: titleGlow 2s ease-in-out infinite, fadeIn 0.5s ease-out 0.3s backwards;
            }
            .splash-subtitle {
                font-size: 12px;
                color: rgba(255,255,255,0.6);
                margin: 0;
                letter-spacing: 2px;
                animation: fadeIn 0.5s ease-out 0.5s backwards;
            }
            .splash-sound-btn {
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 3;
                background: rgba(20,20,20,0.8);
                border: 1px solid rgba(204,0,0,0.3);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 18px;
            /* Desktop enhancements for larger screens */
            @media (min-width: 769px) {
                .splash-content {
                    max-width: 500px;
                }
                .splash-logo {
                    width: 150px;
                    height: 150px;
                    margin: 0 auto 40px;
                }
                .logo-ring {
                    border-width: 4px;
                }
                .logo-text {
                    font-size: 48px;
                }
                .splash-text {
                    font-size: 16px;
                    margin: 25px 0;
                }
                .splash-progress {
                    height: 5px;
                    margin: 25px 0;
                }
                .splash-modules {
                    gap: 15px;
                    max-width: 400px;
                    margin: 0 auto 40px;
                }
                .splash-module {
                    padding: 15px 25px;
                    font-size: 15px;
                }
                .splash-logo-large {
                    font-size: 80px;
                    margin-bottom: 30px;
                }
                .splash-title {
                    font-size: 36px;
                    margin: 0 0 15px;
                    letter-spacing: 5px;
                }
                .splash-subtitle {
                    font-size: 14px;
                    letter-spacing: 3px;
                }
                .splash-sound-btn {
                    width: 50px;
                    height: 50px;
                    font-size: 22px;
                    top: 30px;
                    right: 30px;
                }
                .splash-sound-btn:hover {
                    transform: scale(1.1);
                    background: rgba(204,0,0,0.2);
                }
            }
            
            /* Mobile optimizations */
                cursor: pointer;
                transition: transform 0.2s;
            }
            .splash-sound-btn:active {
                transform: scale(0.9);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes scaleIn {
                0% { opacity: 0; transform: scale(0.5); }
                60% { transform: scale(1.1); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes rotate {
                to { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.05); opacity: 1; }
            }
            @keyframes glow {
                0%, 100% { text-shadow: 0 0 20px #CC0000, 0 0 40px rgba(204,0,0,0.5); }
                50% { text-shadow: 0 0 35px #ff0000, 0 0 60px #CC0000; }
            }
            @keyframes logoEntry {
                0% { opacity: 0; transform: scale(0.5) translateY(30px); }
                60% { transform: scale(1.1) translateY(-5px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes titleGlow {
                0%, 100% { text-shadow: 0 0 20px #CC0000; }
                50% { text-shadow: 0 0 35px #ff0000, 0 0 60px #CC0000; }
            }
            
            @media (max-width: 768px) {
                .splash-logo { width: 100px; height: 100px; }
                .logo-text { font-size: 32px; }
                .splash-title { font-size: 24px; letter-spacing: 2px; }
                .splash-logo-large { font-size: 48px; }
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        
        return splash;
    }
    
    function initParticles() {
        const canvas = document.getElementById('splash-particles');
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 30 : 50;
        
        const particles = Array.from({length: particleCount}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1
        }));
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#CC0000';
            ctx.globalAlpha = 0.6;
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    function showSplash() {
        console.log('[A3KM Splash] showSplash() called');
        sessionStorage.setItem('a3km_splash_shown', 'true');
        
        const splash = createSplashElement();
        
        // Wait for body to exist
        function appendSplash() {
            if (document.body) {
                console.log('[A3KM Splash] Appending to body');
                document.body.appendChild(splash);
                
                // Remove pre-splash
                const preSplash = document.getElementById('a3km-pre-splash');
                if (preSplash) preSplash.remove();
                
                // Initialize particles
                initParticles();
                
                // Sound toggle
                const soundBtn = document.getElementById('sound-btn');
                if (soundBtn) {
                    soundBtn.onclick = () => {
                        SOUNDS_ENABLED = !SOUNDS_ENABLED;
                        localStorage.setItem('a3km_splash_sound', SOUNDS_ENABLED ? 'true' : 'false');
                        soundBtn.textContent = SOUNDS_ENABLED ? '🔊' : '🔇';
                    };
                }
                
                // Start animation sequence
                startSequence();
            } else {
                requestAnimationFrame(appendSplash);
            }
        }
        appendSplash();
    }
    
    async function startSequence() {
        console.log('[A3KM Splash] Starting sequence');
        const splash = document.getElementById('a3km-mobile-splash');
        if (!splash) return;
        
        // Stage 1: Logo and initialization - Extended for better visibility
        setTimeout(() => {
            playStartupSound();
            const progress = document.getElementById('progress-1');
            if (progress) {
                setTimeout(() => progress.style.width = '100%', 150);
            }
        }, 400);
        
        // Let logo rotate and progress bar fill completely (extended)
        await new Promise(r => setTimeout(r, 2800));
        
        // Smooth transition to stage 2
        const stage1 = document.getElementById('stage-1');
        const stage2 = document.getElementById('stage-2');
        if (stage1 && stage2) {
            stage1.style.opacity = '0';
            stage1.style.transform = 'scale(0.95)';
            await new Promise(r => setTimeout(r, 400));
            stage1.classList.add('hidden');
            stage2.classList.remove('hidden');
        }
        
        // Let all 4 modules slide in and be readable (extended)
        await new Promise(r => setTimeout(r, 2000));
        
        // Smooth transition to stage 3
        const stage3 = document.getElementById('stage-3');
        if (stage2 && stage3) {
            stage2.style.opacity = '0';
            stage2.style.transform = 'scale(0.95)';
            await new Promise(r => setTimeout(r, 400));
            stage2.classList.add('hidden');
            stage3.classList.remove('hidden');
        }
        
        // Play complete sound with slight delay for dramatic effect
        setTimeout(() => playCompleteSound(), 300);
        
        // Let final logo and title be fully visible (extended)
        await new Promise(r => setTimeout(r, 2500));
        
        // Hide splash with smooth fade
        console.log('[A3KM Splash] Hiding splash');
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 600);
    }
    
    function init() {
        console.log('[A3KM Splash] init() called');
        
        function start() {
            console.log('[A3KM Splash] Starting');
            showSplash();
            
            // Safety timeout - Extended to accommodate full animation (10 seconds)
            setTimeout(() => {
                const splash = document.getElementById('a3km-mobile-splash');
                if (splash) {
                    console.log('[A3KM Splash] Safety timeout, removing splash');
                    splash.remove();
                }
            }, 10000);
        }
        
        if (document.readyState === 'loading') {
            console.log('[A3KM Splash] Waiting for DOMContentLoaded');
            document.addEventListener('DOMContentLoaded', start, { once: true});
        } else {
            console.log('[A3KM Splash] DOM ready, starting immediately');
            start();
        }
    }
    
    // Initialize
    init();
    
    // Debug commands
    window.A3KM_SPLASH_DEBUG = {
        show: () => {
            sessionStorage.removeItem('a3km_splash_shown');
            localStorage.setItem('a3km_splash_debug', 'true');
            location.reload();
        },
        reset: () => {
            sessionStorage.removeItem('a3km_splash_shown');
            localStorage.removeItem('a3km_splash_debug');
            console.log('[A3KM Splash] Reset - reload to see splash');
        },
        info: () => {
            console.log({
                sessionShown: sessionStorage.getItem('a3km_splash_shown'),
                debugMode: localStorage.getItem('a3km_splash_debug'),
                soundEnabled: localStorage.getItem('a3km_splash_sound') !== 'false',
                isInstalled: window.matchMedia('(display-mode: standalone)').matches
            });
        }
    };
    
    console.log('[A3KM Splash] Debug: window.A3KM_SPLASH_DEBUG.show() to force show');
})();
