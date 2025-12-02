# Blog Images Directory

This folder contains all images used in blog posts.

## 📁 Structure

```
images/blog/
├── default-cover.svg          # Default cover for posts without image
├── welcome-cover.svg          # Welcome post cover image
├── README.md                  # This file
└── [your-images-here]         # Your blog post images
```

## 🖼️ Image Guidelines

### Cover Images (Social Media Optimized)
- **Recommended Size:** 1200x630px
- **Format:** JPG, PNG, or SVG
- **Purpose:** Blog list thumbnails + social media sharing
- **Naming:** Use descriptive names (e.g., `arduino-led-project-cover.jpg`)

### Content Images
- **Max Width:** 1000px (for fast loading)
- **Format:** JPG (photos), PNG (screenshots), SVG (diagrams)
- **Purpose:** Images within blog post content
- **Naming:** Use lowercase with hyphens (e.g., `circuit-diagram-step1.jpg`)

## 📤 How to Upload Images

### Method 1: GitHub Web Interface
1. Go to your repository on GitHub
2. Navigate to `images/blog/`
3. Click **"Add file"** → **"Upload files"**
4. Drag and drop your images
5. Add commit message: `Add blog image: filename.jpg`
6. Click **"Commit changes"**

### Method 2: GitHub Desktop
1. Copy images to your local `images/blog/` folder
2. Open GitHub Desktop
3. Review changes and write commit message
4. Click **"Commit to main"**
5. Click **"Push origin"**

### Method 3: Git Command Line
```bash
# Navigate to your repository
cd path/to/A3KM-Studio

# Copy images to blog folder
cp ~/Downloads/my-image.jpg images/blog/

# Add and commit
git add images/blog/my-image.jpg
git commit -m "Add blog image: my-image.jpg"
git push
```

## 🎨 Image Usage

### In Blog Manager (Dashboard)

**Cover Image Field:**
```
images/blog/my-post-cover.jpg
```

**In Markdown Content:**
```markdown
![Image description](images/blog/my-image.jpg)
```

### In posts.json
```json
{
  "coverImage": "images/blog/my-post-cover.jpg"
}
```

## ✨ Best Practices

### File Naming
- ✅ **Good:** `arduino-uno-led-blink.jpg`, `solidworks-gear-design.png`
- ❌ **Bad:** `IMG_1234.jpg`, `Screenshot 2025.png`, `My Image.jpg`

### Organization Tips
1. **Date Prefix:** `2025-12-arduino-project.jpg` (keeps images sorted chronologically)
2. **Topic Grouping:** `arduino-led-1.jpg`, `arduino-led-2.jpg`
3. **Consistent Format:** Choose JPG or PNG and stick with it

### Image Optimization
- Compress images before upload (use tools like TinyPNG, ImageOptim)
- Target: < 500KB for covers, < 200KB for content images
- Use SVG for diagrams and icons (scalable + small file size)

## 📝 Quick Reference

| Image Type | Size | Format | Example |
|------------|------|--------|---------|
| Cover Image | 1200x630 | JPG/PNG/SVG | `post-cover.jpg` |
| Screenshot | Max 1000px | PNG | `app-interface.png` |
| Photo | Max 1000px | JPG | `circuit-photo.jpg` |
| Diagram | Any | SVG | `flow-diagram.svg` |
| Icon | 512x512 | SVG/PNG | `tool-icon.svg` |

## 🚀 Limits

- **File Size:** No hard limit, but keep under 5MB per image
- **Number of Images:** Unlimited! Upload as many as needed
- **Formats Supported:** JPG, PNG, GIF, SVG, WebP

## 🔗 Image Paths

All blog images use this path structure:
```
images/blog/filename.ext
```

This path is relative to the root of your website, so it works everywhere:
- ✅ Blog list page
- ✅ Single post page
- ✅ Social media sharing
- ✅ RSS feed

## 📚 Examples

### Example 1: Arduino Tutorial
```markdown
# Arduino LED Blink Tutorial

![Arduino Uno Board](images/blog/arduino-uno-board.jpg)

Connect the LED to pin 13...

![LED Circuit Diagram](images/blog/led-circuit-diagram.svg)
```

### Example 2: SolidWorks Project
```markdown
# Gear Mechanism Design

![Final Assembly](images/blog/gear-assembly-final.jpg)

Step-by-step modeling:

![Step 1: Base](images/blog/gear-step1.jpg)
![Step 2: Teeth](images/blog/gear-step2.jpg)
![Step 3: Assembly](images/blog/gear-step3.jpg)
```

## 🎯 Pro Tips

1. **Alt Text:** Always add descriptive alt text for accessibility
2. **Preview First:** Use Blog Manager's live preview to check images
3. **Backup:** Keep original high-res copies somewhere safe
4. **Version Control:** Images are tracked by Git - you can revert anytime!

## 🆘 Troubleshooting

**Image not showing?**
- Check path: Must be `images/blog/filename.ext`
- Check spelling: File names are case-sensitive on some servers
- Check format: Some browsers don't support WebP

**Image too large?**
- Compress using TinyPNG or similar tools
- Resize to recommended dimensions
- Convert photos to JPG (better compression than PNG)

**Need to replace an image?**
- Upload new image with same filename
- Git will track it as a change
- Old version stays in Git history

---

**Happy Blogging! 📝✨**

For more help, check the Blog Manager's "📤 Upload Guide" button.
