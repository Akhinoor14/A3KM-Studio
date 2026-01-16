/**
 * Documentation Markdown Loader
 * Dynamically loads language-specific markdown and enhances the page
 */

// Configuration
const MARKDOWN_FILES = {
  en: 'portfolio-documentation-en.md',
  bn: 'portfolio-documentation-bn.md',
};
let currentLanguage = 'en';

// Enhanced features
let searchIndex = [];
let readingProgress = 0;

/**
 * Initialize documentation loader on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('📚 Documentation Loader Initialized');

  // Initialize language (URL param > localStorage > default 'en')
  initLanguage();

  // Initialize language toggle UI
  setupLanguageToggle();

  // Always load documentation on this page
  await loadMarkdownDocumentation();

  // Initialize enhancements regardless
  initializeEnhancements();
});

/**
 * Load and parse markdown documentation
 */
async function loadMarkdownDocumentation(preserveScrollPercent = null) {
  try {
    console.log('⏳ Loading markdown documentation...');
    const mdFile = getMarkdownFile();
    console.log(`🌐 Language: ${currentLanguage} | File: ${mdFile}`);

    // If preserving scroll, capture current percent before reload
    const preScrollPercent = preserveScrollPercent ?? getScrollPercent();

    // Fetch markdown file
    const response = await fetch(mdFile, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Failed to load: ${response.status}`);
    }
    
    const markdownText = await response.text();
    console.log(`✅ Loaded ${markdownText.length} characters`);
    
    // Parse markdown to HTML (using a simple parser for now)
    const htmlContent = parseMarkdownToHTML(markdownText);
    
    // Inject into page
    const contentContainer = document.querySelector('.doc-content');
    if (contentContainer) {
      contentContainer.innerHTML = htmlContent;
      console.log('✅ Markdown content injected');
      
      // Structure document into sections for search/navigation
      structureDocument();
      
      // Re-highlight code blocks
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
      }
      
      // Rebuild search index
      buildSearchIndex();

      // Restore scroll position approximately
      if (preScrollPercent !== null && !isNaN(preScrollPercent)) {
        restoreScrollPercent(preScrollPercent);
      }

      // Calculate reading time after content loads
      if (typeof calculateReadingTime === 'function') {
        calculateReadingTime();
      }
    }
    
  } catch (error) {
    console.error('❌ Error loading markdown:', error);
    showNotification('Failed to load documentation. Please try again.', 'error');
  }
}

/**
 * Determine file based on current language
 */
function getMarkdownFile() {
  return MARKDOWN_FILES[currentLanguage] || MARKDOWN_FILES.en;
}

/**
 * Initialize language from URL or localStorage
 */
function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const stored = localStorage.getItem('docLang');
  const lang = (urlLang || stored || 'en').toLowerCase();
  setLanguage(['en', 'bn'].includes(lang) ? lang : 'en', { skipReload: true });
}

/**
 * Set language and optionally reload docs preserving scroll
 */
async function setLanguage(lang, options = {}) {
  const { skipReload = false } = options;
  if (currentLanguage === lang && skipReload) return;
  
  // Capture current visible heading BEFORE switching
  const currentHeading = getCurrentVisibleHeading();
  
  currentLanguage = lang;
  localStorage.setItem('docLang', currentLanguage);
  updateLanguageToggleState();

  if (!skipReload) {
    // Update URL param without reloading page
    const url = new URL(window.location.href);
    url.searchParams.set('lang', currentLanguage);
    history.replaceState({}, '', url.toString());
    
    // Load new language doc
    await loadMarkdownDocumentation();
    
    // Scroll to same heading in new language (heading-based sync)
    if (currentHeading) {
      scrollToMatchingHeading(currentHeading);
    }
  }
}

/**
 * Get currently visible heading (for heading-based language sync)
 */
function getCurrentVisibleHeading() {
  const headings = Array.from(document.querySelectorAll('.doc-content h1, .doc-content h2, .doc-content h3'));
  const viewportMiddle = window.scrollY + window.innerHeight / 2;
  
  // Find heading closest to viewport middle (above it)
  let closestHeading = null;
  let closestDistance = Infinity;
  
  for (const heading of headings) {
    const rect = heading.getBoundingClientRect();
    const headingTop = window.scrollY + rect.top;
    
    if (headingTop <= viewportMiddle) {
      const distance = viewportMiddle - headingTop;
      if (distance < closestDistance) {
        closestDistance = distance;
        closestHeading = heading;
      }
    }
  }
  
  if (closestHeading) {
    // Extract normalized text (remove special chars, lowercase for matching)
    return normalizeHeadingText(closestHeading.textContent);
  }
  return null;
}

/**
 * Scroll to matching heading in newly loaded document
 */
function scrollToMatchingHeading(targetText) {
  const headings = Array.from(document.querySelectorAll('.doc-content h1, .doc-content h2, .doc-content h3'));
  
  // Find matching heading by normalized text
  for (const heading of headings) {
    const headingText = normalizeHeadingText(heading.textContent);
    if (headingText === targetText) {
      // Scroll to this heading with offset for fixed header
      const offset = 80; // Account for fixed topbar
      const top = heading.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      console.log(`✅ Scrolled to matching heading: "${heading.textContent}"`);
      return;
    }
  }
  
  // Fallback: if no exact match, try partial match
  for (const heading of headings) {
    const headingText = normalizeHeadingText(heading.textContent);
    if (headingText.includes(targetText) || targetText.includes(headingText)) {
      const offset = 80;
      const top = heading.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      console.log(`⚠️ Partial match scroll: "${heading.textContent}"`);
      return;
    }
  }
  
  console.warn('⚠️ No matching heading found, staying at top');
}

/**
 * Normalize heading text for cross-language matching
 */
function normalizeHeadingText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF\s]/gi, '') // Keep alphanumeric + Bangla
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Setup language toggle UI and handlers
 */
function setupLanguageToggle() {
  // Use existing buttons if present; otherwise create minimal UI
  let enBtn = document.getElementById('lang-en');
  let bnBtn = document.getElementById('lang-bn');
  
  if (!enBtn || !bnBtn) {
    const topbar = document.querySelector('.doc-topbar') || document.body;
    const wrapper = document.createElement('div');
    wrapper.className = 'doc-lang-toggle';
    wrapper.innerHTML = `
      <button id="lang-en" class="lang-btn">EN</button>
      <button id="lang-bn" class="lang-btn">বাংলা</button>
    `;
    // Place at end of topbar or body
    topbar.appendChild(wrapper);
    enBtn = wrapper.querySelector('#lang-en');
    bnBtn = wrapper.querySelector('#lang-bn');
  }

  enBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentLanguage !== 'en') setLanguage('en');
  });
  bnBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentLanguage !== 'bn') setLanguage('bn');
  });

  updateLanguageToggleState();
}

function updateLanguageToggleState() {
  const enBtn = document.getElementById('lang-en');
  const bnBtn = document.getElementById('lang-bn');
  if (!enBtn || !bnBtn) return;
  enBtn.classList.toggle('active', currentLanguage === 'en');
  bnBtn.classList.toggle('active', currentLanguage === 'bn');
}

/**
 * Compute current scroll percentage (0..1)
 */
function getScrollPercent() {
  const windowHeight = window.innerHeight;
  const docHeight = Math.max(1, document.documentElement.scrollHeight - windowHeight);
  return Math.min(1, Math.max(0, window.scrollY / docHeight));
}

/**
 * Restore scroll using a percent of document height
 */
function restoreScrollPercent(percent) {
  const windowHeight = window.innerHeight;
  const docHeight = Math.max(1, document.documentElement.scrollHeight - windowHeight);
  const top = percent * docHeight;
  window.scrollTo({ top, behavior: 'auto' });
}

/**
 * Simple markdown to HTML parser
 * (For production, consider using marked.js or similar)
 */
function parseMarkdownToHTML(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
    const language = lang || 'javascript';
    return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  return html;
}

/**
 * Wrap headings into sections to enable search/navigation features
 */
function structureDocument() {
  const container = document.querySelector('.doc-content');
  if (!container) return;

  // If already structured, skip
  if (container.querySelector('.doc-section')) return;

  const nodes = Array.from(container.childNodes);
  const newChildren = [];
  let currentSection = null;

  const createId = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);

  nodes.forEach((node) => {
    if (node.tagName === 'H2' || node.tagName === 'H3') {
      // Start a new section
      currentSection = document.createElement('section');
      currentSection.className = 'doc-section';
      const id = createId(node.textContent || 'section');
      currentSection.id = id || `section-${newChildren.length + 1}`;

      // Title element
      const title = node.cloneNode(true);
      title.classList.add('section-title');
      currentSection.appendChild(title);
      newChildren.push(currentSection);
    } else {
      if (!currentSection) {
        currentSection = document.createElement('section');
        currentSection.className = 'doc-section';
        currentSection.id = `section-${newChildren.length + 1}`;
        newChildren.push(currentSection);
      }
      currentSection.appendChild(node);
    }
  });

  // Replace content
  container.innerHTML = '';
  newChildren.forEach((el) => container.appendChild(el));
}

/**
 * Escape HTML for code display
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize all documentation enhancements
 */
function initializeEnhancements() {
  console.log('✨ Initializing enhancements...');
  
  // Add search box
  addSearchBox();
  
  // Add progress bar
  addProgressBar();
  
  // Add copy buttons to code blocks
  addCopyButtons();
  
  // Add collapsible sections
  makeCodeCollapsible();
  
  // Track reading progress
  trackReadingProgress();
  
  console.log('✅ All enhancements initialized');
}

/**
 * Add search functionality
 */
function addSearchBox() {
  const sidebar = document.querySelector('.doc-sidebar');
  if (!sidebar) return;
  
  // Create search box
  const searchBox = document.createElement('div');
  searchBox.className = 'doc-search-box';
  searchBox.innerHTML = `
    <input 
      type="text" 
      id="doc-search-input" 
      placeholder="Search documentation..."
      class="doc-search-input"
    />
    <i class="fas fa-search doc-search-icon"></i>
    <div id="doc-search-results" class="doc-search-results" style="display: none;"></div>
  `;
  
  // Insert after sidebar header
  const sidebarHeader = sidebar.querySelector('.sidebar-header');
  if (sidebarHeader) {
    sidebarHeader.after(searchBox);
  }
  
  // Add search functionality
  const searchInput = document.getElementById('doc-search-input');
  const searchResults = document.getElementById('doc-search-results');
  
  searchInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    
    // Search through content
    const results = performSearch(query);
    displaySearchResults(results, searchResults);
    
  }, 300));
  
  // Close results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
}

/**
 * Perform search in documentation
 */
function performSearch(query) {
  const sections = document.querySelectorAll('.doc-section');
  const results = [];
  
  sections.forEach(section => {
    const title = section.querySelector('.section-title')?.textContent || '';
    const content = section.textContent.toLowerCase();
    
    if (content.includes(query)) {
      results.push({
        id: section.id,
        title: title.trim(),
        preview: extractSearchPreview(section.textContent, query)
      });
    }
  });
  
  return results.slice(0, 5); // Top 5 results
}

/**
 * Extract preview text around search query
 */
function extractSearchPreview(text, query) {
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(query);
  
  if (index === -1) return '';
  
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 50);
  
  let preview = text.substring(start, end);
  if (start > 0) preview = '...' + preview;
  if (end < text.length) preview = preview + '...';
  
  return preview;
}

/**
 * Display search results
 */
function displaySearchResults(results, container) {
  if (results.length === 0) {
    container.innerHTML = '<div class="search-no-results">No results found</div>';
    container.style.display = 'block';
    return;
  }
  
  const html = results.map(result => `
    <div class="search-result-item" onclick="navigateToSection('${result.id}')">
      <div class="search-result-title">${result.title}</div>
      <div class="search-result-preview">${result.preview}</div>
    </div>
  `).join('');
  
  container.innerHTML = html;
  container.style.display = 'block';
}

/**
 * Navigate to section and highlight
 */
function navigateToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  // Scroll to section
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // Highlight briefly
  section.classList.add('highlight-flash');
  setTimeout(() => {
    section.classList.remove('highlight-flash');
  }, 2000);
  
  // Close search results
  const searchResults = document.getElementById('doc-search-results');
  if (searchResults) {
    searchResults.style.display = 'none';
  }
}

/**
 * Add reading progress bar
 */
function addProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.className = 'doc-progress-bar';
  progressBar.innerHTML = '<div class="doc-progress-fill"></div>';
  
  document.body.prepend(progressBar);
  
  console.log('✅ Progress bar added');
}

/**
 * Track reading progress
 */
function trackReadingProgress() {
  const progressFill = document.querySelector('.doc-progress-fill');
  if (!progressFill) return;
  
  window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    
    readingProgress = (scrolled / documentHeight) * 100;
    progressFill.style.width = `${Math.min(readingProgress, 100)}%`;
  });
}

/**
 * Add copy buttons to code blocks
 */
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach((codeBlock, index) => {
    const pre = codeBlock.parentElement;
    
    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.setAttribute('data-index', index);
    
    // Position button
    pre.style.position = 'relative';
    pre.appendChild(copyBtn);
    
    // Add click handler
    copyBtn.addEventListener('click', async () => {
      const code = codeBlock.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        
        // Visual feedback
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
          copyBtn.classList.remove('copied');
        }, 2000);
        
        showNotification('Code copied to clipboard!', 'success');
        
      } catch (error) {
        console.error('Copy failed:', error);
        showNotification('Failed to copy code', 'error');
      }
    });
  });
  
  console.log(`✅ Added ${codeBlocks.length} copy buttons`);
}

/**
 * Make code blocks collapsible if they're long
 */
function makeCodeCollapsible() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(codeBlock => {
    const lines = codeBlock.textContent.split('\n').length;
    
    // Only make collapsible if > 15 lines
    if (lines > 15) {
      const pre = codeBlock.parentElement;
      pre.classList.add('collapsible-code');
      
      // Add toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'code-toggle-btn';
      toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Expand';
      
      pre.appendChild(toggleBtn);
      
      toggleBtn.addEventListener('click', () => {
        pre.classList.toggle('expanded');
        
        if (pre.classList.contains('expanded')) {
          toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Collapse';
        } else {
          toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Expand';
        }
      });
    }
  });
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `doc-notification doc-notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * Debounce helper
 */
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Build search index for faster searches
 */
function buildSearchIndex() {
  searchIndex = [];
  const sections = document.querySelectorAll('.doc-section');
  
  sections.forEach(section => {
    searchIndex.push({
      id: section.id,
      title: section.querySelector('.section-title')?.textContent || '',
      content: section.textContent.toLowerCase(),
      element: section
    });
  });
  
  console.log(`✅ Built search index with ${searchIndex.length} sections`);
}

console.log('✅ Documentation Markdown Loader Loaded');
