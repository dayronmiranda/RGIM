/**
 * Cache Manager for RGIM
 * Optimizes product loading and reduces file size for browser
 */
class CacheManager {
  constructor(config = {}) {
    this.config = {
      cacheVersion: config.cacheVersion || '1.0',
      maxAge: config.maxAge || 24 * 60 * 60 * 1000, // 24 hours
      compressionEnabled: config.compressionEnabled !== false,
      lazyLoadEnabled: config.lazyLoadEnabled !== false,
      chunkSize: config.chunkSize || 50, // Products per chunk
      ...config
    };
    
    this.cache = new Map();
    this.loadedChunks = new Set();
    this.isLoading = false;
    this.observers = new Set();
  }

  /**
   * Initialize cache manager
   */
  async init() {
    try {
      await this.loadCacheIndex();
      this.setupStorageCleanup();
      console.log('Cache Manager initialized');
    } catch (error) {
      console.warn('Cache Manager initialization failed:', error);
    }
  }

  /**
   * Load cache index from localStorage
   */
  async loadCacheIndex() {
    try {
      const cacheIndex = localStorage.getItem('rgim.cache.index');
      if (cacheIndex) {
        const index = JSON.parse(cacheIndex);
        if (index.version === this.config.cacheVersion) {
          this.cacheIndex = index;
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load cache index:', error);
    }
    
    // Create new cache index
    this.cacheIndex = {
      version: this.config.cacheVersion,
      timestamp: Date.now(),
      chunks: {},
      metadata: {}
    };
  }

  /**
   * Save cache index to localStorage
   */
  saveCacheIndex() {
    try {
      localStorage.setItem('rgim.cache.index', JSON.stringify(this.cacheIndex));
    } catch (error) {
      console.warn('Failed to save cache index:', error);
    }
  }

  /**
   * Load products with caching and chunking
   */
  async loadProducts() {
    if (this.isLoading) {
      return this.waitForLoad();
    }

    this.isLoading = true;
    
    try {
      // Try to load from cache first
      const cachedProducts = await this.getCachedProducts();
      if (cachedProducts && cachedProducts.length > 0) {
        this.notifyObservers('products', cachedProducts);
        this.isLoading = false;
        return cachedProducts;
      }

      // Load from network
      const products = await this.fetchProductsFromNetwork();
      
      // Cache the products
      await this.cacheProducts(products);
      
      this.notifyObservers('products', products);
      this.isLoading = false;
      return products;
      
    } catch (error) {
      this.isLoading = false;
      console.error('Failed to load products:', error);
      throw error;
    }
  }

  /**
   * Get cached products
   */
  async getCachedProducts() {
    try {
      const cacheKey = 'rgim.products.all';
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - data.timestamp > this.config.maxAge) {
        localStorage.removeItem(cacheKey);
        return null;
      }
      
      return this.config.compressionEnabled ? 
        this.decompressData(data.products) : 
        data.products;
        
    } catch (error) {
      console.warn('Failed to get cached products:', error);
      return null;
    }
  }

  /**
   * Fetch products from network
   */
  async fetchProductsFromNetwork() {
    const response = await fetch('./products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Cache products with compression
   */
  async cacheProducts(products) {
    try {
      const cacheKey = 'rgim.products.all';
      const data = {
        timestamp: Date.now(),
        version: this.config.cacheVersion,
        products: this.config.compressionEnabled ? 
          this.compressData(products) : 
          products
      };
      
      localStorage.setItem(cacheKey, JSON.stringify(data));
      
      // Update cache index
      this.cacheIndex.metadata.productsCount = products.length;
      this.cacheIndex.metadata.lastUpdate = Date.now();
      this.saveCacheIndex();
      
    } catch (error) {
      console.warn('Failed to cache products:', error);
    }
  }

  /**
   * Load product chunk (for lazy loading)
   */
  async loadProductChunk(chunkIndex) {
    if (this.loadedChunks.has(chunkIndex)) {
      return this.getChunkFromCache(chunkIndex);
    }

    try {
      const products = await this.loadProducts();
      const startIndex = chunkIndex * this.config.chunkSize;
      const endIndex = startIndex + this.config.chunkSize;
      const chunk = products.slice(startIndex, endIndex);
      
      this.loadedChunks.add(chunkIndex);
      return chunk;
      
    } catch (error) {
      console.error('Failed to load product chunk:', error);
      return [];
    }
  }

  /**
   * Get chunk from cache
   */
  getChunkFromCache(chunkIndex) {
    const cacheKey = `rgim.chunk.${chunkIndex}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        return data.products || [];
      }
    } catch (error) {
      console.warn('Failed to get chunk from cache:', error);
    }
    return [];
  }

  /**
   * Compress data using simple string compression
   */
  compressData(data) {
    try {
      const jsonString = JSON.stringify(data);
      
      // Simple compression: remove unnecessary whitespace and common patterns
      const compressed = jsonString
        .replace(/\s+/g, ' ')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/{\s*/g, '{')
        .replace(/\s*}/g, '}')
        .replace(/\[\s*/g, '[')
        .replace(/\s*]/g, ']');
      
      return {
        compressed: true,
        data: compressed,
        originalSize: jsonString.length,
        compressedSize: compressed.length
      };
    } catch (error) {
      console.warn('Compression failed:', error);
      return data;
    }
  }

  /**
   * Decompress data
   */
  decompressData(compressedData) {
    try {
      if (compressedData.compressed) {
        return JSON.parse(compressedData.data);
      }
      return compressedData;
    } catch (error) {
      console.warn('Decompression failed:', error);
      return compressedData;
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    try {
      // Clear product cache
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('rgim.products.') || key.startsWith('rgim.chunk.')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear cache index
      localStorage.removeItem('rgim.cache.index');
      
      // Reset internal state
      this.cache.clear();
      this.loadedChunks.clear();
      this.cacheIndex = null;
      
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Setup automatic cache cleanup
   */
  setupStorageCleanup() {
    // Clean up expired cache entries
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Clean up expired cache entries
   */
  cleanupExpiredCache() {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      
      keys.forEach(key => {
        if (key.startsWith('rgim.')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data.timestamp && (now - data.timestamp > this.config.maxAge)) {
              localStorage.removeItem(key);
            }
          } catch (error) {
            // Invalid JSON, remove it
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Cache cleanup failed:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    try {
      const keys = Object.keys(localStorage);
      const rgimKeys = keys.filter(key => key.startsWith('rgim.'));
      
      let totalSize = 0;
      rgimKeys.forEach(key => {
        totalSize += localStorage.getItem(key).length;
      });
      
      return {
        entries: rgimKeys.length,
        totalSize: totalSize,
        totalSizeKB: Math.round(totalSize / 1024),
        maxAge: this.config.maxAge,
        version: this.config.cacheVersion,
        loadedChunks: this.loadedChunks.size
      };
    } catch (error) {
      console.warn('Failed to get cache stats:', error);
      return null;
    }
  }

  /**
   * Add observer for cache events
   */
  addObserver(callback) {
    this.observers.add(callback);
  }

  /**
   * Remove observer
   */
  removeObserver(callback) {
    this.observers.delete(callback);
  }

  /**
   * Notify observers
   */
  notifyObservers(event, data) {
    this.observers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.warn('Observer callback failed:', error);
      }
    });
  }

  /**
   * Wait for current load to complete
   */
  waitForLoad() {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!this.isLoading) {
          resolve();
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  /**
   * Preload next chunk (for better UX)
   */
  async preloadNextChunk(currentChunk) {
    const nextChunk = currentChunk + 1;
    if (!this.loadedChunks.has(nextChunk)) {
      // Preload in background
      setTimeout(() => {
        this.loadProductChunk(nextChunk);
      }, 1000);
    }
  }

  /**
   * Force refresh cache
   */
  async forceRefresh() {
    this.clearCache();
    return await this.loadProducts();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CacheManager;
}