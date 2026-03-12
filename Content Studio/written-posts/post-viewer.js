/* ============================================
   POST VIEWER - JAVASCRIPT
   Blog Post Rendering & Interactions
   ============================================ */

(function() {
  'use strict';

  // Get post ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  // DOM Elements
  const elements = {
    loading: document.getElementById('postLoading'),
    error: document.getElementById('postError'),
    header: document.getElementById('postHeader'),
    cover: document.getElementById('postCover'),
    content: document.getElementById('postContent'),
    footer: document.getElementById('postFooter'),
    title: document.getElementById('postTitle'),
    date: document.getElementById('postDate'),
    readTime: document.getElementById('postReadTime'),
    author: document.getElementById('postAuthor'),
    views: document.getElementById('postViews'),
    tags: document.getElementById('postTags'),
    likeBtn: document.getElementById('likeBtn'),
    likeCount: document.getElementById('likeCount'),
    bookmarkBtn: document.getElementById('bookmarkBtn'),
    shareFacebook: document.getElementById('shareFacebook'),
    shareTwitter: document.getElementById('shareTwitter'),
    shareWhatsapp: document.getElementById('shareWhatsapp'),
    shareLink: document.getElementById('shareLink'),
    readingProgress: document.getElementById('readingProgress'),
    tocToggle: document.getElementById('tocToggle'),
    tocSidebar: document.getElementById('tocSidebar'),
    tocClose: document.getElementById('tocClose'),
    tocNav: document.getElementById('tocNav'),
    relatedGrid: document.getElementById('relatedGrid')
  };

  let currentPost = null;
  let allPosts = [];

  /* ============================================
     INITIALIZATION
     ============================================ */
  async function init() {
    if (!postId) {
      showError();
      return;
    }

    try {
      await loadPosts();
      currentPost = allPosts.find(p => p.id === postId);
      
      if (!currentPost) {
        showError();
        return;
      }

      await renderPost();
      setupEventListeners();
      updateViews();
      loadRelatedPosts();
      setupNavigation();
    } catch (error) {
      console.error('Error loading post:', error);
      showError();
    }
  }

  /* ============================================
     LOAD POSTS DATA (includes localStorage + Cloud!)
     ============================================ */
  async function loadPosts() {
    try {
      // 🚀 STEP 1: Pull latest posts from GitHub Cloud (get posts from other devices!)
      await syncFromGitHubCloud();
      
      // STEP 2: Load posts from posts.json
      const response = await fetch('posts.json');
      const data = await response.json();
      allPosts = data.posts || [];
      
      // STEP 3: Load posts from localStorage (Simple Creator!)
      const localPosts = JSON.parse(localStorage.getItem('a3km_posts') || '[]');
      
      if (localPosts.length > 0) {
        console.log(`✅ Found ${localPosts.length} posts from Simple Creator!`);
        
        // Merge with existing posts (avoid duplicates)
        localPosts.forEach(localPost => {
          const exists = allPosts.find(p => p.id === localPost.id);
          if (!exists) {
            allPosts.push(localPost);
            console.log(`✅ Added post: ${localPost.id}`);
          }
        });
      }
      
      console.log(`📝 Total ${allPosts.length} posts loaded (posts.json + localStorage + Cloud)`);
    } catch (error) {
      console.error('Error loading posts:', error);
      throw error;
    }
  }

  /* ============================================
     🚀 SYNC FROM GITHUB CLOUD
     ============================================ */
  async function syncFromGitHubCloud() {
    try {
      const token = localStorage.getItem('github_api_token');
      if (!token) {
        console.log('⚠️ No GitHub token - skipping cloud sync');
        return;
      }

      console.log('⬇️  Syncing posts from cloud...');
      
      const owner = 'Akhinoor14';
      const repo = 'A3KM-Studio';
      const path = 'Content Studio/written-posts/posts.json';
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const content = atob(data.content);
        const githubPosts = JSON.parse(content);
        
        // Merge with localStorage
        const localPosts = JSON.parse(localStorage.getItem('a3km_posts') || '[]');
        const localIds = new Set(localPosts.map(p => p.id));
        
        let newCount = 0;
        if (githubPosts.posts && Array.isArray(githubPosts.posts)) {
          githubPosts.posts.forEach(post => {
            if (!localIds.has(post.id)) {
              localPosts.push(post);
              newCount++;
            }
          });
        }
        
        if (newCount > 0) {
          localStorage.setItem('a3km_posts', JSON.stringify(localPosts));
          console.log(`✅ Synced ${newCount} new posts from cloud to desktop viewer!`);
        } else {
          console.log('✅ Desktop viewer already up to date with cloud');
        }
      }
    } catch (error) {
      console.error('⚠️ Cloud sync failed:', error);
      // Don't block page load if sync fails
    }
  }

  /* ============================================
     RENDER POST
     ============================================ */
  async function renderPost() {
    // Update meta information
    elements.title.textContent = currentPost.title;
    elements.date.textContent = formatDate(currentPost.date);
    elements.readTime.textContent = `${currentPost.readTime} min read`;
    elements.author.textContent = currentPost.author || 'Md Akhinoor Islam';
    elements.views.textContent = currentPost.views || 0;

    // Update page title
    document.title = `${currentPost.title} - Md Akhinoor Islam`;

    // Render tags
    if (currentPost.tags && currentPost.tags.length > 0) {
      elements.tags.innerHTML = currentPost.tags.map(tag => 
        `<span class="post-tag">${escapeHTML(tag)}</span>`
      ).join('');
    }

    // Set cover image
    if (currentPost.coverImage) {
      elements.cover.style.backgroundImage = `url('${currentPost.coverImage}')`;
      elements.cover.style.display = 'block';
    }

    // Load content - Check if inline HTML or external file
    try {
      // If content is HTML (starts with < or contains HTML tags) - from simple creator
      if (currentPost.content && (currentPost.content.startsWith('<') || currentPost.content.includes('<p>') || currentPost.content.includes('<div>'))) {
        console.log('Rendering inline HTML content');
        elements.content.innerHTML = currentPost.content;
      }
      // If content is a file path - traditional markdown posts
      else if (currentPost.content && (currentPost.content.endsWith('.md') || currentPost.content.includes('/'))) {
        console.log('Loading markdown from file:', currentPost.content);
        const response = await fetch(currentPost.content);
        
        if (response.ok) {
          const markdownContent = await response.text();
          
          // Remove frontmatter if exists
          let content = markdownContent;
          if (content.startsWith('---')) {
            const parts = content.split('---');
            if (parts.length >= 3) {
              content = parts.slice(2).join('---').trim();
            }
          }
          
          // Convert markdown to HTML
          const htmlContent = convertMarkdownToHTML(content);
          elements.content.innerHTML = htmlContent;
        } else {
          elements.content.innerHTML = '<p>Content could not be loaded.</p>';
        }
      }
      // Fallback for old format
      else {
        const mdPath = currentPost.markdownFile || currentPost.contentPath || `Content Studio/written-posts/${currentPost.id}.md`;
        const response = await fetch(`https://raw.githubusercontent.com/Akhinoor14/A3KM-Studio/main/${mdPath}`);
        
        if (response.ok) {
          const markdownContent = await response.text();
          let content = markdownContent;
          if (content.startsWith('---')) {
            const parts = content.split('---');
            if (parts.length >= 3) {
              content = parts.slice(2).join('---').trim();
            }
          }
          const htmlContent = convertMarkdownToHTML(content);
          elements.content.innerHTML = htmlContent;
        } else {
          elements.content.innerHTML = convertMarkdownToHTML(currentPost.content || 'Content not available');
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
      elements.content.innerHTML = '<p>Content could not be loaded.</p>';
    }

    // Syntax highlighting for code blocks
    document.querySelectorAll('pre code').forEach(block => {
      if (typeof hljs !== 'undefined') {
        hljs.highlightElement(block);
      }
    });
    
    // Add copy buttons to code blocks (new feature!)
    setTimeout(() => {
      addCopyButtonsToCodeBlocks();
      styleCalloutBoxes();
      enhanceCollapsible();
    }, 200);

    // Generate TOC
    generateTOC();

    // Load likes from localStorage
    const likeKey = `post_like_${postId}`;
    const bookmarkKey = `post_bookmark_${postId}`;
    
    if (localStorage.getItem(likeKey)) {
      elements.likeBtn.classList.add('active');
      elements.likeBtn.querySelector('i').classList.replace('far', 'fas');
    }
    
    if (localStorage.getItem(bookmarkKey)) {
      elements.bookmarkBtn.classList.add('active');
      elements.bookmarkBtn.querySelector('i').classList.replace('far', 'fas');
    }

    elements.likeCount.textContent = currentPost.likes || 0;

    // Hide loading, show content
    elements.loading.style.display = 'none';
    elements.header.style.display = 'block';
    elements.content.style.display = 'block';
    elements.footer.style.display = 'block';
  }

  /* ============================================
     TABLE OF CONTENTS GENERATION
     ============================================ */
  function generateTOC() {
    const headings = elements.content.querySelectorAll('h1, h2, h3, h4');
    
    if (headings.length === 0) {
      elements.tocToggle.style.display = 'none';
      return;
    }

    const tocHTML = Array.from(headings).map((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      const level = parseInt(heading.tagName.charAt(1));
      const indent = (level - 1) * 15;
      
      return `
        <a href="#${id}" class="toc-link" style="padding-left: ${indent}px">
          ${escapeHTML(heading.textContent)}
        </a>
      `;
    }).join('');

    elements.tocNav.innerHTML = tocHTML;

    // Smooth scroll to headings
    elements.tocNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          elements.tocSidebar.classList.remove('active');
        }
      });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', updateActiveTOC);
  }

  function updateActiveTOC() {
    const headings = elements.content.querySelectorAll('h1, h2, h3, h4');
    const scrollPos = window.scrollY + 100;

    let activeHeading = null;
    headings.forEach(heading => {
      if (heading.offsetTop <= scrollPos) {
        activeHeading = heading;
      }
    });

    elements.tocNav.querySelectorAll('a').forEach(link => {
      link.classList.remove('active');
    });

    if (activeHeading) {
      const activeLink = elements.tocNav.querySelector(`a[href="#${activeHeading.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }

  /* ============================================
     EVENT LISTENERS
     ============================================ */
  function setupEventListeners() {
    // Like button
    elements.likeBtn.addEventListener('click', toggleLike);

    // Bookmark button
    elements.bookmarkBtn.addEventListener('click', toggleBookmark);

    // Share buttons
    elements.shareFacebook.addEventListener('click', () => sharePost('facebook'));
    elements.shareTwitter.addEventListener('click', () => sharePost('twitter'));
    elements.shareWhatsapp.addEventListener('click', () => sharePost('whatsapp'));
    elements.shareLink.addEventListener('click', copyLink);

    // TOC toggle
    elements.tocToggle.addEventListener('click', () => {
      elements.tocSidebar.classList.add('active');
    });

    elements.tocClose.addEventListener('click', () => {
      elements.tocSidebar.classList.remove('active');
    });

    // Close TOC on outside click
    elements.tocSidebar.addEventListener('click', (e) => {
      if (e.target === elements.tocSidebar) {
        elements.tocSidebar.classList.remove('active');
      }
    });

    // Reading progress bar
    window.addEventListener('scroll', updateReadingProgress);
  }

  /* ============================================
     INTERACTIONS
     ============================================ */
  function toggleLike() {
    const likeKey = `post_like_${postId}`;
    const isLiked = localStorage.getItem(likeKey);
    const icon = elements.likeBtn.querySelector('i');

    if (isLiked) {
      localStorage.removeItem(likeKey);
      elements.likeBtn.classList.remove('active');
      icon.classList.replace('fas', 'far');
      currentPost.likes = Math.max(0, (currentPost.likes || 0) - 1);
    } else {
      localStorage.setItem(likeKey, 'true');
      elements.likeBtn.classList.add('active');
      icon.classList.replace('far', 'fas');
      currentPost.likes = (currentPost.likes || 0) + 1;
    }

    elements.likeCount.textContent = currentPost.likes;
  }

  function toggleBookmark() {
    const bookmarkKey = `post_bookmark_${postId}`;
    const isBookmarked = localStorage.getItem(bookmarkKey);
    const icon = elements.bookmarkBtn.querySelector('i');

    if (isBookmarked) {
      localStorage.removeItem(bookmarkKey);
      elements.bookmarkBtn.classList.remove('active');
      icon.classList.replace('fas', 'far');
    } else {
      localStorage.setItem(bookmarkKey, 'true');
      elements.bookmarkBtn.classList.add('active');
      icon.classList.replace('far', 'fas');
    }
  }

  function sharePost(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentPost.title);
    const summary = encodeURIComponent(currentPost.summary);

    let shareUrl;
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      const icon = elements.shareLink.querySelector('i');
      icon.classList.replace('fa-link', 'fa-check');
      
      setTimeout(() => {
        icon.classList.replace('fa-check', 'fa-link');
      }, 2000);
    });
  }

  function updateReadingProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.scrollY;
    const progress = (scrollTop / documentHeight) * 100;

    elements.readingProgress.style.width = `${Math.min(progress, 100)}%`;
  }

  function updateViews() {
    const viewKey = `post_view_${postId}`;
    if (!sessionStorage.getItem(viewKey)) {
      currentPost.views = (currentPost.views || 0) + 1;
      elements.views.textContent = currentPost.views;
      sessionStorage.setItem(viewKey, 'true');
    }
  }

  /* ============================================
     RELATED POSTS
     ============================================ */
  function loadRelatedPosts() {
    const related = allPosts
      .filter(p => p.id !== postId)
      .filter(p => {
        if (!currentPost.tags || !p.tags) return false;
        return p.tags.some(tag => currentPost.tags.includes(tag));
      })
      .slice(0, 3);

    if (related.length === 0) {
      elements.relatedGrid.innerHTML = '<p>No related articles found.</p>';
      return;
    }

    elements.relatedGrid.innerHTML = related.map(post => `
      <a href="post-reader.html?id=${post.id}" class="related-card">
        <div class="related-cover" style="background-image: url('${post.coverImage}')"></div>
        <h4>${escapeHTML(post.title)}</h4>
        <p>${escapeHTML(post.summary)}</p>
      </a>
    `).join('');
  }

  /* ============================================
     ERROR HANDLING
     ============================================ */
  function showError() {
    elements.loading.style.display = 'none';
    elements.error.style.display = 'block';
  }

  /* ============================================
     UTILITIES
     ============================================ */
  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
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

  /* ============================================
     SETUP NAVIGATION
     ============================================ */
  function setupNavigation() {
    // Sort posts by ID (post-001, post-002, etc.)
    const sortedPosts = allPosts
      .filter(p => p.id && p.id.startsWith('post-'))
      .sort((a, b) => {
        const numA = parseInt(a.id.replace('post-', ''));
        const numB = parseInt(b.id.replace('post-', ''));
        return numA - numB;
      });
    
    // Find current post index in sorted list
    const currentIndex = sortedPosts.findIndex(p => p.id === postId);
    
    if (currentIndex === -1 || sortedPosts.length <= 1) {
      hideNavigation();
      return;
    }

    const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
    const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

    // Get navigation elements
    const navSection = document.querySelector('.post-navigation');
    const prevLink = document.getElementById('prevPost');
    const nextLink = document.getElementById('nextPost');
    const prevTitle = document.getElementById('prevPostTitle');
    const nextTitle = document.getElementById('nextPostTitle');
    const prevExcerpt = document.getElementById('prevPostExcerpt');
    const nextExcerpt = document.getElementById('nextPostExcerpt');

    if (!navSection) return;

    // Update keyboard hint badge with counter
    const keyboardBadge = navSection.querySelector('.keyboard-hint-badge');
    if (keyboardBadge) {
      keyboardBadge.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="display: flex; gap: 4px;">
            <kbd style="background: rgba(204, 0, 0, 0.3); border: 1px solid rgba(204, 0, 0, 0.5); border-radius: 4px; padding: 2px 8px; font-family: monospace; font-size: 0.75rem; color: #CC0000;">←</kbd>
            <kbd style="background: rgba(204, 0, 0, 0.3); border: 1px solid rgba(204, 0, 0, 0, 0.5); border-radius: 4px; padding: 2px 8px; font-family: monospace; font-size: 0.75rem; color: #CC0000;">→</kbd>
          </div>
          <span style="border-left: 1px solid rgba(204, 0, 0, 0.3); padding-left: 8px; font-size: 0.75rem;">
            Article <strong style="color: #CC0000;">${currentIndex + 1}</strong>/<strong>${sortedPosts.length}</strong>
          </span>
        </div>
      `;
    }

    // Setup previous post
    if (prevPost && prevLink && prevTitle && prevExcerpt) {
      prevLink.href = `post-reader.html?id=${prevPost.id}`;
      prevTitle.textContent = prevPost.title;
      prevExcerpt.textContent = prevPost.summary || extractExcerpt(prevPost);
      prevLink.style.display = 'flex';
    } else if (prevLink) {
      prevLink.style.display = 'none';
    }

    // Setup next post
    if (nextPost && nextLink && nextTitle && nextExcerpt) {
      nextLink.href = `post-reader.html?id=${nextPost.id}`;
      nextTitle.textContent = nextPost.title;
      nextExcerpt.textContent = nextPost.summary || extractExcerpt(nextPost);
      nextLink.style.display = 'flex';
    } else if (nextLink) {
      nextLink.style.display = 'none';
    }

    // Show navigation section if at least one link exists
    if (prevPost || nextPost) {
      navSection.style.display = 'flex';
      setupKeyboardNavigation(prevPost, nextPost);
    } else {
      navSection.style.display = 'none';
    }
    
    console.log(`📍 Post ${currentIndex + 1}/${sortedPosts.length}`);
  }

  /* ============================================
     KEYBOARD NAVIGATION
     ============================================ */
  function setupKeyboardNavigation(prevPost, nextPost) {
    document.addEventListener('keydown', function handleKeyNav(e) {
      // Ignore if user is typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (e.key === 'ArrowLeft' && prevPost) {
        e.preventDefault();
        window.location.href = `post-reader.html?id=${prevPost.id}`;
      } else if (e.key === 'ArrowRight' && nextPost) {
        e.preventDefault();
        window.location.href = `post-reader.html?id=${nextPost.id}`;
      }
    });
    console.log('⌨️ Keyboard navigation enabled (←/→)');
  }

  /* ============================================
     EXTRACT EXCERPT
     ============================================ */
  function extractExcerpt(post) {
    if (post.excerpt) return post.excerpt;
    if (post.description) return post.description;
    
    // Fallback: create a short excerpt from title
    return `Read about ${post.title.toLowerCase()}`;
  }

  /* ============================================
     HIDE NAVIGATION
     ============================================ */
  function hideNavigation() {
    const navSection = document.querySelector('.post-navigation');
    if (navSection) {
      navSection.style.display = 'none';
    }
  }

  /* ============================================
     PDF DOWNLOAD FUNCTION
     ============================================ */
  window.downloadPostPDF = async function() {
    try {
      const contentElement = document.getElementById('postContent');
      if (!contentElement) {
        alert('❌ Post content not found!');
        return;
      }

      // Check if content is loaded
      const content = contentElement.innerHTML;
      if (content.includes('Loading') || !currentPost) {
        alert('⏳ Please wait for the post to load first!');
        return;
      }

      // Check if PDF converter is available
      if (typeof MDtoPDFConverter === 'undefined') {
        alert('❌ PDF converter not loaded! Please refresh the page.');
        return;
      }

      // Show loading state
      const btn = document.getElementById('downloadPdfBtn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Generating PDF...</span>';
      btn.disabled = true;

      // Create converter instance
      const converter = new MDtoPDFConverter({
        debug: true
      });

      // Generate PDF
      await converter.convertToPDF(
        content,
        currentPost.slug || 'blog_post',
        {
          projectTitle: currentPost.title || 'Blog Post',
          documentType: 'Blog Article',
          author: 'Md Akhinoor Islam',
          description: currentPost.description || currentPost.summary || '',
          category: 'Written Content',
          date: currentPost.date || new Date().toLocaleDateString()
        }
      );

      // Reset button
      btn.innerHTML = '<i class="fas fa-check"></i> <span>Downloaded!</span>';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 2000);

    } catch (error) {
      console.error('❌ PDF Generation Error:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Reset button on error
      const btn = document.getElementById('downloadPdfBtn');
      if (btn) {
        btn.innerHTML = '<i class="fas fa-file-pdf"></i> <span>Download PDF</span>';
        btn.disabled = false;
      }
    }
  };

  /* ============================================
     READING MODE FEATURES - NEW
     ============================================ */
  
  // Default Mode (Clear all modes)
  function setDefaultMode() {
    const body = document.body;
    const defaultBtn = document.getElementById('defaultModeBtn');
    const nightBtn = document.getElementById('nightModeBtn');
    const sepiaBtn = document.getElementById('sepiaModeBtn');
    
    body.classList.remove('night-mode', 'sepia-mode');
    defaultBtn.classList.add('active');
    nightBtn.classList.remove('active');
    sepiaBtn.classList.remove('active');
    
    localStorage.removeItem('readingMode');
    isNightMode = false;
    isSepiaMode = false;
  }

  // Night Mode Toggle
  let isNightMode = localStorage.getItem('readingMode') === 'night';
  function toggleNightMode() {
    const body = document.body;
    const defaultBtn = document.getElementById('defaultModeBtn');
    const nightBtn = document.getElementById('nightModeBtn');
    const sepiaBtn = document.getElementById('sepiaModeBtn');
    
    body.classList.remove('sepia-mode');
    body.classList.add('night-mode');
    defaultBtn.classList.remove('active');
    nightBtn.classList.add('active');
    sepiaBtn.classList.remove('active');
    
    localStorage.setItem('readingMode', 'night');
    isNightMode = true;
    isSepiaMode = false;
  }

  // Sepia Mode Toggle
  let isSepiaMode = localStorage.getItem('readingMode') === 'sepia';
  function toggleSepiaMode() {
    const body = document.body;
    const defaultBtn = document.getElementById('defaultModeBtn');
    const nightBtn = document.getElementById('nightModeBtn');
    const sepiaBtn = document.getElementById('sepiaModeBtn');
    
    body.classList.remove('night-mode');
    body.classList.add('sepia-mode');
    defaultBtn.classList.remove('active');
    nightBtn.classList.remove('active');
    sepiaBtn.classList.add('active');
    
    localStorage.setItem('readingMode', 'sepia');
    isSepiaMode = true;
    isNightMode = false;
  }

  // Fullscreen Toggle
  function toggleFullscreen() {
    const article = document.querySelector('.post-viewer');
    const btn = document.getElementById('fullscreenBtn');
    
    if (!document.fullscreenElement) {
      if (article.requestFullscreen) {
        article.requestFullscreen();
        btn.innerHTML = '<i class="fas fa-compress"></i><span>Exit</span>';
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        btn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
      }
    }
  }

  /* ============================================
     MARKDOWN TO HTML CONVERTER
     ============================================ */
  /* ══════════════════════════════════════════════════════════
     PROFESSIONAL MARKDOWN CONVERTER (inspired by Arduino Projects)
     Uses marked.js library with fallback
  ══════════════════════════════════════════════════════════ */
  function convertMarkdownToHTML(markdown, contentPath = '') {
    if (!markdown) return '';
    
    // Use marked.js if available (professional library)
    if (typeof marked !== 'undefined') {
      try {
        marked.setOptions({
          breaks: true,
          gfm: true,
          pedantic: false,
          highlight: function(code, lang) {
            if (typeof hljs !== 'undefined' && lang) {
              try {
                return hljs.highlight(code, { language: lang }).value;
              } catch (e) {}
            }
            return code;
          }
        });
        
        // Add custom extensions for highlighting
        marked.use({
          extensions: [{
            name: 'highlight',
            level: 'inline',
            start(src) { return src.indexOf('=='); },
            tokenizer(src) {
              const match = src.match(/^==([^=]+)==/);
              if (match) {
                return {
                  type: 'highlight',
                  raw: match[0],
                  text: match[1]
                };
              }
            },
            renderer(token) {
              return `<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px; color: #000;">${token.text}</mark>`;
            }
          }]
        });
        
        let html = marked.parse(markdown);
        
        // Resolve relative image paths if contentPath provided
        if (contentPath) {
          const base = contentPath.substring(0, contentPath.lastIndexOf('/') + 1);
          html = html.replace(
            /(<img[^>]+src=["'])(?!https?:\/\/|\/|data:)([^"']+)(["'][^>]*>)/gi,
            (m, pre, src, suf) => pre + base + src + suf
          );
        }
        
        // Apply syntax highlighting to any unprocessed code blocks
        setTimeout(() => {
          if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code:not(.hljs)').forEach(block => {
              hljs.highlightElement(block);
            });
          }
        }, 100);
        
        return html;
      } catch (error) {
        console.error('Marked.js error, using fallback:', error);
        return convertMarkdownFallback(markdown);
      }
    }
    
    // Fallback if marked.js not loaded
    return convertMarkdownFallback(markdown);
  }
  
  /* ══════════════════════════════════════════════════════════
     FALLBACK MARKDOWN CONVERTER (Enhanced)
  ══════════════════════════════════════════════════════════ */
  function convertMarkdownFallback(markdown) {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Code blocks (must be first)
    html = html.replace(/```([\w]*)\r?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
    );
    
    // Tables
    html = html.replace(/\n(\|.+\|\n)+/g, function(match) {
      const lines = match.trim().split('\n');
      if (lines.length < 2 || !lines[1].match(/^\|[\s\-\|:]+\|$/)) return match;
      
      let table = '<table class="markdown-table">';
      const headers = lines[0].split('|').filter(cell => cell.trim());
      
      table += '<thead><tr>';
      headers.forEach(h => table += `<th>${h.trim()}</th>`);
      table += '</tr></thead><tbody>';
      
      for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split('|').filter(cell => cell.trim());
        if (cells.length === 0) continue;
        table += '<tr>';
        cells.forEach(c => table += `<td>${c.trim()}</td>`);
        table += '</tr>';
      }
      
      table += '</tbody></table>';
      return '\n' + table + '\n';
    });
    
    // Headers
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // Horizontal rules
    html = html.replace(/^---+$/gm, '<hr>');
    
    // Bold & Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Images & Links
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Lists (simplified)
    html = html.replace(/^[\*\-] (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Paragraphs
    html = html.split(/\r?\n\r?\n/).map(p => {
      p = p.trim();
      if (p.match(/^<(h[1-6]|ul|ol|pre|blockquote|table|hr)/)) return p;
      return p ? `<p>${p.replace(/\r?\n/g, '<br>')}</p>` : '';
    }).join('\n');
    
    return html;
  }
  
  /* ══════════════════════════════════════════════════════════
     ADD COPY BUTTONS TO CODE BLOCKS
  ══════════════════════════════════════════════════════════ */
  function addCopyButtonsToCodeBlocks() {
    document.querySelectorAll('#postContent pre').forEach(pre => {
      if (pre.querySelector('.copy-code-btn')) return; // Already has button
      
      const btn = document.createElement('button');
      btn.className = 'copy-code-btn';
      btn.innerHTML = '<i class="fas fa-copy"></i>';
      btn.title = 'Copy code';
      
      btn.onclick = () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent;
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i>';
          btn.style.background = 'rgba(0, 200, 100, 0.3)';
          
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
            btn.style.background = '';
          }, 2000);
        }).catch(err => {
          console.error('Copy failed:', err);
          btn.innerHTML = '<i class="fas fa-times"></i>';
        });
      };
      
      pre.appendChild(btn);
    });
  }

  /* ══════════════════════════════════════════════════════════
     STYLE CALLOUT BOXES (INFO/WARNING/SUCCESS)
  ══════════════════════════════════════════════════════════ */
  function styleCalloutBoxes() {
    document.querySelectorAll('#postContent blockquote').forEach(quote => {
      const firstStrong = quote.querySelector('strong:first-child');
      if (!firstStrong) return;
      
      const text = firstStrong.textContent.toUpperCase();
      
      if (text === 'INFO') {
        quote.style.borderLeftColor = '#2196F3';
        quote.style.background = 'rgba(33, 150, 243, 0.1)';
        quote.style.borderLeftWidth = '4px';
      } else if (text === 'WARNING') {
        quote.style.borderLeftColor = '#FF9800';
        quote.style.background = 'rgba(255, 152, 0, 0.1)';
        quote.style.borderLeftWidth = '4px';
      } else if (text === 'SUCCESS') {
        quote.style.borderLeftColor = '#4CAF50';
        quote.style.background = 'rgba(76, 175, 80, 0.1)';
        quote.style.borderLeftWidth = '4px';
      } else if (text === 'ERROR') {
        quote.style.borderLeftColor = '#F44336';
        quote.style.background = 'rgba(244, 67, 54, 0.1)';
        quote.style.borderLeftWidth = '4px';
      }
    });
  }

  /* ══════════════════════════════════════════════════════════
     ENHANCE COLLAPSIBLE SECTIONS
  ══════════════════════════════════════════════════════════ */
  function enhanceCollapsible() {
    document.querySelectorAll('#postContent details').forEach(details => {
      const summary = details.querySelector('summary');
      if (summary) {
        summary.style.cursor = 'pointer';
        summary.style.fontWeight = '600';
        summary.style.color = 'var(--primary-red, #CC0000)';
        summary.style.padding = '10px';
        summary.style.background = 'rgba(139,0,0,0.1)';
        summary.style.borderRadius = '6px';
        summary.style.userSelect = 'none';
        
        // Add hover effect
        summary.addEventListener('mouseenter', () => {
          summary.style.background = 'rgba(139,0,0,0.2)';
        });
        summary.addEventListener('mouseleave', () => {
          summary.style.background = 'rgba(139,0,0,0.1)';
        });
      }
      
      details.style.margin = '20px 0';
      details.style.padding = '15px';
      details.style.background = 'rgba(255,255,255,0.05)';
      details.style.border = '1px solid rgba(139,0,0,0.3)';
      details.style.borderRadius = '8px';
    });
  }

  // Event Listeners for Reading Features
  function setupReadingFeatures() {
    // Apply saved reading mode
    const defaultBtn = document.getElementById('defaultModeBtn');
    const nightBtn = document.getElementById('nightModeBtn');
    const sepiaBtn = document.getElementById('sepiaModeBtn');
    
    if (isNightMode) {
      document.body.classList.add('night-mode');
      nightBtn?.classList.add('active');
    } else if (isSepiaMode) {
      document.body.classList.add('sepia-mode');
      sepiaBtn?.classList.add('active');
    } else {
      defaultBtn?.classList.add('active');
    }
    
    // Show toolbar
    const toolbar = document.getElementById('readingToolbar');
    if (toolbar) {
      toolbar.style.display = 'flex';
    }
    
    // Toolbar button events
    document.getElementById('defaultModeBtn')?.addEventListener('click', setDefaultMode);
    document.getElementById('nightModeBtn')?.addEventListener('click', toggleNightMode);
    document.getElementById('sepiaModeBtn')?.addEventListener('click', toggleSepiaMode);
    document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        case 'd':
          setDefaultMode();
          break;
        case 'n':
          toggleNightMode();
          break;
        case 's':
          toggleSepiaMode();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    });
    
    // Fullscreen change event
    document.addEventListener('fullscreenchange', () => {
      const btn = document.getElementById('fullscreenBtn');
      if (!document.fullscreenElement) {
        btn.innerHTML = '<i class="fas fa-expand"></i><span>Fullscreen</span>';
      }
    });
  }

  /* ============================================
     START APPLICATION
     ============================================ */
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupReadingFeatures();
  });

})();
