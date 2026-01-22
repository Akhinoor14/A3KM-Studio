//PWA install helper + floating install button for A3KM Studio
//Desktop-optimized Progressive Web App installation
(function(){
  let deferredPrompt = null;
  let btnEl = null;

  // Check if device is desktop (for PWA features)
  function isDesktopDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i;
    const isMobileUA = mobileRegex.test(userAgent.toLowerCase());
    const hasOrientation = typeof window.orientation !== 'undefined';
    const screenWidth = screen.width || window.screen.width;
    
    // Desktop if: no mobile UA, no orientation API, and large screen
    return !isMobileUA && !hasOrientation && screenWidth > 1024;
  }

  function ensureInstallButton() {
    // Only show install button on desktop devices
    if (btnEl || !window.a3kmInstallAvailable || !isDesktopDevice()) return;
    
    btnEl = document.createElement('button');
    btnEl.id = 'a3km-install-btn';
    btnEl.type = 'button';
    btnEl.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 6px;">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Install Desktop App</span>
    `;
    btnEl.setAttribute('aria-label', 'Install A3KM Studio as Desktop App');
    btnEl.style.cssText = `
      position: fixed; right: 20px; bottom: 20px; z-index: 9999;
      background: linear-gradient(135deg, #CC0000 0%, #aa0000 100%);
      color: #fff; border: 2px solid rgba(255,255,255,0.2); 
      border-radius: 50px; padding: 12px 20px; 
      font-weight: 700; font-size: 14px; letter-spacing: 0.5px;
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
    
    // Hover effect
    btnEl.onmouseenter = () => {
      btnEl.style.transform = 'translateY(-2px) scale(1.05)';
      btnEl.style.boxShadow = '0 12px 32px rgba(204,0,0,0.5), 0 6px 16px rgba(0,0,0,0.4)';
    };
    btnEl.onmouseleave = () => {
      btnEl.style.transform = 'translateY(0) scale(1)';
      btnEl.style.boxShadow = '0 8px 24px rgba(204,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)';
    };
    
    btnEl.addEventListener('click', async () => {
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
        hideInstallButton();
      } else {
        btnEl.style.pointerEvents = 'auto';
        btnEl.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align: middle; margin-right: 6px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Install Desktop App</span>
        `;
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
    // Only handle PWA install on desktop
    if (!isDesktopDevice()) {
      console.log('[PWA] Install prompt blocked on mobile device');
      return;
    }
    
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Desktop install available');
    window.a3kmInstallAvailable = true;
    
    // Auto-inject install button
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ensureInstallButton, { once: true });
    } else {
      ensureInstallButton();
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Desktop app installed successfully');
    hideInstallButton();
    
    // Show success notification
    if (isDesktopDevice()) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        background: linear-gradient(135deg, #00aa00 0%, #008800 100%);
        color: white; padding: 16px 24px; border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,170,0,0.4);
        font-family: 'Inter', sans-serif; font-weight: 600;
        animation: slideInRight 0.5s ease-out;
      `;
      notification.innerHTML = `
        ✓ A3KM Studio installed successfully!
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => notification.remove(), 500);
      }, 3000);
    }
  });

  window.installA3KM = async function() {
    if (!isDesktopDevice()) {
      console.log('[PWA] Installation only available on desktop');
      return false;
    }
    
    if (!deferredPrompt) {
      console.log('[PWA] Install prompt not available yet');
      return false;
    }
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Install outcome:', outcome);
      deferredPrompt = null;
      window.a3kmInstallAvailable = false;
      
      if (outcome !== 'accepted') hideInstallButton();
      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Install error:', error);
      return false;
    }
  };
})();