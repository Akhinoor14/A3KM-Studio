/**
 * API Configuration Check System
 * Auto-checks for GitHub & YouTube API keys
 * Shows warning banner if missing
 */

(function() {
    'use strict';
    
    // Check API configuration on page load
    window.addEventListener('DOMContentLoaded', () => {
        checkAPIConfiguration();
    });

    function checkAPIConfiguration() {
        const githubToken = localStorage.getItem('github_token');
        const youtubeApiKey = localStorage.getItem('youtube_api_key');
        
        // Only show banner if GitHub token is missing (required for upload)
        if (!githubToken) {
            showAPIWarningBanner();
        }
    }

    function showAPIWarningBanner() {
        // Create warning banner
        const banner = document.createElement('div');
        banner.id = 'apiWarningBanner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, rgba(255, 82, 82, 0.95), rgba(255, 152, 0, 0.95));
            border-bottom: 3px solid #FF5252;
            padding: 15px 20px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            animation: slideDown 0.4s ease;
        `;
        
        banner.innerHTML = `
            <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 15px;">
                <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 28px; color: #fff;"></i>
                    <div>
                        <strong style="font-size: 16px; color: #fff; display: block; margin-bottom: 3px;">
                            ⚠️ GitHub API Token Required
                        </strong>
                        <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.95);">
                            Upload functionality requires GitHub Personal Access Token to work. 
                            <a href="../shared/api-config-manager.html" style="color: #FFD700; text-decoration: underline; font-weight: 600;">
                                Configure API keys here →
                            </a>
                        </p>
                    </div>
                </div>
                <button onclick="document.getElementById('apiWarningBanner').remove()" 
                        style="background: rgba(255, 255, 255, 0.2); border: 2px solid rgba(255, 255, 255, 0.5); 
                               padding: 8px 16px; border-radius: 8px; color: #fff; font-weight: 600; 
                               cursor: pointer; transition: all 0.3s;">
                    <i class="fas fa-times"></i> Dismiss
                </button>
            </div>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Insert at the beginning of body
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Adjust body padding to accommodate banner
        document.body.style.paddingTop = '80px';
    }

    // Export functions if needed
    window.APIConfigCheck = {
        check: checkAPIConfiguration,
        hasGitHubToken: () => !!localStorage.getItem('github_token'),
        hasYouTubeKey: () => !!localStorage.getItem('youtube_api_key')
    };
})();
