/* ============================================
   CONTENT STUDIO HUB - CATEGORIZED VIDEO SYSTEM
   Video Blog: Tour, Daily Life, Poem, Sports, Others
   Educational: Arduino, SOLIDWORKS, Electronics, etc.
   ============================================ */

(function() {
  'use strict';

  // State Management
  const state = {
    allContent: [],
    videoCategories: {
      'video-blog': {},
      'educational': {}
    },
    filteredContent: [],
    activeType: 'all',
    activeTags: [],
    searchQuery: '',
    sortMethod: 'latest',
    expandedCategories: new Set()
  };

  // DOM Elements
  const elements = {
    contentGrid: document.getElementById('contentGrid'),
    searchInput: document.getElementById('studioSearch'),
    sortSelect: document.getElementById('sortBy'),
    tagFilters: document.getElementById('tagFilters'),
    noResults: document.getElementById('noResults'),
    typeButtons: document.querySelectorAll('.content-type-btn')
  };

  /* ============================================
     INITIALIZATION
     ============================================ */
  async function init() {
    try {
      await loadAllContent();
      setupEventListeners();
      
      // Check URL parameters for filtering
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      
      if (filter === 'video-blog') {
        // Show only video-blog content
        filterByVideoType('video-blog');
        console.log('🎥 Filtering: Video Blog only');
      } else if (filter === 'books-papers') {
        // Show only books and research papers
        filterByBooksAndPapers();
        console.log('📚 Filtering: Books & Papers only');
      }
      
      updateCounts();
      renderContent();
    } catch (error) {
      console.error('Initialization error:', error);
      showError('Failed to load content. Please refresh the page.');
    }
  }

  /* ============================================
     CONTENT LOADING
     ============================================ */
  async function loadAllContent() {
    // Load videos with categories
    await loadVideos();
    
    // Load other content types (blogs, books, research)
    loadBlogs();
    loadBooks();
    loadResearch();
    
    state.filteredContent = [...state.allContent];
  }

  function loadBlogs() {
    // Upcoming blog posts
    const upcomingBlogs = [
      {
        id: 'blog_upcoming_001',
        type: 'blog',
        title: 'Arduino দিয়ে শুরু - Complete Beginner Guide',
        description: 'Arduino নিয়ে কাজ শুরু করার জন্য বিস্তারিত গাইড',
        tags: ['arduino', 'tutorial', 'beginner'],
        locked: true
      },
      {
        id: 'blog_upcoming_002',
        type: 'blog',
        title: 'SOLIDWORKS Tips and Tricks - Professional Workflow',
        description: 'CAD design skill উন্নত করার পেশাদার টেকনিক',
        tags: ['solidworks', 'cad', 'engineering'],
        locked: true
      },
      {
        id: 'blog_upcoming_003',
        type: 'blog',
        title: 'Robotics and Automation এ আমার যাত্রা',
        description: 'Robotics projects এ শেখা অভিজ্ঞতা এবং চ্যালেঞ্জ',
        tags: ['robotics', 'automation', 'journey'],
        locked: true
      }
    ];
    state.allContent.push(...upcomingBlogs);
  }

  function loadBooks() {
    // Upcoming books/PDFs
    const upcomingBooks = [
      {
        id: 'book_upcoming_001',
        type: 'book',
        title: 'Arduino Programming Handbook - বাংলা সংস্করণ',
        description: 'Arduino programming এর সম্পূর্ণ guide ব্যবহারিক উদাহরণ সহ',
        tags: ['arduino', 'programming', 'handbook'],
        locked: true
      },
      {
        id: 'book_upcoming_002',
        type: 'book',
        title: 'Electronics Fundamentals - Student Edition',
        description: 'Electronics তত্ত্ব এবং প্রায়োগিক জ্ঞানের সংকলন',
        tags: ['electronics', 'theory', 'education'],
        locked: true
      }
    ];
    state.allContent.push(...upcomingBooks);
  }

  function loadResearch() {
    // Upcoming research papers
    const upcomingPapers = [
      {
        id: 'research_upcoming_001',
        type: 'research',
        title: 'Renewable Energy Systems - Comprehensive Study',
        description: 'আধুনিক renewable energy প্রযুক্তি এবং implementation বিশ্লেষণ',
        tags: ['renewable-energy', 'research', 'sustainability'],
        locked: true
      },
      {
        id: 'research_upcoming_002',
        type: 'research',
        title: 'IoT Applications in Smart Agriculture',
        description: 'কৃষি automation এ Internet of Things integration নিয়ে গবেষণা',
        tags: ['iot', 'agriculture', 'automation'],
        locked: true
      }
    ];
    state.allContent.push(...upcomingPapers);
  }

  function loadEducationalExamples() {
    // Upcoming educational videos
    const upcomingEducational = [
      // Arduino
      {
        id: 'edu_arduino_upcoming_001',
        type: 'educational',
        category: 'arduino',
        categoryName: 'Arduino Projects',
        title: 'Arduino LED Matrix Display Tutorial',
        description: 'Arduino দিয়ে LED matrix display তৈরির complete guide',
        duration: '15:30',
        tags: ['arduino', 'led', 'display', 'tutorial'],
        language: 'bn-en',
        videoId: 'upcoming_arduino_1',
        thumbnail: 'https://via.placeholder.com/1280x720/CC0000/FFFFFF?text=Arduino+LED+Matrix',
        locked: true
      },
      {
        id: 'edu_arduino_upcoming_002',
        type: 'educational',
        category: 'arduino',
        categoryName: 'Arduino Projects',
        title: 'IoT Home Automation with Arduino',
        description: 'Arduino এবং IoT দিয়ে complete home automation system',
        duration: '22:45',
        tags: ['arduino', 'iot', 'automation', 'smart-home'],
        language: 'bn',
        videoId: 'upcoming_arduino_2',
        thumbnail: 'https://via.placeholder.com/1280x720/990000/FFFFFF?text=Arduino+IoT',
        locked: true
      },
      // SOLIDWORKS
      {
        id: 'edu_solidworks_upcoming_001',
        type: 'educational',
        category: 'solidworks',
        categoryName: 'SOLIDWORKS CAD',
        title: '3D Modeling - Mechanical Parts Design',
        description: 'SOLIDWORKS এ professional mechanical component design techniques',
        duration: '18:20',
        tags: ['solidworks', 'cad', 'mechanical', '3d-modeling'],
        language: 'bn-en',
        videoId: 'upcoming_solidworks_1',
        thumbnail: 'https://via.placeholder.com/1280x720/CC0033/FFFFFF?text=SOLIDWORKS+CAD',
        locked: true
      },
      // Electronics
      {
        id: 'edu_electronics_upcoming_001',
        type: 'educational',
        category: 'electronics',
        categoryName: 'Electronics',
        title: 'PCB Design Fundamentals - Complete Course',
        description: 'শুরু থেকে professional PCB design শেখার guide',
        duration: '20:15',
        tags: ['pcb', 'electronics', 'design', 'circuit'],
        language: 'bn',
        videoId: 'upcoming_electronics_1',
        thumbnail: 'https://via.placeholder.com/1280x720/FF0000/FFFFFF?text=PCB+Design',
        locked: true
      },
      // Programming
      {
        id: 'edu_programming_upcoming_001',
        type: 'educational',
        category: 'programming',
        categoryName: 'Programming',
        title: 'Python for Engineers - Complete Course',
        description: 'Engineering students দের জন্য comprehensive Python programming course',
        duration: '35:00',
        tags: ['python', 'programming', 'engineering', 'course'],
        language: 'bn-en',
        videoId: 'upcoming_programming_1',
        thumbnail: 'https://via.placeholder.com/1280x720/CC0000/FFFFFF?text=Python+Course',
        locked: true
      },
      // Engineering
      {
        id: 'edu_engineering_upcoming_001',
        type: 'educational',
        category: 'engineering',
        categoryName: 'Engineering Concepts',
        title: 'Renewable Energy Systems Design',
        description: 'Renewable energy system design এবং analysis এর engineering principles',
        duration: '25:40',
        tags: ['engineering', 'renewable-energy', 'design', 'systems'],
        language: 'bn',
        videoId: 'upcoming_engineering_1',
        thumbnail: 'https://via.placeholder.com/1280x720/990000/FFFFFF?text=Renewable+Energy',
        locked: true
      }
    ];

    // Add to educational categories
    upcomingEducational.forEach(video => {
      const catKey = video.category;
      
      // Initialize category if it doesn't exist
      if (!state.videoCategories.educational[catKey]) {
        const categoryData = {
          arduino: { name: 'Arduino Projects', icon: 'fas fa-microchip', description: 'Arduino tutorials, embedded systems, IoT projects' },
          solidworks: { name: 'SOLIDWORKS CAD', icon: 'fas fa-cube', description: '3D modeling, mechanical design tutorials' },
          electronics: { name: 'Electronics', icon: 'fas fa-bolt', description: 'Circuit design, PCB, electronics fundamentals' },
          programming: { name: 'Programming', icon: 'fas fa-code', description: 'Coding tutorials, web development, algorithms' },
          engineering: { name: 'Engineering Concepts', icon: 'fas fa-cogs', description: 'Engineering theory, concepts, problem solving' }
        };
        
        state.videoCategories.educational[catKey] = {
          ...categoryData[catKey],
          type: 'educational',
          categoryKey: catKey
        };
      }
      
      state.allContent.push(video);
    });
  }

  async function loadVideos() {
    try {
      const response = await fetch('video-content/videos.json');
      if (!response.ok) {
        console.warn('Failed to load videos');
        return;
      }
      
      const data = await response.json();
      
      // Process categorized videos
      if (data.categories) {
        // Video Blog categories
        Object.entries(data.categories['video-blog']).forEach(([catKey, catData]) => {
          if (catData.videos && catData.videos.length > 0) {
            state.videoCategories['video-blog'][catKey] = {
              ...catData,
              type: 'video-blog',
              categoryKey: catKey
            };
            // Add videos to allContent with enhanced metadata
            catData.videos.forEach(video => {
              state.allContent.push({
                ...video,
                type: 'video-blog',
                category: catKey,
                categoryName: catData.name,
                thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
              });
            });
          }
        });
        
        // Educational categories
        Object.entries(data.categories.educational).forEach(([catKey, catData]) => {
          if (catData.videos && catData.videos.length > 0) {
            state.videoCategories.educational[catKey] = {
              ...catData,
              type: 'educational',
              categoryKey: catKey
            };
            // Add videos to allContent
            catData.videos.forEach(video => {
              state.allContent.push({
                ...video,
                type: 'educational',
                category: catKey,
                categoryName: catData.name,
                thumbnail: video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
              });
            });
          }
        });
      }
      
      // Add example locked educational videos
      loadEducationalExamples();
      
      console.log('✅ Loaded videos:', state.allContent.length);
      console.log('📁 Video Blog categories:', Object.keys(state.videoCategories['video-blog']).length);
      console.log('🎓 Educational categories:', Object.keys(state.videoCategories.educational).length);
      
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }

  /* ============================================
     EVENT LISTENERS
     ============================================ */
  function setupEventListeners() {
    // Type filter buttons
    elements.typeButtons.forEach(btn => {
      btn.addEventListener('click', handleTypeFilter);
    });

    // Search input
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Sort select
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', handleSort);
    }
  }

  function handleTypeFilter(e) {
    const type = e.currentTarget.dataset.type;
    state.activeType = type;

    // Update active button
    elements.typeButtons.forEach(btn => btn.classList.remove('active'));
    e.currentTarget.classList.add('active');

    applyFilters();
  }

  function handleSearch(e) {
    state.searchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  }

  function handleSort(e) {
    state.sortMethod = e.target.value;
    sortContent();
    renderContent();
  }

  function handleCategoryToggle(mainType, categoryKey) {
    const key = `${mainType}/${categoryKey}`;
    if (state.expandedCategories.has(key)) {
      state.expandedCategories.delete(key);
    } else {
      state.expandedCategories.add(key);
    }
    renderContent();
  }

  /* ============================================
     FILTERING & SORTING
     ============================================ */
  function applyFilters() {
    let filtered = [...state.allContent];

    // Filter by type
    if (state.activeType !== 'all') {
      filtered = filtered.filter(item => item.type === state.activeType);
    }

    // Search filter
    if (state.searchQuery) {
      filtered = filtered.filter(item => {
        const searchFields = [
          item.title,
          item.description || '',
          item.categoryName || '',
          item.tags ? item.tags.join(' ') : ''
        ].join(' ').toLowerCase();
        
        return searchFields.includes(state.searchQuery);
      });
    }

    state.filteredContent = filtered;
    sortContent();
    renderContent();
  }

  function sortContent() {
    const { sortMethod, filteredContent } = state;

    switch (sortMethod) {
      case 'latest':
        filteredContent.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filteredContent.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'title':
        filteredContent.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        filteredContent.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
  }

  /* ============================================
     RENDERING - CATEGORIZED VIEW
     ============================================ */
  function renderContent() {
    if (!elements.contentGrid) return;

    const { filteredContent, activeType } = state;

    if (filteredContent.length === 0) {
      elements.contentGrid.innerHTML = '';
      elements.noResults.style.display = 'block';
      return;
    }

    elements.noResults.style.display = 'none';

    // Render based on active type
    if (activeType === 'video-blog') {
      renderCategorizedVideos('video-blog');
    } else if (activeType === 'educational') {
      renderCategorizedVideos('educational');
    } else if (activeType === 'all') {
      renderAllContentCategorized();
    } else {
      // Other content types (blogs, books, research) - regular grid
      renderRegularGrid(filteredContent);
    }
  }

  function renderCategorizedVideos(mainType) {
    const categories = state.videoCategories[mainType];
    const filteredCategories = Object.entries(categories).filter(([catKey, catData]) => {
      // Check if category has filtered videos
      const categoryVideos = state.filteredContent.filter(v => 
        v.type === mainType && v.category === catKey
      );
      return categoryVideos.length > 0;
    });

    if (filteredCategories.length === 0) {
      elements.contentGrid.innerHTML = '<div class="loading"><i class="fas fa-inbox"></i><span>No videos in this section</span></div>';
      return;
    }

    const html = filteredCategories.map(([catKey, catData]) => {
      const categoryVideos = state.filteredContent.filter(v => 
        v.type === mainType && v.category === catKey
      );
      
      const isExpanded = state.expandedCategories.has(`${mainType}/${catKey}`);
      
      return renderCategoryGroup(mainType, catKey, catData, categoryVideos, isExpanded);
    }).join('');

    elements.contentGrid.innerHTML = html;

    // Add event listeners
    attachCategoryListeners();
  }

  function renderAllContentCategorized() {
    let html = '';
    
    // Video Blog section
    const videoBlogCategories = Object.entries(state.videoCategories['video-blog']);
    if (videoBlogCategories.length > 0) {
      html += '<div class="section-divider"><h2><i class="fas fa-video"></i> Video Blog</h2></div>';
      videoBlogCategories.forEach(([catKey, catData]) => {
        const categoryVideos = state.filteredContent.filter(v => 
          v.type === 'video-blog' && v.category === catKey
        );
        if (categoryVideos.length > 0) {
          const isExpanded = state.expandedCategories.has(`video-blog/${catKey}`);
          html += renderCategoryGroup('video-blog', catKey, catData, categoryVideos, isExpanded);
        }
      });
    }
    
    // Educational section
    const educationalCategories = Object.entries(state.videoCategories.educational);
    if (educationalCategories.length > 0) {
      html += '<div class="section-divider"><h2><i class="fas fa-graduation-cap"></i> Educational</h2></div>';
      educationalCategories.forEach(([catKey, catData]) => {
        const categoryVideos = state.filteredContent.filter(v => 
          v.type === 'educational' && v.category === catKey
        );
        if (categoryVideos.length > 0) {
          const isExpanded = state.expandedCategories.has(`educational/${catKey}`);
          html += renderCategoryGroup('educational', catKey, catData, categoryVideos, isExpanded);
        }
      });
    }
    
    elements.contentGrid.innerHTML = html;
    attachCategoryListeners();
  }

  function renderCategoryGroup(mainType, catKey, catData, videos, isExpanded) {
    return `
      <div class="category-group ${isExpanded ? 'expanded' : ''}" data-main-type="${mainType}" data-category="${catKey}">
        <div class="category-header" data-toggle="${mainType}/${catKey}">
          <div class="category-header-left">
            <i class="${catData.icon}"></i>
            <div class="category-info">
              <h3 class="category-name">${catData.name}</h3>
              <p class="category-description">${catData.description}</p>
            </div>
          </div>
          <div class="category-header-right">
            <span class="category-count">${videos.length} video${videos.length > 1 ? 's' : ''}</span>
            <i class="fas fa-chevron-down category-toggle-icon"></i>
          </div>
        </div>
        
        <div class="category-content">
          <div class="content-grid-inner">
            ${videos.map(video => renderVideoCard(video)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderVideoCard(video) {
    const formattedDate = formatDate(video.date);
    const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
    
    const lockedClass = video.locked ? 'locked-card' : '';
    const lockedOverlay = video.locked ? `
      <div class="locked-overlay">
        <div class="lock-icon">
          <i class="fas fa-lock"></i>
        </div>
        <div class="lock-text">Releasing Soon</div>
      </div>
    ` : '';
    
    return `
      <div class="content-card video-card ${lockedClass}" data-video-id="${video.videoId}" ${video.locked ? 'data-locked="true"' : ''}>
        <div class="card-cover" style="background-image: url('${thumbnailUrl}')">
          <div class="play-overlay">
            <div class="play-button">
              <i class="fas fa-play"></i>
            </div>
          </div>
          ${video.duration ? `<span class="video-duration">${video.duration}</span>` : ''}
        </div>
        
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(video.title)}</h3>
          ${video.description ? `<p class="card-summary">${escapeHTML(video.description.substring(0, 120))}...</p>` : ''}
          
          <div class="card-meta">
            <span class="card-meta-item">
              <i class="fas fa-calendar"></i> ${formattedDate}
            </span>
            <span class="card-meta-item">
              <i class="fas fa-eye"></i> ${video.views || 0} views
            </span>
          </div>
          
          ${renderTags(video.tags)}
        </div>
        ${lockedOverlay}
      </div>
    `;
  }

  function renderRegularGrid(content) {
    elements.contentGrid.innerHTML = `
      <div class="content-grid-inner">
        ${content.map(item => renderCard(item)).join('')}
      </div>
    `;
  }

  function renderCard(item) {
    // Generic card for blogs, books, research
    const typeIcons = {
      blog: 'fa-pen-fancy',
      book: 'fa-book',
      research: 'fa-flask'
    };
    
    const lockedClass = item.locked ? 'locked-card' : '';
    const lockedOverlay = item.locked ? `
      <div class="locked-overlay">
        <div class="lock-icon">
          <i class="fas fa-lock"></i>
        </div>
        <div class="lock-text">Releasing Soon</div>
      </div>
    ` : '';
    
    return `
      <div class="content-card ${lockedClass}" data-id="${item.id}" data-type="${item.type}" ${item.locked ? 'data-locked="true"' : ''}>
        <div class="content-type-badge ${item.type}">
          <i class="fas ${typeIcons[item.type]}"></i>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(item.title)}</h3>
          <p class="card-summary">${escapeHTML(item.summary || item.description || '')}</p>
          ${!item.locked && item.date ? `
          <div class="card-meta">
            <span class="card-meta-item">
              <i class="fas fa-calendar"></i> ${formatDate(item.date)}
            </span>
          </div>
          ` : ''}
          ${renderTags(item.tags)}
        </div>
        ${lockedOverlay}
      </div>
    `;
  }

  function renderTags(tags) {
    if (!tags || tags.length === 0) return '';
    
    return `
      <div class="card-tags">
        ${tags.map(tag => `<span class="card-tag">${escapeHTML(tag)}</span>`).join('')}
      </div>
    `;
  }

  function attachCategoryListeners() {
    // Category header toggle
    document.querySelectorAll('.category-header').forEach(header => {
      header.addEventListener('click', (e) => {
        const toggleKey = header.dataset.toggle;
        if (toggleKey) {
          const [mainType, catKey] = toggleKey.split('/');
          handleCategoryToggle(mainType, catKey);
        }
      });
    });

    // Video card click
    document.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        // Don't open if locked
        if (card.dataset.locked === 'true') return;
        
        const videoId = card.dataset.videoId;
        openYouTubeVideo(videoId);
      });
    });
  }

  function openYouTubeVideo(videoId) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  }

  /* ============================================
     COUNTS UPDATE
     ============================================ */
  function updateCounts() {
    const counts = {
      all: state.allContent.length,
      'video-blog': state.allContent.filter(i => i.type === 'video-blog').length,
      educational: state.allContent.filter(i => i.type === 'educational').length,
      blog: 0, // TODO: Load blogs
      book: 0, // TODO: Load books
      research: 0 // TODO: Load research
    };

    Object.keys(counts).forEach(type => {
      const countEl = document.getElementById(`count-${type}`);
      if (countEl) {
        countEl.textContent = counts[type];
      }
    });
  }

  /* ============================================
     UTILITY FUNCTIONS
     ============================================ */
  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function showError(message) {
    if (elements.contentGrid) {
      elements.contentGrid.innerHTML = `
        <div class="loading">
          <i class="fas fa-exclamation-triangle"></i>
          <span>${message}</span>
        </div>
      `;
    }
  }

  /* ============================================
     URL FILTERING FUNCTIONS
     ============================================ */
  function filterByVideoType(videoType) {
    // Filter to show only specified video type (video-blog or educational)
    state.filteredContent = state.allContent.filter(item => {
      if (item.type === 'video' && item.videoType === videoType) {
        return true;
      }
      return false;
    });
    
    // Set active type to video
    state.activeType = 'video';
    
    // Update UI to show video tab as active
    elements.typeButtons.forEach(btn => {
      if (btn.dataset.type === 'video') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function filterByBooksAndPapers() {
    // Filter to show only books and research papers
    state.filteredContent = state.allContent.filter(item => {
      return item.type === 'book' || item.type === 'research';
    });
    
    // Set active type to show both
    state.activeType = 'all';
    
    // Update UI
    elements.typeButtons.forEach(btn => {
      if (btn.dataset.type === 'all') {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
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
