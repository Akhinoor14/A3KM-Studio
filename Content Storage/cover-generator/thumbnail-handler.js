/**
 * Thumbnail Handler
 * Processes and optimizes thumbnails for content
 */

class ThumbnailHandler {
  constructor() {
    this.sizes = {
      small: { width: 200, height: 250 },
      medium: { width: 400, height: 500 },
      large: { width: 800, height: 1000 }
    };
    
    this.quality = 0.92; // JPEG quality
    this.format = 'image/jpeg';
  }

  /**
   * Process and optimize thumbnail
   * @param {File} file - Image file
   * @param {string} size - Size variant (small, medium, large)
   * @returns {Promise<Blob>} - Optimized image blob
   */
  async processThumbnail(file, size = 'medium') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const targetSize = this.sizes[size];
          const aspectRatio = img.width / img.height;
          const targetAspectRatio = targetSize.width / targetSize.height;
          
          let drawWidth = img.width;
          let drawHeight = img.height;
          let offsetX = 0;
          let offsetY = 0;
          
          // Crop to fit aspect ratio
          if (aspectRatio > targetAspectRatio) {
            // Image is wider - crop width
            drawWidth = img.height * targetAspectRatio;
            offsetX = (img.width - drawWidth) / 2;
          } else {
            // Image is taller - crop height
            drawHeight = img.width / targetAspectRatio;
            offsetY = (img.height - drawHeight) / 2;
          }
          
          // Set canvas size
          canvas.width = targetSize.width;
          canvas.height = targetSize.height;
          
          // Draw image
          ctx.drawImage(
            img,
            offsetX, offsetY, drawWidth, drawHeight,
            0, 0, targetSize.width, targetSize.height
          );
          
          // Convert to blob
          canvas.toBlob(
            (blob) => resolve(blob),
            this.format,
            this.quality
          );
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate placeholder thumbnail with category color
   * @param {string} categoryName - Category name
   * @param {string} groupId - Category group ID
   * @returns {Blob} - SVG placeholder blob
   */
  generatePlaceholder(categoryName, groupId) {
    const colors = {
      'literature-language': '#667eea',
      'arts-culture': '#a8edea',
      'social-humanities': '#11998e',
      'natural-sciences': '#0072ff',
      'medicine-health': '#ee0979',
      'business-management': '#f77062',
      'agriculture-environment': '#56ab2f',
      'engineering-technology': '#134e5e',
      'lifestyle-personal': '#fa709a'
    };
    
    const color = colors[groupId] || '#667eea';
    const initials = this.getInitials(categoryName);
    
    const svg = `
      <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${this.adjustBrightness(color, -20)};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#grad)"/>
        <text 
          x="200" 
          y="250" 
          font-family="Arial, sans-serif" 
          font-size="120" 
          font-weight="bold" 
          fill="white" 
          text-anchor="middle" 
          dominant-baseline="middle"
          opacity="0.9">
          ${initials}
        </text>
        <text 
          x="200" 
          y="420" 
          font-family="Arial, sans-serif" 
          font-size="24" 
          fill="white" 
          text-anchor="middle" 
          opacity="0.8">
          ${categoryName}
        </text>
      </svg>
    `;
    
    return new Blob([svg], { type: 'image/svg+xml' });
  }

  /**
   * Get YouTube thumbnail URL
   * @param {string} youtubeUrl - YouTube video URL
   * @param {string} quality - Thumbnail quality (default, hq, mq, sd, maxres)
   * @returns {string} - Thumbnail URL
   */
  getYouTubeThumbnail(youtubeUrl, quality = 'maxresdefault') {
    const videoId = this.extractYouTubeVideoId(youtubeUrl);
    if (!videoId) return null;
    
    const qualities = {
      'default': 'default.jpg',       // 120x90
      'mq': 'mqdefault.jpg',           // 320x180
      'hq': 'hqdefault.jpg',           // 480x360
      'sd': 'sddefault.jpg',           // 640x480
      'maxres': 'maxresdefault.jpg'    // 1280x720
    };
    
    const filename = qualities[quality] || qualities.maxres;
    return `https://img.youtube.com/vi/${videoId}/${filename}`;
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
   * Validate thumbnail file
   * @param {File} file - Image file
   * @returns {Object} - Validation result
   */
  validateThumbnail(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    const errors = [];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Allowed: JPEG, PNG, WebP');
    }
    
    if (file.size > maxSize) {
      errors.push('File too large. Maximum size: 5MB');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Create multiple size variants
   * @param {File} file - Original image
   * @returns {Promise<Object>} - Object with small, medium, large blobs
   */
  async createVariants(file) {
    const variants = {};
    
    for (const [sizeName, dimensions] of Object.entries(this.sizes)) {
      try {
        variants[sizeName] = await this.processThumbnail(file, sizeName);
      } catch (error) {
        console.error(`Failed to create ${sizeName} variant:`, error);
        variants[sizeName] = null;
      }
    }
    
    return variants;
  }

  /**
   * Get initials from category name
   */
  getInitials(name) {
    const words = name.split(/[\s&-]+/).filter(w => w.length > 0);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  /**
   * Adjust color brightness
   */
  adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  /**
   * Extract dominant color from image
   * @param {File} file - Image file
   * @returns {Promise<string>} - Hex color code
   */
  async extractDominantColor(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Use small canvas for color extraction
          canvas.width = 50;
          canvas.height = 50;
          
          ctx.drawImage(img, 0, 0, 50, 50);
          const imageData = ctx.getImageData(0, 0, 50, 50).data;
          
          // Calculate average color
          let r = 0, g = 0, b = 0;
          const pixelCount = imageData.length / 4;
          
          for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
          }
          
          r = Math.round(r / pixelCount);
          g = Math.round(g / pixelCount);
          b = Math.round(b / pixelCount);
          
          const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          resolve(hex);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThumbnailHandler;
}
