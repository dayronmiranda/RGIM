// utils/checkoutUI.js
// Renderizado y lógica de checkout minimalista
import { getCart, getCartTotal, clearCart } from './cart.js';

export function renderCheckout(containerId = 'checkout-modal') {
  const cart = getCart();
  const total = getCartTotal();
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Finalizar Compra</h2>
            <button class="text-white hover:text-gray-200 text-2xl font-bold" id="close-checkout">&times;</button>
          </div>
        </div>
        
        <!-- Cart Summary -->
        <div class="px-6 py-4 bg-gray-50 border-b">
          <h3 class="font-semibold text-gray-900 mb-3">Resumen del pedido:</h3>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            ${cart.map(item => `
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-700">${item.qty}x ${item.name}</span>
                <span class="font-medium text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="border-t pt-2 mt-3">
            <div class="flex justify-between items-center font-bold text-lg">
              <span class="text-gray-900">Total:</span>
              <span class="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <!-- Form -->
        <div class="px-6 py-6">
          <form id="checkout-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
              <input 
                required 
                name="name" 
                type="text"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                placeholder="Ingresa tu nombre completo" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input 
                required 
                name="whatsapp" 
                type="tel"
                class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" 
                placeholder="Ej: +507 6123-4567" 
              />
              <p class="text-xs text-gray-500 mt-1">Incluye el código de país</p>
            </div>
            
            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Enviar pedido por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Cerrar modal
  document.getElementById('close-checkout').onclick = () => {
    container.innerHTML = '';
  };
  
  // Cerrar modal al hacer clic fuera
  container.onclick = (e) => {
    if (e.target === container) {
      container.innerHTML = '';
    }
  };
  
  // Enviar formulario
  document.getElementById('checkout-form').onsubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const whatsapp = formData.get('whatsapp');
    
    // Crear mensaje para WhatsApp
    let message = `¡Hola! Soy ${name} y me gustaría hacer el siguiente pedido:\n\n`;
    
    cart.forEach(item => {
      message += `• ${item.qty}x ${item.name} - ${(item.price * item.qty).toFixed(2)}\n`;
    });
    
    message += `\n*Total: ${total.toFixed(2)}*\n\n`;
    message += `Mi WhatsApp: ${whatsapp}\n\n`;
    message += `¡Gracias!`;
    
    // Número de WhatsApp de RGIM (puedes cambiarlo por el número real)
    const rgimWhatsApp = '13058462224'; // Cambiar por el número real
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${rgimWhatsApp}?text=${encodeURIComponent(message)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Limpiar carrito y cerrar modal
    clearCart();
    container.innerHTML = '';
    
    // Recargar página para actualizar el carrito
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
}
