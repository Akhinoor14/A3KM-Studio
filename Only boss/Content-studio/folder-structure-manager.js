/**
 * Folder Structure Automation Script
 * Creates category folders on-demand with covers
 */

const fs = require('fs').promises;
const path = require('path');

class FolderStructureManager {
  constructor(baseStoragePath) {
    this.baseStoragePath = baseStoragePath || './Content Storage';
    this.contentTypes = [
      'books-pdfs',
      'educational-videos',
      'research-papers',
      'video-content',
      'written-posts'
    ];
  }

  /**
   * Create folder structure for a single category
   */
  async createCategoryFolder(contentType, categoryName, categorySlug) {
    const categoryPath = path.join(this.baseStoragePath, contentType, categorySlug);
    
    try {
      // Create directory recursively
      await fs.mkdir(categoryPath, { recursive: true });
      console.log(`✓ Created folder: ${categoryPath}`);
      
      return {
        success: true,
        path: categoryPath
      };
    } catch (error) {
      console.error(`✗ Error creating folder ${categoryPath}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create content subfolder within a category
   */
  async createContentFolder(contentType, categorySlug, contentId) {
    const contentPath = path.join(
      this.baseStoragePath,
      contentType,
      categorySlug,
      contentId
    );
    
    try {
      await fs.mkdir(contentPath, { recursive: true });
      console.log(`✓ Created content folder: ${contentPath}`);
      
      return {
        success: true,
        path: contentPath
      };
    } catch (error) {
      console.error(`✗ Error creating content folder:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create folders for all categories in a JSON data file
   */
  async createFoldersFromJSON(contentType, jsonData) {
    const results = [];
    
    if (!jsonData.categoryGroups) {
      console.error('JSON data missing categoryGroups');
      return results;
    }

    // Iterate through all category groups
    for (const group of jsonData.categoryGroups) {
      for (const categoryName of group.categories) {
        const slug = this.slugify(categoryName);
        const result = await this.createCategoryFolder(contentType, categoryName, slug);
        
        results.push({
          category: categoryName,
          slug: slug,
          group: group.name,
          ...result
        });
      }
    }

    return results;
  }

  /**
   * Create folders for existing content items
   */
  async createFoldersForContent(contentType, contentItems) {
    const results = [];

    for (const item of contentItems) {
      const categorySlug = this.slugify(item.category);
      
      // Create category folder
      await this.createCategoryFolder(contentType, item.category, categorySlug);
      
      // Create content folder
      const result = await this.createContentFolder(contentType, categorySlug, item.id);
      
      results.push({
        contentId: item.id,
        category: item.category,
        ...result
      });
    }

    return results;
  }

  /**
   * Initialize base directory structure
   */
  async initializeBaseStructure() {
    console.log('Initializing base folder structure...\n');
    
    const results = {
      created: [],
      errors: []
    };

    for (const contentType of this.contentTypes) {
      const typePath = path.join(this.baseStoragePath, contentType);
      
      try {
        await fs.mkdir(typePath, { recursive: true });
        console.log(`✓ Created base folder: ${typePath}`);
        results.created.push(typePath);
      } catch (error) {
        console.error(`✗ Error creating ${typePath}:`, error.message);
        results.errors.push({ path: typePath, error: error.message });
      }
    }

    // Create SVG templates folder
    const svgPath = path.join(this.baseStoragePath, 'svg-templates');
    try {
      await fs.mkdir(svgPath, { recursive: true });
      console.log(`✓ Created SVG templates folder: ${svgPath}`);
      results.created.push(svgPath);
    } catch (error) {
      console.error(`✗ Error creating SVG templates folder:`, error.message);
      results.errors.push({ path: svgPath, error: error.message });
    }

    return results;
  }

  /**
   * Get folder statistics
   */
  async getFolderStats(contentType) {
    const typePath = path.join(this.baseStoragePath, contentType);
    
    try {
      const categories = await fs.readdir(typePath, { withFileTypes: true });
      const stats = {
        totalCategories: 0,
        totalContent: 0,
        categories: []
      };

      for (const category of categories) {
        if (category.isDirectory()) {
          stats.totalCategories++;
          
          const categoryPath = path.join(typePath, category.name);
          const contents = await fs.readdir(categoryPath, { withFileTypes: true });
          
          const contentCount = contents.filter(item => 
            item.isDirectory() && !item.name.startsWith('.')
          ).length;
          
          stats.totalContent += contentCount;
          stats.categories.push({
            name: category.name,
            contentCount: contentCount
          });
        }
      }

      return stats;
    } catch (error) {
      console.error(`Error getting stats for ${contentType}:`, error);
      return null;
    }
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
   * Utility: List all folders
   */
  async listAllFolders() {
    console.log('\n📂 Current Folder Structure:\n');
    
    for (const contentType of this.contentTypes) {
      const typePath = path.join(this.baseStoragePath, contentType);
      console.log(`\n${contentType}/`);
      
      try {
        const categories = await fs.readdir(typePath, { withFileTypes: true });
        
        for (const category of categories) {
          if (category.isDirectory()) {
            const categoryPath = path.join(typePath, category.name);
            const contents = await fs.readdir(categoryPath);
            console.log(`  ├─ ${category.name}/ (${contents.length} items)`);
          }
        }
      } catch (error) {
        console.log(`  └─ (not created yet)`);
      }
    }
  }
}

// CLI Usage
if (require.main === module) {
  const manager = new FolderStructureManager();
  
  // Initialize base structure
  manager.initializeBaseStructure()
    .then(results => {
      console.log(`\n✅ Initialization complete!`);
      console.log(`Created: ${results.created.length} folders`);
      if (results.errors.length > 0) {
        console.log(`Errors: ${results.errors.length}`);
      }
    });
}

// Export
module.exports = FolderStructureManager;
