// ============================================
// CONTENT STUDIO - MOBILE ENHANCEMENTS
// Floating Action Button, Swipe Gestures, Haptic Feedback
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ========== FAB MENU SYSTEM ==========
  const fabButton = document.getElementById('fabButton');
  const fabMenu = document.getElementById('fabMenu');
  let fabOpen = false;

  if (fabButton && fabMenu) {
    fabButton.addEventListener('click', () => {
      fabOpen = !fabOpen;
      fabMenu.classList.toggle('active', fabOpen);
      fabButton.innerHTML = fabOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-ellipsis-v"></i>';
      simulateHaptic();
    });
  }

  // Scroll to Top (FAB Menu)
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (fabMenu) fabMenu.classList.remove('active');
      fabOpen = false;
      if (fabButton) fabButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
      simulateHaptic();
    });
  }

  // Refresh Content
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      simulateHaptic();
      location.reload();
    });
  }

  // ========== SCROLL TO TOP BUTTON ==========
  const scrollTopBtnSingle = document.getElementById('scrollTopBtnSingle');
  if (scrollTopBtnSingle) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtnSingle.classList.add('visible');
      } else {
        scrollTopBtnSingle.classList.remove('visible');
      }
    });

    scrollTopBtnSingle.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      simulateHaptic();
    });
  }

  // ========== CARD SWIPE GESTURES ==========
  function initSwipeGestures() {
    const contentCards = document.querySelectorAll('.content-card');
    contentCards.forEach(card => {
      let touchStartX = 0;
      let touchEndX = 0;
      
      card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });
      
      card.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(card);
      });
      
      function handleSwipe(element) {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            // Swipe left
            element.style.transform = 'translateX(-10px)';
            setTimeout(() => element.style.transform = '', 200);
          } else {
            // Swipe right
            element.style.transform = 'translateX(10px)';
            setTimeout(() => element.style.transform = '', 200);
          }
          simulateHaptic();
        }
      }
    });
  }

  // Initialize on load
  initSwipeGestures();

  // Re-initialize after content loads
  const contentGrid = document.getElementById('contentGrid');
  if (contentGrid) {
    const observer = new MutationObserver(() => {
      initSwipeGestures();
    });
    observer.observe(contentGrid, { childList: true, subtree: true });
  }

  // ========== HAPTIC FEEDBACK SIMULATION ==========
  function simulateHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  // Add haptic to all interactive elements
  const interactiveElements = document.querySelectorAll('button, .nav-item, .type-chip, .filter-btn, .content-card');
  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', simulateHaptic, { passive: true });
  });

  // ========== PULL TO REFRESH PREVENTION ==========
  let lastTouchY = 0;
  document.addEventListener('touchstart', (e) => {
    lastTouchY = e.touches[0].clientY;
  });

  document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;

    if (document.documentElement.scrollTop === 0 && touchYDelta > 0) {
      e.preventDefault();
    }
  }, { passive: false });

  // ========== SMOOTH SCROLL BEHAVIOR ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        simulateHaptic();
      }
    });
  });

  console.log('✅ Content Studio Mobile Enhancements Loaded');
});
