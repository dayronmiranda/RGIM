// utils/lazyload.js
// Sistema de lazy loading para imágenes con Intersection Observer, cache y validación

import { imageCache } from './imageCache.js';
import { getConfig } from '../config/app.js';
import { imageValidator } from './imageValidator.js';

/**
 * Clase para manejar lazy loading de imágenes
 */
class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  /**
   * Inicializa el Intersection Observer
   */
  init() {
    // Verificar si el navegador soporta Intersection Observer
    if ('IntersectionObserver' in window) {
      const options = {
        root: null,
        rootMargin: '50px', // Cargar imágenes 50px antes de que sean visibles
        threshold: 0.01
      };

      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, options);
    } else {
      // Fallback para navegadores antiguos
      this.loadAllImages();
    }
  }

  /**
   * Carga una imagen lazy con cache y validación
   * @param {HTMLElement} img - Elemento de imagen a cargar
   */
  async loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (!src) return;

    try {
      // Primero validar que la imagen existe
      const imageExists = await imageValidator.checkImage(src);

      if (!imageExists) {
        console.warn('Image does not exist:', src);
        throw new Error('Image not found');
      }

      // Usar el sistema de cache para cargar la imagen
      const loadedImg = await imageCache.loadImage(src);

      // Añadir clase de fade-in
      img.classList.add('lazy-loaded');

      // Establecer la fuente real
      if (src) img.src = loadedImg.src;
      if (srcset) img.srcset = srcset;

      // Remover el placeholder blur si existe
      img.classList.remove('lazy-blur');

      // Limpiar data attributes
      delete img.dataset.src;
      delete img.dataset.srcset;

    } catch (error) {
      console.warn('Error loading image:', error);

      // Usar la herramienta de validación para obtener imagen de fallback
      const fallbackSrc = await imageValidator.getValidImageSrc(src);

      img.src = fallbackSrc;
      img.classList.add('lazy-error');
      img.classList.remove('lazy-blur');

      // Limpiar data attributes
      delete img.dataset.src;
      delete img.dataset.srcset;
    }
  }

  /**
   * Observa una imagen para lazy loading
   * @param {HTMLElement} img - Elemento de imagen a observar
   */
  observe(img) {
    if (this.imageObserver) {
      this.imageObserver.observe(img);
    } else {
      // Si no hay soporte, cargar inmediatamente
      this.loadImage(img);
    }
  }

  /**
   * Observa todas las imágenes con clase lazy
   */
  observeAll() {
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => this.observe(img));
  }

  /**
   * Carga todas las imágenes inmediatamente (fallback)
   */
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => this.loadImage(img));
  }

  /**
   * Desconecta el observer
   */
  disconnect() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
  }
}

// Crear instancia global
const lazyLoader = new LazyImageLoader();

/**
 * Función helper para crear elementos de imagen lazy con validación
 * @param {Object} options - Opciones para la imagen
 * @returns {string} HTML string de la imagen
 */
export function createLazyImage(options) {
  const {
    src,
    alt = '',
    className = '',
    width = '',
    height = '',
    placeholder = true,
    validate = true // Nueva opción para habilitar/deshabilitar validación
  } = options;

  // Usar placeholder desde config o uno básico
  const placeholderSrc = placeholder
    ? getConfig('images.defaultImage') || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3C/svg%3E'
    : '';

  return `
    <img
      class="lazy ${className} ${placeholder ? 'lazy-blur' : ''} ${validate ? 'validate-image' : ''}"
      src="${placeholderSrc}"
      data-src="${src}"
      alt="${alt}"
      ${width ? `width="${width}"` : ''}
      ${height ? `height="${height}"` : ''}
      loading="lazy"
    />
  `;
}

/**
 * Inicializa lazy loading para nuevas imágenes añadidas dinámicamente
 */
export function initLazyLoading() {
  // Observar todas las imágenes lazy actuales
  lazyLoader.observeAll();
  
  // Observar cambios en el DOM para nuevas imágenes
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Buscar imágenes lazy en el nuevo nodo
          const lazyImages = node.querySelectorAll ? node.querySelectorAll('img.lazy') : [];
          lazyImages.forEach(img => lazyLoader.observe(img));
          
          // Si el nodo mismo es una imagen lazy
          if (node.tagName === 'IMG' && node.classList && node.classList.contains('lazy')) {
            lazyLoader.observe(node);
          }
        }
      });
    });
  });

  // Observar cambios en todo el documento
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Exportar la instancia para uso directo si es necesario
export { lazyLoader };

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}

/**
 * Función para validar productos antes de renderizar
 * Filtra productos que no tienen imágenes válidas
 * @param {Array} products - Array de productos
 * @param {string} imageKey - Clave del objeto producto que contiene la ruta de imagen
 * @returns {Promise<Array>} - Array de productos con imágenes válidas
 */
export async function validateProductsImages(products, imageKey = 'image') {
  if (!Array.isArray(products)) {
    console.warn('validateProductsImages: products must be an array');
    return [];
  }

  const validProducts = [];

  for (const product of products) {
    const imagePath = product[imageKey] || product.img;

    if (!imagePath) {
      console.warn('Product without image:', product);
      continue;
    }

    try {
      const imageExists = await imageValidator.checkImage(imagePath);
      if (imageExists) {
        validProducts.push(product);
      } else {
        console.warn('Product image not found, skipping product:', product.name || product.id, imagePath);
      }
    } catch (error) {
      console.error('Error validating product image:', error);
      // En caso de error, incluir el producto pero marcarlo
      product._imageError = true;
      validProducts.push(product);
    }
  }

  return validProducts;
}

/**
 * Función para renderizar productos con validación de imágenes
 * @param {Array} products - Array de productos
 * @param {Function} renderFunction - Función que renderiza un producto individual
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<string>} - HTML de productos validados
 */
export async function renderProductsWithValidation(products, renderFunction, options = {}) {
  const {
    imageKey = 'image',
    skipValidation = false
  } = options;

  let productsToRender = products;

  if (!skipValidation) {
    productsToRender = await validateProductsImages(products, imageKey);
  }

  // Renderizar productos usando la función proporcionada
  const renderedProducts = productsToRender.map(product => renderFunction(product)).join('');

  return renderedProducts;
}

// Estilos CSS para lazy loading
const style = document.createElement('style');
style.textContent = `
  /* Lazy loading styles */
  img.lazy {
    transition: opacity 0.3s ease-in-out, filter 0.3s ease-in-out;
  }
  
  img.lazy-blur {
    filter: blur(5px);
    opacity: 0.8;
  }
  
  img.lazy-loaded {
    opacity: 1;
    filter: none;
  }
  
  img.lazy-error {
    opacity: 0.5;
  }
  
  /* Skeleton loader para imágenes */
  img.lazy:not(.lazy-loaded) {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
document.head.appendChild(style);