# A3KM Studio — Complete Website Study
> Author: GitHub Copilot Research  
> Date: March 5, 2026  
> Purpose: Foundation document for building the new static Website Guide system

---

## Overview

**Owner:** Md Akhinoor Islam  
**University:** KUET — Energy Science & Engineering, Batch 2K23  
**Stack:** Pure HTML / CSS / JavaScript (no framework), PWA-enabled  
**Hosting:** Vercel  
**Brand:** A3KM Studio · Part of Noor Academy  
**Tagline:** Engineering · Education · Innovation  

---

## Site Architecture

```
A3KM Studio
│
├─ DESKTOP TREE                        ├─ MOBILE TREE
│   Home/index.html                    │   mobile/home/index.html
│   About me/about.html                │   mobile/about/about.html
│   About me/certificates-viewer.html  │   mobile/about/certificates-viewer.html
│   Contact/contact.html               │   mobile/contact/contact.html
│   Projects Code/projects.html        │   mobile/projects/projects.html
│   Content Studio/hub.html            │   mobile/content-studio/hub.html
│   Documentation/index.html           │   Documentation/mobile/docs-hub.html
│   Only-boss/auth/only-boss.html      │   (mobile CSS overrides only)
│   Only-boss/dashboard/...            │
│
└─ SHARED
    Optimization/ (PWA, navbar, bg, scrollbar)
    Content Code/content.json
    Content Storage/ (PDFs, videos, books)
```

**Mobile Redirect Strategy:** Every desktop page has immediate JS mobile-detection in `<head>`. On mobile UA → instant redirect before render.

---

## 🖥️ DESKTOP PAGES — DETAILED STUDY

---

### D1. Home Page
**Path:** `Home/index.html`  
**Entry point & portfolio showcase**

#### Sections
| # | Section | Content |
|---|---|---|
| 1 | **Navbar** | Logo + brand name + 5 links (About, Projects, Content Studio, Contact) + CV download button |
| 2 | **Hero** | Full-height, profile photo, name (Md Akhinoor Islam), animated tech badge strip (SOLIDWORKS, Python, Arduino, Embedded Systems, Assembly, Robotics, ESP32, MATLAB...) |
| 3 | **Hero CTAs** | 5 quick-access buttons: 3D CAD Projects, Video Blog, Arduino Projects, Books & Papers, Documentation |
| 4 | **Stats Counter** | 4 animated counters: 66+ Projects, 10,000+ Lines of Code, 10 Certifications, 8+ Videos |
| 5 | **Technical Skills** | 4 categories with animated progress bars: CAD & Design, Programming, Simulation & Analysis, Web Development |
| 6 | **Journey Timeline** | Vertical timeline cards: KUET Clubs (2025), Founded A3KM Studio (2024), B.Sc KUET (2023–), HSC (2023), SSC (2021) |
| 7 | **Footer** | Social links (GitHub, LinkedIn, Facebook, YouTube, Instagram, WhatsApp) + crown icon → Only-Boss admin |

#### Navigation
- Desktop navbar: `Optimization/navbar/desktop-navbar.css` — always visible on Home (autohide excluded intentionally)

#### Special Features & Tech
- **Lenis** smooth scroll library
- **AOS** (Animate On Scroll) for section entry animations
- **Animated engineering grid background** — `gridMove` keyframe, `arch-line` sweep animations
- **PWA install button** — hidden until install prompt available
- **Mobile redirect** — immediate JS detection, redirects to `mobile/home/index.html`
- **Scroll-to-top button** (bottom-right FAB)

---

### D2. About Page
**Path:** `About me/about.html`  
**Personal profile, education, skills, clubs**

#### Sections
| # | Section | Content |
|---|---|---|
| 1 | **Profile Header** | Photo, full name, title, university, social badge strip |
| 2 | **Personal Details** | 2-column card: nationality, date of birth, gender + 8 contact/social links |
| 3 | **Location** | 2-card grid: Home address (Dinajpur) + Study address (KUET Campus) |
| 4 | **About Myself** | Bio paragraph |
| 5 | **Education Timeline** | BSc ESE KUET (ongoing) → HSC GPA 5.00 (RGC, 2023) → SSC GPA 5.00 (CPSCS, 2021) |
| 6 | **Technical Skills** | 12-icon skill chip grid: CAD Design, SOLIDWORKS, ANSYS, MATLAB, Arduino & IoT, Circuit Design, MS Office, Adobe Illustrator, 3D Printing, Laser Cutting |
| 7 | **Language Skills** | Bengali (Native), English — CEFR framework (B1–B2 per skill: reading, writing, speaking, listening) |
| 8 | **Hobbies** | 3 hobby cards with icons: Drawing, Cycling, Scientific Articles |
| 9 | **Clubs & Organizations** | 5 expandable club cards with toggleClubDetails() JS: Dream, TRY, KDS, KJA, Energy & Automation Club |

#### Special Features
- Expandable club cards (See More / See Less)
- CEFR proficiency legend visuals
- `background-system.css` — geometric shapes, gradient orbs, particle canvas (`<canvas id="particles-canvas">`)
- Navbar autohide active here (unlike Home)

---

### D3. Certificates Viewer
**Path:** `About me/certificates-viewer.html`  
**Filter & browse all certificates**

#### Features
- Category filter tabs (horizontal)
- Certificate cards showing: thumbnail, name, issuer, date, category badge
- Data source: `About me/certificates-data.json`
- PDF inline viewer support

---

### D4. Contact Page
**Path:** `Contact/contact.html`  
**Contact form + direct info panel**

#### Layout: Two-column split
| Left Column | Right Column |
|---|---|
| Profile avatar, name, role, university | Full contact form |
| Pulsing green "Available" status dot | Name, Email, Subject, Message inputs |
| Direct: Email, WhatsApp, Location | Submit with loading spinner |
| Social grid: LinkedIn, GitHub, YouTube, Facebook, Instagram | Success/error messages |
| "Responds within 24 hours" badge | — |

#### Form System — Triple Fallback
1. **Primary:** EmailJS (`service_l3om32p`, `template_5lv0are`) — sends to Gmail + auto-reply (`template_ruuu6ra`)
2. **Fallback 1:** Web3Forms API
3. **Fallback 2:** `mailto:` browser fallback

#### Special Features
- Pulsing green status dot (`statusPulse` CSS keyframe)
- Red glow animated on left panel
- Same particle background system

---

### D5. Projects Page
**Path:** `Projects Code/projects.html`  
**Engineering project showcase with search, filter, drill-down**

#### Sections
| # | Section | Content |
|---|---|---|
| 1 | **Hero** | Title, particle effect, animated hero badge, 4-counter stats |
| 2 | **Search Bar** | Centered input with live suggestions dropdown (slide-down animation), recent search tracking |
| 3 | **Filter Tabs** | Pill buttons: All / SolidWorks / Arduino / Electronics / MATLAB — active red glow |
| 4 | **Project Cards** | Large glassmorphism cards (backdrop-filter blur, hover 3D tilt `rotateX(2deg)`), shimmer sweep on hover |
| 5 | **Sub-cards Grid** | Nested `auto-fit minmax(280px, 1fr)` grid per category |
| 6 | **Project Tags** | Red-outlined keyword badges |

#### Sub-pages
- `solidworks/solidworks.html` — SolidWorks project listing
- `Arduino/arduino.html` — Arduino project listing
- `Electronics/` — Electronics projects
- `MATLAB/` — MATLAB projects

#### Special Features
- Live search suggestions dropdown
- 3D card tilt on hover (`rotateX(2deg)`)
- Shimmer sweep animation on cards
- Data: `Projects Code/projects.json`

---

### D6. Content Studio Hub
**Path:** `Content Studio/hub.html`  
**Central hub for all content types**

#### Sections
| # | Section | Content |
|---|---|---|
| 1 | **Hero** | "Content Studio" heading, FA icon, 5 animated stat badges |
| 2 | **Hub Stats** | 5 live-counted stats (loaded from JSON): Vlogs, Books, Blog Posts, Research Papers, Educational Courses |
| 3 | **Content Cards** | 5 large navigation cards with animated grid pattern + white-splash effect + engineering corner accents |

#### Auto-count System
Fetches 5 JSON files in parallel (`Promise.all`) at runtime — counts items, updates displayed stats automatically. Zero manual updates needed after manager uploads.

#### Card Hover Effects
- `translateY(-10px) scale(1.02)`
- Icon: `scale(1.2) rotate(5deg)`
- Red glow intensification

#### Sub-sections

**Books & PDFs** (`Content Studio/books-pdfs/`)
- `book-listing-new.html` — 2-column layout: 260px sticky filter sidebar + main grid
- Filter sidebar: search + category buttons + dropdown filters
- `book-detail.html` — individual book page
- `book-3d.html` — 3D book cover viewer
- `pdf-reader.html` — inline PDF reader
- Data: `books.json`

**Video Vlogs** (`Content Studio/video-content/`)
- `video-gallery.html` — 2-column: sidebar filters + video card grid
- `video-viewer.html` — individual video player
- YouTube live integration: `youtube-api-config.js`, `youtube-data-fetcher.js`
- Unified sync: `unified-video-sync.js` — syncs local JSON with YouTube
- Duration auto-fetch + caching
- Data: `videos.json` + YouTube API

**Written Posts / Blog** (`Content Studio/written-posts/`)
- `post-listing-new.html` — listing
- `post-reader.html` — reading view
- Data: `posts.json`, `content.json`

**Research Papers** (`Content Studio/research-papers/`)
- `paper-listing.html` — listing
- `paper-detail.html` — detail
- `paper-viewer.html` — inline PDF viewer
- Data: `papers.json`

**Educational Courses** (`Content Studio/educational-videos/`)
- `course-listing-new.html` — listing
- `course-detail.html` — detail
- `course-viewer-new.html` — course player
- Data: `courses.json`

---

### D7. Documentation (OLD — Being Replaced)
**Path:** `Documentation/index.html` (to be removed)  
**Previous: Markdown-based doc hub with 15 categories, 30,100+ words**

Removed features: markdown loader, docs-data.json cards, viewer-enhanced.html, viewer.html, mobile/docs-hub.html, mobile/docs-viewer-enhanced.html, mobile/docs-viewer.html

---

### D8. Only-Boss Admin Portal
**Path:** `Only-boss/auth/only-boss.html`  
**Secret admin portal — accessible via footer crown icon**

#### Authentication
- SHA-256 password hashing (`only-boss-auth.js`)
- Password visibility toggle
- Two-step UI (step1 → successStep)
- Session → `sessionStorage` on success

#### Dashboard (`Only-boss/dashboard/only-boss-dashboard-redesigned.html`)
| Card | Function |
|---|---|
| Command Center | Unified control hub (2-col span, gold border) |
| Certificates Manager | Manage certificates |
| Password Hash Generator | SHA-256 tool |
| AI Project Creator | Generate project pages with AI |
| Projects Manager | Arduino, MATLAB, SolidWorks projects |
| Site Settings | Colors, API keys |
| Backup & Restore | Data backup system |
| Content Managers Hub | Books, videos, papers, vlogs, posts |

#### Security System (Extreme)
| Feature | Detail |
|---|---|
| Session expiry | 30-min timer, countdown, color warning <10min, alert <5min |
| Browser fingerprinting | Canvas + UA + language + platform + timezone + screen (SHA-256 hashed) |
| Continuous re-validation | Every 2 min full auth, every 30s fingerprint check |
| Tab visibility check | Re-validates when returning to tab |
| DevTools detection | Outer/inner window size comparison every 5s |
| SessionStorage tamper | Overrides `setItem` to detect unauthorized writes |
| Console tamper | Verifies original console methods every 5s |
| Clickjacking protection | `window.self !== window.top` check |
| Copy protection | Blocks copying session-related strings |
| Back-button prevention | `pushState` override |

---

### D9. Global Shared Systems

| System | Files | Purpose |
|---|---|---|
| Background | `Optimization/Background/background-system.css` | Geometric shapes, gradient orbs, particle canvas |
| Navbar | `Optimization/navbar/desktop-navbar.css` | Logo + 5 links + CV download |
| Navbar autohide | `navbar-autohide.css` + `navbar-autohide.js` | Hides on scroll-down |
| Global scrollbar | `global-scrollbar.css` | Custom red-on-black webkit scrollbar |
| PWA | `manifest.json`, `pwa-init.js`, `service-worker.js` | Offline capability, install prompt |
| Update notifier | `update-notifier.js` | Notifies users of new version |
| Offline manager | `offline-content-manager.js` | Manages cached content |
| GitHub sync | `realtime-github-sync.js` | Real-time version tracking |
| PWA install prompt | `pwa-install-prompt.js` | Custom install UI |

---

### D10. Desktop Design System

| Token | Value |
|---|---|
| Primary Red | `#CC0000` |
| Dark Red | `#8B0000` |
| Background | `#000000` → `#0a0000` (near-black warm dark) |
| Card BG | `rgba(0,0,0,0.95)` with red-tinted border |
| Text | `#FFFFFF` with opacity layers (0.95 / 0.7 / 0.5) |
| Typography | Poppins (most pages), Inter (alternate), Rajdhani (home hero) |
| Border style | `rgba(204,0,0,0.3)` |
| Card shadow | `0 4px 20px rgba(0,0,0,0.6), 0 1px 3px rgba(204,0,0,0.1)` |
| Hover shadow | `0 12px 40px rgba(204,0,0,0.3), 0 6px 20px rgba(0,0,0,0.7)` |
| Hover lift | `translateY(-8px)` to `translateY(-12px)` |
| Entry animation | AOS (fade-up, fade-right, zoom-in) |
| Scroll animation | Lenis smooth scroll |
| Background anim | `gridMove`, `lineFloat`, `scanLine`, `particleFloat` keyframes |

---

---

## 📱 MOBILE PAGES — DETAILED STUDY

---

### M0. Global Mobile Architecture

#### Navigation
**Bottom Navigation Bar** — fixed, 5 tabs, across ALL main pages:

| Tab | Icon | Target |
|---|---|---|
| Home | `fa-home` | `mobile/home/index.html` |
| About | `fa-user-circle` | `mobile/about/about.html` |
| Projects | `fa-folder-open` | `mobile/projects/projects.html` |
| Studio | `fa-layer-group` | `mobile/content-studio/hub.html` |
| Contact | `fa-envelope` | `mobile/contact/contact.html` |

Sub-category pages use **back-button header** (`category-header`) but still show full bottom nav.

#### Shared Infrastructure
| File | Purpose |
|---|---|
| `mobile/shared/mobile-common.css` | CSS variables, reset, layout |
| `mobile/shared/mobile-navbar.html` | Bottom nav HTML template |
| `mobile/shared/mobile-navbar.js` | Active state logic |
| `mobile/shared/page-loading.js` | Red progress bar above nav |
| `mobile/shared/pdf-viewer.js` | PDF display |
| `mobile/shared/markdown-viewer.js` | Markdown rendering |
| `mobile/pwa-init.js` | PWA init |
| `Optimization/pwa-install-prompt.js` | Install prompt |
| `Optimization/update-notifier.js` | Update notification |
| `Optimization/offline-content-manager.js` | Offline cache |

#### Mobile Design Tokens
```css
--primary-red: #CC0000;
--dark-red: #8B0000;
--bg-black: #000000;
--bg-card: rgba(20,20,20,0.95);
--grid-color: rgba(204,0,0,0.08);  /* engineering grid */
safe-area-inset-* CSS used for notch/Dynamic Island
user-scalable=no, maximum-scale=1.0 on all viewports
Font: system-ui (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
```

#### Universal Mobile Features
| Feature | Implementation |
|---|---|
| Splash screen | Home only — auto dismiss at 1.5s |
| Haptic feedback | `navigator.vibrate()` — Home admin tap, Contact submit |
| Safe area insets | All pages |
| Page loading bar | `page-loading.js` — red bar `bottom: 65px` (above nav) |
| `:active` press feedback | `scale(0.95)` or `scale(0.98)` on all tappable items |
| `-webkit-tap-highlight-color: transparent` | Global reset |
| `16px` input font | Prevent iOS auto-zoom |
| Horizontal chip scroll | `-webkit-overflow-scrolling: touch` |
| PWA meta tags | `apple-mobile-web-app-capable`, `black-translucent` status bar |

---

### M1. Mobile Home
**Path:** `mobile/home/index.html`  
**PWA entry point**

#### Sections
| # | Section | Content |
|---|---|---|
| 1 | **Splash Screen** | `#0a0a0a → #1a0000` gradient, 120px logo, spinner, 1.5s auto-dismiss, tappable to skip, haptic `vibrate()` |
| 2 | **Hero/Profile** | Name, title, KUET badge (Batch 2K23), animated reveal |
| 3 | **Quick Access Grid** | 5 cards: Projects, Content Studio, Skills, Certificates, Documentation |
| 4 | **Featured Projects** | 3 cards: Arduino (23+), SOLIDWORKS (50+), MATLAB |
| 5 | **Social Links** | GitHub, LinkedIn, Facebook, Email |
| 6 | **Footer** | Copyright + **10-tap secret gesture** → admin login |

#### Secret Admin Access
- 10 rapid taps on copyright text
- Taps 5–10: copyright text gradually turns red
- Final tap: haptic buzz pattern `[50,100,50,100,50]`
- Toast notification + redirect to `Only-boss/auth/`

#### Navigation: Bottom nav (Home active)

---

### M2. Mobile About
**Path:** `mobile/about/about.html`  
**Personal profile — linear vertical flow**

#### Sections
| # | Section | Content |
|---|---|---|
| 1 | **Profile Header** | Photo, animated ring, name, title, university, batch badge |
| 2 | **Personal Details** | Nationality, YoB, gender grid |
| 3 | **Contact Info** | Email, phone, address |
| 4 | **Education Timeline** | 3 cards: BSc ESE (KUET, ongoing), HSC GPA 5.00, SSC GPA 5.00 |
| 5 | **Technical Skills** | Chip grid: CAD, SOLIDWORKS, ANSYS, MATLAB, Arduino, Circuit Design, MS Office, Illustrator, Laser Cutting, 3D Printing |
| 6 | **Language Skills** | Bengali (Native), English (CEFR B1/B2 per skill badges) |
| 7 | **Hobbies** | 6 hobby cards with icons |
| 8 | **Clubs & Organizations** | 5 expandable cards — `toggleClub()` See More/See Less + chevron rotation + Facebook link |
| 9 | **Recommendation** | Quoted recommendation card |

#### Deep-link Anchors
- `#skills` — used from Home quick-access
- `#clubs` — clubs section
- `#recommendation` — recommendation section

#### Navigation: Bottom nav (About active)

---

### M3. Mobile Certificates Viewer
**Path:** `mobile/about/certificates-viewer.html`

- Sticky header with back button
- Category filter chips (wrap layout)
- Certificate cards: thumbnail, title, issuer, date, category badge
- PDF viewer support
- **No bottom nav** — back-button header only
- Data: `About me/certificates-data.json`

---

### M4. Mobile Contact
**Path:** `mobile/contact/contact.html`  
**Contact form + tap-to-action quick links**

#### Sections
| # | Section | Content |
|---|---|---|
| 1 | **Hero** | Envelope icon, "Get In Touch", subtitle, `theme-color: #8B0000` |
| 2 | **Quick Contact Grid** | 4 tap cards: Phone (`tel:`), Email (`mailto:`), WhatsApp (`wa.me`), Telegram (`t.me`) |
| 3 | **Contact Form** | Floating label inputs, 500-char counter, EmailJS, animated spinner states |
| 4 | **Social Grid** | 6 cards: GitHub, LinkedIn, Facebook, Instagram, YouTube, Twitter |

#### Form — Floating Label Pattern
```css
input[placeholder=" "] + label.floating-label → transitions up on focus/filled
```

#### Mobile Deep Links (not on desktop)
- `tel:` — direct call
- `wa.me` — WhatsApp direct
- `t.me` — Telegram direct
- `16px` input font (prevents iOS zoom)

#### Navigation: Bottom nav (Contact active)

---

### M5. Mobile Projects Hub
**Path:** `mobile/projects/projects.html`

- Hero with animated background
- Stats bar: Arduino (23), CAD (35), Total (63)
- 4 category cards (left-icon, right-chevron pattern):
  - Arduino → `arduino-projects.html`
  - SolidWorks → `solidworks-projects.html`
  - MATLAB → `matlab-projects.html`
  - Electronics → `electronics-projects.html`
- Portfolio overview: 63+ projects, 4 categories, 100% Open Source

#### Navigation: Bottom nav (Projects active)

---

### M6. Mobile Arduino Projects
**Path:** `mobile/projects/arduino-projects.html`

- Category header (back btn + search toggle icon)
- Hero section with dynamic heading + count badge
- Search bar (toggled) with clear button
- **Horizontal scroll filter chips** with live count badges
- Dynamic JS-rendered project cards
- Empty state when no results
- Data table with red hover rows
- Data: `Projects Code/Arduino/arduino-data.json`

#### Navigation: Category header + full bottom nav

---

### M7. Mobile SolidWorks Projects
**Path:** `mobile/projects/solidworks-projects.html`

- Same structure as Arduino
- **`<model-viewer>` Web Component** (`@google/model-viewer v3.4.0`) — interactive 3D `.glb` files, touch-rotate/zoom
- Data: `Projects Code/projects.json`

---

### M8. Mobile MATLAB Projects
**Path:** `mobile/projects/matlab-projects.html`

- Same structure as Arduino/SolidWorks
- `<model-viewer>` included
- `theme-color: #2196F3` — unique blue (only non-red/black theme-color in mobile)
- Data: `Projects Code/MATLAB/matlab-data.json`

---

### M9. Mobile Content Studio Hub
**Path:** `mobile/content-studio/hub.html`

- Hero section
- **5 animated count-up stats** (fetch all 5 JSON files simultaneously)
- 5 content category cards with corner decorations:
  - Vlogs → `video-blogs/video-gallery.html`
  - Books & PDFs → `books-pdfs/book-listing.html`
  - Blog Posts → `written-posts/post-listing.html`
  - Research Papers → `research-papers/paper-listing.html`
  - Educational Courses → `educational-courses/course-listing.html`

#### Data Sources (hub.js fetches all simultaneously)
- `Content Studio/video-content/videos.json`
- `Content Code/content.json`
- `Content Studio/books-pdfs/books.json`
- `Content Studio/educational-videos/courses.json`
- `Content Studio/research-papers/papers.json`

#### Navigation: Bottom nav (Studio active)

---

### M10. Mobile Books & PDFs
**Path:** `mobile/content-studio/books-pdfs/book-listing.html`  
**Files:** `book-listing.html`, `book-detail.html`, `book-reader.html`

- Portrait thumbnail (90×120px)
- Page count badge
- Category badge
- **Dual action buttons:** "Read" + "Download"
- **Book-mode icon** — always visible on mobile (44px circular red button on thumbnail)
- Min 44×44px touch targets
- Inline PDF reader page
- `border-image` gradient separator on action area
- Data: `Content Studio/books-pdfs/books.json`

#### Navigation: Bottom nav + back header

---

### M11. Mobile Video Gallery
**Path:** `mobile/content-studio/video-blogs/video-gallery.html`  
**Files:** `video-gallery.html`, `video-viewer.html` + 3 JS modules

- **Sticky category tabs** (`position: sticky; top: 0; z-index: 50`)
- Horizontal scroll tabs with NO scrollbar (`scrollbar-width: none`)
- **Scroll fade indicators** — `.scroll-start` / `.scroll-end` / `.scroll-middle` classes applied on scroll to show gradient fades at tab edges
- Toolbar: sort/filter buttons (left) + view toggle (right)
- YouTube API live: `youtube-data-fetcher.js`
- Unified sync: `unified-video-sync.js` — keeps `videos.json` synced with YouTube

#### Navigation: Bottom nav (Studio active)

---

### M12. Mobile Research Papers
**Path:** `mobile/content-studio/research-papers/paper-listing.html`  
**Files:** `paper-listing.html`, `paper-detail.html`, `paper-viewer.html`

- Thumbnail with alternating icon colors (`nth-child 2n/3n`) for visual variety
- `.paper-status` badge: "Published" (crimson) + other statuses
- Space-spaced uppercase category badges
- Three-page sub-flow: listing → detail → PDF viewer
- Data: `Content Studio/research-papers/papers.json`

#### Navigation: Bottom nav (Studio active)

---

### M13. Mobile Written Posts
**Path:** `mobile/content-studio/written-posts/post-listing.html`  
**Files:** `post-listing.html`, `post-reader.html`

- `.post-language` badge (absolute, thumbnail top-right) — English/Bengali indicator
- `.read-time` badge
- Horizontal scroll filter chips
- Bilingual post support
- Data: `Content Code/content.json` + `Content Studio/written-posts/posts.json`

#### Navigation: Bottom nav (Studio active)

---

### M14. Only-Boss Admin (Mobile)
**Path:** `Only-boss/mobile/*.css`  
Mobile CSS overrides only (no separate HTML pages)

| File | Purpose |
|---|---|
| `auth-mobile.css` | Login page mobile styles |
| `dashboard-mobile.css` | Dashboard mobile layout |
| `manager-mobile.css` | Content manager mobile UI |
| `content-hub-mobile.css` | Content hub mobile |
| `only-boss-global-mobile.css` | Global CSS variables |

- `min-height: 52px` on all inputs
- `font-size: 16px !important` on password fields (no iOS zoom)
- Same dark `#0a0a0a → #1a0000` gradient

---

---

## 🗂️ CONTENT DATA SOURCES SUMMARY

| Content Type | Desktop JSON | Mobile Same? |
|---|---|---|
| Books & PDFs | `Content Studio/books-pdfs/books.json` | ✅ Yes |
| Video Vlogs | `Content Studio/video-content/videos.json` | ✅ Yes |
| Blog Posts | `Content Studio/written-posts/posts.json` | ✅ Yes |
| Research Papers | `Content Studio/research-papers/papers.json` | ✅ Yes |
| Educational Courses | `Content Studio/educational-videos/courses.json` | ✅ Yes |
| Content Hub | `Content Code/content.json` | ✅ Yes |
| Projects | `Projects Code/projects.json` | ✅ Yes |
| Arduino | `Projects Code/Arduino/arduino-data.json` | ✅ Yes |
| MATLAB | `Projects Code/MATLAB/matlab-data.json` | ✅ Yes |
| Certificates | `About me/certificates-data.json` | ✅ Yes |

---

---

## 🏗️ NEW DOCUMENTATION SYSTEM — PLAN

### Concept
**Not developer docs. A beautiful static "Website Guide" — explains A3KM Studio's features visually.**

### New Name Options
- "Website Guide" — সরাসরি বোধগম্য
- "Site Map & Features" — technical feel
- "Explore A3KM Studio" — brand-feel

### New Flow
```
Documentation Button / Card (existing placement preserved)
          ↓
   [New Landing Page]   ← index.html
   "Welcome to the Website Guide"
   Choose your experience:
   ┌─────────────┐  ┌─────────────┐
   │  🖥️ Desktop │  │  📱 Mobile  │
   │   Version   │  │   Version   │
   └─────────────┘  └─────────────┘
          ↓                ↓
  [Desktop Overview]  [Mobile Overview]
  All pages grid       All pages grid
  with visual          with visual
  mockups              mockups
          ↓                ↓
  [Individual page guide - one per section]
  Visual layout diagram + Feature list + Animations
```

### Pages to Build

#### Root
- `Documentation/index.html` — Landing (Platform chooser)
- `Documentation/assets/guide.css` — Shared CSS
- `Documentation/assets/guide.js` — Shared JS

#### Desktop Guide
- `Documentation/desktop/index.html` — Desktop overview (all pages grid)
- `Documentation/desktop/home.html` — Home page guide
- `Documentation/desktop/about.html` — About page guide
- `Documentation/desktop/projects.html` — Projects page guide
- `Documentation/desktop/content-studio.html` — Content Studio guide
- `Documentation/desktop/contact.html` — Contact page guide
- `Documentation/desktop/admin.html` — Only-Boss admin guide

#### Mobile Guide
- `Documentation/mobile-guide/index.html` — Mobile overview (all pages grid)
- `Documentation/mobile-guide/home.html` — Mobile home guide
- `Documentation/mobile-guide/about.html` — Mobile about guide
- `Documentation/mobile-guide/projects.html` — Mobile projects guide
- `Documentation/mobile-guide/content-studio.html` — Mobile content studio guide
- `Documentation/mobile-guide/contact.html` — Mobile contact guide

### Old Files to Remove/Archive
- `Documentation/viewer.html` → delete
- `Documentation/viewer-enhanced.html` → delete
- `Documentation/mobile/docs-hub.html` → delete (replace with new mobile-guide/)
- `Documentation/mobile/docs-viewer.html` → delete
- `Documentation/mobile/docs-viewer-enhanced.html` → delete
- `Documentation/docs-data.json` → keep in Archive or delete
- `Documentation/index.html` → replace entirely

**Keep:** `Documentation/Archive/` — historical docs, unchanged

### Visual Style for New Guide Pages

#### CSS-drawn Page Mockups
Each guide page will include a small CSS-drawn wireframe of the actual page:
- Dark box representing the browser window
- Colored strips representing sections
- Labeled with section names
- Animated on hover to highlight

#### Feature Cards
- Icon + feature name + short description
- Colored left-border per category
- Hover: lift + glow

#### Data Flow Diagrams
- CSS-drawn flow arrows
- Shows: User action → Response → Output
- e.g., "Click Search → Dropdown shows → Click suggestion → Cards filter"

#### Stats Visuals
- Animated count-up numbers
- Progress/fill bars for data completeness

### Build Order
1. `Documentation/index.html` — Landing page (platform chooser) ← **START HERE**
2. `Documentation/desktop/index.html` — Desktop overview
3. `Documentation/desktop/home.html` — Home detailed guide
4. `Documentation/desktop/about.html` — About detailed guide
5. `Documentation/desktop/projects.html` — Projects detailed guide
6. `Documentation/desktop/content-studio.html` — Content Studio detailed guide
7. `Documentation/desktop/contact.html` — Contact detailed guide
8. `Documentation/desktop/admin.html` — Admin detailed guide
9. `Documentation/mobile-guide/index.html` — Mobile overview
10. ...individual mobile pages (re-use desktop guide code, adapt layout)

---

*This study document is the foundation. All new guide pages will be built based on this research.*
