// store.js

import { loadAllData } from '../utils/dataLoader.js';
import { renderProducts } from '../utils/products.js';
import { aiProductSearch } from '../utils/aiSearch.js';
import { addToCart, getCartItemCount, getCart, getCartTotal, removeFromCart, updateProductQuantity } from '../utils/cart.js';
import { renderCartSidebar } from '../utils/cartUI.js';
import { renderCheckout } from '../utils/checkoutUI.js';
import { cartFeedback } from '../utils/feedback.js';

// Función para cargar categorías desde el archivo JSON
async function loadCategories() {
  try {
    const response = await fetch('assets/config/categories.json');
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('Error loading categories:', error);
    // Fallback a categorías por defecto
    return [
      { id: 'pantry', name: 'Despensa y Abarrotes' },
      { id: 'snacks', name: 'Botanas y Galletas' },
      { id: 'candy', name: 'Dulces y Chocolates' },
      { id: 'cereal', name: 'Cereales' },
      { id: 'beverages', name: 'Bebidas' },
      { id: 'dairy', name: 'Lácteos' },
      { id: 'tobacco', name: 'Tabaco' }
    ];
  }
}

// Función para obtener el icono SVG basado en el ID de categoría
function getCategoryIcon(categoryId) {
  const icons = {
    pantry: `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>`,
    snacks: `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C2.845 8.51 2 9.473 2 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C11.155 8.51 12 9.473 12 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C2.845 8.51 2 9.473 2 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C11.155 8.51 12 9.473 12 10.608v2.513M12 10.875v-2.513c0-.98-.797-1.773-1.75-1.75-.966 0-1.75.784-1.75 1.75v2.513m0-2.513c0-.98.797-1.773 1.75-1.75.966 0 1.75.784 1.75 1.75v2.513M12 10.875v-2.513c0-.98-.797-1.773-1.75-1.75-.966 0-1.75.784-1.75 1.75v2.513m0-2.513c0-.98.797-1.773 1.75-1.75.966 0 1.75.784 1.75 1.75v2.513M8.25 21h7.5m-7.5 0v-3m7.5 0v3m0-3c0-1.105-.895-2-2-2h-3.5c-1.105 0-2 .895-2 2m0 3h7.5" />
    </svg>`,
    candy: `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 2.485 2.099 4.5 4.688 4.5 1.935 0 3.597-1.126 4.312-2.733.715 1.607 2.377 2.733 4.313 2.733 2.588 0 4.688-2.015 4.688-4.5zM7.5 12.75c0 1.243.897 2.25 2 2.25s2-.897 2-2.25m-4 0c0-1.243.897-2.25 2-2.25s2 .897 2 2.25m-4 0v6m4-6v6m0 0c0 1.243-.897 2.25-2 2.25s-2-.897-2-2.25" />
    </svg>`,
    cereal: `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>`,
    beverages: `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
    </svg>`,
    dairy: `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5h14l-4.091-4.191A2.25 2.25 0 0114.25 8.818V3.104a.75.75 0 011.5 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5h14l-4.091-4.191A2.25 2.25 0 0114.25 8.818V3.104a.75.75 0 011.5 0z" />
    </svg>`,
    tobacco: `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>`
  };

  return icons[categoryId] || `<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 002.25 5.25v6.75A2.25 2.25 0 004.5 14.25h.75l.75 2.25 2.25-2.25h.75A2.25 2.25 0 0012 12V5.25A2.25 2.25 0 009.75 3H9.568z" />
  </svg>`;
}

export async function renderStore(container) {
  // Cargar categorías dinámicamente
  const categories = await loadCategories();

  container.innerHTML = `

    <!-- Main Store Section -->
    <div class="bg-gray-50 min-h-screen">
      <div class="mx-auto w-[95%] max-w-none px-2 py-16 sm:px-4 lg:px-6">
        
         
        <!-- Mobile Cart (Collapsible) - Only visible on mobile -->
        <div id="mobile-cart-container" class="lg:hidden mobile-cart-collapsed">
          <button id="mobile-cart-toggle" class="cart-toggle-btn">
            <div class="flex items-center gap-2">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
              </svg>
              <span>Carrito (<span id="mobile-cart-count">0</span>)</span>
            </div>
            <div class="flex items-center gap-2">
              <span id="mobile-cart-total" class="font-bold">$0.00</span>
              <svg id="mobile-cart-arrow" class="h-5 w-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </button>
          
          <div id="mobile-cart-content" class="cart-content-mobile">
            <div class="p-4">
              <div id="mobile-cart-items" class="space-y-3 max-h-64 overflow-y-auto mb-4">
                <!-- Cart items will be rendered here -->
              </div>
              
              <div class="border-t pt-4">
                <button id="mobile-checkout-btn" class="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 shadow-sm">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Continuar
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Search Section - Fixed on mobile -->
        <div class="lg:hidden mobile-search-fixed mb-4">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
              </svg>
            </div>
            <input id="ai-search-mobile" type="text" placeholder="Buscar productos..." class="block w-full rounded-md border-0 bg-gray-50 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm" />
          </div>
        </div>
        
        <!-- Desktop Search Section -->
        <div class="hidden lg:block mb-12">
          <div class="mx-auto max-w-2xl">
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
              </svg>
            </div>
            <input id="ai-search" type="text" placeholder="Buscar productos con IA..." class="block w-full rounded-md border-0 bg-white py-4 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-lg" />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <div class="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                IA
              </div>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500 text-center">
            Utiliza nuestra búsqueda inteligente para encontrar productos específicos
          </p>
        </div>
        </div>

        <!-- Products and Cart Layout -->
        <div class="lg:grid lg:grid-cols-12 lg:gap-x-4 mt-6">

           <!-- Filters Sidebar - Desktop -->
           <aside class="hidden lg:block lg:col-span-2">
             <div class="sticky top-24">
               <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                 <!-- Filters Header -->
                 <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                   <h3 class="text-lg font-semibold text-gray-900">Filtros</h3>
                 </div>

                 <!-- Filters Content -->
                 <div class="p-4 space-y-8">
                   <!-- Categories Filter -->
                   <div class="border-b border-gray-100 pb-6">
                     <div class="flex items-center gap-2 mb-4">
                       <svg class="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 002.25 5.25v6.75A2.25 2.25 0 004.5 14.25h.75l.75 2.25 2.25-2.25h.75A2.25 2.25 0 0012 12V5.25A2.25 2.25 0 009.75 3H9.568z" />
                       </svg>
                       <h4 class="text-base font-semibold text-gray-900">Categorías</h4>
                     </div>
                     <div class="space-y-3">
                       <label class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                         <input type="checkbox" id="filter-all" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" value="all">
                         <span class="ml-3 text-sm font-medium text-gray-700">Todos los productos</span>
                       </label>
                       ${categories.map(category => `
                         <label class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                           <input type="checkbox" id="filter-${category.id}" class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" value="${category.id}">
                           ${getCategoryIcon(category.id)}
                           <span class="ml-2 text-sm text-gray-700">${category.name}</span>
                         </label>
                       `).join('')}
                     </div>
                   </div>

                   <!-- Price Range Filter -->
                   <div class="border-b border-gray-100 pb-6">
                     <div class="flex items-center gap-2 mb-4">
                       <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6m-6 3h6" />
                       </svg>
                       <h4 class="text-base font-semibold text-gray-900">Rango de Precio</h4>
                     </div>
                     <div class="space-y-3">
                       <label class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                         <input type="radio" name="price" id="price-all" class="text-indigo-600 focus:ring-indigo-500 h-4 w-4" value="all" checked>
                         <span class="ml-3 text-sm font-medium text-gray-700">Todos los precios</span>
                       </label>
                       <label class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                         <input type="radio" name="price" id="price-0-50" class="text-indigo-600 focus:ring-indigo-500 h-4 w-4" value="0-50">
                         <span class="ml-3 text-sm text-gray-700">$0 - $50</span>
                         <span class="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Económico</span>
                       </label>
                       <label class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                         <input type="radio" name="price" id="price-50-100" class="text-indigo-600 focus:ring-indigo-500 h-4 w-4" value="50-100">
                         <span class="ml-3 text-sm text-gray-700">$50 - $100</span>
                         <span class="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Medio</span>
                       </label>
                       <label class="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                         <input type="radio" name="price" id="price-100+" class="text-indigo-600 focus:ring-indigo-500 h-4 w-4" value="100+">
                         <span class="ml-3 text-sm text-gray-700">$100+</span>
                         <span class="ml-auto text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Premium</span>
                       </label>
                     </div>
                   </div>

                   <!-- Clear Filters Button -->
                   <div class="pt-2">
                     <button id="clear-filters" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                       <div class="flex items-center justify-center gap-2">
                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                         </svg>
                         Limpiar Filtros
                       </div>
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </aside>

           <!-- Products Grid -->
           <div class="lg:col-span-7">
            <div class="mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-lg font-medium text-gray-900">Productos</h2>
                  <p class="mt-1 text-sm text-gray-500" id="product-count">Cargando productos...</p>
                </div>
                <div class="flex items-center gap-2">
                  <button id="grid-view" class="p-2 text-gray-400 hover:text-gray-500 border rounded-md bg-white">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </button>
                  <button id="list-view" class="p-2 text-gray-400 hover:text-gray-500 border rounded-md bg-white">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Loading State -->
            <div id="loading-state" class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
              <div class="animate-pulse">
                <div class="aspect-square w-full bg-gray-200 rounded-lg"></div>
                <div class="mt-4 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div class="animate-pulse">
                <div class="aspect-square w-full bg-gray-200 rounded-lg"></div>
                <div class="mt-4 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div class="animate-pulse">
                <div class="aspect-square w-full bg-gray-200 rounded-lg"></div>
                <div class="mt-4 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <!-- Products Grid -->
            <div id="product-grid" class="hidden grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8"></div>
            
            <!-- No Results State -->
            <div id="no-results" class="hidden text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
              <p class="mt-1 text-sm text-gray-500">Intenta con otros términos de búsqueda.</p>
            </div>
          </div>

          <!-- Shopping Cart Sidebar - Hidden on mobile, visible on desktop -->
          <aside class="hidden lg:block lg:col-span-3" style="max-width: 280px;">
            <div class="sticky top-24">
              <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden" style="width: 100%;">
                <!-- Cart Header -->
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-gray-900">Carrito</h3>
                    <div class="flex items-center gap-2">
                      <svg class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                      </svg>
                      <span id="cart-count" class="bg-gray-900 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">0</span>
                    </div>
                  </div>
                </div>

                <!-- Cart Content -->
                <div class="p-6">
                  <div id="cart-sidebar-items" class="space-y-4 max-h-96 overflow-y-auto">
                    <div class="text-gray-500 text-center py-12 text-sm">
                      <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                      </svg>
                      <p class="font-medium text-gray-600">Tu carrito está vacío</p>
                      <p class="text-xs text-gray-400 mt-1">Agrega productos para comenzar</p>
                    </div>
                  </div>

                  <!-- Cart Summary -->
                  <div class="mt-6 border-t border-gray-200 pt-6">
                    <div class="flex justify-between items-center mb-4">
                      <span class="text-base font-medium text-gray-900">Subtotal</span>
                      <span id="cart-sidebar-total" class="text-lg font-bold text-gray-900">$0.00</span>
                    </div>
                    
                    <!-- Shipping Info -->
                    <div class="bg-blue-50 rounded-lg p-3 mb-4">
                      <div class="flex items-start gap-2">
                        <svg class="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5z" />
                        </svg>
                        <div class="text-xs text-blue-800">
                          <p class="font-medium">Envío marítimo GRATIS</p>
                          <p>Envío aéreo: +10% del total</p>
                        </div>
                      </div>
                    </div>

                    <!-- Checkout Button -->
                    <button id="checkout-btn" class="w-full bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                      <div class="flex items-center justify-center gap-2">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        Continuar
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Trust Badges -->
              <div class="mt-6 bg-white rounded-lg border border-gray-200 p-4">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Compra Segura</h4>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Pagos seguros con Zelle
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Envíos a toda Latinoamérica
                  </div>
                  <div class="flex items-center gap-2 text-xs text-gray-600">
                    <svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    Soporte 24/7 por WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <!-- Checkout Modal Container -->
    <div id="checkout-modal"></div>
  `;

  // Cargar y mostrar productos
  const { products } = await loadAllData();
  let currentProducts = products;
  let currentViewMode = 'grid';
  
  // Hide loading state and show products
  document.getElementById('loading-state').classList.add('hidden');
  document.getElementById('product-grid').classList.remove('hidden');
  
  // Update product count
  document.getElementById('product-count').textContent = `${products.length} productos disponibles`;
  
  // Función para renderizar productos con el modo actual
  function renderCurrentProducts() {
    renderProducts({
      products: currentProducts,
      gridId: 'product-grid',
      getImagePath: (img) => `assets/images/products/${img}`,
      viewMode: currentViewMode,
      extraButton: (product) => `<button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 text-sm" data-addcart="${product.id}">
        <div class="flex items-center justify-center gap-1.5">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span class="text-xs font-semibold">Agregar</span>
        </div>
      </button>`
    });
  }
  
  // Renderizar productos inicialmente
  renderCurrentProducts();
  
  // Event listeners para cambiar vista
  document.getElementById('grid-view').addEventListener('click', () => {
    currentViewMode = 'grid';
    document.getElementById('grid-view').classList.add('text-indigo-600', 'bg-indigo-50');
    document.getElementById('grid-view').classList.remove('text-gray-400');
    document.getElementById('list-view').classList.remove('text-indigo-600', 'bg-indigo-50');
    document.getElementById('list-view').classList.add('text-gray-400');
    renderCurrentProducts();
  });
  
  document.getElementById('list-view').addEventListener('click', () => {
    currentViewMode = 'list';
    document.getElementById('list-view').classList.add('text-indigo-600', 'bg-indigo-50');
    document.getElementById('list-view').classList.remove('text-gray-400');
    document.getElementById('grid-view').classList.remove('text-indigo-600', 'bg-indigo-50');
    document.getElementById('grid-view').classList.add('text-gray-400');
    renderCurrentProducts();
  });
  
  // Activar vista grid por defecto
  document.getElementById('grid-view').classList.add('text-indigo-600', 'bg-indigo-50');
  document.getElementById('grid-view').classList.remove('text-gray-400');

  // Búsqueda con IA - Desktop
  const desktopSearch = document.getElementById('ai-search');
  if (desktopSearch) {
    desktopSearch.addEventListener('input', async (e) => {
      const query = e.target.value.trim();

      let searchResults = products;
      if (query !== '') {
        searchResults = await aiProductSearch(products, query);
      }

      // Apply current filters to search results
      currentProducts = applyFiltersToProducts(searchResults);

      // Update product count
      document.getElementById('product-count').textContent = `${currentProducts.length} productos encontrados`;

      // Show/hide no results state
      if (currentProducts.length === 0) {
        document.getElementById('product-grid').classList.add('hidden');
        document.getElementById('no-results').classList.remove('hidden');
      } else {
        document.getElementById('no-results').classList.add('hidden');
        document.getElementById('product-grid').classList.remove('hidden');

        renderCurrentProducts();
      }
    });
  }
  
  // Búsqueda con IA - Mobile
  const mobileSearch = document.getElementById('ai-search-mobile');
  if (mobileSearch) {
    mobileSearch.addEventListener('input', async (e) => {
      const query = e.target.value.trim();

      let searchResults = products;
      if (query !== '') {
        searchResults = await aiProductSearch(products, query);
      }

      // Apply current filters to search results
      currentProducts = applyFiltersToProducts(searchResults);

      // Update product count
      document.getElementById('product-count').textContent = `${currentProducts.length} productos encontrados`;

      // Show/hide no results state
      if (currentProducts.length === 0) {
        document.getElementById('product-grid').classList.add('hidden');
        document.getElementById('no-results').classList.remove('hidden');
      } else {
        document.getElementById('no-results').classList.add('hidden');
        document.getElementById('product-grid').classList.remove('hidden');

        renderCurrentProducts();
      }
    });
  }

  // Delegar eventos para agregar al carrito
  document.getElementById('product-grid').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-addcart]');
    if (btn) {
      const id = btn.getAttribute('data-addcart');
      const prod = products.find(p => String(p.id) === String(id));
      if (prod) {
        addToCart(prod);
        await renderCartSidebar();

        // Update cart count for desktop and mobile
        document.getElementById('cart-count').textContent = getCartItemCount();

        // Update mobile cart immediately
        renderMobileCart();

        // Sonido y vibración al agregar al carrito
        cartFeedback.addToCartFeedback();

        // Visual feedback
        btn.innerHTML = `
          <div class="flex items-center justify-center gap-1.5">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span class="text-xs font-semibold">¡Agregado!</span>
          </div>
        `;
        btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        btn.classList.add('bg-green-600', 'hover:bg-green-700');

        // Animación del contador del carrito
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
          cartCount.classList.add('cart-badge-pulse');
          setTimeout(() => {
            cartCount.classList.remove('cart-badge-pulse');
          }, 300);
        }

        setTimeout(() => {
          btn.innerHTML = `
            <div class="flex items-center justify-center gap-1.5">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span class="text-xs font-semibold">Agregar</span>
            </div>
          `;
          btn.classList.remove('bg-green-600', 'hover:bg-green-700');
          btn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        }, 2000);
      }
    }
  });

  // Botón de checkout
  document.getElementById('checkout-btn').onclick = () => {
    renderCheckout('checkout-modal');
  };

  // Renderizar carrito al cargar
  await renderCartSidebar();

  // Initialize cart count from session
  document.getElementById('cart-count').textContent = getCartItemCount();
  
  // Mobile cart functionality
  const mobileCartToggle = document.getElementById('mobile-cart-toggle');
  const mobileCartContainer = document.getElementById('mobile-cart-container');
  const mobileCartContent = document.getElementById('mobile-cart-content');
  const mobileCartArrow = document.getElementById('mobile-cart-arrow');
  const mobileCheckoutBtn = document.getElementById('mobile-checkout-btn');
  
  if (mobileCartToggle) {
    // Toggle mobile cart
    mobileCartToggle.addEventListener('click', () => {
      const isExpanded = mobileCartContent.classList.contains('expanded');
      
      if (isExpanded) {
        // Collapse
        mobileCartContent.classList.remove('expanded');
        mobileCartContainer.classList.remove('mobile-cart-expanded');
        mobileCartContainer.classList.add('mobile-cart-collapsed');
        mobileCartArrow.style.transform = 'rotate(0deg)';
      } else {
        // Expand
        mobileCartContent.classList.add('expanded');
        mobileCartContainer.classList.remove('mobile-cart-collapsed');
        mobileCartContainer.classList.add('mobile-cart-expanded');
        mobileCartArrow.style.transform = 'rotate(180deg)';
        
        // Render mobile cart items
        renderMobileCart();
      }
    });
    
    // Mobile checkout button
    if (mobileCheckoutBtn) {
      mobileCheckoutBtn.onclick = () => {
        renderCheckout('checkout-modal');
      };
    }
  }
  
  // Function to render mobile cart
  function renderMobileCart() {
    const cart = getCart();
    const mobileCartItems = document.getElementById('mobile-cart-items');
    const mobileCartTotal = document.getElementById('mobile-cart-total');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    
    if (mobileCartCount) {
      mobileCartCount.textContent = getCartItemCount();
    }
    
    if (mobileCartTotal) {
      mobileCartTotal.textContent = `${getCartTotal().toFixed(2)}`;
    }
    
    if (mobileCartItems) {
      if (cart.length === 0) {
        mobileCartItems.innerHTML = `
          <div class="text-gray-500 text-center py-8 text-sm">
            <svg class="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
            </svg>
            <p class="font-medium text-gray-600">Tu carrito está vacío</p>
          </div>
        `;
      } else {
        mobileCartItems.innerHTML = cart.map(item => {
          // Obtener la imagen correcta del producto
          const product = products.find(p => String(p.id) === String(item.id));
          const imagePath = product && product.image ? `assets/images/products/${product.image}` : '';
          
          return `
            <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div class="flex gap-3">
                ${imagePath ? `
                  <div class="flex-shrink-0">
                    <img src="${imagePath}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                  </div>
                ` : ''}
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex-1 min-w-0 pr-2">
                      <h4 class="font-medium text-gray-900 text-sm truncate">${item.name}</h4>
                      <p class="text-xs text-gray-500">${(item.price || 0).toFixed(2)} c/u</p>
                    </div>
                    <button class="text-gray-400 hover:text-red-500 p-1" onclick="removeFromMobileCart('${item.id}')">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <button class="p-1 bg-gray-100 rounded hover:bg-gray-200" onclick="decreaseMobileQty('${item.id}')">
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                        </svg>
                      </button>
                      <span class="text-sm font-medium px-2">${item.qty || 0}</span>
                      <button class="p-1 bg-gray-100 rounded hover:bg-gray-200" onclick="increaseMobileQty('${item.id}')">
                        <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                    <span class="font-bold text-indigo-600">${((item.price || 0) * (item.qty || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }
  
  // Global functions for mobile cart actions
  window.removeFromMobileCart = async (id) => {
    removeFromCart(id);
    renderMobileCart();
    await renderCartSidebar();
    document.getElementById('cart-count').textContent = getCartItemCount();
    // Feedback al eliminar
    cartFeedback.removeFromCartFeedback();
  };

  window.increaseMobileQty = async (id) => {
    const cart = getCart();
    const item = cart.find(item => String(item.id) === String(id));
    if (item) {
      updateProductQuantity(id, item.qty + 1);
      renderMobileCart();
      await renderCartSidebar();
    }
  };

  window.decreaseMobileQty = async (id) => {
    const cart = getCart();
    const item = cart.find(item => String(item.id) === String(id));
    if (item && item.qty > 1) {
      updateProductQuantity(id, item.qty - 1);
      renderMobileCart();
      await renderCartSidebar();
    }
  };
  
  // Initialize mobile cart on load
  renderMobileCart();

  // Filter functionality
  let currentFilters = {
    categories: [],
    priceRange: 'all',
    shipping: []
  };

  function applyFiltersToProducts(productList) {
    let filteredProducts = [...productList];

    // Category filter
    if (currentFilters.categories.length > 0 && !currentFilters.categories.includes('all')) {
      filteredProducts = filteredProducts.filter(product => {
        const productCategory = product.categoryId || product.category || '';
        return currentFilters.categories.includes(productCategory.toLowerCase());
      });
    }

    // Price filter
    if (currentFilters.priceRange !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
        const price = product.price || 0;
        switch (currentFilters.priceRange) {
          case '0-50': return price >= 0 && price <= 50;
          case '50-100': return price > 50 && price <= 100;
          case '100+': return price > 100;
          default: return true;
        }
      });
    }

    // Shipping filter (simplified - assuming all products have free shipping for now)
    if (currentFilters.shipping.length > 0) {
      // This would need actual shipping data from products
      // For now, just filter if 'free' is selected
      if (currentFilters.shipping.includes('free')) {
        // Assume all products have free shipping
      }
    }

    return filteredProducts;
  }

  function applyFilters() {
    currentProducts = applyFiltersToProducts(products);
    document.getElementById('product-count').textContent = `${currentProducts.length} productos encontrados`;

    // Show/hide no results
    if (currentProducts.length === 0) {
      document.getElementById('product-grid').classList.add('hidden');
      document.getElementById('no-results').classList.remove('hidden');
    } else {
      document.getElementById('no-results').classList.add('hidden');
      document.getElementById('product-grid').classList.remove('hidden');
      renderCurrentProducts();
    }
  }

  // Category filter listeners - Dynamic categories
  const categoryIds = ['filter-all', ...categories.map(cat => `filter-${cat.id}`)];

  categoryIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', (e) => {
        const value = e.target.value;
        if (value === 'all') {
          if (e.target.checked) {
            currentFilters.categories = ['all'];
            // Uncheck all other categories
            categories.forEach(cat => {
              const otherElement = document.getElementById(`filter-${cat.id}`);
              if (otherElement) otherElement.checked = false;
            });
          } else {
            currentFilters.categories = [];
          }
        } else {
          if (e.target.checked) {
            currentFilters.categories = currentFilters.categories.filter(cat => cat !== 'all');
            if (!currentFilters.categories.includes(value)) {
              currentFilters.categories.push(value);
            }
          } else {
            currentFilters.categories = currentFilters.categories.filter(cat => cat !== value);
          }
          // Check 'all' if no categories selected
          if (currentFilters.categories.length === 0) {
            document.getElementById('filter-all').checked = true;
            currentFilters.categories = ['all'];
          }
        }
        applyFilters();
      });
    }
  });

  // Price filter listeners
  ['price-all', 'price-0-50', 'price-50-100', 'price-100+'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', (e) => {
        currentFilters.priceRange = e.target.value;
        applyFilters();
      });
    }
  });

  // Shipping filter listeners
  ['shipping-free', 'shipping-express'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('change', (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          if (!currentFilters.shipping.includes(value)) {
            currentFilters.shipping.push(value);
          }
        } else {
          currentFilters.shipping = currentFilters.shipping.filter(s => s !== value);
        }
        applyFilters();
      });
    }
  });

  // Clear filters button
  const clearFiltersBtn = document.getElementById('clear-filters');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      // Reset all filters
      currentFilters = {
        categories: [],
        priceRange: 'all',
        shipping: []
      };

      // Reset UI
      document.getElementById('filter-all').checked = true;
      categories.forEach(cat => {
        const element = document.getElementById(`filter-${cat.id}`);
        if (element) element.checked = false;
      });

      document.getElementById('price-all').checked = true;
      ['price-0-50', 'price-50-100', 'price-100+'].forEach(id => {
        document.getElementById(id).checked = false;
      });

      ['shipping-free', 'shipping-express'].forEach(id => {
        document.getElementById(id).checked = false;
      });

      // Apply filters (which will show all products)
      applyFilters();
    });
  }
}
