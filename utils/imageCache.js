// utils/imageCache.js
// Sistema de cache para imágenes

import { getConfig } from '../config/app.js';

/**
 * Clase para manejar el cache de imágenes
 */
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.config = getConfig('images.cache');
    this.storageKey = 'rgim-image-cache';
    this.init();
  }

  /**
   * Inicializa el sistema de cache
   */
  init() {
    if (!this.config.enabled) return;
    
    // Cargar cache desde localStorage
    this.loadFromStorage();
    
    // Limpiar cache expirado
    this.cleanExpiredCache();
    
    // Configurar limpieza periódica
    setInterval(() => {
      this.cleanExpiredCache();
    }, 60000); // Cada minuto
  }

  /**
   * Carga el cache desde localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Verificar versión del cache
        if (data.version === this.config.version) {
          Object.entries(data.cache).forEach(([url, item]) => {
            this.cache.set(url, item);
          });
        } else {
          // Limpiar cache si la versión cambió
          localStorage.removeItem(this.storageKey);
        }
      }
    } catch (error) {
      console.warn('Error loading image cache:', error);
    }
  }

  /**
   * Guarda el cache en localStorage
   */
  saveToStorage() {
    try {
      const data = {
        version: this.config.version,
        cache: Object.fromEntries(this.cache)
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Error saving image cache:', error);
    }
  }

  /**
   * Limpia el cache expirado
   */
  cleanExpiredCache() {
    const now = Date.now();
    let cleaned = false;
    
    for (const [url, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(url);
        cleaned = true;
      }
    }
    
    if (cleaned) {
      this.saveToStorage();
    }
  }

  /**
   * Obtiene una imagen del cache
   */
  get(url) {
    if (!this.config.enabled) return null;
    
    const item = this.cache.get(url);
    if (!item) return null;
    
    // Verificar si no ha expirado
    if (Date.now() > item.expires) {
      this.cache.delete(url);
      return null;
    }
    
    return item.blob;
  }

  /**
   * Guarda una imagen en el cache
   */
  set(url, blob) {
    if (!this.config.enabled) return;
    
    const expires = Date.now() + this.config.maxAge;
    this.cache.set(url, { blob, expires });
    this.saveToStorage();
  }

  /**
   * Precarga una imagen y la guarda en cache
   */
  async preload(url) {
    if (!this.config.enabled) return null;
    
    // Verificar si ya está en cache
    const cached = this.get(url);
    if (cached) return cached;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const blob = await response.blob();
      this.set(url, blob);
      return blob;
    } catch (error) {
      console.warn(`Error preloading image ${url}:`, error);
      return null;
    }
  }

  /**
   * Carga una imagen con cache
   */
  async loadImage(url) {
    if (!this.config.enabled) {
      // Sin cache, cargar directamente
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }
    
    // Intentar obtener del cache
    const cached = this.get(url);
    if (cached) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(cached);
      });
    }
    
    // Cargar y cachear
    try {
      const blob = await this.preload(url);
      if (blob) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = URL.createObjectURL(blob);
        });
      }
    } catch (error) {
      console.warn(`Error loading cached image ${url}:`, error);
    }
    
    // Fallback: cargar sin cache
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Limpia todo el cache
   */
  clear() {
    this.cache.clear();
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats() {
    return {
      size: this.cache.size,
      enabled: this.config.enabled,
      version: this.config.version,
      maxAge: this.config.maxAge
    };
  }

  /**
   * Precarga múltiples imágenes
   */
  async preloadImages(urls) {
    const promises = urls.map(url => this.preload(url));
    return Promise.allSettled(promises);
  }
}

// Crear instancia global
const imageCache = new ImageCache();

// Exportar para uso en otros módulos
export { imageCache };
export default imageCache;