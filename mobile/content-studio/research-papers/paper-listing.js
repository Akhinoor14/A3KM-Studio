// ============================================================================
// PAPER LISTING - Research Papers Section (Mobile)
// Loads papers dynamically from desktop papers.json file
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allPapers = [];
    let filteredPapers = [];
    let currentFilter = 'all';

    // ========== DOM ELEMENTS ==========
    const contentGrid = document.getElementById('contentGrid');
    const searchInput = document.getElementById('searchInput');
    const statusFilters = document.querySelectorAll('#statusFilters .filter-chip');

    // ========== LOAD PAPERS FROM JSON ==========
    async function loadPapers() {
        try {
            const response = await fetch('../../../Content Studio/research-papers/papers.json');
            const data = await response.json();
            allPapers = data.papers || [];
            filteredPapers = [...allPapers];
            renderPapers();
        } catch (error) {
            console.error('Error loading papers:', error);
            contentGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:80px 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size:56px; color:var(--primary-red); margin-bottom:20px;"></i>
                    <h3 style="color:var(--text-primary); margin-bottom:12px;">Error Loading Papers</h3>
                    <p style="color:var(--text-dim); font-size:14px;">Please try refreshing the page</p>
                </div>
            `;
        }
    }

    // ========== RENDER FUNCTIONS ==========
    function renderPapers() {
        if (filteredPapers.length === 0) {
            contentGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:80px 20px;">
                    <i class="fas fa-file-alt" style="font-size:56px; color:var(--primary-red); opacity:0.5; margin-bottom:20px;"></i>
                    <h3 style="color:var(--text-primary); margin-bottom:8px;">No Papers Found</h3>
                    <p style="color:var(--text-dim); font-size:14px;">Try adjusting your filters or search</p>
                </div>
            `;
            return;
        }

        contentGrid.innerHTML = filteredPapers.map(paper => createPaperCard(paper)).join('');
    }

    // ========== CREATE PAPER CARD ==========
    function createPaperCard(paper) {
        const date = new Date(paper.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });

        const authors = Array.isArray(paper.authors) 
            ? paper.authors.slice(0, 2).join(', ') + (paper.authors.length > 2 ? ' et al.' : '')
            : paper.authors || 'Unknown Author';

        const status = paper.status || 'Published';
        const statusClass = status.toLowerCase().replace(/\s+/g, '-');

        return `
            <div class="content-item" onclick="openPaper('${paper.id}')">
                <div class="paper-thumbnail">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="content-item-body">
                    <span class="paper-status ${statusClass}">${status}</span>
                    <h3 class="content-item-title">${paper.title}</h3>
                    <p class="content-item-meta">
                        <i class="fas fa-user-graduate"></i> ${authors}
                    </p>
                    <p class="content-item-meta">
                        <i class="fas fa-university"></i> ${paper.institution || 'N/A'}
                    </p>
                    <div class="paper-venue">${paper.venue || paper.category}</div>
                    <div class="content-item-footer">
                        <span class="content-item-date">
                            <i class="fas fa-calendar"></i> ${formattedDate}
                        </span>
                        <span class="content-item-stats">
                            <i class="fas fa-quote-right"></i> ${paper.citations || 0}
                        </span>
                    </div>
                    <button class="citation-btn" onclick="event.stopPropagation(); citePaper('${paper.id}')">
                        <i class="fas fa-quote-left"></i> Cite Paper
                    </button>
                </div>
            </div>
        `;
    }

    // ========== FILTER BY STATUS ==========
    function filterByStatus(status) {
        currentFilter = status;
        
        if (status === 'all') {
            filteredPapers = [...allPapers];
        } else {
            filteredPapers = allPapers.filter(paper => 
                (paper.status || 'Published').toLowerCase().replace(/\s+/g, '-') === status
            );
        }
        
        applySearch();
        renderPapers();
    }

    // ========== SEARCH FUNCTIONALITY ==========
    function applySearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            return;
        }
        
        filteredPapers = filteredPapers.filter(paper => {
            const titleMatch = paper.title.toLowerCase().includes(searchTerm);
            const authorsMatch = (Array.isArray(paper.authors) 
                ? paper.authors.join(' ') 
                : paper.authors || '').toLowerCase().includes(searchTerm);
            const keywordsMatch = (paper.keywords || []).some(keyword => 
                keyword.toLowerCase().includes(searchTerm)
            );
            const abstractMatch = (paper.abstract || ''). toLowerCase().includes(searchTerm);
            
            return titleMatch || authorsMatch || keywordsMatch || abstractMatch;
        });
    }

    // ========== OPEN PAPER VIEWER ==========
    window.openPaper = function(paperId) {
        if (navigator.vibrate) navigator.vibrate(10);
        window.location.href = `paper-viewer.html?id=${paperId}`;
    };

    // ========== CITE PAPER ==========
    window.citePaper = function(paperId) {
        if (navigator.vibrate) navigator.vibrate(20);
        
        const paper = allPapers.find(p => p.id === paperId);
        if (!paper) return;

        const authors = Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors;
        const year = new Date(paper.date).getFullYear();
        const citation = `${authors}. (${year}). ${paper.title}. ${paper.institution || ''}.`;

        const textarea = document.createElement('textarea');
        textarea.value = citation;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            showToast('Citation copied to clipboard!');
        } catch (err) {
            alert('Citation:\\n\\n' + citation);
        }
        
        document.body.removeChild(textarea);
    };

    // ========== SHOW TOAST ==========
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: rgba(205, 92, 92, 0.95);
            color: #fff;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(),2500);
    }

    // ========== EVENT LISTENERS ==========
    statusFilters.forEach(chip => {
        chip.addEventListener('click', function() {
            statusFilters.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterByStatus(this.dataset.status);
        });
    });

    searchInput.addEventListener('input', function() {
        filteredPapers = [...allPapers];
        filterByStatus(currentFilter);
    });

    // ========== INITIALIZATION ==========
    loadPapers();

})();
