/**
 * Folder Structure Manager
 * Creates and manages folder structure for content storage
 */

const fs = require('fs').promises;
const path = require('path');

class FolderStructureManager {
  constructor(basePath = './Content Storage') {
    this.basePath = basePath;
    this.contentTypes = {
      'books-pdfs': 'books',
      'educational-videos': 'courses',
      'research-papers': 'papers',
      'video-content': 'videos',
      'written-posts': 'posts'
    };
  }

  /**
   * Create folder structure for a single category
   * @param {string} contentType - Type of content
   * @param {string} categoryName - Category name
   */
  async createCategoryFolder(contentType, categoryName) {
    const categorySlug = this.slugify(categoryName);
    const categoryPath = path.join(this.basePath, contentType, categorySlug);
    
    try {
      await fs.mkdir(categoryPath, { recursive: true });
      console.log(`✓ Created: ${categoryPath}`);
      return categoryPath;
    } catch (error) {
      console.error(`✗ Error creating ${categoryPath}:`, error.message);
      throw error;
    }
  }

  /**
   * Create content folder inside category
   * @param {string} categoryPath - Path to category folder
   * @param {string} contentId - Unique content ID
   */
  async createContentFolder(categoryPath, contentId) {
    const contentPath = path.join(categoryPath, contentId);
    
    try {
      await fs.mkdir(contentPath, { recursive: true });
      console.log(`  ✓ Content folder: ${contentId}`);
      return contentPath;
    } catch (error) {
      console.error(`  ✗ Error creating content folder:`, error.message);
      throw error;
    }
  }

  /**
   * Create folders from JSON file
   * @param {string} contentType - Type of content
   * @param {string} jsonPath - Path to JSON file
   */
  async createFoldersFromJSON(contentType, jsonPath) {
    try {
      const jsonContent = await fs.readFile(jsonPath, 'utf8');
      const data = JSON.parse(jsonContent);
      
      // Extract categories from categoryGroups
      const categories = [];
      if (data.categoryGroups && Array.isArray(data.categoryGroups)) {
        data.categoryGroups.forEach(group => {
          if (group.categories) {
            categories.push(...group.categories);
          }
        });
      }
      
      console.log(`\n📁 Creating folders for ${contentType}...`);
      console.log(`   Found ${categories.length} categories\n`);
      
      const results = {
        success: [],
        failed: []
      };
      
      for (const category of categories) {
        try {
          const categoryPath = await this.createCategoryFolder(contentType, category);
          results.success.push({ category, path: categoryPath });
        } catch (error) {
          results.failed.push({ category, error: error.message });
        }
      }
      
      console.log(`\n✅ Successfully created: ${results.success.length} folders`);
      if (results.failed.length > 0) {
        console.log(`❌ Failed: ${results.failed.length} folders`);
      }
      
      return results;
    } catch (error) {
      console.error(`Error reading JSON file ${jsonPath}:`, error.message);
      throw error;
    }
  }

  /**
   * Create complete folder structure for all content types
   */
  async initializeBaseStructure() {
    console.log('🚀 Initializing Content Storage Structure...\n');
    
    const allResults = {};
    
    for (const [contentType, jsonKey] of Object.entries(this.contentTypes)) {
      const jsonPath = path.join('./Content Studio', contentType, `${jsonKey}.json`);
      
      try {
        const results = await this.createFoldersFromJSON(contentType, jsonPath);
        allResults[contentType] = results;
      } catch (error) {
        console.error(`Failed to process ${contentType}:`, error.message);
        allResults[contentType] = { success: [], failed: [], error: error.message };
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60) + '\n');
    
    let totalSuccess = 0;
    let totalFailed = 0;
    
    for (const [contentType, results] of Object.entries(allResults)) {
      const successCount = results.success ? results.success.length : 0;
      const failedCount = results.failed ? results.failed.length : 0;
      
      totalSuccess += successCount;
      totalFailed += failedCount;
      
      console.log(`${contentType.padEnd(25)} ✓ ${successCount}  ✗ ${failedCount}`);
    }
    
    console.log('\n' + '-'.repeat(60));
    console.log(`Total: ✓ ${totalSuccess}  ✗ ${totalFailed}`);
    console.log('='.repeat(60) + '\n');
    
    return allResults;
  }

  /**
   * Get folder statistics
   */
  async getFolderStats(contentType) {
    const contentPath = path.join(this.basePath, contentType);
    
    try {
      const categories = await fs.readdir(contentPath);
      const stats = {
        totalCategories: 0,
        totalContent: 0,
        categoriesWithContent: 0,
        emptyCategories: 0,
        details: []
      };
      
      for (const category of categories) {
        const categoryPath = path.join(contentPath, category);
        const stat = await fs.stat(categoryPath);
        
        if (stat.isDirectory()) {
          stats.totalCategories++;
          
          const contents = await fs.readdir(categoryPath);
          const contentFolders = contents.filter(async item => {
            const itemPath = path.join(categoryPath, item);
            const itemStat = await fs.stat(itemPath);
            return itemStat.isDirectory();
          });
          
          const contentCount = contentFolders.length;
          stats.totalContent += contentCount;
          
          if (contentCount > 0) {
            stats.categoriesWithContent++;
          } else {
            stats.emptyCategories++;
          }
          
          stats.details.push({
            category,
            contentCount
          });
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting folder stats:', error.message);
      return null;
    }
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
}

// CLI usage
if (require.main === module) {
  const manager = new FolderStructureManager();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'init') {
    // Create all folders
    manager.initializeBaseStructure()
      .then(() => console.log('\n✅ Initialization complete!'))
      .catch(err => console.error('\n❌ Initialization failed:', err.message));
  } else if (command === 'stats') {
    // Show statistics
    const contentType = args[1] || 'books-pdfs';
    manager.getFolderStats(contentType)
      .then(stats => {
        console.log('\n📊 Folder Statistics:');
        console.log(JSON.stringify(stats, null, 2));
      })
      .catch(err => console.error('Error:', err.message));
  } else {
    console.log(`
Usage:
  node folder-structure-manager.js init        - Create all category folders
  node folder-structure-manager.js stats [type] - Show folder statistics
  
Example:
  node folder-structure-manager.js init
  node folder-structure-manager.js stats books-pdfs
    `);
  }
}

module.exports = FolderStructureManager;
