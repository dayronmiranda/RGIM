/*
  Product rendering functionality module
  Extracted from app.js lines 678-779
*/

import { openModal, closeModal } from '../ui/modal.js'

export function renderProducts(state, els, fmtCurrency, getImagePath, addToCartCallback) {
  const grid = els.productGrid
  if (!grid) {
    console.error('Product grid element not found')
    return
  }
  
  console.log('Rendering products:', state.products.length, 'products found')
  grid.innerHTML = ''
  
  if (state.products.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-8 text-slate-500">No hay productos disponibles</div>'
    return
  }
  
  let list = state.products
  if (state.activeCategory) { 
    list = list.filter(p => p.categoryId === state.activeCategory)
    console.log('Filtered by category:', state.activeCategory, 'Found:', list.length)
  }

  if (list.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center py-8 text-slate-500">No hay productos en esta categoría</div>'
    return
  }

  list.forEach(p => {
    const card = document.createElement('div')
    card.className = 'group relative product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
    
    // FIXED: Proper image handling with fallback
    const imagePath = p.image ? getImagePath(p.image) : null
    console.log(`Product: ${p.name}, Image: ${p.image}, Path: ${imagePath}`)
    
    card.innerHTML = `
      <div class="aspect-square w-full overflow-hidden bg-gray-100 relative">
        ${imagePath ? 
          `<img src="${imagePath}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" loading="lazy" onload="console.log('✅ Image loaded: ${imagePath}')" onerror="console.log('❌ Error loading image: ${imagePath}'); this.style.display='none';">` : 
          `<div class="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>`
        }
      </div>
      <div class="p-4">
        <h3 class="text-sm font-medium text-gray-900 truncate">
          <a href="#" class="product-link hover:text-indigo-600">
            ${p.name}
          </a>
        </h3>
        <p class="mt-1 text-xs text-gray-500 line-clamp-2">${p.short || ''}</p>
        <div class="mt-3 flex items-center justify-between">
          <p class="text-sm font-semibold text-gray-900">${fmtCurrency(p.price)}</p>
        </div>
        <div class="mt-3 flex gap-2">
          <button class="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" data-act="details">
            Detalles
          </button>
          <button class="flex-1 bg-indigo-600 py-2 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" data-act="add">
            Añadir
          </button>
        </div>
      </div>`
    
    const addBtn = card.querySelector('[data-act="add"]')
    const detailsBtn = card.querySelector('[data-act="details"]')
    const productLink = card.querySelector('.product-link')
    
    if (addBtn) addBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); addToCartCallback(p.id) }
    if (detailsBtn) detailsBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openProductModal(p, els, fmtCurrency, getImagePath, addToCartCallback) }
    if (productLink) productLink.onclick = (e) => { e.preventDefault(); openProductModal(p, els, fmtCurrency, getImagePath, addToCartCallback) }
    
    grid.appendChild(card)
  })
  
  console.log('Products rendered successfully:', list.length, 'cards created')
}

export function openProductModal(p, els, fmtCurrency, getImagePath, addToCartCallback) {
  const html = `
    <div class="p-5">
      <div class="flex items-start gap-4">
        <div class="w-28 h-28 bg-slate-100 rounded overflow-hidden">
          ${p.image ? `<img src="${getImagePath(p.image)}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'">` : ''}
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold">${p.name}</h3>
          <div class="text-slate-600 mt-1">${p.description || p.short || ''}</div>
          <div class="mt-3 font-semibold">${fmtCurrency(p.price)}</div>
          <div class="mt-4 flex gap-2">
            <button data-close class="px-3 py-2 border rounded">Cerrar</button>
            <button data-add class="px-3 py-2 bg-brand-600 text-white rounded">Añadir al carrito</button>
          </div>
        </div>
      </div>
    </div>`
  
  const overlay = openModal(html, els)
  overlay.querySelector('[data-close]').onclick = () => closeModal(overlay)
  overlay.querySelector('[data-add]').onclick = () => { 
    addToCartCallback(p.id)
    closeModal(overlay) 
  }
}