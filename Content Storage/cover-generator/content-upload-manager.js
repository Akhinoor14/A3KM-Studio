/**
 * Content Upload Manager
 * Handles content uploads with automatic folder creation and thumbnail management
 */

class ContentUploadManager {
  constructor() {
    this.contentTypes = {
      'books-pdfs': {
        basePath: '/Content Storage/books-pdfs',
        allowedFormats: ['.pdf', '.epub'],
        thumbnailRequired: true
      },
      'educational-videos': {
        basePath: '/Content Storage/educational-videos',
        allowedFormats: ['.mp4', '.youtube'],
        thumbnailRequired: false // YouTube auto-thumbnail
      },
      'research-papers': {
        basePath: '/Content Storage/research-papers',
        allowedFormats: ['.pdf'],
        thumbnailRequired: true
      },
      'video-content': {
        basePath: '/Content Storage/video-content',
        allowedFormats: ['.youtube'],
        thumbnailRequired: false // YouTube auto-thumbnail
      },
      'written-posts': {
        basePath: '/Content Storage/written-posts',
        allowedFormats: ['.md', '.html'],
        thumbnailRequired: true
      }
    };

    this.svgGenerator = new SVGCoverGenerator();
  }

  /**
   * Upload content to appropriate category folder
   * @param {Object} options - Upload options
   * @param {string} options.contentType - Type of content (books-pdfs, etc.)
   * @param {string} options.category - Category name
   * @param {File} options.file - Content file
   * @param {File} options.thumbnail - Thumbnail image (optional)
   * @param {Object} options.metadata - Additional metadata
   */
  async uploadContent(options) {
    const { contentType, category, file, thumbnail, metadata = {} } = options;
    
    // Validate content type
    if (!this.contentTypes[contentType]) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const config = this.contentTypes[contentType];
    
    // Validate file format
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!config.allowedFormats.includes(fileExt) && !metadata.isYouTube) {
      throw new Error(`Invalid file format. Allowed: ${config.allowedFormats.join(', ')}`);
    }

    // Generate unique content ID
    const contentId = this.generateContentId(category, file.name);
    const categorySlug = this.slugify(category);
    
    // Create folder structure
    const categoryPath = `${config.basePath}/${categorySlug}`;
    const contentPath = `${categoryPath}/${contentId}`;
    
    await this.ensureFolderExists(categoryPath);
    await this.ensureFolderExists(contentPath);
    
    // Generate category cover if not exists
    await this.ensureCategoryCover(categoryPath, category);
    
    // Save content file
    const contentFilename = metadata.isYouTube ? 'youtube-link.txt' : file.name;
    const contentFilePath = `${contentPath}/${contentFilename}`;
    
    if (metadata.isYouTube) {
      // Save YouTube URL
      await this.saveTextFile(contentFilePath, metadata.youtubeUrl);
    } else {
      await this.saveFile(contentFilePath, file);
    }
    
    // Handle thumbnail
    let thumbnailPath = null;
    if (thumbnail && !metadata.isYouTube) {
      thumbnailPath = `${contentPath}/thumbnail.jpg`;
      await this.saveFile(thumbnailPath, thumbnail);
    } else if (metadata.isYouTube) {
      // Extract YouTube thumbnail URL
      thumbnailPath = this.getYouTubeThumbnailUrl(metadata.youtubeUrl);
    }
    
    // Save metadata
    const metadataObj = {
      id: contentId,
      category,
      title: metadata.title || file.name,
      description: metadata.description || '',
      author: metadata.author || 'Md Akhinoor Islam',
      tags: metadata.tags || [],
      uploadDate: new Date().toISOString(),
      contentFile: contentFilename,
      thumbnail: thumbnailPath,
      isYouTube: metadata.isYouTube || false,
      youtubeUrl: metadata.youtubeUrl || null
    };
    
    await this.saveJSON(`${contentPath}/metadata.json`, metadataObj);
    
    return {
      success: true,
      contentId,
      categoryPath,
      contentPath,
      metadata: metadataObj
    };
  }

  /**
   * Ensure folder exists (create if not)
   */
  async ensureFolderExists(path) {
    // This would use File System Access API or server-side code
    // For demonstration, we'll return a promise
    return new Promise((resolve) => {
      console.log(`Ensuring folder exists: ${path}`);
      // In real implementation, would check and create folder
      resolve(true);
    });
  }

  /**
   * Ensure category cover exists (generate if not)
   */
  async ensureCategoryCover(categoryPath, categoryName) {
    const coverPath = `${categoryPath}/cover.svg`;
    
    // Check if cover exists (in real implementation)
    const coverExists = false; // Would check file system
    
    if (!coverExists) {
      const svgContent = await this.svgGenerator.generateCover(categoryName, 0);
      await this.saveTextFile(coverPath, svgContent);
      console.log(`Generated cover for category: ${categoryName}`);
    }
    
    return coverPath;
  }

  /**
   * Generate unique content ID
   */
  generateContentId(category, filename) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const slugBase = filename.split('.')[0].substring(0, 20);
    return `${this.slugify(slugBase)}-${timestamp}-${random}`;
  }

  /**
   * Convert text to URL-friendly slug
   */
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  /**
   * Get YouTube thumbnail URL from video URL
   */
  getYouTubeThumbnailUrl(youtubeUrl) {
    const videoId = this.extractYouTubeVideoId(youtubeUrl);
    if (!videoId) return null;
    
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  /**
   * Extract YouTube video ID from URL
   */
  extractYouTubeVideoId(url) {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  }

  /**
   * Save file (placeholder for actual implementation)
   */
  async saveFile(path, file) {
    return new Promise((resolve) => {
      console.log(`Saving file: ${path}`);
      // In real implementation, would save file to file system
      resolve(true);
    });
  }

  /**
   * Save text file
   */
  async saveTextFile(path, content) {
    return new Promise((resolve) => {
      console.log(`Saving text file: ${path}`);
      // In real implementation, would save text to file
      resolve(true);
    });
  }

  /**
   * Save JSON file
   */
  async saveJSON(path, data) {
    const jsonContent = JSON.stringify(data, null, 2);
    return this.saveTextFile(path, jsonContent);
  }

  /**
   * Get category structure from JSON
   */
  async getCategoryStructure(contentType) {
    const jsonPath = `/Content Studio/${contentType}/${contentType.split('-')[0]}.json`;
    
    try {
      const response = await fetch(jsonPath);
      const data = await response.json();
      
      if (data.categoryGroups && Array.isArray(data.categoryGroups)) {
        const allCategories = [];
        data.categoryGroups.forEach(group => {
          if (group.categories) {
            allCategories.push(...group.categories);
          }
        });
        return allCategories;
      }
      
      return [];
    } catch (error) {
      console.error('Error loading category structure:', error);
      return [];
    }
  }

  /**
   * Create folders for existing content in JSON files
   */
  async createFoldersForExistingContent(contentType) {
    const jsonPath = `/Content Studio/${contentType}/${contentType.split('-')[0]}.json`;
    
    try {
      const response = await fetch(jsonPath);
      const data = await response.json();
      
      const contentKey = contentType.split('-')[0]; // books, courses, papers, etc.
      const items = data[contentKey] || data.posts || data.videos || [];
      
      const results = [];
      
      for (const item of items) {
        const categorySlug = this.slugify(item.category);
        const categoryPath = `${this.contentTypes[contentType].basePath}/${categorySlug}`;
        const contentPath = `${categoryPath}/${item.id}`;
        
        await this.ensureFolderExists(categoryPath);
        await this.ensureFolderExists(contentPath);
        await this.ensureCategoryCover(categoryPath, item.category);
        
        results.push({
          category: item.category,
          contentId: item.id,
          categoryPath,
          contentPath
        });
      }
      
      return results;
    } catch (error) {
      console.error('Error creating folders for existing content:', error);
      throw error;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ContentUploadManager;
}
