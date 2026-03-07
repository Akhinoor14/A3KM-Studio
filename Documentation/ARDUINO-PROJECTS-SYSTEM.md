# Arduino Projects System — Complete Documentation

## Overview

The Arduino Projects system is a full-stack content platform for showcasing, managing, and reading Arduino project documentation. It consists of:

- **Desktop Project Viewer** — `Projects Code/Arduino/arduino-project-viewer.html`
- **Mobile Project Viewer** — `mobile/projects/project-viewer.html` + `project-viewer.js`
- **Project Listing Page** — `Projects Code/Arduino/arduino-projects.html`
- **Documentation Reader** — `Projects Code/Arduino/arduino-doc-reader.html`
- **Admin Manager** — `Only-boss/managers/projects/arduino/arduino-manager.html`
- **Data Source** — `Projects Code/Arduino/arduino-data.json`
- **Project Files Storage** — `Projects Storage/Arduino UNO Projects with Tinkercad/<ProjectFolder>/`

---

## Data Schema — `arduino-data.json`

Each project entry in the `projects` array has this structure:

```json
{
  "id": 1,
  "title": "LED Pattern Control",
  "folder": "01. LED Pattern Control",
  "category": "led-basics",
  "difficulty": "Beginner",
  "subtitle": "Short subtitle line",
  "description": "Full description paragraph",
  "project_statement": "What this project teaches / its objective",
  "youtube_id": "dQw4w9WgXcQ",
  "tinkercad": "https://www.tinkercad.com/things/...",
  "components": ["Arduino UNO", "LED", "220Ω Resistor"],
  "files": {
    "code": "led_pattern.ino"
  }
}
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `id` | number | Unique numeric ID (1–N). Used in URL `?id=1` |
| `title` | string | Project display name |
| `folder` | string | Subfolder name inside Projects Storage |
| `category` | string | `led-basics` / `sensors-actuators` / `display-input` / `advanced-projects` |
| `difficulty` | string | `Beginner` / `Intermediate` / `Advanced` |
| `subtitle` | string | Short one-liner for listing cards |
| `description` | string | Full paragraph description |
| `project_statement` | string | Learning objective / problem statement |
| `youtube_id` | string | YouTube video ID (11 chars) or full URL – manager auto-extracts the ID |
| `tinkercad` | string | Full Tinkercad simulation URL or `#` if not available |
| `components` | string[] | List of hardware components used |
| `files.code` | string | `.ino` filename inside the project folder |

### Categories

| Category key | Display name |
|---|---|
| `led-basics` | LED Basics |
| `sensors-actuators` | Sensors & Actuators |
| `display-input` | Display & Input |
| `advanced-projects` | Advanced |

---

## Desktop Project Viewer

**File:** `Projects Code/Arduino/arduino-project-viewer.html`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Sticky Header: [← Back]   Project Title   [◀ Prev | 1/23 | Next ▶]
├─────────────────────────────────────────────────────────────────┤
│  Hero Bar: #01   LED Pattern Control   [LED Basics] [Beginner]  │
├───────────────────────────────┬─────────────────────────────────┤
│  LEFT COLUMN (65%)            │  RIGHT COLUMN (35%)             │
│  ┌─────────────────────────┐  │  ┌─────────────────────────┐   │
│  │  YouTube Player / Image │  │  │  Project Statement       │   │
│  │  (16:9 aspect ratio)    │  │  ├─────────────────────────┤   │
│  └─────────────────────────┘  │  │  📖 Explanation & Code  │   │
│  ┌─────────────────────────┐  │  │     [Open Docs →]        │   │
│  │  ▶ Controls / Seek Bar  │  │  ├─────────────────────────┤   │
│  └─────────────────────────┘  │  │  🛠 Components           │   │
│  ┌───────────┐ ┌───────────┐  │  ├─────────────────────────┤   │
│  │ ← Prev    │ │   Next → │  │  │  [↓ Code] [↓ Circuit]   │   │
│  └───────────┘ └───────────┘  │  │  [↗ Tinkercad]          │   │
└───────────────────────────────┴─────────────────────────────────┘
```

### Video / Image Logic

1. If `youtube_id` is present → **show YouTube video player** (autoplay muted, looping)
2. If no `youtube_id` → **try to load circuit image** from the project folder
3. Circuit image filenames tried in order: `circuit.png`, `Circuit.png`, `circuit.jpg`, etc.
4. If multiple circuit images are found → shows a `<select>` dropdown to switch between them
5. If neither video nor image → shows "No circuit diagram" placeholder

### YouTube Player Settings

```javascript
playerVars: {
    autoplay: 1,       // Starts automatically
    mute: 1,           // Starts muted (browser policy)
    loop: 1,           // YouTube native loop flag
    playlist: videoId, // Required alongside loop:1 for single-video looping
    controls: 0,       // Hides YouTube's native controls (we use our own)
    rel: 0,            // No related videos
    modestbranding: 1, // Minimal YouTube branding
    playsinline: 1,    // Inline play on iOS
    iv_load_policy: 3  // No video annotations
}
```

**Loop safety:** `onStateChange` also calls `playVideo()` when `ENDED` fires, ensuring reliable looping even if YouTube's native loop parameter fails.

### Custom Video Controls (vc-bar)

| Control | Function |
|---|---|
| Seek bar | Click/drag to any position |
| Play/Pause button | `togglePlay()` — Space shortcut |
| Mute/Unmute button | `toggleMute()` — M shortcut |
| Unmute hint | Pulsing banner shown for 4.2 s after video starts |
| Volume slider | Sets volume (0–100) |
| Loop badge | Visual indicator that loop is active |
| Fullscreen button | `toggleFS()` — F shortcut |
| Time display | `currentTime / duration` |

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `ArrowLeft` / `P` | Previous project |
| `ArrowRight` / `N` | Next project |
| `Space` | Play / Pause |
| `M` | Mute / Unmute |
| `F` | Fullscreen |
| `Home` | First project |
| `End` | Last project |

### URL Parameters

- `?id=1` — Load project by numeric ID (primary)
- `?project=01.%20LED%20Pattern%20Control` — Load by folder name (legacy)
- `?category=led` — Load first project in category (legacy)

### Mobile Redirect

On mobile devices (`userAgent` test + `window.innerWidth < 768`), the page immediately redirects to:
```
../../mobile/projects/project-viewer.html?id=<id>&category=arduino
```

---

## Mobile Project Viewer

**Files:**
- `mobile/projects/project-viewer.html` — HTML layout (unchanged, uses existing mobile design)
- `mobile/projects/project-viewer.js` — All logic

### YouTube Player on Mobile

Same video-first logic:
- `youtube_id` present → `initYouTubePlayer(videoId)` creates the YT player
- No `youtube_id` → shows circuit image

**Mobile YT player:**
- Rendered inside `.yt-player-section` with `#ytPlayerBox` (16:9 container) and `#ytPlayer` div
- Control bar: `#ytControls` with play toggle and mute toggle buttons (`ytTogglePlay()`, `ytToggleMute()`)
- API loaded dynamically; handles race condition via `window._pendingYTVideoId`

---

## Documentation Reader

**File:** `Projects Code/Arduino/arduino-doc-reader.html`

- Reached via **"Open Docs →"** button in the project viewer's sidebar card
- URL: `arduino-doc-reader.html?id=<projectId>`
- Displays Markdown documentation (README files) from the project folder
- Features: night mode, table of contents, code highlighting, PDF download

---

## Admin Manager

**File:** `Only-boss/managers/projects/arduino/arduino-manager.html`

### Upload Form Fields (key ones)

| Field | Input | Notes |
|---|---|---|
| Project Title | text | Required |
| Category | select | led-basics / sensors-actuators / display-input / advanced-projects |
| Difficulty | select | Beginner / Intermediate / Advanced |
| YouTube URL/ID | text | Accepts full YouTube URL or bare 11-char ID — `extractYouTubeId()` auto-extracts |
| Project Statement | textarea | Objective / what the project teaches |
| Tinkercad URL | text | Full URL or `#` |
| Components | textarea | One per line |

### `extractYouTubeId(input)` utility

Accepts:
- Bare ID: `dQw4w9WgXcQ`
- Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Short URL: `https://youtu.be/dQw4w9WgXcQ`
- Embed URL: `https://www.youtube.com/embed/dQw4w9WgXcQ`

Returns the 11-character video ID or the raw input if no URL pattern matched.

### Edit Project

The edit modal has all the same fields. `editProject(id)` populates both `editYoutubeId` and `editProjectStatement`. `saveEditedProject()` writes them back to the data.

---

## Project Storage Structure

Each project has a subfolder under `Projects Storage/Arduino UNO Projects with Tinkercad/`:

```
01. LED Pattern Control/
    led_pattern.ino          ← Arduino code file
    circuit.png              ← Circuit diagram image
    README.md                ← Documentation (shown in doc reader)
```

The `folder` field in JSON must exactly match the subfolder name.

---

## How to Add a New Project

1. **Create the project folder** in `Projects Storage/Arduino UNO Projects with Tinkercad/`
2. **Add files**: `.ino` code, `circuit.png` or `circuit.jpg`, `README.md`
3. **Open the Manager** → Upload New Project form
4. Fill in all fields (YouTube URL → manager auto-extracts ID)
5. Save → `arduino-data.json` is updated automatically
6. The new project appears immediately on the listing and viewer pages

---

## File Dependencies Map

```
arduino-project-viewer.html
  ├── arduino-data.json               (project data)
  ├── Optimization/styles.css         (global styles)
  ├── Optimization/Background/background-system.css
  ├── Optimization/script.js          (global utilities)
  ├── Optimization/fullscreen-init.js
  ├── Optimization/navbar-autohide.js
  ├── Optimization/cursor-effects.js
  └── https://www.youtube.com/iframe_api  (YouTube IFrame API)

mobile/projects/project-viewer.html
  └── project-viewer.js               (all mobile logic)

arduino-doc-reader.html
  └── arduino-data.json

arduino-manager.html
  └── arduino-data.json               (reads + writes)
```

---

## Theming

| CSS Variable | Value | Usage |
|---|---|---|
| `--primary-red` | `#8B0000` | Dark red — borders, icons, accents |
| `--primary-red-light` | `#CC0000` | Hover states, gradient end |
| `--primary-red-dark` | `#5a0000` | Button background dark end |
| `--bg-card` | `rgba(18,0,0,0.88)` | Card backgrounds |
| `--border-primary` | `rgba(139,0,0,0.3)` | Default card borders |
| `--text-primary` | `rgba(255,255,255,0.95)` | Main text |
| `--text-secondary` | `rgba(255,255,255,0.62)` | Secondary/dim text |

---

*Last updated: June 2025*
