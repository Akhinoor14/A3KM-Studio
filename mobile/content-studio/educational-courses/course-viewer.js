// ============================================================================
// COURSE VIEWER - Educational Course Player (Mobile)
// Loads course from content.json and displays playlist with video player
// ============================================================================

(function() {
    'use strict';

    // ========== STATE ==========
    let allCourses = [];
    let currentCourse = null;
    let currentVideoIndex = 0;
    let durCache = {};  // videoId → real duration from YouTube API
    let autoAdvanceTimer = null;  // cancellable auto-advance on episode end

    // ========== YOUTUBE API HELPERS ==========
    function getApiKey() {
        return localStorage.getItem('youtube_api_key') || '';
    }

    function parseDuration(iso) {
        if (!iso) return '';
        const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!m) return '';
        const h = parseInt(m[1]||0), min = parseInt(m[2]||0), s = parseInt(m[3]||0);
        return h > 0 ? `${h}:${String(min).padStart(2,'0')}:${String(s).padStart(2,'0')}`
                     : `${min}:${String(s).padStart(2,'0')}`;
    }

    async function fetchDurations(videoIds) {
        const apiKey = getApiKey();
        if (!apiKey || !videoIds.length) return {};
        const result = {};
        for (let i = 0; i < videoIds.length; i += 50) {
            const chunk = videoIds.slice(i, i + 50);
            try {
                const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk.join(',')}&key=${apiKey}`;
                const res = await fetch(url);
                if (!res.ok) continue;
                const data = await res.json();
                (data.items || []).forEach(item => {
                    const dur = parseDuration(item.contentDetails?.duration);
                    if (dur) result[item.id] = dur;
                });
            } catch(e) { /* API unavailable, fall back to JSON duration */ }
        }
        return result;
    }

    async function refreshDurations() {
        if (!currentCourse?.playlist?.length) return;
        const ids = currentCourse.playlist.map(v => v.videoId).filter(Boolean);
        if (!ids.length || !getApiKey()) return;
        const fetched = await fetchDurations(ids);
        if (Object.keys(fetched).length) {
            Object.assign(durCache, fetched);
            renderPlaylist();
            // Also refresh duration chip in the episode info panel
            const curVid = currentCourse.playlist[currentVideoIndex];
            if (curVid) renderEpisodeInfo(curVid, currentVideoIndex);
            console.log(`✅ Course Viewer (mobile): refreshed ${Object.keys(fetched).length} durations`);
        }
    }

    // ========== DOM ELEMENTS ==========
    const courseInfo      = document.getElementById('courseInfo');
    const playlistSection = document.getElementById('playlistSection');
    const shareBtn        = document.getElementById('shareBtn');
    const epInfoPanel     = document.getElementById('epInfoPanel');
    const epTag           = document.getElementById('epTag');
    const epTitle         = document.getElementById('epTitle');
    const epMeta          = document.getElementById('epMeta');
    const epPdfBtn        = document.getElementById('epPdfBtn');
    const prevBtn         = document.getElementById('prevBtn');
    const nextBtn         = document.getElementById('nextBtn');
    const progressBadge   = document.getElementById('progressBadge');
    const relatedSection  = document.getElementById('relatedSection');
    const relatedGrid     = document.getElementById('relatedGrid');
    const vpPlaceholder   = document.getElementById('vpPlaceholder');

    // ========== WATCH PROGRESS ==========
    function getCourseKey() {
        return 'cw_' + getCourseIdFromUrl();
    }
    function getWatched() {
        try { return JSON.parse(localStorage.getItem(getCourseKey()) || '[]'); }
        catch(e) { return []; }
    }
    function markWatched(idx) {
        const arr = getWatched();
        if (!arr.includes(idx)) {
            arr.push(idx);
            localStorage.setItem(getCourseKey(), JSON.stringify(arr));
        }
    }

    // ========== AUTO-ADVANCE / EPISODE ENDED ==========
    window._onEpEnded = function() {
        markWatched(currentVideoIndex);
        renderPlaylist();  // refresh watched ticks
        const next = currentVideoIndex + 1;
        if (currentCourse && next < currentCourse.playlist.length) {
            autoAdvanceTimer = setTimeout(() => loadVideo(next), 1800);
        }
    };

    // ========== INITIALIZATION ==========
    document.addEventListener('DOMContentLoaded', () => {
        loadCoursesFromJSON();
    });

    /**
     * Load courses from central content.json
     */
    async function loadCoursesFromJSON() {
        try {
            const response = await fetch('../../../Content%20Code/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allCourses = data['educational-courses'] || [];
            console.log(`📚 Loaded ${allCourses.length} courses`);
            
            loadCourse();

            // Fetch real durations from YouTube API after rendering
            refreshDurations();
        } catch (error) {
            console.error('❌ Failed to load courses:', error);
            showError('Failed to load course. Please check your connection.');
        }
    }

    /**
     * Get course ID from URL parameters
     */
    function getCourseIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || 'course-001';
    }

    /**
     * Load and render the current course
     */
    function loadCourse() {
        const courseId = getCourseIdFromUrl();
        currentCourse = allCourses.find(c => c.id === courseId);

        if (!currentCourse) {
            showError('Course not found');
            return;
        }

        console.log(`\uD83D\uDCD6 Loading course: ${currentCourse.title}`);
        document.title = `${currentCourse.title} – A3KM Studio`;

        // Load first video + render all panels
        if (currentCourse.playlist?.length > 0) {
            loadVideo(0);          // loads player, ep-info, playlist
        } else {
            showNoVideos();
        }

        renderCourseInfo();
        renderRelated();
        setupEventListeners();
    }

    /**
     * Load video by index — delegates to gesture engine IFrame API bridge
     */
    function loadVideo(index) {
        if (!currentCourse?.playlist?.length) { showNoVideos(); return; }
        clearTimeout(autoAdvanceTimer);  // cancel any pending auto-advance
        autoAdvanceTimer = null;
        currentVideoIndex = index;
        const video = currentCourse.playlist[index];

        // Show placeholder with thumbnail while loading
        if (vpPlaceholder) {
            vpPlaceholder.classList.remove('hidden');
            const thumbUrl = video.thumbnail ||
                (video.videoId ? `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg` : '');
            if (thumbUrl) vpPlaceholder.style.background =
                `linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)), url('${thumbUrl}') center/cover no-repeat`;
        }

        if (video.videoId) {
            // Use gesture engine's YT.Player (defined in course-viewer.html inline script)
            if (typeof window._initYTPlayer === 'function') {
                window._initYTPlayer(video.videoId);
            } else {
                // YT API not ready yet — wait and retry
                const poll = setInterval(() => {
                    if (typeof window._initYTPlayer === 'function') {
                        clearInterval(poll);
                        window._initYTPlayer(video.videoId);
                    }
                }, 150);
                setTimeout(() => clearInterval(poll), 8000);
            }
        } else {
            showNoVideos();
        }

        // Update episode info panel
        renderEpisodeInfo(video, index);

        // Set MediaSession metadata + PiP title
        if (typeof window._setPipMeta === 'function') {
            const pipThumb = video.thumbnail ||
                (video.videoId ? 'https://img.youtube.com/vi/' + video.videoId + '/hqdefault.jpg' : '');
            window._setPipMeta(video.title || currentCourse.title, pipThumb);
        }

        // Sync PiP player if it's open (episode changed while PiP active)
        if (typeof window._pipReloadVideo === 'function' && video.videoId) {
            window._pipReloadVideo(video.videoId, video.title || currentCourse.title);
        }

        // Sync playlist highlight + scroll
        renderPlaylist();

        // Update header progress
        if (progressBadge && currentCourse.playlist.length) {
            const title = currentCourse.title.length > 24
                ? currentCourse.title.slice(0, 22) + '…'
                : currentCourse.title;
            progressBadge.textContent = `${title}  •  ${index + 1} / ${currentCourse.playlist.length}`;
        }

        if (navigator.vibrate) navigator.vibrate(6);

        // ── Build Prev/Next navigation for episode playlist ─────────────────
        (function buildEpNavigation() {
            const pl      = (currentCourse && currentCourse.playlist) ? currentCourse.playlist : [];
            const atFirst = index <= 0;
            const atLast  = pl.length === 0 || index >= pl.length - 1;
            window._prevVideo = atFirst ? null : function() { loadVideo(index - 1); };
            window._nextVideo = atLast  ? null : function() { loadVideo(index + 1); };
            (function applyNavBtns() {
                if (typeof window._updateNavBtns === 'function') {
                    window._updateNavBtns(atFirst, atLast);
                } else {
                    setTimeout(applyNavBtns, 200);
                }
            })();
        })();
    }

    /**
     * Show no videos message via placeholder
     */
    function showNoVideos() {
        if (vpPlaceholder) {
            vpPlaceholder.classList.remove('hidden');
            vpPlaceholder.innerHTML = '<i class="fas fa-video-slash" style="font-size:48px;color:#ff9800;"></i><p style="color:rgba(255,255,255,0.5);margin-top:10px;font-size:13px;">Course videos coming soon…</p>';
        }
    }

    /**
     * Render episode info panel (title, meta chips, PDF button, Prev/Next)
     */
    function renderEpisodeInfo(video, idx) {
        if (!epInfoPanel) return;
        epInfoPanel.style.display = 'block';

        const total = currentCourse.playlist.length;
        epTag.innerHTML = `<i class="fas fa-play"></i> Episode ${idx + 1} of ${total}`;
        epTitle.textContent = video.title || `Episode ${idx + 1}`;

        // Meta chips
        const dur = durCache[video.videoId] || video.duration || '';
        const chips = [
            dur ? `<span class="ep-meta-chip"><i class="fas fa-clock"></i>${dur}</span>` : '',
            currentCourse.instructor ? `<span class="ep-meta-chip"><i class="fas fa-chalkboard-teacher"></i>${currentCourse.instructor}</span>` : '',
            currentCourse.difficulty ? `<span class="ep-meta-chip"><i class="fas fa-signal"></i>${currentCourse.difficulty}</span>` : '',
        ].filter(Boolean).join('');
        epMeta.innerHTML = chips;

        // PDF button
        const pdfUrl = video.lecturePdf?.downloadUrl || video.pdfUrl || '';
        if (pdfUrl && epPdfBtn) {
            epPdfBtn.href = pdfUrl;
            epPdfBtn.classList.add('show');
        } else if (epPdfBtn) {
            epPdfBtn.classList.remove('show');
        }

        // Prev / Next buttons
        if (prevBtn) prevBtn.disabled = idx <= 0;
        if (nextBtn) nextBtn.disabled = idx >= total - 1;

        // Wire Prev/Next (re-bind each time to update index capture)
        if (prevBtn) {
            prevBtn.onclick = () => { if (idx > 0) loadVideo(idx - 1); };
        }
        if (nextBtn) {
            nextBtn.onclick = () => { if (idx < total - 1) loadVideo(idx + 1); };
        }
    }

    /**
     * Render related courses (same category) at the bottom
     */
    function renderRelated() {
        if (!relatedSection || !relatedGrid) return;
        const cat = currentCourse.category || '';
        const related = allCourses
            .filter(c => c.id !== currentCourse.id && (c.category || '') === cat)
            .slice(0, 6);
        if (!related.length) return;

        relatedSection.style.display = 'block';
        relatedGrid.innerHTML = related.map(c => {
            const diff  = (c.difficulty || 'beginner').toLowerCase();
            const dLabel = diff.charAt(0).toUpperCase() + diff.slice(1);
            const thumb  = c.playlist?.[0]?.videoId
                ? `https://img.youtube.com/vi/${c.playlist[0].videoId}/mqdefault.jpg`
                : (c.thumbnail || '');
            const eps  = c.episodes || c.playlist?.length || 0;
            const lang = c.language === 'bn' ? 'BN' : 'EN';
            return `
            <div class="rel-card" data-course-id="${c.id}">
                <div class="rel-thumb">
                    ${thumb ? `<img src="${thumb}" alt="${c.title}" loading="lazy">` : ''}
                    <span class="rel-diff ${diff}">${dLabel}</span>
                </div>
                <div class="rel-info">
                    <div class="rel-title">${c.title}</div>
                    <div class="rel-meta">
                        <span><i class="fas fa-list-ol"></i>${eps} ep</span>
                        <span class="rel-lang">${lang}</span>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    /**
     * Render course title / stats below episode panel
     */
    function renderCourseInfo() {
        const languageDisplay = getLanguageDisplay(currentCourse.language);
        
        courseInfo.innerHTML = `
            <h1 class="course-title">${currentCourse.title}</h1>
            <div class="course-stats">
                <span><i class="fas fa-video"></i> ${currentCourse.episodes} episodes</span>
                <span><i class="fas fa-clock"></i> ${currentCourse.duration}</span>
                <span><i class="fas fa-signal"></i> ${currentCourse.difficulty}</span>
                <span><i class="fas fa-language"></i> ${languageDisplay}</span>
            </div>
            <p class="course-desc">${currentCourse.description}</p>
            ${currentCourse.instructor ? `
            <div style="margin-top: 12px; padding: 12px; background: rgba(255, 152, 0, 0.05); border-radius: 8px; border: 1px solid rgba(255, 152, 0, 0.2);">
                <span style="font-size: 12px; color: var(--text-dim); display: block; margin-bottom: 4px;">Instructor</span>
                <strong style="color: #ff9800; font-size: 14px;">${currentCourse.instructor}</strong>
                ${currentCourse.institution ? `<span style="color: var(--text-dim); font-size: 12px; margin-left: 8px;">• ${currentCourse.institution}</span>` : ''}
            </div>
            ` : ''}
        `;
    }

    /**
     * Render playlist with episode numbers, watched ticks, auto-scroll to active
     */
    function renderPlaylist() {
        if (!currentCourse.playlist || currentCourse.playlist.length === 0) {
            playlistSection.innerHTML = `
                <h3>Course Content</h3>
                <div style="text-align:center;padding:40px 20px;color:var(--text-dim);">
                    <i class="fas fa-list-ul" style="font-size:32px;margin-bottom:12px;display:block;"></i>
                    <p>Course episodes will be added soon</p>
                </div>
            `;
            return;
        }

        const watched = getWatched();
        const total   = currentCourse.playlist.length;

        playlistSection.innerHTML = `
            <h3>Playlist &mdash; <span style="color:rgba(204,0,0,0.85);">${total}</span> episodes</h3>
            ${currentCourse.playlist.map((video, idx) => {
                const isActive  = idx === currentVideoIndex;
                const isWatched = watched.includes(idx) && !isActive;
                const hasPdf    = !!(video.lecturePdf?.downloadUrl || video.pdfUrl);
                const thumb     = video.videoId
                    ? `https://img.youtube.com/vi/${video.videoId}/default.jpg`
                    : '';
                const dur = durCache[video.videoId] || video.duration || '';
                return `
                <div class="playlist-item ${isActive ? 'active' : ''} ${isWatched ? 'watched' : ''}"
                     id="pl-${idx}" data-index="${idx}">
                    <div class="pl-num">${idx + 1}</div>
                    <div class="playlist-thumb">
                        ${thumb ? `<img src="${thumb}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
                    </div>
                    <div class="playlist-info">
                        <h4>${video.title || `Episode ${idx + 1}`}</h4>
                        <div class="pl-meta-row">
                            <p><i class="fas fa-clock" style="color:#CC0000;font-size:9px;"></i> ${dur}</p>
                            ${hasPdf ? '<span class="pl-pdf-dot" title="PDF available"></span>' : ''}
                        </div>
                    </div>
                </div>`;
            }).join('')}
        `;

        addPlaylistListeners();

        // Auto-scroll active item into view
        setTimeout(() => {
            const activeEl = document.getElementById(`pl-${currentVideoIndex}`);
            if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
    }

    /**
     * Get language display text
     */
    function getLanguageDisplay(lang) {
        const displays = {
            'bn': '🇧🇩 বাংলা',
            'en': '🇬🇧 English',
            'bn-en': '🇧🇩 বাংলা + 🇬🇧 English',
            'en-bn': '🇬🇧 English + 🇧🇩 বাংলা'
        };
        return displays[lang] || 'English';
    }

    /**
     * Show error message
     */
    function showError(message) {
        if (vpPlaceholder) {
            vpPlaceholder.classList.remove('hidden');
            vpPlaceholder.innerHTML = `
                <div style="text-align:center;padding:0 20px;">
                    <i class="fas fa-exclamation-circle" style="font-size:48px;color:#CC0000;margin-bottom:16px;"></i>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin-bottom:16px;">${message}</p>
                    <a href="course-listing.html" style="display:inline-block;padding:9px 18px;background:#CC0000;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Back to Courses</a>
                </div>`;
        }
    }

    /**
     * Add playlist item event listeners
     */
    function addPlaylistListeners() {
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                if (navigator.vibrate) navigator.vibrate(8);
                loadVideo(index);
            });
            // touchstart handled by CSS :active for visual feedback only
        });
    }

    /**
     * Handle share button
     */
    function handleShare() {
        if (navigator.vibrate) navigator.vibrate(10);

        if (navigator.share && currentCourse) {
            navigator.share({
                title: currentCourse.title,
                text: `Check out this course: ${currentCourse.title}`,
                url: window.location.href
            }).catch(err => {
                console.log('Share cancelled or failed:', err);
            });
        } else {
            showToast('Sharing...');
        }
    }

    /**
     * Show toast notification
     */
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);padding:12px 24px;background:rgba(255,152,0,0.95);color:#fff;border-radius:8px;font-size:13px;font-weight:600;z-index:10000;';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Related course cards — delegated click with fade transition
        if (relatedGrid) {
            relatedGrid.addEventListener('click', function(e) {
                const card = e.target.closest('.rel-card');
                if (!card) return;
                const id = card.getAttribute('data-course-id');
                if (!id) return;
                document.body.style.transition = 'opacity 0.18s ease';
                document.body.style.opacity = '0';
                setTimeout(function() { location.href = 'course-viewer.html?id=' + id; }, 190);
            });
        }

        // Share button
        if (shareBtn) {
            shareBtn.addEventListener('click', handleShare);
            shareBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }

        // Back button haptic
        const backBtn = document.querySelector('.back-btn');
        if (backBtn) {
            backBtn.addEventListener('touchstart', () => {
                if (navigator.vibrate) navigator.vibrate(10);
            });
        }
    }

    // Listen for API key update from Only-boss → re-fetch durations live
    window.addEventListener('storage', (e) => {
        if (e.key === 'youtube_api_key' && e.newValue) {
            refreshDurations();
            console.log('✅ Course Viewer (mobile): API key updated, refreshing durations');
        }
    });

    // Auto-refresh durations every 30 minutes
    setInterval(() => {
        durCache = {};
        refreshDurations();
        console.log('🔄 Course Viewer (mobile): auto-refreshed durations');
    }, 1800000); // 30 minutes

})();
