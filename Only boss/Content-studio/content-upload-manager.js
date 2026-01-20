/**
 * Content Upload Manager
 * Handles content uploads with automatic folder creation and thumbnail management
 */

class ContentUploadManager {
  constructor() {
    this.contentTypes = {
      'books-pdfs': {
        basePath: '../../Content Storage/books-pdfs',
        allowedFormats: ['.pdf', '.epub'],
        thumbnailRequired: true
      },
      'educational-videos': {
        basePath: '../../Content Storage/educational-videos',
        allowedFormats: ['.mp4', '.youtube'],
        thumbnailRequired: false // YouTube auto-thumbnail
      },
      'research-papers': {
        basePath: '../../Content Storage/research-papers',
        allowedFormats: ['.pdf'],
        thumbnailRequired: true
      },
      'video-content': {
        basePath: '../../Content Storage/video-content',
        allowedFormats: ['.youtube'],
        thumbnailRequired: false // YouTube auto-thumbnail
      },
      'written-posts': {
        basePath: '../../Content Storage/written-posts',
        allowedFormats: ['.md', '.html'],
        thumbnailRequired: true
      }
    };

    this.svgGenerator = new SVGCoverGenerator();
  }

  /**
   * Upload content to appropriate category folder
   * @param {Object} contentData - Content metadata and files
   * @returns {Promise<Object>} Upload result
   */
  async uploadContent(contentData) {
    const {
      contentType,    // 'books-pdfs', 'educational-videos', etc.
      category,       // 'Arduino & Microcontrollers'
      contentId,      // Unique ID for this content
      title,
      file,           // The main content file
      thumbnail,      // Optional thumbnail file
      youtubeId,      // For video content
      metadata        // Additional metadata
    } = contentData;

    try {
      // 1. Validate content type
      if (!this.contentTypes[contentType]) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      // 2. Create category folder structure
      const categorySlug = this.slugify(category);
      const categoryPath = `${this.contentTypes[contentType].basePath}/${categorySlug}`;
      await this.ensureFolderExists(categoryPath);

      // 3. Generate category cover if doesn't exist
      await this.ensureCategoryCover(category, categorySlug, contentType);

      // 4. Create content folder
      const contentPath = `${categoryPath}/${contentId}`;
      await this.ensureFolderExists(contentPath);

      // 5. Handle file uploads
      const uploadResults = {
        category: category,
        contentId: contentId,
        paths: {}
      };

      // Upload main content file
      if (file) {
        const contentFilePath = `${contentPath}/${this.sanitizeFilename(file.name)}`;
        uploadResults.paths.content = contentFilePath;
        // File upload logic here
      }

      // Upload thumbnail
      if (thumbnail) {
        const thumbnailPath = `${contentPath}/thumbnail.${this.getFileExtension(thumbnail.name)}`;
        uploadResults.paths.thumbnail = thumbnailPath;
        // Thumbnail upload logic here
      } else if (youtubeId) {
        // Use YouTube thumbnail
        uploadResults.paths.thumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      }

      // 6. Save metadata
      const metadataPath = `${contentPath}/metadata.json`;
      const metadataContent = {
        id: contentId,
        title: title,
        category: category,
        uploadDate: new Date().toISOString(),
        ...metadata
      };
      uploadResults.paths.metadata = metadataPath;

      return {
        success: true,
        data: uploadResults
      };

    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ensure folder exists, create if not
   */
  async ensureFolderExists(path) {
    // In browser environment, use File System Access API or IndexedDB
    // For server-side, use fs.mkdir
    console.log(`Ensuring folder exists: ${path}`);
    
    // Placeholder for actual implementation
    return true;
  }

  /**
   * Ensure category has a cover SVG
   */
  async ensureCategoryCover(categoryName, categorySlug, contentType) {
    const coverPath = `${this.contentTypes[contentType].basePath}/${categorySlug}/cover.svg`;
    
    // Check if cover already exists
    const exists = await this.fileExists(coverPath);
    
    if (!exists) {
      console.log(`Generating cover for: ${categoryName}`);
      const svg = await this.svgGenerator.generateCover(categoryName, 0);
      
      if (svg) {
        // Save the generated SVG
        await this.saveFile(coverPath, svg);
      }
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(path) {
    // Implementation depends on environment
    return false; // Placeholder
  }

  /**
   * Save file to path
   */
  async saveFile(path, content) {
    console.log(`Saving file to: ${path}`);
    // Implementation depends on environment
    return true;
  }

  /**
   * Get folder structure for a category
   */
  getCategoryStructure(contentType, categorySlug) {
    const basePath = this.contentTypes[contentType].basePath;
    
    return {
      categoryPath: `${basePath}/${categorySlug}`,
      coverPath: `${basePath}/${categorySlug}/cover.svg`,
      contentFolder: `${basePath}/${categorySlug}/{content-id}`,
      structure: [
        `${categorySlug}/`,
        `${categorySlug}/cover.svg`,
        `${categorySlug}/{content-id}/`,
        `${categorySlug}/{content-id}/content.{format}`,
        `${categorySlug}/{content-id}/thumbnail.{jpg|png}`,
        `${categorySlug}/{content-id}/metadata.json`
      ]
    };
  }

  /**
   * Batch create folders for existing content
   */
  async createFoldersForExistingContent(contentData) {
    const results = [];

    for (const item of contentData) {
      const categorySlug = this.slugify(item.category);
      const contentType = item.contentType;
      
      // Create category folder
      const categoryPath = `${this.contentTypes[contentType].basePath}/${categorySlug}`;
      await this.ensureFolderExists(categoryPath);
      
      // Generate cover
      await this.ensureCategoryCover(item.category, categorySlug, contentType);
      
      // Create content folder
      const contentPath = `${categoryPath}/${item.id}`;
      await this.ensureFolderExists(contentPath);
      
      results.push({
        category: item.category,
        slug: categorySlug,
        paths: {
          category: categoryPath,
          content: contentPath
        }
      });
    }

    return results;
  }

  /**
   * Generate YouTube thumbnail URL
   */
  getYouTubeThumbnail(videoId, quality = 'maxresdefault') {
    // Available qualities: default, mqdefault, hqdefault, sddefault, maxresdefault
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  /**
   * Utility: Slugify text
   */
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Utility: Sanitize filename
   */
  sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9.-]/gi, '_');
  }

  /**
   * Utility: Get file extension
   */
  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentUploadManager;
}
