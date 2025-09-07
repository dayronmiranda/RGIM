// store.js

import { loadAllData } from '../utils/dataLoader.js';
import { renderProducts } from '../utils/products.js';
import { aiProductSearch } from '../utils/aiSearch.js';
import { addToCart } from '../utils/cart.js';
import { renderCartSidebar } from '../utils/cartUI.js';
import { renderCheckout } from '../utils/checkoutUI.js';

export async function renderStore(container) {
  container.innerHTML = `
    <section class="bg-gray-50 min-h-screen">
      <div class="w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="pb-24">
          <div class="border-b border-gray-200 pb-10">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900">Tienda</h1>
            <p class="mt-4 text-base text-gray-500">Explora nuestro catálogo completo de productos internacionales</p>
          </div>
          <div class="pt-6 pb-4 flex justify-center">
            <input id="ai-search" type="text" placeholder="Buscar productos con IA..." class="w-full max-w-lg border rounded px-3 py-2 shadow-sm focus:ring focus:ring-indigo-200" />
          </div>
          <div class="pt-6 lg:grid lg:grid-cols-4 lg:gap-x-8">
            <div class="lg:col-span-3">
              <div id="product-grid" class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8 mt-6"></div>
            </div>
            <aside class="mt-8 lg:mt-0 lg:col-span-1">
              <div class="sticky top-24">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 class="text-lg font-medium text-gray-900">Carrito</h3>
                  <div class="mt-4">
                    <div id="cart-sidebar-items" class="space-y-2 max-h-64 overflow-y-auto"></div>
                  </div>
                  <div class="mt-6 border-t border-gray-200 pt-6">
                    <div class="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p id="cart-sidebar-total">$0.00</p>
                    </div>
                  </div>
                  <button id="checkout-btn" class="mt-6 w-full bg-green-600 text-white rounded px-2 py-2 hover:bg-green-700">Finalizar compra</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <div id="checkout-modal"></div>
    </section>
  `;

  // Cargar y mostrar productos
  const { products } = await loadAllData();
  let currentProducts = products;
  renderProducts({
    products: currentProducts,
    gridId: 'product-grid',
    getImagePath: (img) => `assets/images/${img}`,
    extraButton: (product) => `<button class="mt-2 w-full bg-indigo-600 text-white rounded px-2 py-1 text-sm hover:bg-indigo-700" data-addcart="${product.id}">Agregar al carrito</button>`
  });

  // Búsqueda con IA
  document.getElementById('ai-search').addEventListener('input', async (e) => {
    const query = e.target.value;
    currentProducts = await aiProductSearch(products, query);
    renderProducts({
      products: currentProducts,
      gridId: 'product-grid',
      getImagePath: (img) => `assets/images/${img}`,
      extraButton: (product) => `<button class=\"mt-2 w-full bg-indigo-600 text-white rounded px-2 py-1 text-sm hover:bg-indigo-700\" data-addcart=\"${product.id}\">Agregar al carrito</button>`
    });
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
      }
    }
  });

  // Botón de checkout
  document.getElementById('checkout-btn').onclick = () => {
    renderCheckout('checkout-modal');
  };

  // Renderizar carrito al cargar
  renderCartSidebar();
}
