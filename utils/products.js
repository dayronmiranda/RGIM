// utils/products.js

// Renderizado simple de productos en el grid
// Renderizado de productos destacados para la home
export function renderFeatured({ products, containerId = 'featured-products', getImagePath = (img) => img }) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!products || products.length === 0) {
    container.innerHTML = '<div class="text-gray-500 text-center py-8">No hay productos destacados.</div>';
    return;
  }
  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      ${products.map(p => `
        <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow duration-300 group" onclick="window.location.hash = '#/store'">
          <img src="${getImagePath(p.image)}" alt="${p.name}" class="w-32 h-32 object-contain mb-2 group-hover:scale-105 transition-transform duration-300" />
          <h3 class="font-semibold text-lg text-center mb-1 group-hover:text-indigo-600 transition-colors">${p.name}</h3>
          <p class="text-gray-500 text-sm text-center mb-2">${p.description || ''}</p>
          <span class="font-bold text-indigo-600 text-lg mb-2">$${p.price.toFixed(2)}</span>
          <div class="mt-2 text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
            Haz clic para ver en la tienda
          </div>
        </div>
      `).join('')}
    </div>
  `;
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
      // Vista de lista
      card.className = 'group relative product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow';
      card.innerHTML = `
        <div class="flex items-center p-4 gap-4">
          <div class="w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg">
            ${imagePath ? `<img src="${imagePath}" alt="${p.name}" class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" loading="lazy">` : ''}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium text-gray-900 truncate">${p.name}</h3>
            <p class="mt-1 text-sm text-gray-500 line-clamp-2">${p.short || ''}</p>
            <div class="mt-2 flex items-center justify-between">
              <p class="text-lg font-semibold text-gray-900">$${p.price.toFixed(2)}</p>
            </div>
          </div>
          <div class="flex-shrink-0">
            ${buttonHtml}
          </div>
        </div>
      `;
    } else {
      // Vista de grid (original)
      card.className = 'group relative product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow';
      card.innerHTML = `
        <div class="aspect-square w-full overflow-hidden bg-gray-100 relative">
          ${imagePath ? `<img src="${imagePath}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" loading="lazy">` : ''}
        </div>
        <div class="p-4">
          <h3 class="text-sm font-medium text-gray-900 truncate">${p.name}</h3>
          <p class="mt-1 text-xs text-gray-500 line-clamp-2">${p.short || ''}</p>
          <div class="mt-3 flex items-center justify-between">
            <p class="text-sm font-semibold text-gray-900">$${p.price.toFixed(2)}</p>
          </div>
          ${buttonHtml}
        </div>
      `;
    }
    
    grid.appendChild(card);
  });
}