/* ============================================
   CONTENT STUDIO HUB - UNIFIED MANAGEMENT SYSTEM
   Handles: Blogs, Videos, Educational, Books, Research Papers
   ============================================ */

(function() {
  'use strict';

  // Configuration
  let CONFIG = {};

  // State Management
  const state = {
    allContent: [],
    filteredContent: [],
    activeType: 'all',
    activeTag: null,
    searchQuery: '',
    sortMethod: 'latest',
    currentPage: 1
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
      await loadConfig();
      await loadAllContent();
      setupEventListeners();
      updateCounts();
      renderContent();
      renderTagFilters();
    } catch (error) {
      console.error('Initialization error:', error);
      showError('Failed to load content. Please refresh the page.');
    }
  }

  async function loadConfig() {
    try {
      const response = await fetch('hub-config.json');
      CONFIG = await response.json();
    } catch (error) {
      console.error('Config loading error:', error);
      // Fallback config
      CONFIG = {
        contentTypes: {
          blog: { dataPath: 'written-posts/posts.json', viewerPath: 'written-posts/post-viewer.html', dataKey: 'posts' },
          video: { dataPath: 'video-content/videos.json', viewerPath: 'video-content/video-viewer.html', dataKey: 'videos' },
          educational: { dataPath: 'educational-videos/courses.json', viewerPath: 'educational-videos/course-viewer.html', dataKey: 'courses' },
          book: { dataPath: 'books-pdfs/books.json', viewerPath: 'books-pdfs/book-reader.html', dataKey: 'books' },
          research: { dataPath: 'research-papers/papers.json', viewerPath: 'research-papers/paper-viewer.html', dataKey: 'papers' }
        },
        settings: { itemsPerPage: 12, defaultSort: 'latest' }
      };
    }
  }

  /* ============================================
     CONTENT LOADING
     ============================================ */
  async function loadAllContent() {
    const typeKeys = Object.keys(CONFIG.contentTypes);
    const loadPromises = typeKeys.map(type => loadContentType(type));
    const results = await Promise.allSettled(loadPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        state.allContent.push(...result.value);
      } else {
        console.warn(`Failed to load ${typeKeys[index]}:`, result.reason);
      }
    });

    state.filteredContent = [...state.allContent];
  }

  async function loadContentType(type) {
    const typeConfig = CONFIG.contentTypes[type];
    if (!typeConfig) return [];

    try {
      const response = await fetch(typeConfig.dataPath);
      if (!response.ok) {
        console.warn(`Failed to load ${type}: ${response.statusText}`);
        return [];
      }
      
      const data = await response.json();
      const content = data[typeConfig.dataKey] || [];
      
      // Add type to each item
      return content.map(item => ({ ...item, type }));
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      return [];
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

  function handleTagClick(tag) {
    state.activeTag = state.activeTag === tag ? null : tag;
    applyFilters();
    updateActiveTag(tag);
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

    // Filter by tag
    if (state.activeTag) {
      filtered = filtered.filter(item => 
        item.tags && item.tags.includes(state.activeTag)
      );
    }

    // Enhanced search with fuzzy matching and multi-language support
    if (state.searchQuery) {
      filtered = filtered.filter(item => {
        const searchFields = [
          item.title,
          item.summary,
          item.tags ? item.tags.join(' ') : '',
          item.author || '',
          item.description || ''
        ].join(' ').toLowerCase();
        
        // Split search query into words for better matching
        const searchWords = state.searchQuery.toLowerCase().split(' ').filter(w => w.length > 0);
        
        // Multi-language support: Check for both English and Bangla content
        const hasBangla = /[\u0980-\u09FF]/.test(state.searchQuery);
        
        // Fuzzy matching: Match if any search word is found
        return searchWords.some(word => {
          // Exact match
          if (searchFields.includes(word)) return true;
          
          // Partial match (fuzzy)
          if (searchFields.indexOf(word) !== -1) return true;
          
          // Word boundary match for better accuracy
          const wordRegex = new RegExp(`\\b${word}`, 'i');
          if (wordRegex.test(searchFields)) return true;
          
          // Language-specific matching
          if (hasBangla && item.language === 'bn') return true;
          
          return false;
        });
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
     RENDERING
     ============================================ */
  function renderContent() {
    if (!elements.contentGrid) return;

    const { filteredContent } = state;

    if (filteredContent.length === 0) {
      elements.contentGrid.innerHTML = '';
      elements.noResults.style.display = 'block';
      return;
    }

    elements.noResults.style.display = 'none';
    elements.contentGrid.innerHTML = filteredContent.map(item => 
      renderCard(item)
    ).join('');

    // Add click listeners to cards
    document.querySelectorAll('.content-card').forEach(card => {
      card.addEventListener('click', () => handleCardClick(card.dataset.id, card.dataset.type));
    });
  }

  function renderCard(item) {
    const typeConfig = {
      blog: { icon: 'fa-pen-fancy', label: 'Blog Post' },
      video: { icon: 'fa-video', label: 'Video Blog' },
      educational: { icon: 'fa-chalkboard-teacher', label: 'Educational' },
      book: { icon: 'fa-book', label: 'Book' },
      research: { icon: 'fa-flask', label: 'Research' }
    };

    const config = typeConfig[item.type] || typeConfig.blog;
    const formattedDate = formatDate(item.date);

    return `
      <div class="content-card" data-id="${item.id}" data-type="${item.type}">
        <div class="content-type-badge ${item.type}">
          <i class="fas ${config.icon}"></i> ${config.label}
        </div>
        
        ${renderCardCover(item)}
        
        <div class="card-body">
          <h3 class="card-title">${escapeHTML(item.title)}</h3>
          <p class="card-summary">${escapeHTML(item.summary)}</p>
          
          <div class="card-meta">
            <span class="card-meta-item">
              <i class="fas fa-calendar"></i> ${formattedDate}
            </span>
            ${renderMetaInfo(item)}
          </div>
          
          ${renderTags(item.tags)}
          
          <button class="card-action">
            ${renderActionButton(item)}
          </button>
        </div>
      </div>
    `;
  }

  function renderCardCover(item) {
    const defaultImages = CONFIG.defaultImages || {
      blog: '../Content Storage/images/icons/default-blog.svg',
      video: '../Content Storage/images/icons/default-video.jpg',
      educational: '../Content Storage/images/icons/default-educational.jpg',
      book: '../Content Storage/images/icons/default-book.jpg',
      research: '../Content Storage/images/icons/default-research.jpg'
    };

    const imageSrc = item.coverImage || item.thumbnail || item.cover || defaultImages[item.type];

    if (item.type === 'video') {
      return `
        <div class="card-cover" style="background-image: url('${imageSrc}')">
          <div class="play-overlay">
            <div class="play-button">
              <i class="fas fa-play"></i>
            </div>
          </div>
        </div>
      `;
    }

    return `<img src="${imageSrc}" alt="${escapeHTML(item.title)}" class="card-cover" onerror="this.src='${defaultImages[item.type]}'">`;
  }

  function renderMetaInfo(item) {
    switch (item.type) {
      case 'blog':
        return `<span class="card-meta-item"><i class="fas fa-clock"></i> ${item.readTime} min</span>`;
      case 'video':
        return `<span class="card-meta-item"><i class="fas fa-play-circle"></i> ${item.duration}</span>`;
      case 'educational':
        return `<span class="card-meta-item"><i class="fas fa-list"></i> ${item.episodes} episodes</span>`;
      case 'book':
        return `<span class="card-meta-item"><i class="fas fa-file-pdf"></i> ${item.pages} pages</span>`;
      case 'research':
        return `<span class="card-meta-item"><i class="fas fa-university"></i> ${item.institution}</span>`;
      default:
        return '';
    }
  }

  function renderActionButton(item) {
    const actions = {
      blog: '<i class="fas fa-book-open"></i> Read Article',
      video: '<i class="fas fa-play"></i> Watch Video',
      educational: '<i class="fas fa-graduation-cap"></i> Start Course',
      book: '<i class="fas fa-download"></i> Download PDF',
      research: '<i class="fas fa-file-pdf"></i> View Paper'
    };

    return actions[item.type] || '<i class="fas fa-eye"></i> View';
  }

  function renderTags(tags) {
    if (!tags || tags.length === 0) return '';
    
    return `
      <div class="card-tags">
        ${tags.map(tag => `<span class="card-tag">${escapeHTML(tag)}</span>`).join('')}
      </div>
    `;
  }

  function renderTagFilters() {
    if (!elements.tagFilters) return;

    const allTags = new Set();
    state.allContent.forEach(item => {
      if (item.tags) {
        item.tags.forEach(tag => allTags.add(tag));
      }
    });

    const tagsHTML = Array.from(allTags).map(tag => 
      `<button class="tag-filter" data-tag="${tag}">${escapeHTML(tag)}</button>`
    ).join('');

    elements.tagFilters.innerHTML = `
      <span class="filter-label">Tags:</span>
      ${tagsHTML}
    `;

    // Add click listeners
    elements.tagFilters.querySelectorAll('.tag-filter').forEach(btn => {
      btn.addEventListener('click', () => handleTagClick(btn.dataset.tag));
    });
  }

  function updateActiveTag(tag) {
    elements.tagFilters.querySelectorAll('.tag-filter').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tag === tag && state.activeTag === tag);
    });
  }

  /* ============================================
     CARD INTERACTION
     ============================================ */
  function handleCardClick(id, type) {
    const typeConfig = CONFIG.contentTypes[type];
    if (!typeConfig) return;

    const viewerPath = typeConfig.viewerPath;
    if (viewerPath) {
      window.location.href = `${viewerPath}?id=${id}`;
    }
  }

  /* ============================================
     COUNTS UPDATE
     ============================================ */
  function updateCounts() {
    const counts = {
      all: state.allContent.length,
      blog: state.allContent.filter(i => i.type === 'blog').length,
      video: state.allContent.filter(i => i.type === 'video').length,
      educational: state.allContent.filter(i => i.type === 'educational').length,
      book: state.allContent.filter(i => i.type === 'book').length,
      research: state.allContent.filter(i => i.type === 'research').length
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
     START APPLICATION
     ============================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
