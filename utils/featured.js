// utils/featured.js
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
        <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <img src="${getImagePath(p.image)}" alt="${p.name}" class="w-32 h-32 object-contain mb-2" />
          <h3 class="font-semibold text-lg text-center mb-1">${p.name}</h3>
          <p class="text-gray-500 text-sm text-center mb-2">${p.description || ''}</p>
          <span class="font-bold text-indigo-600 text-lg mb-2">$${p.price.toFixed(2)}</span>
        </div>
      `).join('')}
    </div>
  `;
}
