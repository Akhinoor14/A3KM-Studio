# Mobile Markdown Viewer System

**Location:** `mobile/shared/markdown-viewer.js`

Advanced markdown rendering library for mobile with full GitHub-flavored markdown support, syntax highlighting, tables, TOC generation, and engineering theme integration.

---

## 🎯 Features

### Core Markdown Syntax
✅ **Headers** (H1-H6) with anchor links  
✅ **Bold** (`**text**` or `__text__`)  
✅ **Italic** (`*text*` or `_text_`)  
✅ **Strikethrough** (`~~text~~`)  
✅ **Inline Code** (\`code\`)  
✅ **Links** with external icon  
✅ **Images** with lazy loading  
✅ **Blockquotes** with styled borders  
✅ **Horizontal Rules** (`---`, `***`)  
✅ **Paragraphs** with proper spacing  

### Lists
✅ **Unordered Lists** (`-` or `*`)  
✅ **Ordered Lists** (`1.`, `2.`, etc.)  
✅ **Task Lists** (`- [ ]` or `- [x]`)  
✅ **Nested Lists** support  

### Advanced Features
✅ **Tables** (GitHub-flavored markdown)  
✅ **Code Blocks** with language detection  
✅ **Syntax Highlighting** (JS, Python, C/C++, etc.)  
✅ **Line Numbers** in code blocks  
✅ **Copy Code Button** with haptic feedback  
✅ **Table of Contents** auto-generation  
✅ **Anchor Links** for headers  
✅ **Emoji Support** (`:smile:`, `:rocket:`, etc.)  

### Mobile Optimization
✅ **Touch-friendly** spacing and buttons  
✅ **Horizontal Scroll** for tables and code  
✅ **Smooth Scrolling** for TOC links  
✅ **Haptic Feedback** on interactions  
✅ **Red/Black/White** engineering theme  
✅ **Responsive** design  

---

## 📦 Installation

### 1. Add Script to Page

```html
<script src="../shared/markdown-viewer.js"></script>
<!-- or -->
<script src="../../shared/markdown-viewer.js"></script>
```

The styles are automatically injected when the script loads.

---

## 🚀 Usage

### Basic Rendering

```javascript
const markdown = `
# My Article

This is **bold** and this is *italic*.

## Code Example

\`\`\`javascript
function hello() {
    console.log('Hello World!');
}
\`\`\`

## Table

| Name | Age | City |
|------|-----|------|
| John | 25  | NYC  |
| Jane | 30  | LA   |
`;

const htmlOutput = renderMarkdown(markdown);
document.getElementById('content').innerHTML = htmlOutput;
```

### With Options

```javascript
const html = renderMarkdown(markdown, {
    generateTOC: true,          // Generate table of contents
    syntaxHighlight: true,      // Enable syntax highlighting
    showLineNumbers: true,      // Show line numbers in code
    copyButton: true,           // Add copy button to code blocks
    sanitize: true,             // Remove <script> tags
    theme: 'dark-red'          // Theme (only dark-red for now)
});
```

### Generate Table of Contents

```javascript
// After rendering markdown
const tocHtml = generateTOC();

// Insert TOC in your page
document.getElementById('toc-container').innerHTML = tocHtml;
```

---

## 📖 Markdown Syntax Guide

### Headers

```markdown
# H1 Header
## H2 Header
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header
```

### Text Formatting

```markdown
**Bold text** or __bold text__
*Italic text* or _italic text_
~~Strikethrough text~~
`Inline code`
```

### Links & Images

```markdown
[Link text](https://example.com)
![Image alt](image-url.jpg)
```

### Lists

```markdown
- Unordered item 1
- Unordered item 2
  - Nested item

1. Ordered item 1
2. Ordered item 2

- [ ] Task not done
- [x] Task completed
```

### Code Blocks

````markdown
```javascript
function example() {
    console.log('Hello');
}
```

```python
def hello():
    print("Hello World")
```

```cpp
int main() {
    return 0;
}
```
````

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Blockquotes

```markdown
> This is a blockquote
> Multiple lines work too
```

### Horizontal Rule

```markdown
---
***
___
```

### Emojis

```markdown
:smile: :heart: :thumbsup: :rocket: :fire: :check: :x:
```

Renders as: 😊 ❤️ 👍 🚀 🔥 ✅ ❌

---

## 🎨 Styling Classes

All rendered elements have specific CSS classes for customization:

### Typography
- `.md-heading` - All headers
- `.md-h1`, `.md-h2`, etc. - Specific header levels
- `.md-paragraph` - Paragraphs
- `.md-bold`, `.md-italic`, `.md-strikethrough` - Text formatting
- `.md-link` - Links
- `.md-inline-code` - Inline code

### Code Blocks
- `.md-code-block` - Code block container
- `.md-code-header` - Language label + copy button
- `.md-code-language` - Language label
- `.md-code-copy` - Copy button
- `.md-code-pre` - Pre tag
- `.md-code` - Code content
- `.line-numbers`, `.line-number` - Line numbering

### Syntax Highlighting
- `.syntax-keyword` - Keywords (red)
- `.syntax-string` - Strings (rosy brown)
- `.syntax-number` - Numbers (red)
- `.syntax-boolean` - Booleans (red)
- `.syntax-comment` - Comments (gray, italic)

### Lists
- `.md-list` - List container (ul/ol)
- `.md-list-item` - List item (li)
- `.md-task-item` - Task list item container

### Tables
- `.md-table-wrapper` - Scrollable wrapper
- `.md-table` - Table element
- `.md-table-header` - Table headers (th)
- `.md-table-row` - Table rows (tr)
- `.md-table-cell` - Table cells (td)

### Other
- `.md-blockquote` - Blockquotes
- `.md-hr` - Horizontal rules
- `.md-image` - Images
- `.md-toc` - Table of contents container
- `.md-toc-link` - TOC links

---

## 🔧 API Reference

### `renderMarkdown(markdown, options)`

Main rendering function.

**Parameters:**
- `markdown` (string) - Raw markdown text
- `options` (object) - Configuration options

**Options:**
```javascript
{
    generateTOC: boolean,      // Default: true
    syntaxHighlight: boolean,  // Default: true
    showLineNumbers: boolean,  // Default: true
    copyButton: boolean,       // Default: true
    sanitize: boolean,         // Default: true
    theme: string             // Default: 'dark-red'
}
```

**Returns:** HTML string

---

### `generateTOC()`

Generates table of contents from rendered headers.

**Returns:** HTML string of TOC

**Note:** Must be called AFTER `renderMarkdown()` as it uses the collected headers.

---

### `copyCode(blockId)`

Copies code from a code block to clipboard.

**Parameters:**
- `blockId` (string) - ID of the code block

**Usage:** Automatically called by copy buttons, but can be invoked manually.

---

### `initMarkdownStyles()`

Injects CSS styles into the page. Called automatically on load.

---

## 🎯 Integration Examples

### Post Reader (Current Implementation)

**File:** `mobile/content-studio/written-posts/post-reader.js`

```javascript
function markdownToHTML(markdown) {
    return renderMarkdown(markdown, {
        generateTOC: true,
        syntaxHighlight: true,
        showLineNumbers: true,
        copyButton: true,
        sanitize: true,
        theme: 'dark-red'
    });
}

function renderPost(htmlContent) {
    const tocHtml = generateTOC();
    
    articleContainer.innerHTML = `
        <section class="article-header">...</section>
        ${tocHtml}
        <div class="article-content">${htmlContent}</div>
        <footer class="article-footer">...</footer>
    `;
}
```

### README Viewer

```javascript
async function loadReadme(filePath) {
    try {
        const response = await fetch(filePath);
        const markdown = await response.text();
        
        const html = renderMarkdown(markdown, {
            generateTOC: true,
            syntaxHighlight: true,
            showLineNumbers: false,  // No line numbers for docs
            copyButton: true
        });
        
        document.getElementById('readme-content').innerHTML = html;
        document.getElementById('readme-toc').innerHTML = generateTOC();
        
    } catch (error) {
        console.error('Failed to load README:', error);
    }
}
```

### Documentation Viewer

```javascript
function renderDocs(markdownFiles) {
    return markdownFiles.map(file => {
        const html = renderMarkdown(file.content, {
            generateTOC: false,  // Manual TOC
            syntaxHighlight: true,
            showLineNumbers: true,
            copyButton: true
        });
        
        return `<section id="${file.id}">${html}</section>`;
    }).join('');
}
```

---

## 🎨 Theme Customization

The viewer uses CSS custom properties. Override these to customize:

```css
:root {
    --md-primary: #CD5C5C;        /* Main accent color */
    --md-bg-dark: rgba(0,0,0,0.95);
    --md-bg-card: rgba(20,0,0,0.85);
    --md-text: rgba(200,200,200,0.95);
    --md-text-dim: rgba(150,150,150,0.7);
    --md-border: rgba(80,80,80,0.3);
}
```

---

## 📱 Mobile Optimization

### Touch Targets
- All interactive elements (links, buttons) are **minimum 44x44px**
- Copy buttons are **visible and easily tappable**

### Scrolling
- Tables have horizontal scroll with momentum (`-webkit-overflow-scrolling: touch`)
- Code blocks scroll independently
- Smooth scrolling for anchor links

### Performance
- Images use **lazy loading** (`loading="lazy"`)
- Syntax highlighting is **lightweight** (no heavy libraries)
- Styles injected once on load

---

## 🔍 Syntax Highlighting Support

Currently supported languages:
- ✅ JavaScript / TypeScript
- ✅ Python
- ✅ C / C++
- ✅ Plaintext (fallback)

**To add more languages**, extend the `highlightSyntax()` function patterns.

---

## 🐛 Troubleshooting

### Styles not applying
- Ensure `markdown-viewer.js` is loaded
- Check console for errors
- Verify `initMarkdownStyles()` was called

### Code copy not working
- Check if `navigator.clipboard` is supported
- Ensure page is served over HTTPS (required for clipboard API)
- Verify Font Awesome icons are loaded

### Tables not displaying correctly
- Ensure proper markdown table syntax
- Check that table has header and separator row
- Test with: `| Col1 | Col2 |\n|------|------|\n| A | B |`

### TOC not generating
- Call `generateTOC()` AFTER `renderMarkdown()`
- Ensure `generateTOC: true` in options
- Check that markdown has H1-H3 headers

---

## 📊 File Locations

```
mobile/
├── shared/
│   └── markdown-viewer.js          # Main viewer library
├── content-studio/
│   └── written-posts/
│       ├── post-reader.html        # Uses viewer
│       └── post-reader.js          # Integration code
└── test-markdown-viewer.html       # Demo/test page
```

---

## 🚀 Future Enhancements

Planned features:
- 🔄 PDF export of rendered markdown
- 🔄 Dark/light theme toggle
- 🔄 More syntax highlighting languages
- 🔄 Mermaid diagram support
- 🔄 LaTeX/Math equation rendering
- 🔄 Footnotes support
- 🔄 Definition lists
- 🔄 Custom container blocks

---

## 📝 Usage in Projects

### Where it's used:
1. **Written Posts**: Blog articles and tutorials
2. **Project READMEs**: Documentation viewing
3. **Code explanations**: Markdown documentation in projects
4. **Technical guides**: Step-by-step tutorials

### Where it should be used:
- Any page displaying `.md` files
- Documentation pages
- Blog/article systems
- Tutorial viewers
- Comments (if markdown enabled)

---

## 🔗 Related Systems

- **PDF Viewer** (`mobile/shared/pdf-viewer.js`) - For PDF documents
- **Mobile Navbar** (`mobile/shared/mobile-navbar.js`) - Navigation
- **Post Reader** (`mobile/content-studio/written-posts/`) - Blog system

---

## 💡 Best Practices

1. **Always sanitize** user-generated markdown (`sanitize: true`)
2. **Generate TOC** for long documents (`generateTOC: true`)
3. **Use syntax highlighting** for technical content
4. **Enable copy buttons** for code examples
5. **Test with Bangla text** - viewer supports Unicode fully
6. **Optimize images** - use compressed images for faster loading
7. **Keep markdown clean** - follow GitHub-flavored markdown standards

---

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify markdown syntax is correct
3. Test with the demo page: `test-markdown-viewer.html`
4. Ensure all dependencies (Font Awesome) are loaded

---

**Version:** 1.0  
**Last Updated:** February 2026  
**Author:** Md Akhinoor Islam (A3KM Studio)  
**License:** MIT
