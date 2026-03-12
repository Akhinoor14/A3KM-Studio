/**
 * ═══════════════════════════════════════════════════════════
 * ADVANCED SEARCH ENGINE - A3KM Studio
 * ═══════════════════════════════════════════════════════════
 * Features:
 * - Fuzzy matching with typo tolerance
 * - Vocabulary & synonym support
 * - Content scanning across all HTML files
 * - Context preview with highlighting
 * - Smart ranking algorithm
 * ═══════════════════════════════════════════════════════════
 */

(function(window) {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // SEARCH INDEX DATABASE (COMPREHENSIVE - 100+ ENTRIES)
    // ═══════════════════════════════════════════════════════════
    const SEARCH_INDEX = [
        // ═══ HOME PAGE ═══
        { title: 'Home', desc: 'A3KM Studio — Portfolio & Engineering Hub', icon: 'fas fa-home', url: '../Home/index.html', tags: ['home', 'landing', 'main', 'start', 'homepage', 'welcome', 'portfolio', 'index', 'hero', 'landing page'], content: 'Md Akhinoor Islam portfolio engineering hero section stats timeline skills', external: false },
        { title: 'Home — Hero Section', desc: 'Main Landing Hero Area', icon: 'fas fa-home', url: '../Home/index.html#hero', tags: ['home', 'hero', 'landing', 'main', 'top'], content: 'hero section main landing intro', external: false },
        { title: 'Home — Statistics', desc: 'Portfolio Stats & Achievements', icon: 'fas fa-chart-bar', url: '../Home/index.html#stats', tags: ['home', 'stats', 'statistics', 'numbers', 'achievements'], content: 'statistics numbers achievements data', external: false },
        { title: 'Home — Skills Section', desc: 'Technical Skills & Expertise', icon: 'fas fa-code', url: '../Home/index.html#skills', tags: ['home', 'skills', 'expertise', 'technical', 'abilities'], content: 'skills expertise technical abilities', external: false },
        { title: 'Home — Timeline', desc: 'Experience & Education Timeline', icon: 'fas fa-calendar', url: '../Home/index.html#timeline', tags: ['home', 'timeline', 'experience', 'education', 'history'], content: 'timeline experience education history', external: false },
        
        // ═══ ABOUT PAGE ═══
        { title: 'About Me', desc: 'Biography, Skills, Certificates & CV', icon: 'fas fa-user-circle', url: '../About me/about.html', tags: ['about', 'bio', 'biography', 'cv', 'resume', 'curriculum', 'skills', 'certificates', 'profile', 'personal', 'information', 'background', 'experience'], content: 'Akhinoor Islam KUET Energy Science Engineering student skills experience education background personal info', external: false, category: 'page' },
        { title: 'Download CV', desc: 'PDF Resume Download', icon: 'fas fa-download', url: '../About me/CV/Akhinoor_Islam_CV_2026.pdf', tags: ['cv', 'resume', 'download', 'pdf', 'curriculum', 'vitae', 'document', 'file'], content: 'download curriculum vitae resume pdf document', external: true, category: 'file' },
        { title: 'Certificates Viewer', desc: 'View All Certificates & Achievements', icon: 'fas fa-certificate', url: '../About me/certificates-viewer.html', tags: ['certificates', 'achievements', 'awards', 'accomplishments', 'recognition', 'credentials', 'viewer'], content: 'certificates awards achievements completion credentials', external: false, category: 'page' },
        
        // ═══ PROJECTS - MAIN ═══
        { title: 'Projects Hub', desc: 'All Engineering Projects Overview', icon: 'fas fa-folder-open', url: '../Projects Code/projects.html', tags: ['projects', 'engineering', 'work', 'portfolio', 'hub', 'showcase', 'collection', 'overview'], content: 'engineering projects work portfolio showcase overview hub', external: false, category: 'projects' },
        
        // ═══ SOLIDWORKS ═══
        { title: 'SOLIDWORKS Projects', desc: '3D CAD Models, Assemblies & Drawings', icon: 'fas fa-cube', url: '../Projects Code/solidworks/solidworks-basic-models.html', tags: ['solidworks', 'cad', '3d', 'modeling', 'design', 'engineering', 'mechanical', 'assembly', 'drawing', 'simulation', 'cae', 'parts', 'components'], content: 'SOLIDWORKS 3D CAD modeling design assemblies parts drawings mechanical engineering simulation', external: false, category: 'projects' },
        { title: 'SOLIDWORKS Basic Models', desc: 'Fundamental 3D Parts & Components', icon: 'fas fa-cube', url: '../Projects Code/solidworks/solidworks-basic-models.html', tags: ['solidworks', 'basic', 'beginner', 'fundamental', 'parts', 'components', '3d', 'simple'], content: 'basic 3D models parts components beginner SOLIDWORKS fundamental', external: false, category: 'projects' },
        { title: 'SOLIDWORKS Assemblies', desc: 'Complex Assembly Projects', icon: 'fas fa-cubes', url: '../Projects Code/solidworks/solidworks-assemblies.html', tags: ['solidworks', 'assembly', 'assemblies', 'complex', 'mechanism', 'machine', 'mates', 'constraints'], content: 'assembly mechanism mate constraint motion mechanical complex', external: false, category: 'projects' },
        
        // ═══ ARDUINO ═══
        { title: 'Arduino Projects', desc: 'Embedded Systems, IoT & Circuits', icon: 'fas fa-microchip', url: '../Projects Code/Arduino/arduino-projects.html', tags: ['arduino', 'embedded', 'microcontroller', 'iot', 'electronics', 'programming', 'sensors', 'actuators', 'circuits', 'hardware', 'uno', 'nano', 'mega'], content: 'Arduino embedded systems IoT microcontroller sensors programming circuits electronics hardware', external: false, category: 'projects' },
        
        // ═══ ELECTRONICS ═══
        { title: 'Electronics Projects', desc: 'Circuit Design, PCB & Components', icon: 'fas fa-bolt', url: '../Projects Code/Electronics/electronics-projects.html', tags: ['electronics', 'circuit', 'pcb', 'components', 'hardware', 'analog', 'digital', 'design', 'breadboard', 'schematic'], content: 'electronics circuits PCB components resistor capacitor transistor IC breadboard schematic', external: false, category: 'projects' },
        
        // ═══ MATLAB ═══
        { title: 'MATLAB Projects', desc: 'Simulation, Analysis & Algorithms', icon: 'fas fa-chart-line', url: '../Projects Code/MATLAB/matlab-projects.html', tags: ['matlab', 'simulation', 'analysis', 'numerical', 'computation', 'algorithms', 'modeling', 'data', 'visualization', 'plotting', 'scientific'], content: 'MATLAB simulation numerical analysis algorithms plotting data visualization computation scientific', external: false, category: 'projects' },
        
        // ═══ PROGRAMMING ═══
        { title: 'Programming', desc: 'DSA, Algorithms, Python & JavaScript', icon: 'fas fa-code', url: '../Projects Code/programming/programming-listing.html', tags: ['programming', 'code', 'coding', 'dsa', 'algorithms', 'python', 'javascript', 'leetcode', 'competitive', 'data structures', 'problem solving', 'software', 'development'], content: 'programming algorithms data structures python javascript DSA problem solving coding software development' },
        
        // ═══ CONTENT STUDIO ═══
        { title: 'Content Studio Hub', desc: 'Books, Videos, Research & Blog', icon: 'fas fa-layer-group', url: '../Content Studio/hub.html', tags: ['content', 'studio', 'hub', 'media', 'resources', 'library', 'collection', 'center'], content: 'content studio hub media resources library educational materials center' },
        
        // ═══ BOOKS & PDFs ═══
        { title: 'Books & PDFs', desc: 'Engineering Books & Study Materials', icon: 'fas fa-book', url: '../Content Studio/books-pdfs/book-listing-new.html', tags: ['books', 'pdf', 'ebook', 'textbook', 'study', 'materials', 'reading', 'literature', 'academic', 'reference', 'library'], content: 'engineering books PDF study materials textbooks reference academic reading library' },
        
        // ═══ EDUCATIONAL VIDEOS ═══
        { title: 'Educational Videos', desc: 'Video Courses, Tutorials & Lessons', icon: 'fas fa-video', url: '../Content Studio/educational-videos/course-listing-new.html', tags: ['videos', 'courses', 'tutorials', 'lessons', 'education', 'learning', 'teaching', 'training', 'lectures', 'youtube'], content: 'educational videos courses tutorials lessons teaching learning training lectures' },
        
        // ═══ RESEARCH PAPERS ═══
        { title: 'Research Papers', desc: 'Academic Papers & Research Work', icon: 'fas fa-scroll', url: '../Content Studio/research-papers/paper-listing.html', tags: ['research', 'papers', 'academic', 'publication', 'journal', 'thesis', 'study', 'article', 'scientific', 'scholarly'], content: 'research papers academic publications journal articles scientific study thesis scholarly' },
        
        // ═══ VIDEO BLOG ═══
        { title: 'Video Blog', desc: 'Vlogs, YouTube Content & Stories', icon: 'fas fa-play-circle', url: '../Content Studio/video-content/video-gallery.html', tags: ['vlog', 'blog', 'video', 'youtube', 'content', 'stories', 'personal', 'channel', 'gallery'], content: 'video blog vlog YouTube content stories personal channel gallery' },
        
        // ═══ WRITTEN POSTS ═══
        { title: 'Written Posts', desc: 'Articles, Blog Posts & Essays', icon: 'fas fa-pen-fancy', url: '../Content Studio/written-posts/post-listing.html', tags: ['posts', 'articles', 'blog', 'writing', 'essays', 'stories', 'text', 'content', 'written'], content: 'written posts articles blog essays writing stories text' },
        
        // ═══ CONTACT ═══
        { title: 'Contact', desc: 'Get in Touch with Akhinoor Islam', icon: 'fas fa-envelope', url: '../Contact/contact.html', tags: ['contact', 'email', 'message', 'communication', 'reach', 'connect', 'touch', 'form', 'feedback'], content: 'contact email message communication reach connect form feedback' },
        
        // ═══ WEBSITE GUIDE ═══
        { title: 'Website Guide', desc: 'Complete Guide to A3KM Studio Features', icon: 'fas fa-book-open', url: '../Website Guide/index.html', tags: ['guide', 'documentation', 'docs', 'help', 'manual', 'reference', 'instructions', 'tutorial', 'features'], content: 'website guide documentation help manual reference instructions tutorial features' },
        { title: 'Desktop Guide', desc: 'Desktop Version Features & Navigation', icon: 'fas fa-desktop', url: '../Website Guide/desktop-guide.html', tags: ['desktop', 'guide', 'features', 'navigation', 'layout', 'hover', 'effects', 'sidebar'], content: 'desktop guide features navigation layout hover effects sidebar filters' },
        { title: 'Mobile Guide', desc: 'Mobile PWA Features & Touch Gestures', icon: 'fas fa-mobile-alt', url: '../Website Guide/mobile-guide.html', tags: ['mobile', 'guide', 'pwa', 'app', 'touch', 'gestures', 'haptic', 'offline'], content: 'mobile guide PWA app touch gestures haptic feedback offline' },
        { title: 'Feature Directory', desc: 'All 86 Features Searchable Index', icon: 'fas fa-list', url: '../Website Guide/features.html', tags: ['features', 'directory', 'index', 'search', 'filter', 'all', 'list'], content: 'features directory index search filter categorized all' },
        
        // ═══ DOCUMENTATION FILES ═══
        { title: 'Quick Reference', desc: 'Quick Commands & Shortcuts Guide', icon: 'fas fa-terminal', url: '../Documentation/QUICK-REFERENCE.md', tags: ['quick', 'reference', 'commands', 'shortcuts', 'cheat', 'sheet', 'terminal'], content: 'quick reference commands shortcuts keyboard cheat sheet' },
        { title: 'Site Study', desc: 'Complete Website Architecture Study', icon: 'fas fa-sitemap', url: '../Documentation/SITE-STUDY.md', tags: ['site', 'study', 'architecture', 'structure', 'analysis', 'breakdown'], content: 'site study architecture structure analysis breakdown pages sections' },
        { title: 'Admin Access Guide', desc: 'Only Boss Portal Documentation', icon: 'fas fa-shield-alt', url: '../Documentation/ADMIN-ACCESS.md', tags: ['admin', 'access', 'boss', 'portal', 'authentication', 'security', 'login'], content: 'admin access boss portal authentication security login credentials' },
        { title: 'Admin Helper', desc: 'Admin Access Helper Tool', icon: 'fas fa-tools', url: '../Documentation/admin-access-helper.html', tags: ['admin', 'helper', 'tool', 'utility', 'access'], content: 'admin helper tool utility access management' },
        { title: 'Adding Content Guide', desc: 'How to Add New Content to Website', icon: 'fas fa-plus-circle', url: '../Documentation/ADDING-NEW-CONTENT.md', tags: ['adding', 'content', 'new', 'guide', 'tutorial', 'upload', 'create'], content: 'adding new content guide tutorial upload create manage' },
        { title: 'Arduino System Guide', desc: 'Arduino Projects System Documentation', icon: 'fas fa-microchip', url: '../Documentation/ARDUINO-PROJECTS-SYSTEM.md', tags: ['arduino', 'projects', 'system', 'documentation', 'structure'], content: 'arduino projects system documentation structure organization' },
        { title: 'Project System Guide', desc: 'Complete Project Management System', icon: 'fas fa-project-diagram', url: '../Documentation/PROJECT-SYSTEM-COMPLETE-GUIDE.md', tags: ['project', 'system', 'management', 'guide', 'complete', 'organization'], content: 'project system management guide complete organization structure' },
        { title: 'Programming Section Plan', desc: 'Programming Features Roadmap', icon: 'fas fa-code-branch', url: '../Documentation/PROGRAMMING-SECTION-PLAN.md', tags: ['programming', 'section', 'plan', 'roadmap', 'features', 'dsa'], content: 'programming section plan roadmap features DSA leetcode' },
        { title: 'Paid Access System', desc: 'Premium Content Access Documentation', icon: 'fas fa-lock', url: '../Documentation/PAID-ACCESS-SYSTEM-PLAN.md', tags: ['paid', 'access', 'premium', 'content', 'payment', 'subscription'], content: 'paid access premium content payment subscription system' },
        { title: 'Navbar Documentation', desc: 'Desktop Navbar V3 Documentation', icon: 'fas fa-bars', url: '../Documentation/DESKTOP-NAVBAR-V3-UPGRADE.md', tags: ['navbar', 'navigation', 'desktop', 'menu', 'header'], content: 'navbar navigation desktop menu header upgrade documentation' },
        { title: 'Mobile Navbar Guide', desc: 'Mobile Navigation Options & Features', icon: 'fas fa-bars', url: '../Documentation/MOBILE-NAVBAR-OPTIONS.md', tags: ['mobile', 'navbar', 'navigation', 'bottom', 'menu'], content: 'mobile navbar navigation bottom menu options features' },
        { title: 'Buy Page Routes', desc: 'E-commerce Routes Documentation', icon: 'fas fa-shopping-cart', url: '../Documentation/BUY-PAGE-ROUTES.md', tags: ['buy', 'routes', 'ecommerce', 'shop', 'purchase', 'payment'], content: 'buy routes ecommerce shop purchase payment pages' },
        { title: 'Listing Templates', desc: 'Content Listing & Manager Templates', icon: 'fas fa-list-ul', url: '../Documentation/LISTING-PAGES-AND-MANAGER-TEMPLATES.md', tags: ['listing', 'templates', 'manager', 'pages', 'layout'], content: 'listing templates manager pages layout structure' },
        { title: 'Manager API Status', desc: 'Content Manager API Connection Guide', icon: 'fas fa-plug', url: '../Documentation/MANAGER-API-CONNECTION-STATUS.md', tags: ['manager', 'api', 'connection', 'status', 'backend'], content: 'manager API connection status backend integration' },
        
        // ═══ WEBSITE FEATURES (for search) ═══
        { title: 'PWA Features', desc: 'Progressive Web App Installation & Offline', icon: 'fas fa-mobile-alt', url: '../Website Guide/mobile-guide/pwa-features.html', tags: ['pwa', 'progressive', 'web', 'app', 'offline', 'install', 'cache', 'service worker'], content: 'PWA progressive web app offline install cache service worker manifest' },
        { title: 'Video Player', desc: 'Custom Video Player with Controls', icon: 'fas fa-play', url: '../Website Guide/mobile-guide/feature-video-player.html', tags: ['video', 'player', 'playback', 'controls', 'streaming', 'media'], content: 'video player playback controls streaming media custom' },
        { title: 'PDF Reader', desc: 'Integrated PDF Viewer & Reader', icon: 'fas fa-file-pdf', url: '../Website Guide/mobile-guide/feature-pdf-reader.html', tags: ['pdf', 'reader', 'viewer', 'document', 'books'], content: 'PDF reader viewer document books integrated' },
        { title: 'Search System', desc: 'Intelligent Search with Fuzzy Matching', icon: 'fas fa-search', url: '../Home/index.html', tags: ['search', 'find', 'lookup', 'fuzzy', 'intelligent', 'smart', 'suggestions'], content: 'search find lookup fuzzy matching intelligent suggestions autocomplete' },
        { title: 'Command Palette', desc: 'Keyboard Shortcuts Command Center', icon: 'fas fa-keyboard', url: '../Home/index.html', tags: ['command', 'palette', 'keyboard', 'shortcuts', 'quick', 'access'], content: 'command palette keyboard shortcuts quick access ctrl+k' },
        { title: 'Background System', desc: 'Dynamic Animated Backgrounds', icon: 'fas fa-paint-brush', url: '../Optimization/Background/background-system.css', tags: ['background', 'animation', 'effects', 'design', 'visual'], content: 'background animation effects design visual particle grid' },
        { title: 'Cursor Effects', desc: 'Neural Grid Interactive Cursor', icon: 'fas fa-mouse-pointer', url: '../Optimization/cursor-effects.js', tags: ['cursor', 'effects', 'interactive', 'hover', 'visual'], content: 'cursor effects interactive hover visual neural grid' },
        { title: 'Navbar Autohide', desc: 'Smart Auto-hiding Navigation Bar', icon: 'fas fa-arrows-alt-v', url: '../Optimization/navbar-autohide.css', tags: ['navbar', 'autohide', 'hide', 'scroll', 'smart'], content: 'navbar autohide scroll smart navigation hide show' },
        { title: 'Splash Screen', desc: 'Mobile App Launch Screen', icon: 'fas fa-mobile', url: '../mobile/home/index.html', tags: ['splash', 'screen', 'launch', 'loading', 'mobile'], content: 'splash screen launch loading mobile app startup' },
        { title: 'Haptic Feedback', desc: 'Touch Vibration Feedback System', icon: 'fas fa-hand-point-up', url: '../Website Guide/mobile-guide.html', tags: ['haptic', 'feedback', 'vibration', 'touch', 'mobile', 'tactile'], content: 'haptic feedback vibration touch mobile tactile response' },
        { title: 'Bottom Navigation', desc: 'Mobile Bottom Navigation Bar', icon: 'fas fa-grip-horizontal', url: '../mobile/shared/bottom-nav.html', tags: ['bottom', 'navigation', 'mobile', 'navbar', 'menu'], content: 'bottom navigation mobile navbar menu bar fixed' },
        { title: '3D Model Viewer', desc: 'Interactive 3D SOLIDWORKS Viewer', icon: 'fas fa-cube', url: '../Website Guide/mobile-guide.html', tags: ['3d', 'model', 'viewer', 'solidworks', 'interactive', 'rotation'], content: '3D model viewer SOLIDWORKS interactive rotation zoom' },
        { title: 'Access Gate', desc: 'Content Access Control System', icon: 'fas fa-key', url: '../Optimization/access-gate.js', tags: ['access', 'gate', 'control', 'authentication', 'security', 'paywall'], content: 'access gate control authentication security paywall premium' },
        { title: 'Auth Module', desc: 'User Authentication System', icon: 'fas fa-user-lock', url: '../Optimization/auth-module.js', tags: ['auth', 'authentication', 'login', 'user', 'security'], content: 'auth authentication login user security credentials' },
        { title: 'Site Tracker', desc: 'Analytics & User Tracking', icon: 'fas fa-chart-bar', url: '../Optimization/site-tracker.js', tags: ['tracker', 'analytics', 'statistics', 'monitoring', 'data'], content: 'tracker analytics statistics monitoring data metrics' },
        { title: 'Service Worker', desc: 'PWA Offline Caching System', icon: 'fas fa-server', url: '../mobile/service-worker.js', tags: ['service', 'worker', 'cache', 'offline', 'pwa'], content: 'service worker cache offline PWA background sync' },
        { title: 'Manifest File', desc: 'PWA Manifest Configuration', icon: 'fas fa-file-code', url: '../mobile/manifest.json', tags: ['manifest', 'pwa', 'config', 'configuration', 'app'], content: 'manifest PWA config configuration app install' },
        
        // ═══ TECHNICAL TERMS ═══
        { title: 'Responsive Design', desc: 'Mobile-First Responsive Layouts', icon: 'fas fa-mobile-alt', url: '../Website Guide/features.html', tags: ['responsive', 'design', 'mobile', 'tablet', 'adaptive', 'layout'], content: 'responsive design mobile tablet adaptive layout breakpoints' },
        { title: 'Animations', desc: 'CSS & JavaScript Animations', icon: 'fas fa-magic', url: '../Website Guide/features.html', tags: ['animations', 'effects', 'transitions', 'css', 'javascript'], content: 'animations effects transitions CSS JavaScript motion' },
        { title: 'Accessibility', desc: 'WCAG Accessibility Features', icon: 'fas fa-universal-access', url: '../Website Guide/features.html', tags: ['accessibility', 'a11y', 'wcag', 'aria', 'screen reader'], content: 'accessibility a11y WCAG ARIA screen reader inclusive' },
        { title: 'Performance', desc: 'Speed Optimization & Caching', icon: 'fas fa-tachometer-alt', url: '../Website Guide/features.html', tags: ['performance', 'speed', 'optimization', 'fast', 'cache'], content: 'performance speed optimization fast cache loading' },
        { title: 'SEO', desc: 'Search Engine Optimization', icon: 'fas fa-search-plus', url: '../Website Guide/features.html', tags: ['seo', 'optimization', 'search', 'engine', 'google', 'meta'], content: 'SEO optimization search engine Google meta tags structured data' },
        { title: 'Security', desc: 'Website Security Features', icon: 'fas fa-lock', url: '../Website Guide/features.html', tags: ['security', 'protection', 'safety', 'https', 'encryption'], content: 'security protection safety HTTPS encryption authentication' },
    ];

    // ═══════════════════════════════════════════════════════════
    // VOCABULARY & SYNONYM DATABASE (500+ RELATIONSHIPS)
    // ═══════════════════════════════════════════════════════════
    const VOCABULARY = {
        // ═══ SOLIDWORKS & CAD ═══
        'cad': ['solidworks', '3d', 'modeling', 'design', 'engineering', 'drawing', 'mechanical'],
        'solidworks': ['cad', '3d', 'modeling', 'assembly', 'design', 'parts', 'drawings'],
        '3d': ['solidworks', 'cad', 'modeling', 'design', 'three dimensional', 'viewer'],
        'modeling': ['cad', 'solidworks', '3d', 'design', 'simulation', 'parts'],
        'simulation': ['matlab', 'modeling', 'analysis', 'computation', 'cae'],
        'assembly': ['assemblies', 'solidworks', 'parts', 'mates', 'constraints', 'mechanism'],
        'assemblies': ['assembly', 'solidworks', 'parts', 'components'],
        'parts': ['components', 'solidworks', '3d', 'modeling', 'assembly'],
        'components': ['parts', 'electronics', 'hardware', 'assembly'],
        'drawing': ['drawings', 'cad', 'solidworks', 'blueprint', 'schematic'],
        'drawings': ['drawing', 'cad', 'solidworks', 'blueprint'],
        'mechanical': ['engineering', 'solidworks', 'machine', 'mechanism'],
        'mechanism': ['mechanical', 'assembly', 'motion', 'machine'],
        'machine': ['mechanical', 'mechanism', 'engineering', 'assembly'],
        
        // ═══ ELECTRONICS & ARDUINO ═══
        'arduino': ['embedded', 'microcontroller', 'iot', 'electronics', 'programming', 'uno', 'nano'],
        'embedded': ['arduino', 'microcontroller', 'electronics', 'hardware', 'iot'],
        'microcontroller': ['arduino', 'embedded', 'mcu', 'programming', 'electronics'],
        'iot': ['arduino', 'internet of things', 'connected', 'smart', 'sensor', 'embedded'],
        'electronics': ['circuit', 'pcb', 'arduino', 'hardware', 'components', 'electrical'],
        'circuit': ['electronics', 'pcb', 'breadboard', 'schematic', 'design'],
        'circuits': ['circuit', 'electronics', 'pcb', 'breadboard'],
        'pcb': ['circuit', 'printed circuit board', 'electronics', 'hardware'],
        'breadboard': ['circuit', 'electronics', 'prototyping', 'hardware'],
        'schematic': ['circuit', 'diagram', 'electronics', 'blueprint'],
        'sensors': ['arduino', 'iot', 'microcontroller', 'electronics', 'detection'],
        'sensor': ['sensors', 'arduino', 'iot', 'detection'],
        'actuators': ['motors', 'servos', 'arduino', 'electronics', 'control'],
        'electrical': ['electronics', 'circuit', 'hardware', 'engineering'],
        
        // ═══ PROGRAMMING & SOFTWARE ═══
        'programming': ['code', 'coding', 'software', 'development', 'algorithms', 'scripting'],
        'code': ['programming', 'coding', 'software', 'script', 'development'],
        'coding': ['programming', 'code', 'software', 'development', 'scripting'],
        'software': ['programming', 'code', 'development', 'application', 'app'],
        'development': ['programming', 'coding', 'software', 'building', 'creating'],
        'dsa': ['data structures', 'algorithms', 'programming', 'leetcode', 'competitive'],
        'algorithms': ['dsa', 'data structures', 'programming', 'problem solving', 'logic'],
        'algorithm': ['algorithms', 'logic', 'solution', 'method'],
        'data structures': ['dsa', 'algorithms', 'programming', 'arrays', 'trees', 'graphs'],
        'python': ['programming', 'code', 'script', 'language', 'py', 'scripting'],
        'javascript': ['programming', 'code', 'web', 'js', 'language', 'scripting'],
        'js': ['javascript', 'programming', 'web', 'code'],
        'leetcode': ['dsa', 'algorithms', 'programming', 'competitive', 'problem solving'],
        'competitive': ['leetcode', 'programming', 'contests', 'algorithms'],
        'problem solving': ['algorithms', 'dsa', 'programming', 'logic'],
        'script': ['scripting', 'code', 'program', 'automation'],
        'scripting': ['script', 'programming', 'automation', 'code'],
        
        // ═══ MATLAB & ANALYSIS ═══
        'matlab': ['simulation', 'analysis', 'numerical', 'computation', 'programming', 'scientific'],
        'analysis': ['matlab', 'simulation', 'computation', 'data', 'study'],
        'numerical': ['matlab', 'computation', 'analysis', 'calculation', 'math'],
        'computation': ['matlab', 'numerical', 'calculation', 'processing'],
        'simulation': ['matlab', 'modeling', 'analysis', 'virtual'],
        'plotting': ['matlab', 'visualization', 'graph', 'chart', 'data'],
        'visualization': ['plotting', 'graph', 'chart', 'data', 'display'],
        'scientific': ['matlab', 'research', 'academic', 'analysis'],
        
        // ═══ CONTENT & MEDIA ═══
        'books': ['pdf', 'ebook', 'textbook', 'reading', 'literature', 'study'],
        'book': ['books', 'pdf', 'ebook', 'reading'],
        'pdf': ['books', 'document', 'file', 'ebook', 'reader'],
        'ebook': ['books', 'pdf', 'digital', 'reading'],
        'textbook': ['books', 'academic', 'study', 'reference'],
        'videos': ['courses', 'tutorials', 'lessons', 'education', 'youtube', 'media'],
        'video': ['videos', 'media', 'youtube', 'content'],
        'courses': ['videos', 'tutorials', 'education', 'learning', 'training'],
        'course': ['courses', 'learning', 'education', 'tutorial'],
        'tutorials': ['videos', 'courses', 'lessons', 'guide', 'learning'],
        'tutorial': ['tutorials', 'guide', 'lesson', 'learning'],
        'lessons': ['tutorials', 'courses', 'learning', 'education'],
        'lesson': ['lessons', 'tutorial', 'learning'],
        'research': ['papers', 'academic', 'study', 'publication', 'scientific'],
        'papers': ['research', 'academic', 'publication', 'article', 'journal'],
        'paper': ['papers', 'research', 'article', 'publication'],
        'academic': ['research', 'papers', 'scholarly', 'university', 'study'],
        'scholarly': ['academic', 'research', 'papers', 'scientific'],
        'publication': ['papers', 'research', 'article', 'journal'],
        'journal': ['papers', 'research', 'publication', 'article'],
        'article': ['papers', 'publication', 'post', 'writing'],
        'vlog': ['blog', 'video', 'youtube', 'content', 'personal'],
        'blog': ['vlog', 'posts', 'articles', 'writing', 'content'],
        'youtube': ['video', 'vlog', 'channel', 'content'],
        'channel': ['youtube', 'video', 'content'],
        
        // ═══ WEBSITE SECTIONS ═══
        'about': ['bio', 'biography', 'profile', 'information', 'personal', 'cv'],
        'bio': ['about', 'biography', 'profile', 'information', 'background'],
        'biography': ['bio', 'about', 'profile', 'background', 'life'],
        'profile': ['about', 'bio', 'information', 'personal'],
        'cv': ['resume', 'curriculum vitae', 'download', 'document'],
        'resume': ['cv', 'curriculum vitae', 'download', 'document'],
        'curriculum vitae': ['cv', 'resume', 'document'],
        'download': ['cv', 'resume', 'pdf', 'file', 'get'],
        'contact': ['email', 'message', 'communication', 'reach', 'form'],
        'email': ['contact', 'message', 'mail', 'communication'],
        'message': ['contact', 'email', 'communication', 'form'],
        'communication': ['contact', 'email', 'message', 'reach'],
        'form': ['contact', 'message', 'input', 'submit'],
        'projects': ['work', 'portfolio', 'showcase', 'engineering', 'collection'],
        'project': ['projects', 'work', 'portfolio'],
        'portfolio': ['projects', 'work', 'showcase', 'collection'],
        'showcase': ['portfolio', 'projects', 'collection', 'display'],
        
        // ═══ DOCUMENTATION & GUIDES ═══
        'documentation': ['docs', 'guide', 'help', 'manual', 'reference'],
        'docs': ['documentation', 'guide', 'help', 'manual', 'reference'],
        'guide': ['documentation', 'tutorial', 'help', 'manual', 'walkthrough'],
        'help': ['guide', 'documentation', 'support', 'assistance'],
        'manual': ['guide', 'documentation', 'instructions', 'handbook'],
        'reference': ['documentation', 'guide', 'lookup', 'index'],
        'instructions': ['guide', 'manual', 'tutorial', 'steps'],
        'tutorial': ['guide', 'instructions', 'lesson', 'walkthrough'],
        'walkthrough': ['guide', 'tutorial', 'instructions'],
        
        // ═══ ADMIN & SECURITY ═══
        'admin': ['dashboard', 'boss', 'management', 'control', 'administrator'],
        'administrator': ['admin', 'boss', 'management', 'control'],
        'dashboard': ['admin', 'panel', 'control', 'management', 'hub'],
        'boss': ['admin', 'administrator', 'owner', 'management'],
        'management': ['admin', 'control', 'dashboard', 'manager'],
        'manager': ['management', 'admin', 'control', 'cms'],
        'control': ['admin', 'management', 'dashboard', 'panel'],
        'panel': ['dashboard', 'control', 'admin', 'interface'],
        'portal': ['dashboard', 'gateway', 'entrance', 'hub'],
        'authentication': ['auth', 'login', 'security', 'credentials'],
        'auth': ['authentication', 'login', 'security', 'credentials'],
        'login': ['auth', 'authentication', 'signin', 'access'],
        'signin': ['login', 'auth', 'access'],
        'security': ['auth', 'protection', 'safety', 'encryption'],
        'protection': ['security', 'safety', 'defense'],
        'credentials': ['auth', 'password', 'username', 'login'],
        'password': ['credentials', 'auth', 'security'],
        'access': ['login', 'auth', 'entry', 'permission'],
        'permission': ['access', 'authorization', 'rights'],
        
        // ═══ MOBILE & PWA ═══
        'mobile': ['app', 'pwa', 'phone', 'touch', 'responsive'],
        'app': ['mobile', 'application', 'pwa', 'software'],
        'application': ['app', 'software', 'program'],
        'pwa': ['progressive web app', 'mobile', 'offline', 'install'],
        'progressive web app': ['pwa', 'mobile', 'offline', 'app'],
        'offline': ['pwa', 'cache', 'service worker', 'internet'],
        'install': ['pwa', 'setup', 'download', 'add'],
        'cache': ['offline', 'storage', 'pwa', 'service worker'],
        'service worker': ['pwa', 'offline', 'cache', 'background'],
        'manifest': ['pwa', 'config', 'configuration'],
        'touch': ['mobile', 'gestures', 'tap', 'swipe'],
        'gestures': ['touch', 'swipe', 'tap', 'mobile'],
        'swipe': ['gestures', 'touch', 'mobile'],
        'tap': ['touch', 'click', 'press', 'mobile'],
        'haptic': ['vibration', 'feedback', 'touch', 'tactile'],
        'vibration': ['haptic', 'feedback', 'buzz'],
        'feedback': ['haptic', 'vibration', 'response'],
        'tactile': ['haptic', 'touch', 'feedback'],
        
        // ═══ DESIGN & UI ═══
        'design': ['ui', 'interface', 'layout', 'visual', 'graphic'],
        'ui': ['user interface', 'design', 'interface', 'ux'],
        'interface': ['ui', 'user interface', 'design', 'layout'],
        'user interface': ['ui', 'interface', 'design'],
        'ux': ['user experience', 'ui', 'design', 'usability'],
        'user experience': ['ux', 'usability', 'design'],
        'layout': ['design', 'structure', 'arrangement', 'grid'],
        'responsive': ['mobile', 'adaptive', 'flexible', 'layout'],
        'adaptive': ['responsive', 'flexible', 'mobile'],
        'navigation': ['navbar', 'menu', 'nav', 'links'],
        'navbar': ['navigation', 'menu', 'header', 'nav'],
        'menu': ['navigation', 'navbar', 'options', 'links'],
        'header': ['navbar', 'top', 'navigation'],
        'footer': ['bottom', 'end', 'page'],
        'sidebar': ['side', 'panel', 'navigation'],
        'animations': ['effects', 'transitions', 'motion', 'animated'],
        'animation': ['animations', 'effects', 'motion'],
        'effects': ['animations', 'visual', 'transitions'],
        'transitions': ['animations', 'effects', 'motion'],
        'hover': ['mouseover', 'interaction', 'effect'],
        'background': ['bg', 'backdrop', 'wallpaper'],
        'cursor': ['pointer', 'mouse', 'hover'],
        
        // ═══ TECHNICAL FEATURES ═══
        'search': ['find', 'lookup', 'query', 'discover'],
        'find': ['search', 'lookup', 'discover', 'locate'],
        'lookup': ['search', 'find', 'query', 'reference'],
        'filter': ['sort', 'search', 'refine', 'select'],
        'sort': ['filter', 'organize', 'arrange'],
        'player': ['playback', 'media', 'video', 'audio'],
        'playback': ['player', 'play', 'media'],
        'viewer': ['reader', 'display', 'view', 'preview'],
        'reader': ['viewer', 'read', 'display'],
        'keyboard': ['shortcuts', 'keys', 'hotkeys'],
        'shortcuts': ['keyboard', 'hotkeys', 'keys', 'commands'],
        'hotkeys': ['shortcuts', 'keyboard', 'keys'],
        'commands': ['shortcuts', 'keyboard', 'instructions'],
        'palette': ['command', 'menu', 'quick'],
        'quick': ['fast', 'rapid', 'instant'],
        'smart': ['intelligent', 'clever', 'adaptive'],
        'intelligent': ['smart', 'clever', 'advanced'],
        'advanced': ['expert', 'professional', 'complex'],
        'interactive': ['dynamic', 'responsive', 'engaging'],
        'dynamic': ['interactive', 'changing', 'live'],
        
        // ═══ PERFORMANCE & OPTIMIZATION ═══
        'performance': ['speed', 'optimization', 'fast', 'efficient'],
        'speed': ['performance', 'fast', 'quick', 'rapid'],
        'fast': ['speed', 'quick', 'rapid', 'performance'],
        'optimization': ['performance', 'improve', 'enhance'],
        'optimize': ['optimization', 'improve', 'enhance'],
        'efficient': ['performance', 'optimized', 'effective'],
        'loading': ['load', 'startup', 'boot', 'launch'],
        'startup': ['loading', 'launch', 'boot', 'start'],
        'launch': ['startup', 'start', 'open'],
        
        // ═══ DATA & ANALYTICS ═══
        'data': ['information', 'statistics', 'analytics'],
        'statistics': ['stats', 'data', 'analytics', 'metrics'],
        'stats': ['statistics', 'data', 'metrics'],
        'analytics': ['statistics', 'data', 'tracking', 'metrics'],
        'tracking': ['analytics', 'monitoring', 'logging'],
        'monitoring': ['tracking', 'watching', 'logging'],
        'logging': ['logs', 'tracking', 'recording'],
        'logs': ['logging', 'history', 'records'],
        
        // ═══ COMMON MISSPELLINGS ═══
        'solidwork': ['solidworks'],
        'solid works': ['solidworks'],
        'solid work': ['solidworks'],
        'ardino': ['arduino'],
        'ardiuno': ['arduino'],
        'ardueno': ['arduino'],
        'electronic': ['electronics'],
        'electronik': ['electronics'],
        'programing': ['programming'],
        'programm': ['programming'],
        'algoritm': ['algorithm'],
        'algoritms': ['algorithms'],
        'algorythm': ['algorithm'],
        'video': ['videos'],
        'cours': ['course', 'courses'],
        'tutoriel': ['tutorial'],
        'tutorail': ['tutorial'],
        'documention': ['documentation'],
        'docmentation': ['documentation'],
        'mobilе': ['mobile'],
        'responsiv': ['responsive'],
        'authentification': ['authentication'],
        'authenication': ['authentication'],
        'dashbord': ['dashboard'],
        'administator': ['administrator'],
        'sercurity': ['security'],
        'securty': ['security'],
        'optimisation': ['optimization'],
        'optmization': ['optimization'],
    };

    // ═══════════════════════════════════════════════════════════
    // FUZZY MATCHING - LEVENSHTEIN DISTANCE
    // ═══════════════════════════════════════════════════════════
    function levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

        for (let i = 0; i <= len1; i++) matrix[0][i] = i;
        for (let j = 0; j <= len2; j++) matrix[j][0] = j;

        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,     // deletion
                    matrix[j - 1][i] + 1,     // insertion
                    matrix[j - 1][i - 1] + cost  // substitution
                );
            }
        }
        return matrix[len2][len1];
    }

    function fuzzyMatch(query, target, threshold = 3) {
        const distance = levenshteinDistance(query.toLowerCase(), target.toLowerCase());
        const maxLen = Math.max(query.length, target.length);
        const similarity = 1 - (distance / maxLen);
        return { matches: distance <= threshold, similarity, distance };
    }

    // ═══════════════════════════════════════════════════════════
    // EXPAND QUERY WITH SYNONYMS
    // ═══════════════════════════════════════════════════════════
    function expandQuery(query) {
        const words = query.toLowerCase().split(/\s+/);
        const expanded = new Set(words);
        
        words.forEach(word => {
            if (VOCABULARY[word]) {
                VOCABULARY[word].forEach(syn => expanded.add(syn));
            }
        });
        
        return Array.from(expanded);
    }

    // ═══════════════════════════════════════════════════════════
    // SMART SEARCH ALGORITHM
    // ═══════════════════════════════════════════════════════════
    function isConfidentialUrl(url) {
        return typeof url === 'string' && /(?:^|\.\.?\/)+Only-boss\//i.test(url);
    }

    function getPublicSearchIndex() {
        return SEARCH_INDEX.filter(item => !isConfidentialUrl(item.url));
    }

    function search(query) {
        const publicIndex = getPublicSearchIndex();

        if (!query || query.trim().length === 0) {
            return publicIndex.slice(0, 10);
        }

        const q = query.trim().toLowerCase();
        const expandedTerms = expandQuery(q);
        const results = [];

        publicIndex.forEach(item => {
            let score = 0;
            let matchType = '';
            let highlights = [];

            // 1. Exact match in title (highest priority)
            if (item.title.toLowerCase().includes(q)) {
                score += 100;
                matchType = 'exact-title';
                highlights.push({ field: 'title', text: q });
            }

            // 2. Exact match in tags
            item.tags.forEach(tag => {
                if (tag === q || tag.includes(q)) {
                    score += 80;
                    matchType = 'exact-tag';
                }
            });

            // 3. Exact match in description
            if (item.desc.toLowerCase().includes(q)) {
                score += 60;
                matchType = matchType || 'exact-desc';
            }

            // 4. Exact match in content
            if (item.content && item.content.toLowerCase().includes(q)) {
                score += 40;
                matchType = matchType || 'content-match';
            }

            // 5. Fuzzy matching on title
            const fuzzyTitle = fuzzyMatch(q, item.title);
            if (fuzzyTitle.matches && fuzzyTitle.distance <= 2) {
                score += 50 * fuzzyTitle.similarity;
                matchType = matchType || 'fuzzy-title';
            }

            // 6. Fuzzy matching on tags
            item.tags.forEach(tag => {
                const fuzzyTag = fuzzyMatch(q, tag);
                if (fuzzyTag.matches) {
                    score += 30 * fuzzyTag.similarity;
                    matchType = matchType || 'fuzzy-tag';
                }
            });

            // 7. Synonym/vocabulary matching
            expandedTerms.forEach(term => {
                if (term !== q) {
                    if (item.title.toLowerCase().includes(term)) {
                        score += 25;
                        matchType = matchType || 'synonym-title';
                    }
                    item.tags.forEach(tag => {
                        if (tag.includes(term)) {
                            score += 20;
                            matchType = matchType || 'synonym-tag';
                        }
                    });
                }
            });

            // 8. Partial word matching
            const queryWords = q.split(/\s+/);
            queryWords.forEach(word => {
                if (word.length >= 3) {
                    if (item.title.toLowerCase().includes(word)) score += 15;
                    if (item.desc.toLowerCase().includes(word)) score += 10;
                    item.tags.forEach(tag => {
                        if (tag.includes(word)) score += 12;
                    });
                }
            });

            if (score > 0) {
                results.push({
                    ...item,
                    score,
                    matchType,
                    highlights
                });
            }
        });

        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);

        // Return top 25 results (increased from 15)
        return results.slice(0, 25);
    }

    // ═══════════════════════════════════════════════════════════
    // HIGHLIGHT TEXT
    // ═══════════════════════════════════════════════════════════
    function highlightText(text, query) {
        if (!query) return text;
        const terms = expandQuery(query);
        let highlighted = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            highlighted = highlighted.replace(regex, '<span class="cmd-match">$1</span>');
        });
        
        return highlighted;
    }

    // ═══════════════════════════════════════════════════════════
    // GET SUGGESTIONS (Auto-complete)
    // ═══════════════════════════════════════════════════════════
    function getSuggestions(query) {
        if (!query || query.length < 2) return [];
        
        const q = query.toLowerCase();
        const suggestions = new Set();
        
        // Get from tags
        SEARCH_INDEX.forEach(item => {
            item.tags.forEach(tag => {
                if (tag.startsWith(q) || tag.includes(q)) {
                    suggestions.add(tag);
                }
            });
            
            // Check title words
            const words = item.title.toLowerCase().split(/\s+/);
            words.forEach(word => {
                if (word.startsWith(q) && word.length > q.length) {
                    suggestions.add(word);
                }
            });
        });
        
        // Add synonyms
        Object.keys(VOCABULARY).forEach(key => {
            if (key.startsWith(q) || key.includes(q)) {
                suggestions.add(key);
            }
        });
        
        return Array.from(suggestions).slice(0, 8);
    }

    // ═══════════════════════════════════════════════════════════
    // SEARCH HISTORY MANAGEMENT
    // ═══════════════════════════════════════════════════════════
    function saveSearchHistory(query) {
        if (!query || query.length < 2) return;
        
        try {
            let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            // Remove if exists
            history = history.filter(h => h !== query);
            // Add to front
            history.unshift(query);
            // Keep last 10
            history = history.slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(history));
        } catch (e) {
            console.warn('Could not save search history:', e);
        }
    }

    function getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('searchHistory') || '[]');
        } catch (e) {
            return [];
        }
    }

    function clearSearchHistory() {
        try {
            localStorage.removeItem('searchHistory');
        } catch (e) {
            console.warn('Could not clear search history:', e);
        }
    }

    // ═══════════════════════════════════════════════════════════
    // "DID YOU MEAN" SUGGESTIONS
    // ═══════════════════════════════════════════════════════════
    function getDidYouMean(query) {
        const allTerms = new Set();
        
        // Collect all searchable terms
        SEARCH_INDEX.forEach(item => {
            item.tags.forEach(tag => allTerms.add(tag));
            item.title.toLowerCase().split(/\s+/).forEach(word => {
                if (word.length > 3) allTerms.add(word);
            });
        });
        
        Object.keys(VOCABULARY).forEach(key => allTerms.add(key));
        
        // Find closest matches
        const suggestions = [];
        allTerms.forEach(term => {
            const fuzzy = fuzzyMatch(query.toLowerCase(), term);
            if (fuzzy.distance > 0 && fuzzy.distance <= 2 && fuzzy.similarity > 0.6) {
                suggestions.push({ term, similarity: fuzzy.similarity });
            }
        });
        
        suggestions.sort((a, b) => b.similarity - a.similarity);
        return suggestions.slice(0, 3).map(s => s.term);
    }

    // ═══════════════════════════════════════════════════════════
    // EXPORT PUBLIC API
    // ═══════════════════════════════════════════════════════════
    window.AdvancedSearchEngine = {
        search: search,
        highlightText: highlightText,
        getSuggestions: getSuggestions,
        expandQuery: expandQuery,
        fuzzyMatch: fuzzyMatch,
        saveSearchHistory: saveSearchHistory,
        getSearchHistory: getSearchHistory,
        clearSearchHistory: clearSearchHistory,
        getDidYouMean: getDidYouMean,
        getIndexStats: function() {
            return {
                totalEntries: SEARCH_INDEX.length,
                vocabularyTerms: Object.keys(VOCABULARY).length,
                categories: [...new Set(SEARCH_INDEX.map(i => i.category || 'uncategorized'))]
            };
        }
    };

})(window);
