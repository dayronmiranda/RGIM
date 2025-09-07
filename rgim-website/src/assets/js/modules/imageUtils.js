/**
 * Image Utilities for RGIM Website
 * Provides helper functions for responsive images and lazy loading
 * Merged from app.js getImagePath() and createImageElement() functions
 */

class ImageUtils {
  constructor() {
    this.config = {
      basePath: './src/assets/images/optimized/',
      placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23d1d5db" font-family="sans-serif" font-size="18"%3ECargando...%3C/text%3E%3C/svg%3E',
      sizes: ['thumbnail', 'medium', 'large'],
      formats: ['jpg', 'png', 'webp']
    };
  }

  /**
   * Smart image path resolver with fallback support
   * Merged from app.js getImagePath() function
   * @param {string} filename - Original filename
   * @returns {string|null} Optimized image path
   */
  getImagePath(filename) {
    if (!filename) return null
    
    // Remove file extension to get base name
    const baseName = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '')
    
    // Return the most likely to exist format first
    // Based on the file listing, most images have -medium.jpg format
    return `${this.config.basePath}${baseName}-medium.jpg`
  }

  /**
   * Enhanced image element creator with fallback support
   * Merged from app.js createImageElement() function
   * @param {string} filename - Original filename
   * @param {string} alt - Alt text
   * @param {string} className - CSS classes
   * @param {Object} attributes - Additional attributes
   * @returns {string} HTML string
   */
  createImageElement(filename, alt = '', className = '', attributes = {}) {
    if (!filename) return ''
    
    const baseName = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '')
    
    // Define fallback chain in order of preference
    const fallbacks = [
      `${this.config.basePath}${baseName}-medium.jpg`,
      `${this.config.basePath}${baseName}_medium.jpg`,
      `${this.config.basePath}${baseName}-medium.png`,
      `${this.config.basePath}${baseName}_medium.webp`,
      `${this.config.basePath}${baseName}-thumbnail.jpg`,
      `${this.config.basePath}${baseName}_thumbnail.jpg`
    ]
    
    const attrs = Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')
    
    return `<img src="${fallbacks[0]}" alt="${alt}" class="${className}" ${attrs} 
      onerror="
        const fallbacks = ${JSON.stringify(fallbacks)};
        const currentIndex = fallbacks.indexOf(this.src.split('/').pop().includes('${baseName}') ? this.src : '');
        if (currentIndex < fallbacks.length - 1) {
          this.src = fallbacks[currentIndex + 1];
        } else {
          this.style.display = 'none';
          console.log('❌ All image fallbacks failed for: ${filename}');
        }
      "
      onload="console.log('✅ Image loaded: ' + this.src)"
    >`
  }

  /**
   * Generate responsive image HTML with lazy loading
   * @param {string} imageName - Base name of the image (without extension)
   * @param {Object} options - Configuration options
   * @returns {string} HTML string
   */
  createResponsiveImage(imageName, options = {}) {
    const {
      alt = '',
      className = '',
      sizes = '(min-width: 768px) 50vw, 100vw',
      loading = 'lazy',
      aspectRatio = 'square'
    } = options;

    const containerClass = `lazy-image image-container aspect-${aspectRatio} ${className}`;
    
    // Generate source elements for different formats
    const sources = this.config.formats.map(format => {
      const srcsets = this.config.sizes.map(size => 
        `${this.config.basePath}${imageName}_${size}.${format}`
      );
      
      return `<source data-srcset="${srcsets.join(', ')}" type="image/${format}" sizes="${sizes}">`;
    }).join('\n    ');

    // Fallback image
    const fallbackSrc = `${this.config.basePath}${imageName}_medium.jpeg`;

    return `
      <picture class="${containerClass}">
        ${sources}
        <img 
          src="${this.config.placeholder}"
          data-src="${fallbackSrc}"
          alt="${alt}"
          class="lazy-img"
          loading="${loading}">
      </picture>
    `.trim();
  }

  /**
   * Create a simple lazy-loaded image (single format)
   * @param {string} src - Image source URL
   * @param {Object} options - Configuration options
   * @returns {string} HTML string
   */
  createLazyImage(src, options = {}) {
    const {
      alt = '',
      className = '',
      loading = 'lazy'
    } = options;

    return `
      <img 
        src="${this.config.placeholder}"
        data-src="${src}"
        alt="${alt}"
        class="lazy-img ${className}"
        loading="${loading}">
    `.trim();
  }

  /**
   * Create product image with hover effects
   * @param {string} imageName - Base name of the image
   * @param {Object} product - Product data
   * @returns {string} HTML string
   */
  createProductImage(imageName, product = {}) {
    const { name = '', price = '' } = product;
    
    return this.createResponsiveImage(imageName, {
      alt: `${name} - $${price}`,
      className: 'product-image',
      aspectRatio: 'square'
    });
  }

  /**
   * Create gallery image with lightbox support
   * @param {string} imageName - Base name of the image
   * @param {Object} options - Configuration options
   * @returns {string} HTML string
   */
  createGalleryImage(imageName, options = {}) {
    const {
      alt = '',
      caption = '',
      lightbox = true
    } = options;

    const imageHtml = this.createResponsiveImage(imageName, {
      alt,
      className: 'gallery-item',
      aspectRatio: 'square'
    });

    if (lightbox) {
      const largeImageSrc = `${this.config.basePath}${imageName}_large.jpeg`;
      return `
        <a href="${largeImageSrc}" class="gallery-link" data-lightbox="gallery" data-title="${caption}">
          ${imageHtml}
        </a>
      `.trim();
    }

    return imageHtml;
  }

  /**
   * Preload critical images
   * @param {Array} imageNames - Array of image names to preload
   */
  preloadImages(imageNames) {
    imageNames.forEach(imageName => {
      // Preload WebP version for modern browsers
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `${this.config.basePath}${imageName}_medium.webp`;
      document.head.appendChild(link);
    });
  }

  /**
   * Check if WebP is supported
   * @returns {Promise<boolean>}
   */
  supportsWebP() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Check if AVIF is supported
   * @returns {Promise<boolean>}
   */
  supportsAVIF() {
    return new Promise(resolve => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  /**
   * Get optimal image format based on browser support
   * @returns {Promise<string>}
   */
  async getOptimalFormat() {
    if (await this.supportsAVIF()) return 'avif';
    if (await this.supportsWebP()) return 'webp';
    return 'jpeg';
  }

  /**
   * Update image sources based on browser capabilities
   */
  async optimizeForBrowser() {
    const format = await this.getOptimalFormat();
    const images = document.querySelectorAll('img[data-src]');
    
    images.forEach(img => {
      const src = img.dataset.src;
      if (src && src.includes('_medium.jpeg')) {
        const optimizedSrc = src.replace('_medium.jpeg', `_medium.${format}`);
        img.dataset.src = optimizedSrc;
      }
    });
  }
}

// Create global instance
window.imageUtils = new ImageUtils();

// Auto-optimize for browser when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.imageUtils.optimizeForBrowser();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageUtils;
}