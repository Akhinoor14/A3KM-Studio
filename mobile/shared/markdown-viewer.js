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

    // IMPORTANT: Process in correct order to avoid conflicts
    
    // 1. CODE BLOCKS FIRST (with syntax highlighting) - must be before inline code!
    const codeBlockPlaceholders = [];
    html = html.replace(/```(\w+)?\r?\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `___CODE_BLOCK_${codeBlockPlaceholders.length}___`;
        codeBlockPlaceholders.push(renderCodeBlock(code.trim(), lang || 'plaintext', config));
        return placeholder;
    });

    // 2. INLINE CODE (after code blocks to avoid interfering with backticks inside code blocks)
    const inlineCodePlaceholders = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `___INLINE_CODE_${inlineCodePlaceholders.length}___`;
        inlineCodePlaceholders.push(`<code class="md-inline-code">${escapeHtml(code)}</code>`);
        return placeholder;
    });

    // 3. TABLES (GitHub-flavored markdown tables)
    html = renderTables(html);

    // 4. TASK LISTS
    html = html.replace(/^- \[([ x])\] (.+)$/gim, (match, checked, text) => {
        const checkboxId = `task-${Math.random().toString(36).substr(2, 9)}`;
        const isChecked = checked === 'x';
        return `<div class="md-task-item">
            <input type="checkbox" id="${checkboxId}" ${isChecked ? 'checked' : ''} disabled>
            <label for="${checkboxId}">${text}</label>
        </div>`;
    });

    // 5. HEADERS (with TOC anchors - improved for special characters)
    html = html.replace(/^(#{1,6}) (.+)$/gim, (match, hashes, text) => {
        const level = hashes.length;
        // Better anchor generation: transliterate, handle unicode, spaces
        const anchor = text
            .toLowerCase()
            .normalize('NFD') // Decompose unicode
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/--+/g, '-') // Replace multiple hyphens with single
            .trim();
        
        if (config.generateTOC && level <= 3) {
            MarkdownViewer.tocItems.push({ level, text, anchor });
        }
        
        return `<h${level} id="${anchor}" class="md-heading md-h${level}">
            <span class="md-heading-content">${text}</span>
            <a href="#${anchor}" class="md-heading-anchor" aria-label="Permalink">#</a>
        </h${level}>`;
    });

    // 6. BLOCKQUOTES (with styling)
    html = html.replace(/^> (.+)$/gim, '<blockquote class="md-blockquote">$1</blockquote>');
    html = html.replace(/<\/blockquote>\s*<blockquote class="md-blockquote">/g, '<br>');

    // 7. HORIZONTAL RULES & SECTION SEPARATORS
    // Section separator (5+ chars) vs regular HR (3-4 chars)
    html = html.replace(/^([-*_]){5,}$/gim, '<hr class="md-section-separator">');
    html = html.replace(/^([-*_]){3,4}$/gim, '<hr class="md-hr">');

    // 8. BOLD (with strikethrough support)
    html = html.replace(/~~(.*?)~~/g, '<del class="md-strikethrough">$1</del>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="md-bold">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="md-bold">$1</strong>');

    // 9. ITALIC
    html = html.replace(/\*(.+?)\*/g, '<em class="md-italic">$1</em>');
    html = html.replace(/_(.+?)_/g, '<em class="md-italic">$1</em>');

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

    // 13. RESTORE CODE BLOCKS AND INLINE CODE (BEFORE paragraph processing)
    codeBlockPlaceholders.forEach((codeBlock, i) => {
        html = html.replace(`___CODE_BLOCK_${i}___`, codeBlock);
    });
    
    inlineCodePlaceholders.forEach((inlineCode, i) => {
        html = html.replace(`___INLINE_CODE_${i}___`, inlineCode);
    });

    // 14. PARAGRAPHS (after restoring placeholders)
    const lines = html.split('\n\n');
    html = lines.map(block => {
        block = block.trim();
        if (!block) return '';
        
        // Skip if already wrapped in HTML tag, contains HTML tags, or is a placeholder
        if (block.match(/^<(div|h[1-6]|ul|ol|pre|blockquote|table|hr|code|strong|em|img|a)/i) || 
            block.includes('</') ||
            block.includes('___CODE_BLOCK_') ||
            block.includes('___INLINE_CODE_')) {
            return block;
        }
        
        // Wrap in paragraph
        return `<p class="md-paragraph">${block}</p>`;
    }).join('\n');

    // 15. EMOJI SUPPORT (basic)
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
 * Render markdown tables with alignment support - Enhanced for robust matching
 */
function renderTables(markdown) {
    // More robust regex that handles various table formats and whitespace
    // Allows optional leading/trailing whitespace and matches multiline tables properly
    const tableRegex = /^[ \t]*(\|.+\|)[ \t]*\r?\n[ \t]*(\|[-:\s|]+\|)[ \t]*\r?\n(([ \t]*\|.+\|[ \t]*\r?\n?)+)/gm;
    
    return markdown.replace(tableRegex, (match, headerRow, alignRow, bodyRows) => {
        // Parse header - remove leading/trailing pipes and whitespace
        const headers = headerRow.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(h => h.trim()).filter(h => h);
        
        // Parse alignment from separator row - remove leading/trailing pipes
        const alignments = alignRow.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(a => a.trim()).filter(a => a).map(a => {
            if (a.startsWith(':') && a.endsWith(':')) return 'center';
            if (a.endsWith(':')) return 'right';
            return 'left';
        });
        
        // Parse body rows - handle each row properly with robust filtering
        const rows = bodyRows
            .split(/\r?\n/)
            .map(row => row.trim())
            .filter(row => row && row.startsWith('|') && row.endsWith('|'))
            .map(row => {
                return row.replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
            });

        // Generate table HTML with alignment and theme styling
        let tableHtml = '<div class="md-table-wrapper"><table class="md-table">';
        
        // Header
        tableHtml += '<thead><tr>';
        headers.forEach((header, i) => {
            const align = alignments[i] || 'left';
            tableHtml += `<th class="md-table-header" style="text-align:${align};">${header}</th>`;
        });
        tableHtml += '</tr></thead>';
        
        // Body
        tableHtml += '<tbody>';
        rows.forEach(row => {
            // Only add row if it has the correct number of cells or at least some data
            if (row.filter(c => c).length > 0) {
                tableHtml += '<tr class="md-table-row">';
                row.forEach((cell, i) => {
                    const align = alignments[i] || 'left';
                    tableHtml += `<td class="md-table-cell" style="text-align:${align};">${cell}</td>`;
                });
                tableHtml += '</tr>';
            }
        });
        tableHtml += '</tbody></table></div>';
        
        return tableHtml;
    });
}

/**
 * Basic syntax highlighting
 */
function highlightSyntax(code, language) {
    // Normalize language names
    const normalizedLang = language.toLowerCase();
    
    const patterns = {
        // JavaScript/TypeScript
        'javascript': [
            { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await|try|catch|finally|throw|new)\b/g, className: 'keyword' },
            { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'boolean' },
            { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
            { pattern: /'([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`/g, className: 'string' },
            { pattern: /\/\/.*/g, className: 'comment' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' }
        ],
        // Python
        'python': [
            { pattern: /\b(def|class|return|if|elif|else|for|while|import|from|as|with|try|except|finally|raise|lambda|yield|pass|break|continue|global|nonlocal)\b/g, className: 'keyword' },
            { pattern: /\b(True|False|None)\b/g, className: 'boolean' },
            { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
            { pattern: /'([^'\\]|\\.)*'|"([^"\\]|\\.)*"|'''[\s\S]*?'''|"""[\s\S]*?"""/g, className: 'string' },
            { pattern: /#.*/g, className: 'comment' }
        ],
        // C/C++
        'cpp': [
            { pattern: /\b(int|float|double|char|void|bool|long|short|unsigned|signed|const|static|extern|struct|class|public|private|protected|return|if|else|for|while|do|switch|case|break|continue|sizeof|typedef|enum|union|namespace|using|template|typename|virtual|override|final)\b/g, className: 'keyword' },
            { pattern: /\b(true|false|NULL|nullptr)\b/g, className: 'boolean' },
            { pattern: /\b\d+\.?\d*[uUlLfF]?\b/g, className: 'number' },
            { pattern: /"([^"\\]|\\.)*"/g, className: 'string' },
            { pattern: /\/\/.*/g, className: 'comment' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
            { pattern: /#(include|define|ifdef|ifndef|endif|pragma|if|else|elif|error|warning)\b/g, className: 'preprocessor' }
        ],
        // Arduino (INO) - Enhanced for Arduino-specific keywords
        'arduino': [
            // Arduino-specific functions
            { pattern: /\b(pinMode|digitalWrite|digitalRead|analogWrite|analogRead|analogReference|tone|noTone|shiftOut|shiftIn|pulseIn|millis|micros|delay|delayMicroseconds|min|max|abs|constrain|map|pow|sqrt|sin|cos|tan|randomSeed|random|lowByte|highByte|bitRead|bitWrite|bitSet|bitClear|bit|attachInterrupt|detachInterrupt)\b/g, className: 'function' },
            // Arduino constants
            { pattern: /\b(HIGH|LOW|INPUT|OUTPUT|INPUT_PULLUP|LED_BUILTIN|A0|A1|A2|A3|A4|A5|true|false)\b/g, className: 'constant' },
            // Arduino Serial commands
            { pattern: /\b(Serial|Serial1|Serial2|Serial3)\.(begin|end|available|read|peek|flush|print|println|write)\b/g, className: 'serial' },
            // Data types
            { pattern: /\b(void|int|char|byte|boolean|unsigned|long|short|float|double|word|string|String|array)\b/g, className: 'type' },
            // Control structures
            { pattern: /\b(if|else|for|switch|case|while|do|break|continue|return|goto|default)\b/g, className: 'keyword' },
            // Setup/Loop
            { pattern: /\b(setup|loop)\b/g, className: 'lifecycle' },
            // Numbers
            { pattern: /\b\d+\.?\d*[uUlLfF]?\b/g, className: 'number' },
            // Strings
            { pattern: /"([^"\\]|\\.)*"/g, className: 'string' },
            // Comments
            { pattern: /\/\/.*/g, className: 'comment' },
            { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
            // Preprocessor
            { pattern: /#(include|define|ifdef|ifndef|endif|if|else|elif)\b/g, className: 'preprocessor' }
        ],
        // INO is same as Arduino
        'ino': 'arduino'
    };

    // Handle language aliases
    if (patterns[normalizedLang] === 'arduino') {
        return highlightSyntax(code, 'arduino');
    }
    
    // Handle 'c' as cpp
    if (normalizedLang === 'c') {
        return highlightSyntax(code, 'cpp');
    }

    const langPatterns = patterns[normalizedLang] || patterns['javascript'];
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
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'Courier New', 'Courier', monospace;
            font-size: 0.9em;
            color: #CD5C5C;
            white-space: nowrap;
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
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'Courier New', 'Courier', monospace;
            font-size: 14px;
            line-height: 1.5;
            color: rgba(200, 200, 200, 0.95);
            -webkit-overflow-scrolling: touch;
            white-space: pre;
            word-wrap: normal;
            overflow-wrap: normal;
            scrollbar-width: thin;
            scrollbar-color: rgba(205, 92, 92, 0.4) rgba(0, 0, 0, 0.3);
        }
        
        .md-code-pre::-webkit-scrollbar {
            height: 8px;
        }
        
        .md-code-pre::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
        }
        
        .md-code-pre::-webkit-scrollbar-thumb {
            background: rgba(205, 92, 92, 0.4);
            border-radius: 4px;
        }
        
        .md-code-pre::-webkit-scrollbar-thumb:hover {
            background: rgba(205, 92, 92, 0.6);
        }
        
        .md-code {
            display: block;
            white-space: pre;
            word-break: keep-all;
            overflow-wrap: normal;
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
        
        /* Syntax Highlighting - Enhanced for Arduino */
        .syntax-keyword { color: #CD5C5C; font-weight: 600; }
        .syntax-function { color: #BC8F8F; font-weight: 600; }
        .syntax-constant { color: #DDA0DD; font-weight: 600; }
        .syntax-serial { color: #87CEEB; }
        .syntax-type { color: #98FB98; }
        .syntax-lifecycle { color: #FFD700; font-weight: 700; }
        .syntax-preprocessor { color: #FFA07A; }
        .syntax-string { color: #BC8F8F; }
        .syntax-number { color: #CD5C5C; }
        .syntax-boolean { color: #CD5C5C; }
        .syntax-comment { color: rgba(150, 150, 150, 0.7); font-style: italic; }
        
        /* Tables - Premium Engineering Theme with Grid Pattern */
        .md-table-wrapper {
            position: relative;
            overflow-x: auto;
            margin: 24px 0;
            -webkit-overflow-scrolling: touch;
            border: 2px solid rgba(205, 92, 92, 0.5);
            border-radius: 12px;
            background: 
                repeating-linear-gradient(0deg, rgba(139,0,0,0.03) 0 1px, transparent 1px 20px),
                repeating-linear-gradient(90deg, rgba(139,0,0,0.03) 0 1px, transparent 1px 20px),
                linear-gradient(135deg, rgba(0,0,0,0.98), rgba(20,0,0,0.92));
            background-size: 20px 20px, 20px 20px, 100% 100%;
            box-shadow: 
                0 8px 24px rgba(0, 0, 0, 0.6),
                0 0 40px rgba(205, 92, 92, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .md-table-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(205, 92, 92, 0.3) 20%, 
                rgba(205, 92, 92, 0.6) 50%, 
                rgba(205, 92, 92, 0.3) 80%, 
                transparent 100%);
            border-radius: 12px 12px 0 0;
        }
        
        .md-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: transparent;
            margin: 0;
        }
        
        .md-table thead {
            position: sticky;
            top: 0;
            z-index: 10;
        }
        
        .md-table-header {
            position: relative;
            padding: 16px 18px;
            background: 
                linear-gradient(135deg, rgba(205, 92, 92, 0.25), rgba(139, 0, 0, 0.18)),
                repeating-linear-gradient(45deg, 
                    rgba(255,255,255,0.02) 0px, 
                    rgba(255,255,255,0.02) 2px, 
                    transparent 2px, 
                    transparent 4px);
            border-right: 1px solid rgba(80, 80, 80, 0.3);
            border-bottom: 3px solid rgba(205, 92, 92, 0.7);
            font-weight: 700;
            font-size: 13px;
            color: #FF6B6B;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .md-table-header:last-child {
            border-right: none;
        }
        
        .md-table-header:first-child {
            border-top-left-radius: 8px;
        }
        
        .md-table-header:last-child {
            border-top-right-radius: 8px;
        }
        
        .md-table-row {
            transition: background 0.2s ease;
        }
        
        .md-table-row:nth-child(even) {
            background: rgba(10, 0, 0, 0.4);
        }
        
        .md-table-row:nth-child(odd) {
            background: rgba(0, 0, 0, 0.2);
        }
        
        .md-table-row:hover {
            background: rgba(205, 92, 92, 0.08) !important;
        }
        
        .md-table-row:last-child .md-table-cell:first-child {
            border-bottom-left-radius: 6px;
        }
        
        .md-table-row:last-child .md-table-cell:last-child {
            border-bottom-right-radius: 6px;
        }
        
        .md-table-cell {
            position: relative;
            padding: 14px 18px;
            border-right: 1px solid rgba(100, 100, 100, 0.25);
            border-bottom: 1px solid rgba(90, 90, 90, 0.2);
            font-size: 14px;
            line-height: 1.7;
            color: rgba(230, 230, 230, 0.95);
            vertical-align: top;
            transition: background 0.2s ease;
        }
        
        .md-table-cell::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 60%;
            background: linear-gradient(to bottom, 
                transparent, 
                rgba(139, 0, 0, 0.2), 
                transparent);
        }
        
        .md-table-cell:last-child {
            border-right: none;
        }
        
        .md-table-row:last-child .md-table-cell {
            border-bottom: none;
        }
        
        /* Mobile Table Responsiveness */
        @media (max-width: 640px) {
            .md-table-wrapper {
                border-radius: 8px;
                font-size: 13px;
            }
            
            .md-table-header,
            .md-table-cell {
                padding: 10px 12px;
                font-size: 13px;
            }
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
        
        /* Horizontal Rule & Section Separator */
        .md-hr {
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(205, 92, 92, 0.4), transparent);
            margin: 32px 0;
        }
        
        .md-section-separator {
            border: none;
            height: 3px;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(205, 92, 92, 0.2) 10%, 
                rgba(205, 92, 92, 0.5) 50%, 
                rgba(205, 92, 92, 0.2) 90%, 
                transparent
            );
            margin: 40px 0;
            position: relative;
        }
        
        .md-section-separator::before,
        .md-section-separator::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            background: #CD5C5C;
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .md-section-separator::before {
            left: 20px;
        }
        
        .md-section-separator::after {
            right: 20px;
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
        
        /* Table of Contents - Default Hidden */
        .md-toc {
            display: none;
            margin: 24px 0;
            padding: 24px;
            background: 
                repeating-linear-gradient(45deg, 
                    rgba(139,0,0,0.02) 0px, 
                    rgba(139,0,0,0.02) 10px, 
                    transparent 10px, 
                    transparent 20px),
                linear-gradient(135deg, rgba(205, 92, 92, 0.1), rgba(0, 0, 0, 0.4));
            border: 2px solid rgba(205, 92, 92, 0.35);
            border-left: 4px solid rgba(205, 92, 92, 0.6);
            border-radius: 10px;
            box-shadow: 
                0 4px 16px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .md-toc-title {
            font-size: 17px;
            font-weight: 700;
            color: #FF6B6B;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .md-toc-title i {
            color: #CD5C5C;
            font-size: 18px;
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
        
        /* Smooth scroll for anchor links */
        html {
            scroll-behavior: smooth;
        }
    `;
    
    document.head.appendChild(style);
    console.log('✅ Markdown viewer styles loaded');
    
    // Setup smooth scrolling after a brief delay
    setTimeout(setupSmoothScrolling, 200);
}

/**
 * Setup smooth scrolling for TOC and heading anchor links
 */
function setupSmoothScrolling() {
    // Add click handlers to all TOC links and heading anchors
    document.querySelectorAll('.md-toc-link, .md-heading-anchor').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'nearest'
                    });
                    
                    // Update URL hash without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                    
                    // Flash highlight on target heading
                    targetElement.style.transition = 'background-color 0.3s ease';
                    targetElement.style.backgroundColor = 'rgba(205, 92, 92, 0.15)';
                    setTimeout(() => {
                        targetElement.style.backgroundColor = '';
                    }, 800);
                }
            }
        });
    });
    console.log('✅ Smooth scrolling enabled for markdown anchors');
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
