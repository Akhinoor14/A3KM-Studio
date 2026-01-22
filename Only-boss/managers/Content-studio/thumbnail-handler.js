/**
 * Thumbnail Handler
 * Manages thumbnail generation and storage for content
 */

class ThumbnailHandler {
  constructor() {
    this.defaultSizes = {
      small: { width: 200, height: 250 },
      medium: { width: 400, height: 500 },
      large: { width: 800, height: 1000 }
    };

    this.supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];
  }

  /**
   * Process and optimize uploaded thumbnail
   * @param {File} file - Thumbnail image file
   * @param {string} size - Target size (small, medium, large)
   * @returns {Promise<Blob>} Optimized image
   */
  async processThumbnail(file, size = 'medium') {
    const targetSize = this.defaultSizes[size];
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate dimensions maintaining aspect ratio
          let { width, height } = this.calculateDimensions(
            img.width,
            img.height,
            targetSize.width,
            targetSize.height
          );
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image with high quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob
          canvas.toBlob(
            (blob) => resolve(blob),
            'image/jpeg',
            0.92 // High quality
          );
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Calculate dimensions maintaining aspect ratio
   */
  calculateDimensions(srcWidth, srcHeight, maxWidth, maxHeight) {
    let width = srcWidth;
    let height = srcHeight;
    
    // Scale down if needed
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    
    return { width, height };
  }

  /**
   * Generate placeholder thumbnail with category color
   * @param {string} categoryName - Category name
   * @param {string} groupId - Group ID for color scheme
   * @returns {string} Data URL of generated thumbnail
   */
  generatePlaceholder(categoryName, groupId) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 400;
    canvas.height = 500;
    
    // Color schemes per group
    const colors = {
      'literature-language': ['#667eea', '#764ba2'],
      'arts-culture': ['#a8edea', '#fed6e3'],
      'social-humanities': ['#11998e', '#38ef7d'],
      'natural-sciences': ['#00c6ff', '#0072ff'],
      'medicine-health': ['#ee0979', '#ff6a00'],
      'business-management': ['#f77062', '#fe5196'],
      'agriculture-environment': ['#56ab2f', '#a8e063'],
      'engineering-technology': ['#134e5e', '#2a5298'],
      'lifestyle-personal': ['#fa709a', '#fee140']
    };
    
    const [color1, color2] = colors[groupId] || ['#667eea', '#764ba2'];
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 32px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Wrap text if too long
    const words = categoryName.split(' ');
    let line = '';
    let y = canvas.height / 2;
    const maxWidth = canvas.width - 40;
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, canvas.width / 2, y);
        line = word + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);
    
    return canvas.toDataURL('image/jpeg', 0.92);
  }

  /**
   * Get YouTube thumbnail for video content
   * @param {string} videoId - YouTube video ID
   * @param {string} quality - Thumbnail quality
   * @returns {string} YouTube thumbnail URL
   */
  getYouTubeThumbnail(videoId, quality = 'maxresdefault') {
    const qualities = {
      default: 'default',       // 120x90
      medium: 'mqdefault',      // 320x180
      high: 'hqdefault',        // 480x360
      standard: 'sddefault',    // 640x480
      max: 'maxresdefault'      // 1280x720
    };
    
    const q = qualities[quality] || qualities.max;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  /**
   * Validate thumbnail file
   */
  validateThumbnail(file) {
    const errors = [];
    
    // Check file type
    const ext = file.name.split('.').pop().toLowerCase();
    if (!this.supportedFormats.includes(ext)) {
      errors.push(`Unsupported format: ${ext}. Use ${this.supportedFormats.join(', ')}`);
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max: 5MB`);
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get thumbnail path for content
   */
  getThumbnailPath(contentType, categorySlug, contentId, format = 'jpg') {
    return `/Content Storage/${contentType}/${categorySlug}/${contentId}/thumbnail.${format}`;
  }

  /**
   * Create thumbnail variants (small, medium, large)
   */
  async createVariants(file) {
    const variants = {};
    
    for (const [size, dimensions] of Object.entries(this.defaultSizes)) {
      variants[size] = await this.processThumbnail(file, size);
    }
    
    return variants;
  }

  /**
   * Extract dominant color from thumbnail
   */
  async extractDominantColor(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Scale down for faster processing
          canvas.width = 50;
          canvas.height = 50;
          
          ctx.drawImage(img, 0, 0, 50, 50);
          
          const imageData = ctx.getImageData(0, 0, 50, 50).data;
          let r = 0, g = 0, b = 0;
          
          for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
          }
          
          const pixelCount = imageData.length / 4;
          r = Math.round(r / pixelCount);
          g = Math.round(g / pixelCount);
          b = Math.round(b / pixelCount);
          
          resolve(`rgb(${r}, ${g}, ${b})`);
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThumbnailHandler;
}
