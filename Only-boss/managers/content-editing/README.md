# Content Editor - Complete Guide

## 📝 Overview

The **Content Editor** is a powerful web-based tool that allows you to edit text content across ALL pages of your website with **real-time GitHub synchronization**. Changes are automatically committed to your GitHub repository and reflected on the live website.

---

## ✨ Key Features

### 🌐 **Multi-Page Support**
- **Home Page** - Hero section, tagline, tech stack
- **About Page** - Personal info, bio, education
- **Projects Gallery** - SOLIDWORKS, Arduino, MATLAB, Electronics sections
- **Contact Page** - Contact info and social links
- **Content Studio** - Hub page titles and categories

### 🔄 **GitHub Integration**
- **Read** actual content from HTML files via GitHub API
- **Write** changes directly back to repository
- **Commit** automatically with descriptive messages
- **Live Updates** - Changes reflect on website immediately

### 💾 **Auto-Save & History**
- Auto-save to localStorage every 30 seconds
- Undo/Redo functionality (up to 50 changes)
- Session recovery on browser crash

### 🛠️ **Advanced Tools**
- **Find & Replace** - Search and replace text across all pages
- **Validation** - Check for errors (email format, URL format, length limits)
- **Statistics** - Word count, character count, modified fields
- **Export Backup** - Download JSON backup of all content

---

## 🚀 Setup Instructions

### Step 1: Create GitHub Personal Access Token

1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Name: `Content Editor - A3KM Studio`
4. Expiration: Choose as needed (recommend 90 days)
5. **Select Scopes:**
   - ✅ `repo` (Full control of private repositories)
     - ✅ `repo:status`
     - ✅ `repo_deployment`
     - ✅ `public_repo`
     - ✅ `repo:invite`
6. Click **"Generate token"**
7. **IMPORTANT:** Copy the token immediately (starts with `ghp_`)

### Step 2: Open Content Editor

1. Navigate to Only Boss Dashboard
2. Click on **"Content Editor"** card
3. Paste your GitHub token in the authentication screen
4. Click **"Authenticate"**

### Step 3: Start Editing

1. Select a page from the sidebar (Home, About, Projects, etc.)
2. Editor loads current content from GitHub automatically
3. Edit any field - changes auto-save locally
4. Click **"Save to GitHub"** when ready to publish

---

## 📖 How to Use

### Editing Content

1. **Select Page:** Click on page name in sidebar
2. **Edit Fields:** Type directly in text boxes
   - Character counter shows usage
   - Color changes: Green → Orange → Red (as limit approaches)
3. **Preview:** Click eye icon to preview changes
4. **Auto-Save:** Changes save to browser every 30 seconds

### Saving Changes

#### Option 1: Save to GitHub (Live Update)
```
1. Click "Save to GitHub" button (top-right or sidebar)
2. Confirm which pages to update
3. Wait for success message
4. Changes are LIVE on website!
```

#### Option 2: Export Backup (Manual)
```
1. Click "Download Backup" in sidebar
2. Get JSON file with all content
3. Use for version control or recovery
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo last change |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + S` | Save to GitHub |
| `Ctrl + F` | Find & Replace |

---

## 🔍 Content Mapping

Each editable field is mapped to a specific HTML element via **CSS selectors**:

### Home Page
```javascript
{
  "name": "Md Akhinoor Islam",
  "selector": ".hero-title .highlight"
  // Updates: Home/index.html → <span class="highlight">
}
```

### About Page
```javascript
{
  "full_name": "Md Akhinoor Islam",
  "selector": ".about-info h2"
  // Updates: About me/about.html → <h2>
}
```

### Projects Gallery
```javascript
{
  "solidworks_title": "SOLIDWORKS Projects",
  "selector": "#solidworks-card h2"
  // Updates: Projects Code/projects.html → <h2>
}
```

---

## 🛡️ Security & Best Practices

### Token Security
- ✅ Token stored **locally** in browser only
- ✅ Never sent to external servers (except GitHub API)
- ✅ Use token with **minimum required permissions**
- ⚠️ **Never share your token publicly**
- 🔄 **Rotate tokens** every 90 days

### Content Safety
1. **Always backup** before major changes
2. **Test changes** on one page first
3. **Validate** before saving to GitHub
4. **Keep backups** of previous versions

### Workflow Recommendations
```
1. Edit content in editor
2. Review changes carefully
3. Click "Validate All"
4. Download backup (just in case)
5. Save to GitHub
6. Verify on live website
```

---

## 🔧 Troubleshooting

### Problem: Authentication Failed
**Solution:**
- Verify token starts with `ghp_`
- Check token has `repo` scope
- Ensure token hasn't expired
- Generate new token if needed

### Problem: Save Failed
**Solution:**
- Check internet connection
- Verify you have write access to repository
- Ensure GitHub API is accessible
- Check browser console for errors

### Problem: Changes Not Showing
**Solution:**
- Clear browser cache
- Wait 1-2 minutes for GitHub Pages to rebuild
- Verify correct file was updated
- Check HTML selector is correct

### Problem: Content Not Loading
**Solution:**
- Refresh the page
- Check GitHub API rate limits
- Verify file path is correct
- Logout and re-authenticate

---

## 📁 File Structure

```
Only-boss/managers/content-editing/
├── content-editor.html          # Main editor interface
├── content-editor-v2.js         # Core editor logic
├── github-sync.js               # GitHub API integration
└── README.md                    # This file
```

---

## 🔄 How It Works (Technical)

### 1. Authentication
```javascript
// Store token in localStorage
githubSync.setToken('ghp_...');

// Verify token
await githubSync.verifyToken();
```

### 2. Load Content
```javascript
// Fetch file from GitHub
const file = await githubSync.getFileContent('Home/index.html');

// Parse HTML and extract text
const content = extractContentFromHTML(file.content, selectors);
```

### 3. Edit Content
```javascript
// Update field value
editedData[page].sections[section].fields[field].value = newValue;

// Auto-save to localStorage
localStorage.setItem('contentEditorData', JSON.stringify(editedData));
```

### 4. Save to GitHub
```javascript
// Inject changes back into HTML
const updatedHTML = injectContentIntoHTML(originalHTML, editedData);

// Commit to GitHub
await githubSync.updateFileContent(filePath, updatedHTML, message, sha);
```

---

## 📊 Content Data Structure

```javascript
contentData = {
  pageName: {
    title: "Page Title",
    description: "Page description",
    filePath: "path/to/file.html",
    sections: [
      {
        id: "section_id",
        name: "Section Name",
        icon: "fa-icon",
        fields: [
          {
            id: "field_id",
            label: "Field Label",
            type: "text|textarea|email",
            value: "Current value",
            selector: ".css-selector",
            maxLength: 100
          }
        ]
      }
    ]
  }
}
```

---

## 🎯 Supported Pages & Fields

### ✅ Home Page (5 fields)
- Hero name, subtitle, description
- CTA button texts

### ✅ About Page (7 fields)
- Page header, personal info
- Department, university

### ✅ Projects Gallery (10 fields)
- Hero section
- SOLIDWORKS, Arduino, MATLAB, Electronics titles & descriptions

### ✅ Contact Page (6 fields)
- Page header
- Email, phone, location

### ✅ Content Studio (5 fields)
- Hub header
- Blog, video, books, papers titles

**Total: 33+ editable fields across 5 major pages**

---

## 🚧 Limitations

1. **Text Content Only** - Cannot edit images, colors, or layouts
2. **Single User** - No multi-user collaboration (yet)
3. **Rate Limits** - GitHub API has rate limits (60 requests/hour unauthenticated, 5000/hour authenticated)
4. **No Real-Time Preview** - Must save to GitHub to see on live site
5. **Selector Dependent** - Fields require specific CSS selectors in HTML

---

## 🔮 Future Enhancements

- [ ] Multi-user support with conflict resolution
- [ ] Real-time preview panel
- [ ] Image upload and management
- [ ] Markdown editor for blog posts
- [ ] Version history with rollback
- [ ] Scheduled publishing
- [ ] Content approval workflow
- [ ] SEO metadata editor
- [ ] Batch operations
- [ ] Plugin system

---

## 📞 Support

### Issues?
1. Check [Troubleshooting](#-troubleshooting) section
2. Review browser console for errors
3. Verify GitHub token permissions
4. Contact admin if problem persists

### Feature Requests?
Submit suggestions through Only Boss Dashboard feedback system.

---

## 📝 Changelog

### Version 2.0 (January 2026)
- ✅ GitHub API integration
- ✅ Multi-page support (5 pages)
- ✅ Real-time sync
- ✅ Auto-save & recovery
- ✅ Find & Replace
- ✅ Validation system
- ✅ Statistics dashboard

### Version 1.0 (December 2025)
- Basic editor with localStorage
- Home, About, Contact pages only
- Manual export only

---

## ⚖️ License

Part of A3KM Studio project by Md Akhinoor Islam.  
For internal use only.

---

**Last Updated:** January 22, 2026  
**Author:** Md Akhinoor Islam  
**Repository:** github.com/Akhinoor14/A3KM-Studio
