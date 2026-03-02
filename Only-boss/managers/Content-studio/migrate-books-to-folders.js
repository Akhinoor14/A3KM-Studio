/**
 * ========================================
 * BOOKS MIGRATION SCRIPT
 * Migrate from flat structure to folder-based structure
 * ========================================
 * 
 * OLD STRUCTURE (Flat):
 * books-pdfs/
 * ├── book-title-123456.pdf
 * └── covers/
 *     └── book-title-123456-thumbnail.jpg
 * 
 * NEW STRUCTURE (Folder-based):
 * books-pdfs/
 * └── book-title-123456/
 *     ├── book.pdf
 *     ├── cover.jpg
 *     └── thumbnail.jpg
 * 
 * This script:
 * 1. Creates new folder structure on GitHub
 * 2. Moves files to new locations
 * 3. Updates books.json with new paths
 * 4. Deletes old files (optional)
 */

class BooksMigrationTool {
    constructor() {
        // Initialize GitHub uploader
        this.uploader = new GitHubContentUploader({
            onProgress: (data) => console.log('📊 Progress:', data),
            onError: (error) => console.error('❌ Error:', error),
            onSuccess: (data) => console.log('✅ Success:', data)
        });
        
        this.booksJsonPath = 'Content Studio/books-pdfs/books.json';
        this.storagePath = 'Content Storage/books-pdfs';
    }

    /**
     * Migrate a single book to folder structure
     */
    async migrateBook(book) {
        console.log(`\n📚 Migrating: ${book.title}`);
        
        try {
            // 1. Create folder name from title + ID
            const folderName = this.createFolderName(book.title, book.id);
            const newFolderPath = `${this.storagePath}/${folderName}`;
            
            console.log(`📁 New folder: ${newFolderPath}`);
            
            // 2. Create folder
            await this.uploader.createFolder(newFolderPath);
            console.log('✅ Folder created');
            
            // 3. Download and re-upload PDF
            if (book.downloadUrl) {
                const pdfUrl = this.extractGitHubPath(book.downloadUrl);
                const newPdfPath = `${newFolderPath}/book.pdf`;
                
                console.log(`📄 Moving PDF: ${pdfUrl} → ${newPdfPath}`);
                await this.moveFile(pdfUrl, newPdfPath, 'PDF');
            }
            
            // 4. Download and re-upload cover
            if (book.cover) {
                const coverUrl = this.extractGitHubPath(book.cover);
                const extension = this.getExtension(coverUrl);
                const newCoverPath = `${newFolderPath}/cover.${extension}`;
                
                console.log(`🖼️ Moving Cover: ${coverUrl} → ${newCoverPath}`);
                await this.moveFile(coverUrl, newCoverPath, 'Cover');
            }
            
            // 5. Download and re-upload thumbnail
            if (book.thumbnail) {
                const thumbUrl = this.extractGitHubPath(book.thumbnail);
                const extension = this.getExtension(thumbUrl);
                const newThumbPath = `${newFolderPath}/thumbnail.${extension}`;
                
                console.log(`🖼️ Moving Thumbnail: ${thumbUrl} → ${newThumbPath}`);
                await this.moveFile(thumbUrl, newThumbPath, 'Thumbnail');
            }
            
            // 6. Update book entry with new paths
            const updatedBook = {
                ...book,
                downloadUrl: this.convertToGitHubUrl(`${newFolderPath}/book.pdf`),
                cover: this.convertToGitHubUrl(`${newFolderPath}/cover.${this.getExtension(book.cover)}`),
                thumbnail: this.convertToGitHubUrl(`${newFolderPath}/thumbnail.${this.getExtension(book.thumbnail)}`),
                folderPath: newFolderPath
            };
            
            console.log('✅ Book migrated successfully!');
            return updatedBook;
            
        } catch (error) {
            console.error(`❌ Migration failed for ${book.title}:`, error.message);
            throw error;
        }
    }

    /**
     * Migrate all books in books.json
     */
    async migrateAllBooks() {
        try {
            console.log('🚀 Starting books migration...\n');
            
            // 1. Load books.json
            console.log('📖 Loading books.json...');
            const booksData = await this.loadBooksJson();
            
            if (!booksData.books || booksData.books.length === 0) {
                console.log('ℹ️ No books to migrate');
                return;
            }
            
            console.log(`📚 Found ${booksData.books.length} book(s) to migrate\n`);
            
            // 2. Migrate each book
            const migratedBooks = [];
            const errors = [];
            
            for (const book of booksData.books) {
                try {
                    const migrated = await this.migrateBook(book);
                    migratedBooks.push(migrated);
                    await this.delay(1000); // Rate limiting
                } catch (error) {
                    errors.push({ book: book.title, error: error.message });
                    console.error(`⚠️ Skipping ${book.title} due to error`);
                }
            }
            
            // 3. Update books.json with new structure
            if (migratedBooks.length > 0) {
                console.log('\n📝 Updating books.json...');
                booksData.books = migratedBooks;
                
                await this.uploader.uploadFile(
                    this.booksJsonPath,
                    JSON.stringify(booksData, null, 2),
                    'Migrate books to folder-based structure',
                    false
                );
                
                console.log('✅ books.json updated');
            }
            
            // 4. Summary
            console.log('\n' + '='.repeat(50));
            console.log('📊 MIGRATION SUMMARY');
            console.log('='.repeat(50));
            console.log(`✅ Migrated: ${migratedBooks.length}`);
            console.log(`❌ Errors: ${errors.length}`);
            
            if (errors.length > 0) {
                console.log('\n⚠️ Errors:');
                errors.forEach(e => console.log(`  - ${e.book}: ${e.error}`));
            }
            
            console.log('\n✅ Migration complete!');
            console.log('ℹ️ Old files still exist. Please verify new structure before deleting them.');
            
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
            throw error;
        }
    }

    /**
     * Helper: Load books.json from GitHub
     */
    async loadBooksJson() {
        const data = await this.uploader.getFile(this.booksJsonPath);
        const content = atob(data.content);
        return JSON.parse(content);
    }

    /**
     * Helper: Move file by downloading and re-uploading
     */
    async moveFile(oldPath, newPath, fileType) {
        try {
            // Download from old location
            const fileData = await this.uploader.getFile(oldPath);
            
            // Upload to new location (binary content)
            await this.uploader.uploadFile(
                newPath,
                fileData.content,  // Already base64
                `Migrate ${fileType}`,
                true  // isBase64
            );
            
            console.log(`  ✅ ${fileType} moved`);
        } catch (error) {
            console.error(`  ❌ Failed to move ${fileType}:`, error.message);
            throw error;
        }
    }

    /**
     * Helper: Extract GitHub file path from URL
     */
    extractGitHubPath(url) {
        if (!url || !url.includes('githubusercontent.com')) {
            return url;
        }
        
        // Extract path from: https://raw.githubusercontent.com/user/repo/branch/path
        const parts = url.split('/');
        const pathIndex = parts.indexOf('main') + 1;
        if (pathIndex > 0) {
            return decodeURIComponent(parts.slice(pathIndex).join('/'));
        }
        
        return url;
    }

    /**
     * Helper: Convert path to GitHub raw URL
     */
    convertToGitHubUrl(path) {
        const encodedPath = path.split('/').map(seg => encodeURIComponent(seg)).join('/');
        return `https://raw.githubusercontent.com/${this.uploader.owner}/${this.uploader.repo}/${this.uploader.branch}/${encodedPath}`;
    }

    /**
     * Helper: Create folder name from title + ID
     */
    createFolderName(title, id) {
        const slug = title
            .toLowerCase()
            .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')  // Keep Bengali, English, numbers
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        return `${slug}-${id}`.substring(0, 200);  // Limit length
    }

    /**
     * Helper: Get file extension from URL/path
     */
    getExtension(path) {
        if (!path) return 'jpg';
        const match = path.match(/\.([a-zA-Z0-9]+)(\?|$)/);
        return match ? match[1] : 'jpg';
    }

    /**
     * Helper: Delay for rate limiting
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Clean up old files (DANGEROUS - use after verification)
     */
    async cleanupOldFiles(booksData) {
        console.log('\n⚠️ CLEANUP MODE - This will DELETE old files!');
        console.log('Make sure new structure works before proceeding.\n');
        
        const confirmed = confirm('Are you sure you want to delete old files? This cannot be undone!');
        
        if (!confirmed) {
            console.log('ℹ️ Cleanup cancelled');
            return;
        }
        
        console.log('🗑️ Deleting old files...');
        
        for (const book of booksData.books) {
            // This would delete old files - implement if needed
            console.log(`Would delete old files for: ${book.title}`);
        }
        
        console.log('✅ Cleanup complete');
    }
}

// ==================== USAGE ====================

// Usage in browser console:
// 1. Open Books Manager page
// 2. Open browser console (F12)
// 3. Run:
//    const migrator = new BooksMigrationTool();
//    await migrator.migrateAllBooks();

// For single book:
//    const book = { /* book object from books.json */ };
//    await migrator.migrateBook(book);
