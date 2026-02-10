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
     LOAD POSTS DATA (includes localStorage!)
     ============================================ */
  async function loadPosts() {
    try {
      const response = await fetch('posts.json');
      const data = await response.json();
      allPosts = data.posts || [];
      
      // 🚀 NEW: Load posts from localStorage (Simple Creator!)
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
    } catch (error) {
      console.error('Error loading posts:', error);
      throw error;
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
  function convertMarkdownToHTML(markdown) {
    if (!markdown) return '';
    
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Blockquotes
      .replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>')
      // Lists
      .replace(/^\* (.+)$/gim, '<li>$1</li>')
      .replace(/^- (.+)$/gim, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gim, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraphs
    html = '<p>' + html + '</p>';
    
    // Wrap consecutive list items in ul
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    
    return html;
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
