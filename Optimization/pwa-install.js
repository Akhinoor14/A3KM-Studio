//Recommendation: Keep. Optional: add a small CSS class instead of inline styles for button theming. 
//PWA install helper + tiny floating install button for A3KM Studio
(function(){
  let deferredPrompt = null;
  let btnEl = null;

  function ensureInstallButton() {
    if (btnEl || !window.a3kmInstallAvailable) return;
    btnEl = document.createElement('button');
    btnEl.id = 'a3km-install-btn';
    btnEl.type = 'button';
    btnEl.textContent = 'Install App';
    btnEl.setAttribute('aria-label', 'Install A3KM Studio');
    btnEl.style.cssText = `
      position: fixed; right: 16px; bottom: 16px; z-index: 9999;
      background: #CC0000; color: #fff; border: none; border-radius: 9999px;
      padding: 10px 14px; font-weight: 700; letter-spacing: .2px;
      box-shadow: 0 6px 18px rgba(204,0,0,.35), inset 0 1px 0 rgba(255,255,255,.1);
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    `;
    btnEl.addEventListener('click', async () => {
      const accepted = await window.installA3KM();
      if (accepted) hideInstallButton();
    });
    document.body.appendChild(btnEl);
  }

  function hideInstallButton() {
    if (btnEl && btnEl.parentNode) btnEl.parentNode.removeChild(btnEl);
    btnEl = null;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] Install available');
    window.a3kmInstallAvailable = true;
    // Auto-inject a small install button (removable)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ensureInstallButton, { once: true });
    } else {
      ensureInstallButton();
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    hideInstallButton();
  });

  window.installA3KM = async function() {
    if (!deferredPrompt) {
      console.log('[PWA] Install prompt not available yet');
      return false;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Install outcome:', outcome);
    deferredPrompt = null;
    window.a3kmInstallAvailable = false;
    if (outcome !== 'accepted') hideInstallButton();
    return outcome === 'accepted';
  };
})();