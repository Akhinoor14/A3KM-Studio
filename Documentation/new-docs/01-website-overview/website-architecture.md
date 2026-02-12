---
title: "A3KM Studio - Website Architecture"
date: 2026-02-12
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: website-overview
tags: [website, architecture, structure]
---

# A3KM Studio ওয়েবসাইটের সম্পূর্ণ গঠন

## এই ওয়েবসাইট কী?

A3KM Studio হলো আমার (Md Akhinoor Islam) একটা সম্পূর্ণ portfolio আর educational content platform। এখানে আমার সব প্রজেক্ট, ভিডিও, লেখা, research papers সব কিছু আছে। 

## ওয়েবসাইটের মূল অংশগুলো

### 1. **Public Website (সবার জন্য)**

**Desktop Version:**
- Location: `Home/index.html`
- Features: 
  - Animated background (geometric shapes, gradient orbs, particles)
  - Professional navbar with logo
  - Projects showcase (66টা projects)
  - Content studio (videos, posts, books)
  - About me section
  - Contact form
- Automatic PWA install prompt দেয়

**Mobile Version:**
- Location: `mobile/home/index.html`  
- Mobile-optimized interface
- Touch-friendly navigation
- Lightweight design for mobile data
- Separate mobile navbar আর styling

**Auto Device Detection:**
- Root `index.html` automatic detect করে mobile না desktop
- `navigator.userAgentData` use করে modern browsers এ
- Fallback to User Agent string পুরনো browsers এ
- Automatic redirect করে সঠিক version এ

### 2. **Only Boss Admin Panel (শুধু আমার জন্য)**

Admin control panel যেখান থেকে সব কিছু manage করি:

- Location: `Only-boss/`
- Two-step authentication (SHA-256 encrypted)
- Features:
  - Dashboard with analytics
  - Content Studio manager
  - Post creator with GitHub sync
  - Project manager
  - Certificate manager
  - Settings & security
  - Token management system

### 3. **Content System**

সব content এখানে organize করা:

**Video Content:**
- 8টা YouTube videos (tour vlogs, daily life, food, poems)
- Video gallery with thumbnails
- Duration, tags, descriptions সব আছে
- YouTube API integration

**Written Posts:**
- Blog post system with 100+ categories
- Post reader with markdown support
- Category-based filtering
- Search functionality

**Books & PDFs:**
- 3টা engineering books
- PDF viewer integrated
- Download option available

**Research Papers:**
- Academic paper showcase
- Paper viewer system

### 4. **Projects Portfolio**

Total 66টা projects আছে:

- **SOLIDWORKS:** 35টা 3D CAD models (Basic/Intermediate/Pro/Commercial)
- **Arduino:** 26টা projects with code + circuit explanations
- **MATLAB:** Energy systems simulations
- **Electronics:** 4টা professional calculators

### 5. **PWA (Progressive Web App) System**

ওয়েবসাইট app হিসেবে install করা যায়:

- `manifest.json` - App configuration
- `service-worker.js` - Offline support
- `pwa-init.js` - Auto install prompt
- Fullscreen mode support
- Works offline after first load

## Technology Stack (কী কী ব্যবহার করেছি)

### Frontend:
- **HTML5** - Structure
- **CSS3** - Styling (custom animations, gradients)
- **Vanilla JavaScript** - No framework, pure JS
- **Font Awesome** - Icons
- **Google Fonts** - Inter font family
- **Marked.js** - Markdown rendering
- **Highlight.js** - Code syntax highlighting
- **Model Viewer** - 3D model preview

### Features:
- Mobile detection & auto-redirect
- PWA with offline support
- GitHub API integration
- Real-time content sync
- Responsive design (desktop + mobile)
- Dark theme with red accent (#CC0000)

### File Structure:
```
A3KM-Studio/
├── index.html (root - device detector)
├── Home/ (desktop version)
├── mobile/ (mobile version)
├── Only-boss/ (admin panel)
├── Content Studio/ (content management)
├── Content Code/ (content data JSONs)
├── Content Storage/ (actual content files)
├── Projects Code/ (project pages)
├── Projects Storage/ (project files)
├── Optimization/ (PWA, scripts, styles)
└─ Documentation/ (এই documentation system)
```

## Color Scheme

Main colors যা পুরো site এ use করা:

- **Primary Red:** `#CC0000` (logo, buttons, accents)
- **Dark Red:** `#990000` (hover states)
- **Background:** `#0a0a0a` to `#1a0505` (dark gradient)
- **Card Background:** `#2a2a2a`
- **Text:** `#ffffff` (white), `#aaaaaa` (gray)

## Performance Features

- Lazy loading for images
- Code splitting for faster load
- Service worker caching
- Optimized background animations
- Mobile-first responsive design
- Auto-refresh system

## GitHub Integration

- Real-time content sync from GitHub
- Token-based authentication
- Cross-device automatic sync
- Version control for all content

---

**শেষ Update:** 2026-02-12  
**Next Documentation:** Authentication & Security System
