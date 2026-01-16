/**
 * RSS Feed Generator for Content Studio
 * Auto-generates RSS 2.0 feeds for blog posts
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class RSSGenerator {
    constructor() {
        this.siteConfig = {
            title: 'A3KM Studio - Engineering Blog',
            description: 'Arduino projects, SolidWorks tutorials, electronics guides and more - সম্পূর্ণ Bangla তে',
            link: 'https://akhinoor14.github.io/A3KM-Studio/',
            language: 'bn-BD',
            copyright: `© ${new Date().getFullYear()} Md Akhinoor Islam - A3KM Studio`,
            author: 'Md Akhinoor Islam',
            email: 'contact@a3kmstudio.com',
            image: 'https://akhinoor14.github.io/A3KM-Studio/images/logo.png',
            categories: ['Engineering', 'Arduino', 'SolidWorks', 'Electronics', 'Robotics']
        };
    }

    // ==================== MAIN RSS GENERATION ====================

    async generateMainFeed(posts) {
        const now = new Date();
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n';
        xml += '<channel>\n';
        
        // Channel metadata
        xml += `  <title>${this.escapeXML(this.siteConfig.title)}</title>\n`;
        xml += `  <link>${this.siteConfig.link}</link>\n`;
        xml += `  <atom:link href="${this.siteConfig.link}Content%20Studio/rss.xml" rel="self" type="application/rss+xml" />\n`;
        xml += `  <description>${this.escapeXML(this.siteConfig.description)}</description>\n`;
        xml += `  <language>${this.siteConfig.language}</language>\n`;
        xml += `  <copyright>${this.escapeXML(this.siteConfig.copyright)}</copyright>\n`;
        xml += `  <lastBuildDate>${now.toUTCString()}</lastBuildDate>\n`;
        xml += `  <pubDate>${now.toUTCString()}</pubDate>\n`;
        xml += `  <ttl>60</ttl>\n`;
        
        // Channel image
        xml += `  <image>\n`;
        xml += `    <url>${this.siteConfig.image}</url>\n`;
        xml += `    <title>${this.escapeXML(this.siteConfig.title)}</title>\n`;
        xml += `    <link>${this.siteConfig.link}</link>\n`;
        xml += `  </image>\n`;
        
        // Categories
        this.siteConfig.categories.forEach(category => {
            xml += `  <category>${this.escapeXML(category)}</category>\n`;
        });
        
        // Items (posts)
        const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedPosts.forEach(post => {
            xml += this.generateItem(post);
        });
        
        xml += '</channel>\n';
        xml += '</rss>';
        
        return xml;
    }

    // ==================== ITEM GENERATION ====================

    generateItem(post) {
        const postUrl = `${this.siteConfig.link}Content%20Studio/written-posts/post-viewer.html?id=${post.id}`;
        const postDate = new Date(post.date);
        
        let item = '  <item>\n';
        item += `    <title>${this.escapeXML(post.title)}</title>\n`;
        item += `    <link>${postUrl}</link>\n`;
        item += `    <guid isPermaLink="true">${postUrl}</guid>\n`;
        item += `    <pubDate>${postDate.toUTCString()}</pubDate>\n`;
        item += `    <description>${this.escapeXML(post.excerpt || post.description)}</description>\n`;
        
        // Full content
        if (post.content) {
            item += `    <content:encoded><![CDATA[${this.formatContent(post.content)}]]></content:encoded>\n`;
        }
        
        // Author
        item += `    <author>${this.siteConfig.email} (${this.siteConfig.author})</author>\n`;
        
        // Categories/Tags
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
                item += `    <category>${this.escapeXML(tag)}</category>\n`;
            });
        }
        
        // Enclosure (image)
        if (post.coverImage) {
            const imageUrl = `${this.siteConfig.link}${post.coverImage}`;
            item += `    <enclosure url="${imageUrl}" type="image/jpeg" />\n`;
        }
        
        item += '  </item>\n';
        
        return item;
    }

    // ==================== CATEGORY-SPECIFIC FEEDS ====================

    async generateCategoryFeed(posts, category) {
        const filteredPosts = posts.filter(post => 
            post.tags && post.tags.includes(category)
        );
        
        const feed = await this.generateMainFeed(filteredPosts);
        
        // Replace channel title
        return feed.replace(
            `<title>${this.escapeXML(this.siteConfig.title)}</title>`,
            `<title>${this.escapeXML(this.siteConfig.title)} - ${category}</title>`
        );
    }

    // ==================== JSON FEED FORMAT ====================

    async generateJSONFeed(posts) {
        const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const feed = {
            version: 'https://jsonfeed.org/version/1.1',
            title: this.siteConfig.title,
            home_page_url: this.siteConfig.link,
            feed_url: `${this.siteConfig.link}Content%20Studio/feed.json`,
            description: this.siteConfig.description,
            icon: this.siteConfig.image,
            favicon: `${this.siteConfig.link}favicon.ico`,
            language: this.siteConfig.language,
            authors: [
                {
                    name: this.siteConfig.author,
                    url: this.siteConfig.link
                }
            ],
            items: sortedPosts.map(post => this.generateJSONItem(post))
        };
        
        return JSON.stringify(feed, null, 2);
    }

    generateJSONItem(post) {
        const postUrl = `${this.siteConfig.link}Content%20Studio/written-posts/post-viewer.html?id=${post.id}`;
        
        return {
            id: post.id,
            url: postUrl,
            title: post.title,
            content_html: this.formatContent(post.content || ''),
            content_text: this.stripHTML(post.content || ''),
            summary: post.excerpt || post.description,
            image: post.coverImage ? `${this.siteConfig.link}${post.coverImage}` : null,
            date_published: new Date(post.date).toISOString(),
            date_modified: new Date(post.lastUpdated || post.date).toISOString(),
            authors: [
                {
                    name: post.author || this.siteConfig.author
                }
            ],
            tags: post.tags || [],
            language: post.language || 'bn'
        };
    }

    // ==================== ATOM FEED FORMAT ====================

    async generateAtomFeed(posts) {
        const now = new Date();
        const sortedPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<feed xmlns="http://www.w3.org/2005/Atom">\n';
        
        xml += `  <title>${this.escapeXML(this.siteConfig.title)}</title>\n`;
        xml += `  <link href="${this.siteConfig.link}" rel="alternate" />\n`;
        xml += `  <link href="${this.siteConfig.link}Content%20Studio/atom.xml" rel="self" />\n`;
        xml += `  <id>${this.siteConfig.link}</id>\n`;
        xml += `  <updated>${now.toISOString()}</updated>\n`;
        xml += `  <subtitle>${this.escapeXML(this.siteConfig.description)}</subtitle>\n`;
        xml += `  <author>\n`;
        xml += `    <name>${this.escapeXML(this.siteConfig.author)}</name>\n`;
        xml += `  </author>\n`;
        
        sortedPosts.forEach(post => {
            xml += this.generateAtomEntry(post);
        });
        
        xml += '</feed>';
        
        return xml;
    }

    generateAtomEntry(post) {
        const postUrl = `${this.siteConfig.link}Content%20Studio/written-posts/post-viewer.html?id=${post.id}`;
        const postDate = new Date(post.date);
        
        let entry = '  <entry>\n';
        entry += `    <title>${this.escapeXML(post.title)}</title>\n`;
        entry += `    <link href="${postUrl}" />\n`;
        entry += `    <id>${postUrl}</id>\n`;
        entry += `    <updated>${postDate.toISOString()}</updated>\n`;
        entry += `    <summary>${this.escapeXML(post.excerpt || post.description)}</summary>\n`;
        
        if (post.content) {
            entry += `    <content type="html"><![CDATA[${this.formatContent(post.content)}]]></content>\n`;
        }
        
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
                entry += `    <category term="${this.escapeXML(tag)}" />\n`;
            });
        }
        
        entry += '  </entry>\n';
        
        return entry;
    }

    // ==================== UTILITY FUNCTIONS ====================

    escapeXML(text) {
        if (!text) return '';
        return text.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    formatContent(content) {
        if (!content) return '';
        
        // Convert markdown to HTML (basic)
        let html = content;
        
        // Headings
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold and italic
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
        
        // Code blocks
        html = html.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        
        return html;
    }

    stripHTML(html) {
        return html.replace(/<[^>]*>/g, '');
    }

    // ==================== DOWNLOAD FUNCTIONS ====================

    downloadFeed(content, filename) {
        const blob = new Blob([content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    downloadRSS(posts) {
        this.generateMainFeed(posts).then(xml => {
            this.downloadFeed(xml, 'rss.xml');
        });
    }

    downloadAtom(posts) {
        this.generateAtomFeed(posts).then(xml => {
            this.downloadFeed(xml, 'atom.xml');
        });
    }

    downloadJSON(posts) {
        this.generateJSONFeed(posts).then(json => {
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'feed.json';
            a.click();
            
            URL.revokeObjectURL(url);
        });
    }
}

// ==================== AUTO-GENERATE FEEDS ====================

async function generateAllFeeds() {
    try {
        // Load posts data
        const response = await fetch('../Content Storage/written/posts.json');
        const postsData = await response.json();
        
        const generator = new RSSGenerator();
        
        // Generate RSS 2.0
        const rss = await generator.generateMainFeed(postsData.posts);
        console.log('✅ RSS 2.0 feed generated');
        
        // Generate Atom
        const atom = await generator.generateAtomFeed(postsData.posts);
        console.log('✅ Atom feed generated');
        
        // Generate JSON Feed
        const json = await generator.generateJSONFeed(postsData.posts);
        console.log('✅ JSON feed generated');
        
        // Generate category-specific feeds
        const categories = ['Arduino', 'SolidWorks', 'Electronics', 'Robotics'];
        for (const category of categories) {
            const categoryFeed = await generator.generateCategoryFeed(postsData.posts, category);
            console.log(`✅ ${category} feed generated`);
        }
        
        return { rss, atom, json };
    } catch (error) {
        console.error('Feed generation failed:', error);
        return null;
    }
}

// Expose globally
window.RSSGenerator = RSSGenerator;
window.generateAllFeeds = generateAllFeeds;

console.log('📡 RSS Generator Loaded');
