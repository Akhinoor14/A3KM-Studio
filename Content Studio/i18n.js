/**
 * Internationalization (i18n) System
 * Language switcher for Bangla/English
 * Author: Md Akhinoor Islam
 * A3KM Studio
 */

class I18nManager {
    constructor() {
        this.currentLang = this.getSavedLanguage() || 'bn';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.applyLanguage(this.currentLang);
        this.createLanguageSwitcher();
    }

    // ==================== TRANSLATIONS ====================

    async loadTranslations() {
        this.translations = {
            bn: {
                // Navigation
                'nav.home': 'হোম',
                'nav.about': 'আমার সম্পর্কে',
                'nav.blog': 'ব্লগ',
                'nav.projects': 'প্রজেক্ট',
                'nav.contact': 'যোগাযোগ',
                
                // Content Hub
                'hub.title': 'কন্টেন্ট স্টুডিও',
                'hub.subtitle': 'সব কন্টেন্ট এক জায়গায়',
                'hub.search': 'খুঁজুন...',
                'hub.filter': 'ফিল্টার',
                'hub.sort': 'সাজান',
                'hub.all': 'সব',
                'hub.blog': 'ব্লগ পোস্ট',
                'hub.video': 'ভিডিও',
                'hub.course': 'কোর্স',
                'hub.book': 'বই',
                'hub.paper': 'গবেষণা',
                
                // Sort options
                'sort.latest': 'সর্বশেষ',
                'sort.oldest': 'পুরাতন',
                'sort.popular': 'জনপ্রিয়',
                'sort.views': 'সবচেয়ে দেখা',
                
                // Actions
                'action.read': 'পড়ুন',
                'action.watch': 'দেখুন',
                'action.download': 'ডাউনলোড',
                'action.share': 'শেয়ার করুন',
                'action.like': 'পছন্দ',
                'action.bookmark': 'সংরক্ষণ',
                'action.comment': 'মন্তব্য',
                'action.print': 'প্রিন্ট',
                
                // Time
                'time.min': 'মিনিট',
                'time.hour': 'ঘন্টা',
                'time.day': 'দিন',
                'time.week': 'সপ্তাহ',
                'time.month': 'মাস',
                'time.year': 'বছর',
                'time.ago': 'আগে',
                'time.readingTime': 'পড়ার সময়',
                
                // Stats
                'stats.views': 'ভিউ',
                'stats.likes': 'লাইক',
                'stats.comments': 'মন্তব্য',
                'stats.downloads': 'ডাউনলোড',
                
                // Messages
                'msg.noResults': 'কোন ফলাফল পাওয়া যায়নি',
                'msg.loading': 'লোড হচ্ছে...',
                'msg.error': 'ত্রুটি ঘটেছে',
                'msg.success': 'সফলভাবে সম্পন্ন',
                'msg.offline': 'আপনি অফলাইন আছেন',
                'msg.online': 'আবার অনলাইন!',
                
                // Comments
                'comment.title': 'মন্তব্য',
                'comment.add': 'মন্তব্য যোগ করুন',
                'comment.reply': 'উত্তর দিন',
                'comment.edit': 'সম্পাদনা',
                'comment.delete': 'মুছুন',
                'comment.noComments': 'এখনও কোন মন্তব্য নেই',
                
                // PWA
                'pwa.install': 'ইনস্টল করুন',
                'pwa.installMsg': 'দ্রুত অ্যাক্সেস এবং অফলাইন সাপোর্ট পান',
                'pwa.update': 'আপডেট করুন',
                'pwa.updateMsg': 'নতুন ভার্সন উপলব্ধ!',
                
                // Footer
                'footer.copyright': '© ২০২৬ Md Akhinoor Islam - A3KM Studio',
                'footer.allRights': 'সর্বস্বত্ব সংরক্ষিত'
            },
            
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.about': 'About Me',
                'nav.blog': 'Blog',
                'nav.projects': 'Projects',
                'nav.contact': 'Contact',
                
                // Content Hub
                'hub.title': 'Content Studio',
                'hub.subtitle': 'All content in one place',
                'hub.search': 'Search...',
                'hub.filter': 'Filter',
                'hub.sort': 'Sort',
                'hub.all': 'All',
                'hub.blog': 'Blog Posts',
                'hub.video': 'Videos',
                'hub.course': 'Courses',
                'hub.book': 'Books',
                'hub.paper': 'Research',
                
                // Sort options
                'sort.latest': 'Latest',
                'sort.oldest': 'Oldest',
                'sort.popular': 'Popular',
                'sort.views': 'Most Viewed',
                
                // Actions
                'action.read': 'Read',
                'action.watch': 'Watch',
                'action.download': 'Download',
                'action.share': 'Share',
                'action.like': 'Like',
                'action.bookmark': 'Bookmark',
                'action.comment': 'Comment',
                'action.print': 'Print',
                
                // Time
                'time.min': 'minutes',
                'time.hour': 'hour',
                'time.day': 'day',
                'time.week': 'week',
                'time.month': 'month',
                'time.year': 'year',
                'time.ago': 'ago',
                'time.readingTime': 'Reading time',
                
                // Stats
                'stats.views': 'Views',
                'stats.likes': 'Likes',
                'stats.comments': 'Comments',
                'stats.downloads': 'Downloads',
                
                // Messages
                'msg.noResults': 'No results found',
                'msg.loading': 'Loading...',
                'msg.error': 'An error occurred',
                'msg.success': 'Success',
                'msg.offline': 'You are offline',
                'msg.online': 'Back online!',
                
                // Comments
                'comment.title': 'Comments',
                'comment.add': 'Add Comment',
                'comment.reply': 'Reply',
                'comment.edit': 'Edit',
                'comment.delete': 'Delete',
                'comment.noComments': 'No comments yet',
                
                // PWA
                'pwa.install': 'Install',
                'pwa.installMsg': 'Get quick access and offline support',
                'pwa.update': 'Update',
                'pwa.updateMsg': 'New version available!',
                
                // Footer
                'footer.copyright': '© 2026 Md Akhinoor Islam - A3KM Studio',
                'footer.allRights': 'All Rights Reserved'
            }
        };
    }

    // ==================== LANGUAGE MANAGEMENT ====================

    getSavedLanguage() {
        return localStorage.getItem('a3km_language') || 'bn';
    }

    saveLanguage(lang) {
        localStorage.setItem('a3km_language', lang);
    }

    switchLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.saveLanguage(lang);
            this.applyLanguage(lang);
            this.updateSwitcherUI();
            
            // Emit language change event
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        }
    }

    applyLanguage(lang) {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    translate(key, params = {}) {
        let translation = this.translations[this.currentLang]?.[key] || key;
        
        // Replace parameters
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }

    // Short alias
    t(key, params = {}) {
        return this.translate(key, params);
    }

    // ==================== UI COMPONENTS ====================

    createLanguageSwitcher() {
        const switcher = document.createElement('div');
        switcher.id = 'language-switcher';
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'bn' ? 'active' : ''}" 
                    onclick="i18n.switchLanguage('bn')" 
                    data-lang="bn">
                বাংলা
            </button>
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" 
                    onclick="i18n.switchLanguage('en')" 
                    data-lang="en">
                English
            </button>
        `;
        
        // Add to header or body
        const header = document.querySelector('.header') || document.body;
        header.appendChild(switcher);
    }

    updateSwitcherUI() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            }
        });
    }

    // ==================== DYNAMIC CONTENT ====================

    translateDynamicContent(element) {
        // For dynamically added content
        element.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.translate(key);
        });
    }

    // ==================== NUMBER FORMATTING ====================

    formatNumber(number) {
        // Format numbers according to locale
        if (this.currentLang === 'bn') {
            // Bengali numerals
            const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return number.toString().split('').map(d => bnDigits[parseInt(d)] || d).join('');
        }
        return number.toLocaleString('en-US');
    }

    // ==================== DATE FORMATTING ====================

    formatDate(date, format = 'short') {
        const d = new Date(date);
        
        if (this.currentLang === 'bn') {
            const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                          'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
            
            if (format === 'long') {
                return `${this.formatNumber(d.getDate())} ${months[d.getMonth()]}, ${this.formatNumber(d.getFullYear())}`;
            }
            return `${this.formatNumber(d.getDate())}/${this.formatNumber(d.getMonth() + 1)}/${this.formatNumber(d.getFullYear())}`;
        }
        
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: format === 'long' ? 'long' : 'short',
            day: 'numeric'
        });
    }

    formatRelativeTime(date) {
        const now = new Date();
        const diff = (now - new Date(date)) / 1000; // seconds
        
        const units = [
            { name: 'year', seconds: 31536000 },
            { name: 'month', seconds: 2592000 },
            { name: 'week', seconds: 604800 },
            { name: 'day', seconds: 86400 },
            { name: 'hour', seconds: 3600 },
            { name: 'min', seconds: 60 }
        ];
        
        for (const unit of units) {
            const value = Math.floor(diff / unit.seconds);
            if (value >= 1) {
                return `${this.formatNumber(value)} ${this.t('time.' + unit.name)} ${this.t('time.ago')}`;
            }
        }
        
        return this.t('time.justNow', {}, 'Just now');
    }
}

// ==================== I18N STYLES ====================

const i18nStyles = `
<style>
.language-switcher {
    display: flex;
    gap: 5px;
    background: #2d2d2d;
    padding: 5px;
    border-radius: 20px;
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.lang-btn {
    background: transparent;
    border: none;
    color: #ccc;
    padding: 8px 15px;
    border-radius: 15px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
}

.lang-btn:hover {
    background: #3d3d3d;
    color: #fff;
}

.lang-btn.active {
    background: #CC0000;
    color: #fff;
}

@media (max-width: 768px) {
    .language-switcher {
        top: 10px;
        right: 10px;
        scale: 0.9;
    }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', i18nStyles);

// ==================== GLOBAL INSTANCE ====================

window.i18n = new I18nManager();

// Expose translation function globally
window.t = (key, params) => i18n.translate(key, params);

console.log('🌐 i18n Manager Loaded');
