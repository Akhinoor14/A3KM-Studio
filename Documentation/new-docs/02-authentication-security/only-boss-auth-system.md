---
title: "Only Boss Authentication System"
date: 2026-02-12
author: Md Akhinoor Islam
organization: A3KM Studio | Noor Academy
category: authentication-security
tags: [authentication, security, admin, login]
---

# Only Boss - Two-Step Authentication System

## কী এটা?

Only Boss হলো আমার admin panel এর authentication system। শুধুমাত্র আমি access করতে পারব, এজন্য two-step security আছে।

## Authentication Process

### Step 1: Password Entry
- সাধারণ password input field
- SHA-256 encryption ব্যবহার করে hash করা হয়
- Client-side এ hash করে server এ পাঠায়
- Plain text password কখনো store/transmit হয় না

### Step 2: Secondary Verification  
- Additional security layer
- Second password/PIN entry
- দুইটাই match হলে তবেই access

### Login Page Details

**Location:** `Only-boss/auth only-boss.html`

**Design Features:**
- 👑 Crown icon (Only Boss symbol)
- Dark theme background 
- Red primary color (#CC0000)
- "Two-Step Authentication Required" heading
- Exit button (top-right) to go back to website
- Mobile-responsive design

**Security Features:**
- SHA-256 password hashing
- No password stored in cookies/localStorage
- Session-based authentication
- Auto-logout on browser close
- No "remember me" option (security purpose)

## Access Protected Areas

Authentication required করে এই pages access করতে:

### 1. **Dashboard** (`Only-boss/dashboard/`)
- Main control panel
- Analytics at a glance
- Quick access to all managers
- Session info display

### 2. **Content Studio Manager** (`Only-boss/managers/Content-studio/`)
- Books manager
- Educational videos manager
- Research papers manager
- Written posts manager
- YouTube integration controls
- Content upload system

### 3. **Post Creator** (`Only-boss/managers/posts/`)
- Create new blog posts
- Markdown editor
- Category selection (100+ categories)
- GitHub sync controls
- Auto-save functionality
- Preview before publish

### 4. **Content Editor** (`Only-boss/managers/content-editing/`)
- Edit existing content
- Comprehensive content data management
- Field-expansion system
- Multi-type content support

### 5. **Project Manager** (`Only-boss/managers/projects/`)
- SOLIDWORKS model upload
- Arduino project management
- MATLAB project editor
- Project analytics dashboard
- Advanced search features

### 6. **Certificate Manager** (`Only-boss/managers/certificates/`)
- Upload certificates
- Organize by category (Skill/Medical/etc)
- Certificate viewer integration

### 7. **Settings** (`Only-boss/managers/settings/`)
- Media library management
- Site configuration
- Theme customization

### 8. **Security & Tokens** (`Only-boss/managers/shared/`)
- GitHub token manager
- Token health dashboard
- API configuration
- Token verification tests
- System integration hub

## Mobile Access

Only Boss panel mobile থেকেও use করা যায়:

**Mobile CSS Files:**
- `only-boss-global-mobile.css` - Global mobile styles
- `auth-mobile.css` - Login page mobile optimization
- `dashboard-mobile.css` - Dashboard mobile view
- `manager-mobile.css` - Manager pages mobile layout
- `content-hub-mobile.css` - Content hub mobile design

**Mobile Features:**
- Touch-friendly buttons
- Optimized input fields
- Responsive grid layouts
- Mobile-first navigation
- Swipe gestures support

## GitHub Token Management

Admin panel থেকে GitHub Personal Access Token manage করা যায়:

### Token Manager Features:
- Token input & validation
- Token health check
- Automatic expiry detection
- Secure localStorage encryption
- Quick reference guide
- Test token functionality

### Token Usage:
- Content upload to GitHub
- Real-time sync
- Automatic cross-device updates
- Version tracking
- Commit history maintenance

## Security Best Practices

### আমি যা follow করি:

1. **Never share credentials** - Password শুধু আমি জানি
2. **SHA-256 encryption** - Plain text কখনো না
3. **Session-based auth** - Persistent login নেই
4. **HTTPS only** - সব communication encrypted
5. **Token rotation** - GitHub tokens regularly renew করি
6. **No public exposure** - Admin URLs publicly shared নয়

### Protection Against:
- ✅ Brute force attacks (rate limiting দরকার আছে - to-do)
- ✅ Password sniffing (SHA-256 hash)
- ✅ Session hijacking (session timeout)
- ✅ XSS attacks (input sanitization)
- ✅ Token exposure (encrypted storage)

## Login করার Process (Step by Step)

1. Navigate to `Only-boss/auth/only-boss.html`
2. Enter first password → Click "Next"
3. Password SHA-256 এ hash হয়
4. Hash match করলে Step 2 show হয়
5. Enter second password → Click "Login"
6. দুইটাই correct হলে redirect to dashboard
7. শেষ! এখন full access পাবে

## Logout Process

- Dashboard এ "Logout" button click করো
- Session clear হয়ে যাবে
- Automatically redirect to login page
- Browser close করলেও auto-logout

## Emergency Access

যদি password ভুলে যাই:

- Source code দেখে password hash বের করতে পারব
- File: `Only-boss/auth/only-boss-auth.js`
- SHA-256 hash update করে নতুন password set করা যায়
- Alternatively, GitHub থেকে আগের commit restore করা যায়

## Design Philosophy

### কেন Two-Step?
- Single password easily crackable
- Extra layer of security
- Multiple checkpoints better protection
- আমার daily use এর জন্য perfect balance

### কেন SHA-256?
- Industry standard
- One-way hashing (reverse করা impossible)
- Fast enough for client-side
- Secure enough for একটা personal website

---

**শেষ Update:** 2026-02-12  
**Next Documentation:** Only Boss Dashboard Features
