/*
============================================================================
PREMIUM HOME PAGE SCRIPTS
Created: March 4, 2026
Author: Md Akhinoor Islam
Description: Dynamic stats counter, skills animation, scroll effects, and AOS integration
============================================================================
*/

(function() {
    'use strict';

    // ========== INITIALIZE AOS (Animate On Scroll) ==========
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 0,
                anchorPlacement: 'top-bottom',
            });
            console.log('✅ AOS Animations Initialized');
        } else {
            console.warn('⚠️ AOS library not loaded');
        }
    }

    // ========== DYNAMIC STATS COUNTER ==========
    let statsAnimated = false;

    function animateCounter(element, target, isDecimal = false) {
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60 FPS
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (isDecimal) {
                element.textContent = current.toFixed(2);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function loadDynamicStats() {
        const defaults = {
            projects: 66,
            certifications: 10,
            videos: 8,
            gpa: 5.00
        };

        // Try to fetch from JSON files
        Promise.all([
            fetch('../Projects Code/projects.json').then(r => r.json()).catch(() => null),
            fetch('../About me/certificates-data.json').then(r => r.json()).catch(() => null),
            fetch('../Content Code/content.json').then(r => r.json()).catch(() => null)
        ]).then(([projectsData, certsData, contentData]) => {
            const stats = {
                projects: projectsData?.statistics?.totalProjects || defaults.projects,
                certifications: certsData?.categories?.Academic?.certificates?.length || defaults.certifications,
                videos: contentData?.statistics?.byCategory?.['video-blogs'] || defaults.videos,
                gpa: defaults.gpa
            };

            // Update stat cards with fetched data
            const statNumbers = document.querySelectorAll('.stat-number');
            if (statNumbers.length >= 4) {
                statNumbers[0].dataset.target = stats.projects;
                statNumbers[1].dataset.target = stats.certifications;
                statNumbers[2].dataset.target = stats.videos;
                statNumbers[3].dataset.target = stats.gpa;
            }

            console.log('✅ Dynamic Stats Loaded:', stats);
        }).catch(error => {
            console.warn('⚠️ Using default stats values:', error);
        });
    }

    function initStatsCounter() {
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    
                    const statNumbers = document.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseFloat(stat.dataset.target);
                        const isDecimal = target % 1 !== 0;
                        animateCounter(stat, target, isDecimal);
                    });

                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(statsSection);
    }

    // ========== ANIMATED SKILLS PROGRESS BARS ==========
    let skillsAnimated = false;

    function initSkillsAnimation() {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    skillsAnimated = true;
                    
                    const skillBars = document.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        const progress = bar.dataset.progress;
                        setTimeout(() => {
                            bar.style.setProperty('--progress-width', progress + '%');
                            bar.style.width = progress + '%';
                            bar.classList.add('animated');
                        }, index * 150); // Stagger animation
                    });

                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillsSection);
    }

    // ========== SCROLL TO TOP BUTTON ==========
    function initScrollToTop() {
        const scrollBtn = document.getElementById('scrollToTop');
        if (!scrollBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== SCROLL PROGRESS BAR ==========
    function initScrollProgress() {
        const progressBar = document.getElementById('scrollProgressBar');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // ========== PARALLAX SCROLL EFFECT ==========
    function initParallax() {
        const hero = document.querySelector('.premium-hero');
        if (!hero) return;

        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const heroContent = hero.querySelector('.hero-content');
                    
                    if (heroContent && scrolled < 800) {
                        const parallaxSpeed = 0.3;
                        heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ========== 3D TILT EFFECT ON PROJECT CARDS ==========
    function init3DTilt() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ========== TIMELINE DOT PULSE ON SCROLL ==========
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease-out';
            observer.observe(item);
        });
    }

    // ========== ENHANCE EXPERTISE CARDS HOVER ==========
    function initExpertiseCards() {
        const expertiseCards = document.querySelectorAll('.expertise-card');
        
        expertiseCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.expertise-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.15) rotate(10deg)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.expertise-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }

    // ========== SMOOTH SCROLL TO SECTIONS ==========
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ========== TYPING EFFECT FOR HERO SUBTITLE ==========
    function initTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach(element => {
            const text = element.dataset.text || element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-red)';
            element.style.paddingRight = '5px';
            element.style.animation = 'blink 0.7s step-end infinite';
            
            let index = 0;
            const speed = 50; // milliseconds per character
            
            function typeChar() {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeChar, speed);
                } else {
                    // Remove cursor after typing completes
                    setTimeout(() => {
                        element.style.borderRight = 'none';
                        element.style.animation = 'none';
                    }, 500);
                }
            }
            
            // Start typing after a short delay
            setTimeout(typeChar, 1000);
        });
    }

    // Add CSS for blinking cursor
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-color: var(--primary-red); }
            51%, 100% { border-color: transparent; }
        }
    `;
    document.head.appendChild(style);

    // ========== CONSOLE WELCOME MESSAGE ==========
    function showWelcomeMessage() {
        const consoleStyle = 'color: #CC0000; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(204, 0, 0, 0.5);';
        console.log('%c🚀 A3KM Studio - Premium Home Page', consoleStyle);
        console.log('%c✨ Engineering · Education · Innovation', 'color: #fff; font-size: 12px;');
        console.log('%c📊 Dynamic Stats | 🎨 AOS Animations | ⚡ Premium Features', 'color: #888; font-size: 11px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #CC0000;');
    }

    // ========== MAIN INITIALIZATION ==========
    function init() {
        // Show welcome message
        showWelcomeMessage();
        
        // Core initializations
        loadDynamicStats();
        initAOS();
        initStatsCounter();
        initSkillsAnimation();
        initScrollToTop();
        initScrollProgress();
        initParallax();
        init3DTilt();
        initTimelineAnimation();
        initExpertiseCards();
        initSmoothScroll();
        initTypingEffect();
        
        console.log('✅ All premium features initialized successfully');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Refresh AOS on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 250);
    });

})();
