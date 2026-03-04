// ============================================================================
// BOOK DETAIL - Mobile Book Detail Page
// Loads a single book from books.json and renders detailed info:
// cover, meta, action buttons (Read PDF / Book Mode), summary, download CTA,
// and a related-books grid.
// ============================================================================

(function () {
    'use strict';

    const params   = new URLSearchParams(window.location.search);
    const bookId   = params.get('id');
    let   allBooks = [];
    let   summaryExpanded = false;
    let   downloadOpen    = false;

    // ── Init ─────────────────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        loadBooks();
    });

    async function loadBooks() {
        try {
            const res  = await fetch('../../../Content%20Studio/books-pdfs/books.json');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            allBooks   = data.books || [];

            const book = allBooks.find(b => b.id === bookId);
            if (!book) {
                showError('Book not found.');
                return;
            }

            const related = allBooks
                .filter(b => b.id !== book.id && b.category === book.category)
                .slice(0, 6);

            renderDetail(book, related);
        } catch (e) {
            showError('Failed to load: ' + e.message);
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
    function renderDetail(book, related) {
        // Update page title + header
        document.title = book.title + ' – A3KM Studio';
        document.getElementById('headerTitle').textContent = book.title;

        const langMap = { bn: '🇧🇩 বাংলা', en: '🇬🇧 English', 'bn-en': '🇧🇩 BN/EN', 'en-bn': '🇬🇧 EN/BN' };
        const langLabel = langMap[book.language] || book.language || 'Unknown';

        const dateLabel = book.date
            ? new Date(book.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })
            : '—';

        /* cover with format badge */
        const formatBadge = `<div class="cover-format-badge">${book.format || 'PDF'}</div>`;
        const coverHTML = book.cover
            ? `<img src="${book.cover}" alt="${esc(book.title)}" onerror="this.parentElement.innerHTML='<div class=cover-placeholder><i class=fas fa-book></i></div>'" onload="this.parentElement.classList.add('loaded')">`
            : `<div class="cover-placeholder"><i class="fas fa-book"></i></div>`;

        /* summary */
        const summaryHTML = book.summary
            ? book.summary
            : (book.description ? `<p>${esc(book.description)}</p>` : '<p>No summary available.</p>');

        /* related */
        const relatedHTML = related.length ? related.map(r => `
            <a class="rel-card" href="book-detail.html?id=${r.id}">
                <div class="rel-cover">
                    ${r.cover
                        ? `<img src="${r.cover}" alt="${esc(r.title)}" onerror="this.parentElement.innerHTML='<i class=fas fa-book></i>'">`
                        : `<i class="fas fa-book"></i>`}
                </div>
                <div class="rel-info">
                    <div class="rel-title">${esc(r.title)}</div>
                    <div class="rel-author">${esc(r.author || '')}</div>
                </div>
            </a>`).join('') : '';

        document.getElementById('mainContent').innerHTML = `
            <!-- COVER HERO -->
            <div class="cover-hero">
                <div class="cover-img-wrap">
                    ${coverHTML}
                    ${formatBadge}
                </div>
                
                <!-- Stats centered below cover -->
                <div class="cover-stats">
                    <div class="stat-chip">
                        <i class="fas fa-file-alt"></i>
                        <div class="stat-chip-info">
                            <span class="stat-label">Pages</span>
                            <span class="stat-value">${book.pages || '—'}</span>
                        </div>
                    </div>
                    <div class="stat-chip">
                        <i class="fas fa-database"></i>
                        <div class="stat-chip-info">
                            <span class="stat-label">Size</span>
                            <span class="stat-value">${book.size || '—'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MAIN INFO -->
            <div class="content-body">
                <!-- Badges -->
                <div class="badge-row">
                    <span class="badge badge-cat">${esc(book.category)}</span>
                    <span class="badge badge-lang">${langLabel}</span>
                    <span class="badge badge-date">${dateLabel}</span>
                </div>

                <!-- Title + Author -->
                <h1 class="book-main-title">${esc(book.title)}</h1>
                ${book.author ? `
                <div class="author-row">
                    <i class="fas fa-user-pen"></i>
                    <span>${esc(book.author)}</span>
                </div>` : ''}

                <!-- Meta chips -->
                <div class="meta-chips">
                    ${book.pages ? `<span class="meta-chip"><i class="fas fa-file-alt"></i> ${book.pages} pages</span>` : ''}
                    ${book.size  ? `<span class="meta-chip"><i class="fas fa-database"></i> ${book.size}</span>` : ''}
                    ${book.format? `<span class="meta-chip"><i class="fas fa-file-pdf"></i> ${book.format}</span>` : ''}
                </div>

                <div class="divider"></div>

                <!-- ACTION STRIP -->
                <div class="action-strip">
                    <a class="btn-read" href="book-reader.html?id=${bookId}">
                        <i class="fas fa-book-reader"></i> Read Book
                    </a>
                    <a class="btn-3d" href="book-reader.html?id=${bookId}&bookmode=true">
                        <i class="fas fa-book-open"></i> Book Mode
                    </a>
                </div>

                <div class="divider"></div>

                <!-- SUMMARY -->
                <div class="section-label">Summary</div>
                <div class="summary-inner" id="summaryInner">${summaryHTML}</div>
                <button class="toggle-btn" id="summaryToggle" onclick="toggleSummary()">
                    <i class="fas fa-chevron-down" id="toggleIcon"></i>
                    <span id="toggleText">Show more</span>
                </button>

                <div class="divider"></div>

                <!-- DOWNLOAD -->
                <div class="download-box" id="downloadBox">
                    <div class="download-header" onclick="toggleDownload()">
                        <div class="download-header-left">
                            <i class="fas fa-download"></i>
                            <span>Download Book</span>
                        </div>
                        <i class="fas fa-chevron-down dl-chevron" id="dlChevron"></i>
                    </div>
                    <div class="download-body" id="downloadBody">
                        <div class="download-body-inner">
                            <div class="download-note">
                                <i class="fas fa-info-circle"></i>
                                <p>বইটি ডাউনলোড করতে লেখকের সাথে যোগাযোগ করুন। Reading is free — download requires permission.</p>
                            </div>
                            <a href="../../../Contact/contact.html" class="contact-btn">
                                <i class="fas fa-envelope"></i> Contact Us
                            </a>
                        </div>
                    </div>
                </div>

                <!-- RELATED -->
                ${related.length ? `
                <div class="related-section">
                    <div class="section-label">Related Books</div>
                    <div class="related-grid">${relatedHTML}</div>
                </div>` : ''}

                <div style="height: 20px;"></div>
            </div>
        `;

        // Trigger cover animation after render
        requestAnimationFrame(() => {
            const coverWrap = document.querySelector('.cover-img-wrap');
            if (coverWrap && !coverWrap.querySelector('img')) {
                // No image, so manually trigger loaded class
                coverWrap.classList.add('loaded');
            }
        });
    }

    // ── Toggle Summary ────────────────────────────────────────────────────────
    window.toggleSummary = function () {
        summaryExpanded = !summaryExpanded;
        const el   = document.getElementById('summaryInner');
        const icon = document.getElementById('toggleIcon');
        const txt  = document.getElementById('toggleText');
        if (summaryExpanded) {
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

    // ── Toggle Download ───────────────────────────────────────────────────────
    window.toggleDownload = function () {
        downloadOpen = !downloadOpen;
        document.getElementById('downloadBox').classList.toggle('open', downloadOpen);
        if (navigator.vibrate) navigator.vibrate(8);
    };

    // ── Error state ───────────────────────────────────────────────────────────
    function showError(msg) {
        document.getElementById('mainContent').innerHTML = `
            <div style="padding:60px 20px;text-align:center;">
                <i class="fas fa-exclamation-circle" style="font-size:52px;color:#CC0000;margin-bottom:18px;display:block;"></i>
                <h3 style="font-size:17px;font-weight:700;color:#fff;margin-bottom:10px;">${esc(msg)}</h3>
                <a href="book-listing.html"
                   style="display:inline-block;margin-top:10px;padding:11px 22px;background:#CC0000;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:13px;">
                    ← Back to Library
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
