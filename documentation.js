/**
 * Documentation Interactive Features
 * ===================================
 * Language switching, smooth scroll, collapsible sections, TOC sync
 */

console.log('📚 Documentation JavaScript Loaded');

// ============================================
// Language Switching (BEAUTIFULLY SMOOTH)
// ============================================

let currentLang = 'en';

function switchLanguage(lang) {
  console.log(`🌐 Switching to ${lang === 'en' ? 'English' : 'বাংলা'}`);
  
  if (currentLang === lang) return;
  
  currentLang = lang;
  
  // Update buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    }
  });
  
  // Update content visibility with smooth fade
  document.querySelectorAll('.lang-content').forEach(content => {
    if (content.dataset.lang === lang) {
      content.style.opacity = '0';
      content.classList.add('active');
      
      // Smooth fade in
      setTimeout(() => {
        content.style.opacity = '1';
      }, 50);
    } else {
      content.style.opacity = '0';
      setTimeout(() => {
        content.classList.remove('active');
      }, 300);
    }
  });
  
  // Scroll to top smoothly
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Save preference
  localStorage.setItem('doc_lang', lang);
  
  console.log('✅ Language switched successfully');
}

// Load saved language preference
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('doc_lang');
  if (savedLang && savedLang !== 'en') {
    switchLanguage(savedLang);
  }
});

// ============================================
// Smooth Scroll to Sections
// ============================================

function smoothScrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  const offset = 20;
  const elementPosition = section.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

// Handle TOC clicks
document.querySelectorAll('.toc-item, .toc-subitem').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    const sectionId = href.replace('#', '');
    smoothScrollToSection(sectionId);
    
    // Update active state
    updateActiveTOCItem(link);
  });
});

// ============================================
// Active Section Highlighting (Scroll Spy)
// ============================================

function updateActiveTOCItem(activeLink = null) {
  document.querySelectorAll('.toc-item, .toc-subitem').forEach(item => {
    item.classList.remove('active');
  });
  
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

function handleScrollSpy() {
  const sections = document.querySelectorAll('.doc-section');
  const scrollPosition = window.scrollY + 100;
  
  let currentSection = null;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      currentSection = section.id;
    }
  });
  
  if (currentSection) {
    const activeLink = document.querySelector(`.toc-item[href="#${currentSection}"], .toc-subitem[href="#${currentSection}"]`);
    if (activeLink && !activeLink.classList.contains('active')) {
      updateActiveTOCItem(activeLink);
    }
  }
}

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  
  scrollTimeout = setTimeout(() => {
    handleScrollSpy();
  }, 100);
});

// ============================================
// Collapsible Sections (Future Enhancement)
// ============================================

function makeCollapsible() {
  document.querySelectorAll('.section-content h2').forEach(heading => {
    heading.style.cursor = 'pointer';
    heading.setAttribute('title', 'Click to collapse/expand');
    
    heading.addEventListener('click', () => {
      const content = heading.nextElementSibling;
      if (!content) return;
      
      const isCollapsed = content.style.maxHeight === '0px';
      
      if (isCollapsed) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        heading.style.opacity = '1';
      } else {
        content.style.maxHeight = '0px';
        content.style.opacity = '0.5';
        heading.style.opacity = '0.7';
      }
      
      content.style.overflow = 'hidden';
      content.style.transition = 'all 0.3s ease';
    });
  });
}

// Uncomment to enable collapsible sections
// makeCollapsible();

// ============================================
// Code Block Enhancements
// ============================================

function enhanceCodeBlocks() {
  document.querySelectorAll('.code-box pre').forEach(block => {
    // Add copy button
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    copyBtn.className = 'code-copy-btn';
    copyBtn.style.cssText = `
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 12px;
      background: rgba(156, 39, 176, 0.3);
      border: 1px solid rgba(156, 39, 176, 0.5);
      border-radius: 8px;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 10;
    `;
    
    copyBtn.addEventListener('mouseenter', () => {
      copyBtn.style.background = 'rgba(156, 39, 176, 0.5)';
      copyBtn.style.transform = 'scale(1.05)';
    });
    
    copyBtn.addEventListener('mouseleave', () => {
      copyBtn.style.background = 'rgba(156, 39, 176, 0.3)';
      copyBtn.style.transform = 'scale(1)';
    });
    
    copyBtn.addEventListener('click', () => {
      const code = block.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = 'rgba(76, 175, 80, 0.5)';
        
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
          copyBtn.style.background = 'rgba(156, 39, 176, 0.3)';
        }, 2000);
      });
    });
    
    const codeBox = block.closest('.code-box');
    if (codeBox) {
      codeBox.style.position = 'relative';
      codeBox.appendChild(copyBtn);
    }
  });
}

// ============================================
// Mobile Sidebar Toggle (for small screens)
// ============================================

function createMobileSidebarToggle() {
  if (window.innerWidth > 900) return;
  
  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
  toggleBtn.className = 'mobile-sidebar-toggle';
  toggleBtn.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(156, 39, 176, 0.4), rgba(103, 58, 183, 0.35));
    border: 2px solid rgba(156, 39, 176, 0.6);
    border-radius: 12px;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 2001;
    box-shadow: 0 4px 16px rgba(156, 39, 176, 0.4);
    transition: all 0.3s ease;
  `;
  
  toggleBtn.addEventListener('click', () => {
    const sidebar = document.querySelector('.doc-sidebar');
    sidebar.classList.toggle('open');
    
    if (sidebar.classList.contains('open')) {
      toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
  
  document.body.appendChild(toggleBtn);
  
  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.doc-sidebar');
    const isClickInsideSidebar = sidebar.contains(e.target);
    const isClickOnToggle = toggleBtn.contains(e.target);
    
    if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Documentation initialized');
  
  // Initialize scroll spy
  handleScrollSpy();
  
  // Enhance code blocks with copy buttons
  enhanceCodeBlocks();
  
  // Create mobile sidebar toggle if needed
  createMobileSidebarToggle();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      const existingToggle = document.querySelector('.mobile-sidebar-toggle');
      if (existingToggle) {
        existingToggle.remove();
      }
      document.querySelector('.doc-sidebar').classList.remove('open');
    } else {
      if (!document.querySelector('.mobile-sidebar-toggle')) {
        createMobileSidebarToggle();
      }
    }
  });
});

// ============================================
// Smooth Page Load Animation
// ============================================

window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
  // ESC to close mobile sidebar
  if (e.key === 'Escape') {
    const sidebar = document.querySelector('.doc-sidebar');
    const toggle = document.querySelector('.mobile-sidebar-toggle');
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      if (toggle) toggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  }
  
  // Ctrl/Cmd + K to toggle language
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const newLang = currentLang === 'en' ? 'bn' : 'en';
    switchLanguage(newLang);
  }
});

// ============================================
// Export functions for global use
// ============================================

window.switchLanguage = switchLanguage;
window.smoothScrollToSection = smoothScrollToSection;

console.log('📚 All documentation features loaded successfully!');
console.log('💡 Keyboard shortcuts: ESC = Close sidebar, Ctrl/Cmd + K = Switch language');
