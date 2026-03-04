/* ============================================
   PREMIUM HOME PAGE - JAVASCRIPT
   A3KM Studio
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
    
    // ========== DYNAMIC STATS LOADING ==========
    async function loadDynamicStats() {
        try {
            const [projectsRes, certsRes, contentRes] = await Promise.all([
                fetch('../Projects Code/projects.json'),
                fetch('../About me/certificates-data.json'),
                fetch('../Content Code/content.json')
            ]);
            
            const [projects, certs, content] = await Promise.all([
                projectsRes.json(),
                certsRes.json(),
                contentRes.json()
            ]);
            
            // Update floating stat
            const projectCount = document.getElementById('projectCount');
            if (projectCount && projects.statistics?.totalProjects) {
                projectCount.setAttribute('data-count', projects.statistics.totalProjects);
            }
            
            // Update achievement cards
            const achCards = document.querySelectorAll('.achievement-number');
            achCards.forEach(card => {
                const parent = card.closest('.achievement-card');
                if (!parent) return;
                
                const label = parent.querySelector('.achievement-label').textContent.toLowerCase();
                if (label.includes('project') && projects.statistics?.totalProjects) {
                    card.setAttribute('data-count', projects.statistics.totalProjects);
                    card.textContent = '0';
                } else if (label.includes('certification') && certs.stats?.totalCertificates) {
                    card.setAttribute('data-count', certs.stats.totalCertificates);
                    card.textContent = '0';
                } else if (label.includes('video') && content.statistics?.totalContent) {
                    card.setAttribute('data-count', content.statistics.totalContent);
                    card.textContent = '0';
                }
            });
        } catch (e) {
            console.log('Stats: using static fallback values');
        }
    }
    
    // ========== COUNTER ANIMATION ==========
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        if (isNaN(target)) return;
        
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        element.textContent = '0';
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
    
    // ========== INTERSECTION OBSERVERS ==========
    
    // Achievement Cards Observer
    const achievementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.achievement-number[data-count]');
                numbers.forEach(num => animateCounter(num));
                achievementObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const achievementsSection = document.querySelector('.achievements-section');
    if (achievementsSection) {
        achievementObserver.observe(achievementsSection);
    }
    
    // Floating Stats Observer (Hero section)
    const floatingStatsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const floatingNumbers = entry.target.querySelectorAll('.floating-stat-number[data-count]');
                floatingNumbers.forEach(num => animateCounter(num));
                floatingStatsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero-premium');
    if (heroSection) {
        floatingStatsObserver.observe(heroSection);
    }
    
    // Skills Bars Observer
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-fill-premium');
                skillBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                });
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const skillsSection = document.querySelector('.skills-premium-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    // ========== SCROLL TO TOP BUTTON ==========
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Smooth scroll to top
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ========== SMOOTH PARALLAX EFFECT ==========
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax for hero section
                const hero = document.querySelector('.hero-premium');
                if (hero && scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
                    hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.4;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // ========== 3D TILT EFFECT FOR WORK CARDS ==========
    const workCards = document.querySelectorAll('.work-card');
    workCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
    
    // ========== LOAD STATS AND START ==========
    loadDynamicStats();
    
    // ========== CONSOLE BRANDING ==========
    console.log('%c🚀 A3KM Studio - Premium Home Page', 'font-size: 20px; font-weight: bold; color: #CC0000; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
    console.log('%cDeveloped with ❤️ by Md Akhinoor Islam', 'font-size: 12px; color: #888;');
});
