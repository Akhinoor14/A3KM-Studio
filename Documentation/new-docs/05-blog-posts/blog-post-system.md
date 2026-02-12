---
title: "Blog Post System - Complete Guide"
description: "Comprehensive blogging system with 100+ categories covering literature, arts, social sciences, STEM, business, health, and more. Features markdown editor, GitHub sync, and multi-language support for professional content creation"
date: 2026-02-12
lastUpdated: 2026-02-12
version: "3.0.0"
author: Md Akhinoor Islam
authorEmail: mdakhinoorislam@gmail.com
organization: A3KM Studio | Noor Academy
category: blog-posts
difficulty: beginner
readTime: "12 min"
wordCount: 3200
tags: [blog, posts, markdown, writing, categories, 100-categories, content-creation, GitHub-sync]
status: complete
featured: true
prerequisites:
  - "Basic markdown knowledge"
  - "Only Boss admin access"
  - "Understanding of content categories"
relatedDocs:
  - "../04-content-management/content-studio-system.md"
  - "../03-only-boss-admin/dashboard-complete-guide.md"
  - "../12-github-integration/github-sync-complete.md"
changelog:
  - version: "3.0.0"
    date: "2026-02-12"
    changes: "Enhanced with advanced formatting, category tables, visual guides"
  - version: "2.0.0"
    date: "2026-02-10"
    changes: "Expanded to 100+ categories, added GitHub sync"
  - version: "1.0.0"
    date: "2026-02-05"
    changes: "Initial blog post system documentation"
---

# ✍️ Blog Post System - লেখালেখির সম্পূর্ণ System

> **🎯 Overview:** A powerful blogging platform with **100+ categories** spanning literature, arts, social sciences, STEM, business, and health. Write in markdown, sync to GitHub, and publish instantly with multi-language support.

---

## 📋 Table of Contents

- [🌟 Post System Overview](#overview)
- [📚 100+ Category System](#categories)
- [✍️ Post Creation Workflow](#creation)
- [📝 Markdown Guide](#markdown)
- [📱 Mobile Post Management](#mobile)
- [⚠️ Troubleshooting](#troubleshooting)
- [📚 Related Documentation](#related-docs)

---

## 🌟 Post System Overview {#overview}

আমার blog post system **খুবই powerful** - **100+ categories** আছে সব ধরনের topic এর জন্য!

**📊 System Statistics:**

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| **Data File** | `posts.json` | Metadata storage | ✅ Active |
| **Post Files** | `Content Studio/written-posts/*.md` | Markdown content | ✅ Active |
| **Post Creator** | `Only-boss/managers/posts/` | Creation tool | ✅ Active |
| **Total Posts** | 3 (growing) | Published content | 📈 Expanding |

> **💡 Quick Fact:** System supports Bangla, English, and Mixed language posts

---

## 📚 100+ Category System {#categories}

### 📊 Category Distribution Overview

| Category Group | Count | Icon | Examples |
|----------------|-------|------|----------|
| **Literature & Language** | 15 | 📚 | Fiction, Poetry, Creative Writing |
| **Arts & Culture** | 15 | 🎨 | Visual Arts, Music, Film Studies |
| **Social Sciences** | 50+ | 🌍 | History, Politics, Psychology |
| **STEM & Technology** | 30+ | 🔬 | Programming, Engineering, Science |
| **Business & Economics** | 10+ | 💼 | Marketing, Finance, Management |
| **Health & Wellness** | 5+ | 💪 | Fitness, Mental Health, Nutrition |
| **TOTAL** | **100+** | 🎯 | Complete coverage |

> **✨ Highlight:** Most comprehensive category system for Bangla+English mixed content!

#### 1. **Literature & Language** 📚 (15 categories)
- Children's Literature
- Classic Literature
- Comics & Graphic Novels
- Contemporary Fiction
- Creative Writing
- Drama & Plays
- Fiction - Novels
- Language Learning & Linguistics
- Literary Criticism
- Mystery & Thriller
- Poetry & Verse
- Romance Literature
- Science Fiction & Fantasy
- Short Stories
- World Literature

#### 2. **Arts & Culture** 🎨 (15 categories)
- Art History & Criticism
- Calligraphy & Typography
- Crafts & Handmade
- Cultural Studies
- Dance & Choreography
- Digital Art & Animation
- Fashion & Design
- Film & Cinema Studies
- Graphic Design
- Museum & Heritage Studies
- Music Theory & Composition
- Photography & Videography
- Sculpture & 3D Art
- Theater & Performance Arts
- Visual Arts & Painting

#### 3. **Social Sciences & Humanities** 🌍 (50+ categories!)

**Major Subcategories:**
- Anthropology, Archaeology
- Communication & Soft Skills
- Economics & Finance
- Education & Pedagogy
- Geography & Earth Sciences

**History (20+ subcategories):**
- Ancient History
- Medieval History
- Modern History
- Bangladesh History
- Bangladesh Liberation War 1971
- South Asian History
- Islamic History
- European, African, American, Asian History
- Military History
- Colonial History

**Politics & Government (15+ subcategories):**
- Democracy & Elections
- National Development & Planning
- Public Administration & Bureaucracy
- Diplomacy & Foreign Policy
- Political Philosophy
- Comparative Politics
- Bangladesh Politics & History
- Bangladesh Constitution & Law
- Bangladesh Economy & Development
- South Asian Politics
- International Politics
- Geopolitics

- Psychology & Mental Health
- Public Policy & Administration
- Sociology & Social Issues
- Religion & Spirituality (মুসলিম ধর্ম including)

#### 4. **STEM & Technology** 🔬 (30+ categories)

**Mathematics & Physics:**
- Pure Mathematics
- Applied Mathematics
- Classical Mechanics
- Quantum Physics
- Astrophysics

**Engineering (Major Categories):**
- Aerospace Engineering
- Agricultural Engineering
- Architecture & Urban Planning
- Biomedical Engineering
- Chemical Engineering
- Civil Engineering & Construction
- Computer Science & IT
- Electrical & Electronics Engineering
- Energy Engineering (আমার department!)
- Environmental Engineering
- Industrial Engineering
- Mechanical Engineering
- Mining Engineering
- Naval Architecture
- Robotics & Automation

**Technology:**
- Artificial Intelligence & Machine Learning
- Blockchain & Cryptocurrency
- Cloud Computing & DevOps
- Cybersecurity & Ethical Hacking
- Data Science & Analytics
- Game Development
- IoT & Embedded Systems
- Mobile App Development
- Programming & Software Development
- UI/UX Design
- Virtual Reality & Augmented Reality
- Web Development

#### 5. **Business & Economics** 💼 (10+ categories)
- Accounting & Auditing
- Banking & Finance
- Business Management
- Digital Marketing & SEO
- E-commerce & Online Business
- Entrepreneurship & Startups
- Human Resource Management
- International Trade
- Investment & Stock Market
- Leadership & Management
- Project Management
- Supply Chain & Logistics

#### 6. **Health, Lifestyle & Personal Development** 🏃 (15+ categories)
- Agriculture & Farming
- Cooking & Recipes
- Environmental Conservation
- Fitness & Exercise
- Food & Nutrition
- Gardening & Horticulture
- Health & Wellness
- Meditation & Mindfulness
- Mental Health & Counseling
- Motivation & Self-Improvement
- Parenting & Family
- Personal Finance & Money Management
- Productivity & Time Management
- Sports & Athletics
- Travel & Tourism
- Yoga & Wellness

**Total Categories:** 100+ (exact count: ~120 categories!)

## Post Creation Process

### Using Post Creator:

**File:** `Only-boss/managers/posts/create-post.html`

**Interface:**
```
┌─────────────────────────────────────┐
│   Create New Blog Post              │
├─────────────────────────────────────┤
│ Title: [________________]           │
│ Category: [Dropdown ▼] (100+)       │
│ Tags: [tag1, tag2, tag3]            │
│ Language: ○ Bangla ○ English       │
│                                      │
│ ┌─────────────────────────────┐    │
│ │ Markdown Editor             │    │
│ │                             │    │
│ │ # Your content here...      │    │
│ │                             │    │
│ └─────────────────────────────┘    │
│                                      │
│ Preview  │  Save Draft  │  Publish │
└─────────────────────────────────────┘
```

### Step-by-Step Guide:

#### 1. **Open Post Creator:**
- Login to Only Boss
- Dashboard → Post Creator
- Interface loads with empty form

#### 2. **Enter Basic Info:**
```
Title: "Arduino Line Follower Robot বানানো"
Category: "Robotics & Automation"
Tags: Arduino, Robot, Sensors, Bangla Tutorial
Language: Bangla
```

#### 3. **Write Content:**

Markdown editor এ লিখো:

```markdown
# Arduino দিয়ে Line Follower Robot

## প্রয়োজনীয় Components

- Arduino UNO (1টা)
- IR Sensors (2টা)
- DC Motors (2টা)
- Motor Driver L298N
- Chassis & Wheels
- Battery 9V

## Circuit Connection

IR sensors এর OUT pin Arduino এর Digital Pin 2 & 3 এ connect করো...

## Code

\`\`\`cpp
int leftSensor = 2;
int rightSensor = 3;

void setup() {
  pinMode(leftSensor, INPUT);
  pinMode(rightSensor, INPUT);
}

void loop() {
  // Robot control logic
}
\`\`\`

## সমস্যা সমাধান

যদি robot সোজা না যায়...
```

#### 4. **Preview:**
- Click "Preview" button
- Rendered markdown দেখতে পাবে
- Check formatting, code highlighting
- Back to edit করো যদি ভুল থাকে

#### 5. **Save/Publish:**

**Save as Draft:**
- Saved locally in browser
- GitHub এ যায় না
- Later edit করা যায়

**Publish:**
- Creates `.md` file: `post-004-arduino-line-follower.md`
- Frontmatter auto-added:
```yaml
---
title: "Arduino Line Follower Robot বানানো"
date: 2026-02-12
author: Md Akhinoor Islam
category: "Robotics & Automation"
tags: [Arduino, Robot, Sensors, Bangla-Tutorial]
language: bn
slug: arduino-line-follower
---
```
- File saved to `Content Studio/written-posts/`
- Entry added to `posts.json`
- GitHub sync triggered
- Commit message: "Add new post: Arduino Line Follower Robot"

#### 6. **Auto-Live:**
- Post immediately visible on website
- Appears in Content Hub
- Searchable by title/tags
- Category filtering works

## Post Data Structure

### In posts.json:

**Current Structure:**
```json
{
  "categoryGroups": [...],
  "posts": [
    {
      "id": "post-001",
      "title": "Welcome to A3KM Studio",
      "slug": "welcome",
      "category": "Personal Blog",
      "subcategory": "Announcements",
      "author": "Md Akhinoor Islam",
      "date": "2025-01-15",
      "language": "bn",
      "tags": ["Welcome", "Introduction", "Portfolio"],
      "excerpt": "আমার website এ স্বাগতম...",
      "filePath": "Content Studio/written-posts/post-001-welcome.md",
      "readTime": "5 min",
      "wordCount": 850
    }
  ]
}
```

### In Markdown File:

**File:** `Content Studio/written-posts/post-001-welcome.md`

```markdown
---
title: "Welcome to A3KM Studio"
date: 2025-01-15
author: Md Akhinoor Islam
category: "Personal Blog"
tags: [Welcome, Introduction]
language: "bn"
---

# আমার Website এ স্বাগতম

এই হলো আমার প্রথম blog post...

## আমার সম্পর্কে

আমি Md Akhinoor Islam...
```

## Post Viewer System

### Post Reader:

**File:** `Content Studio/written-posts/post-reader.html`

**Features:**
- Clean reading layout
- Markdown to HTML conversion (Marked.js)
- Code syntax highlighting (Highlight.js)
- Auto table of contents
- Reading progress bar
- Estimated reading time
- Share buttons (Facebook, Twitter, WhatsApp, Copy link)
- Print-friendly version

**Viewer Layout:**
```
┌────────────────────────────────────┐
│ ← Back to Posts                    │
├────────────────────────────────────┤
│                                     │
│   Arduino Line Follower Robot      │
│   By Md Akhinoor Islam             │
│   📅 Feb 12, 2026 · ⏱️ 8 min read  │
│   🏷️ Arduino, Robot, Sensors       │
│                                     │
│ ─────────────────────────────────  │
│                                     │
│ # Arduino দিয়ে Line Follower...   │
│                                     │
│ প্রয়োজনীয় Components:            │
│ • Arduino UNO                      │
│ • IR Sensors                       │
│                                     │
│ ```cpp                             │
│ int sensor = 2;                    │
│ ```                                │
│                                     │
│ Share: [FB] [TW] [WA] [📋]         │
└────────────────────────────────────┘
```

### Post Listing:

**File:** `Content Studio/written-posts/post-listing-new.html`

**Features:**
- Grid/List view toggle
- Category filter dropdown
- Tag cloud
- Search bar
- Sort by: Newest, Oldest, Popular
- Pagination (10 posts per page)

**Card Layout:**
```
┌─────────────────────────┐
│ [Thumbnail Image]       │
├─────────────────────────┤
│ Post Title Here         │
│ Category Badge          │
│ Feb 12, 2026 · 5 min    │
│                         │
│ Excerpt preview text... │
│                         │
│ #tag1 #tag2 #tag3       │
│ [Read More →]           │
└─────────────────────────┘
```

## GitHub Sync for Posts

### Sync Files:

**Main File:** `Only-boss/managers/posts/github-sync.js`

**Features:**
- Create new `.md` file on GitHub
- Update existing post
- Auto-commit with message
- Update `posts.json` metadata
- Handle merge conflicts (rare)

### Sync Process:

```javascript
async function publishPost(postData) {
    // 1. Create markdown content
    const markdown = generateMarkdown(postData);
    
    // 2. Generate filename
    const filename = `post-${Date.now()}-${postData.slug}.md`;
    
    // 3. Upload to GitHub
    const response = await githubAPI.createFile({
        path: `Content Studio/written-posts/${filename}`,
        content: btoa(markdown),
        message: `Add new post: ${postData.title}`
    });
    
    // 4. Update posts.json
    await updatePostsJSON(postData);
    
    // 5. Show success
    showNotification('Post published successfully!');
}
```

## Markdown Features Supported

### Basic Formatting:
- **Bold:** `**text**`
- *Italic:* `*text*`
- ~~Strikethrough:~~ `~~text~~`
- `Inline code:` `` `code` ``

### Headings:
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Lists:
```markdown
- Bullet list
  - Nested item
  
1. Numbered list
2. Second item
```

### Links & Images:
```markdown
[Link text](https://url.com)
![Alt text](image-path.jpg)
```

### Code Blocks:
````markdown
```javascript
function hello() {
    console.log("Hello!");
}
```
````

### Tables:
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### Blockquotes:
```markdown
> This is a quote
```

### Horizontal Rule:
```markdown
---
```

## SEO & Metadata

### Auto-Generated:
- Meta title (from post title)
- Meta description (from excerpt)
- og:image (from first image or default)
- Keywords (from tags)
- Canonical URL
- Author schema markup
- Publication date structured data

### Manual Settings:
- Custom meta description
- Featured image selection
- SEO-friendly slug
- Social media preview image

## Post Analytics (Planned)

### Future Metrics:
- Page views per post
- Average reading time
- Scroll depth
- Share counts
- Comment engagement
- Popular related posts

## Mobile Post Experience

**Mobile Viewer:** `mobile/content-studio/post-viewer-mobile.html`

**Optimizations:**
- Single-column text (easier reading)
- Larger font size (18px minimum)
- Code blocks horizontal scroll
- Images full-width responsive
- Touch-friendly share buttons
- Bottom "Read Next" suggestions

---

**শেষ Update:** 2026-02-12  
**Fun Fact:** 100+ categories মানে প্রায় সব topic এ লেখা যায়!
