/**
 * programming-listing.js
 * Mobile — A3KM Studio / Content Studio / Programming
 * Loads programs.json, handles filters, renders cards.
 */

(function () {
  'use strict';

  /* ─── State ─── */
  let allPrograms = [];
  let activeLang = 'all';
  let activeDiff = 'all';
  let searchQuery = '';
  let sortMode = 'newest';

  /* ─── Language meta ─── */
  const LANG_ICON = {
    python:     { icon: 'fab fa-python',           cls: 'python'     },
    javascript: { icon: 'fab fa-js-square',        cls: 'javascript' },
    cpp:        { icon: 'fas fa-code',              cls: 'cpp'        },
    java:       { icon: 'fab fa-java',              cls: 'java'       },
    c:          { icon: 'fas fa-copyright',         cls: 'c'          },
    matlab:     { icon: 'fas fa-chart-line',        cls: 'matlab'     },
  };

  /* ─── Bootstrap ─── */
  document.addEventListener('DOMContentLoaded', () => {
    loadPrograms();
    bindSearch();
    bindChips('langChips',  (v) => { activeLang = v; applyFilters(); });
    bindChips('diffChips',  (v) => { activeDiff = v; applyFilters(); });
  });

  /* ─── Load JSON ─── */
  function loadPrograms() {
    fetch('../../../Projects%20Code/programming/programs.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then((data) => {
        allPrograms = Array.isArray(data.programs) ? data.programs : [];
        applyFilters();
      })
      .catch(() => {
        document.getElementById('programsList').innerHTML =
          '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i>' +
          '<p>Failed to load programs.<br>Please refresh.</p></div>';
      });
  }

  /* ─── Chip binding ─── */
  function bindChips(rowId, onChange) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        row.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.dataset.lang || chip.dataset.diff || 'all';
        onChange(val);
      });
    });
  }

  /* ─── Search binding ─── */
  function bindSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = input.value.trim().toLowerCase();
        applyFilters();
      }, 250);
    });
  }

  /* ─── Filter & Sort ─── */
  function applyFilters() {
    sortMode = document.getElementById('sortSelect')?.value || 'newest';

    let result = allPrograms.slice();

    /* Language filter */
    if (activeLang !== 'all') {
      result = result.filter((p) => p.language === activeLang);
    }

    /* Difficulty filter */
    if (activeDiff !== 'all') {
      result = result.filter((p) => p.difficulty && p.difficulty.toLowerCase() === activeDiff);
    }

    /* Search filter */
    if (searchQuery) {
      result = result.filter((p) =>
        (p.title || '').toLowerCase().includes(searchQuery) ||
        (p.description || '').toLowerCase().includes(searchQuery) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(searchQuery))) ||
        (p.category || '').toLowerCase().includes(searchQuery)
      );
    }

    /* Sort */
    switch (sortMode) {
      case 'title-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'difficulty-asc':
        result.sort((a, b) => (a.difficultyLevel || 1) - (b.difficultyLevel || 1));
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => {
          if (a.id && b.id) return b.id.localeCompare(a.id);
          return 0;
        });
        break;
    }

    /* Update count */
    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = result.length;

    renderPrograms(result);
  }

  /* expose so the sort <select> onchange can call it */
  window.applyFilters = applyFilters;

  /* ─── Render ─── */
  function renderPrograms(programs) {
    const list = document.getElementById('programsList');
    if (!list) return;

    if (programs.length === 0) {
      list.innerHTML =
        '<div class="empty-state">' +
        '<i class="fas fa-search-minus"></i>' +
        '<p>No programs match your filter.</p>' +
        '</div>';
      return;
    }

    list.innerHTML = programs.map(buildCard).join('');
  }

  /* ─── Card builder ─── */
  function buildCard(p) {
    const lang     = (p.language || 'python').toLowerCase();
    const diff     = (p.difficulty || 'Easy').toLowerCase();
    const title    = esc(p.title || 'Untitled');
    const desc     = esc(p.description || '');
    const tags     = Array.isArray(p.tags) ? p.tags.slice(0, 4) : [];
    const featured = p.featured ? '<span class="card-badge featured"><i class="fas fa-star"></i> Featured</span>' : '';
    const canRun   = p.canRunInBrowser !== false && (lang === 'python' || lang === 'javascript');
    const runBtn   = canRun
      ? `<button class="btn-run" onclick="openProgram('${p.id}',true)"><i class="fas fa-play"></i> Run</button>`
      : `<button class="btn-run" disabled title="Not runnable in browser"><i class="fas fa-ban"></i> Run</button>`;

    const langMeta  = LANG_ICON[lang] || { icon: 'fas fa-code', cls: 'cpp' };
    const diffBadge = `<span class="card-badge ${diff}">${ucFirst(diff)}</span>`;

    let sourceBadge = '';
    if (p.source === 'leetcode' && p.problemNumber) {
      sourceBadge = `<span class="card-badge source">LC #${p.problemNumber}</span>`;
    } else if (p.source) {
      sourceBadge = `<span class="card-badge source">${esc(p.source)}</span>`;
    }

    let tagsHtml = '';
    if (tags.length) {
      tagsHtml = `<div class="card-tags">${tags.map((t) => `<span class="mini-tag">${esc(t)}</span>`).join('')}</div>`;
    }

    let complexityHtml = '';
    if (p.timeComplexity || p.spaceComplexity) {
      complexityHtml = `<div class="card-complexity">`;
      if (p.timeComplexity)  complexityHtml += `<span class="complexity-item"><i class="fas fa-clock"></i> T: ${esc(p.timeComplexity)}</span>`;
      if (p.spaceComplexity) complexityHtml += `<span class="complexity-item"><i class="fas fa-memory"></i> S: ${esc(p.spaceComplexity)}</span>`;
      complexityHtml += `</div>`;
    }

    return `
<div class="program-card" onclick="openProgram('${p.id}', false)">
  <div class="card-top">
    <div class="lang-icon-box ${langMeta.cls}">
      <i class="${langMeta.icon}"></i>
    </div>
    <div class="card-info">
      <div class="card-meta-row">
        ${diffBadge}
        ${sourceBadge}
        ${featured}
      </div>
      <div class="card-title">${title}</div>
      <div class="card-desc">${desc}</div>
    </div>
  </div>
  ${tagsHtml}
  ${complexityHtml}
  <div class="card-actions">
    ${runBtn}
    <button class="btn-view" onclick="event.stopPropagation(); openProgram('${p.id}', false)">
      <i class="fas fa-eye"></i> View
    </button>
  </div>
</div>`;
  }

  /* ─── Navigation ─── */
  window.openProgram = function (id, autoRun) {
    const url = 'code-viewer.html?id=' + encodeURIComponent(id) + (autoRun ? '&run=1' : '');
    window.location.href = url;
  };

  /* ─── Statistics Dashboard ─── */
  function getUserProgress() {
    const saved = localStorage.getItem('programmingProgress');
    return saved ? JSON.parse(saved) : {};
  }

  function calculateStreak(progress) {
    const dates = Object.values(progress)
      .filter((p) => p.solved && p.solvedDate)
      .map((p) => new Date(p.solvedDate).toDateString())
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .sort((a, b) => new Date(b) - new Date(a));

    if (dates.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of dates) {
      const date = new Date(dateStr);
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  function updateMobileStats() {
    const progress = getUserProgress();
    const solved = Object.values(progress).filter((p) => p.solved);

    // Count total solved
    const totalSolved = solved.length;
    document.getElementById('mobileSolved').textContent = totalSolved;

    // Calculate streak
    const streak = calculateStreak(progress);
    document.getElementById('mobileStreak').textContent = streak;

    // Calculate overall progress percentage
    const totalProblems = allPrograms.length || 1;
    const percent = Math.round((totalSolved / totalProblems) * 100);
    document.getElementById('mobileProgressPercent').textContent = `${percent}%`;
    document.getElementById('mobileProgressFill').style.width = `${percent}%`;
  }

  window.toggleStatsExpand = function () {
    // For now, just show a simple alert or could navigate to a detailed stats page
    const progress = getUserProgress();
    const solved = Object.values(progress).filter((p) => p.solved);
    
    const stats = { easy: 0, medium: 0, hard: 0 };
    solved.forEach((p) => {
      if (p.difficulty) {
        const diff = p.difficulty.toLowerCase();
        if (stats[diff] !== undefined) stats[diff]++;
      }
    });

    alert(
      `📊 Your Progress\\n\\n` +
      `Total Solved: ${solved.length}\\n` +
      `Easy: ${stats.easy}\\n` +
      `Medium: ${stats.medium}\\n` +
      `Hard: ${stats.hard}\\n` +
      `Streak: ${calculateStreak(progress)} days`
    );
  };

  /* Call updateMobileStats after programs load */
  const originalLoadPrograms = loadPrograms;
  loadPrograms = function () {
    fetch('../../../Projects%20Code/programming/programs.json')
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then((data) => {
        allPrograms = Array.isArray(data.programs) ? data.programs : [];
        applyFilters();
        updateMobileStats();
      })
      .catch(() => {
        document.getElementById('programsList').innerHTML =
          '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i>' +
          '<p>Failed to load programs.<br>Please refresh.</p></div>';
      });
  };

  /* ─── Helpers ─── */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
})();
