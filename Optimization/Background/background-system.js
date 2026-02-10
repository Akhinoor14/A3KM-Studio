/* ================================================
   PREMIUM PARTICLE SYSTEM v2.0
   Minimal, elegant, GPU-accelerated
   30-40 floating particles with smooth animation
   ================================================ */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        particleCount: 35,
        minSize: 1,
        maxSize: 3,
        minOpacity: 0.15,
        maxOpacity: 0.35,
        minSpeed: 0.1,
        maxSpeed: 0.4,
        colors: [
            'rgba(255, 255, 255, ',
            'rgba(255, 200, 200, ',
            'rgba(204, 0, 0, '
        ]
    };
    
    // Particle class
    class Particle {
        constructor(canvas) {
            this.canvas = canvas;
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
            this.speedX = (Math.random() - 0.5) * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed;
            this.speedY = (Math.random() - 0.5) * (CONFIG.maxSpeed - CONFIG.minSpeed) + CONFIG.minSpeed;
            this.opacity = CONFIG.minOpacity + Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity);
            this.colorBase = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
            this.color = this.colorBase + this.opacity + ')';
        }
        
        update() {
            // Move particle
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Wrap around edges
            if (this.x < 0) this.x = this.canvas.width;
            if (this.x > this.canvas.width) this.x = 0;
            if (this.y < 0) this.y = this.canvas.height;
            if (this.y > this.canvas.height) this.y = 0;
        }
        
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    // Particle System Manager
    class ParticleSystem {
        constructor(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                console.warn('Particle canvas not found');
                return;
            }
            
            this.ctx = this.canvas.getContext('2d', { alpha: true });
            this.particles = [];
            this.animationId = null;
            this.isTabVisible = true;
            
            this.init();
        }
        
        init() {
            // Set canvas size
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            // Create particles
            for (let i = 0; i < CONFIG.particleCount; i++) {
                this.particles.push(new Particle(this.canvas));
            }
            
            // Handle tab visibility for performance
            document.addEventListener('visibilitychange', () => {
                this.isTabVisible = !document.hidden;
                if (this.isTabVisible && !this.animationId) {
                    this.animate();
                } else if (!this.isTabVisible && this.animationId) {
                    cancelAnimationFrame(this.animationId);
                    this.animationId = null;
                }
            });
            
            // Check for reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion) {
                this.animate();
            } else {
                // Draw static particles for reduced motion
                this.drawStatic();
            }
        }
        
        resize() {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            
            // Reset particle positions after resize
            this.particles.forEach(particle => particle.reset());
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and draw particles
            this.particles.forEach(particle => {
                particle.update();
                particle.draw(this.ctx);
            });
            
            // Continue animation loop
            this.animationId = requestAnimationFrame(() => this.animate());
        }
        
        drawStatic() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach(particle => particle.draw(this.ctx));
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ParticleSystem('particles-canvas');
        });
    } else {
        new ParticleSystem('particles-canvas');
    }
    
})();
