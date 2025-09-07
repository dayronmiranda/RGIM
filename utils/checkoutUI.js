// utils/checkoutUI.js
// Renderizado y lógica de checkout minimalista
import { getCart, getCartTotal, clearCart } from './cart.js';

export function renderCheckout(containerId = 'checkout-modal') {
  const cart = getCart();
  const total = getCartTotal();
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" id="close-checkout">✕</button>
        <h2 class="text-2xl font-bold mb-4">Finalizar compra</h2>
        <ul class="mb-4">
          ${cart.map(item => `<li>${item.qty} x ${item.name} <span class='float-right'>$${(item.price * item.qty).toFixed(2)}</span></li>`).join('')}
        </ul>
        <div class="mb-4 font-semibold">Total: $${total.toFixed(2)}</div>
        <form id="checkout-form" class="space-y-3">
          <input required name="name" class="w-full border rounded px-2 py-1" placeholder="Nombre" />
          <input required name="email" type="email" class="w-full border rounded px-2 py-1" placeholder="Email" />
          <input required name="address" class="w-full border rounded px-2 py-1" placeholder="Dirección" />
          <button type="submit" class="w-full bg-indigo-600 text-white rounded px-2 py-2 hover:bg-indigo-700">Confirmar pedido</button>
        </form>
        <div id="checkout-success" class="hidden mt-4 text-green-600 font-semibold text-center">¡Pedido realizado con éxito!</div>
      </div>
    </div>
  `;
  // Cerrar modal
  document.getElementById('close-checkout').onclick = () => {
    container.innerHTML = '';
  };
  // Enviar formulario
  document.getElementById('checkout-form').onsubmit = (e) => {
    e.preventDefault();
    clearCart();
    document.getElementById('checkout-success').classList.remove('hidden');
    setTimeout(() => {
      container.innerHTML = '';
      window.location.reload();
    }, 1500);
  };
}
