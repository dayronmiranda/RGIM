// utils/cartUI.js
// Renderizado y eventos del carrito minimalista
import { getCart, getCartTotal, removeFromCart } from './cart.js';

export function renderCartSidebar(containerId = 'cart-sidebar-items', totalId = 'cart-sidebar-total') {
  const cart = getCart();
  const container = document.getElementById(containerId);
  const total = document.getElementById(totalId);
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<div class="text-gray-500 text-center py-8">Tu carrito está vacío</div>';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="flex items-center justify-between bg-gray-100 rounded p-2">
        <span class="font-medium">${item.name}</span>
        <span class="text-sm">x${item.qty}</span>
        <span class="text-sm">$${(item.price * item.qty).toFixed(2)}</span>
        <button class="text-red-500 hover:underline" data-remove="${item.id}">Quitar</button>
      </div>
    `).join('');
  }
  if (total) {
    total.textContent = `$${getCartTotal().toFixed(2)}`;
  }
  // Eventos quitar
  container.querySelectorAll('button[data-remove]').forEach(btn => {
    btn.onclick = () => {
      removeFromCart(btn.getAttribute('data-remove'));
      renderCartSidebar(containerId, totalId);
    };
  });
}
