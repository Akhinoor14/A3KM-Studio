//PWA install helper + floating install button for A3KM Studio
//Universal: Desktop + Mobile support with smart auto-hide (NO IRRITATION!)
(function(){
  let deferredPrompt = null;
  let btnEl = null;
  const DISMISSED_KEY = 'a3km_pwa_dismissed';
  const DISMISSED_FOREVER_KEY = 'a3km_pwa_dismissed_forever';
  const INSTALLED_KEY = 'a3km_pwa_installed';
  const SESSION_DISMISSED_KEY = 'a3km_pwa_session_dismissed';

  // Check if already installed or dismissed
  function shouldShowPrompt() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    // Clear stale install flag if app was uninstalled
    if (!isStandalone && localStorage.getItem(INSTALLED_KEY) === 'true') {
      localStorage.removeItem(INSTALLED_KEY);
    }

    // Check if already installed
    if (localStorage.getItem(INSTALLED_KEY) === 'true') {
      console.log('[PWA] Already installed - skipping prompt');
      return false;
    }
    
    // Check if dismissed forever (user clicked "Don't show again")
    if (localStorage.getItem(DISMISSED_FOREVER_KEY) === 'true') {
      console.log('[PWA] User dismissed forever - skipping prompt');
      return false;
    }
    
    // Check if dismissed in current session (until browser close)
    if (sessionStorage.getItem(SESSION_DISMISSED_KEY) === 'true') {
      console.log('[PWA] Dismissed for this session - skipping prompt');
      return false;
    }
    
    // Check if dismissed recently (7 days instead of 24 hours - less annoying)
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) {
      const dismissTime = parseInt(dismissed);
      const weekPassed = Date.now() - dismissTime > 7 * 24 * 60 * 60 * 1000; // 7 days
      if (!weekPassed) {
        console.log('[PWA] Dismissed recently - skipping prompt');
        return false;
      }
    }
    
    // Check if already running as installed app
    if (isStandalone) {
      localStorage.setItem(INSTALLED_KEY, 'true');
      console.log('[PWA] Running as standalone - skipping prompt');
      return false;
    }
    
    return true;
  }

  // Detect device type (desktop or mobile)
  function getDeviceType() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent.toLowerCase());
    const isIOS = /iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    
    return { isMobile, isTablet, isIOS, isDesktop: !isMobile && !isTablet };
  }

  function ensureInstallButton() {
    if (btnEl || !window.a3kmInstallAvailable || !shouldShowPrompt()) return;
    
    const device = getDeviceType();
    const device = getDeviceType();
    
    // Create install button
    btnEl = document.createElement('button');
    btnEl.id = 'a3km-install-btn';
    btnEl.type = 'button';
    
    // Different text for mobile vs desktop
    const installText = device.isMobile ? '📱 Install App' : '💻 Install Desktop App';
    
    btnEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 6px;">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>${installText}</span>
    `;
    btnEl.setAttribute('aria-label', 'Install A3KM Studio App');
    btnEl.title = 'Install for offline access & faster loading (Right-click for options)';
    
    // Responsive styling for mobile and desktop
    btnEl.style.cssText = `
      position: fixed; right: ${device.isMobile ? '10px' : '20px'}; 
      bottom: ${device.isMobile ? '10px' : '20px'}; z-index: 9999;
      background: linear-gradient(135deg, #CC0000 0%, #aa0000 100%);
      color: #fff; border: 2px solid rgba(255,255,255,0.2); 
      border-radius: 50px; 
      padding: ${device.isMobile ? '10px 16px' : '12px 20px'}; 
      font-weight: 700; 
      font-size: ${device.isMobile ? '12px' : '14px'}; 
      letter-spacing: 0.5px;
      box-shadow: 0 8px 24px rgba(204,0,0,0.4), 
                  0 4px 12px rgba(0,0,0,0.3),
                  inset 0 1px 0 rgba(255,255,255,0.2);
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 6px;
      animation: slideInUp 0.5s ease-out, pulse 2s ease-in-out 2s infinite;
    `;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      margin-left: 8px; background: transparent; border: none;
      color: white; font-size: 20px; cursor: pointer;
      opacity: 0.7; transition: opacity 0.2s;
    `;
    closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
    closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.7';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      // Session dismiss - hide until browser closes (less annoying!)
      sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
      localStorage.setItem(DISMISSED_KEY, Date.now().toString());
      console.log('[PWA] Dismissed for this session');
      hideInstallButton();
    };
    closeBtn.title = 'Dismiss (will show again next time)';
    btnEl.appendChild(closeBtn);
    
    // Right-click context menu for "Never show again"
    btnEl.oncontextmenu = (e) => {
      e.preventDefault();
      
      const contextMenu = document.createElement('div');
      contextMenu.style.cssText = `
        position: fixed;
        right: ${device.isMobile ? '10px' : '20px'};
        bottom: ${device.isMobile ? '60px' : '80px'};
        background: rgba(20, 20, 20, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(204, 0, 0, 0.3);
        border-radius: 8px;
        padding: 8px;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        animation: slideInUp 0.2s ease-out;
      `;
      
      const option1 = document.createElement('button');
      option1.textContent = '⏸️ Hide for this session';
      option1.style.cssText = `
        display: block; width: 100%; padding: 10px 16px;
        background: transparent; border: none; color: white;
        text-align: left; cursor: pointer; border-radius: 4px;
        font-size: 13px; transition: background 0.2s;
      `;
      option1.onmouseenter = () => option1.style.background = 'rgba(204,0,0,0.2)';
      option1.onmouseleave = () => option1.style.background = 'transparent';
      option1.onclick = () => {
        sessionStorage.setItem(SESSION_DISMISSED_KEY, 'true');
        localStorage.setItem(DISMISSED_KEY, Date.now().toString());
        console.log('[PWA] Hidden for session');
        contextMenu.remove();
        hideInstallButton();
      };
      
      const option2 = document.createElement('button');
      option2.textContent = '🚫 Never show again';
      option2.style.cssText = option1.style.cssText;
      option2.onmouseenter = () => option2.style.background = 'rgba(204,0,0,0.2)';
      option2.onmouseleave = () => option2.style.background = 'transparent';
      option2.onclick = () => {
        if (confirm('Are you sure? You won\'t see the install prompt again on any page.')) {
          localStorage.setItem(DISMISSED_FOREVER_KEY, 'true');
          console.log('[PWA] Dismissed forever');
          contextMenu.remove();
          hideInstallButton();
        }
      };
      
      contextMenu.appendChild(option1);
      contextMenu.appendChild(option2);
      document.body.appendChild(contextMenu);
      
      // Close on click outside
      const closeMenu = (e) => {
        if (!contextMenu.contains(e.target) && e.target !== btnEl) {
          contextMenu.remove();
          document.removeEventListener('click', closeMenu);
        }
      };
      setTimeout(() => document.addEventListener('click', closeMenu), 100);
    };
    btnEl.appendChild(closeBtn);
    
    // Hover effect (desktop only)
    if (device.isDesktop) {
      btnEl.onmouseenter = () => {
        btnEl.style.transform = 'translateY(-2px) scale(1.05)';
        btnEl.style.boxShadow = '0 12px 32px rgba(204,0,0,0.5), 0 6px 16px rgba(0,0,0,0.4)';
      };
      btnEl.onmouseleave = () => {
        btnEl.style.transform = 'translateY(0) scale(1)';
        btnEl.style.boxShadow = '0 8px 24px rgba(204,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)';
      };
    }
    
    btnEl.addEventListener('click', async (e) => {
      if (e.target === closeBtn) return; // Ignore close button clicks
      
      btnEl.style.pointerEvents = 'none';
      btnEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 6px; animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>Installing...</span>
      `;
      
      const accepted = await window.installA3KM();
      if (accepted) {
        localStorage.setItem(INSTALLED_KEY, 'true');
        hideInstallButton();
      } else {
        btnEl.style.pointerEvents = 'auto';
        btnEl.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 6px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>${installText}</span>
        `;
        btnEl.appendChild(closeBtn);
      }
    });
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInUp {
        from { opacity: 0; transform: translateY(50px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(btnEl);
  }

  function hideInstallButton() {
    if (btnEl && btnEl.parentNode) {
      btnEl.style.animation = 'slideInUp 0.3s ease-out reverse';
      setTimeout(() => {
        if (btnEl && btnEl.parentNode) btnEl.parentNode.removeChild(btnEl);
        btnEl = null;
      }, 300);
    }
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    
    // Don't show if already installed or dismissed
    if (!shouldShowPrompt()) {
      console.log('[PWA] Install prompt skipped - already installed or dismissed');
      return;
    }
    
    deferredPrompt = e;
    console.log('[PWA] Install available on', getDeviceType().isMobile ? 'mobile' : 'desktop');
    window.a3kmInstallAvailable = true;
    
    // Smart delay: 5 seconds (less annoying than 3 seconds)
    // Only show on important pages (homepage, content hub, projects)
    const currentPath = window.location.pathname;
    const importantPages = ['index.html', 'hub.html', 'projects.html', '/'];
    const isImportantPage = importantPages.some(page => currentPath.includes(page) || currentPath === '/');
    
    // Show on all pages if user navigated from another page (browsing)
    // Or only on important pages for first visit
    const delay = isImportantPage ? 5000 : 10000; // 5s for important, 10s for others
    
    setTimeout(() => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureInstallButton, { once: true });
      } else {
        ensureInstallButton();
      }
    }, delay); // Smart delay based on page importance
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    localStorage.setItem(INSTALLED_KEY, 'true');
    hideInstallButton();
    
    // Show success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: linear-gradient(135deg, #00aa00 0%, #008800 100%);
      color: white; padding: 16px 24px; border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,170,0,0.4);
      font-family: 'Inter', sans-serif; font-weight: 600;
      animation: slideInRight 0.5s ease-out;
    `;
    notification.innerHTML = `✓ A3KM Studio installed successfully!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.5s ease-out reverse';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  });

  window.installA3KM = async function() {
    if (!deferredPrompt) {
      console.log('[PWA] Install prompt not available');
      return false;
    }
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Install outcome:', outcome);
      deferredPrompt = null;
      window.a3kmInstallAvailable = false;
      
      if (outcome === 'accepted') {
        localStorage.setItem(INSTALLED_KEY, 'true');
      } else {
        hideInstallButton();
      }
      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Install error:', error);
      return false;
    }
  };
})();