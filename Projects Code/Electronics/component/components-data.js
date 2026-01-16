// Electronics Components Data Parser and Manager
// Created: December 26, 2025
// Purpose: Parse MD files and provide component data

const ComponentsLibrary = {
    // Component categories with IDs and metadata
    categories: [
        {
            id: 'basic-tools',
            name: { en: 'Basic Tools & Components', bn: 'বেসিক টুলস ও কম্পোনেন্ট' },
            icon: '⚡',
            components: [
                { id: 'multimeter', name: { en: 'Multimeter', bn: 'মাল্টিমিটার' }, icon: '🔍', thumbnail: 'images/components/multimeter.jpg', section: { en: '01—multimeter', bn: '০১--মাল্টিমিটার' } },
                { id: 'led-pwm', name: { en: 'LED with PWM', bn: 'PWM দিয়ে LED কন্ট্রোল' }, icon: '💡', thumbnail: 'images/components/led-pwm.jpg', section: { en: '02—led-with-pwm', bn: '০২--pwm-দিয়ে-led-কন্ট্রোল' } },
                { id: 'attiny85', name: { en: 'Programming ATtiny85', bn: 'ATtiny85 প্রোগ্রামিং' }, icon: '🤖', thumbnail: 'images/components/attiny85.jpg', section: { en: '03—programming-attiny85', bn: '০৩--attiny85-প্রোগ্রামিং' } },
                { id: 'bluetooth', name: { en: 'Bluetooth Module (HC-05/06)', bn: 'ব্লুটুথ মডিউল' }, icon: '📡', thumbnail: 'images/components/bluetooth.jpg', section: { en: '04—bluetooth-module-hc-05hc-06', bn: '০৪--ব্লুটুথ-মডিউল' } },
                { id: 'multiplexing', name: { en: '50 LED Multiplexing', bn: 'Multiplexing দিয়ে ৫০ LED' }, icon: '🎛️', thumbnail: 'images/components/multiplexing.jpg', section: { en: 'multiplexing-50-leds', bn: '০৫--multiplexing-দিয়ে-৫০-led-নিয়ন্ত্রণ' } }
            ]
        },
        {
            id: 'passive',
            name: { en: 'Passive & Active Components', bn: 'প্যাসিভ ও অ্যাক্টিভ কম্পোনেন্ট' },
            icon: '🔌',
            components: [
                { id: 'diode', name: { en: 'Diodes and Rectification', bn: 'ডায়োড' }, icon: '🔺', thumbnail: 'images/components/diode.jpg', section: { en: 'diodes-and-rectification', bn: '০৬--ডায়োড' } },
                { id: 'inductors', name: { en: 'Inductors', bn: 'ইন্ডাক্টর' }, icon: '🧲', thumbnail: 'images/components/inductors.jpg', section: { en: 'inductors-in-dc-circuits', bn: '১২-১৩--ইন্ডাক্টর' } },
                { id: 'capacitors', name: { en: 'Capacitors', bn: 'ক্যাপাসিটর' }, icon: '⚡', thumbnail: 'images/components/capacitors.jpg', section: { en: 'capacitors', bn: '১৪--ক্যাপাসিটর' } },
                { id: 'resistors', name: { en: 'Resistors', bn: 'রেজিস্টর' }, icon: '📊', thumbnail: 'images/components/resistors.jpg', section: { en: 'resistors', bn: '১৬--রেজিস্টর-resistor' } },
                { id: 'oscillators', name: { en: 'Oscillators', bn: 'অসিলেটর' }, icon: '⏰', thumbnail: 'images/components/oscillators.jpg', section: { en: 'oscillators-rc-555-lc-crystal', bn: '১৭--অসিলেটর-oscillator' } }
            ]
        },
        {
            id: 'semiconductors',
            name: { en: 'Semiconductors & ICs', bn: 'সেমিকন্ডাক্টর ও আইসি' },
            icon: '💎',
            components: [
                { id: 'bjt', name: { en: 'BJT as Switch', bn: 'BJT ট্রানজিস্টর' }, icon: '⚡', thumbnail: 'images/components/bjt.jpg', section: { en: 'bjt-as-switch', bn: '২২--bjt-transistor-as-a-switch' } },
                { id: 'mosfet', name: { en: 'MOSFET as Switch', bn: 'MOSFET সুইচ' }, icon: '🚀', thumbnail: 'images/components/mosfet.jpg', section: { en: 'mosfet-as-switch', bn: '২৩--mosfet-as-a-switch' } },
                { id: '555-timer', name: { en: '555 Timer IC', bn: '555 টাইমার IC' }, icon: '⏱️', thumbnail: 'images/components/555-timer.jpg', section: { en: '555-timer-ic', bn: '২৬--555-timer-ic' } },
                { id: 'opamp', name: { en: 'Operational Amplifier', bn: 'অপারেশনাল অ্যামপ্লিফায়ার' }, icon: '📈', thumbnail: 'images/components/opamp.jpg', section: { en: 'operational-amplifier-op-amp', bn: '২১--operational-amplifier-opamp' } },
                { id: 'thyristor', name: { en: 'Thyristor & TRIAC', bn: 'থাইরিস্টর ও TRIAC' }, icon: '🔌', thumbnail: 'images/components/thyristor.jpg', section: { en: 'thyristor--triac', bn: '২০--thyristor--triac' } }
            ]
        },
        {
            id: 'displays',
            name: { en: 'Displays & Indicators', bn: 'ডিসপ্লে ও ইন্ডিকেটর' },
            icon: '🖥️',
            components: [
                { id: '7-segment', name: { en: '7-Segment Display', bn: '7-Segment Display' }, icon: '7️⃣', thumbnail: 'images/components/7-segment.jpg', section: { en: '7-segment-display-basics', bn: '১০--7-segment-display' } },
                { id: '2-4-digit', name: { en: '2 & 4-Digit Display', bn: '2-Digit ও 4-Digit Display' }, icon: '🔢', thumbnail: 'images/components/2-4-digit.jpg', section: { en: '2--and-4-digit-7-segment-multiplexing', bn: '১১--2-digit-ও-4-digit-display' } },
                { id: 'led-basics', name: { en: 'LED Basics', bn: 'LED বেসিক' }, icon: '💡', thumbnail: 'images/components/led-basics.jpg', section: { en: 'led-basics-proper-use-in-circuits', bn: 'led-basics' } },
                { id: 'led-matrix', name: { en: '384-LED Matrix', bn: '384-LED Matrix' }, icon: '💡', thumbnail: 'images/components/led-matrix.jpg', section: { en: 'driving-a-384-led-matrix', bn: '৩৫--shift-register-ও-multiplexing-384-leds' } }
            ]
        },
        {
            id: 'motors',
            name: { en: 'Motors & Actuators', bn: 'মোটর ও অ্যাকচুয়েটর' },
            icon: '⚙️',
            components: [
                { id: 'bldc', name: { en: 'BLDC Motors & ESC', bn: 'BLDC Motor & ESC' }, icon: '🔄', thumbnail: 'images/components/bldc.jpg', section: { en: 'bldc-motors--esc', bn: '১৮--brushless-dc-motor-bldc--esc' } },
                { id: 'stepper', name: { en: 'Stepper Motors', bn: 'স্টেপার মোটর' }, icon: '🎯', thumbnail: 'images/components/stepper.jpg', section: { en: 'stepper-motors', bn: '২৪--stepper-motor' } },
                { id: 'servo', name: { en: 'Servo Motors', bn: 'সার্ভো মোটর' }, icon: '🎮', thumbnail: 'images/components/servo.jpg', section: { en: 'servo-motors', bn: '২৫--servo-motor' } },
                { id: 'motor-encoder', name: { en: 'Motor Encoder', bn: 'মোটর এনকোডার' }, icon: '⚙️', thumbnail: 'images/components/motor-encoder.jpg', section: { en: 'motor-encoder', bn: '৫৩--motor-encoder' } }
            ]
        },
        {
            id: 'sensors',
            name: { en: 'Sensors & Communication', bn: 'সেন্সর ও কমিউনিকেশন' },
            icon: '🌡️',
            components: [
                { id: 'temp-sensors', name: { en: 'Temperature Sensors', bn: 'তাপমাত্রা সেন্সর' }, icon: '🌡️', thumbnail: 'images/components/temp-sensors.jpg', section: { en: 'temperature-sensors-ntc-pt100-lm35-ds18b20', bn: '১৫--তাপমাত্রা-সেন্সর' } },
                { id: 'i2c', name: { en: 'I²C Protocol', bn: 'I²C প্রোটোকল' }, icon: '📡', thumbnail: 'images/components/i2c.jpg', section: { en: 'ic-protocol', bn: '১৯--ic-communication-protocol' } },
                { id: 'spi', name: { en: 'SPI Protocol', bn: 'SPI প্রোটোকল' }, icon: '⚡', thumbnail: 'images/components/spi.jpg', section: { en: 'spi-protocol', bn: '৩৩--spi-communication-protocol' } },
                { id: 'can-bus', name: { en: 'CAN Bus', bn: 'CAN Bus' }, icon: '🚗', thumbnail: 'images/components/can-bus.jpg', section: { en: 'can-bus', bn: '৪০--can-bus-controller-area-network' } },
                { id: 'rfid', name: { en: 'RFID & NFC', bn: 'RFID ও NFC' }, icon: '🆔', thumbnail: 'images/components/rfid.jpg', section: { en: 'rfid--nfc-basics-and-security', bn: '৩৬--rfid-ও-nfc' } }
            ]
        },
        {
            id: 'power',
            name: { en: 'Power & Energy Systems', bn: 'পাওয়ার ও এনার্জি' },
            icon: '🔋',
            components: [
                { id: 'solar', name: { en: 'Solar Panels & Controllers', bn: 'সোলার প্যানেল ও চার্জ কন্ট্রোলার' }, icon: '☀️', thumbnail: 'images/components/solar.jpg', section: { en: 'solar-panels--charge-controllers-mpptpwm', bn: '২৯--solar-panel--charge-controller' } },
                { id: 'relay', name: { en: 'Relays & Optocouplers', bn: 'রিলে ও অপটোকাপলার' }, icon: '🔌', thumbnail: 'images/components/relay.jpg', section: { en: 'relays--optocouplers', bn: '৩১--relay--optocoupler' } },
                { id: 'transformer', name: { en: 'Transformers', bn: 'ট্রান্সফর্মার' }, icon: '🔄', thumbnail: 'images/components/transformer.jpg', section: { en: 'transformers', bn: '৩৮--transformer-ট্রান্সফর্মার' } },
                { id: 'dac', name: { en: 'Digital-to-Analog Converter', bn: 'DAC' }, icon: '🎵', thumbnail: 'images/components/dac.jpg', section: { en: 'digital-to-analog-converter-dac', bn: '০৭--dac' } }
            ]
        }
    ],

    // Get all components as flat array
    getAllComponents() {
        const allComponents = [];
        this.categories.forEach(category => {
            category.components.forEach(comp => {
                allComponents.push({
                    ...comp,
                    categoryId: category.id,
                    categoryName: category.name
                });
            });
        });
        return allComponents;
    },

    // Search components by name (both languages)
    searchComponents(query) {
        if (!query || query.trim() === '') {
            return [];
        }
        
        const searchTerm = query.toLowerCase().trim();
        const allComponents = this.getAllComponents();
        
        return allComponents.filter(comp => {
            const enName = comp.name.en.toLowerCase();
            const bnName = comp.name.bn.toLowerCase();
            return enName.includes(searchTerm) || bnName.includes(searchTerm);
        });
    },

    // Get components by category
    getComponentsByCategory(categoryId) {
        const category = this.categories.find(c => c.id === categoryId);
        return category ? category.components : [];
    },

    // Get component by ID
    getComponentById(componentId) {
        const allComponents = this.getAllComponents();
        return allComponents.find(c => c.id === componentId);
    },

    // Get category info
    getCategoryById(categoryId) {
        return this.categories.find(c => c.id === categoryId);
    },

    // Load component content from MD file
    async loadComponentContent(componentId, language = 'bn') {
        const component = this.getComponentById(componentId);
        if (!component) {
            throw new Error('Component not found');
        }

        const fileName = language === 'en' 
            ? 'Electronic componet English.md' 
            : 'Electronic component BANGLA.md';
        
        try {
            const response = await fetch(`Electronic Components Guide/${fileName}`);
            const content = await response.text();
            
            // Extract component section from MD
            const section = component.section[language];
            const sectionContent = this.extractSection(content, section);
            
            return {
                title: component.name[language],
                content: sectionContent,
                language: language
            };
        } catch (error) {
            console.error('Error loading component content:', error);
            throw error;
        }
    },

    // Extract specific section from markdown
    extractSection(markdown, sectionId) {
        // Try multiple patterns to find the section
        const patterns = [
            // Pattern 1: ## 🔍 ০১ — মাল্টিমিটার (with emoji and number)
            new RegExp(`##\\s+[^\\n]*${sectionId.replace(/-/g, '[-\\s—–]+')}[^\\n]*\\n`, 'i'),
            // Pattern 2: ## মাল্টিমিটার (simple)
            new RegExp(`##\\s+[^\\n]*${sectionId.split('--').pop().replace(/-/g, '\\s*')}[^\\n]*\\n`, 'i'),
            // Pattern 3: ## 01—Multimeter (English version)
            new RegExp(`##\\s+[^\\n]*${sectionId.replace(/০/g, '0').replace(/১/g, '1').replace(/২/g, '2').replace(/৩/g, '3').replace(/৪/g, '4').replace(/৫/g, '5').replace(/-/g, '[-\\s—–]+')}[^\\n]*\\n`, 'i')
        ];
        
        let match = null;
        let matchedPattern = null;
        
        // Try each pattern
        for (const pattern of patterns) {
            match = markdown.match(pattern);
            if (match) {
                matchedPattern = pattern;
                break;
            }
        }
        
        if (!match) {
            console.warn('Section not found:', sectionId);
            return `<div class="error-message">
                <h3>⚠️ Content Not Found</h3>
                <p>Unable to locate section: <code>${sectionId}</code></p>
                <p>This section may need to be added to the markdown file.</p>
            </div>`;
        }

        const startIndex = match.index;
        
        // Find next ## heading or end of file
        const remainingText = markdown.slice(startIndex + match[0].length);
        const nextHeadingMatch = remainingText.match(/\n##\s+[^#]/);
        const endIndex = nextHeadingMatch 
            ? startIndex + match[0].length + nextHeadingMatch.index 
            : markdown.length;

        const sectionContent = markdown.slice(startIndex, endIndex).trim();
        
        // Remove the section heading (we'll add it back as the modal title)
        const contentWithoutHeading = sectionContent.replace(/^##\s+[^\n]+\n/, '').trim();
        
        return contentWithoutHeading || sectionContent;
    },

    // Parse markdown to HTML
    parseMarkdown(markdown) {
        let html = markdown;

        // Escape HTML entities first
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Headers (process from h4 to h1 to avoid conflicts)
        html = html.replace(/^#### (.+)$/gim, '<h4>$1</h4>');
        html = html.replace(/^### (.+)$/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gim, '<h1>$1</h1>');

        // Bold and Italic (process triple asterisks first)
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Code blocks (preserve formatting)
        const codeBlocks = [];
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
            const placeholder = `___CODEBLOCK_${codeBlocks.length}___`;
            codeBlocks.push(`<pre><code class="language-${lang}">${code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')}</code></pre>`);
            return placeholder;
        });

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');
        html = html.replace(/^\*\*\*$/gim, '<hr>');

        // Tables
        html = this.parseMarkdownTables(html);

        // Lists (process after tables)
        html = this.parseMarkdownLists(html);

        // Blockquotes
        html = html.replace(/^&gt; (.+)$/gim, '<blockquote>$1</blockquote>');
        // Merge consecutive blockquotes
        html = html.replace(/<\/blockquote>\s*<blockquote>/g, '<br>');

        // Paragraphs
        const lines = html.split('\n');
        let inList = false;
        let inTable = false;
        let inBlockquote = false;
        let result = [];
        let paragraphBuffer = [];

        for (let line of lines) {
            const trimmed = line.trim();
            
            // Check context
            if (trimmed.startsWith('<ul>') || trimmed.startsWith('<ol>')) inList = true;
            if (trimmed.startsWith('</ul>') || trimmed.startsWith('</ol>')) inList = false;
            if (trimmed.startsWith('<table>')) inTable = true;
            if (trimmed.startsWith('</table>')) inTable = false;
            if (trimmed.startsWith('<blockquote>')) inBlockquote = true;
            if (trimmed.startsWith('</blockquote>')) inBlockquote = false;
            
            // Skip paragraph wrapping for special elements
            if (trimmed.startsWith('<h') || trimmed.startsWith('<pre>') || 
                trimmed.startsWith('</pre>') || trimmed === '<hr>' ||
                inList || inTable || inBlockquote || trimmed.startsWith('___CODEBLOCK_')) {
                
                // Flush paragraph buffer
                if (paragraphBuffer.length > 0) {
                    result.push('<p>' + paragraphBuffer.join(' ') + '</p>');
                    paragraphBuffer = [];
                }
                result.push(line);
            } else if (trimmed === '') {
                // Empty line - end paragraph
                if (paragraphBuffer.length > 0) {
                    result.push('<p>' + paragraphBuffer.join(' ') + '</p>');
                    paragraphBuffer = [];
                }
            } else {
                // Add to paragraph buffer
                paragraphBuffer.push(trimmed);
            }
        }
        
        // Flush any remaining paragraph
        if (paragraphBuffer.length > 0) {
            result.push('<p>' + paragraphBuffer.join(' ') + '</p>');
        }
        
        html = result.join('\n');

        // Restore code blocks
        codeBlocks.forEach((block, index) => {
            html = html.replace(`___CODEBLOCK_${index}___`, block);
        });

        // Clean up
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>\s*<\/p>/g, '');

        return html;
    },

    // Parse markdown tables
    parseMarkdownTables(html) {
        const tableRegex = /(\|.+\|\n)+/g;
        return html.replace(tableRegex, (table) => {
            const rows = table.trim().split('\n');
            if (rows.length < 2) return table;

            let tableHtml = '<table><thead><tr>';
            
            // Header row
            const headers = rows[0].split('|').filter(cell => cell.trim());
            headers.forEach(header => {
                tableHtml += `<th>${header.trim()}</th>`;
            });
            tableHtml += '</tr></thead><tbody>';

            // Skip separator row (index 1) and process data rows
            for (let i = 2; i < rows.length; i++) {
                const cells = rows[i].split('|').filter(cell => cell.trim());
                if (cells.length > 0) {
                    tableHtml += '<tr>';
                    cells.forEach(cell => {
                        tableHtml += `<td>${cell.trim()}</td>`;
                    });
                    tableHtml += '</tr>';
                }
            }

            tableHtml += '</tbody></table>';
            return tableHtml;
        });
    },

    // Get related components (same category, excluding current)
    getRelatedComponents(componentId, limit = 4) {
        const component = this.getComponentById(componentId);
        if (!component) return [];
        
        const categoryComponents = this.getComponentsByCategory(component.categoryId)
            .filter(c => c.id !== componentId)
            .slice(0, limit);
        
        return categoryComponents.map(c => ({
            ...c,
            categoryId: component.categoryId,
            categoryName: this.getCategoryById(component.categoryId).name
        }));
    },

    // Bookmark management
    getBookmarks() {
        const bookmarks = localStorage.getItem('component-bookmarks');
        return bookmarks ? JSON.parse(bookmarks) : [];
    },

    addBookmark(componentId) {
        const bookmarks = this.getBookmarks();
        if (!bookmarks.includes(componentId)) {
            bookmarks.push(componentId);
            localStorage.setItem('component-bookmarks', JSON.stringify(bookmarks));
        }
    },

    removeBookmark(componentId) {
        const bookmarks = this.getBookmarks();
        const updated = bookmarks.filter(id => id !== componentId);
        localStorage.setItem('component-bookmarks', JSON.stringify(updated));
    },

    isBookmarked(componentId) {
        return this.getBookmarks().includes(componentId);
    },

    // Parse markdown lists
    parseMarkdownLists(html) {
        const lines = html.split('\n');
        let result = [];
        let inUl = false;
        let inOl = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            // Unordered list item
            if (trimmed.match(/^[-*+]\s+(.+)$/)) {
                const content = trimmed.replace(/^[-*+]\s+/, '');
                if (!inUl) {
                    result.push('<ul>');
                    inUl = true;
                }
                result.push(`<li>${content}</li>`);
            }
            // Ordered list item
            else if (trimmed.match(/^\d+\.\s+(.+)$/)) {
                const content = trimmed.replace(/^\d+\.\s+/, '');
                if (!inOl) {
                    if (inUl) {
                        result.push('</ul>');
                        inUl = false;
                    }
                    result.push('<ol>');
                    inOl = true;
                }
                result.push(`<li>${content}</li>`);
            }
            // End of list
            else {
                if (inUl) {
                    result.push('</ul>');
                    inUl = false;
                }
                if (inOl) {
                    result.push('</ol>');
                    inOl = false;
                }
                result.push(line);
            }
        }
        
        // Close any open lists
        if (inUl) result.push('</ul>');
        if (inOl) result.push('</ol>');
        
        return result.join('\n');
    }
};

// Export for use in HTML
if (typeof window !== 'undefined') {
    window.ComponentsLibrary = ComponentsLibrary;
}
