const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config.json');

class ImageOptimizer {
  constructor() {
    this.config = config.images;
    this.outputDir = path.join(__dirname, '../assets/images/optimized');
    this.ensureOutputDir();
  }

  async ensureOutputDir() {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  /**
   * Optimize a single image with multiple formats and sizes
   * @param {string} inputPath - Path to the original image
   * @param {string} filename - Base filename (without extension)
   * @returns {Object} - Object containing paths to optimized images
   */
  async optimizeImage(inputPath, filename) {
    const results = {
      original: inputPath,
      optimized: {}
    };

    try {
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Generate different sizes (only JPEG format)
      for (const [sizeName, sizeConfig] of Object.entries(this.config.sizes)) {
        results.optimized[sizeName] = {};
        
        // Only generate JPEG format
        const format = 'jpeg';
        const formatConfig = this.config.formats.jpeg;
        const outputFilename = `${filename}_${sizeName}.jpg`;
        const outputPath = path.join(this.outputDir, outputFilename);
        
        let pipeline = image.clone()
          .resize(sizeConfig.width, sizeConfig.height, { 
            fit: sizeConfig.fit,
            withoutEnlargement: true 
          })
          .jpeg({
            quality: formatConfig.quality,
            progressive: formatConfig.progressive,
            mozjpeg: formatConfig.mozjpeg
          });

        await pipeline.toFile(outputPath);
        results.optimized[sizeName][format] = `/assets/images/optimized/${outputFilename}`;
      }

      return results;
    } catch (error) {
      console.error(`Error optimizing image ${inputPath}:`, error);
      throw error;
    }
  }

  /**
   * Batch optimize all images in a directory
   * @param {string} inputDir - Directory containing images to optimize
   * @returns {Array} - Array of optimization results
   */
  async optimizeDirectory(inputDir) {
    const results = [];
    
    try {
      const files = await fs.readdir(inputDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp)$/i.test(file)
      );

      for (const file of imageFiles) {
        const inputPath = path.join(inputDir, file);
        const filename = path.parse(file).name;
        
        try {
          const result = await this.optimizeImage(inputPath, filename);
          results.push(result);
          console.log(`✓ Optimized: ${file}`);
        } catch (error) {
          console.error(`✗ Failed to optimize: ${file}`, error.message);
        }
      }

      return results;
    } catch (error) {
      console.error('Error reading directory:', error);
      throw error;
    }
  }

  /**
   * Generate responsive image HTML with lazy loading
   * @param {string} imageName - Base name of the image
   * @param {string} alt - Alt text for the image
   * @param {string} className - CSS classes
   * @returns {string} - HTML string with picture element
   */
  generateResponsiveHTML(imageName, alt = '', className = '') {
    const placeholder = this.config.lazyLoading.placeholder;
    
    return `
      <picture class="lazy-image ${className}">
        <img 
          src="${placeholder}"
          data-src="/assets/images/optimized/${imageName}_medium.jpg"
          alt="${alt}"
          class="lazy-img"
          loading="lazy">
      </picture>
    `;
  }
}

module.exports = ImageOptimizer;