/* ============================================================================
   MOBILE ABOUT PAGE - JAVASCRIPT
   Interactive features
   ============================================================================ */

(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Add fade-in animation to sections
        animateSections();
        
        // Add smooth scroll for anchor links
        smoothScrollToAnchors();
        
        // Initialize club toggle function globally
        window.toggleClub = toggleClub;
    }
    
    /**
     * Toggle club description expansion
     */
    function toggleClub(clubId) {
        const card = document.querySelector(`[data-club-id="${clubId}"]`);
        if (!card) return;
        
        const preview = card.querySelector('.club-preview');
        const full = card.querySelector('.club-full');
        const btn = card.querySelector('.btn-see-more');
        
        if (full.style.display === 'none' || !full.style.display) {
            // Expand
            preview.style.display = 'none';
            full.style.display = 'block';
            btn.innerHTML = '<i class="fas fa-chevron-up"></i> See Less';
        } else {
            // Collapse
            preview.style.display = 'block';
            full.style.display = 'none';
            btn.innerHTML = '<i class="fas fa-chevron-down"></i> See More';
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }
    
    /**
     * Animate sections on scroll
     */
    function animateSections() {
        const sections = document.querySelectorAll('.mobile-section, .education-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    /**
     * Smooth scroll to anchor links
     */
    function smoothScrollToAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    const offset = 20; // Offset from top
                    const targetPosition = targetElement.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
})();
