/* ============================================================================
   MOBILE CONTENT STUDIO HUB - JAVASCRIPT
   Interactive features and animations
   ============================================================================ */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Load real-time counts from JSON
        loadContentCounts();
        
        // Add touch feedback
        addTouchFeedback();
        
        // Animate stats
        animateStats();
        
        // Add section animations
        animateSections();
    }
    
    /**
     * Load content counts from JSON files (Mobile)
     * Ensures counts are always accurate after Manager uploads
     */
    async function loadContentCounts() {
        try {
            // Load all JSON files in parallel
            const [videosData, contentData, booksData, coursesData, papersData] = await Promise.all([
                fetch('../../Content Studio/video-content/videos.json').then(r => r.json()).catch(() => ({videos: [], videoGroups: []})),
                fetch('../../Content Code/content.json').then(r => r.json()).catch(() => ({'written-posts': []})),
                fetch('../../Content Studio/books-pdfs/books.json').then(r => r.json()).catch(() => ({books: []})),
                fetch('../../Content Studio/educational-videos/courses.json').then(r => r.json()).catch(() => ({courses: []})),
                fetch('../../Content Studio/research-papers/papers.json').then(r => r.json()).catch(() => ({papers: []}))
            ]);
            
            // Count videos from all categories
            let videoCount = 0;
            if (videosData.categories && typeof videosData.categories === 'object') {
                // Loop through each content type (video-blog, educational, etc.)
                Object.values(videosData.categories).forEach(contentType => {
                    if (contentType && typeof contentType === 'object') {
                        // Loop through each category within the content type
                        Object.values(contentType).forEach(category => {
                            if (category.videos && Array.isArray(category.videos)) {
                                videoCount += category.videos.length;
                            }
                        });
                    }
                });
            }
            
            const postCount = (contentData['written-posts'] || []).length;
            const bookCount = (booksData.books || []).length;
            const courseCount = (coursesData.courses || []).length;
            const paperCount = (papersData.papers || []).length;
            
            // Update stat numbers
            const statElements = document.querySelectorAll('.stat-number');
            statElements.forEach(el => {
                const type = el.getAttribute('data-type');
                let count = 0;
                
                switch(type) {
                    case 'videos': count = videoCount; break;
                    case 'posts': count = postCount; break;
                    case 'books': count = bookCount; break;
                    case 'papers': count = paperCount; break;
                    case 'courses': count = courseCount; break;
                }
                
                el.textContent = count;
            });
            
            console.log('📊 Mobile Hub Counts:', { videos: videoCount, posts: postCount, books: bookCount, papers: paperCount, courses: courseCount });
        } catch (error) {
            console.error('❌ Failed to load content counts:', error);
        }
    }
    
    /**
     * Add touch feedback to cards
     */
    function addTouchFeedback() {
        const cards = document.querySelectorAll('.content-card');
        
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transition = 'all 0.1s ease';
                
                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
            
            card.addEventListener('touchend', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }, { passive: true });
        });
    }
    
    /**
     * Animate stats numbers
     */
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const text = target.textContent;
                    const number = parseInt(text.replace('+', ''));
                    
                    if (!isNaN(number)) {
                        animateValue(target, 0, number, 1200);
                    }
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        stats.forEach(stat => {
            observer.observe(stat);
        });
    }
    
    /**
     * Animate a number from start to end
     */
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 16);
    }
    
    /**
     * Animate sections on scroll
     */
    function animateSections() {
        const sections = document.querySelectorAll('.mobile-section');
        
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
    
})();
