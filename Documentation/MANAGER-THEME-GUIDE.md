# Manager Theme - Implementation Guide

## 🎨 Modern Yellow-Red-Orange Gradient Theme

Professional, attractive theme for all A3KM Studio manager pages.

---

## ✅ Features

✨ **Fixed Top Navbar** - Professional navigation bar
🎨 **Yellow-Red-Orange Gradients** - Modern, eye-catching colors
📱 **Fully Responsive** - Works on all devices
💫 **Smooth Animations** - Engaging user experience
🎯 **Consistent Design** - Unified look across all managers
⚡ **Performance Optimized** - Fast and efficient

---

## 📦 How to Use

### Option 1: Link External CSS (Recommended)

Add this line in your `<head>` section:

```html
<!-- Manager Modern Theme -->
<link rel="stylesheet" href="../shared/manager-theme.css">
```

### Option 2: Import in Existing CSS

```css
@import url('../shared/manager-theme.css');
```

---

## 🔧 HTML Structure Required

### 1. Fixed Top Navbar

```html
<body>
  <!-- Fixed Top Navbar -->
  <div class="top-navbar">
    <div class="navbar-content">
      <div class="navbar-brand">
        <div class="brand-icon">📚</div>
        <div>
          <h1>Your Manager Name</h1>
          <p>Manager Description</p>
        </div>
      </div>
      <div class="navbar-actions">
        <span id="tokenStatus" class="token-status checking">
          <i class="fas fa-spinner fa-spin"></i>
          Checking token...
        </span>
        <button id="tokenRefreshBtn" class="token-refresh-btn" title="Refresh token status">
          <i class="fas fa-sync-alt"></i>
        </button>
        <button id="tokenDebugBtn" class="token-debug-btn">
          <i class="fas fa-code"></i> Debug
        </button>
        <a href="../shared/command-center.html" class="back-btn">
          <i class="fas fa-arrow-left"></i> Back to Command Center
        </a>
      </div>
    </div>
  </div>

  <div class="container">
    <!-- Your content here -->
  </div>
</body>
```

### 2. Sidebar with Navigation

```html
<div class="sidebar">
  <div class="sidebar-header">
    <h1>📚 Manager Name</h1>
    <p>Short Description</p>
  </div>
  <div class="sidebar-nav">
    <div class="tab-item active" onclick="switchTab('dashboard')">📊 Dashboard</div>
    <div class="tab-item" onclick="switchTab('upload')">📤 Upload</div>
    <div class="tab-item" onclick="switchTab('manage')">📋 Manage</div>
  </div>
  <div class="quick-stats">
    <h3>Quick Stats</h3>
    <div class="stat-item">
      <span>Total Items</span>
      <span class="stat-value" id="totalItems">0</span>
    </div>
  </div>
</div>
```

### 3. Main Content Area

```html
<div class="main-content">
  <div class="header">
    <div>
      <h1>📚 Page Title</h1>
      <p style="color: #666; font-weight: 600;">Description text</p>
    </div>
  </div>

  <!-- Tab Contents -->
  <div id="dashboardTab" class="tab-content active">
    <div class="stats-grid">
      <div class="stat-card">
        <h3 id="totalCount">0</h3>
        <p>Total Count</p>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 CSS Classes Reference

### Layout
- `top-navbar` - Fixed navbar at top
- `navbar-content` - Navbar content container
- `container` - Main flex container
- `sidebar` - Left sidebar
- `main-content` - Right content area

### Navigation
- `tab-item` - Sidebar navigation item
- `tab-item.active` - Active tab state
- `tab-content` - Tab content container
- `tab-content.active` - Visible tab

### Cards & Content
- `content-grid` - Responsive grid layout
- `content-card` - Individual card
- `card-thumbnail` - Card image
- `card-body` - Card content area
- `card-title` - Card title
- `card-meta` - Card metadata
- `card-actions` - Card action buttons

### Stats & Badges
- `stats-grid` - Stats cards grid
- `stat-card` - Individual stat card
- `quick-stats` - Sidebar quick stats
- `stat-item` - Quick stat item
- `badge` / `book-badge` - Content badges

### Buttons
- `btn-primary` - Primary action button
- `back-btn` - Back navigation button
- `token-refresh-btn` - Token refresh button
- `token-debug-btn` - Debug button

### Forms
- `form-group` - Form field group
- `form-grid` - Two-column form grid
- `filter-group` - Filter controls

### Token Status
- `token-status.active` - Active token (green)
- `token-status.missing` - Missing token (red)
- `token-status.checking` - Checking token (orange)

### Progress
- `progress` - Progress container
- `progress-bar` - Progress bar track
- `progress-fill` - Progress bar fill
- `progress-text` - Progress status text

### Modal
- `modal` - Modal overlay
- `modal.active` - Visible modal
- `modal-content` - Modal content box
- `modal-close` - Close button

---

## 🎯 Color Variables

```css
--primary-orange: #ff6f00
--primary-red: #d84315
--primary-yellow: #ff9800
--primary-light: #ffc107
--gradient-primary: linear-gradient(135deg, #d84315, #ff6f00, #ff9800)
--gradient-secondary: linear-gradient(135deg, #ff6f00, #ff9800, #ffc107)
--shadow-primary: 0 6px 20px rgba(255, 111, 0, 0.4)
--shadow-hover: 0 8px 25px rgba(255, 111, 0, 0.5)
```

---

## 📝 Migration Steps for Existing Managers

1. **Backup your current file**
2. **Add theme CSS link** to `<head>` section
3. **Add fixed navbar** HTML after `<body>` tag
4. **Update container** with `padding-top: 80px`
5. **Remove/move token status** from header to navbar
6. **Test all functionality**
7. **Adjust custom styles** if needed

---

## ⚠️ Important Notes

- Fixed navbar requires `padding-top: 80px` on container
- Token status elements (IDs) must match your JavaScript
- Sidebar becomes horizontal on mobile automatically
- All gradients use CSS variables for easy customization
- Font Awesome icons required for icon buttons

---

## 🚀 Example Implementation

See [books-manager-new.html](../Content-studio/books-manager-new.html) for complete working example.

---

## 📧 Support

For questions or issues, contact the development team.

**Created:** March 2, 2026  
**Version:** 1.0.0
