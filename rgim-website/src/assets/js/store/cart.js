/*
  Cart functionality module
  Extracted from app.js lines 230-296 and 781-873
*/

import { saveJSON, STORAGE_KEYS } from '../core/state.js'

export function addToCart(state, id) {
  const existing = state.cart.find(it => it.id === id)
  if (existing) {
    existing.qty += 1
  } else {
    state.cart.push({ id, qty: 1 })
  }
  saveJSON(STORAGE_KEYS.cart, state.cart)
}

export function removeFromCart(state, id) {
  const index = state.cart.findIndex(it => it.id === id)
  if (index !== -1) {
    state.cart.splice(index, 1)
    saveJSON(STORAGE_KEYS.cart, state.cart)
  }
}

export function changeQty(state, id, delta) {
  const item = state.cart.find(it => it.id === id)
  if (!item) return
  const newQty = Math.max(1, item.qty + delta)
  item.qty = newQty
  saveJSON(STORAGE_KEYS.cart, state.cart)
}

export function cartTotal(state) {
  let total = 0
  for (const it of state.cart) {
    const p = state.products.find(x => x.id === it.id)
    if (p) total += p.price * it.qty
  }
  return total
}

export function renderCart(state, els, fmtCurrency, getImagePath) {
  const wrap = els.cartItems
  if (!wrap) return
  wrap.innerHTML = ''
  
  if (state.cart.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'text-slate-500 text-sm'
    empty.textContent = state.lang === 'es' ? 'Tu carrito está vacío.' : 'Your cart is empty.'
    wrap.appendChild(empty)
    return
  }
  
  state.cart.forEach(it => {
    const p = state.products.find(x => x.id === it.id)
    if (!p) return
    const row = document.createElement('div')
    row.className = 'flex items-center gap-3 border rounded p-3 bg-white'
    row.innerHTML = `
      <div class="w-14 h-14 bg-slate-100 rounded overflow-hidden">${p.image ? `<img src="${getImagePath(p.image)}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">` : ''}</div>
      <div class="flex-1">
        <div class="font-medium">${p.name}</div>
        <div class="text-sm text-slate-600">${fmtCurrency(p.price)} x ${it.qty} = <span class="font-semibold">${fmtCurrency(p.price * it.qty)}</span></div>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-2 py-1 border rounded" data-dec>-</button>
        <div class="w-8 text-center">${it.qty}</div>
        <button class="px-2 py-1 border rounded" data-inc>+</button>
      </div>
      <button class="px-3 py-1 border rounded text-red-600" data-del>Eliminar</button>`
    
    row.querySelector('[data-dec]').onclick = () => {
      changeQty(state, it.id, -1)
      renderCart(state, els, fmtCurrency, getImagePath)
    }
    row.querySelector('[data-inc]').onclick = () => {
      changeQty(state, it.id, +1)
      renderCart(state, els, fmtCurrency, getImagePath)
    }
    row.querySelector('[data-del]').onclick = () => {
      removeFromCart(state, it.id)
      renderCart(state, els, fmtCurrency, getImagePath)
    }
    wrap.appendChild(row)
  })
}

export function renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, updateCartSidebarTotal) {
  const wrap = els.cartSidebarItems
  if (!wrap) return
  wrap.innerHTML = ''
  
  if (state.cart.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'text-slate-500 text-center py-8'
    empty.textContent = state.lang === 'es' ? 'Tu carrito está vacío' : 'Your cart is empty'
    wrap.appendChild(empty)
    return
  }

  state.cart.forEach(it => {
    const p = state.products.find(x => x.id === it.id)
    if (!p) return
    const row = document.createElement('div')
    row.className = 'flex items-center gap-3 border rounded-lg p-3 bg-slate-50'
    
    row.innerHTML = `
      <div class="w-12 h-12 bg-slate-200 rounded overflow-hidden flex-shrink-0">
        ${p.image ? `<img src="${getImagePath(p.image)}" alt="${p.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'">` : ''}
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-medium text-sm truncate">${p.name}</div>
        <div class="text-xs text-slate-600">${fmtCurrency(p.price)}</div>
      </div>
      <div class="flex items-center gap-1">
        <button class="w-7 h-7 border rounded flex items-center justify-center hover:bg-white" data-dec>-</button>
        <div class="w-8 text-center text-sm">${it.qty}</div>
        <button class="w-7 h-7 border rounded flex items-center justify-center hover:bg-white" data-inc>+</button>
      </div>
      <button class="text-red-500 hover:text-red-700 p-1" data-del>
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    `
    
    row.querySelector('[data-dec]').onclick = () => {
      changeQtyCallback(it.id, -1)
      renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, updateCartSidebarTotal)
      updateCartSidebarTotal()
    }
    row.querySelector('[data-inc]').onclick = () => {
      changeQtyCallback(it.id, +1)
      renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, updateCartSidebarTotal)
      updateCartSidebarTotal()
    }
    row.querySelector('[data-del]').onclick = () => {
      removeFromCartCallback(it.id)
      renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQtyCallback, removeFromCartCallback, updateCartSidebarTotal)
      updateCartSidebarTotal()
    }
    wrap.appendChild(row)
  })
}

export function updateCartBadges(state, els) {
  const count = state.cart.reduce((sum, item) => sum + item.qty, 0)
  if (els.cartBadgeDesktop) {
    if (count > 0) {
      els.cartBadgeDesktop.textContent = count > 99 ? '99+' : count
      els.cartBadgeDesktop.classList.remove('hidden')
    } else {
      els.cartBadgeDesktop.classList.add('hidden')
    }
  }
}

export function updateCartSidebarTotal(state, els, fmtCurrency, cartTotalCallback) {
  if (!els.cartSidebarTotal) return
  const shipType = document.getElementById('shippingType')?.value || 'sea'
  const base = cartTotalCallback()
  const total = shipType === 'air' ? base * 1.10 : base
  els.cartSidebarTotal.textContent = fmtCurrency(total)
}