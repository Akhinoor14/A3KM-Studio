/**
 * A3KM Studio - OPTIMIZED Professional Boot Splash
 * 2.5s total | Quality sounds | Fast & smooth
 */
(function() {
    'use strict';
    
    // Enhanced detection for installed PWA (works on all platforms)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = window.navigator.standalone === true;
    const isWindowsPWA = window.location.href.includes('ms-appx://') || 
                         document.referrer.includes('ms-appx://');
    const hasWindowControlsOverlay = window.matchMedia('(display-mode: window-controls-overlay)').matches;
    
    // Force splash for testing (add ?splash=true to URL)
    const urlParams = new URLSearchParams(window.location.search);
    const forceShow = urlParams.get('splash') === 'true' || 
                      localStorage.getItem('a3km_splash_debug') === 'true';
    
    const isInstalledApp = isStandaloneMode || isIOSStandalone || isWindowsPWA || 
                          hasWindowControlsOverlay || forceShow;
    
    // Debug logging
    console.log('[A3KM Splash] Detection:', {
        standalone: isStandaloneMode,
        iOS: isIOSStandalone,
        windowsPWA: isWindowsPWA,
        windowControls: hasWindowControlsOverlay,
        force: forceShow,
        willShow: isInstalledApp
    });
    
    if (!isInstalledApp) {
        console.log('[A3KM Splash] Not installed app, skipping splash');
        return;
    }
    if (sessionStorage.getItem('a3km_splash_shown') === 'true') {
        console.log('[A3KM Splash] Already shown in this session');
        return;
    }
    
    console.log('[A3KM Splash] Starting splash screen...');
    
    let SOUNDS_ENABLED = localStorage.getItem('a3km_splash_sound') !== 'false';
    let audioContext;
    
    // PREMIUM SMOOTH STARTUP SOUND - Attractive & Cool
    function playStartupChime() {
        if (!SOUNDS_ENABLED) return;
        try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            
            // Rich musical chord: C-E-G (C Major) - Very pleasant!
            const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
            const volumes = [0.12, 0.10, 0.08];
            
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                const reverb = audioContext.createDelay();
                const reverbGain = audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                // Warm filter
                filter.type = 'lowpass';
                filter.frequency.value = 4000;
                filter.Q.value = 1;
                
                // Subtle reverb for depth
                reverb.delayTime.value = 0.03;
                reverbGain.gain.value = 0.3;
                
                // Chain: Osc → Filter → [Gain + Reverb] → Output
                osc.connect(filter);
                filter.connect(gain);
                filter.connect(reverb);
                reverb.connect(reverbGain);
                gain.connect(audioContext.destination);
                reverbGain.connect(audioContext.destination);
                
                // Smooth attack and long decay
                const delay = i * 0.08; // Stagger notes for richness
                gain.gain.setValueAtTime(0, now + delay);
                gain.gain.linearRampToValueAtTime(volumes[i], now + delay + 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);
                
                osc.start(now + delay);
                osc.stop(now + delay + 0.8);
            });
            
            // Add subtle "whoosh" for coolness
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
            
            noiseFilter.type = 'bandpass';
            noiseFilter.frequency.value = 2000;
            noiseFilter.Q.value = 0.5;
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            
            noiseGain.gain.setValueAtTime(0, now);
            noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.05);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            
            noise.start(now);
        } catch(e) {}
    }
    
    // PREMIUM SMOOTH COMPLETION SOUND - Satisfying & Attractive
    function playCompleteChime() {
        if (!SOUNDS_ENABLED) return;
        try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const now = audioContext.currentTime;
            
            // Beautiful ascending notes: G5-B5-D6 (G Major chord)
            const notes = [783.99, 987.77, 1174.66];
            const volumes = [0.10, 0.08, 0.06];
            
            notes.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const filter = audioContext.createBiquadFilter();
                const delay = audioContext.createDelay();
                const delayGain = audioContext.createGain();
                
                osc.type = 'sine';
                osc.frequency.value = freq;
                
                // Bright, clear filter
                filter.type = 'lowpass';
                filter.frequency.value = 5000;
                filter.Q.value = 1.2;
                
                // Echo effect for richness
                delay.delayTime.value = 0.05;
                delayGain.gain.value = 0.25;
                
                osc.connect(filter);
                filter.connect(gain);
                filter.connect(delay);
                delay.connect(delayGain);
                gain.connect(audioContext.destination);
                delayGain.connect(audioContext.destination);
                
                // Quick cascade effect
                const offset = i * 0.06;
                gain.gain.setValueAtTime(0, now + offset);
                gain.gain.linearRampToValueAtTime(volumes[i], now + offset + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.5);
                
                osc.start(now + offset);
                osc.stop(now + offset + 0.5);
            });
            
            // Add sparkle effect
            const sparkle = audioContext.createOscillator();
            const sparkleGain = audioContext.createGain();
            
            sparkle.type = 'sine';
            sparkle.frequency.value = 2093; // High C
            
            sparkle.connect(sparkleGain);
            sparkleGain.connect(audioContext.destination);
            
            sparkleGain.gain.setValueAtTime(0, now + 0.15);
            sparkleGain.gain.linearRampToValueAtTime(0.04, now + 0.18);
            sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            
            sparkle.start(now + 0.15);
            sparkle.stop(now + 0.35);
        } catch(e) {}
    }
    
    function showSplash() {
        sessionStorage.setItem('a3km_splash_shown', 'true');
        
        const splash = document.createElement('div');
        splash.id = 'a3km-splash';
        splash.innerHTML = `
            <canvas id="particles"></canvas>
            <div class="content">
                <div class="stage" id="s1">
                    <div class="logo-ring">
                        <svg width="120" height="120" viewBox="0 0 100 100">
                            <circle class="ring r1" cx="50" cy="50" r="45"/>
                            <circle class="ring r2" cx="50" cy="50" r="35"/>
                            <circle class="ring r3" cx="50" cy="50" r="25"/>
                            <text x="50" y="63" class="logo">A3</text>
                        </svg>
                    </div>
                    <div class="text" id="t1"></div>
                    <div class="bar"><div class="fill" id="p1"></div></div>
                </div>
                <div class="stage hide" id="s2">
                    <div class="mods" id="mods">
                        <div class="mod">⚙️ Core System</div>
                        <div class="mod">📐 Projects</div>
                        <div class="mod">🔧 Content</div>
                        <div class="mod">🚀 Analytics</div>
                    </div>
                    <div class="text" id="t2"></div>
                </div>
                <div class="stage hide" id="s3">
                    <div class="cube-wrap">
                        <div class="cube">
                            <div class="f front">A3</div>
                            <div class="f back">KM</div>
                            <div class="f right">3D</div>
                            <div class="f left">ENG</div>
                            <div class="f top">⚡</div>
                            <div class="f bottom">✓</div>
                        </div>
                    </div>
                    <h1 class="title">A3KM STUDIO</h1>
                    <p class="sub">Engineering • Innovation • Excellence</p>
                </div>
            </div>
            <button class="snd" id="snd">${SOUNDS_ENABLED ? '🔊' : '🔇'}</button>
        `;
        
        const css = `
        #a3km-splash {
            position: fixed; inset: 0; z-index: 999999;
            background: radial-gradient(circle at 50% 50%, #1a0505 0%, #0a0a0a 100%);
            display: flex; align-items: center; justify-content: center;
            font-family: 'Courier New', monospace;
            opacity: 1; 
            animation: fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #a3km-splash.out { 
            animation: fadeOut 0.5s cubic-bezier(0.4, 0, 0.6, 1) forwards; 
        }
        
        #particles {
            position: absolute; inset: 0; opacity: 0.6;
        }
        
        .content {
            position: relative; z-index: 2; text-align: center;
        }
        
        .stage { animation: slideUp 0.4s ease-out; }
        .stage.hide { display: none; }
        
        .logo-ring svg {
            filter: drop-shadow(0 0 20px #CC0000);
            animation: float 3s ease-in-out infinite, scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .ring {
            fill: none; stroke: #CC0000; stroke-width: 1.5;
            opacity: 0; animation: ringPulse 2s infinite;
        }
        .r1 { animation-delay: 0s; }
        .r2 { animation-delay: 0.3s; stroke-width: 1; }
        .r3 { animation-delay: 0.6s; stroke-width: 0.5; }
        .logo {
            font-size: 40px; font-weight: 700; fill: #CC0000;
            text-anchor: middle; animation: glow 1.5s ease-in-out infinite;
        }
        
        .text {
            color: #0f0; font-size: 13px; margin: 20px 0;
            min-height: 20px; letter-spacing: 1px;
            animation: fadeSlideIn 0.5s ease-out 0.3s backwards;
        }
        
        .bar {
            width: 250px; height: 3px; background: rgba(255,255,255,0.1);
            margin: 20px auto; border-radius: 2px; overflow: hidden;
        }
        .fill {
            height: 100%; background: linear-gradient(90deg, #CC0000, #ff0000);
            width: 0;
            box-shadow: 0 0 10px #CC0000, 0 0 20px rgba(204,0,0,0.5);
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mods {
            display: grid; gap: 12px; margin: 0 auto 30px;
            max-width: 300px;
        }
        .mod {
            padding: 12px 20px; background: rgba(204,0,0,0.1);
            border: 1px solid rgba(204,0,0,0.3); border-radius: 6px;
            color: #fff; font-size: 13px; text-align: left;
            transform: translateX(-50px); opacity: 0;
            animation: slideIn 0.3s forwards;
        }
        .mod:nth-child(1) { animation-delay: 0s; }
        .mod:nth-child(2) { animation-delay: 0.1s; }
        .mod:nth-child(3) { animation-delay: 0.2s; }
        .mod:nth-child(4) { animation-delay: 0.3s; }
        
        .cube-wrap {
            perspective: 1000px; margin: 0 auto 30px;
            width: 150px; height: 150px;
        }
        .cube {
            width: 100%; height: 100%;
            position: relative; transform-style: preserve-3d;
            animation: spin 4s infinite cubic-bezier(0.45, 0, 0.55, 1), cubeEntry 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .f {
            position: absolute; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            background: rgba(204,0,0,0.15); border: 2px solid #CC0000;
            font-size: 32px; font-weight: 700; color: #CC0000;
            backdrop-filter: blur(8px);
            box-shadow: inset 0 0 20px rgba(204,0,0,0.2);
            transition: all 0.3s ease;
        }
        .front  { transform: translateZ(75px); }
        .back   { transform: rotateY(180deg) translateZ(75px); }
        .right  { transform: rotateY(90deg) translateZ(75px); }
        .left   { transform: rotateY(-90deg) translateZ(75px); }
        .top    { transform: rotateX(90deg) translateZ(75px); }
        .bottom { transform: rotateX(-90deg) translateZ(75px); }
        
        .title {
            font-size: 36px; font-weight: 700; color: #fff;
            margin: 0 0 10px; letter-spacing: 4px;
            text-shadow: 0 0 20px #CC0000;
            animation: titleGlow 2.5s ease-in-out infinite, titleEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
        }
        .sub {
            font-size: 13px; color: rgba(255,255,255,0.6);
            margin: 0; letter-spacing: 2px;
            animation: fadeSlideIn 0.5s ease-out 0.4s backwards;
        }
        
        .snd {
            position: absolute; top: 20px; right: 20px; z-index: 3;
            background: rgba(20,20,20,0.8); border: 1px solid rgba(204,0,0,0.3);
            border-radius: 50%; width: 40px; height: 40px;
            font-size: 18px; cursor: pointer;
            transition: all 0.2s;
        }
        .snd:hover { transform: scale(1.1); background: rgba(204,0,0,0.2); }
        
        @keyframes fadeIn { 
            from { opacity: 0; transform: scale(0.95) translateY(20px); } 
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeOut { 
            to { opacity: 0; transform: scale(0.92) translateY(10px); filter: blur(5px); } 
        }
        @keyframes slideUp { 
            0% { opacity: 0; transform: translateY(50px) scale(0.9); } 
            60% { transform: translateY(-5px) scale(1.02); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float { 
            0%, 100% { transform: translateY(0px); } 
            50% { transform: translateY(-20px); } 
        }
        @keyframes ringPulse {
            0%, 100% { opacity: 0.2; stroke-width: 1.5; transform: scale(1); }
            50% { opacity: 0.8; stroke-width: 2.5; transform: scale(1.05); }
        }
        @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 8px #CC0000); }
            50% { filter: drop-shadow(0 0 20px #ff0000) drop-shadow(0 0 30px #CC0000); }
        }
        @keyframes slideIn { 
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); } 
        }
        @keyframes spin { 
            to { transform: rotateX(360deg) rotateY(360deg); } 
        }
        @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 20px #CC0000, 0 0 40px rgba(204,0,0,0.5); }
            50% { text-shadow: 0 0 35px #ff0000, 0 0 60px #CC0000, 0 0 80px rgba(204,0,0,0.3); }
        }
        @keyframes scaleIn {
            0% { opacity: 0; transform: scale(0.5); }
            60% { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cubeEntry {
            0% { opacity: 0; transform: scale(0.3) rotateX(45deg) rotateY(45deg); }
            60% { transform: scale(1.1) rotateX(10deg) rotateY(10deg); }
            100% { opacity: 1; transform: scale(1) rotateX(0) rotateY(0); }
        }
        @keyframes titleEntry {
            0% { opacity: 0; transform: scale(0.8) translateY(20px); letter-spacing: 10px; }
            60% { transform: scale(1.05) translateY(-3px); }
            100% { opacity: 1; transform: scale(1) translateY(0); letter-spacing: 4px; }
        }
        @keyframes scaleIn {
            0% { opacity: 0; transform: scale(0.5); }
            60% { transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cubeEntry {
            0% { opacity: 0; transform: scale(0.3) rotateX(45deg) rotateY(45deg); }
            60% { transform: scale(1.1) rotateX(10deg) rotateY(10deg); }
            100% { opacity: 1; transform: scale(1) rotateX(0) rotateY(0); }
        }
        @keyframes titleEntry {
            0% { opacity: 0; transform: scale(0.8) translateY(20px); letter-spacing: 10px; }
            60% { transform: scale(1.05) translateY(-3px); }
            100% { opacity: 1; transform: scale(1) translateY(0); letter-spacing: 4px; }
        }
        
        @media (max-width: 768px) {
            .logo-ring svg { width: 100px; height: 100px; }
            .title { font-size: 26px; letter-spacing: 2px; }
            .sub { font-size: 11px; letter-spacing: 1px; }
            .bar { width: 180px; height: 2.5px; }
            .text { font-size: 12px; }
            .mods { max-width: 250px; gap: 10px; }
            .mod { padding: 10px 16px; font-size: 12px; }
            .cube-wrap { width: 110px; height: 110px; }
            .f { font-size: 28px; }
            .snd { width: 36px; height: 36px; font-size: 16px; top: 15px; right: 15px; }
        }
        
        @media (prefers-reduced-motion: reduce) {
            * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        `;
        
        document.head.appendChild(Object.assign(document.createElement('style'), {textContent: css}));
        document.body.appendChild(splash);

        const preSplash = document.getElementById('a3km-pre-splash');
        if (preSplash) preSplash.remove();
        
        // Optimize particle count for mobile
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? 30 : 50;
        
        // Enhanced Particle canvas with glow effects
        const canvas = splash.querySelector('#particles');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const particles = Array.from({length: particleCount}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 2.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            pulse: Math.random() * Math.PI * 2
        }));
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += 0.03;
                
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                // Pulsing glow effect
                const glowSize = p.size * (1 + Math.sin(p.pulse) * 0.3);
                const glowOpacity = p.opacity * (0.8 + Math.sin(p.pulse) * 0.2);
                
                // Draw outer glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize * 3);
                gradient.addColorStop(0, `rgba(204, 0, 0, ${glowOpacity * 0.6})`);
                gradient.addColorStop(0.5, `rgba(204, 0, 0, ${glowOpacity * 0.2})`);
                gradient.addColorStop(1, 'rgba(204, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowSize * 3, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw particle core
                ctx.fillStyle = '#CC0000';
                ctx.globalAlpha = glowOpacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
                ctx.fill();
                
                // Draw connection lines with gradient
                particles.forEach(p2 => {
                    const dx = p.x - p2.x, dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120 && dist > 0) {
                        const lineOpacity = (1 - dist / 120) * 0.3;
                        
                        // Gradient line for smoother look
                        const lineGradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
                        lineGradient.addColorStop(0, `rgba(204, 0, 0, ${lineOpacity})`);
                        lineGradient.addColorStop(0.5, `rgba(255, 100, 100, ${lineOpacity * 0.8})`);
                        lineGradient.addColorStop(1, `rgba(204, 0, 0, ${lineOpacity})`);
                        
                        ctx.strokeStyle = lineGradient;
                        ctx.globalAlpha = 1;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
        
        // Sound toggle
        splash.querySelector('#snd').onclick = () => {
            SOUNDS_ENABLED = !SOUNDS_ENABLED;
            localStorage.setItem('a3km_splash_sound', SOUNDS_ENABLED ? 'true' : 'false');
            splash.querySelector('#snd').textContent = SOUNDS_ENABLED ? '🔊' : '🔇';
        };
        
        // SMOOTH PREMIUM BOOT SEQUENCE - Perfect timing for best animations
        setTimeout(async () => {
            playStartupChime(); // Smooth attractive sound
            
            // Stage 1: Logo + Initialization with bouncy entrance
            const stage1 = splash.querySelector('#s1');
            splash.querySelector('#t1').textContent = '> Initializing A3KM Studio';
            
            // Animate progress bar smoothly
            const progressBar = splash.querySelector('#p1');
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.width = '100%';
                }, 100);
            }
            
            // Let startup sound and animations breathe
            await new Promise(r => setTimeout(r, 1600));
            
            // Smooth transition out with coordinated timing
            stage1.style.opacity = '0';
            stage1.style.transform = 'scale(0.9)';
            
            await new Promise(r => setTimeout(r, 400));
            stage1.classList.add('hide');

            // Stage 2: Module loading
            const stage2 = splash.querySelector('#s2');
            if (stage2) {
                stage2.classList.remove('hide');
                splash.querySelector('#t2').textContent = '> Loading core modules';
                await new Promise(r => setTimeout(r, 1200));
                stage2.style.opacity = '0';
                stage2.style.transform = 'scale(0.96)';
                await new Promise(r => setTimeout(r, 350));
                stage2.classList.add('hide');
            }
            
            // Stage 3: 3D Cube + Company name with dramatic reveal
            const finalStage = splash.querySelector('#s3');
            finalStage.classList.remove('hide');
            finalStage.style.opacity = '1';
            finalStage.style.transform = 'scale(1)';
            
            // Let cube entry animation and title animation complete beautifully
            await new Promise(r => setTimeout(r, 1700));
            
            playCompleteChime(); // Attractive completion sound with sparkle
            await new Promise(r => setTimeout(r, 500)); // Let sound fully finish with echo
            hideSplash();
        }, 450); // Smooth initial reveal with fadeIn animation
        
        return splash;
    }
    
    function hideSplash() {
        const splash = document.getElementById('a3km-splash');
        if (splash) {
            splash.classList.add('out');
            setTimeout(() => splash.remove(), 500); // Smooth fade out
        }
    }
    
    function init() {
        showSplash();

        // Maximum timeout: 7 seconds - enough time for all animations
        setTimeout(() => {
            if (document.getElementById('a3km-splash')) hideSplash();
        }, 7000);
    }
    
    // Initialize splash screen
    init();
    
    // Debug commands for testing (use in browser console)
    window.A3KM_SPLASH_DEBUG = {
        show: () => {
            sessionStorage.removeItem('a3km_splash_shown');
            localStorage.setItem('a3km_splash_debug', 'true');
            location.reload();
        },
        hide: () => {
            localStorage.removeItem('a3km_splash_debug');
            const splash = document.getElementById('a3km-splash');
            if (splash) splash.remove();
        },
        reset: () => {
            sessionStorage.removeItem('a3km_splash_shown');
            localStorage.removeItem('a3km_splash_debug');
            console.log('[A3KM Splash] Reset complete - reload to see splash');
        },
        enableSound: () => {
            localStorage.setItem('a3km_splash_sound', 'true');
            console.log('[A3KM Splash] Sound enabled');
        },
        disableSound: () => {
            localStorage.setItem('a3km_splash_sound', 'false');
            console.log('[A3KM Splash] Sound disabled');
        },
        info: () => {
            console.log({
                sessionShown: sessionStorage.getItem('a3km_splash_shown'),
                debugMode: localStorage.getItem('a3km_splash_debug'),
                soundEnabled: localStorage.getItem('a3km_splash_sound') !== 'false',
                displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
            });
        }
    };
    
    console.log('[A3KM Splash] Debug commands available: window.A3KM_SPLASH_DEBUG');
    console.log('  - .show()   : Force show splash');
    console.log('  - .hide()   : Hide current splash');
    console.log('  - .reset()  : Reset and show on next load');
    console.log('  - .info()   : Show current settings');
})();
