# 📚 How to Add New Documentation - নতুন Documentation যোগ করার নিয়ম

এই guide follow করে ভবিষ্যতে সহজে নতুন documentation যোগ করা যাবে।

---

## 🎯 Quick Steps:

1. **সঠিক Category নির্বাচন করুন**
2. **`.md` file তৈরি করে সঠিক folder এ রাখুন**
3. **`docs-data.json` এ entry যোগ করুন**
4. **(Optional) Thumbnail তৈরি করুন**

---

## 📁 Available Categories:

| Category | Folder | কখন ব্যবহার করবেন |
|----------|--------|-------------------|
| 📊 Reports | `storage/reports/` | System reports, production checks |
| 👑 Only Boss | `storage/only-boss-system/` | Admin system documentation |
| 📱 Mobile CSS | `storage/mobile-optimization/` | Mobile optimization guides |
| 🎨 Content Studio | `storage/content-studio/` | Content management docs |
| 🔧 Projects | `storage/projects/` | Project management guides |
| ⚙️ Configuration | `storage/configuration/` | Settings & config docs |
| 🔐 API Integration | `storage/api-integration/` | API & token guides |
| 📲 Mobile Features | `storage/mobile-features/` | Mobile viewers & navigation |
| 🛠️ Tools | `storage/tools-utilities/` | Helper tools documentation |
| 🖼️ Assets | `storage/assets/` | Images & media docs |

---

## 📝 Step-by-Step Guide:

### Step 1: `.md` File তৈরি করুন

**Example:** নতুন একটা GitHub Actions guide তৈরি করছেন

```markdown
# GitHub Actions Integration Guide

## Overview
This guide explains how to integrate GitHub Actions...

## Prerequisites
- GitHub account
- Repository access

## Setup
...
```

**File name:** `github-actions-integration.md`

---

### Step 2: সঠিক Folder এ রাখুন

**Category চিন্তা করুন:**
- এটা কি report? → `storage/reports/`
- API integration? → `storage/api-integration/`
- Tool/Utility? → `storage/tools-utilities/`

**উদাহরণ:** GitHub Actions একটা tool, তাই:
```
Documentation/storage/tools-utilities/github-actions-integration.md
```

---

### Step 3: `docs-data.json` এ Entry যোগ করুন

**File location:** `Documentation/docs-data.json`

**Template:**
```json
{
  "id": "unique-id-here",
  "title": "Display Title",
  "description": "Short description (1-2 lines)",
  "category": "category-name",
  "thumbnail": "assets/thumbnails/image-name.jpg",
  "file": "storage/folder-name/file-name.md",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "readTime": "10 min",
  "lastUpdated": "2026-02-12",
  "featured": false
}
```

**Example Entry:**
```json
{
  "id": "github-actions-integration",
  "title": "GitHub Actions Integration Guide",
  "description": "Complete guide to integrate GitHub Actions for automated workflows and CI/CD pipelines",
  "category": "tools-utilities",
  "thumbnail": "assets/thumbnails/github-actions.jpg",
  "file": "storage/tools-utilities/github-actions-integration.md",
  "tags": ["GitHub", "Actions", "CI/CD", "Automation"],
  "readTime": "15 min",
  "lastUpdated": "2026-02-12",
  "featured": true
}
```

**এটা কোথায় যোগ করবেন:**
```json
{
  "categories": [...],
  "documentation": [
    {...existing entries...},
    {
      // নতুন entry এখানে যোগ করুন
      "id": "github-actions-integration",
      ...
    }
  ]
}
```

---

### Step 4: Thumbnail তৈরি করুন (Optional)

**Thumbnail specs:**
- Size: 400x250px
- Format: JPG or PNG
- Location: `Documentation/assets/thumbnails/`

**Naming convention:**
```
category-name-feature.jpg
```

**Examples:**
- `github-actions.jpg`
- `mobile-css-guide.jpg`
- `only-boss-token-system.jpg`

**যদি thumbnail না থাকে:**
- Placeholder image ব্যবহার হবে
- অথবা category icon দেখাবে

---

## 🔧 Field Definitions:

### Required Fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique identifier (lowercase, hyphen-separated) | `"github-actions-guide"` |
| `title` | string | Display title | `"GitHub Actions Guide"` |
| `description` | string | Brief description (100-150 chars) | `"Complete CI/CD guide"` |
| `category` | string | Category folder name | `"tools-utilities"` |
| `file` | string | Path to .md file | `"storage/tools-utilities/file.md"` |
| `tags` | array | Search tags | `["GitHub", "CI/CD"]` |
| `readTime` | string | Estimated read time | `"10 min"` |
| `lastUpdated` | string | Last update date (YYYY-MM-DD) | `"2026-02-12"` |

### Optional Fields:

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `thumbnail` | string | Thumbnail path | Category icon |
| `featured` | boolean | Show in featured section | `false` |
| `author` | string | Author name | `"A3KM Studio"` |
| `version` | string | Documentation version | `"1.0"` |

---

## 📋 Category Names Reference:

```javascript
const categories = {
  "reports": "Reports & Analytics",
  "only-boss-system": "Only Boss System",
  "mobile-optimization": "Mobile Optimization",
  "content-studio": "Content Studio",
  "projects": "Projects",
  "configuration": "Configuration",
  "api-integration": "API Integration",
  "mobile-features": "Mobile Features",
  "tools-utilities": "Tools & Utilities",
  "assets": "Assets"
};
```

---

## ✅ Checklist:

যখন নতুন documentation যোগ করবেন:

```
☐ .md file তৈরি করেছেন
☐ সঠিক category folder এ রেখেছেন
☐ File naming convention follow করেছেন (lowercase-with-hyphens.md)
☐ docs-data.json এ entry যোগ করেছেন
☐ Unique ID দিয়েছেন
☐ সঠিক category name ব্যবহার করেছেন
☐ Tags যোগ করেছেন
☐ Read time estimate করেছেন
☐ Current date দিয়েছেন
☐ (Optional) Thumbnail তৈরি করেছেন
```

---

## 🔍 Verification:

যোগ করার পর verify করুন:

1. **File check:**
   ```
   Documentation/storage/[category]/[filename].md ✅
   ```

2. **JSON validation:**
   - `docs-data.json` file valid কিনা check করুন
   - JSON validator ব্যবহার করতে পারেন

3. **Browser test:**
   - Documentation page reload করুন
   - নতুন card দেখা যাচ্ছে কিনা check করুন

---

## 💡 Tips:

1. **File names:** Always use lowercase with hyphens
   - ✅ `github-actions-guide.md`
   - ❌ `GitHub_Actions_Guide.md`

2. **IDs:** Keep them short but descriptive
   - ✅ `github-actions-guide`
   - ❌ `this-is-a-very-long-guide-about-github-actions-integration`

3. **Descriptions:** Keep under 150 characters
   - Browser card এ properly display হবে

4. **Tags:** 3-5 tags is ideal
   - বেশি tags search এ সাহায্য করবে
   - কম tags cleaner দেখাবে

5. **Read time:** Realistic estimate দিন
   - ~200 words = 1 minute
   - Include code examples time

---

## 🚀 Quick Commands (AI Assistant):

যখন আমাকে (AI) বলবেন নতুন documentation তৈরি করতে:

```
"Create a new documentation about [topic] in [category] category"
```

আমি automatically:
1. `.md` file তৈরি করব
2. সঠিক folder এ রাখব
3. `docs-data.json` update করব
4. Thumbnail placeholder তৈরি করব (optional)

---

**এই guide follow করলে সহজেই নতুন documentation add করতে পারবেন!** ✅
