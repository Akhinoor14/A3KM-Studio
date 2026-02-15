/**
 * A3KM Studio - Offline Content Manager
 * Automatically downloads all content for offline access when PWA is installed
 * Handles YouTube videos intelligently (metadata only, not video files)
 * Auto-detects content updates and prompts for re-download
 */

class OfflineContentManager {
    constructor() {
        // Version tracking for auto-updates
        this.CONTENT_VERSION = 'v3.1.0-2026-02-15-enhanced';
        this.VERSION_STORAGE_KEY = 'a3km_offline_content_version';
        this.VERSION_URL = '/version.json';
        
        this.isDownloading = false;
        this.downloadProgress = 0;
        this.totalFiles = 0;
        this.downloadedFiles = 0;
        this.failedFiles = [];
        
        // Content categories to download
        this.contentManifest = {
            // Core App Files
            core: [
                '/Home/index.html',
                '/mobile/home/index.html',
                '/mobile/home/home.css',
                '/mobile/home/home.js',
                '/mobile/about/about.html',
                '/mobile/about/about.css',
                '/mobile/about/about.js',
                '/mobile/projects/projects.html',
                '/mobile/projects/projects.css',
                '/mobile/projects/projects.js',
                '/mobile/contact/contact.html',
                '/mobile/contact/contact.css',
                '/mobile/contact/contact.js',
                '/mobile/content-studio/hub.html',
                '/mobile/content-studio/hub.css',
                '/mobile/content-studio/hub.js',
                '/About me/about.html',
                '/About me/about-desktop.css',
                '/Contact/contact.html',
                '/Projects Code/projects.html',
                '/Documentation/index.html'
            ],
            
            // Shared Resources
            shared: [
                '/mobile/shared/mobile-navbar.css',
                '/mobile/shared/mobile-navbar.js',
                '/mobile/shared/mobile-common.css',
                '/mobile/shared/markdown-viewer.js',
                '/Optimization/styles.css',
                '/Optimization/navbar/desktop-navbar.css',
                '/Optimization/Background/background-system.css',
                '/Optimization/Background/background-system.js',
                '/Optimization/global-scrollbar.css'
            ],
            
            // Images and Icons
            assets: [
                '/images/logo.svg',
                '/images/favicon.svg',
                '/images/PP.jpg',
                '/images/icon-180.png'
            ],
            
            // Configuration Files
            config: [
                '/Optimization/manifest.json',
                '/mobile/manifest.json',
                '/Content Studio/video-content/videos.json',
                '/Projects Code/projects.json',
                '/About me/certificates-data.json'
            ],
            
            // Arduino Projects - ALL FILES EXPLICITLY (23 projects, ~230 files)
            arduino: [
                // Project 01: LED Pattern
                '/Projects Storage/Arduino UNO Projects with Tinkercad/01 LED Pattern/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/01 LED Pattern/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/01 LED Pattern/Led-pattern.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/01 LED Pattern/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/01 LED Pattern/LICENSE',
                
                // Project 02: LED Flowing Blinking
                '/Projects Storage/Arduino UNO Projects with Tinkercad/02 LED Flowing Blinking/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/02 LED Flowing Blinking/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/02 LED Flowing Blinking/Led_flowing_blinking.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/02 LED Flowing Blinking/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/02 LED Flowing Blinking/LICENSE',
                
                // Project 03: Breathing a LED
                '/Projects Storage/Arduino UNO Projects with Tinkercad/03 Breathing a LED/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/03 Breathing a LED/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/03 Breathing a LED/Breathing_a_LED.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/03 Breathing a LED/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/03 Breathing a LED/LICENSE',
                
                // Project 04: Controlling LED brightness with AT-TINY85
                '/Projects Storage/Arduino UNO Projects with Tinkercad/04 Controlling LED brightness with AT-TINY85/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/04 Controlling LED brightness with AT-TINY85/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/04 Controlling LED brightness with AT-TINY85/AT-TINY85_Led_brightness_contoll.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/04 Controlling LED brightness with AT-TINY85/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/04 Controlling LED brightness with AT-TINY85/LICENSE',
                
                // Project 05: RGB LED Control with PWM
                '/Projects Storage/Arduino UNO Projects with Tinkercad/05 RGB LED Control with PWM/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/05 RGB LED Control with PWM/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/05 RGB LED Control with PWM/RGB_LED_with_PWM.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/05 RGB LED Control with PWM/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/05 RGB LED Control with PWM/LICENSE',
                
                // Project 06: Interfacing servo motor
                '/Projects Storage/Arduino UNO Projects with Tinkercad/06. Interfacing servo motor with arduino/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/06. Interfacing servo motor with arduino/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/06. Interfacing servo motor with arduino/Interfacing_servo_motor.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/06. Interfacing servo motor with arduino/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/06. Interfacing servo motor with arduino/LICENSE',
                
                // Project 07: Ultrasonic sensor
                '/Projects Storage/Arduino UNO Projects with Tinkercad/07 Interfacing an ultrasonic sensor with arduino/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/07 Interfacing an ultrasonic sensor with arduino/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/07 Interfacing an ultrasonic sensor with arduino/Interfacing_an_ultrasonic_sensor.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/07 Interfacing an ultrasonic sensor with arduino/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/07 Interfacing an ultrasonic sensor with arduino/LICENSE',
                
                // Project 08: Neopixel strip
                '/Projects Storage/Arduino UNO Projects with Tinkercad/08 Interfacing Neopixel strip 4/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/08 Interfacing Neopixel strip 4/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/08 Interfacing Neopixel strip 4/Interfacing_Neopixel_strip_4.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/08 Interfacing Neopixel strip 4/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/08 Interfacing Neopixel strip 4/LICENSE',
                
                // Project 09: Neopixel jewel
                '/Projects Storage/Arduino UNO Projects with Tinkercad/09 Interfacing Neopixel jewel/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/09 Interfacing Neopixel jewel/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/09 Interfacing Neopixel jewel/Interfacing_Neopixel_jewel.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/09 Interfacing Neopixel jewel/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/09 Interfacing Neopixel jewel/LICENSE',
                
                // Project 10: Photodiode
                '/Projects Storage/Arduino UNO Projects with Tinkercad/10 Interfacing Photodiode/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/10 Interfacing Photodiode/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/10 Interfacing Photodiode/Interfacing_Photodiode.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/10 Interfacing Photodiode/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/10 Interfacing Photodiode/LICENSE',
                
                // Project 11: Temperature sensor
                '/Projects Storage/Arduino UNO Projects with Tinkercad/11 Temperature sensor/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/11 Temperature sensor/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/11 Temperature sensor/Temperature_sensor.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/11 Temperature sensor/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/11 Temperature sensor/LICENSE',
                
                // Project 12: PIR sensor
                '/Projects Storage/Arduino UNO Projects with Tinkercad/12 Interfacing PIR sensor/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/12 Interfacing PIR sensor/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/12 Interfacing PIR sensor/Interfacing_PIR_sensor.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/12 Interfacing PIR sensor/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/12 Interfacing PIR sensor/LICENSE',
                
                // Project 13: Matrix Keypad
                '/Projects Storage/Arduino UNO Projects with Tinkercad/13 Interfacing a 4×4 Matrix Keypad/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/13 Interfacing a 4×4 Matrix Keypad/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/13 Interfacing a 4×4 Matrix Keypad/Interfacing_a_4x4_Matrix_Keypad.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/13 Interfacing a 4×4 Matrix Keypad/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/13 Interfacing a 4×4 Matrix Keypad/LICENSE',
                
                // Project 14: Attiny tmp36 rgb
                '/Projects Storage/Arduino UNO Projects with Tinkercad/14 Attiny tmp36 rgb/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/14 Attiny tmp36 rgb/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/14 Attiny tmp36 rgb/Attiny_tmp36_rgb.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/14 Attiny tmp36 rgb/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/14 Attiny tmp36 rgb/LICENSE',
                
                // Project 15: LCD display
                '/Projects Storage/Arduino UNO Projects with Tinkercad/15 Interfacing 16-2 Lcd display/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/15 Interfacing 16-2 Lcd display/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/15 Interfacing 16-2 Lcd display/Interfacing_16-2_Lcd_display.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/15 Interfacing 16-2 Lcd display/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/15 Interfacing 16-2 Lcd display/LICENSE',
                
                // Project 16: Dice with 7 segment
                '/Projects Storage/Arduino UNO Projects with Tinkercad/16 Dice with 7 segment display/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/16 Dice with 7 segment display/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/16 Dice with 7 segment display/Dice_with_7_segment_display.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/16 Dice with 7 segment display/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/16 Dice with 7 segment display/LICENSE',
                
                // Project 17: Solar system Tracker
                '/Projects Storage/Arduino UNO Projects with Tinkercad/17 Solar system Tracker/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/17 Solar system Tracker/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/17 Solar system Tracker/Solar_system_Tracker.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/17 Solar system Tracker/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/17 Solar system Tracker/LICENSE',
                
                // Project 18: Piano with Uno
                '/Projects Storage/Arduino UNO Projects with Tinkercad/18 Piano with Uno/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/18 Piano with Uno/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/18 Piano with Uno/Piano_with_Uno.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/18 Piano with Uno/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/18 Piano with Uno/LICENSE',
                
                // Project 19: tmp36 with LCD
                '/Projects Storage/Arduino UNO Projects with Tinkercad/19 tmp36 with 16-2 LCD display temperature/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/19 tmp36 with 16-2 LCD display temperature/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/19 tmp36 with 16-2 LCD display temperature/tmp36_with_16-2_LCD_display_temperature.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/19 tmp36 with 16-2 LCD display temperature/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/19 tmp36 with 16-2 LCD display temperature/LICENSE',
                
                // Project 20: Light intensity with LDR
                '/Projects Storage/Arduino UNO Projects with Tinkercad/20 Light intensity Measurement using LDR sensor/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/20 Light intensity Measurement using LDR sensor/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/20 Light intensity Measurement using LDR sensor/Light_intensity_Measurement_using_LDR_sensor.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/20 Light intensity Measurement using LDR sensor/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/20 Light intensity Measurement using LDR sensor/LICENSE',
                
                // Project 21: Smart Parking
                '/Projects Storage/Arduino UNO Projects with Tinkercad/21 Smart Parking/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/21 Smart Parking/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/21 Smart Parking/Smart_Parking.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/21 Smart Parking/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/21 Smart Parking/LICENSE',
                
                // Project 22: Digital Potentiometer
                '/Projects Storage/Arduino UNO Projects with Tinkercad/22 Digital Potentiometer/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/22 Digital Potentiometer/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/22 Digital Potentiometer/Digital_Potentiometer.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/22 Digital Potentiometer/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/22 Digital Potentiometer/LICENSE',
                
                // Project 23: Digital Voltmeter
                '/Projects Storage/Arduino UNO Projects with Tinkercad/23 Digital Voltmeter with ATtiny85 & 3-Digit 7-Segment Display/README.md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/23 Digital Voltmeter with ATtiny85 & 3-Digit 7-Segment Display/Code Explaination (for beginner).md',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/23 Digital Voltmeter with ATtiny85 & 3-Digit 7-Segment Display/Digital_Voltmeter.ino',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/23 Digital Voltmeter with ATtiny85 & 3-Digit 7-Segment Display/circuit.png',
                '/Projects Storage/Arduino UNO Projects with Tinkercad/23 Digital Voltmeter with ATtiny85 & 3-Digit 7-Segment Display/LICENSE',
                
                // Arduino Main README
                '/Projects Storage/Arduino UNO Projects with Tinkercad/README.md'
            ],
            
            // Documentation (critical files only - rest via runtime caching)
            documentation: [
                '/Documentation/index.html',
                '/Documentation/viewer.html',
                '/Documentation/viewer-enhanced.html',
                '/Documentation/README.md',
                '/Documentation/DOCUMENTATION-INDEX.md',
                '/Documentation/HOW-TO-ADD-NEW-DOCS.md',
                '/Documentation/OFFLINE-SYSTEM-GUIDE.md',
                '/Documentation/PWA-TESTING-GUIDE.md',
                '/Documentation/PWA-DEVELOPER-GUIDE.md'
            ],
            
            // MATLAB Projects (listing page - files via runtime caching)
            matlab: [
                '/Projects Code/MATLAB/matlab-projects.html',
                '/mobile/projects/matlab-projects.html'
            ],
            
            // SolidWorks Projects (listing pages - models via runtime caching due to size)
            solidworks: [
                '/Projects Code/solidworks/solidworks-pro.html',
                '/Projects Code/solidworks/solidworks-paid.html',
                '/mobile/projects/solidworks-projects.html'
            ],
            
            // Electronic Components Guide (listing)
            electronics: [
                '/Projects Storage/Electronic Components Guide/README.md'
            ],
            
            // Content Studio - Books & PDFs
            books: [
                '/Content Studio/books-pdfs/book-listing-new.html',
                '/Content Studio/books-pdfs/book-reader-new.html',
                '/Content Studio/books-pdfs/books.json',
                '/Content Studio/books-pdfs/print-export.js'
            ],
            
            // Content Studio - Written Posts
            posts: [
                '/Content Studio/written-posts/post-listing-new.html',
                '/Content Studio/written-posts/post-reader.html',
                '/Content Studio/written-posts/post-viewer.css',
                '/Content Studio/written-posts/post-viewer.js',
                '/Content Studio/written-posts/posts.json'
            ],
            
            // Content Studio - Research Papers
            research: [
                '/Content Studio/research-papers'
            ],
            
            // Certificates (Medical & Skill certificates)
            certificates: [
                '/About me/CERTIFICATES',
                '/About me/certificates-data.json',
                '/About me/certificates-viewer.html'
            ]
        };
        
        // External content that should NOT be cached (YouTube videos, etc.)
        this.externalContentPatterns = [
            /youtube\.com/,
            /youtu\.be/,
            /ytimg\.com/,
            /googleapis\.com/,
            /gstatic\.com/,
            /unpkg\.com/,
            /cdnjs\.cloudflare\.com/,
            /fonts\.googleapis\.com/,
            /fonts\.gstatic\.com/
        ];
    }
    
    /**
     * Initialize offline content manager
     */
    async init() {
        // Fetch latest version info
        await this.fetchLatestVersion();
        
        // Listen for PWA installation - auto-download immediately
        window.addEventListener('appinstalled', () => {
            // Start silent download
            this.startOfflineContentDownload(true); // true = silent/automatic
        });
        
        // Check for content updates (version change)
        const storedVersion = localStorage.getItem(this.VERSION_STORAGE_KEY);
        const hasDownloaded = this.hasDownloadedContent();
        
        if (hasDownloaded && storedVersion && storedVersion !== this.CONTENT_VERSION) {
            // Auto-update in background without prompting
            this.startOfflineContentDownload(true);
        }
        // Check if app was recently installed and hasn't downloaded content yet
        else if (this.isInstalledApp() && !hasDownloaded) {
            // Auto-download without prompting
            setTimeout(() => {
                this.startOfflineContentDownload(true);
            }, 2000); // Small delay to let page load first
        }
        
        // Listen for service worker messages
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'CACHE_PROGRESS') {
                    this.updateProgress(event.data.current, event.data.total, event.data.failed);
                }
                
                if (event.data.type === 'CACHE_COMPLETE') {
                    // Silent completion
                    this.showCompletionPopup(event.data.cached, event.data.failed);
                }
            });
        }
    }
    
    /**
     * Fetch latest version from server
     */
    async fetchLatestVersion() {
        if (!navigator.onLine) {
            // Skip version check
            return;
        }
        
        try {
            const response = await fetch(this.VERSION_URL + '?t=' + Date.now(), {
                cache: 'no-store'
            });
            
            if (response.ok) {
                const versionData = await response.json();
                this.CONTENT_VERSION = versionData.version;
                // Version fetched silently
            }
        } catch (error) {
            // Failed silently
        }
    }
    
    /**
     * Check if running as installed PWA
     */
    isInstalledApp() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true ||
               localStorage.getItem('a3km_pwa_installed') === 'true';
    }
    
    /**
     * Check if content has been downloaded
     */
    hasDownloadedContent() {
        return localStorage.getItem('a3km_offline_content_downloaded') === 'true';
    }
    
    /**
     * Prompt user to download offline content
     */
    promptOfflineDownload() {
        this.showPrompt({
            title: '📦 Download Offline Content?',
            message: 'Download all projects, documentation, and resources for offline access.<br><strong>Note:</strong> YouTube videos will play online only.',
            confirmText: 'Download Now',
            cancelText: 'Later',
            onConfirm: () => this.startOfflineContentDownload()
        });
    }
    
    /**
     * Prompt user to update offline content (new version available)
     */
    promptContentUpdate() {
        this.showPrompt({
            title: '🔄 Content Update Available',
            message: 'New content and improvements are available.<br>Update your offline content to get the latest version.',
            confirmText: 'Update Now',
            cancelText: 'Later',
            onConfirm: () => this.startOfflineContentDownload()
        });
    }
    
    /**
     * Show download/update prompt
     */
    showPrompt(options) {
        const notification = document.createElement('div');
        notification.id = 'offline-download-prompt';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(139, 0, 0, 0.6);
            font-family: 'Inter', sans-serif;
            text-align: center;
            max-width: 90%;
            width: 500px;
            animation: slideUp 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">
                ${options.title}
            </div>
            <div style="font-size: 14px; margin-bottom: 16px; opacity: 0.9;">
                ${options.message}
            </div>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="download-now-btn" style="
                    background: white;
                    color: #8B0000;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    ${options.confirmText}
                </button>
                <button id="download-later-btn" style="
                    background: transparent;
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 14px;
                ">
                    ${options.cancelText}
                </button>
            </div>
        `;
        
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(notification);
                this.attachPromptHandlers(notification, options);
            });
        } else {
            document.body.appendChild(notification);
            this.attachPromptHandlers(notification, options);
        }
    }
    
    /**
     * Attach event handlers to prompt buttons
     */
    attachPromptHandlers(notification, options) {
        const downloadBtn = document.getElementById('download-now-btn');
        const laterBtn = document.getElementById('download-later-btn');
        
        if (downloadBtn && options.onConfirm) {
            downloadBtn.addEventListener('click', () => {
                notification.remove();
                options.onConfirm();
            });
        }
        
        if (laterBtn) {
            laterBtn.addEventListener('click', () => {
                notification.style.animation = 'slideDown 0.5s ease-out';
                setTimeout(() => notification.remove(), 500);
                if (options.onCancel) options.onCancel();
            });
        }
    }
    
    /**
     * Show progress animation during download
     * @param {number} percent - Progress percentage (0-100)
     * @param {number} cached - Files cached so far
     * @param {number} total - Total files
     */
    showProgressAnimation(percent, cached, total) {
        const existingProgress = document.getElementById('offline-progress-overlay');
        
        if (!existingProgress) {
            // Create progress overlay (first time)
            const progressHTML = `
                <div id="offline-progress-overlay" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 999999; animation: fadeIn 0.3s ease;">
                    <div id="offline-progress-card" style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); border: 2px solid rgba(139, 0, 0, 0.6); border-radius: 24px; padding: 48px 40px; max-width: 480px; width: calc(100% - 32px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05); text-align: center; animation: popupSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);">
                        
                        <!-- Animated Download Icon -->
                        <div style="width: 100px; height: 100px; margin: 0 auto 24px; position: relative;">
                            <svg width="100" height="100" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139, 0, 0, 0.2)" stroke-width="6"/>
                                <circle id="progress-circle" cx="50" cy="50" r="45" fill="none" stroke="#8B0000" stroke-width="6" stroke-linecap="round" stroke-dasharray="283" stroke-dashoffset="283" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.3s ease;"/>
                                <path d="M50 30 L50 55 M35 45 L50 60 L65 45" stroke="#8B0000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" style="animation: downloadArrow 1.5s ease-in-out infinite;"/>
                            </svg>
                        </div>
                        
                        <!-- Title -->
                        <h2 style="font-size: 24px; font-weight: 700; color: #ffffff; margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            Md Akhinoor Islam's Portfolio
                        </h2>
                        
                        <!-- Subtitle -->
                        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin: 0 0 32px 0; line-height: 1.5;">
                            Presented by A3KM Studio | Part of Noor Academy
                        </p>
                        
                        <!-- Progress Bar -->
                        <div style="background: rgba(139, 0, 0, 0.2); border-radius: 12px; height: 12px; overflow: hidden; margin-bottom: 16px; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);">
                            <div id="progress-bar-fill" style="background: linear-gradient(90deg, #8B0000 0%, #FF4444 100%); height: 100%; width: 0%; transition: width 0.3s ease; border-radius: 12px; box-shadow: 0 0 10px rgba(139, 0, 0, 0.5);"></div>
                        </div>
                        

                        <!-- Progress Stats -->
                        <div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
                            <span id="progress-percent" style="font-size: 18px; font-weight: 600; color: #8B0000;">0%</span>
                            <span style="font-size: 15px; color: rgba(255,255,255,0.7); font-weight: 500;">Installing...</span>
                            <span id="progress-files" style="display: none; font-size: 14px; color: rgba(255, 255, 255, 0.5);">0 / ${total} files</span>
                        </div>
                        
                    </div>
                </div>
            `;
            
            // Add styles
            const progressStyles = `
                <style>
                    @keyframes downloadArrow {
                        0%, 100% { transform: translateY(0); opacity: 1; }
                        50% { transform: translateY(8px); opacity: 0.6; }
                    }
                    
                    @media (max-width: 768px) {
                        #offline-progress-card {
                            padding: 40px 32px !important;
                            max-width: calc(100% - 32px) !important;
                        }
                        #offline-progress-card h2 {
                            font-size: 24px !important;
                        }
                    }
                    
                    @media (max-width: 480px) {
                        #offline-progress-card {
                            padding: 32px 24px !important;
                            max-width: calc(100% - 24px) !important;
                        }
                        #offline-progress-card h2 {
                            font-size: 22px !important;
                        }
                        #offline-progress-card p {
                            font-size: 14px !important;
                        }
                    }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', progressStyles);
            document.body.insertAdjacentHTML('beforeend', progressHTML);
        }
        
        // Update progress
        const progressCircle = document.getElementById('progress-circle');
        const progressBarFill = document.getElementById('progress-bar-fill');
        const progressPercent = document.getElementById('progress-percent');
        const progressFiles = document.getElementById('progress-files');
        
        if (progressCircle) {
            const circumference = 283;
            const offset = circumference - (percent / 100 * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
        
        if (progressBarFill) {
            progressBarFill.style.width = `${percent}%`;
        }
        
        if (progressPercent) {
            progressPercent.textContent = `${Math.round(percent)}%`;
        }
        
        if (progressFiles) {
            progressFiles.textContent = `${cached} / ${total} files`;
        }
    }
    
    /**
     * Hide progress animation
     */
    hideProgressAnimation() {
        const progressOverlay = document.getElementById('offline-progress-overlay');
        if (progressOverlay) {
            progressOverlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => progressOverlay.remove(), 300);
        }
    }
    
    /**
     * Start downloading all offline content
     * @param {boolean} silent - If true, downloads without showing progress UI (still shows animation)
     */
    async startOfflineContentDownload(silent = false) {
        if (this.isDownloading) {
            // Already in progress - skip silently
            return;
        }
        
        this.isDownloading = true;
        
        try {
            // Get all files to cache
            const filesToCache = this.getAllCacheableFiles();
            this.totalFiles = filesToCache.length;
            
            // Silent download - no console output
            
            // Show progress animation with initial state (both silent and non-silent)
            this.showProgressAnimation(0, 0, this.totalFiles);
            
            // Send list to service worker for caching
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'CACHE_OFFLINE_CONTENT',
                    files: filesToCache
                });
            } else {
                // Fallback: Cache directly using Cache API
                await this.cacheFilesDirectly(filesToCache);
            }
            
            // Mark as downloaded with version
            localStorage.setItem('a3km_offline_content_downloaded', 'true');
            localStorage.setItem('a3km_offline_download_date', new Date().toISOString());
            localStorage.setItem(this.VERSION_STORAGE_KEY, this.CONTENT_VERSION);
            
            // Installation complete - silent
            
        } catch (error) {
            // Failed silently
            this.hideProgressAnimation();
            this.showDownloadError(error);
        } finally {
            this.isDownloading = false;
        }
    }
    
    /**
     * Get all cacheable files
     */
    getAllCacheableFiles() {
        const files = [];
        
        // Add all files from manifest
        Object.values(this.contentManifest).forEach(category => {
            if (Array.isArray(category)) {
                files.push(...category);
            }
        });
        
        return files;
    }
    
    /**
     * Cache files directly using Cache API
     */
    async cacheFilesDirectly(files) {
        const CACHE_NAME = 'a3km-offline-v1.0.0';
        const cache = await caches.open(CACHE_NAME);
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            try {
                // Skip external URLs
                if (this.isExternalContent(file)) {
                    // Skip silently
                    continue;
                }
                
                // Fetch and cache
                const response = await fetch(file);
                
                if (response.ok) {
                    await cache.put(file, response);
                    this.downloadedFiles++;
                    // Cached silently
                } else {
                    // Failed silently
                    this.failedFiles.push(file);
                }
                
            } catch (error) {
                // Error silently
                this.failedFiles.push(file);
            }
            
            // Update progress
            this.updateProgress(this.downloadedFiles, this.totalFiles);
            
            // Removed delay for faster download
        }
    }
    
    /**
     * Check if URL is external content that shouldn't be cached
     */
    isExternalContent(url) {
        return this.externalContentPatterns.some(pattern => pattern.test(url));
    }
    
    /**
     * Show download progress UI
     */
    showDownloadProgress() {
        const progressUI = document.createElement('div');
        progressUI.id = 'offline-download-progress';
        progressUI.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            color: white;
            padding: 20px 24px;
            border-radius: 16px;
            border: 2px solid rgba(139, 0, 0, 0.4);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
            font-family: 'Inter', sans-serif;
            min-width: 300px;
            animation: slideInRight 0.5s ease-out;
        `;
        
        progressUI.innerHTML = `
            <div style="font-size: 16px; font-weight: 700; margin-bottom: 12px;">
                📦 Downloading Offline Content
            </div>
            <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
                <div id="download-progress-bar" style="
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #8B0000 0%, #CC0000 100%);
                    transition: width 0.3s ease;
                "></div>
            </div>
            <div id="download-progress-text" style="font-size: 13px; opacity: 0.8;">
                Preparing download...
            </div>
        `;
        
        document.body.appendChild(progressUI);
    }
    
    /**
     * Update progress UI
     */
    updateProgress(current, total, failed = 0) {
        // Use new progress animation
        const percentage = (current / total) * 100;
        this.showProgressAnimation(percentage, current, total);
        
        // Legacy progress bar (if exists)
        const progressBar = document.getElementById('download-progress-bar');
        const progressText = document.getElementById('download-progress-text');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `Downloaded ${current} of ${total} files (${Math.round(percentage)}%)${failed > 0 ? ` - ${failed} failed` : ''}`;
        }
    }
    
    /**
     * Show beautiful completion popup (theme-matching design)
     */
    showCompletionPopup(cached = null, failed = 0) {
        // Hide progress animation
        this.hideProgressAnimation();
        
        // Remove legacy progress UI if visible
        const progressUI = document.getElementById('offline-download-progress');
        if (progressUI) {
            progressUI.remove();
        }
        
        const totalCached = cached || this.downloadedFiles;
        const totalFailed = failed || this.failedFiles.length;
        
        // Create beautiful centered popup
        const popup = document.createElement('div');
        popup.id = 'offline-completion-popup';
        popup.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            animation: fadeIn 0.4s ease-out;
            padding: 20px;
        `;
        
        const popupCard = document.createElement('div');
        popupCard.style.cssText = `
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border: 2px solid rgba(139, 0, 0, 0.6);
            border-radius: 24px;
            padding: 48px 40px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(139, 0, 0, 0.4), 0 0 100px rgba(139, 0, 0, 0.2);
            animation: popupSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
        `;
        
        // Add animated background pattern
        const bgPattern = document.createElement('div');
        bgPattern.style.cssText = `
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.1) 0%, transparent 70%);
            animation: pulse 3s ease-in-out infinite;
        `;
        popupCard.appendChild(bgPattern);
        
        // Content container
        const content = document.createElement('div');
        content.style.cssText = 'position: relative; z-index: 1;';
        
        content.innerHTML = `
            <!-- Success Icon -->
            <div style="
                width: 100px;
                height: 100px;
                margin: 0 auto 24px;
                background: linear-gradient(135deg, #8B0000 0%, #580000 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 8px 32px rgba(139, 0, 0, 0.5);
                animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
            ">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5" style="
                        stroke-dasharray: 30;
                        stroke-dashoffset: 30;
                        animation: checkDraw 0.5s ease-out 0.5s forwards;
                    "/>
                </svg>
            </div>
            
            <!-- Title -->
            <h2 style="
                font-size: 28px;
                font-weight: 900;
                color: #ffffff;
                margin: 0 0 12px 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                letter-spacing: -0.5px;
            ">
                ${totalFailed === 0 ? 'Install Complete!' : 'Download Complete'}
            </h2>
            
            <!-- Subtitle -->
            <p style="
                font-size: 16px;
                color: rgba(255, 255, 255, 0.75);
                margin: 0 0 28px 0;
                line-height: 1.6;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            ">
                ${totalFailed === 0 
                    ? '<strong style="color: #8B0000;">Portfolio is ready!</strong><br>All content is now accessible offline.<br><span style="font-size: 13px; color: rgba(255,255,255,0.5);">by A3KM Studio | Part of Noor Academy</span>' 
                    : `${totalCached} files cached successfully.${totalFailed > 0 ? `<br><span style="color: #fbbf24;">⚠️ ${totalFailed} files require online access</span>` : ''}`
                }
            </p>
            
            <!-- Stats Card -->
            <div style="
                background: rgba(139, 0, 0, 0.1);
                border: 1px solid rgba(139, 0, 0, 0.3);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 32px;
            ">
                <div style="display: flex; justify-content: space-around; gap: 20px;">
                    <div>
                        <div style="font-size: 32px; font-weight: 900; color: #8B0000; margin-bottom: 4px;">
                            ${totalCached}
                        </div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                            Files Cached
                        </div>
                    </div>
                    <div style="width: 1px; background: rgba(139, 0, 0, 0.3);"></div>
                    <div>
                        <div style="font-size: 32px; font-weight: 900; color: #22c55e; margin-bottom: 4px;">
                            100%
                        </div>
                        <div style="font-size: 12px; color: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                            Offline Ready
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Feature List -->
            <div style="
                text-align: left;
                margin-bottom: 32px;
                padding: 0 20px;
            ">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div style="
                        width: 8px;
                        height: 8px;
                        background: #8B0000;
                        border-radius: 50%;
                        box-shadow: 0 0 12px rgba(139, 0, 0, 0.6);
                    "></div>
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 14px;">
                        Arduino, MATLAB & SolidWorks Projects
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div style="
                        width: 8px;
                        height: 8px;
                        background: #8B0000;
                        border-radius: 50%;
                        box-shadow: 0 0 12px rgba(139, 0, 0, 0.6);
                    "></div>
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 14px;">
                        Documentation, Certificates & Research Papers
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                        width: 8px;
                        height: 8px;
                        background: #8B0000;
                        border-radius: 50%;
                        box-shadow: 0 0 12px rgba(139, 0, 0, 0.6);
                    "></div>
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 14px;">
                        Books, Posts & Educational Content
                    </span>
                </div>
            </div>
            
            <!-- Close Button -->
            <button id="close-completion-popup" style="
                background: linear-gradient(135deg, #8B0000 0%, #5a0000 100%);
                color: white;
                border: none;
                padding: 16px 48px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                width: 100%;
                transition: all 0.3s ease;
                box-shadow: 0 4px 16px rgba(139, 0, 0, 0.4);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(139, 0, 0, 0.6)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(139, 0, 0, 0.4)';">
                Open App Now 🚀
            </button>
        `;
        
        popupCard.appendChild(content);
        popup.appendChild(popupCard);
        document.body.appendChild(popup);
        
        // Close button handler
        const closeBtn = document.getElementById('close-completion-popup');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popup.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => popup.remove(), 300);
            });
        }
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => popup.remove(), 300);
            }
        }, 10000);
    }
    
    /**
     * Show download error
     */
    showDownloadError(error) {
        const progressUI = document.getElementById('offline-download-progress');
        if (progressUI) {
            progressUI.innerHTML = `
                <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px; color: #ef4444;">
                    ❌ Download Failed
                </div>
                <div style="font-size: 13px; opacity: 0.9;">
                    ${error.message || 'Unknown error occurred'}
                </div>
                <button onclick="location.reload()" style="
                    margin-top: 12px;
                    background: #8B0000;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                ">
                    Retry
                </button>
            `;
        }
    }
}

// Initialize offline content manager
const offlineManager = new OfflineContentManager();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => offlineManager.init());
} else {
    offlineManager.init();
}

// Export for use in other scripts
window.OfflineContentManager = offlineManager;

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(100px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes slideDown {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(100px); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
    
    /* Beautiful Completion Popup Animations */
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes popupSlideUp {
        from { 
            opacity: 0; 
            transform: translateY(50px) scale(0.9); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
        }
    }
    
    @keyframes iconBounce {
        0% { 
            opacity: 0; 
            transform: scale(0); 
        }
        50% { 
            transform: scale(1.15); 
        }
        100% { 
            opacity: 1; 
            transform: scale(1); 
        }
    }
    
    @keyframes checkDraw {
        to { 
            stroke-dashoffset: 0; 
        }
    }
    
    @keyframes pulse {
        0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
        }
        50% { 
            opacity: 0.8; 
            transform: scale(1.05); 
        }
    }
`;
document.head.appendChild(style);

// Offline Content Manager loaded silently
