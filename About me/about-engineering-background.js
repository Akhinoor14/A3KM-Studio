/* ============================================
   ENGINEERING ANIMATED BACKGROUND SYSTEM
   Particles + Moving Grid + Geometric Shapes
   For About Page Desktop
   ============================================ */

(function() {
  'use strict';

  // Create main background container
  function createEngineeringBackground() {
    // Check if background already exists
    if (document.querySelector('.engineering-background')) {
      return;
    }

    const engineeringBg = document.createElement('div');
    engineeringBg.className = 'engineering-background';
    document.body.insertBefore(engineeringBg, document.body.firstChild);

    // Create geometric shapes
    createGeometricShapes(engineeringBg);

    // Create floating particles
    createFloatingParticles(engineeringBg);

    // Create animated circuit lines
    createCircuitLines(engineeringBg);
  }

  // Create 3D geometric shapes
  function createGeometricShapes(container) {
    const shapes = [
      { class: 'shape-1', type: 'circle' },
      { class: 'shape-2', type: 'square' },
      { class: 'shape-3', type: 'triangle' }
    ];

    shapes.forEach(shapeData => {
      const shape = document.createElement('div');
      shape.className = `engineering-shape ${shapeData.class}`;
      container.appendChild(shape);
    });
  }

  // Create floating particles
  function createFloatingParticles(container) {
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      // Random position
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';

      // Random movement
      const tx = (Math.random() - 0.5) * 400;
      const ty = (Math.random() - 0.5) * 400;
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      // Random animation timing
      particle.style.animationDelay = Math.random() * 5 + 's';
      particle.style.animationDuration = Math.random() * 15 + 10 + 's';

      // Random opacity
      particle.style.opacity = Math.random() * 0.5 + 0.3;

      container.appendChild(particle);
    }
  }

  // Create animated circuit-like lines
  function createCircuitLines(container) {
    const linesContainer = document.createElement('div');
    linesContainer.className = 'circuit-lines-container';
    linesContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    `;

    // Create SVG for circuit lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position: absolute; top: 0; left: 0;';

    // Create multiple circuit paths
    for (let i = 0; i < 8; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      
      // Generate random path
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = Math.random() * 100;
      const endY = Math.random() * 100;
      const cp1X = Math.random() * 100;
      const cp1Y = Math.random() * 100;
      const cp2X = Math.random() * 100;
      const cp2Y = Math.random() * 100;

      const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      
      path.setAttribute('d', pathData);
      path.setAttribute('stroke', 'rgba(139, 0, 0, 0.2)');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('fill', 'none');
      path.style.cssText = `
        stroke-dasharray: 5, 5;
        animation: dashMove ${5 + Math.random() * 5}s linear infinite;
      `;

      svg.appendChild(path);
    }

    linesContainer.appendChild(svg);
    container.appendChild(linesContainer);

    // Add CSS animation for dashed lines
    const style = document.createElement('style');
    style.textContent = `
      @keyframes dashMove {
        0% {
          stroke-dashoffset: 0;
        }
        100% {
          stroke-dashoffset: 100;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Add glowing points/nodes on the background
  function createGlowingNodes(container) {
    const nodeCount = 15;

    for (let i = 0; i < nodeCount; i++) {
      const node = document.createElement('div');
      node.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: #8B0000;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(139, 0, 0, 0.8), 0 0 40px rgba(139, 0, 0, 0.4);
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: nodePulse ${2 + Math.random() * 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;

      container.appendChild(node);
    }

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes nodePulse {
        0%, 100% {
          transform: scale(1);
          opacity: 0.6;
        }
        50% {
          transform: scale(1.5);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Mouse interaction - particles follow cursor
  function addMouseInteraction() {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Create temporary particle at cursor
      createCursorParticle(mouseX, mouseY);
    });
  }

  // Create particle at cursor position
  function createCursorParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: fixed;
      width: 4px;
      height: 4px;
      background: rgba(139, 0, 0, 0.6);
      border-radius: 50%;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      z-index: 9999;
      animation: cursorParticleFade 1s ease-out forwards;
    `;

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  // Add cursor particle animation
  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    @keyframes cursorParticleFade {
      0% {
        transform: translate(0, 0) scale(1);
        opacity: 1;
      }
      100% {
        transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(0);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(cursorStyle);

  // Parallax effect on scroll
  function addParallaxEffect() {
    const engineeringBg = document.querySelector('.engineering-background');
    if (!engineeringBg) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const shapes = engineeringBg.querySelectorAll('.engineering-shape');
          const particles = engineeringBg.querySelectorAll('.particle');

          shapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
          });

          particles.forEach((particle, index) => {
            const speed = 0.05 + (index % 3) * 0.05;
            particle.style.transform = `translateY(${scrolled * speed}px)`;
          });

          ticking = false;
        });

        ticking = true;
      }
    });
  }

  // Initialize everything when DOM is ready
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBackground);
    } else {
      initBackground();
    }
  }

  function initBackground() {
    createEngineeringBackground();
    
    // Add glowing nodes
    const engineeringBg = document.querySelector('.engineering-background');
    if (engineeringBg) {
      createGlowingNodes(engineeringBg);
    }

    // Add mouse interaction (optional - can be removed if too distracting)
    // addMouseInteraction();

    // Add parallax effect
    addParallaxEffect();

    console.log('✅ Engineering background system initialized');
  }

  // Start initialization
  init();

})();
