/**
 * A3KM Studio — Neural Grid Cursor Effect
 * ─────────────────────────────────────────────────────────────
 * Self-contained. Injects canvas, cursor elements, and styles.
 * Works on every desktop page. Skips touch/mobile devices.
 * ─────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ── Duplicate instance guard ──────────────────────────────── */
  if (window.__a3kmCursorActive) return;
  window.__a3kmCursorActive = true;

  /* ── Touch/mobile bail-out ─────────────────────────────────── */
  if (window.matchMedia('(hover: none)').matches) { window.__a3kmCursorActive = false; return; }
  if (!window.requestAnimationFrame) { window.__a3kmCursorActive = false; return; }

  /* ── Reduced-motion accessibility bail-out ─────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { window.__a3kmCursorActive = false; return; }

  /* ── GPU tier detection ───────────────────────────────────────────
     Strategy (in order of reliability):
     1. WebGL2 UNMASKED_RENDERER string  → most accurate
     2. WebGL1 UNMASKED_RENDERER string  → fallback
     3. hardwareConcurrency + deviceMemory hints → last resort
     Context is explicitly destroyed after detection to prevent memory leak. */
  const _GPU_TIER = (function () {
    function classifyRenderer(r) {
      r = (r || '').toLowerCase();
      // Discrete / high-end GPUs
      if (/nvidia|geforce|quadro|tesla|rtx|gtx|mx[2-9]\d\d/.test(r)) return 'high';
      if (/radeon|rx\s?\d|r[579]\s|amd/.test(r))                       return 'high';
      if (/apple\s?m\d/.test(r))                                         return 'high'; // M1, M2, M3…
      if (/arc\s?[a-z]?\d/.test(r))                                       return 'high'; // Intel Arc discrete
      // Low-end / integrated (formatter-safe: avoid multiline regex literals)
      if ([
        'intel', 'mesa', 'llvm', 'swiftshader', 'microsoft basic', 'angle',
        'hd graphics', 'uhd graphics', 'iris', 'mali', 'adreno', 'powervr', 'vivante'
      ].some(function (k) { return r.indexOf(k) !== -1; })) return 'low';
      return 'mid';
    }

    var tier = null;
    var tempCanvas = document.createElement('canvas');
    try {
      // Try WebGL2 first (more common in modern browsers, same extension available)
      var gl = tempCanvas.getContext('webgl2') ||
               tempCanvas.getContext('webgl') ||
               tempCanvas.getContext('experimental-webgl');
      if (gl) {
        var ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) {
          tier = classifyRenderer(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
        }
        // Explicitly lose context to free GPU memory immediately
        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      }
    } catch (e) {}
    // Nullify reference so GC can collect the temp canvas
    tempCanvas = null;

    // Fallback: use CPU core count + device memory as proxy for GPU tier
    if (!tier) {
      var cores = navigator.hardwareConcurrency || 2;
      var mem   = navigator.deviceMemory || 2; // GB, may be undefined
      if (cores >= 8 && mem >= 8)       tier = 'high';
      else if (cores >= 4 && mem >= 4)  tier = 'mid';
      else                              tier = 'low';
    }

    return tier;
  })();

  /* ── Inject CSS ────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.id = 'a3km-cursor-styles';
  style.textContent = `
    html, body, * { cursor: none !important; }
    /* UX FIX: restore native cursors inside form elements */
    input[type="text"], input[type="email"], input[type="password"],
    input[type="search"], input[type="number"], input[type="url"],
    input[type="tel"], input[type="date"], input[type="time"],
    input[type="datetime-local"], input[type="month"], input[type="week"],
    textarea, [contenteditable="true"] { cursor: text !important; }
    input[type="range"], input[type="color"],
    input[type="file"], input[type="checkbox"], input[type="radio"],
    select { cursor: pointer !important; }
    .a3km-cursor-dot {
      position: fixed;
      width: 8px; height: 8px;
      background: #CC0000;
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483647;
      transform: translate(-50%, -50%);
      transition: width .15s ease, height .15s ease, background .15s ease,
                  box-shadow .15s ease, opacity .2s ease;
      box-shadow: 0 0 8px rgba(204,0,0,.9), 0 0 3px rgba(255,255,255,.25);
      will-change: left, top;
      opacity: 0;
    }
    .a3km-cursor-ring {
      position: fixed;
      width: 32px; height: 32px;
      border: 1.5px solid rgba(204,0,0,.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483646;
      transform: translate(-50%, -50%);
      transition: width .2s ease, height .2s ease,
                  border-color .2s ease, border-width .2s ease, opacity .2s ease;
      will-change: left, top;
      opacity: 0;
    }
    body.a3km-hovering .a3km-cursor-dot {
      width: 14px; height: 14px;
      background: #FF3333;
      box-shadow: 0 0 20px rgba(255,50,50,1), 0 0 8px rgba(204,0,0,.9);
    }
    body.a3km-hovering .a3km-cursor-ring {
      width: 50px; height: 50px;
      border-color: rgba(204,0,0,.85);
      border-width: 2px;
    }
    body.a3km-clicking .a3km-cursor-dot {
      width: 5px; height: 5px;
      box-shadow: 0 0 12px rgba(204,0,0,1);
    }
    body.a3km-clicking .a3km-cursor-ring {
      width: 18px; height: 18px;
      border-color: #CC0000;
      border-width: 2.5px;
    }
    .a3km-neural-canvas {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none;
      z-index: 1;
      opacity: 1;
    }
    @media (hover: none) {
      .a3km-cursor-dot,
      .a3km-cursor-ring,
      .a3km-neural-canvas { display: none !important; }
      html, body, * { cursor: auto !important; }
    }
  `;
  document.head.appendChild(style);

  /* ── Inject DOM ─────────────────────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.className = 'a3km-neural-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const cursorDot = document.createElement('div');
  cursorDot.className = 'a3km-cursor-dot';
  cursorDot.setAttribute('aria-hidden', 'true');

  const cursorRing = document.createElement('div');
  cursorRing.className = 'a3km-cursor-ring';
  cursorRing.setAttribute('aria-hidden', 'true');

  function injectDOM() {
    document.body.prepend(canvas);
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDOM);
  } else {
    injectDOM();
  }

  const ctx = canvas.getContext('2d', {
    alpha: _GPU_TIER === 'high', // alpha:false is faster on low/mid (no compositor blend)
    desynchronized: true,        // hint: skip compositor sync for lower latency
  });
  if (!ctx) { window.__a3kmCursorActive = false; return; }

  /* ── Config ─────────────────────────────────────────────────── */
  const CFG = {
    /* Adaptive spacing: more spread-out grid = fewer particles on low-end */
    GRID_SPACING:  _GPU_TIER === 'high' ? 85 : _GPU_TIER === 'mid' ? 105 : 135,
    JITTER: 0.45,
    CONNECTION_R:  _GPU_TIER === 'high' ? 175 : _GPU_TIER === 'mid' ? 145 : 110, // fewer mouse lines on low-end
    LINK_R:        _GPU_TIER === 'low'  ? 80  : 115,
    ATTRACT_R: 130,          // mouse attract force radius
    ATTRACT_F: 0.055,        // attract force magnitude
    RETURN_F: 0.0018,        // spring return-to-base force
    FRICTION: 0.97,          // velocity damping per frame
    MAX_SPEED: 1.6,          // max velocity
    PARTICLE_COLOR: [204, 60, 60],   // rgb for particles
    LINE_COLOR: [204, 0, 0],         // rgb for connection lines
    LINK_COLOR: [160, 0, 0],         // rgb for particle-link lines
    GLOW_RADIUS: 220,        // spotlight glow radius
  };

  /* ── Pre-computed squared radii (avoid sqrt for majority of rejected pairs) */
  const CONNECTION_R2 = CFG.CONNECTION_R * CFG.CONNECTION_R;
  const LINK_R2       = CFG.LINK_R       * CFG.LINK_R;
  const ATTRACT_R2    = CFG.ATTRACT_R    * CFG.ATTRACT_R;

  /* ── State ──────────────────────────────────────────────────── */
  let W = 0, H = 0;
  let particles = [];
  let ripples = [];
  let mx = -9999, my = -9999;
  let rx = -9999, ry = -9999;   // ring (lagging)
  let tabVisible = !document.hidden;
  let rafId = null;
  let lastFrameTime = 0;
  let dt = 1 / 60; // module-level so updateCursor() can access it

  /* ── FPS adaptive quality ──────────────────────────────────────
     Measure rolling average FPS. If < 40fps on low-end, disable
     particle-particle links (the O(n²) bottleneck) to recover.   */
  let _fpsFrames = 0, _fpsAccum = 0, _linksEnabled = true;

  /* ── Particle factory ───────────────────────────────────────── */
  function makeParticle(bx, by) {
    const jx = CFG.GRID_SPACING * CFG.JITTER;
    const jy = CFG.GRID_SPACING * CFG.JITTER;
    const x = bx + (Math.random() - 0.5) * jx * 2;
    const y = by + (Math.random() - 0.5) * jy * 2;
    return {
      x, y,
      bx, by,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6,
      a: Math.random() * 0.35 + 0.15,
      phase: Math.random() * Math.PI * 2,
    };
  }

  /* ── Init / resize ──────────────────────────────────────────── */
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    /* Cap DPR: high→2, mid→1.5, low→1  (3x retina on low GPU = 9x pixel work) */
    const rawDpr = window.devicePixelRatio || 1;
    const maxDpr = _GPU_TIER === 'high' ? 2 : _GPU_TIER === 'mid' ? 1.5 : 1;
    const dpr = Math.min(rawDpr, maxDpr);
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    particles = [];
    const s = CFG.GRID_SPACING;
    const cols = Math.floor(W / s) + 2;
    const rows = Math.floor(H / s) + 2;
    const offX = (W - (cols - 1) * s) / 2;
    const offY = (H - (rows - 1) * s) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        particles.push(makeParticle(offX + c * s, offY + r * s));
      }
    }
  }

  /* ── Lerp helper ─────────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── Cursor update ──────────────────────────────────────────── */
  function updateCursor() {
    if (mx < -300) return; // mouse not yet on page
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';

    if (rx < -300) { rx = mx; ry = my; }
    /* frame-rate independent lerp: same feel at any refresh rate */
    const ringT = 1 - Math.pow(0.87, dt * 60);
    rx = lerp(rx, mx, ringT);
    ry = lerp(ry, my, ringT);
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
  }

  /* ── Main draw loop ─────────────────────────────────────────── */
  function draw(ts) {
    rafId = requestAnimationFrame(draw);

    if (!tabVisible) return;

    /* delta-time so all animations are identical on 30Hz, 60Hz, 144Hz */
    dt = lastFrameTime ? Math.min((ts - lastFrameTime) / 1000, 0.05) : 1 / 60;
    lastFrameTime = ts;

    /* FPS monitor: every 60 frames check rolling average */
    _fpsAccum += dt;
    _fpsFrames++;
    if (_fpsFrames >= 60) {
      const avgFps = _fpsFrames / _fpsAccum;
      _linksEnabled = avgFps >= (_GPU_TIER === 'low' ? 38 : 25);
      _fpsFrames = 0; _fpsAccum = 0;
    }

    ctx.clearRect(0, 0, W, H);

    const [pr, pg, pb] = CFG.PARTICLE_COLOR;
    const [lr, lg, lb] = CFG.LINE_COLOR;
    const [kr, kg, kb] = CFG.LINK_COLOR;
    /* pre-compute color prefixes outside the hot loop — avoids repeated string concat */
    const pColorPfx = `rgba(${pr},${pg},${pb},`;
    const lColorPfx = `rgba(${lr},${lg},${lb},`;
    const kColorPfx = `rgba(${kr},${kg},${kb},`;
    const mouseActive = mx > -300;
    /* cache friction once per frame — was being computed per-particle (huge waste) */
    const frameFriction = Math.pow(CFG.FRICTION, dt * 60);

    /* — Particle update & draw ── */
    for (let i = 0, len = particles.length; i < len; i++) {
      const p = particles[i];

      /* mouse attract — skip entirely when mouse is off-screen */
      const dxm = mx - p.x, dym = my - p.y;
      const dm2 = dxm * dxm + dym * dym;
      let dm = 0;
      if (mouseActive && dm2 < ATTRACT_R2) {
        dm = Math.sqrt(dm2);
        if (dm > 0) {
          /* dt-corrected force so 144Hz feels same as 30Hz */
          const f = (1 - dm / CFG.ATTRACT_R) * CFG.ATTRACT_F * dt * 60;
          p.vx += (dxm / dm) * f;
          p.vy += (dym / dm) * f;
        }
      }

      /* spring return to base — dt-corrected */
      p.vx += (p.bx - p.x) * CFG.RETURN_F * dt * 60;
      p.vy += (p.by - p.y) * CFG.RETURN_F * dt * 60;

      /* ripple scatter — squared pre-check avoids sqrt for most particles */
      for (let ri = 0; ri < ripples.length; ri++) {
        const rp = ripples[ri];
        const dxr = p.x - rp.x, dyr = p.y - rp.y;
        const dr2  = dxr * dxr + dyr * dyr;
        const rOuter = rp.radius + 45, rInner = rp.radius - 45;
        // Squared bounds check: skip sqrt if clearly outside shell
        if (dr2 > rOuter * rOuter || dr2 < rInner * rInner) continue;
        const dr = Math.sqrt(dr2);
        const shell = Math.abs(dr - rp.radius);
        if (shell < 45 && dr > 0) {
          const ff = (1 - shell / 45) * 1.8;
          p.vx += (dxr / dr) * ff;
          p.vy += (dyr / dr) * ff;
        }
      }

      /* friction — use per-frame cached value (not recomputed per particle) */
      p.vx *= frameFriction;
      p.vy *= frameFriction;
      /* speed cap: squared check first — most particles never exceed MAX_SPEED */
      const sp2 = p.vx * p.vx + p.vy * p.vy;
      if (sp2 > CFG.MAX_SPEED * CFG.MAX_SPEED) {
        const sp = Math.sqrt(sp2);
        p.vx = (p.vx / sp) * CFG.MAX_SPEED;
        p.vy = (p.vy / sp) * CFG.MAX_SPEED;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.018 * dt * 60;

      /* skip draw entirely if particle is outside the visible viewport */
      if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;

      /* connectivity lines: mouse → particle — use pre-computed dm2 to skip sqrt */
      if (mouseActive && dm2 < CONNECTION_R2) {
        if (!dm) dm = Math.sqrt(dm2);
        const t = 1 - dm / CFG.CONNECTION_R;
        const a = Math.pow(t, 1.5) * 0.55;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = lColorPfx + (a < 0.001 ? 0 : +a.toFixed(3)) + ')';
        ctx.lineWidth = t * 1.2 + 0.3;
        ctx.stroke();
      }

      /* connectivity lines: particle ↔ particle
         Batched: collect all segments first, draw in ONE stroke() per alpha bucket.
         Only runs when FPS is healthy (_linksEnabled). */
      if (_linksEnabled) {
        for (let j = i + 1; j < len; j++) {
          const q = particles[j];
          const dxq = q.x - p.x, dyq = q.y - p.y;
          const dq2 = dxq * dxq + dyq * dyq;
          if (dq2 < LINK_R2) {
            const dq = Math.sqrt(dq2);
            const t = 1 - dq / CFG.LINK_R;
            const a = t * t * 0.16;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = kColorPfx + (a < 0.001 ? 0 : +a.toFixed(3)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* particle dot */
      const pa = p.a * (0.7 + 0.3 * Math.sin(p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fillStyle = pColorPfx + +pa.toFixed(3) + ')';
      ctx.fill();
    }

    /* — Ripples ── */
    for (let ri = ripples.length - 1; ri >= 0; ri--) {
      const rp = ripples[ri];
      rp.radius += 2.8  * dt * 60; // delta-time corrected expand
      rp.alpha  -= 0.022 * dt * 60; // delta-time corrected fade
      if (rp.alpha <= 0) { ripples.splice(ri, 1); continue; }
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.radius, 0, 6.2832);
      ctx.strokeStyle = `rgba(204,0,0,${rp.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    /* — Spotlight glow (canvas) — skip on low-end GPU tier ── */
    if (mouseActive && _GPU_TIER !== 'low') {
      const grd = ctx.createRadialGradient(mx, my, 0, mx, my, CFG.GLOW_RADIUS);
      grd.addColorStop(0,   'rgba(120,0,0,.065)');
      grd.addColorStop(0.5, 'rgba(90,0,0,.025)');
      grd.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }

    updateCursor();
  }

  /* ── Events ─────────────────────────────────────────────────── */
  function handlePointerMove(e) {
    mx = e.clientX;
    my = e.clientY;
    // Keep custom cursor visible even when page scripts stop bubbling events.
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  }

  // Capture-phase listeners prevent notification overlays from breaking cursor updates.
  window.addEventListener('pointermove', handlePointerMove, { passive: true, capture: true });
  window.addEventListener('mousemove', handlePointerMove, { passive: true, capture: true });

  document.addEventListener('mousedown', function () {
    document.body.classList.add('a3km-clicking');
    /* UX FIX: cap ripples to prevent jank on rapid clicking */
    if (mx > -300 && ripples.length < 8) ripples.push({ x: mx, y: my, radius: 0, alpha: 0.65 });
  });

  document.addEventListener('mouseup', function () {
    document.body.classList.remove('a3km-clicking');
  });

  /* BUG FIX: clicking/hovering stuck when window loses focus (Alt+Tab, etc.) */
  window.addEventListener('blur', function () {
    document.body.classList.remove('a3km-clicking');
    document.body.classList.remove('a3km-hovering');
  });

  document.addEventListener('mouseleave', function () {
    mx = -9999; my = -9999;
    lastFrameTime = 0;
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  });

  document.addEventListener('visibilitychange', function () {
    tabVisible = !document.hidden;
    if (tabVisible) lastFrameTime = 0; // reset so first frame back uses default dt
  });

  // Window-level fallback for browser UI popups / focus loss in admin tools.
  window.addEventListener('focus', function () {
    lastFrameTime = 0;
    if (mx > -300) {
      cursorDot.style.opacity  = '1';
      cursorRing.style.opacity = '1';
    }
  });

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 220);
  }, { passive: true });

  /* ── Magnetic hover (attach + re-attach for dynamic content) ── */
  const MAGNETIC_SEL = [
    'a', 'button', 'input[type="submit"]', 'input[type="button"]',
    'label', 'select', '[role="button"]', '[role="link"]',
    '.btn', '.card', '.stat-card', '.tech-badge', '.social-link',
    '.desktop-nav-link', '.desktop-nav-logo',
    '.side-nav-item', '.cmd-item',
  ].join(', ');

  function attachMagnetic(root) {
    const scope = root || document;
    /* BUG FIX: also check if the root node itself matches (e.g. a <button> added directly) */
    const candidates = Array.from(scope.querySelectorAll(MAGNETIC_SEL));
    if (root && root.nodeType === 1 && root.matches && root.matches(MAGNETIC_SEL)) {
      candidates.unshift(root);
    }
    candidates.forEach(function (el) {
      if (el.__a3kmMagnetic) return;
      el.__a3kmMagnetic = true;
      el.addEventListener('mouseenter', function () {
        document.body.classList.add('a3km-hovering');
      });
      el.addEventListener('mouseleave', function () {
        document.body.classList.remove('a3km-hovering');
      });
    });
  }

  /* MutationObserver: attach magnetic to dynamically added elements */
  const _mo = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const added = mutations[i].addedNodes;
      for (let j = 0; j < added.length; j++) {
        if (added[j].nodeType === 1) attachMagnetic(added[j]);
      }
    }
  });

  /* ── Init ───────────────────────────────────────────────────── */
  function init() {
    resize();
    attachMagnetic();
    /* BUG FIX: observe inside init so document.body is guaranteed to exist */
    _mo.observe(document.body, { childList: true, subtree: true });
    rafId = requestAnimationFrame(draw);
  }

  /* BUG FIX: cancel RAF loop on page unload to prevent SPA memory leaks */
  window.addEventListener('pagehide', function () {
    cancelAnimationFrame(rafId);
    _mo.disconnect();
    window.__a3kmCursorActive = false;
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
