/**
 * A3KM Studio - Advanced Engineering Boot Sequence Splash Screen
 * Interactive, animated, with sound effects and particle system
 * Engineering/Tech themed startup experience
 */
(function() {
    'use strict';
    
    const isInstalledApp = window.matchMedia('(display-mode: standalone)').matches || 
                          window.navigator.standalone === true;
    
    if (!isInstalledApp) return;
    if (sessionStorage.getItem('a3km_splash_shown') === 'true') return;
    
    const SOUNDS_ENABLED = localStorage.getItem('a3km_splash_sound') !== 'false';
    let audioContext;
    
    function playBeep(freq = 800, dur = 100) {
        if (!SOUNDS_ENABLED) return;
        try {
            if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = freq;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + dur/1000);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + dur/1000);
        } catch(e) {}
    }
    
    function typeText(el, text, speed = 30) {
        return new Promise(resolve => {
            let i = 0;
            const iv = setInterval(() => {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    playBeep(600 + Math.random() * 200, 20);
                    i++;
                } else {
                    clearInterval(iv);
                    resolve();
                }
            }, speed);
        });
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
            animation: fadeIn 0.3s;
        }
        #a3km-splash.out { animation: fadeOut 0.5s forwards; }
        
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
            animation: float 3s ease-in-out infinite;
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
        }
        
        .bar {
            width: 250px; height: 3px; background: rgba(255,255,255,0.1);
            margin: 20px auto; border-radius: 2px; overflow: hidden;
        }
        .fill {
            height: 100%; background: linear-gradient(90deg, #CC0000, #ff0000);
            width: 0; animation: load 2s ease-out forwards;
            box-shadow: 0 0 10px #CC0000;
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
            animation: spin 4s infinite linear;
        }
        .f {
            position: absolute; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            background: rgba(204,0,0,0.2); border: 2px solid #CC0000;
            font-size: 32px; font-weight: 700; color: #CC0000;
            backdrop-filter: blur(5px);
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
            animation: titleGlow 2s ease-in-out infinite;
        }
        .sub {
            font-size: 13px; color: rgba(255,255,255,0.6);
            margin: 0; letter-spacing: 2px;
        }
        
        .snd {
            position: absolute; top: 20px; right: 20px; z-index: 3;
            background: rgba(20,20,20,0.8); border: 1px solid rgba(204,0,0,0.3);
            border-radius: 50%; width: 40px; height: 40px;
            font-size: 18px; cursor: pointer;
            transition: all 0.2s;
        }
        .snd:hover { transform: scale(1.1); background: rgba(204,0,0,0.2); }
        
        @keyframes fadeIn { from { opacity: 0; } }
        @keyframes fadeOut { to { opacity: 0; transform: scale(1.05); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes ringPulse {
            0%, 100% { opacity: 0; stroke-width: 1.5; }
            50% { opacity: 0.8; stroke-width: 2; }
        }
        @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 5px #CC0000); }
            50% { filter: drop-shadow(0 0 15px #ff0000); }
        }
        @keyframes load { to { width: 100%; } }
        @keyframes slideIn { to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { to { transform: rotateX(360deg) rotateY(360deg); } }
        @keyframes titleGlow {
            0%, 100% { text-shadow: 0 0 20px #CC0000; }
            50% { text-shadow: 0 0 30px #ff0000, 0 0 40px #CC0000; }
        }
        
        @media (max-width: 768px) {
            .title { font-size: 28px; }
            .bar { width: 200px; }
            .mods { max-width: 250px; }
            .cube-wrap { width: 120px; height: 120px; }
        }
        `;
        
        document.head.appendChild(Object.assign(document.createElement('style'), {textContent: css}));
        document.body.appendChild(splash);
        
        // Particle canvas
        const canvas = splash.querySelector('#particles');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const particles = Array.from({length: 50}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        }));
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
                
                ctx.fillStyle = '#CC0000';
                ctx.globalAlpha = p.opacity;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                particles.forEach(p2 => {
                    const dx = p.x - p2.x, dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.strokeStyle = '#CC0000';
                        ctx.globalAlpha = (1 - dist / 100) * 0.2;
                        ctx.lineWidth = 0.5;
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
            const enabled = localStorage.getItem('a3km_splash_sound') !== 'false';
            localStorage.setItem('a3km_splash_sound', enabled ? 'false' : 'true');
            location.reload();
        };
        
        // Boot sequence
        setTimeout(async () => {
            playBeep(800, 100);
            await typeText(splash.querySelector('#t1'), '> Initializing A3KM Studio...');
            await new Promise(r => setTimeout(r, 1000));
            
            playBeep(900, 80);
            splash.querySelector('#s1').classList.add('hide');
            splash.querySelector('#s2').classList.remove('hide');
            await typeText(splash.querySelector('#t2'), '> Loading engineering modules...');
            await new Promise(r => setTimeout(r, 1500));
            
            playBeep(1000, 100);
            splash.querySelector('#s2').classList.add('hide');
            splash.querySelector('#s3').classList.remove('hide');
            await new Promise(r => setTimeout(r, 1500));
            
            playBeep(1200, 150);
            hideSplash();
        }, 500);
        
        return splash;
    }
    
    function hideSplash() {
        const splash = document.getElementById('a3km-splash');
        if (splash) {
            splash.classList.add('out');
            setTimeout(() => splash.remove(), 500);
        }
    }
    
    function init() {
        showSplash();
        
        const startTime = Date.now();
        const checkReady = () => {
            const elapsed = Date.now() - startTime;
            const ready = document.readyState === 'complete';
            if (ready && elapsed >= 4500) {
                setTimeout(hideSplash, 300);
            } else {
                setTimeout(checkReady, 100);
            }
        };
        
        if (document.readyState === 'complete') {
            checkReady();
        } else {
            window.addEventListener('load', checkReady);
        }
        
        setTimeout(() => {
            if (document.getElementById('a3km-splash')) hideSplash();
        }, 8000);
    }
    
    init();
})();
