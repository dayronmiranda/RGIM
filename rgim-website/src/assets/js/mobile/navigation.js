/*
  Mobile navigation functionality module
  Extracted from app.js lines 1062-1303
*/

import { saveJSON, STORAGE_KEYS } from '../core/state.js'

// Mobile navigation menu functionality - FIXED
export function setupMobileNavigation() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle')
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay')
  const mobileNavClose = document.getElementById('mobile-nav-close')
  
  if (!mobileMenuToggle || !mobileNavOverlay) return
  
  mobileMenuToggle.onclick = () => {
    mobileNavOverlay.classList.add('show')
    document.body.style.overflow = 'hidden' // Prevent scrolling when menu is open
  }
  
  if (mobileNavClose) {
    mobileNavClose.onclick = () => {
      mobileNavOverlay.classList.remove('show')
      document.body.style.overflow = '' // Restore scrolling
    }
  }
  
  // Close menu when clicking on navigation links
  mobileNavOverlay.querySelectorAll('a').forEach(link => {
    link.onclick = () => {
      mobileNavOverlay.classList.remove('show')
      document.body.style.overflow = '' // Restore scrolling
    }
  })
  
  // Close menu when clicking outside
  mobileNavOverlay.onclick = (e) => {
    if (e.target === mobileNavOverlay) {
      mobileNavOverlay.classList.remove('show')
      document.body.style.overflow = '' // Restore scrolling
    }
  }
}

export function openMobileCartModal(state, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, cartTotalCallback, showToast) {
  if (window.innerWidth > 430) return // Only on mobile
  
  const modal = document.createElement('div')
  modal.className = 'mobile-cart-modal'
  modal.innerHTML = `
    <div class="mobile-cart-modal-header">
      <h2 class="text-lg font-semibold" data-i18n="cart.title">Carrito de compras</h2>
      <button class="mobile-cart-modal-close" aria-label="Cerrar carrito">&times;</button>
    </div>
    <div class="p-4">
      <div id="mobile-cart-items" class="space-y-3 mb-6">
        <!-- Cart items will be rendered here -->
      </div>
      <div class="border-t pt-4">
        <div class="flex justify-between items-center mb-4">
          <span class="font-medium" data-i18n="checkout.total">Total:</span>
          <span id="mobile-cart-total" class="text-xl font-bold">$0.00</span>
        </div>
        <select id="mobile-cart-shipping" class="w-full border rounded px-3 py-2 mb-4">
          <option value="sea" data-i18n="shipping.sea">Marítimo (0%)</option>
          <option value="air" data-i18n="shipping.air">Aéreo (+10%)</option>
        </select>
        <form id="mobile-checkout-form" class="space-y-3">
          <input id="mobile-buyer-name" type="text" placeholder="Nombre" class="w-full border rounded px-3 py-2" required />
          <input id="mobile-buyer-whatsapp" type="tel" placeholder="WhatsApp (+507...)" class="w-full border rounded px-3 py-2" required />
          <select id="mobile-shipping-type" class="w-full border rounded px-3 py-2">
            <option value="sea" data-i18n="shipping.sea">Marítimo (0%)</option>
            <option value="air" data-i18n="shipping.air">Aéreo (+10%)</option>
          </select>
          <button type="submit" class="w-full bg-brand-600 text-white py-3 rounded-lg font-medium" data-i18n="checkout.submit">Enviar solicitud</button>
          <p class="text-xs text-slate-500 text-center" data-i18n="checkout.note">No realizas pagos aquí. Te contactaremos por WhatsApp.</p>
        </form>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  
  // Render cart items in mobile modal
  renderMobileCartItems(state, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, cartTotalCallback)
  updateMobileCartTotal(state, cartTotalCallback, fmtCurrency)
  
  // Show modal with animation
  setTimeout(() => modal.classList.add('show'), 10)
  
  // Event listeners
  modal.querySelector('.mobile-cart-modal-close').onclick = closeMobileCartModal
  modal.querySelector('#mobile-cart-shipping').onchange = () => updateMobileCartTotal(state, cartTotalCallback, fmtCurrency)
  modal.querySelector('#mobile-checkout-form').onsubmit = (e) => handleMobileCheckout(e, state, cartTotalCallback, showToast)
  
  // Apply translations to modal (if applyTranslations function is available)
  try {
    if (window.applyTranslations) window.applyTranslations()
  } catch (e) {
    console.log('Translations not available in mobile modal')
  }
}

export function closeMobileCartModal() {
  const modal = document.querySelector('.mobile-cart-modal')
  if (modal) {
    modal.classList.remove('show')
    setTimeout(() => modal.remove(), 300)
  }
}

export function renderMobileCartItems(state, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, cartTotalCallback) {
  const container = document.getElementById('mobile-cart-items')
  if (!container) return
  
  container.innerHTML = ''
  
  if (state.cart.length === 0) {
    container.innerHTML = '<div class="text-slate-500 text-center py-8">Tu carrito está vacío</div>'
    return
  }
  
  state.cart.forEach(item => {
    const product = state.products.find(p => p.id === item.id)
    if (!product) return
    
    const itemEl = document.createElement('div')
    itemEl.className = 'flex items-center gap-3 border rounded-lg p-3 bg-slate-50'
    itemEl.innerHTML = `
      <div class="w-16 h-16 bg-slate-200 rounded overflow-hidden flex-shrink-0">
        ${product.image ? `<img src="${getImagePath(product.image)}" alt="${product.name}" class="w-full h-full object-cover">` : ''}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-medium truncate">${product.name}</div>
        <div class="text-sm text-slate-600">${fmtCurrency(product.price)}</div>
      </div>
      <div class="flex items-center gap-2">
        <button class="w-8 h-8 border rounded flex items-center justify-center" data-dec>-</button>
        <div class="w-8 text-center">${item.qty}</div>
        <button class="w-8 h-8 border rounded flex items-center justify-center" data-inc>+</button>
      </div>
      <button class="text-red-500 p-2" data-del>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    `
    
    itemEl.querySelector('[data-dec]').onclick = () => {
      changeQtyCallback(item.id, -1)
      renderMobileCartItems(state, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, cartTotalCallback)
      updateMobileCartTotal(state, cartTotalCallback, fmtCurrency)
    }
    itemEl.querySelector('[data-inc]').onclick = () => {
      changeQtyCallback(item.id, 1)
      renderMobileCartItems(state, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, cartTotalCallback)
      updateMobileCartTotal(state, cartTotalCallback, fmtCurrency)
    }
    itemEl.querySelector('[data-del]').onclick = () => {
      removeFromCartCallback(item.id)
      renderMobileCartItems(state, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, cartTotalCallback)
      updateMobileCartTotal(state, cartTotalCallback, fmtCurrency)
    }
    
    container.appendChild(itemEl)
  })
}

function updateMobileCartTotal(state, cartTotalCallback, fmtCurrency) {
  const totalEl = document.getElementById('mobile-cart-total')
  const shippingEl = document.getElementById('mobile-cart-shipping')
  if (!totalEl || !shippingEl) return
  
  const shipType = shippingEl.value || 'sea'
  const base = cartTotalCallback()
  const total = shipType === 'air' ? base * 1.10 : base
  totalEl.textContent = fmtCurrency(total)
}

function handleMobileCheckout(e, state, cartTotalCallback, showToast) {
  e.preventDefault()
  if (state.cart.length === 0) {
    showToast(state.lang === 'es' ? 'Agrega productos al carrito' : 'Add items to cart')
    return
  }
  
  const name = document.getElementById('mobile-buyer-name').value.trim()
  const phone = document.getElementById('mobile-buyer-whatsapp').value.trim()
  const shipType = document.getElementById('mobile-shipping-type').value
  const base = cartTotalCallback()
  const total = shipType === 'air' ? base * 1.10 : base
  
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    buyer: { name, phone },
    shipping: shipType,
    items: state.cart.map(it => ({ ...it })),
    total,
    status: 'new'
  }
  
  // Save to history
  state.history.unshift(order)
  saveJSON(STORAGE_KEYS.history, state.history)
  
  // Play success sound and show message
  try {
    if (window.playOrderSentSound) window.playOrderSentSound()
  } catch (e) {
    console.log('Sound not available')
  }
  showToast(state.lang === 'es' ? 'Solicitud enviada a la empresa' : 'Request sent to company')
  
  // Clear cart and close modal
  setTimeout(() => {
    state.cart = []
    saveJSON(STORAGE_KEYS.cart, state.cart)
    
    // Update UI if callbacks are available
    try {
      if (window.updateCartBadges) window.updateCartBadges()
      if (window.renderCart) window.renderCart()
      if (window.renderCartSidebar) window.renderCartSidebar()
      if (window.updateTotal) window.updateTotal()
      if (window.updateCartSidebarTotal) window.updateCartSidebarTotal()
      if (window.renderHistory) window.renderHistory()
    } catch (e) {
      console.log('UI update callbacks not available')
    }
    
    closeMobileCartModal()
  }, 500)
}