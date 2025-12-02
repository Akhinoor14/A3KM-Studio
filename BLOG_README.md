# 📝 Blog System - A3KM Studio

Complete static blog system with desktop and mobile versions, featuring posts, tags, search, pagination, related posts, comments, and RSS.

---

## 🎯 Features

### Core Features
- ✅ **Dual Layout**: Separate desktop (`blog.html`) and mobile (`blog-mobile.html`) versions
- ✅ **Markdown Support**: Write posts in Markdown with front matter metadata
- ✅ **Search & Filter**: Full-text search and tag-based filtering
- ✅ **Pagination**: 10 posts per page with prev/next navigation
- ✅ **Related Posts**: Automatically shows related posts by tags
- ✅ **Comments**: Giscus integration (GitHub Discussions-based)
- ✅ **RSS Feed**: `rss.xml` for subscribers
- ✅ **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, JSON-LD
- ✅ **Responsive Design**: Beautiful gradient UI with smooth transitions
- ✅ **Social Sharing**: X (Twitter), Facebook, LinkedIn, copy link

### Management
- ✅ **Blog Manager**: Web-based post creation/editing tool (`blog-manager.html`)
- ✅ **Token Protected**: Secure access with SHA-256 hash verification
- ✅ **Draft Support**: Hide posts until ready to publish
- ✅ **Reading Time**: Automatically calculated (words/200)

---

## 📁 File Structure

```
A3KM-Studio/
├── blog.html                       # Desktop blog page
├── blog-mobile.html                # Mobile blog page
├── blog.css                        # Desktop styles
├── blog-mobile.css                 # Mobile styles
├── blog.js                         # Blog engine (shared)
├── blog-manager.html               # Post management tool
├── rss.xml                         # RSS feed
├── content/blog/
│   ├── posts.json                  # Posts index/metadata
│   └── posts/
│       └── welcome-to-my-blog.md   # Sample post
└── images/blog/
    └── welcome-cover.jpg           # Cover images
```

---

## 🚀 Quick Start

### 1. View the Blog
- **Desktop**: Open `blog.html`
- **Mobile**: Open `blog-mobile.html`

### 2. Create a New Post

#### Option A: Using Blog Manager (Recommended)
1. Open `blog-manager.html`
2. Authenticate with your token (default: empty string, hash in code)
3. Fill out the form
4. Click "Generate Post Files"
5. Copy the generated Markdown and JSON
6. Save to appropriate locations in your repo
7. Commit and push

#### Option B: Manual Creation
1. Create `content/blog/posts/my-post-slug.md`:
   ```markdown
   ---
   title: My Post Title
   date: 2025-12-03
   tags: [tag1, tag2]
   summary: Short description
   coverImage: images/blog/my-cover.jpg
   status: published
   ---
   
   # Your Markdown Content
   
   Write your post here...
   ```

2. Update `content/blog/posts.json`:
   ```json
   [
     {
       "id": 2,
       "slug": "my-post-slug",
       "title": "My Post Title",
       "summary": "Short description",
       "date": "2025-12-03",
       "tags": ["tag1", "tag2"],
       "coverImage": "images/blog/my-cover.jpg",
       "status": "published"
     }
   ]
   ```

3. Upload cover image to `images/blog/`

---

## 🔧 Configuration

### Blog Manager Authentication
1. Generate SHA-256 hash of your password:
   ```javascript
   // In browser console:
   const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password'));
   console.log(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));
   ```
2. Replace `TOKEN_HASH` in `blog-manager.html` with your hash

### Giscus Comments Setup
1. Go to https://giscus.app
2. Configure for `Akhinoor14/A3KM-Studio`
3. Get `data-repo-id` and `data-category-id`
4. Update in `blog.js` (line ~290):
   ```javascript
   script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
   script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
   ```

### RSS Feed
- Manually update `rss.xml` when adding posts, or
- Build an automated RSS generator (future enhancement)

---

## 🎨 Customization

### Colors & Theme
Edit gradient and colors in CSS files:
```css
/* blog.css & blog-mobile.css */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Posts Per Page
Edit `PAGE_SIZE` in `blog.js`:
```javascript
const PAGE_SIZE = 10; // Change to your preference
```

### Date Format
Adjust in `formatDate()` function in `blog.js`:
```javascript
return d.toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'});
```

---

## 📋 Post Front Matter Schema

```yaml
---
title: String (required)        # Post title
date: YYYY-MM-DD (required)     # Publication date
tags: [Array] (optional)        # Tags for categorization
summary: String (optional)      # Short description (for cards & SEO)
coverImage: String (optional)   # Relative path to cover image
status: String (required)       # 'published' or 'draft'
---
```

---

## 🔍 SEO Best Practices

Each post automatically includes:
- Dynamic `<title>` tag
- Meta description from summary
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data (BlogPosting)

---

## 🛠️ Troubleshooting

### Posts Not Showing
- Check `status: 'published'` in posts.json
- Verify JSON syntax is valid
- Check browser console for errors

### Comments Not Loading
- Verify Giscus IDs in `blog.js`
- Enable Discussions in GitHub repo settings
- Check browser console for CORS/script errors

### Images Not Loading
- Use relative paths: `images/blog/filename.jpg`
- Ensure images are committed to repo
- Check file names match exactly (case-sensitive)

### Search Not Working
- Clear browser cache
- Check `posts.json` is accessible
- Verify posts have `title`, `summary`, or `tags`

---

## 🚀 Future Enhancements

- [ ] Automated RSS generation from posts.json
- [ ] Categories (in addition to tags)
- [ ] Series/multi-part posts
- [ ] Reading progress indicator
- [ ] Dark mode toggle
- [ ] Table of contents for long posts
- [ ] Code syntax highlighting
- [ ] Image lazy loading optimization
- [ ] Analytics integration
- [ ] Newsletter signup

---

## 📱 Navigation Integration

Blog links added to all pages:
- ✅ `index.html` (Home desktop)
- ✅ `home-mobile.html` (Home mobile)
- ✅ `about.html` (About desktop)
- ✅ `about-mobile.html` (About mobile)
- ✅ `contact.html` (Contact desktop)
- ✅ `contact-mobile.html` (Contact mobile)
- ✅ `projects.html` (Projects)

Position: After "Projects", before "Contact"

---

## 📄 License

Part of A3KM Studio portfolio. All rights reserved.

---

## 👨‍💻 Author

**Md Akhinoor Islam**  
A3KM Studio | Noor Academy  
Department of Energy Science & Engineering  
Khulna University of Engineering & Technology (KUET)

---

## 🙏 Acknowledgments

- **Markdown**: Simple content authoring
- **Giscus**: GitHub Discussions-based comments
- **Font Awesome**: Icons
- **Modern CSS**: Gradient & glassmorphism effects

---

**Happy Blogging! 🎉**
