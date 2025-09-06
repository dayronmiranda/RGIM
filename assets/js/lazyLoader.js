/**
 * Lazy Loading Image Manager
 * Handles progressive image loading with Intersection Observer API
 */
class LazyLoader {
  constructor(options = {}) {
    this.config = {
      rootMargin: options.rootMargin || '50px',
      threshold: options.threshold || 0.1,
      enableRetina: options.enableRetina !== false,
      fadeInDuration: options.fadeInDuration || 300,
      errorPlaceholder: options.errorPlaceholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f87171"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="white" font-family="sans-serif" font-size="16"%3EError al cargar%3C/text%3E%3C/svg%3E'
    };

    this.observer = null;
    this.loadedImages = new Set();
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold
        }
      );
      this.observeImages();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }

    // Listen for new images added to DOM
    this.setupMutationObserver();
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target);
        this.observer.unobserve(entry.target);
      }
    });
  }

  async loadImage(element) {
    if (this.loadedImages.has(element)) return;

    try {
      // Handle picture elements
      if (element.tagName === 'PICTURE') {
        await this.loadPictureElement(element);
      } else if (element.tagName === 'IMG') {
        await this.loadImgElement(element);
      }

      this.loadedImages.add(element);
    } catch (error) {
      console.error('Error loading image:', error);
      this.handleImageError(element);
    }
  }

  async loadPictureElement(picture) {
    const img = picture.querySelector('img');
    const sources = picture.querySelectorAll('source');

    // Load source elements
    sources.forEach(source => {
      if (source.dataset.srcset) {
        source.srcset = source.dataset.srcset;
        delete source.dataset.srcset;
      }
    });

    // Load main image
    if (img && img.dataset.src) {
      await this.loadImgElement(img);
    }

    picture.classList.add('loaded');
  }

  async loadImgElement(img) {
    return new Promise((resolve, reject) => {
      const newImg = new Image();
      
      newImg.onload = () => {
        // Apply the new source
        if (img.dataset.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
        }

        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
          delete img.dataset.srcset;
        }

        // Add fade-in effect
        img.style.opacity = '0';
        img.style.transition = `opacity ${this.config.fadeInDuration}ms ease`;
        
        requestAnimationFrame(() => {
          img.style.opacity = '1';
        });

        img.classList.add('loaded');
        resolve();
      };

      newImg.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Start loading
      newImg.src = img.dataset.src || img.src;
    });
  }

  handleImageError(element) {
    const img = element.tagName === 'IMG' ? element : element.querySelector('img');
    if (img) {
      img.src = this.config.errorPlaceholder;
      img.classList.add('error');
    }
  }

  observeImages() {
    const images = document.querySelectorAll('.lazy-image, img[data-src]');
    images.forEach(img => {
      if (!this.loadedImages.has(img)) {
        this.observer.observe(img);
      }
    });
  }

  loadAllImages() {
    // Fallback for browsers without IntersectionObserver
    const images = document.querySelectorAll('.lazy-image, img[data-src]');
    images.forEach(img => this.loadImage(img));
  }

  setupMutationObserver() {
    if ('MutationObserver' in window) {
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const lazyImages = node.querySelectorAll ? 
                node.querySelectorAll('.lazy-image, img[data-src]') : [];
              
              lazyImages.forEach(img => {
                if (this.observer) {
                  this.observer.observe(img);
                } else {
                  this.loadImage(img);
                }
              });

              // Check if the node itself is a lazy image
              if (node.classList && (node.classList.contains('lazy-image') || node.dataset.src)) {
                if (this.observer) {
                  this.observer.observe(node);
                } else {
                  this.loadImage(node);
                }
              }
            }
          });
        });
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Public method to manually trigger loading of specific images
  loadImageNow(selector) {
    const elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : [selector];
    
    elements.forEach(element => {
      if (this.observer) {
        this.observer.unobserve(element);
      }
      this.loadImage(element);
    });
  }

  // Public method to add new images to observation
  observe(element) {
    if (this.observer && !this.loadedImages.has(element)) {
      this.observer.observe(element);
    }
  }

  // Cleanup method
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.loadedImages.clear();
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoader;
}