// store.js

import { loadAllData } from '../utils/dataLoader.js';
import { renderProducts } from '../utils/products.js';
import { aiProductSearch } from '../utils/aiSearch.js';
import { addToCart, getCartItemCount, getCart, getCartTotal, removeFromCart, updateProductQuantity } from '../utils/cart.js';
import { renderCartSidebar } from '../utils/cartUI.js';
import { renderCheckout } from '../utils/checkoutUI.js';

export async function renderStore(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div class="mx-auto max-w-4xl py-16 sm:py-24 lg:py-32">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Nuestra Tienda
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              Explora nuestro catálogo completo de productos internacionales. Encuentra exactamente lo que buscas con nuestra búsqueda inteligente.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Store Section -->
    <div class="bg-gray-50 min-h-screen">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        
        <!-- Search Section -->
        <div class="mb-12">
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

        <!-- Mobile Cart (Collapsible) - Only visible on mobile -->
        <div id="mobile-cart-container" class="lg:hidden mobile-cart-collapsed mb-6">
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
                <button id="mobile-checkout-btn" class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200">
                  <div class="flex items-center justify-center gap-2">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    Finalizar compra
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Products and Cart Layout -->
        <div class="lg:grid lg:grid-cols-3 lg:gap-x-8">
          
          <!-- Products Grid -->
          <div class="lg:col-span-2">
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
          <aside class="hidden lg:block lg:col-span-1">
            <div class="sticky top-24">
              <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <!-- Cart Header -->
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-white">Carrito de Compras</h3>
                    <div class="flex items-center gap-2">
                      <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                      </svg>
                      <span id="cart-count" class="bg-white text-indigo-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span>
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
                    <button id="checkout-btn" class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      <div class="flex items-center justify-center gap-2">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        Enviar solicitud de compra
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
      extraButton: (product) => `<button class="mt-3 w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200" data-addcart="${product.id}">
        <div class="flex items-center justify-center gap-2">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Agregar al carrito
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

  // Búsqueda con IA
  document.getElementById('ai-search').addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    
    if (query === '') {
      currentProducts = products;
    } else {
      currentProducts = await aiProductSearch(products, query);
    }
    
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

  // Delegar eventos para agregar al carrito
  document.getElementById('product-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-addcart]');
    if (btn) {
      const id = btn.getAttribute('data-addcart');
      const prod = products.find(p => String(p.id) === String(id));
      if (prod) {
        addToCart(prod);
        renderCartSidebar();
        
        // Update cart count
        document.getElementById('cart-count').textContent = getCartItemCount();
        
        // Visual feedback
        btn.innerHTML = `
          <div class="flex items-center justify-center gap-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            ¡Agregado!
          </div>
        `;
        btn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        btn.classList.add('bg-green-600');
        
        setTimeout(() => {
          btn.innerHTML = `
            <div class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Agregar al carrito
            </div>
          `;
          btn.classList.remove('bg-green-600');
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
  renderCartSidebar();
  
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
        mobileCartItems.innerHTML = cart.map(item => `
          <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
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
        `).join('');
      }
    }
  }
  
  // Global functions for mobile cart actions
  window.removeFromMobileCart = (id) => {
    removeFromCart(id);
    renderMobileCart();
    renderCartSidebar();
    document.getElementById('cart-count').textContent = getCartItemCount();
  };
  
  window.increaseMobileQty = (id) => {
    const cart = getCart();
    const item = cart.find(item => String(item.id) === String(id));
    if (item) {
      updateProductQuantity(id, item.qty + 1);
      renderMobileCart();
      renderCartSidebar();
    }
  };
  
  window.decreaseMobileQty = (id) => {
    const cart = getCart();
    const item = cart.find(item => String(item.id) === String(id));
    if (item && item.qty > 1) {
      updateProductQuantity(id, item.qty - 1);
      renderMobileCart();
      renderCartSidebar();
    }
  };
  
  // Update mobile cart when items are added
  const originalAddToCart = addToCart;
  window.addToCart = (product) => {
    originalAddToCart(product);
    renderMobileCart();
  };
}
