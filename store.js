// store.js
export function renderStore(container) {
  container.innerHTML = `
    <section class="bg-gray-50 min-h-screen">
      <div class="w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="pb-24">
          <div class="border-b border-gray-200 pb-10">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900">Tienda</h1>
            <p class="mt-4 text-base text-gray-500">Explora nuestro catálogo completo de productos internacionales</p>
          </div>
          <div class="pt-12 lg:grid lg:grid-cols-4 lg:gap-x-8">
            <aside class="hidden lg:block">
              <form class="space-y-10 divide-y divide-gray-200">
                <div>
                  <legend class="block text-sm font-medium text-gray-900">Buscar productos</legend>
                  <div class="pt-6 space-y-3">
                    <div class="relative">
                      <input type="text" id="product-search" placeholder="Buscar productos..." class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10">
                    </div>
                  </div>
                </div>
                <div class="pt-10">
                  <legend class="block text-sm font-medium text-gray-900">Categorías</legend>
                  <div id="category-bar" class="pt-6 space-y-3"></div>
                </div>
              </form>
            </aside>
            <div class="lg:col-span-2">
              <div class="flex items-center justify-between border-b border-gray-200 pb-6 lg:hidden">
                <h2 class="text-lg font-medium text-gray-900">Productos</h2>
              </div>
              <div id="product-grid" class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8 mt-6">
                <!-- Productos renderizados por JS -->
              </div>
            </div>
            <aside class="hidden lg:block">
              <div class="sticky top-24">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 class="text-lg font-medium text-gray-900">Carrito</h3>
                  <div class="mt-4">
                    <div id="cart-sidebar-items" class="space-y-2 max-h-64 overflow-y-auto">
                      <div class="text-gray-500 text-center py-8">Tu carrito está vacío</div>
                    </div>
                  </div>
                  <div class="mt-6 border-t border-gray-200 pt-6">
                    <div class="flex justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p id="cart-sidebar-total">$0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  `;
}
