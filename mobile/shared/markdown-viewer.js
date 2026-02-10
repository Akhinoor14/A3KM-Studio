/**
 * Mobile Markdown Viewer System
 * Advanced markdown rendering with full syntax support, tables, code highlighting, TOC
 * Optimized for mobile with red/black/white engineering theme
 */

const MarkdownViewer = {
    codeBlockCounter: 0,
    tocItems: [],
    currentTheme: 'dark-red'
};

/**
 * Render markdown to HTML with full feature support
 * @param {string} markdown - Raw markdown text
 * @param {Object} options - Rendering options
 * @returns {string} Rendered HTML
 */
function renderMarkdown(markdown, options = {}) {
    const config = {
        generateTOC: options.generateTOC !== false,
        syntaxHighlight: options.syntaxHighlight !== false,
        showLineNumbers: options.showLineNumbers !== false,
        copyButton: options.copyButton !== false,
        sanitize: options.sanitize !== false,
        theme: options.theme || 'dark-red'
    };

    MarkdownViewer.codeBlockCounter = 0;
    MarkdownViewer.tocItems = [];

    let html = markdown;

    // Escape HTML if sanitization enabled
    if (config.sanitize) {
        html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    }

    // 1. CODE BLOCKS (must be first, with syntax highlighting)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return renderCodeBlock(code.trim(), lang || 'plaintext', config);
    });

    // 2. TABLES (GitHub-flavored markdown tables)
    html = renderTables(html);

    // 3. TASK LISTS
    html = html.replace(/^- \[([ x])\] (.+)$/gim, (match, checked, text) => {
        const checkboxId = `task-${Math.random().toString(36).substr(2, 9)}`;
        const isChecked = checked === 'x';
        return `<div class="md-task-item">
            <input type="checkbox" id="${checkboxId}" ${isChecked ? 'checked' : ''} disabled>
            <label for="${checkboxId}">${text}</label>
        </div>`;
    });

    // 4. HEADERS (with TOC anchors)
    html = html.replace(/^(#{1,6}) (.+)$/gim, (match, hashes, text) => {
        const level = hashes.length;
        const anchor = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        
        if (config.generateTOC && level <= 3) {
            MarkdownViewer.tocItems.push({ level, text, anchor });
        }
        
        return `<h${level} id="${anchor}" class="md-heading md-h${level}">
            <span class="md-heading-content">${text}</span>
            <a href="#${anchor}" class="md-heading-anchor" aria-label="Permalink">#</a>
        </h${level}>`;
    });

    // 5. BLOCKQUOTES (with styling)
    html = html.replace(/^> (.+)$/gim, '<blockquote class="md-blockquote">$1</blockquote>');
    html = html.replace(/<\/blockquote>\s*<blockquote class="md-blockquote">/g, '<br>');

    // 6. HORIZONTAL RULES
    html = html.replace(/^(---|\*\*\*|___)$/gim, '<hr class="md-hr">');

    // 7. BOLD (with strikethrough support)
    html = html.replace(/~~(.*?)~~/g, '<del class="md-strikethrough">$1</del>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="md-bold">$1</strong>');

    // 8. ITALIC
    html = html.replace(/\*(.+?)\*/g, '<em class="md-italic">$1</em>');
    html = html.replace(/_(.+?)_/g, '<em class="md-italic">$1</em>');

    // 9. INLINE CODE
    html = html.replace(/`([^`]+)`/g, '<code class="md-inline-code">$1</code>');

    // 10. IMAGES (with lazy loading)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
        '<img src="$2" alt="$1" class="md-image" loading="lazy">');

    // 11. LINKS (with target=_blank)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
        '<a href="$2" class="md-link" target="_blank" rel="noopener noreferrer">$1 <i class="fas fa-external-link-alt" style="font-size:0.7em;opacity:0.6;"></i></a>');

    // 12. LISTS
    // Unordered lists
    html = html.replace(/^[\*\-] (.+)$/gim, '<li class="md-list-item">$1</li>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gim, '<li class="md-list-item">$1</li>');

    // Wrap consecutive li in ul/ol
    html = html.replace(/(<li class="md-list-item">.*?<\/li>\n?)+/g, (match) => {
        return `<ul class="md-list">${match}</ul>`;
    });

    // 13. PARAGRAPHS
    const lines = html.split('\n\n');
    html = lines.map(block => {
        block = block.trim();
        if (!block) return '';
        
        // Skip if already wrapped in HTML tag
        if (block.match(/^<(div|h[1-6]|ul|ol|pre|blockquote|table|hr)/)) {
            return block;
        }
        
        // Wrap in paragraph
        return `<p class="md-paragraph">${block}</p>`;
    }).join('\n');

    // 14. EMOJI SUPPORT (basic)
    html = replaceEmojis(html);

    return html;
}

/**
 * Render code block with syntax highlighting and copy button
 */
function renderCodeBlock(code, language, config) {
    const blockId = `code-block-${++MarkdownViewer.codeBlockCounter}`;
    const escapedCode = escapeHtml(code);
    const highlighted = config.syntaxHighlight ? highlightSyntax(escapedCode, language) : escapedCode;
    
    const copyBtn = config.copyButton ? `
        <button class="md-code-copy" onclick="copyCode('${blockId}')" title="Copy code">
            <i class="fas fa-copy"></i>
        </button>
    ` : '';

    const lineNumbers = config.showLineNumbers ? generateLineNumbers(code) : '';

    return `
        <div class="md-code-block">
            <div class="md-code-header">
                <span class="md-code-language">${language}</span>
                ${copyBtn}
            </div>
            <pre class="md-code-pre" id="${blockId}"><code class="md-code language-${language}">${lineNumbers}${highlighted}</code></pre>
        </div>
    `;
}

/**
 * Render markdown tables
 */
function renderTables(markdown) {
    const tableRegex = /^\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/gim;
    
    return markdown.replace(tableRegex, (match, headerRow, bodyRows) => {
        // Parse header
        const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);
        
        // Parse body rows
        const rows = bodyRows.trim().split('\n').map(row => {
            return row.split('|').map(cell => cell.trim()).filter(cell => cell);
        });

        // Generate table HTML
        let tableHtml = '<div class="md-table-wrapper"><table class="md-table">';
        
        // Header
        tableHtml += '<thead><tr>';
        headers.forEach(header => {
            tableHtml += `<th class="md-table-header">${header}</th>`;
        });
        tableHtml += '</tr></thead>';
        
        // Body
        tableHtml += '<tbody>';
        rows.forEach(row => {
            tableHtml += '<tr class="md-table-row">';
            row.forEach(cell => {
                tableHtml += `<td class="md-table-cell">${cell}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table></div>';
        
        return tableHtml;
    });
}

/**
 * Basic syntax highlighting
 */
function highlightSyntax(code, language) {
    const patterns = {
        // JavaScript/TypeScript
        'javascript': [
            { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await)\b/g, className: 'keyword' },
            { pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
            { pattern: /\b\d+\b/g, className: 'number' },
            { pattern: /'[^']*'|"[^"]*"|`[^`]*`/g, className: 'string' },
            { pattern: /\/\/.*/g, className: 'comment' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' }
        ],
        // Python
        'python': [
            { pattern: /\b(def|class|return|if|elif|else|for|while|import|from|as|with|try|except|finally)\b/g, className: 'keyword' },
            { pattern: /\b(True|False|None)\b/g, className: 'boolean' },
            { pattern: /\b\d+\b/g, className: 'number' },
            { pattern: /'[^']*'|"[^"]*"/g, className: 'string' },
            { pattern: /#.*/g, className: 'comment' }
        ],
        // C/C++
        'cpp': [
            { pattern: /\b(int|float|double|char|void|return|if|else|for|while|include|define|ifdef|endif)\b/g, className: 'keyword' },
            { pattern: /\b(true|false|NULL)\b/g, className: 'boolean' },
            { pattern: /\b\d+\b/g, className: 'number' },
            { pattern: /"[^"]*"/g, className: 'string' },
            { pattern: /\/\/.*/g, className: 'comment' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' }
        ]
    };

    const langPatterns = patterns[language] || patterns['javascript'];
    let highlighted = code;

    langPatterns.forEach(({ pattern, className }) => {
        highlighted = highlighted.replace(pattern, match => {
            return `<span class="syntax-${className}">${match}</span>`;
        });
    });

    return highlighted;
}

/**
 * Generate line numbers for code blocks
 */
function generateLineNumbers(code) {
    const lines = code.split('\n');
    const lineNumbers = lines.map((_, i) => `<span class="line-number">${i + 1}</span>`).join('\n');
    return `<span class="line-numbers">${lineNumbers}</span>`;
}

/**
 * Generate Table of Contents from tocItems
 */
function generateTOC() {
    if (MarkdownViewer.tocItems.length === 0) return '';

    let tocHtml = '<nav class="md-toc"><div class="md-toc-title"><i class="fas fa-list"></i> Table of Contents</div><ul class="md-toc-list">';
    
    MarkdownViewer.tocItems.forEach(item => {
        const indent = (item.level - 1) * 16;
        tocHtml += `<li class="md-toc-item md-toc-level-${item.level}" style="padding-left:${indent}px;">
            <a href="#${item.anchor}" class="md-toc-link">${item.text}</a>
        </li>`;
    });
    
    tocHtml += '</ul></nav>';
    return tocHtml;
}

/**
 * Copy code to clipboard
 */
function copyCode(blockId) {
    const codeBlock = document.getElementById(blockId);
    if (!codeBlock) return;

    const code = codeBlock.textContent.replace(/^\d+\n/gm, ''); // Remove line numbers
    
    navigator.clipboard.writeText(code).then(() => {
        // Show success feedback
        const btn = codeBlock.parentElement.querySelector('.md-code-copy');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = '#CD5C5C';
            
            if (navigator.vibrate) navigator.vibrate(10);
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.color = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy code:', err);
        alert('Failed to copy code. Please try again.');
    });
}

/**
 * Replace text emojis with unicode
 */
function replaceEmojis(text) {
    const emojiMap = {
        ':smile:': '😊',
        ':heart:': '❤️',
        ':thumbsup:': '👍',
        ':star:': '⭐',
        ':fire:': '🔥',
        ':rocket:': '🚀',
        ':check:': '✅',
        ':x:': '❌',
        ':warning:': '⚠️',
        ':book:': '📖',
        ':bulb:': '💡',
        ':gear:': '⚙️'
    };

    return text.replace(/:[\w]+:/g, match => emojiMap[match] || match);
}

/**
 * Escape HTML entities
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize markdown styles (inject CSS)
 */
function initMarkdownStyles() {
    if (document.getElementById('markdown-viewer-styles')) return;

    const style = document.createElement('style');
    style.id = 'markdown-viewer-styles';
    style.textContent = `
        /* ============================================
           MARKDOWN VIEWER STYLES - Engineering Theme
           ============================================ */
        
        /* Typography */
        .md-heading {
            position: relative;
            font-weight: 700;
            color: #FFFFFF;
            margin: 28px 0 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(205, 92, 92, 0.2);
        }
        
        .md-h1 {
            font-size: 28px;
            border-bottom-width: 3px;
            border-bottom-color: rgba(205, 92, 92, 0.4);
        }
        
        .md-h2 { font-size: 24px; }
        .md-h3 { font-size: 20px; }
        .md-h4 { font-size: 18px; }
        .md-h5 { font-size: 16px; }
        .md-h6 { font-size: 14px; }
        
        .md-heading-anchor {
            position: absolute;
            left: -24px;
            opacity: 0;
            color: #CD5C5C;
            text-decoration: none;
            font-weight: 400;
            transition: opacity 0.2s;
        }
        
        .md-heading:hover .md-heading-anchor {
            opacity: 1;
        }
        
        /* Paragraphs */
        .md-paragraph {
            font-size: 15px;
            line-height: 1.7;
            color: rgba(200, 200, 200, 0.95);
            margin: 16px 0;
        }
        
        /* Text Formatting */
        .md-bold {
            font-weight: 700;
            color: #FFFFFF;
        }
        
        .md-italic {
            font-style: italic;
            color: rgba(200, 200, 200, 0.9);
        }
        
        .md-strikethrough {
            text-decoration: line-through;
            opacity: 0.6;
        }
        
        /* Links */
        .md-link {
            color: #CD5C5C;
            text-decoration: none;
            border-bottom: 1px solid rgba(205, 92, 92, 0.3);
            transition: all 0.2s;
        }
        
        .md-link:hover {
            border-bottom-color: rgba(205, 92, 92, 0.8);
        }
        
        /* Lists */
        .md-list {
            margin: 16px 0;
            padding-left: 24px;
        }
        
        .md-list-item {
            font-size: 15px;
            line-height: 1.7;
            color: rgba(200, 200, 200, 0.95);
            margin: 8px 0;
        }
        
        .md-list-item::marker {
            color: #CD5C5C;
        }
        
        /* Task Lists */
        .md-task-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 0;
            font-size: 15px;
            color: rgba(200, 200, 200, 0.95);
        }
        
        .md-task-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #CD5C5C;
        }
        
        /* Code */
        .md-inline-code {
            background: rgba(205, 92, 92, 0.12);
            border: 1px solid rgba(205, 92, 92, 0.25);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #CD5C5C;
        }
        
        /* Code Blocks */
        .md-code-block {
            position: relative;
            margin: 20px 0;
            background: linear-gradient(135deg, rgba(0,0,0,0.98), rgba(20,0,0,0.92));
            border: 1px solid rgba(80, 80, 80, 0.3);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .md-code-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 16px;
            background: rgba(0, 0, 0, 0.5);
            border-bottom: 1px solid rgba(80, 80, 80, 0.3);
        }
        
        .md-code-language {
            font-size: 12px;
            font-weight: 600;
            color: #CD5C5C;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .md-code-copy {
            padding: 6px 12px;
            background: linear-gradient(135deg, rgba(205, 92, 92, 0.15), rgba(0, 0, 0, 0.3));
            border: 1px solid rgba(205, 92, 92, 0.3);
            border-radius: 4px;
            color: rgba(200, 200, 200, 0.9);
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .md-code-copy:active {
            background: linear-gradient(135deg, rgba(205, 92, 92, 0.25), rgba(0, 0, 0, 0.4));
            transform: scale(0.95);
        }
        
        .md-code-pre {
            margin: 0;
            padding: 16px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: rgba(200, 200, 200, 0.95);
            -webkit-overflow-scrolling: touch;
        }
        
        .md-code {
            display: block;
        }
        
        .line-numbers {
            display: inline-block;
            padding-right: 16px;
            margin-right: 16px;
            border-right: 1px solid rgba(80, 80, 80, 0.3);
            color: rgba(150, 150, 150, 0.5);
            user-select: none;
            text-align: right;
            min-width: 30px;
        }
        
        .line-number {
            display: block;
        }
        
        /* Syntax Highlighting */
        .syntax-keyword { color: #CD5C5C; font-weight: 600; }
        .syntax-string { color: #BC8F8F; }
        .syntax-number { color: #CD5C5C; }
        .syntax-boolean { color: #CD5C5C; }
        .syntax-comment { color: rgba(150, 150, 150, 0.7); font-style: italic; }
        
        /* Tables */
        .md-table-wrapper {
            overflow-x: auto;
            margin: 20px 0;
            -webkit-overflow-scrolling: touch;
        }
        
        .md-table {
            width: 100%;
            border-collapse: collapse;
            background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,0,0,0.85));
            border: 1px solid rgba(80, 80, 80, 0.3);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .md-table-header {
            padding: 12px 16px;
            background: linear-gradient(135deg, rgba(205, 92, 92, 0.15), rgba(0, 0, 0, 0.3));
            border-bottom: 2px solid rgba(205, 92, 92, 0.4);
            font-weight: 700;
            font-size: 14px;
            color: #CD5C5C;
            text-align: left;
        }
        
        .md-table-row:nth-child(even) {
            background: rgba(0, 0, 0, 0.3);
        }
        
        .md-table-cell {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(80, 80, 80, 0.2);
            font-size: 14px;
            color: rgba(200, 200, 200, 0.95);
        }
        
        /* Blockquotes */
        .md-blockquote {
            margin: 20px 0;
            padding: 16px;
            background: linear-gradient(135deg, rgba(205, 92, 92, 0.08), rgba(0, 0, 0, 0.3));
            border-left: 4px solid #CD5C5C;
            border-radius: 4px;
            font-size: 15px;
            line-height: 1.7;
            color: rgba(180, 180, 180, 0.9);
            font-style: italic;
        }
        
        /* Horizontal Rule */
        .md-hr {
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(205, 92, 92, 0.4), transparent);
            margin: 32px 0;
        }
        
        /* Images */
        .md-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
            display: block;
            border: 1px solid rgba(80, 80, 80, 0.3);
        }
        
        /* Table of Contents */
        .md-toc {
            margin: 24px 0;
            padding: 20px;
            background: linear-gradient(135deg, rgba(205, 92, 92, 0.08), rgba(0, 0, 0, 0.3));
            border: 1px solid rgba(205, 92, 92, 0.3);
            border-radius: 8px;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .md-toc-title {
            font-size: 16px;
            font-weight: 700;
            color: #CD5C5C;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .md-toc-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .md-toc-item {
            margin: 4px 0;
        }
        
        .md-toc-link {
            color: rgba(200, 200, 200, 0.9);
            text-decoration: none;
            font-size: 14px;
            display: block;
            padding: 6px 0;
            transition: color 0.2s;
        }
        
        .md-toc-link:hover {
            color: #CD5C5C;
        }
        
        .md-toc-level-2 { padding-left: 16px; }
        .md-toc-level-3 { padding-left: 32px; }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Markdown viewer styles loaded');
}

// Auto-initialize styles on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarkdownStyles);
} else {
    initMarkdownStyles();
}

// Export functions globally
window.renderMarkdown = renderMarkdown;
window.generateTOC = generateTOC;
window.copyCode = copyCode;
window.initMarkdownStyles = initMarkdownStyles;
window.MarkdownViewer = MarkdownViewer;

console.log('✅ Mobile Markdown Viewer System loaded');
