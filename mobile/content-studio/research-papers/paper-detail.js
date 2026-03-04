// ============================================================================
// PAPER DETAIL - Mobile Research Paper Detail Page
// Loads a single paper from papers.json and renders detailed info:
// cover, meta, authors, action buttons (Read / Cite), abstract,
// and a related-papers grid.
// ============================================================================

(function () {
    'use strict';

    const params   = new URLSearchParams(window.location.search);
    const paperId  = params.get('id');
    let   allPapers = [];
    let   abstractExpanded = false;

    // ── Init ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        loadPapers();
    });

    async function loadPapers() {
        try {
            const res  = await fetch('../../../Content%20Studio/research-papers/papers.json');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            allPapers  = data.papers || [];

            const paper = allPapers.find(p => p.id === paperId);
            if (!paper) {
                showError('Paper not found.');
                return;
            }

            const related = allPapers
                .filter(p => p.id !== paper.id && p.category === paper.category)
                .slice(0, 6);

            renderDetail(paper, related);
        } catch (e) {
            showError('Failed to load: ' + e.message);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
    function renderDetail(paper, related) {
        // Update page title + header
        document.title = paper.title + ' – A3KM Studio';
        document.getElementById('headerTitle').textContent = paper.title;

        const langMap = { en: '🇬🇧 English', bn: '🇧🇩 বাংলা', 'en-bn': '🇬🇧 EN/BN' };
        const langLabel = langMap[paper.language] || paper.language || 'English';

        const dateLabel = paper.date
            ? new Date(paper.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
            : '—';

        // Paper type for badge
        const typeSlug = (paper.type || 'article').toLowerCase().replace(/\s+/g, '-');
        const typeClass = `type-${typeSlug}`;
        const typeLabel = paper.type || 'Article';

        /* cover with type badge */
        const typeBadge = `<div class="cover-type-badge ${typeClass}">${typeLabel}</div>`;
        const coverHTML = paper.cover
            ? `<img src="${paper.cover}" alt="${esc(paper.title)}" onerror="this.parentElement.innerHTML='<div class=cover-placeholder><i class=fas fa-file-alt></i></div>'" onload="this.parentElement.classList.add('loaded')">`
            : `<div class="cover-placeholder"><i class="fas fa-file-alt"></i></div>`;

        /* authors */
        const authorsHTML = (paper.authors && paper.authors.length)
            ? paper.authors.map(a => `<span class="author-chip"><i class="fas fa-user"></i> ${esc(a)}</span>`).join('')
            : '<span class="author- chip"><i class="fas fa-user"></i> Unknown</span>';

        /* abstract */
        const abstractHTML = paper.abstract
            ? `<p>${esc(paper.abstract)}</p>`
            : '<p>No abstract available.</p>';

        /* related */
        const relatedHTML = related.length ? related.map(r => `
            <a class="rel-card" href="paper-detail.html?id=${r.id}">
                <div class="rel-cover">
                    ${r.cover
                        ? `<img src="${r.cover}" alt="${esc(r.title)}" onerror="this.parentElement.innerHTML='<i class=fas fa-file-alt></i>'">`
                        : `<i class="fas fa-file-alt"></i>`}
                </div>
                <div class="rel-info">
                    <div class="rel-title">${esc(r.title)}</div>
                    <div class="rel-author">${esc((r.authors && r.authors[0]) || '')}</div>
                </div>
            </a>`).join('') : '';

        // Citation text
        const citationText = generateCitation(paper);

        document.getElementById('mainContent').innerHTML = `
            <!-- COVER HERO -->
            <div class="cover-hero">
                <div class="cover-img-wrap">
                    ${coverHTML}
                    ${typeBadge}
                </div>
                
                <!-- Stats centered below cover -->
                <div class="cover-stats">
                    <div class="stat-chip">
                        <i class="fas fa-file-alt"></i>
                        <div class="stat-chip-info">
                            <span class="stat-label">Pages</span>
                            <span class="stat-value">${paper.pages || '—'}</span>
                        </div>
                    </div>
                    <div class="stat-chip">
                        <i class="fas fa-calendar"></i>
                        <div class="stat-chip-info">
                            <span class="stat-label">Year</span>
                            <span class="stat-value">${paper.year || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MAIN INFO -->
            <div class="content-body">
                <!-- Badges -->
                <div class="badge-row">
                    <span class="badge badge-cat">${esc(paper.category || 'Research')}</span>
                    <span class="badge badge-type ${typeClass}">${typeLabel}</span>
                    ${paper.openAccess ? '<span class="badge badge-oa">Open Access</span>' : ''}
                    <span class="badge badge-date">${dateLabel}</span>
                </div>

                <!-- Title -->
                <h1 class="paper-main-title">${esc(paper.title)}</h1>

                <!-- Authors -->
                ${(paper.authors && paper.authors.length) ? `
                <div class="authors-section">
                    <div class="authors-label">Authors</div>
                    <div class="authors-list">${authorsHTML}</div>
                </div>` : ''}

                <!-- Journal/venue info -->
                ${paper.journal ? `
                <div class="journal-row">
                    <i class="fas fa-book-open"></i>
                    <span>${esc(paper.journal)}${paper.volume ? `, Vol. ${paper.volume}` : ''}${paper.issue ? ` (${paper.issue})` : ''}</span>
                </div>` : ''}

                <!-- Meta chips -->
                <div class="meta-chips">
                    ${paper.pages ? `<span class="meta-chip"><i class="fas fa-file-alt"></i> ${paper.pages} pages</span>` : ''}
                    ${paper.year  ? `<span class="meta-chip"><i class="fas fa-calendar"></i> ${paper.year}</span>` : ''}
                    ${paper.doi   ? `<span class="meta-chip"><i class="fas fa-link"></i> <a href="https://doi.org/${paper.doi}" target="_blank" rel="noopener">DOI</a></span>` : ''}
                </div>

                <div class="divider"></div>

                <!-- ACTION STRIP -->
                <div class="action-strip">
                    <a class="btn-read" href="paper-viewer.html?id=${paperId}">
                        <i class="fas fa-file-pdf"></i> Read Paper
                    </a>
                    <button class="btn-cite" onclick="copyCitation()">
                        <i class="fas fa-quote-left"></i> Cite
                    </button>
                </div>

                <div class="divider"></div>

                <!-- ABSTRACT -->
                <div class="section-label">Abstract</div>
                <div class="abstract-inner" id="abstractInner">${abstractHTML}</div>
                <button class="toggle-btn" id="abstractToggle" onclick="toggleAbstract()">
                    <i class="fas fa-chevron-down" id="toggleIcon"></i>
                    <span id="toggleText">Show more</span>
                </button>

                <!-- RELATED -->
                ${related.length ? `
                <div class="related-section">
                    <div class="section-label">Related Papers</div>
                    <div class="related-grid">${relatedHTML}</div>
                </div>` : ''}

                <div style="height: 20px;"></div>
            </div>
        `;

        // Store citation for copy function
        window._currentCitation = citationText;

        // Trigger cover animation after render
        requestAnimationFrame(() => {
            const coverWrap = document.querySelector('.cover-img-wrap');
            if (coverWrap && !coverWrap.querySelector('img')) {
                // No image, so manually trigger loaded class
                coverWrap.classList.add('loaded');
            }
        });
    }

    // ── Toggle Abstract ───────────────────────────────────────────────────────
    window.toggleAbstract = function () {
        abstractExpanded = !abstractExpanded;
        const el   = document.getElementById('abstractInner');
        const icon = document.getElementById('toggleIcon');
        const txt  = document.getElementById('toggleText');
        if (abstractExpanded) {
            el.classList.add('expanded');
            icon.className = 'fas fa-chevron-up';
            txt.textContent  = 'Show less';
        } else {
            el.classList.remove('expanded');
            icon.className = 'fas fa-chevron-down';
            txt.textContent  = 'Show more';
        }
        if (navigator.vibrate) navigator.vibrate(8);
    };

    // ── Copy Citation ─────────────────────────────────────────────────────────
    window.copyCitation = function () {
        const citation = window._currentCitation || '';
        if (!citation) {
            showToast('No citation available');
            return;
        }

        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(citation).then(() => {
                showToast();
            }).catch(() => {
                fallbackCopy(citation);
            });
        } else {
            fallbackCopy(citation);
        }

        if (navigator.vibrate) navigator.vibrate(12);
    };

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            showToast('Copy failed');
        }
        document.body.removeChild(textarea);
    }

    function showToast(msg) {
        const toast = document.getElementById('citeToast');
        if (msg) toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // ── Generate Citation (APA style) ─────────────────────────────────────────
    function generateCitation(paper) {
        const authors = paper.authors && paper.authors.length
            ? paper.authors.join(', ')
            : 'Unknown';
        const year = paper.year || 'n.d.';
        const title = paper.title || 'Untitled';
        const journal = paper.journal || '';
        const volume = paper.volume ? `, ${paper.volume}` : '';
        const issue = paper.issue ? `(${paper.issue})` : '';
        const pages = paper.pages ? `, ${paper.pages}` : '';
        const doi = paper.doi ? ` https://doi.org/${paper.doi}` : '';

        return `${authors} (${year}). ${title}. ${journal}${volume}${issue}${pages}.${doi}`;
    }

    // ── Error state ───────────────────────────────────────────────────────────
    function showError(msg) {
        document.getElementById('mainContent').innerHTML = `
            <div style="padding:60px 20px;text-align:center;">
                <i class="fas fa-exclamation-circle" style="font-size:52px;color:#CC0000;margin-bottom:18px;display:block;"></i>
                <h3 style="font-size:17px;font-weight:700;color:#fff;margin-bottom:10px;">${esc(msg)}</h3>
                <a href="paper-listing.html"
                   style="display:inline-block;margin-top:10px;padding:11px 22px;background:#CC0000;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:13px;">
                    ← Back to Papers
                </a>
            </div>`;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    function esc(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

})();
