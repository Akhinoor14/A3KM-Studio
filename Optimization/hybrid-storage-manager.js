/**
 * A3KM Studio - Hybrid Storage Manager
 * Ultra-fast offline storage with intelligent routing
 * 
 * Storage Strategy:
 * - Small files (<1MB) → Cache API (fastest)
 * - Large files (>1MB) → OPFS (if supported) or IndexedDB
 * - User data → IndexedDB (structured, permanent)
 * - Session data → SessionStorage (temporary)
 * 
 * Browser Support: Chrome 86+, Edge 86+, Safari 15.2+, Firefox 111+
 */

class HybridStorageManager {
    constructor() {
        this.SMALL_FILE_THRESHOLD = 1024 * 1024; // 1MB
        this.CACHE_NAME = 'a3km-cache-v3.2';
        this.OPFS_NAME = 'a3km-opfs';
        this.IDB_NAME = 'a3km-storage';
        this.IDB_VERSION = 1;
        
        this.capabilities = {
            cacheAPI: 'caches' in self,
            opfs: 'storage' in navigator && 'getDirectory' in navigator.storage,
            indexedDB: 'indexedDB' in window,
            serviceWorker: 'serviceWorker' in navigator
        };
        
        this.opfsRoot = null;
        this.idb = null;
        this.stats = {
            cacheSize: 0,
            opfsSize: 0,
            idbSize: 0,
            totalFiles: 0
        };
        
        console.log('🚀 Hybrid Storage Manager initialized');
        console.log('📊 Capabilities:', this.capabilities);
        
        this.init();
    }
    
    /**
     * Initialize storage systems
     */
    async init() {
        try {
            // Initialize OPFS if supported
            if (this.capabilities.opfs) {
                await this.initOPFS();
            }
            
            // Initialize IndexedDB
            if (this.capabilities.indexedDB) {
                await this.initIndexedDB();
            }
            
            // Estimate storage quota
            await this.checkStorageQuota();
            
            console.log('✅ Hybrid Storage ready');
        } catch (error) {
            console.error('❌ Storage initialization error:', error);
        }
    }
    
    /**
     * Initialize Origin Private File System (fastest for large files)
     */
    async initOPFS() {
        try {
            this.opfsRoot = await navigator.storage.getDirectory();
            console.log('✅ OPFS initialized (ultra-fast storage)');
            return true;
        } catch (error) {
            console.warn('⚠️ OPFS not available:', error.message);
            return false;
        }
    }
    
    /**
     * Initialize IndexedDB (fallback for large files + user data)
     */
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.IDB_NAME, this.IDB_VERSION);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.idb = request.result;
                console.log('✅ IndexedDB initialized');
                resolve(this.idb);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Store for large files
                if (!db.objectStoreNames.contains('files')) {
                    const fileStore = db.createObjectStore('files', { keyPath: 'url' });
                    fileStore.createIndex('type', 'type', { unique: false });
                    fileStore.createIndex('size', 'size', { unique: false });
                    fileStore.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                // Store for user data (bookmarks, settings, etc.)
                if (!db.objectStoreNames.contains('userData')) {
                    const userStore = db.createObjectStore('userData', { keyPath: 'key' });
                    userStore.createIndex('category', 'category', { unique: false });
                }
                
                // Store for metadata
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                }
                
                console.log('🔧 IndexedDB schema created');
            };
        });
    }
    
    /**
     * Check available storage quota
     */
    async checkStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const usedMB = (estimate.usage / 1024 / 1024).toFixed(2);
            const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
            const percentUsed = ((estimate.usage / estimate.quota) * 100).toFixed(1);
            
            console.log(`💾 Storage: ${usedMB}MB / ${quotaMB}MB (${percentUsed}% used)`);
            
            return {
                used: estimate.usage,
                quota: estimate.quota,
                available: estimate.quota - estimate.usage,
                percentUsed: parseFloat(percentUsed)
            };
        }
        
        return null;
    }
    
    /**
     * Smart storage decision: Choose best storage for file
     */
    async store(url, data, options = {}) {
        const fileSize = this.getSize(data);
        const fileType = options.type || this.getFileType(url);
        
        console.log(`📦 Storing: ${url} (${(fileSize / 1024).toFixed(2)}KB, type: ${fileType})`);
        
        // Route to appropriate storage
        if (fileSize < this.SMALL_FILE_THRESHOLD) {
            // Small files → Cache API (fastest)
            return await this.storeInCache(url, data, options);
        } else if (this.opfsRoot) {
            // Large files → OPFS (fastest for large files)
            return await this.storeInOPFS(url, data, options);
        } else {
            // Fallback → IndexedDB
            return await this.storeInIndexedDB(url, data, options);
        }
    }
    
    /**
     * Store in Cache API (for small, frequently accessed files)
     */
    async storeInCache(url, data, options = {}) {
        try {
            const cache = await caches.open(this.CACHE_NAME);
            
            // Create response object
            const response = new Response(data, {
                headers: {
                    'Content-Type': options.contentType || this.getContentType(url),
                    'Cache-Control': 'max-age=31536000', // 1 year
                    'X-Storage-Method': 'cache-api'
                }
            });
            
            await cache.put(url, response);
            this.stats.cacheSize += this.getSize(data);
            this.stats.totalFiles++;
            
            console.log(`✅ Cached (fast): ${url}`);
            return { success: true, method: 'cache', size: this.getSize(data) };
        } catch (error) {
            console.error('❌ Cache storage failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Store in OPFS (ultra-fast for large files)
     */
    async storeInOPFS(url, data, options = {}) {
        try {
            const fileName = this.urlToFileName(url);
            const fileHandle = await this.opfsRoot.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            
            await writable.write(data);
            await writable.close();
            
            // Store metadata in IndexedDB
            await this.storeMetadata(url, {
                method: 'opfs',
                fileName,
                size: this.getSize(data),
                type: this.getFileType(url),
                timestamp: Date.now()
            });
            
            this.stats.opfsSize += this.getSize(data);
            this.stats.totalFiles++;
            
            console.log(`✅ OPFS stored (ultra-fast): ${url}`);
            return { success: true, method: 'opfs', size: this.getSize(data) };
        } catch (error) {
            console.error('❌ OPFS storage failed:', error);
            // Fallback to IndexedDB
            return await this.storeInIndexedDB(url, data, options);
        }
    }
    
    /**
     * Store in IndexedDB (fallback for large files)
     */
    async storeInIndexedDB(url, data, options = {}) {
        try {
            const transaction = this.idb.transaction(['files'], 'readwrite');
            const store = transaction.objectStore('files');
            
            const fileData = {
                url,
                data,
                type: this.getFileType(url),
                size: this.getSize(data),
                timestamp: Date.now(),
                contentType: options.contentType || this.getContentType(url)
            };
            
            await new Promise((resolve, reject) => {
                const request = store.put(fileData);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
            
            this.stats.idbSize += this.getSize(data);
            this.stats.totalFiles++;
            
            console.log(`✅ IndexedDB stored: ${url}`);
            return { success: true, method: 'indexeddb', size: this.getSize(data) };
        } catch (error) {
            console.error('❌ IndexedDB storage failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Retrieve file from storage (automatic routing)
     */
    async retrieve(url) {
        // Try Cache first (fastest)
        const cached = await this.retrieveFromCache(url);
        if (cached) return cached;
        
        // Check metadata to find storage location
        const metadata = await this.getMetadata(url);
        
        if (metadata?.method === 'opfs') {
            return await this.retrieveFromOPFS(url, metadata.fileName);
        }
        
        // Try IndexedDB
        return await this.retrieveFromIndexedDB(url);
    }
    
    /**
     * Retrieve from Cache API
     */
    async retrieveFromCache(url) {
        try {
            const cache = await caches.open(this.CACHE_NAME);
            const response = await cache.match(url);
            
            if (response) {
                console.log(`⚡ Retrieved from cache: ${url}`);
                return await response.blob();
            }
            
            return null;
        } catch (error) {
            console.error('Cache retrieval error:', error);
            return null;
        }
    }
    
    /**
     * Retrieve from OPFS
     */
    async retrieveFromOPFS(url, fileName) {
        try {
            const fileHandle = await this.opfsRoot.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            
            console.log(`⚡⚡ Retrieved from OPFS (ultra-fast): ${url}`);
            return await file.arrayBuffer();
        } catch (error) {
            console.error('OPFS retrieval error:', error);
            return null;
        }
    }
    
    /**
     * Retrieve from IndexedDB
     */
    async retrieveFromIndexedDB(url) {
        try {
            const transaction = this.idb.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            
            const fileData = await new Promise((resolve, reject) => {
                const request = store.get(url);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            
            if (fileData) {
                console.log(`⚡ Retrieved from IndexedDB: ${url}`);
                return fileData.data;
            }
            
            return null;
        } catch (error) {
            console.error('IndexedDB retrieval error:', error);
            return null;
        }
    }
    
    /**
     * Store metadata
     */
    async storeMetadata(url, metadata) {
        if (!this.idb) return;
        
        try {
            const transaction = this.idb.transaction(['metadata'], 'readwrite');
            const store = transaction.objectStore('metadata');
            
            await new Promise((resolve, reject) => {
                const request = store.put({ key: url, ...metadata });
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Metadata storage error:', error);
        }
    }
    
    /**
     * Get metadata
     */
    async getMetadata(url) {
        if (!this.idb) return null;
        
        try {
            const transaction = this.idb.transaction(['metadata'], 'readonly');
            const store = transaction.objectStore('metadata');
            
            return await new Promise((resolve, reject) => {
                const request = store.get(url);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error('Metadata retrieval error:', error);
            return null;
        }
    }
    
    /**
     * Batch store multiple files (optimized)
     */
    async storeBatch(files, onProgress) {
        const results = [];
        let completed = 0;
        
        for (const file of files) {
            const result = await this.store(file.url, file.data, file.options);
            results.push({ url: file.url, ...result });
            
            completed++;
            if (onProgress) {
                onProgress(completed, files.length, (completed / files.length) * 100);
            }
        }
        
        return results;
    }
    
    /**
     * Clear all storage
     */
    async clearAll() {
        try {
            // Clear Cache API
            await caches.delete(this.CACHE_NAME);
            
            // Clear OPFS
            if (this.opfsRoot) {
                const entries = await this.opfsRoot.values();
                for await (const entry of entries) {
                    await this.opfsRoot.removeEntry(entry.name);
                }
            }
            
            // Clear IndexedDB
            if (this.idb) {
                const transaction = this.idb.transaction(['files', 'metadata', 'userData'], 'readwrite');
                await transaction.objectStore('files').clear();
                await transaction.objectStore('metadata').clear();
                await transaction.objectStore('userData').clear();
            }
            
            this.stats = { cacheSize: 0, opfsSize: 0, idbSize: 0, totalFiles: 0 };
            
            console.log('🗑️ All storage cleared');
            return true;
        } catch (error) {
            console.error('Clear storage error:', error);
            return false;
        }
    }
    
    /**
     * Get storage statistics
     */
    async getStats() {
        const quota = await this.checkStorageQuota();
        
        return {
            ...this.stats,
            quota,
            capabilities: this.capabilities,
            recommendation: this.getStorageRecommendation(quota)
        };
    }
    
    /**
     * Get storage recommendation
     */
    getStorageRecommendation(quota) {
        if (!quota) return 'Unable to determine storage status';
        
        if (quota.percentUsed > 90) {
            return '⚠️ Storage almost full - consider clearing old content';
        } else if (quota.percentUsed > 70) {
            return '🟡 Storage usage high - monitor regularly';
        } else if (quota.percentUsed > 50) {
            return '🟢 Storage usage moderate - healthy';
        } else {
            return '✅ Plenty of storage available';
        }
    }
    
    /**
     * Helper: Get file size
     */
    getSize(data) {
        if (data instanceof Blob) return data.size;
        if (data instanceof ArrayBuffer) return data.byteLength;
        if (typeof data === 'string') return new Blob([data]).size;
        return 0;
    }
    
    /**
     * Helper: Get file type from URL
     */
    getFileType(url) {
        const ext = url.split('.').pop().toLowerCase().split('?')[0];
        const types = {
            'html': 'document',
            'css': 'stylesheet',
            'js': 'script',
            'json': 'data',
            'svg': 'image',
            'png': 'image',
            'jpg': 'image',
            'jpeg': 'image',
            'webp': 'image',
            'pdf': 'document',
            'mp4': 'video',
            'webm': 'video'
        };
        return types[ext] || 'unknown';
    }
    
    /**
     * Helper: Get content type
     */
    getContentType(url) {
        const ext = url.split('.').pop().toLowerCase().split('?')[0];
        const types = {
            'html': 'text/html',
            'css': 'text/css',
            'js': 'application/javascript',
            'json': 'application/json',
            'svg': 'image/svg+xml',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
            'mp4': 'video/mp4',
            'webm': 'video/webm'
        };
        return types[ext] || 'application/octet-stream';
    }
    
    /**
     * Helper: Convert URL to safe filename
     */
    urlToFileName(url) {
        return url.replace(/[^a-zA-Z0-9]/g, '-') + '.cached';
    }
}

// Initialize global instance
const hybridStorage = new HybridStorageManager();
window.hybridStorage = hybridStorage;

console.log('🚀 Hybrid Storage Manager loaded and ready');
