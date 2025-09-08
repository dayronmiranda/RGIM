// utils/cartUI.js
// Renderizado y eventos del carrito minimalista
import { getCart, getCartTotal, removeFromCart, updateProductQuantity, getCartItemCount } from './cart.js';
import { loadAllData } from './dataLoader.js';

export async function renderCartSidebar(containerId = 'cart-sidebar-items', totalId = 'cart-sidebar-total') {
  const cart = getCart();
  const container = document.getElementById(containerId);
  const total = document.getElementById(totalId);
  if (!container) return;

  // Load products to get images
  const { products } = await loadAllData();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-gray-500 text-center py-12 text-sm">
        <svg class="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
        </svg>
        <p class="font-medium text-gray-600">Tu carrito está vacío</p>
        <p class="text-xs text-gray-400 mt-1">Agrega productos para comenzar</p>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => {
      // Find product image
      const product = products.find(p => String(p.id) === String(item.id));
      const imagePath = product && product.image ? `assets/images/products/${product.image}` : '';

      return `
        <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-start gap-3 mb-3">
            ${imagePath ? `
              <div class="flex-shrink-0">
                <img src="${imagePath}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg">
              </div>
            ` : ''}
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0 pr-2">
                  <h4 class="font-medium text-gray-900 text-sm leading-tight truncate">${item.name}</h4>
                  <p class="text-xs text-gray-500 mt-1">Precio unitario: $${(item.price || 0).toFixed(2)}</p>
                </div>
                <button class="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0" data-remove="${item.id}" title="Eliminar producto">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex items-center bg-gray-100 rounded-lg">
                <button class="p-1 hover:bg-gray-200 rounded-l-lg transition-colors" data-decrease="${item.id}">
                  <svg class="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                  </svg>
                </button>
                <span class="px-3 py-1 text-sm font-medium text-gray-900 min-w-[2rem] text-center">${item.qty || 0}</span>
                <button class="p-1 hover:bg-gray-200 rounded-r-lg transition-colors" data-increase="${item.id}">
                  <svg class="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="text-right">
              <p class="font-bold text-indigo-600 text-lg">$${((item.price || 0) * (item.qty || 0)).toFixed(2)}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  if (total) {
    total.textContent = `${getCartTotal().toFixed(2)}`;
  }
  
  // Eventos para quitar productos
  container.querySelectorAll('button[data-remove]').forEach(btn => {
    btn.onclick = async () => {
      removeFromCart(btn.getAttribute('data-remove'));
      await renderCartSidebar(containerId, totalId);
      // Actualizar contador del carrito
      updateCartCount();
    };
  });

  // Eventos para aumentar cantidad (necesitaremos implementar esta función)
  container.querySelectorAll('button[data-increase]').forEach(btn => {
    btn.onclick = async () => {
      const productId = btn.getAttribute('data-increase');
      increaseQuantity(productId);
      await renderCartSidebar(containerId, totalId);
      updateCartCount();
    };
  });

  // Eventos para disminuir cantidad
  container.querySelectorAll('button[data-decrease]').forEach(btn => {
    btn.onclick = async () => {
      const productId = btn.getAttribute('data-decrease');
      decreaseQuantity(productId);
      await renderCartSidebar(containerId, totalId);
      updateCartCount();
    };
  });
}

// Función auxiliar para actualizar el contador del carrito
function updateCartCount() {
  const totalItems = getCartItemCount();
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Función para aumentar cantidad
function increaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find(item => String(item.id) === String(productId));
  if (item) {
    updateProductQuantity(productId, item.qty + 1);
  }
}

// Función para disminuir cantidad
function decreaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find(item => String(item.id) === String(productId));
  if (item) {
    updateProductQuantity(productId, item.qty - 1);
  }
}
