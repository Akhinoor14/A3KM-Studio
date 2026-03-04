---
title: "Video Player Advanced Features — Desktop & Mobile"
description: "Complete reference for all advanced video player features: keyboard shortcuts, cinema mode, custom controls bar, sticky mini player, Document PiP, MediaSession API, gesture engine, mobile overlay controls, and keyboard hint toast — covering both desktop and mobile viewers."
date: 2026-03-05
lastUpdated: 2026-03-05
version: "1.0.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: video-media
difficulty: intermediate
readTime: "20 min"
tags: [video-player, keyboard-shortcuts, cinema-mode, pip, sticky-player, mediasession, mobile, gesture, controls]
status: complete
featured: true
prerequisites:
  - "YouTube IFrame Player API"
  - "Basic JavaScript / HTML / CSS"
relatedDocs:
  - "youtube-video-system.md"
  - "../04-content-management/content-studio-system.md"
---

# 🎬 Video Player Advanced Features

> **Overview:** এই document-এ A3KM Studio-র সমস্ত advanced video player feature-এর সম্পূর্ণ description আছে — desktop ও mobile উভয় viewer-এর জন্য। সব feature আলাদা section-এ বিস্তারিত explain করা হয়েছে।

---

## 📂 File Structure

```
Content Studio/
├── video-content/
│   └── video-viewer.html          ← Desktop: Video Blogs viewer
└── educational-videos/
    └── course-viewer-new.html     ← Desktop: Course/Episode viewer

mobile/content-studio/
├── video-blogs/
│   ├── video-viewer.html          ← Mobile: Video Blogs viewer
│   └── video-viewer.js            ← Mobile: Video Blogs JS logic
└── educational-courses/
    ├── course-viewer.html         ← Mobile: Course viewer
    └── course-viewer.js           ← Mobile: Course JS logic
```

---

## 🖥️ Desktop Features

Desktop viewer দুটো ফাইলে implement করা হয়েছে:
- **`video-content/video-viewer.html`** — Video Blogs
- **`educational-videos/course-viewer-new.html`** — Educational Courses

দুটো ফাইলে একই feature-set আছে, শুধু navigation function আলাদা:
- Video Blogs: `playPreviousVideo()` / `playNextVideo()`
- Course Viewer: `goEp(currentEpIdx - 1)` / `goEp(currentEpIdx + 1)`

---

### 1. ⌨️ Keyboard Shortcuts

#### সব Shortcut-এর তালিকা

| Key | Action | Notes |
|-----|--------|-------|
| `Space` / `K` | Play / Pause | YouTube-style |
| `F` | Fullscreen toggle | `.player-wrapper` কে fullscreen করে |
| `T` | Cinema Mode toggle | Playlist hide করে, player wide হয় |
| `M` | Mute / Unmute | Volume icon update হয় |
| `←` | Seek −5 seconds | `preventDefault` করে scroll block |
| `→` | Seek +5 seconds | `preventDefault` করে scroll block |
| `J` | Seek −10 seconds | YouTube-style |
| `L` | Seek +10 seconds | YouTube-style |
| `↑` | Volume +5% | Volume slider sync হয় |
| `↓` | Volume −5% | Volume slider sync হয় |
| `N` | Next video/episode | |
| `Shift + N` | Previous video/episode | |
| `P` | Picture in Picture | Document PiP → fallback sticky mini |
| `?` (Shift+/) | Toggle shortcuts overlay | |
| `0` – `9` | Jump to 0% – 90% | 5 = 50% of total duration |
| `Escape` | Close overlay / exit cinema | |

#### Implementation

```javascript
document.addEventListener('keydown', e => {
  // Guard: input fields এ কিছু না করা
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'
      || e.target.isContentEditable) return;
  if (!ytPlayer) return;

  switch (e.code) {
    case 'Space': case 'KeyK':
      e.preventDefault(); dcTogglePlay(); break;
    case 'ArrowLeft':
      e.preventDefault();
      ytPlayer.seekTo(Math.max(0, ytPlayer.getCurrentTime() - 5), true); break;
    // ... etc
  }
});
```

> **Guard rule:** `INPUT`, `TEXTAREA`, বা `contenteditable` element focus-এ থাকলে shortcut কাজ করে না — typing block হয় না।

---

### 2. 🎭 Cinema / Theater Mode

#### কী করে
- Playlist sidebar hide হয়ে যায়
- Player section full width নেয়
- Session জুড়ে persist করে (`sessionStorage`)

#### CSS Classes

```css
body.cinema-mode .main-container {
  grid-template-columns: 1fr !important;  /* 2-col → 1-col */
}
body.cinema-mode .playlist-section {
  display: none !important;
}
```

#### Toggle Function

```javascript
function toggleCinemaMode() {
  const on = document.body.classList.toggle('cinema-mode');
  sessionStorage.setItem('cinemaModeOn', on ? '1' : '0');

  // Button icon + title update
  const btn = document.getElementById('dcTheater');
  btn.classList.toggle('active', on);
  btn.querySelector('i').className = on ? 'fas fa-compress-alt' : 'fas fa-expand-alt';
}
```

#### Restore on page load

```javascript
// initDesktopControls() এর ভেতরে:
if (sessionStorage.getItem('cinemaModeOn') === '1') {
  document.body.classList.add('cinema-mode');
  // button update...
}
```

#### Trigger
- Keyboard: `T`
- Button: Controls bar-এর ⬜ (expand-alt) icon
- `Escape` press করলে cinema mode থেকে বের হয়

---

### 3. 🎮 Custom Controls Bar

YouTube-এর default controls-এর নিচে একটা extra controls bar যোগ করা হয়েছে।

#### Layout

```
[━━━━━━━●━━━━━━━━━━━━━━━]  0:45 / 12:30
[⏮] [⏸] [⏭] [🔊 ━━━━●] [spacer] [1x▾] [⬜] [⧉] [⌨] [⛶]
```

#### Elements

| Element | ID | Description |
|---------|----|-------------|
| Progress bar | `dcProgress` | Click-to-seek, fill shows position |
| Progress fill | `dcProgressFill` | Width `%` = current/duration |
| Timestamp | `dcTime` | `0:45 / 12:30` format |
| Prev button | `dcPrev` | Previous video/episode |
| Play/Pause | `dcPlay` | Icon changes: `fa-play` ↔ `fa-pause` |
| Next button | `dcNext` | Next video/episode |
| Mute button | `dcMute` | Icon: volume-up / volume-down / volume-mute |
| Volume slider | `dcVolume` | `input[type=range]` 0–100 |
| Speed button | `dcSpeedBtn` | Dropdown: 0.25×, 0.5×, 0.75×, 1×, 1.25×, 1.5×, 2× |
| Cinema button | `dcTheater` | `expand-alt` / `compress-alt` |
| PiP button | `dcPip` | Opens Document PiP or sticky mini |
| Keyboard button | `dcKbd` | Opens shortcut overlay |
| Fullscreen | `dcFs` | Fullscreen `.player-wrapper` |

#### Progress Bar — Click to Seek

```javascript
progressEl.addEventListener('click', evt => {
  const rect = progressEl.getBoundingClientRect();
  const dur  = ytPlayer.getDuration() || 0;
  if (dur) ytPlayer.seekTo(((evt.clientX - rect.left) / rect.width) * dur, true);
});
```

#### Polling (500ms interval)

```javascript
setInterval(() => {
  const cur   = ytPlayer.getCurrentTime() || 0;
  const dur   = ytPlayer.getDuration()    || 0;
  const state = ytPlayer.getPlayerState();

  // Progress fill
  document.getElementById('dcProgressFill').style.width = (cur / dur * 100) + '%';

  // Timestamp
  document.getElementById('dcTime').textContent = `${fmtSec(cur)} / ${fmtSec(dur)}`;

  // Play/Pause icon sync
  const isPaused = state !== YT.PlayerState.PLAYING;
  document.querySelector('#dcPlay i').className = isPaused ? 'fas fa-play' : 'fas fa-pause';
}, 500);
```

#### Speed Dropdown

```javascript
const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
// Click on speed option:
ytPlayer.setPlaybackRate(spd);
btn.firstChild.nodeValue = `${spd}x`; // label update
```

---

### 4. 📌 Sticky Mini Player

#### কী করে
Player scroll করে উপরে চলে গেলে নিচে-ডানে একটা ছোট fixed player দেখায়।

#### IntersectionObserver

```javascript
function initStickyMiniPlayer() {
  const playerWrap = document.querySelector('.player-wrapper'); // or #playerWrapper
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && currentVideoId) {
        // Show mini player with thumbnail iframe
        miniEl.classList.add('visible');
      } else {
        // Hide + clear iframe
        miniEl.classList.remove('visible');
        document.getElementById('stickyMiniWrap').innerHTML = '';
      }
    });
  }, { threshold: 0 });
  obs.observe(playerWrap);
}
```

#### Mini Player Structure

```html
<div class="sticky-mini" id="stickyMini">
  <div class="sticky-mini-iframe-wrap" id="stickyMiniWrap">
    <!-- iframe dynamically injected -->
  </div>
  <div class="sticky-mini-controls">
    [⏮] [⏸] [⏭]  [title...]  [↑ scroll-to]  [✕ close]
  </div>
</div>
```

#### Size & Position
```css
.sticky-mini {
  position: fixed;
  bottom: 24px; right: 24px;
  width: 320px;          /* 16:9 = 320×180 */
  z-index: 9000;
}
.sticky-mini-iframe-wrap {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 ratio */
}
```

> **Note:** Sticky mini-তে `pointer-events: none` দেওয়া আছে iframe-এ, কারণ এটা thumbnail/preview মাত্র। Control করতে ⏮⏸⏭ buttons ব্যবহার করতে হয়।

#### Close করলে
```javascript
function closeStickyMini() {
  document.getElementById('stickyMini').classList.remove('visible');
  document.getElementById('stickyMiniWrap').innerHTML = ''; // iframe destroy
  ytPlayer?.pauseVideo();
}
```

---

### 5. ⧉ Document Picture-in-Picture (PiP)

#### Browser Support
- ✅ Chrome 116+ — `documentPictureInPicture` API সরাসরি কাজ করে
- ⚠️ Firefox / Safari — Fallback: Sticky Mini Player দেখায়

#### Flow

```
User presses P or clicks ⧉
       ↓
'documentPictureInPicture' in window?
  ├── YES → requestWindow({ width: 560, height: 340 })
  │         → Create <iframe> inside PiP window
  │         → autoplay=1 দিয়ে video চালু
  └── NO  → Show Sticky Mini Player (fallback)
```

#### Implementation

```javascript
async function dcOpenPiP() {
  if ('documentPictureInPicture' in window) {
    try {
      const pipWin = await window.documentPictureInPicture
        .requestWindow({ width: 560, height: 340 });

      // PiP window styling
      pipWin.document.documentElement.style.cssText = 'margin:0;padding:0;background:#000;';
      pipWin.document.body.style.cssText =
        'margin:0;padding:0;position:relative;height:100vh;background:#000;';

      // Inject YouTube iframe
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
      iframe.style.cssText = 'position:absolute;width:100%;height:100%;border:none;';
      iframe.allow = 'autoplay; fullscreen';
      pipWin.document.body.appendChild(iframe);
    } catch(err) {
      // Fallback to sticky mini
    }
  }
}
```

> **Course Viewer-এ extra:** `_pipReloadVideo(videoId)` function আছে — episode change হলে PiP window-এও নতুন video load হয়।

---

### 6. 🎵 MediaSession API

Hardware media keys (keyboard-এর ⏮ ⏸ ⏭) এবং notification area controls support করার জন্য।

#### কখন call হয়
- Video Viewer: `playVideo()` function-এর শেষে
- Course Viewer: `loadEpisode()` function-এর ভেতরে

#### Implementation

```javascript
function updateMediaSession(title, thumbnail) {
  if (!('mediaSession' in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title:   title  || 'Video',
    artist:  'A3KM Studio',
    artwork: thumbnail
      ? [{ src: thumbnail, sizes: '480x360', type: 'image/jpeg' }]
      : []
  });

  // Hardware key handlers
  navigator.mediaSession.setActionHandler('play',
    () => ytPlayer?.playVideo());
  navigator.mediaSession.setActionHandler('pause',
    () => ytPlayer?.pauseVideo());
  navigator.mediaSession.setActionHandler('previoustrack',
    () => playPreviousVideo());       // or goEp(currentEpIdx - 1)
  navigator.mediaSession.setActionHandler('nexttrack',
    () => playNextVideo());           // or goEp(currentEpIdx + 1)
}
```

#### Thumbnail source
- Video Viewer: `https://img.youtube.com/vi/{videoId}/mqdefault.jpg`
- Course Viewer: `ytThumb(ep.videoId)` helper function

---

### 7. 💡 Keyboard Hint Toast

#### কী করে
প্রথমবার video play হলে একটা toast notification দেখায় যেটা user-কে জানায় যে keyboard shortcuts available আছে।

#### Behavior
- **Session-এ একবারই** দেখায় (`sessionStorage.kbdHintShown` flag)
- **5 সেকেন্ড** পর auto-dismiss (fade out)
- **Click করলে** সরাসরি shortcut overlay খোলে
- **✕ click করলে** শুধু toast বন্ধ হয়

#### Toast Content

```
⌨  Keyboard shortcuts available    [?]  [✕]
```

#### Implementation

```javascript
function showKbdHint() {
  if (sessionStorage.getItem('kbdHintShown')) return; // already shown
  sessionStorage.setItem('kbdHintShown', '1');

  const t = document.createElement('div');
  t.className = 'kbd-hint-toast';
  t.innerHTML = `
    <i class="fas fa-keyboard"></i>
    Keyboard shortcuts available &nbsp;
    <span class="kbd-hint-key">?</span>
    <span class="kbd-hint-close"><i class="fas fa-times"></i></span>
  `;
  t.addEventListener('click', (e) => {
    if (!e.target.closest('.kbd-hint-close')) toggleKbdOverlay();
    hideKbdHint(t);
  });
  document.body.appendChild(t);

  // Animate in (double rAF for CSS transition to fire)
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));

  // Auto-dismiss
  setTimeout(() => hideKbdHint(t), 5000);
}

function hideKbdHint(t) {
  t.classList.remove('show');
  setTimeout(() => t.remove(), 400); // after fade-out transition
}
```

#### CSS

```css
.kbd-hint-toast {
  position: fixed;
  bottom: 32px; left: 50%;
  transform: translateX(-50%) translateY(20px); /* start below */
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.kbd-hint-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0); /* slide up */
}
```

#### Keyboard Shortcuts Overlay

`?` key বা ⌨ button দিয়ে একটা full overlay খোলে যেখানে সমস্ত shortcut দেখা যায়:

```javascript
function toggleKbdOverlay() {
  document.getElementById('kbdOverlay').classList.toggle('visible');
}
```

---

## 📱 Mobile Features

Mobile viewer দুটো ফাইলে implement করা হয়েছে:
- **`mobile/content-studio/video-blogs/video-viewer.html` + `video-viewer.js`**
- **`mobile/content-studio/educational-courses/course-viewer.html` + `course-viewer.js`**

---

### 8. 👆 Gesture Engine v2

Touch gesture দিয়ে video control করার সিস্টেম।

#### Supported Gestures

| Gesture | Action |
|---------|--------|
| **Single tap** | Player center-এ: Play/Pause toggle |
| **Double tap — left zone** | Seek −10 seconds (ripple shows "−10s") |
| **Double tap — right zone** | Seek +10 seconds (ripple shows "+10s") |
| **Swipe up/down** | Volume +/− (vertical swipe) |
| **Swipe left/right** | Seek backward/forward (horizontal swipe) |
| **Long press** | Playback speed boost (2×) → release করলে normal |

#### Zone Detection

```javascript
// Player width-এর বাম 40% = left zone, ডান 40% = right zone
const zone = touchX < playerWidth * 0.4 ? 'left'
           : touchX > playerWidth * 0.6 ? 'right'
           : 'center';
```

#### Double Tap Detection

```javascript
const now = Date.now();
if (now - lastTap < 300) {
  // Double tap detected
  clearTimeout(singleTapTimer);
  handleDoubleTap(zone);
} else {
  // Schedule single tap (300ms delay)
  singleTapTimer = setTimeout(() => handleSingleTap(), 300);
}
lastTap = now;
```

#### Ripple Animation

Double tap-এ screen-এ ripple effect দেখায়:
```javascript
function showRipple(x, y, label) {
  const ripple = document.createElement('div');
  ripple.className = 'gesture-ripple';
  ripple.textContent = label; // "+10s" or "−10s"
  ripple.style.cssText = `left:${x}px; top:${y}px;`;
  playerWrapper.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}
```

---

### 9. ▶️ Mobile Overlay Controls (Prev/Play/Next)

Player-এর উপর touch করলে একটা overlay দেখায় যেখানে ⏮ ⏸ ⏭ buttons থাকে।

#### Overlay Structure

```html
<div class="vp-overlay" id="vpOverlay">
  <div class="vp-overlay-controls">
    <button class="vp-ov-btn" id="ovPrev">
      <i class="fas fa-step-backward"></i>
    </button>
    <button class="vp-ov-btn vp-ov-play" id="ovPlay">
      <i class="fas fa-pause"></i>
    </button>
    <button class="vp-ov-btn" id="ovNext">
      <i class="fas fa-step-forward"></i>
    </button>
  </div>
</div>
```

#### Behavior
- Player tap করলে overlay দেখায়
- 3 সেকেন্ড পর auto-hide
- Overlay-তে interact করলে timer reset হয়
- Play/Pause button-এর icon real-time update হয় (`fa-play` ↔ `fa-pause`)
- Prev/Next disabled state handle করা হয়

#### Auto-hide

```javascript
let overlayTimer = null;

function showOverlay() {
  overlay.classList.add('visible');
  clearTimeout(overlayTimer);
  overlayTimer = setTimeout(() => overlay.classList.remove('visible'), 3000);
}
```

---

### 10. 📲 Mobile PiP Engine

#### Architecture

```
dcOpenPiP() called
      ↓
'documentPictureInPicture' in window?
  ├── YES (Android Chrome) → Document PiP
  │     → 360×200 window
  │     → YouTube iframe inside
  └── NO (iOS / Firefox) → Draggable Overlay Fallback
        → Position: fixed, bottom-right
        → Draggable via touch events
        → MediaSession controls
```

#### iOS Fallback — Draggable Overlay

```javascript
function openFbOverlay(videoId, title) {
  const overlay = document.createElement('div');
  overlay.className = 'vp-pip-fallback';
  overlay.innerHTML = `
    <div class="pip-drag-handle">⠿ ${title}</div>
    <div class="pip-fb-video">
      <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" ...></iframe>
    </div>
    <div class="pip-fb-controls">
      [⏮] [⏸] [⏭] [✕]
    </div>
  `;
  makeDraggable(overlay); // touch drag logic
  document.body.appendChild(overlay);
}
```

#### Visibility Change Toast

App minimize করলে (visibilitychange event) একটা toast দেখায়:
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden && ytPlayer?.getPlayerState() === YT.PlayerState.PLAYING) {
    showPipToast('Video playing in background');
  }
});
```

#### Course Viewer — Episode Sync

Episode change হলে PiP-ও update হয়:
```javascript
// course-viewer.js → loadVideo() function-এ:
if (window._pipReloadVideo) window._pipReloadVideo(ep.videoId);

// course-viewer.html-এ defined:
window._pipReloadVideo = function(videoId) {
  // PiP window-এর iframe src update করে
};
```

---

## 🔧 Helper Functions

### `fmtSec(seconds)` — Time Formatter

```javascript
function fmtSec(s) {
  s = Math.floor(s || 0);
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
    : `${m}:${String(sec).padStart(2,'0')}`;
}
// fmtSec(75)   → "1:15"
// fmtSec(3661) → "1:01:01"
```

### `dcTogglePlay()` — Safe Play/Pause Toggle

```javascript
function dcTogglePlay() {
  if (!ytPlayer) return;
  ytPlayer.getPlayerState() === YT.PlayerState.PLAYING
    ? ytPlayer.pauseVideo()
    : ytPlayer.playVideo();
}
```

### `dcToggleMute()` — Mute with Icon Sync

```javascript
function dcToggleMute() {
  if (!ytPlayer) return;
  if (ytPlayer.isMuted()) {
    ytPlayer.unMute();
    const vol = ytPlayer.getVolume();
    muteIcon.className = vol < 50 ? 'fas fa-volume-down' : 'fas fa-volume-up';
    document.getElementById('dcVolume').value = vol;
  } else {
    ytPlayer.mute();
    muteIcon.className = 'fas fa-volume-mute';
    document.getElementById('dcVolume').value = 0;
  }
}
```

---

## 🔁 Initialization Flow

### Desktop

```
DOMContentLoaded
  ├── loadVideosData() / init()          ← data fetch
  ├── initDesktopControls()              ← controls bar setup
  │     ├── progress click handler
  │     ├── volume slider handler
  │     ├── speed menu build
  │     ├── theater + pip button bind
  │     ├── sessionStorage cinema restore
  │     └── 500ms polling interval start
  └── initStickyMiniPlayer()             ← IntersectionObserver setup
```

### On Video/Episode Load

```
playVideo(id) / loadEpisode(idx)
  ├── initializePlayer(videoId) / _playVideo(videoId)
  ├── DOM info update (title, meta, tags)
  ├── updateMediaSession(title, thumbnail)
  ├── smTitle update (sticky mini label)
  └── showKbdHint()    ← once per session
```

---

## 🐛 Bug Fixes (এই Session-এ)

### Bug 1 — Mobile `video-viewer.html`: Duplicate `onStateChange` + Missing `onReady`

#### Symptom
Mobile video viewer-এ Prev/Next overlay buttons কাজ করছিল না। state change event আসছিল না সঠিকভাবে।

#### Root Cause
`YT.Player` initialization-এ দুটো সমস্যা ছিল:
- `onStateChange` callback **দুইবার** define হয়েছিল (একটা `events` object-এ, আরেকটা আলাদা)
- `onReady` callback সম্পূর্ণ **missing** ছিল `events` object-এ

```javascript
// ❌ ভুল — আগে যেরকম ছিল:
ytPlayer = new YT.Player('ytPlayer', {
  events: {
    onStateChange: onPlayerStateChange
    // onReady ছিল না!
  }
});
// ... কোথাও আলাদা আরেকটা onStateChange ছিল

// ✅ Fix:
ytPlayer = new YT.Player('ytPlayer', {
  events: {
    onStateChange: onPlayerStateChange,
    onReady: onPlayerReady          // ← এটা যোগ হলো
  }
});
// duplicate টা remove করা হলো
```

#### Impact
- Player ready event fire হচ্ছিল না → `_updateNavBtns()` call হচ্ছিল না → Prev/Next buttons সব সময় disabled থাকছিল

---

### Bug 2 — Mobile `video-viewer.html`: `volHud` Missing Closing `</div>`

#### Symptom
Custom media controls (Prev/Play/Next overlay) screen-এ দেখাচ্ছিল না — completely invisible।

#### Root Cause
`volHud` div-এর closing tag (`</div>`) missing ছিল। এর ফলে সমস্ত media controls HTML `volHud`-এর **ভেতরে nested** হয়ে যাচ্ছিল।

```html
<!-- ❌ ভুল — আগে: -->
<div class="vol-hud" id="volHud">
  <!-- volume display -->
  
  <div class="vp-media-controls">   ← volHud-এর child হয়ে গিয়েছিল
    ...
  </div>

<!-- ✅ Fix: -->
<div class="vol-hud" id="volHud">
  <!-- volume display -->
</div>                               ← ← closing tag যোগ হলো

<div class="vp-media-controls">     ← এখন sibling, সঠিক position-এ
  ...
</div>
```

#### Impact
`volHud` normally `display: none` থাকে। তার ভেতরে nested থাকায় media controls-ও invisible ছিল। `</div>` fix করার পর controls সঠিকভাবে দেখাচ্ছে।

---

### Bug 3 — Mobile `course-viewer.html`: PiP Episode Sync

#### Symptom
PiP window খোলা থাকা অবস্থায় অন্য episode select করলে PiP-এ আগের episode-ই চলতে থাকত। নতুন episode PiP-এ reflect হতো না।

#### Root Cause
PiP window-এর iframe-এর কোনো reference রাখা ছিল না। Episode change হলে PiP update করার কোনো mechanism ছিল না।

#### Fix — তিনটা জিনিস যোগ করা হলো

**1. `pipCurrentVideoId` tracking variable:**
```javascript
let pipCurrentVideoId = null; // currently playing in PiP
```

**2. `pagehide` guard — page unload হলে PiP close:**
```javascript
window.addEventListener('pagehide', () => {
  if (pipCurrentVideoId) {
    // PiP window cleanup
    pipCurrentVideoId = null;
  }
});
```

**3. `window._pipReloadVideo()` — episode change-এ PiP update:**
```javascript
// course-viewer.html-এ:
window._pipReloadVideo = function(videoId) {
  if (!pipCurrentVideoId) return; // PiP খোলা না থাকলে কিছু করার নেই
  pipCurrentVideoId = videoId;
  // PiP iframe-এর src update করে নতুন video load করে
};

// course-viewer.js → loadVideo() function-এর শেষে:
if (window._pipReloadVideo) window._pipReloadVideo(ep.videoId);
```

#### Flow (Fix-এর পর)
```
User selects Episode 3
  └── loadVideo(ep.videoId) called in course-viewer.js
        └── window._pipReloadVideo?.(ep.videoId)
              ├── PiP খোলা না → noop
              └── PiP খোলা → iframe src update → Episode 3 চালু
```

---

## ⚠️ Known Limitations

| Issue | Cause | Workaround |
|-------|-------|------------|
| Volume slider doesn't sync on YT native controls | YouTube API doesn't fire volume change events | Polling প্রতি 500ms
| Document PiP only Chrome 116+ | Browser API limitation | Sticky mini fallback |
| MediaSession action handlers may not fire on all browsers | Browser support varies | Graceful no-op |
| Sticky mini shows muted preview (not main audio) | Separate iframe instance | Click ⏸ in main player separately |
| iOS fullscreen via `requestFullscreen()` not supported | iOS restriction | YouTube native fullscreen button |

---

## 🔑 localStorage / sessionStorage Keys

| Key | Storage | Value | Purpose |
|-----|---------|-------|---------|
| `youtube_api_key` | `localStorage` | API key string | YouTube Data API v3 |
| `watchedVideos` | `localStorage` | JSON array of video IDs | Watched state tracking |
| `cinemaModeOn` | `sessionStorage` | `'1'` or `'0'` | Cinema mode persist per session |
| `kbdHintShown` | `sessionStorage` | `'1'` | Keyboard hint toast — show once |

---

## 🆕 নতুন Feature যোগ করতে হলে

### নতুন Keyboard Shortcut

1. `document.addEventListener('keydown', ...)` block-এ নতুন `case` যোগ করো
2. Shortcut overlay HTML-এ (`#kbdOverlay`) নতুন `.kbd-row` যোগ করো
3. দুটো ফাইলেই (`video-viewer.html` + `course-viewer-new.html`) করতে হবে

### Controls Bar-এ নতুন Button

```html
<!-- dc-btn-row-এর ভেতরে -->
<button class="dc-btn" id="dcNewBtn" title="My Feature (X)" onclick="myFeature()">
  <i class="fas fa-icon-name"></i>
</button>
```

```javascript
// initDesktopControls() এ:
document.getElementById('dcNewBtn').addEventListener('click', myFeature);
```
