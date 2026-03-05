/* ═══════════════════════════════════════════════════
   A3KM Studio — Website Guide Shared JS
   Version: 2.0.0 | March 2026
═══════════════════════════════════════════════════ */

'use strict';

/* ─── Intersection Observer: Scroll Reveal ──────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

/* ─── Count-up Animation ────────────────────────── */
function animateCount(el, target, duration = 1400) {
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = eased * target;
    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(1) : Number(target).toLocaleString();
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target, parseFloat(e.target.dataset.count));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => {
    el.textContent = '0';
    io.observe(el);
  });
}

/* ─── Particle Canvas ───────────────────────────── */
function initParticles(canvasId = 'guide-particles') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  const Particle = function() {
    this.reset();
  };
  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 1.5 + 0.3;
    this.a  = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 150;
  };
  Particle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life > this.maxLife) this.reset();
  };
  Particle.prototype.draw = function() {
    const progress = this.life / this.maxLife;
    const alpha = this.a * (progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(204, 0, 0, ${alpha})`;
    ctx.fill();
  };

  resize();
  window.addEventListener('resize', resize);

  particles = Array.from({ length: 60 }, () => new Particle());

  let raf;
  const loop = () => {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(204, 0, 0, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  };

  loop();

  // Cleanup when navigating away
  window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
}

/* ─── Tooltip ───────────────────────────────────── */
function initTooltips() {
  const els = document.querySelectorAll('[data-tooltip]');
  if (!els.length) return;

  const tip = document.createElement('div');
  tip.className = 'guide-tooltip';
  tip.style.cssText = `
    position: fixed; z-index: 9999;
    background: rgba(10,0,0,0.95);
    border: 1px solid rgba(204,0,0,0.4);
    color: rgba(255,255,255,0.85);
    font-size: 0.75rem; font-family: 'Poppins', sans-serif;
    padding: 6px 12px; border-radius: 6px;
    pointer-events: none; opacity: 0;
    transition: opacity 0.15s; white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,0,0,0.6);
  `;
  document.body.appendChild(tip);

  els.forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      tip.textContent = el.dataset.tooltip;
      tip.style.opacity = '1';
    });
    el.addEventListener('mousemove', (e) => {
      tip.style.left = (e.clientX + 14) + 'px';
      tip.style.top  = (e.clientY - 28) + 'px';
    });
    el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
  });
}

/* ─── Active nav highlight ──────────────────────── */
function highlightNav() {
  const current = location.pathname.toLowerCase();
  document.querySelectorAll('.guide-nav a, .guide-desktop-nav a').forEach(a => {
    if (a.href && new URL(a.href).pathname.toLowerCase() === current) {
      a.classList.add('active');
    }
  });
}

/* ─── Init all ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initParticles();
  initTooltips();
  highlightNav();
});
