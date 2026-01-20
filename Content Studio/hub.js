/* ============================================
   CONTENT STUDIO HUB - CARD COUNT LOADER
   Loads counts for 5 content type cards
   ============================================ */

(function() {
  'use strict';

  // Configuration - Load metadata from viewer folders
  const CONFIG = {
    contentTypes: {
      blog: { dataPath: 'written-posts/posts.json', dataKey: 'posts' },
      'video-blog': { dataPath: 'video-content/videos.json', dataKey: 'videos' },
      educational: { dataPath: 'educational-videos/courses.json', dataKey: 'courses' },
      book: { dataPath: 'books-pdfs/books.json', dataKey: 'books' },
      research: { dataPath: 'research-papers/papers.json', dataKey: 'papers' }
    }
  };

  /* ============================================
     INITIALIZATION
     ============================================ */
  async function init() {
    try {
      await loadAllCounts();
    } catch (error) {
      console.error('Count loading error:', error);
    }
  }

  /* ============================================
     COUNT LOADING
     ============================================ */
  async function loadAllCounts() {
    const typeKeys = Object.keys(CONFIG.contentTypes);
    const loadPromises = typeKeys.map(type => loadCount(type));
    await Promise.allSettled(loadPromises);
  }

  async function loadCount(type) {
    const typeConfig = CONFIG.contentTypes[type];
    if (!typeConfig) return;

    try {
      const response = await fetch(typeConfig.dataPath);
      if (!response.ok) {
        console.warn(`Failed to load ${type} count`);
        updateCountBadge(type, 0);
        return;
      }
      
      const data = await response.json();
      let count = 0;
      
      // Handle different data structures
      if (type === 'video-blog') {
        // Video blogs have nested categories
        const categories = data.categories?.['video-blog'] || {};
        count = Object.values(categories).reduce((total, category) => {
          return total + (category.videos?.length || 0);
        }, 0);
      } else {
        // Other types have flat arrays
        const items = data[typeConfig.dataKey] || [];
        count = items.length;
      }
      
      updateCountBadge(type, count);
      console.log(`✅ ${type}: ${count} items`);
      
    } catch (error) {
      console.warn(`Error loading ${type} count:`, error);
      updateCountBadge(type, 0);
    }
  }

  function updateCountBadge(type, count) {
    // Update desktop count badge
    const countElement = document.getElementById(`count-${type}`);
    if (countElement) {
      countElement.textContent = count;
    }
    
    // Update mobile count badge (if on mobile page)
    const mobileCountElement = document.getElementById(`count-${type}-mobile`);
    if (mobileCountElement) {
      mobileCountElement.textContent = count;
    }
  }

  /* ============================================
     START APPLICATION
     ============================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
