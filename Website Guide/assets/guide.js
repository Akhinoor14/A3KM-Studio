/* ═══════════════════════════════════════════════════
   A3KM Studio — Website Guide Shared JS
   Version: 2.0.0 | March 2026
═══════════════════════════════════════════════════ */

'use strict';

if (window.__A3KM_GUIDE_JS_READY__) {
  // Prevent duplicate bindings when script is loaded more than once.
} else {
  window.__A3KM_GUIDE_JS_READY__ = true;

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
  document.querySelectorAll('.guide-nav a, .guide-desktop-nav a, .g-nav-links a').forEach(a => {
    if (a.href && new URL(a.href).pathname.toLowerCase() === current) {
      a.classList.add('active');
    }
  });
}

function isMobileDevice() {
  const uaData = navigator.userAgentData;
  if (uaData && typeof uaData.mobile === 'boolean') {
    return uaData.mobile;
  }

  const ua = navigator.userAgent || navigator.vendor || window.opera;
  return /android|iphone|ipad|ipod|iemobile|opera mini|blackberry|mobile/i.test(ua);
}

function enforceDesktopGuideNav() {
  if (!document.body) return;

  const desktopNavbar = document.getElementById('desktopNavbar');
  if (desktopNavbar) {
    desktopNavbar.style.setProperty('display', 'block', 'important');
  }

  document.querySelectorAll('.m-nav, .doc-bottom-nav').forEach(el => {
    el.style.setProperty('display', 'none', 'important');
  });

  document.body.style.paddingBottom = '0';
}

function enforceMobileGuideNav() {
  if (!document.body) return;

  const desktopNavbar = document.getElementById('desktopNavbar');
  if (desktopNavbar) {
    desktopNavbar.style.setProperty('display', 'none', 'important');
  }

  const mobileTop = document.querySelector('.m-nav');
  if (mobileTop) {
    mobileTop.style.setProperty('display', 'flex', 'important');
  }

  const mobileBottom = document.querySelector('.doc-bottom-nav');
  if (mobileBottom) {
    mobileBottom.style.setProperty('display', 'block', 'important');
  }

  const pad = parseInt(window.getComputedStyle(document.body).paddingBottom || '0', 10);
  if (Number.isFinite(pad) && pad < 70) {
    document.body.style.paddingBottom = '74px';
  }
}

/* ─── Guide Navbar (auto-hide / fixed) ─────────── */
function initGuideNav() {
  const nav = document.getElementById('guideNav');
  if (!nav) return;

  const mode = nav.dataset.mode; // 'fixed' | 'autohide'

  // Always add body padding class
  document.body.classList.add('has-g-nav');

  // Scrolled state (darker bg)
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  if (mode === 'fixed') return;

  /* ── Auto-hide logic ── */
  let hideTimer = null;
  let lastScroll = window.scrollY;
  let isHidden = false;
  const HIDE_DELAY = 3000; // 3 s idle before hiding

  function showNav() {
    if (isHidden) {
      nav.classList.remove('g-nav-hidden');
      isHidden = false;
    }
  }

  function hideNav() {
    if (!isHidden) {
      nav.classList.add('g-nav-hidden');
      isHidden = true;
    }
  }

  function resetHideTimer() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideNav, HIDE_DELAY);
  }

  // Mouse enters top 100 px → show, cancel timer
  document.addEventListener('mousemove', e => {
    if (e.clientY < 100) {
      showNav();
      clearTimeout(hideTimer);
    } else if (!isHidden) {
      resetHideTimer();
    }
  }, { passive: true });

  // Touch: swipe top area → show
  document.addEventListener('touchstart', e => {
    if (e.touches[0].clientY < 60) showNav();
  }, { passive: true });

  // Scroll direction
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s < 80) {
      // Near top — always show
      showNav();
      clearTimeout(hideTimer);
    } else if (s < lastScroll - 4) {
      // Scrolling UP → show, then schedule hide
      showNav();
      resetHideTimer();
    } else if (s > lastScroll + 8) {
      // Scrolling DOWN → hide immediately
      clearTimeout(hideTimer);
      hideNav();
    }
    lastScroll = s;
  }, { passive: true });

  // Start the idle timer after 4 s on page load
  hideTimer = setTimeout(hideNav, 4000);
}

/* ─── Mobile Nav Injection ──────────────────────── */
function initMobileNav() {
  if (!document.body) return;

  if (!isMobileDevice()) {
    enforceDesktopGuideNav();
    return;
  }

  enforceMobileGuideNav();

  const isSubfolder = /\/(mobile-guide|desktop)\//i.test(window.location.pathname);
  const guideRoot   = isSubfolder ? '../' : './';
  const siteRoot    = isSubfolder ? '../../' : '../';

  /* ── Inject m-nav + drawer (skip if page already has one) ── */
  if (!document.querySelector('.m-nav')) {
    document.body.insertAdjacentHTML('afterbegin',
      `<nav class="m-nav" id="mobileNav">` +
        `<a href="${guideRoot}index.html" class="m-nav-logo" title="Website Guide Home">` +
          `<img src="${siteRoot}images/logo.svg" class="m-nav-logo-img" width="30" height="30" alt="A3KM">` +
          `<div class="m-nav-brand">` +
            `<span class="m-nav-brand-name">A3KM Studio</span>` +
            `<span class="m-nav-brand-sub">Website Guide</span>` +
          `</div>` +
        `</a>` +
        `<div class="m-nav-menu">` +
          `<button class="m-nav-btn" id="mNavMenuBtn" title="Navigation" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mDrawer" aria-haspopup="true">` +
            `<i class="fas fa-bars"></i>` +
          `</button>` +
        `</div>` +
      `</nav>` +
      `<div class="m-drawer-overlay" id="mDrawerOverlay"></div>` +
      `<div class="m-drawer" id="mDrawer" role="dialog" aria-modal="true" aria-label="Guide navigation" tabindex="-1">` +
        `<div class="m-drawer-group">` +
          `<div class="m-drawer-group-title">Quick Access</div>` +
          `<div class="m-drawer-links">` +
            `<a href="${guideRoot}features.html" class="m-drawer-link is-primary"><i class="fas fa-search"></i><span>Features</span></a>` +
            `<a href="${guideRoot}mobile-guide/index.html" class="m-drawer-link is-primary"><i class="fas fa-mobile-alt"></i><span>Mobile Guide</span></a>` +
            `<a href="${guideRoot}index.html" class="m-drawer-link is-primary"><i class="fas fa-book-open"></i><span>Guide Home</span></a>` +
            `<a href="${guideRoot}desktop/index.html" class="m-drawer-link"><i class="fas fa-desktop"></i><span>Desktop Guide</span></a>` +
          `</div>` +
        `</div>` +
      `</div>`
    );

    const btn     = document.getElementById('mNavMenuBtn');
    const drawer  = document.getElementById('mDrawer');
    const overlay = document.getElementById('mDrawerOverlay');
    let lastFocusedEl = null;

    function getFocusableElements() {
      if (!drawer) return [];
      return Array.from(drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    }

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('m-drawer-open');
      lastFocusedEl = document.activeElement;
      btn.setAttribute('aria-expanded', 'true');
      btn.innerHTML = '<i class="fas fa-times"></i>';

      const focusables = getFocusableElements();
      if (focusables.length) {
        focusables[0].focus();
      } else {
        drawer.focus();
      }
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('m-drawer-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<i class="fas fa-bars"></i>';

      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
      } else {
        btn.focus();
      }
    }

    btn.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
    overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => {
      if (!drawer.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements();
        if (!focusables.length) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    drawer.querySelectorAll('.m-drawer-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    /* Highlight active drawer link */
    const currentPath = window.location.pathname.toLowerCase();
    drawer.querySelectorAll('.m-drawer-link').forEach(link => {
      if (link.href && new URL(link.href).pathname.toLowerCase() === currentPath) {
        link.classList.add('active');
      }
    });
  }

  /* ── Inject bottom nav (skip if already present) ── */
  if (!document.querySelector('.doc-bottom-nav')) {
    document.body.insertAdjacentHTML('beforeend',
      `<nav class="doc-bottom-nav">` +
        `<div class="doc-nav-container">` +
          `<a href="${siteRoot}mobile/home/index.html" class="doc-nav-item"><i class="fas fa-home"></i><span>Home</span></a>` +
          `<a href="${siteRoot}mobile/about/about.html" class="doc-nav-item"><i class="fas fa-user"></i><span>About</span></a>` +
          `<a href="${siteRoot}mobile/projects/projects.html" class="doc-nav-item"><i class="fas fa-code"></i><span>Projects</span></a>` +
          `<a href="${siteRoot}mobile/content-studio/hub.html" class="doc-nav-item"><i class="fas fa-play-circle"></i><span>Studio</span></a>` +
          `<a href="${siteRoot}mobile/contact/contact.html" class="doc-nav-item"><i class="fas fa-envelope"></i><span>Contact</span></a>` +
        `</div>` +
      `</nav>`
    );

    const injectedBottomNav = document.querySelector('.doc-bottom-nav');
    if (injectedBottomNav) {
      injectedBottomNav.style.setProperty('display', 'block', 'important');
    }
  }
}

/* ─── Init all ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initParticles();
  initTooltips();
  highlightNav();
  initGuideNav();
  initMobileNav();
});

}
