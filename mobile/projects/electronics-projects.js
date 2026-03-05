/* ============================================================================
   ELECTRONICS PROJECTS - JAVASCRIPT
   Loads electronics tools from shared projects.json (same as desktop)
   ============================================================================ */

(function () {
    'use strict';

    let allTools = [];

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        await loadTools();
        setupSearch();
        animateSections();
        setupHaptics();
    }

    // ── DATA ────────────────────────────────────────────────────────────────

    async function loadTools() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        try {
            showLoading(grid);
            const res = await fetch('../../Projects%20Code/projects.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // Filter electronics category
            allTools = (data.projects || []).filter(p => p.category === 'electronics');
            updateCount(allTools.length);
            renderTools(allTools);
        } catch (err) {
            console.error('Failed to load electronics tools:', err);
            showError(grid);
        }
    }

    function renderTools(tools) {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        if (!tools.length) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:48px 16px;color:rgba(255,255,255,0.4);">
                    <i class="fas fa-bolt" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
                    No tools found.
                </div>`;
            return;
        }

        grid.innerHTML = tools.map(t => `
            <a href="${t.toolLink || '#'}" class="project-card tool-card">
                <div class="project-thumbnail electronics-tool">
                    <i class="fas ${t.icon || 'fa-wrench'}"></i>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${t.title}</h3>
                    <p class="project-desc">${t.subcategory || ''}</p>
                    <div class="project-meta">
                        ${(t.features || []).slice(0, 3).map(f =>
                            `<span><i class="fas fa-check-circle"></i> ${f}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="project-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </a>
        `).join('');

        // Re-attach haptics to newly rendered cards
        setupHaptics();
    }

    function updateCount(count) {
        const badge = document.getElementById('toolCount');
        if (badge) badge.textContent = `${count} Essential Tool${count !== 1 ? 's' : ''}`;
    }

    // ── SEARCH ──────────────────────────────────────────────────────────────

    function setupSearch() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        input.addEventListener('input', () => {
            const q = input.value.toLowerCase().trim();
            const filtered = q
                ? allTools.filter(t =>
                    t.title.toLowerCase().includes(q) ||
                    (t.description || '').toLowerCase().includes(q) ||
                    (t.tags || []).some(tag => tag.toLowerCase().includes(q))
                  )
                : allTools;
            renderTools(filtered);
        });
    }

    // ── UI HELPERS ───────────────────────────────────────────────────────────

    function showLoading(grid) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:48px 16px;">
                <div class="loading-spinner" style="width:36px;height:36px;border:3px solid rgba(204,0,0,.2);border-top-color:#CC0000;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 14px;"></div>
                <p style="color:rgba(255,255,255,.5);font-size:.85rem;">Loading tools…</p>
            </div>`;
        // ensure spin keyframes exist
        if (!document.getElementById('spin-kf')) {
            const s = document.createElement('style');
            s.id = 'spin-kf';
            s.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
            document.head.appendChild(s);
        }
    }

    function showError(grid) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:48px 16px;color:rgba(255,100,100,.7);">
                <i class="fas fa-exclamation-triangle" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
                <p>Unable to load tools. Please try again.</p>
                <button onclick="location.reload()" style="margin-top:12px;padding:8px 20px;background:#CC0000;border:none;border-radius:8px;color:#fff;font-weight:700;cursor:pointer;">Retry</button>
            </div>`;
    }

    function animateSections() {
        document.querySelectorAll('.mobile-section, .category-hero').forEach((s, i) => {
            s.style.opacity = '0';
            s.style.transform = 'translateY(20px)';
            s.style.transition = 'opacity .6s ease, transform .6s ease';
            setTimeout(() => {
                s.style.opacity = '1';
                s.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }

    function setupHaptics() {
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            }, { passive: true });
        });
    }

})();
