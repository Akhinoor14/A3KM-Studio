/**
 * A3KM Studio — Neural Grid Cursor Effect
 * ─────────────────────────────────────────────────────────────
 * Self-contained. Injects canvas, cursor elements, and styles.
 * Works on every desktop page. Skips touch/mobile devices.
 * ─────────────────────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ── Touch/mobile bail-out ─────────────────────────────────── */
  if (window.matchMedia('(hover: none)').matches) return;
  if (typeof window === 'undefined' || !window.requestAnimationFrame) return;

  /* ── Inject CSS ────────────────────────────────────────────── */
  const style = document.createElement('style');
  style.id = 'a3km-cursor-styles';
  style.textContent = `
    html, body, * { cursor: none !important; }
    .a3km-cursor-dot {
      position: fixed;
      width: 8px; height: 8px;
      background: #CC0000;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      transform: translate(-50%, -50%);
      transition: width .15s ease, height .15s ease, background .15s ease, box-shadow .15s ease;
      box-shadow: 0 0 8px rgba(204,0,0,.9), 0 0 3px rgba(255,255,255,.25);
      will-change: left, top;
    }
    .a3km-cursor-ring {
      position: fixed;
      width: 32px; height: 32px;
      border: 1.5px solid rgba(204,0,0,.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 999998;
      transform: translate(-50%, -50%);
      transition: width .2s ease, height .2s ease,
                  border-color .2s ease, border-width .2s ease;
      will-change: left, top;
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

  const ctx = canvas.getContext('2d', { alpha: true });

  /* ── Config ─────────────────────────────────────────────────── */
  const CFG = {
    GRID_SPACING: 95,        // px between grid nodes
    JITTER: 0.45,            // random offset (fraction of spacing)
    CONNECTION_R: 175,       // mouse → particle line radius
    LINK_R: 115,             // particle → particle line radius
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

  /* ── State ──────────────────────────────────────────────────── */
  let W = 0, H = 0;
  let particles = [];
  let ripples = [];
  let mx = -9999, my = -9999;
  let rx = -9999, ry = -9999;   // ring (lagging)
  let tabVisible = !document.hidden;
  let rafId = null;

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
    canvas.width  = W;
    canvas.height = H;
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
    rx = lerp(rx, mx, 0.13);
    ry = lerp(ry, my, 0.13);
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
  }

  /* ── Main draw loop ─────────────────────────────────────────── */
  function draw() {
    rafId = requestAnimationFrame(draw);

    if (!tabVisible) return;

    ctx.clearRect(0, 0, W, H);

    const now = performance.now();
    const [pr, pg, pb] = CFG.PARTICLE_COLOR;
    const [lr, lg, lb] = CFG.LINE_COLOR;
    const [kr, kg, kb] = CFG.LINK_COLOR;

    /* — Particle update & draw ── */
    for (let i = 0, len = particles.length; i < len; i++) {
      const p = particles[i];

      /* mouse attract */
      const dxm = mx - p.x, dym = my - p.y;
      const dm2 = dxm * dxm + dym * dym;
      const dm  = Math.sqrt(dm2);

      if (dm < CFG.ATTRACT_R && dm > 0) {
        const f = (1 - dm / CFG.ATTRACT_R) * CFG.ATTRACT_F;
        p.vx += (dxm / dm) * f;
        p.vy += (dym / dm) * f;
      }

      /* spring return to base */
      p.vx += (p.bx - p.x) * CFG.RETURN_F;
      p.vy += (p.by - p.y) * CFG.RETURN_F;

      /* ripple scatter */
      for (let ri = 0; ri < ripples.length; ri++) {
        const rp = ripples[ri];
        const dxr = p.x - rp.x, dyr = p.y - rp.y;
        const dr  = Math.sqrt(dxr * dxr + dyr * dyr);
        const shell = Math.abs(dr - rp.radius);
        if (shell < 45 && dr > 0) {
          const ff = (1 - shell / 45) * 1.8;
          p.vx += (dxr / dr) * ff;
          p.vy += (dyr / dr) * ff;
        }
      }

      /* friction + speed cap */
      p.vx *= CFG.FRICTION;
      p.vy *= CFG.FRICTION;
      const sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (sp > CFG.MAX_SPEED) {
        p.vx = (p.vx / sp) * CFG.MAX_SPEED;
        p.vy = (p.vy / sp) * CFG.MAX_SPEED;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.phase += 0.018;

      /* connectivity lines: mouse → particle */
      if (dm < CFG.CONNECTION_R && mx > -300) {
        const t = 1 - dm / CFG.CONNECTION_R;
        const a = Math.pow(t, 1.5) * 0.55;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(${lr},${lg},${lb},${a.toFixed(3)})`;
        ctx.lineWidth = t * 1.2 + 0.3;
        ctx.stroke();
      }

      /* connectivity lines: particle ↔ particle */
      for (let j = i + 1; j < len; j++) {
        const q = particles[j];
        const dxq = q.x - p.x, dyq = q.y - p.y;
        const dq  = Math.sqrt(dxq * dxq + dyq * dyq);
        if (dq < CFG.LINK_R) {
          const t = 1 - dq / CFG.LINK_R;
          const a = t * t * 0.16;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${kr},${kg},${kb},${a.toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      /* particle dot */
      const pa = p.a * (0.7 + 0.3 * Math.sin(p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fillStyle = `rgba(${pr},${pg},${pb},${pa.toFixed(3)})`;
      ctx.fill();
    }

    /* — Ripples ── */
    for (let ri = ripples.length - 1; ri >= 0; ri--) {
      const rp = ripples[ri];
      rp.radius += 2.8;
      rp.alpha  -= 0.022;
      if (rp.alpha <= 0) { ripples.splice(ri, 1); continue; }
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.radius, 0, 6.2832);
      ctx.strokeStyle = `rgba(204,0,0,${rp.alpha.toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    /* — Spotlight glow (canvas) ── */
    if (mx > -300) {
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
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  document.addEventListener('mousedown', function () {
    document.body.classList.add('a3km-clicking');
    if (mx > -300) ripples.push({ x: mx, y: my, radius: 0, alpha: 0.65 });
  });

  document.addEventListener('mouseup', function () {
    document.body.classList.remove('a3km-clicking');
  });

  document.addEventListener('mouseleave', function () {
    mx = -9999; my = -9999;
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', function () {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  });

  document.addEventListener('visibilitychange', function () {
    tabVisible = !document.hidden;
  });

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 220);
  }, { passive: true });

  /* ── Magnetic hover (attach + re-attach for dynamic content) ── */
  function attachMagnetic() {
    const sel = [
      'a', 'button', 'input[type="submit"]', 'input[type="button"]',
      'label', 'select', '[role="button"]', '[role="link"]',
      '.btn', '.card', '.stat-card', '.tech-badge', '.social-link',
      '.desktop-nav-link', '.desktop-nav-logo',
      '.side-nav-item', '.cmd-item',
    ].join(', ');

    document.querySelectorAll(sel).forEach(function (el) {
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

  /* ── Init ───────────────────────────────────────────────────── */
  function init() {
    resize();
    attachMagnetic();
    setTimeout(attachMagnetic, 1200); // re-attach for late-rendered elements
    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
