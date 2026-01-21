/**
 * Premium SVG Cover Generator
 * Generates high-quality category covers from templates
 */

class SVGCoverGenerator {
  constructor() {
    this.templates = {
      'literature-language': '/Content Storage/svg-templates/literature-language.svg',
      'arts-culture': '/Content Storage/svg-templates/arts-culture.svg',
      'social-humanities': '/Content Storage/svg-templates/social-humanities.svg',
      'natural-sciences': '/Content Storage/svg-templates/natural-sciences.svg',
      'medicine-health': '/Content Storage/svg-templates/medicine-health.svg',
      'business-management': '/Content Storage/svg-templates/business-management.svg',
      'agriculture-environment': '/Content Storage/svg-templates/agriculture-environment.svg',
      'engineering-technology': '/Content Storage/svg-templates/engineering-technology.svg',
      'lifestyle-personal': '/Content Storage/svg-templates/lifestyle-personal.svg'
    };

    this.groupMapping = this.initializeGroupMapping();
  }

  /**
   * Map categories to their group templates
   */
  initializeGroupMapping() {
    return {
      // Literature & Language
      "Children's Literature": 'literature-language',
      "Classic Literature": 'literature-language',
      "Comics & Graphic Novels": 'literature-language',
      "Contemporary Fiction": 'literature-language',
      "Creative Writing": 'literature-language',
      "Drama & Plays": 'literature-language',
      "Fiction - Novels": 'literature-language',
      "Language Learning & Linguistics": 'literature-language',
      "Literary Criticism": 'literature-language',
      "Mystery & Thriller": 'literature-language',
      "Poetry & Verse": 'literature-language',
      "Romance Literature": 'literature-language',
      "Science Fiction & Fantasy": 'literature-language',
      "Short Stories": 'literature-language',
      "World Literature": 'literature-language',

      // Arts & Culture
      "Architecture & Interior Design": 'arts-culture',
      "Art History": 'arts-culture',
      "Calligraphy & Typography": 'arts-culture',
      "Crafts & Handmade": 'arts-culture',
      "Cultural Studies": 'arts-culture',
      "Dance & Choreography": 'arts-culture',
      "Digital Art & Animation": 'arts-culture',
      "Fashion & Design": 'arts-culture',
      "Film & Cinema Studies": 'arts-culture',
      "Graphic Design": 'arts-culture',
      "Museum & Heritage Studies": 'arts-culture',
      "Music Theory & Composition": 'arts-culture',
      "Photography & Videography": 'arts-culture',
      "Sculpture & 3D Art": 'arts-culture',
      "Theater & Performance Arts": 'arts-culture',
      "Visual Arts & Painting": 'arts-culture',

      // Social Sciences & Humanities
      "Anthropology": 'social-humanities',
      "Archaeology": 'social-humanities',
      "Communication & Soft Skills": 'social-humanities',
      "Debate & Public Speaking": 'social-humanities',
      "Development Studies": 'social-humanities',
      "Economics & Finance": 'social-humanities',
      "Education & Pedagogy": 'social-humanities',
      "Gender Studies": 'social-humanities',
      "Geography & Earth Sciences": 'social-humanities',
      "History & Archaeology": 'social-humanities',
      "Human Rights & Social Justice": 'social-humanities',
      "International Relations": 'social-humanities',
      "Journalism & Reporting": 'social-humanities',
      "Law & Legal Studies": 'social-humanities',
      "Library & Information Science": 'social-humanities',
      "Media & Communication Studies": 'social-humanities',
      "Philosophy & Ethics": 'social-humanities',
      "Political Science & Governance": 'social-humanities',
      "Psychology & Mental Health": 'social-humanities',
      "Public Policy & Administration": 'social-humanities',
      "Public Speaking & Rhetoric": 'social-humanities',
      "Religious Studies & Theology": 'social-humanities',
      "Social Justice": 'social-humanities',
      "Sociology & Anthropology": 'social-humanities',

      // Natural & Physical Sciences
      "Astronomy & Space Science": 'natural-sciences',
      "Biochemistry": 'natural-sciences',
      "Biology & Life Sciences": 'natural-sciences',
      "Botany & Plant Sciences": 'natural-sciences',
      "Chemistry & Biochemistry": 'natural-sciences',
      "Environmental Science & Ecology": 'natural-sciences',
      "Genetics & Molecular Biology": 'natural-sciences',
      "Geology & Mineralogy": 'natural-sciences',
      "Marine Biology & Oceanography": 'natural-sciences',
      "Mathematics & Statistics": 'natural-sciences',
      "Meteorology & Climate Science": 'natural-sciences',
      "Microbiology & Virology": 'natural-sciences',
      "Neuroscience & Brain Studies": 'natural-sciences',
      "Physics & Astronomy": 'natural-sciences',
      "Quantum Physics": 'natural-sciences',
      "Space Science & Astrophysics": 'natural-sciences',
      "Zoology & Animal Behavior": 'natural-sciences',

      // Medicine & Health
      "Alternative Medicine & Ayurveda": 'medicine-health',
      "Anatomy & Physiology": 'medicine-health',
      "Dentistry & Oral Health": 'medicine-health',
      "Geriatrics & Elderly Care": 'medicine-health',
      "Medical Research & Diagnostics": 'medicine-health',
      "Medicine & Healthcare": 'medicine-health',
      "Mental Health & Counseling": 'medicine-health',
      "Nursing & Patient Care": 'medicine-health',
      "Nutrition & Dietetics": 'medicine-health',
      "Pediatrics & Child Health": 'medicine-health',
      "Pharmacy & Pharmacology": 'medicine-health',
      "Physiotherapy & Rehabilitation": 'medicine-health',
      "Public Health & Epidemiology": 'medicine-health',
      "Sports Medicine & Fitness": 'medicine-health',
      "Surgery & Medical Procedures": 'medicine-health',

      // Business & Management
      "Banking & Insurance": 'business-management',
      "Business Administration": 'business-management',
      "Business Strategy & Planning": 'business-management',
      "Corporate Governance": 'business-management',
      "E-commerce & Online Business": 'business-management',
      "Entrepreneurship & Startups": 'business-management',
      "Finance & Accounting": 'business-management',
      "Human Resource Management": 'business-management',
      "Investment & Stock Market": 'business-management',
      "Leadership & Management": 'business-management',
      "Marketing & Advertising": 'business-management',
      "Real Estate & Property": 'business-management',
      "Retail & Trade": 'business-management',
      "Sales & Customer Relations": 'business-management',
      "Supply Chain & Logistics": 'business-management',

      // Agriculture & Environment
      "Agricultural Engineering": 'agriculture-environment',
      "Agriculture & Farming": 'agriculture-environment',
      "Animal Husbandry & Livestock": 'agriculture-environment',
      "Fisheries & Aquaculture": 'agriculture-environment',
      "Forestry & Wildlife": 'agriculture-environment',
      "Horticulture & Gardening": 'agriculture-environment',
      "Organic Farming": 'agriculture-environment',
      "Pest Management": 'agriculture-environment',
      "Soil Science": 'agriculture-environment',
      "Sustainable Agriculture": 'agriculture-environment',

      // Engineering & Technology
      "3D Modeling & CAD": 'engineering-technology',
      "3D Printing & Additive Manufacturing": 'engineering-technology',
      "Aerospace Engineering": 'engineering-technology',
      "Artificial Intelligence & ML": 'engineering-technology',
      "Arduino & Microcontrollers": 'engineering-technology',
      "Automation & Control Systems": 'engineering-technology',
      "Automotive Engineering": 'engineering-technology',
      "Biotechnology & Bioengineering": 'engineering-technology',
      "Blockchain & Cryptocurrency": 'engineering-technology',
      "CAD & Design Software": 'engineering-technology',
      "Chemical Engineering": 'engineering-technology',
      "Circuit Design & Electronics": 'engineering-technology',
      "Civil Engineering & Construction": 'engineering-technology',
      "Cloud Computing & DevOps": 'engineering-technology',
      "Computer Architecture": 'engineering-technology',
      "Computer Science & Programming": 'engineering-technology',
      "Cybersecurity & Ethical Hacking": 'engineering-technology',
      "Data Science & Analytics": 'engineering-technology',
      "Database Systems": 'engineering-technology',
      "Drones & UAV Technology": 'engineering-technology',
      "Electrical Engineering": 'engineering-technology',
      "Embedded Systems": 'engineering-technology',
      "Energy Systems & Power Electronics": 'engineering-technology',
      "Game Development": 'engineering-technology',
      "Industrial Engineering": 'engineering-technology',
      "Internet of Things (IoT)": 'engineering-technology',
      "Machine Learning & Deep Learning": 'engineering-technology',
      "Mechanical Engineering": 'engineering-technology',
      "Mobile App Development": 'engineering-technology',
      "Nanotechnology": 'engineering-technology',
      "Network Engineering": 'engineering-technology',
      "PCB Design & VLSI": 'engineering-technology',
      "Quantum Computing": 'engineering-technology',
      "Renewable Energy": 'engineering-technology',
      "Robotics & Automation": 'engineering-technology',
      "Semiconductor Technology": 'engineering-technology',
      "Signal Processing": 'engineering-technology',
      "Simulation & Modeling": 'engineering-technology',
      "Smart Cities & Infrastructure": 'engineering-technology',
      "Software Engineering": 'engineering-technology',
      "Systems Engineering": 'engineering-technology',
      "Telecommunications": 'engineering-technology',
      "UI/UX Design": 'engineering-technology',
      "Virtual Reality & AR": 'engineering-technology',
      "Web Development & Design": 'engineering-technology',
      "Wearable Technology": 'engineering-technology',

      // Lifestyle & Personal Development
      "Career & Professional Growth": 'lifestyle-personal',
      "Cooking & Culinary Arts": 'lifestyle-personal',
      "Health & Fitness": 'lifestyle-personal',
      "Hobbies & Recreation": 'lifestyle-personal',
      "Home & Garden": 'lifestyle-personal',
      "Parenting & Child Development": 'lifestyle-personal',
      "Personal Development & Self-Help": 'lifestyle-personal',
      "Personal Growth": 'lifestyle-personal',
      "Productivity & Time Management": 'lifestyle-personal',
      "Relationships & Family": 'lifestyle-personal',
      "Sports & Athletics": 'lifestyle-personal',
      "Travel & Tourism": 'lifestyle-personal',
      "Work-Life Balance": 'lifestyle-personal',
      "Yoga & Meditation": 'lifestyle-personal',

      // Blog & Media (for posts.json)
      "Biography & Interviews": 'lifestyle-personal',
      "Book Reviews": 'literature-language',
      "Campus Life & University": 'social-humanities',
      "Coding Challenges": 'engineering-technology',
      "Competitive Programming": 'engineering-technology',
      "Current Affairs & News": 'social-humanities',
      "DIY Projects": 'lifestyle-personal',
      "Entertainment & Pop Culture": 'arts-culture',
      "Industry Insights": 'business-management',
      "Learning Resources": 'social-humanities',
      "Life Lessons & Personal Stories": 'lifestyle-personal',
      "Opinion & Editorial": 'social-humanities',
      "Product Reviews": 'engineering-technology',
      "Project Showcase": 'engineering-technology',
      "Study Tips & Learning": 'social-humanities',
      "Technology News": 'engineering-technology',
      "Tutorial & How-To": 'engineering-technology',
      "Workspace Setup": 'lifestyle-personal'
    };
  }

  /**
   * Generate SVG cover for a category
   * @param {string} categoryName - Name of the category
   * @param {number} contentCount - Number of items in category (optional)
   * @returns {Promise<string>} - Generated SVG content
   */
  async generateCover(categoryName, contentCount = 0) {
    const groupId = this.groupMapping[categoryName];
    
    if (!groupId) {
      console.warn(`Category "${categoryName}" not mapped to any group. Using default template.`);
      groupId = 'engineering-technology';
    }

    const templatePath = this.templates[groupId];
    
    try {
      const response = await fetch(templatePath);
      let svgContent = await response.text();
      
      // Replace placeholders
      svgContent = svgContent.replace(/\{\{CATEGORY_NAME\}\}/g, this.formatCategoryName(categoryName));
      svgContent = svgContent.replace(/\{\{COUNT\}\}/g, contentCount.toString());
      
      return svgContent;
    } catch (error) {
      console.error(`Error loading template for ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Format category name for display (wrap long names)
   */
  formatCategoryName(name) {
    if (name.length > 30) {
      const words = name.split(' ');
      const lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length > 25) {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      
      if (currentLine) {
        lines.push(currentLine.trim());
      }
      
      return lines.join('\n');
    }
    return name;
  }

  /**
   * Save generated SVG to file system
   * @param {string} categoryName - Category name
   * @param {string} svgContent - SVG content
   * @param {string} outputPath - Where to save
   */
  async saveCover(categoryName, svgContent, outputPath) {
    const slug = this.slugify(categoryName);
    const filename = `${outputPath}/${slug}/cover.svg`;
    
    // This would use File System Access API or server-side code
    // For now, returns the data for manual saving
    return {
      filename,
      content: svgContent,
      blob: new Blob([svgContent], { type: 'image/svg+xml' })
    };
  }

  /**
   * Convert category name to URL-friendly slug
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
   * Generate covers for all categories in a content type
   * @param {Array} categories - Array of category names
   * @param {string} contentType - books-pdfs, educational-videos, etc.
   */
  async generateBatchCovers(categories, contentType) {
    const results = [];
    
    for (const category of categories) {
      try {
        const svgContent = await this.generateCover(category, 0);
        const result = await this.saveCover(category, svgContent, `/Content Storage/${contentType}`);
        results.push({ category, success: true, result });
      } catch (error) {
        results.push({ category, success: false, error: error.message });
      }
    }
    
    return results;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SVGCoverGenerator;
}
