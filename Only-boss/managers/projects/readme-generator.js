/**
 * Auto README Generator
 * Template-based markdown generation
 * Version: 1.0.0
 * Last Updated: January 22, 2026
 */

class READMEGenerator {
    constructor() {
        this.templates = {
            basic: `# {{title}}

{{#if subtitle}}
## {{subtitle}}
{{/if}}

## Description
{{description}}

{{#if category}}
**Category:** {{category}}
{{/if}}

{{#if tags}}
**Tags:** {{tags}}
{{/if}}

{{#if tinkercadUrl}}
## View on Tinkercad
[Open in Tinkercad]({{tinkercadUrl}})
{{/if}}

{{#if components}}
## Components Used
{{#each components}}
- {{this}}
{{/each}}
{{/if}}

{{#if files}}
## Project Files
{{#if files.code}}
- **Code:** {{files.code}}
{{/if}}
{{#if files.images}}
- **Circuit Diagram:** {{files.images}}
{{/if}}
{{#if files.cad}}
- **CAD File:** {{files.cad}}
{{/if}}
{{/if}}

## Author
Created by [Your Name]

## Date
{{dateAdded}}
`,

            detailed: `# {{title}}

{{#if subtitle}}
> {{subtitle}}
{{/if}}

![Project Banner]({{bannerImage}})

## 📋 Overview
{{description}}

## 📊 Project Information
- **Category:** {{category}}
- **Difficulty:** {{difficulty}}
- **Date Added:** {{dateAdded}}
- **Last Updated:** {{lastUpdated}}
{{#if tags}}
- **Tags:** {{tags}}
{{/if}}

{{#if tinkercadUrl}}
## 🔗 Live Demo
View this project on Tinkercad: [{{tinkercadUrl}}]({{tinkercadUrl}})
{{/if}}

{{#if components}}
## 🧰 Components Required
| Component | Quantity |
|-----------|----------|
{{#each components}}
| {{this}} | 1 |
{{/each}}
{{/if}}

{{#if features}}
## ✨ Features
{{#each features}}
- {{this}}
{{/each}}
{{/if}}

{{#if steps}}
## 🚀 Getting Started

### Prerequisites
- Arduino IDE installed
- Basic electronics knowledge
- USB cable for Arduino

### Installation Steps
{{#each steps}}
{{@index}}. {{this}}
{{/each}}
{{/if}}

{{#if files}}
## 📁 Project Files
{{#if files.code}}
### Code
\`\`\`
File: {{files.code}}
\`\`\`
{{/if}}

{{#if files.images}}
### Circuit Diagram
![Circuit]({{files.images}})
{{/if}}

{{#if files.cad}}
### 3D Model
[Download CAD File]({{files.cad}})
{{/if}}
{{/if}}

{{#if troubleshooting}}
## 🔧 Troubleshooting
{{#each troubleshooting}}
- **Issue:** {{this.issue}}
  - **Solution:** {{this.solution}}
{{/each}}
{{/if}}

## 📈 Stats
- **Views:** {{views}}
- **Downloads:** {{downloads}}

## 📝 License
This project is open source and available under the MIT License.

## 👤 Author
**Your Name**
- Portfolio: [link]
- GitHub: [@yourusername]

---
*Generated with A3KM Studio Project Manager*
`,

            academic: `# {{title}}

## Abstract
{{description}}

## 1. Introduction
This project demonstrates {{title}}. The main objective is to {{objective}}.

{{#if category}}
**Field of Study:** {{category}}
{{/if}}

## 2. Methodology

{{#if components}}
### 2.1 Hardware Components
The following components were utilized:
{{#each components}}
- {{this}}
{{/each}}
{{/if}}

{{#if steps}}
### 2.2 Implementation Steps
{{#each steps}}
{{@index}}. {{this}}
{{/each}}
{{/if}}

## 3. Circuit Design
{{#if files.images}}
![Circuit Diagram]({{files.images}})

*Figure 1: Circuit schematic showing component connections*
{{/if}}

{{#if tinkercadUrl}}
Interactive simulation available at: [{{tinkercadUrl}}]({{tinkercadUrl}})
{{/if}}

{{#if files.code}}
## 4. Software Implementation
The source code can be found in: \`{{files.code}}\`
{{/if}}

{{#if results}}
## 5. Results
{{results}}
{{/if}}

## 6. Conclusion
{{conclusion}}

{{#if references}}
## 7. References
{{#each references}}
[{{@index}}] {{this}}
{{/each}}
{{/if}}

## Appendix
{{#if tags}}
**Keywords:** {{tags}}
{{/if}}

**Date of Completion:** {{dateAdded}}

**Project Repository:** [View on A3KM Studio]({{projectUrl}})
`
        };
    }

    /**
     * Render template with data
     * @param {string} template - Template string
     * @param {object} data - Data object
     * @returns {string} - Rendered markdown
     */
    render(template, data) {
        let output = template;

        // Handle conditionals {{#if field}}...{{/if}}
        output = output.replace(/\{\{#if (\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, field, content) => {
            return data[field] ? content : '';
        });

        // Handle loops {{#each array}}...{{/each}}
        output = output.replace(/\{\{#each (\w+(?:\.\w+)*)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, field, content) => {
            const array = this.getNestedProperty(data, field);
            if (!array || !Array.isArray(array)) return '';

            return array.map((item, index) => {
                let itemOutput = content;
                // Handle {{this}} for simple arrays
                itemOutput = itemOutput.replace(/\{\{this\}\}/g, item);
                // Handle {{@index}} for index
                itemOutput = itemOutput.replace(/\{\{@index\}\}/g, index + 1);
                // Handle object properties {{property}}
                if (typeof item === 'object') {
                    Object.keys(item).forEach(key => {
                        itemOutput = itemOutput.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), item[key] || '');
                    });
                }
                return itemOutput;
            }).join('');
        });

        // Handle simple variables {{field}}
        Object.keys(data).forEach(key => {
            let value = data[key];
            
            // Format arrays
            if (Array.isArray(value)) {
                value = value.join(', ');
            }
            
            // Format dates
            if (key.includes('date') || key.includes('Date')) {
                value = new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            output = output.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
        });

        // Clean up any remaining template tags
        output = output.replace(/\{\{.*?\}\}/g, '');

        return output.trim();
    }

    /**
     * Get nested property from object
     * @param {object} obj - Object
     * @param {string} path - Property path (e.g., "files.code")
     * @returns {any}
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, prop) => current?.[prop], obj);
    }

    /**
     * Generate README from project data
     * @param {object} project - Project object
     * @param {string} templateName - Template name (basic, detailed, academic)
     * @returns {string} - Generated markdown
     */
    generateREADME(project, templateName = 'basic') {
        const template = this.templates[templateName];
        if (!template) {
            throw new Error(`Template "${templateName}" not found`);
        }

        // Prepare data with defaults
        const data = {
            title: project.title || 'Untitled Project',
            subtitle: project.subtitle || '',
            description: project.description || 'No description provided.',
            category: project.category || '',
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
            dateAdded: project.dateAdded || new Date().toISOString(),
            lastUpdated: project.lastUpdated || project.dateAdded,
            tinkercadUrl: project.tinkercadUrl || '',
            components: project.components || [],
            files: project.files || {},
            views: project.views || 0,
            downloads: project.downloads || 0,
            difficulty: project.difficulty || 'Intermediate',
            features: project.features || [],
            steps: project.steps || [],
            troubleshooting: project.troubleshooting || [],
            results: project.results || '',
            conclusion: project.conclusion || '',
            references: project.references || [],
            objective: project.objective || 'create an innovative solution',
            projectUrl: project.projectUrl || '',
            bannerImage: project.bannerImage || (project.files?.images || '')
        };

        return this.render(template, data);
    }

    /**
     * Add custom template
     * @param {string} name - Template name
     * @param {string} template - Template string
     */
    addTemplate(name, template) {
        this.templates[name] = template;
    }

    /**
     * Get template names
     * @returns {Array} - Template names
     */
    getTemplateNames() {
        return Object.keys(this.templates);
    }

    /**
     * Download README as file
     * @param {string} markdown - Markdown content
     * @param {string} filename - Filename (default: README.md)
     */
    downloadREADME(markdown, filename = 'README.md') {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// ===== UI COMPONENTS =====

/**
 * Show README preview modal
 * @param {object} project - Project object
 * @param {READMEGenerator} generator - Generator instance
 * @returns {Promise} - Resolves when modal is closed
 */
function showREADMEPreview(project, generator) {
    return new Promise((resolve) => {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: #1e1e1e;
            border-radius: 12px;
            max-width: 1200px;
            width: 100%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        `;

        let currentTemplate = 'basic';
        let currentMarkdown = generator.generateREADME(project, currentTemplate);

        function renderModal() {
            modal.innerHTML = `
                <!-- Header -->
                <div style="padding: 25px; border-bottom: 2px solid #333; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: #fff; margin: 0;">
                        <i class="fas fa-file-alt"></i> README Preview
                    </h2>
                    <button id="closeModal" style="background: transparent; border: none; color: #fff; 
                            font-size: 1.5rem; cursor: pointer; padding: 5px 10px;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- Template Selector -->
                <div style="padding: 20px; border-bottom: 2px solid #333; background: #252525;">
                    <label style="color: #aaa; margin-right: 15px;">Template:</label>
                    <select id="templateSelector" style="padding: 10px 20px; background: #1e1e1e; 
                            border: 2px solid #444; border-radius: 6px; color: white; cursor: pointer;">
                        <option value="basic" ${currentTemplate === 'basic' ? 'selected' : ''}>Basic</option>
                        <option value="detailed" ${currentTemplate === 'detailed' ? 'selected' : ''}>Detailed</option>
                        <option value="academic" ${currentTemplate === 'academic' ? 'selected' : ''}>Academic</option>
                    </select>
                    <button id="refreshBtn" style="margin-left: 15px; padding: 10px 20px; background: #2196F3; 
                            color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fas fa-sync"></i> Refresh
                    </button>
                </div>

                <!-- Content Area -->
                <div style="flex: 1; overflow: hidden; display: flex;">
                    <!-- Markdown Preview -->
                    <div style="flex: 1; overflow-y: auto; padding: 30px; background: #2d2d2d;">
                        <div id="markdownPreview" style="color: #fff; line-height: 1.8;">
                            ${this.markdownToHTML(currentMarkdown)}
                        </div>
                    </div>

                    <!-- Raw Markdown -->
                    <div style="flex: 1; overflow-y: auto; padding: 30px; background: #1e1e1e; border-left: 2px solid #333;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                            <h3 style="color: #fff; margin: 0;">Raw Markdown</h3>
                            <button id="copyBtn" style="padding: 8px 16px; background: #4CAF50; color: white; 
                                    border: none; border-radius: 6px; cursor: pointer;">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                        </div>
                        <pre style="background: #0d0d0d; padding: 20px; border-radius: 8px; overflow-x: auto; 
                                color: #aaa; font-family: 'Courier New', monospace; font-size: 0.9rem; 
                                white-space: pre-wrap; word-wrap: break-word;">${this.escapeHtml(currentMarkdown)}</pre>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding: 20px; border-top: 2px solid #333; display: flex; justify-content: flex-end; gap: 15px;">
                    <button id="cancelBtn" style="padding: 12px 30px; background: #666; color: white; 
                            border: none; border-radius: 8px; cursor: pointer;">
                        Cancel
                    </button>
                    <button id="downloadBtn" style="padding: 12px 30px; background: #4CAF50; color: white; 
                            border: none; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-download"></i> Download README.md
                    </button>
                </div>
            `;
        }

        renderModal();
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Event handlers
        modal.querySelector('#closeModal').onclick = () => {
            document.body.removeChild(overlay);
            resolve(null);
        };

        modal.querySelector('#cancelBtn').onclick = () => {
            document.body.removeChild(overlay);
            resolve(null);
        };

        modal.querySelector('#templateSelector').onchange = (e) => {
            currentTemplate = e.target.value;
            currentMarkdown = generator.generateREADME(project, currentTemplate);
            renderModal();
        };

        modal.querySelector('#refreshBtn').onclick = () => {
            currentMarkdown = generator.generateREADME(project, currentTemplate);
            renderModal();
        };

        modal.querySelector('#copyBtn').onclick = () => {
            navigator.clipboard.writeText(currentMarkdown).then(() => {
                const btn = modal.querySelector('#copyBtn');
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            });
        };

        modal.querySelector('#downloadBtn').onclick = () => {
            generator.downloadREADME(currentMarkdown, `README-${project.title.replace(/\s+/g, '-')}.md`);
            document.body.removeChild(overlay);
            resolve(currentMarkdown);
        };

        // Close on overlay click
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
                resolve(null);
            }
        };
    });
}

/**
 * Convert markdown to HTML (basic implementation)
 * @param {string} markdown - Markdown text
 * @returns {string} - HTML
 */
function markdownToHTML(markdown) {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 style="color: #2196F3; margin-top: 25px;">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 style="color: #4CAF50; margin-top: 30px; border-bottom: 2px solid #444; padding-bottom: 10px;">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 style="color: #fff; margin-bottom: 20px; font-size: 2.5rem;">$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #fff;">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em style="color: #aaa;">$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2196F3; text-decoration: none;">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 15px 0;">');

    // Lists
    html = html.replace(/^\- (.+)$/gim, '<li style="margin-left: 20px;">$1</li>');
    html = html.replace(/^\d+\. (.+)$/gim, '<li style="margin-left: 20px;">$1</li>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: #0d0d0d; padding: 15px; border-radius: 8px; overflow-x: auto;"><code style="color: #4CAF50;">$1</code></pre>');
    html = html.replace(/`(.+?)`/g, '<code style="background: #333; padding: 3px 8px; border-radius: 4px; color: #4CAF50;">$1</code>');

    // Line breaks
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');

    return html;
}

/**
 * Escape HTML characters
 * @param {string} text - Text to escape
 * @returns {string}
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export
window.READMEGenerator = READMEGenerator;
window.showREADMEPreview = showREADMEPreview;

console.log('✅ README Generator loaded');
