/**
 * Content Hub Sync Utility
 * Automatically syncs upload counts and activity with Content Hub
 */

class ContentHubSync {
  /**
   * Update content count after successful upload
   * @param {string} contentType - Type of content (books, videos, papers, vlogs, posts)
   * @param {object} data - Upload data with title, category, etc.
   */
  static updateCount(contentType, data = {}) {
    try {
      // Update count
      const countKey = `${contentType}_count`;
      const currentCount = parseInt(localStorage.getItem(countKey) || '0');
      localStorage.setItem(countKey, (currentCount + 1).toString());
      
      // Add to recent activity
      this.addToActivity(contentType, {
        title: data.title || 'Untitled',
        category: data.category || 'Uncategorized',
        action: data.action || 'Uploaded',
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Content Hub updated: ${contentType} count = ${currentCount + 1}`);
    } catch (error) {
      console.error('Failed to update Content Hub:', error);
    }
  }
  
  /**
   * Decrease content count after deletion
   * @param {string} contentType - Type of content
   * @param {object} data - Deletion data
   */
  static decreaseCount(contentType, data = {}) {
    try {
      const countKey = `${contentType}_count`;
      const currentCount = parseInt(localStorage.getItem(countKey) || '0');
      if (currentCount > 0) {
        localStorage.setItem(countKey, (currentCount - 1).toString());
      }
      
      // Add deletion to activity
      this.addToActivity(contentType, {
        title: data.title || 'Content',
        category: data.category || 'Unknown',
        action: 'Deleted',
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Content Hub updated: ${contentType} count = ${Math.max(0, currentCount - 1)}`);
    } catch (error) {
      console.error('Failed to update Content Hub:', error);
    }
  }
  
  /**
   * Add activity to recent activity list
   * @param {string} contentType - Type of content
   * @param {object} activity - Activity object
   */
  static addToActivity(contentType, activity) {
    try {
      const recentActivity = JSON.parse(localStorage.getItem('recent_activity') || '[]');
      
      recentActivity.unshift({
        type: contentType,
        title: activity.title,
        category: activity.category,
        action: activity.action,
        timestamp: activity.timestamp
      });
      
      // Keep only last 50 activities
      localStorage.setItem('recent_activity', JSON.stringify(recentActivity.slice(0, 50)));
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  }
  
  /**
   * Get current count for a content type
   * @param {string} contentType - Type of content
   * @returns {number} Current count
   */
  static getCount(contentType) {
    return parseInt(localStorage.getItem(`${contentType}_count`) || '0');
  }
  
  /**
   * Set count manually (useful for syncing from actual data)
   * @param {string} contentType - Type of content
   * @param {number} count - Count to set
   */
  static setCount(contentType, count) {
    try {
      localStorage.setItem(`${contentType}_count`, count.toString());
      console.log(`✅ ${contentType} count set to ${count}`);
    } catch (error) {
      console.error('Failed to set count:', error);
    }
  }
  
  /**
   * Clear all counts and activities
   */
  static clearAll() {
    const types = ['books', 'videos', 'papers', 'vlogs', 'posts'];
    types.forEach(type => {
      localStorage.setItem(`${type}_count`, '0');
    });
    localStorage.removeItem('recent_activity');
    console.log('✅ Content Hub data cleared');
  }
  
  /**
   * Sync counts from actual JSON data (call from managers)
   * @param {string} contentType - Type of content
   * @param {number} actualCount - Actual count from JSON
   */
  static syncFromData(contentType, actualCount) {
    const storedCount = this.getCount(contentType);
    if (storedCount !== actualCount) {
      this.setCount(contentType, actualCount);
      console.log(`📊 Synced ${contentType}: ${storedCount} → ${actualCount}`);
    }
  }
}

// Make it globally available
if (typeof window !== 'undefined') {
  window.ContentHubSync = ContentHubSync;
}
