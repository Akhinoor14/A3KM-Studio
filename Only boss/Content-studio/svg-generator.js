/**
 * Premium SVG Cover Generator
 * Generates high-quality category covers from templates
 */

class SVGCoverGenerator {
  constructor() {
    this.templates = {
      'literature-language': '../../Content Storage/svg-templates/literature-language.svg',
      'arts-culture': '../../Content Storage/svg-templates/arts-culture.svg',
      'social-humanities': '../../Content Storage/svg-templates/social-humanities.svg',
      'natural-sciences': '../../Content Storage/svg-templates/natural-sciences.svg',
      'medicine-health': '../../Content Storage/svg-templates/medicine-health.svg',
      'business-management': '../../Content Storage/svg-templates/business-management.svg',
      'agriculture-environment': '../../Content Storage/svg-templates/agriculture-environment.svg',
      'engineering-technology': '../../Content Storage/svg-templates/engineering-technology.svg',
      'lifestyle-personal': '../../Content Storage/svg-templates/lifestyle-personal.svg'
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
      "Fashion & Beauty": 'arts-culture',
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
      "Urban Planning": 'social-humanities',

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
      "Health & Fitness": 'medicine-health',
      "Medical Research & Diagnostics": 'medicine-health',
      "Medicine & Healthcare": 'medicine-health',
      "Mental Health & Counseling": 'medicine-health',
      "Nursing & Patient Care": 'medicine-health',
      "Nutrition & Dietetics": 'medicine-health',
      "Parenting & Child Development": 'medicine-health',
      "Pediatrics & Child Health": 'medicine-health',
      "Pharmacy & Pharmacology": 'medicine-health',
      "Physiotherapy & Rehabilitation": 'medicine-health',
      "Public Health & Epidemiology": 'medicine-health',
      "Sports Medicine & Fitness": 'medicine-health',
      "Surgery & Medical Procedures": 'medicine-health',
      "Yoga & Meditation": 'medicine-health',

      // Business & Management
      "Banking & Insurance": 'business-management',
      "Business Administration": 'business-management',
      "Business Strategy & Planning": 'business-management',
      "Career & Professional Growth": 'business-management',
      "Corporate Governance": 'business-management',
      "Digital Marketing": 'business-management',
      "E-commerce & Online Business": 'business-management',
      "Entrepreneurship & Startups": 'business-management',
      "Finance & Accounting": 'business-management',
      "Human Resource Management": 'business-management',
      "Investment & Stock Market": 'business-management',
      "Leadership & Management": 'business-management',
      "Marketing & Advertising": 'business-management',
      "Productivity & Time Management": 'business-management',
      "Project Management": 'business-management',
      "Real Estate & Property": 'business-management',
      "Retail & Trade": 'business-management',
      "Sales & Customer Relations": 'business-management',
      "Supply Chain & Logistics": 'business-management',

      // Agriculture & Environment
      "Agriculture & Farming": 'agriculture-environment',
      "Animal Husbandry & Livestock": 'agriculture-environment',
      "Fisheries & Aquaculture": 'agriculture-environment',
      "Forestry & Wildlife": 'agriculture-environment',
      "Horticulture & Gardening": 'agriculture-environment',
      "Organic Farming": 'agriculture-environment',
      "Pest Management": 'agriculture-environment',
      "Soil Science": 'agriculture-environment',
      "Sustainable Agriculture": 'agriculture-environment',

      // Engineering & Technology (extensive list)
      "3D Modeling & CAD": 'engineering-technology',
      "Aerospace Engineering": 'engineering-technology',
      "Android Development": 'engineering-technology',
      "API Development": 'engineering-technology',
      "Arduino & Microcontrollers": 'engineering-technology',
      "Artificial Intelligence": 'engineering-technology',
      "Augmented Reality": 'engineering-technology',
      "Automotive Engineering": 'engineering-technology',
      "Biotechnology & Bioengineering": 'engineering-technology',
      "Blockchain & Cryptocurrency": 'engineering-technology',
      "Chemical Engineering": 'engineering-technology',
      "Circuit Design": 'engineering-technology',
      "Civil Engineering": 'engineering-technology',
      "Cloud Computing": 'engineering-technology',
      "Communication Systems": 'engineering-technology',
      "Computer Science & Programming": 'engineering-technology',
      "Computer Vision": 'engineering-technology',
      "Cybersecurity & Networking": 'engineering-technology',
      "Data Science & Analytics": 'engineering-technology',
      "Database Design": 'engineering-technology',
      "DevOps & CI/CD": 'engineering-technology',
      "Digital Electronics": 'engineering-technology',
      "Drones & UAV": 'engineering-technology',
      "Electrical Engineering": 'engineering-technology',
      "Embedded Systems": 'engineering-technology',
      "Game Development": 'engineering-technology',
      "Hardware Design": 'engineering-technology',
      "Home Automation": 'engineering-technology',
      "Industrial Engineering": 'engineering-technology',
      "Industry 4.0": 'engineering-technology',
      "Internet of Things (IoT)": 'engineering-technology',
      "Linux & System Administration": 'engineering-technology',
      "Machine Learning & Deep Learning": 'engineering-technology',
      "Mechanical Engineering": 'engineering-technology',
      "Mobile App Development": 'engineering-technology',
      "Operating Systems": 'engineering-technology',
      "PCB Design & Fabrication": 'engineering-technology',
      "Power Electronics": 'engineering-technology',
      "Power Systems": 'engineering-technology',
      "Programming Languages": 'engineering-technology',
      "Python Programming": 'engineering-technology',
      "Quantum Computing": 'engineering-technology',
      "Renewable Energy": 'engineering-technology',
      "Robotics & Automation": 'engineering-technology',
      "Signal Processing": 'engineering-technology',
      "Simulation & Modeling": 'engineering-technology',
      "Smart Cities": 'engineering-technology',
      "Software Architecture": 'engineering-technology',
      "Software Engineering": 'engineering-technology',
      "SQL & NoSQL": 'engineering-technology',
      "System Design": 'engineering-technology',
      "Systems Engineering": 'engineering-technology',
      "Technical Writing": 'engineering-technology',
      "Testing & QA": 'engineering-technology',
      "Troubleshooting & Debugging": 'engineering-technology',
      "UI/UX Design": 'engineering-technology',
      "Virtual Reality": 'engineering-technology',
      "Wearable Tech": 'engineering-technology',
      "Web Development & Design": 'engineering-technology',
      "Wireless Communication": 'engineering-technology',

      // Lifestyle & Personal Development
      "Cooking & Culinary Arts": 'lifestyle-personal',
      "Hobbies & Recreation": 'lifestyle-personal',
      "Home & Garden": 'lifestyle-personal',
      "Personal Development & Self-Help": 'lifestyle-personal',
      "Relationships & Family": 'lifestyle-personal',
      "Sports & Athletics": 'lifestyle-personal',
      "Travel & Tourism": 'lifestyle-personal',
      "Work-Life Balance": 'lifestyle-personal'
    };
  }

  /**
   * Generate SVG cover for a category
   * @param {string} categoryName - The category name
   * @param {number} contentCount - Number of items in category
   * @returns {Promise<string>} - Generated SVG content
   */
  async generateCover(categoryName, contentCount = 0) {
    const groupId = this.groupMapping[categoryName];
    
    if (!groupId) {
      console.warn(`No template mapping found for category: ${categoryName}`);
      return null;
    }

    try {
      const templatePath = this.templates[groupId];
      const response = await fetch(templatePath);
      let svgContent = await response.text();

      // Replace placeholders
      svgContent = svgContent.replace(/\{\{CATEGORY_NAME\}\}/g, this.formatCategoryName(categoryName));
      svgContent = svgContent.replace(/\{\{COUNT\}\}/g, contentCount.toString());

      return svgContent;
    } catch (error) {
      console.error(`Error generating cover for ${categoryName}:`, error);
      return null;
    }
  }

  /**
   * Format category name for display (split long names)
   */
  formatCategoryName(name) {
    if (name.length > 20) {
      const words = name.split(' ');
      const mid = Math.ceil(words.length / 2);
      return words.slice(0, mid).join(' ') + '\n' + words.slice(mid).join(' ');
    }
    return name;
  }

  /**
   * Save generated SVG to category folder
   * @param {string} categorySlug - URL-safe category name
   * @param {string} svgContent - Generated SVG content
   * @param {string} contentType - books-pdfs, educational-videos, etc.
   */
  async saveCover(categorySlug, svgContent, contentType) {
    const folderPath = `/Content Storage/${contentType}/${categorySlug}`;
    const filePath = `${folderPath}/cover.svg`;

    // In a real implementation, this would use File System API
    // For now, return the data for manual saving
    return {
      path: filePath,
      content: svgContent
    };
  }

  /**
   * Batch generate covers for multiple categories
   */
  async generateBatchCovers(categories, contentType) {
    const results = [];

    for (const category of categories) {
      const slug = this.slugify(category.name);
      const svg = await this.generateCover(category.name, category.count || 0);
      
      if (svg) {
        results.push({
          category: category.name,
          slug: slug,
          svg: svg,
          path: `/Content Storage/${contentType}/${slug}/cover.svg`
        });
      }
    }

    return results;
  }

  /**
   * Convert category name to URL-safe slug
   */
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Get template for a specific group
   */
  getGroupTemplate(groupId) {
    return this.templates[groupId] || null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SVGCoverGenerator;
}
