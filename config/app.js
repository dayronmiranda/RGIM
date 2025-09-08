// config/app.js
// Configuración general de la aplicación

export const APP_CONFIG = {
  // Configuración de checkout
  checkout: {
    // Si es true, redirige directamente a WhatsApp
    // Si es false, solo guarda en admin y no redirige
    redirectToWhatsApp: false,
    
    // Número de WhatsApp para las solicitudes
    whatsappNumber: '13058462224',
    
    // Mensaje personalizado para WhatsApp
    whatsappMessageTemplate: '¡Hola! Soy {name} y me gustaría hacer el siguiente pedido:'
  },
  
  // Configuración de imágenes
  images: {
    // Imagen por defecto para lazy loading
    defaultImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Cg transform="translate(200,200)"%3E%3Cpath d="M-60,-60 L60,-60 L60,60 L-60,60 Z" fill="%23e5e7eb" stroke="%23d1d5db" stroke-width="2"/%3E%3Ccircle cx="-20" cy="-20" r="15" fill="%23d1d5db"/%3E%3Cpath d="M-40,20 L-20,0 L0,20 L20,0 L40,20 L40,40 L-40,40 Z" fill="%23d1d5db"/%3E%3C/g%3E%3Ctext x="50%25" y="85%25" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" font-size="14" fill="%239ca3af"%3EImagen no disponible%3C/text%3E%3C/svg%3E',
    
    // Configuración de cache
    cache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
      version: '1.0.0' // Cambiar para invalidar cache
    },
    
    // Configuración de lazy loading
    lazyLoading: {
      rootMargin: '50px',
      threshold: 0.01,
      fadeInDuration: 300
    }
  },
  
  // Configuración de la aplicación
  app: {
    name: 'RGIM Store',
    version: '1.0.0',
    description: 'Tienda online de RGIM USA & Panamá',
    
    // URLs y contacto
    contact: {
      email: 'info@rgimusa.com',
      phone: '+1 305 846 2224',
      whatsapp: '13058462224',
      address: 'Miami, FL & Ciudad de Panamá'
    },
    
    // Configuración de páginas
    pages: {
      // Mostrar botón flotante en home
      showFloatingStoreButton: true,
      
      // Integrar FAQ y About en home
      integrateContentInHome: true
    }
  },
  
  // Configuración de admin
  admin: {
    // Credenciales (en producción usar autenticación segura)
    credentials: {
      username: 'admin',
      password: 'admin123'
    },
    
    // Configuración de órdenes
    orders: {
      autoRefresh: false,
      refreshInterval: 30000, // 30 segundos
      exportFormats: ['csv', 'json']
    }
  },
  
  // Configuración de performance
  performance: {
    // Preload de imágenes críticas
    preloadCriticalImages: true,
    
    // Service Worker para cache
    serviceWorker: {
      enabled: true,
      cacheName: 'rgim-store-v1',
      cacheStrategy: 'cacheFirst' // 'cacheFirst' | 'networkFirst'
    }
  }
};

// Función para obtener configuración específica
export function getConfig(path) {
  return path.split('.').reduce((obj, key) => obj?.[key], APP_CONFIG);
}

// Función para actualizar configuración
export function updateConfig(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((obj, key) => obj[key], APP_CONFIG);
  if (target) {
    target[lastKey] = value;
  }
}

export default APP_CONFIG;