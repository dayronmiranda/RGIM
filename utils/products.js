// utils/products.js
// Renderizado simple de productos en el grid

export function renderProducts({ products = [], category = '', gridId = 'product-grid', getImagePath = (img) => img }) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  let list = products;
  if (category) list = list.filter(p => p.categoryId === category);
  if (list.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-8 text-slate-500">No hay productos disponibles</div>';
    return;
  }
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'group relative product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow';
    const imagePath = p.image ? getImagePath(p.image) : '';
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
      </div>
    `;
    grid.appendChild(card);
  });
}
