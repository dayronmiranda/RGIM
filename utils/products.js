// utils/products.js
import { createLazyImage, lazyLoader, validateProductsImages } from './lazyload.js';

// Renderizado de productos destacados para la home con validación de imágenes
export async function renderFeatured({ products, containerId = 'featured-products', getImagePath = (img) => img }) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  if (!products || products.length === 0) {
    console.warn('No featured products to display');
    container.innerHTML = '<div class="text-gray-500 text-center py-8">No hay productos destacados.</div>';
    return;
  }

  // Validar imágenes de productos antes de renderizar
  const validProducts = await validateProductsImages(products, 'image');

  if (validProducts.length === 0) {
    console.warn('No products with valid images found');
    container.innerHTML = '<div class="text-gray-500 text-center py-8">No hay productos con imágenes válidas para mostrar.</div>';
    return;
  }

  console.log('Rendering featured products with validation:', validProducts.map(p => ({ id: p.id, name: p.name, image: p.image })));

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      ${validProducts.map(p => {
        const imagePath = getImagePath(p.image);
        console.log(`Product ${p.id}: image="${p.image}" -> path="${imagePath}"`);
        return `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 group" onclick="window.location.hash = '#/store'">
            <div class="aspect-square w-full overflow-hidden bg-gray-100">
              ${createLazyImage({
                src: imagePath,
                alt: p.name,
                className: 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300',
                validate: true
              })}
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-lg mb-1 group-hover:text-indigo-600 transition-colors">${p.name}</h3>
              <p class="text-gray-500 text-sm mb-2 line-clamp-2">${p.description || ''}</p>
              <div class="flex items-center justify-between">
                <span class="font-bold text-indigo-600 text-xl">$${p.price.toFixed(2)}</span>
                <span class="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                  Ver más →
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <style>
      @media (max-width: 640px) {
        #featured-products > div {
          padding: 0 5%;
        }
        #featured-products .aspect-square {
          width: 100%;
        }
      }
    </style>
  `;

  // Inicializar lazy loading para las nuevas imágenes
  setTimeout(() => lazyLoader.observeAll(), 100);
}

export function renderProducts({ products = [], category = '', gridId = 'product-grid', getImagePath = (img) => img, extraButton = null, viewMode = 'grid' }) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  let list = products;
  if (category) list = list.filter(p => p.categoryId === category);
  if (list.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-8 text-slate-500">No hay productos disponibles</div>';
    return;
  }
  
  // Cambiar clases del contenedor según el modo de vista
  if (viewMode === 'list') {
    grid.className = 'space-y-4';
  } else {
    grid.className = 'grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8';
  }
  
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    const imagePath = p.image ? getImagePath(p.image) : '';
    const buttonHtml = extraButton ? extraButton(p) : '';
    
    if (viewMode === 'list') {
      // Vista de lista mejorada para móvil
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        card.className = 'product-list-item-mobile';
        card.innerHTML = `
          ${createLazyImage({
            src: imagePath,
            alt: p.name,
            className: 'product-image',
            placeholder: true
          })}
          <div class="product-info">
            <div>
              <h3 class="product-name">${p.name}</h3>
              <p class="text-xs text-gray-500 truncate">${p.short || ''}</p>
              <p class="product-price">${p.price.toFixed(2)}</p>
            </div>
            <div class="product-actions">
              <button class="add-to-cart-btn" data-addcart="${p.id}">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Agregar</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Vista de lista para desktop
        card.className = 'group relative product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow';
        card.innerHTML = `
          <div class="flex items-center p-4 gap-4">
            <div class="w-24 h-24 flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg">
              ${imagePath ? createLazyImage({
                src: imagePath,
                alt: p.name,
                className: 'w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300'
              }) : ''}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-gray-900">${p.name}</h3>
              <p class="mt-1 text-sm text-gray-500 truncate">${p.short || ''}</p>
              <div class="mt-2 flex items-center gap-4">
                <p class="text-xl font-bold text-indigo-600">${p.price.toFixed(2)}</p>
                <span class="text-xs text-gray-400">Envío gratis marítimo</span>
              </div>
            </div>
            <div class="flex-shrink-0 ml-3">
              ${buttonHtml}
            </div>
          </div>
        `;
      }
    } else {
      // Vista de grid mejorada con mejor proporción
      card.className = 'group relative product-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300';
      card.innerHTML = `
        <div class="aspect-square w-full overflow-hidden bg-gray-100 relative">
          ${imagePath ? createLazyImage({
            src: imagePath,
            alt: p.name,
            className: 'absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300'
          }) : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-5">
          <div class="space-y-2">
            <h3 class="text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">${p.name}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">${p.short || ''}</p>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-lg font-bold text-indigo-600">$${p.price.toFixed(2)}</span>
              <span class="text-xs text-green-600 font-medium">Envío gratis</span>
            </div>
            <div class="flex-shrink-0">
              ${buttonHtml}
            </div>
          </div>
        </div>
      `;
    }
    
    grid.appendChild(card);
  });
  
  // Inicializar lazy loading para las nuevas imágenes
  setTimeout(() => lazyLoader.observeAll(), 100);
}