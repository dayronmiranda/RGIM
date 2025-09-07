/*
  RGIM Single Page Prototype - FIXED VERSION
  - Hash routing: #/home, #/store, #/faq, #/about, #/admin
  - Local/session storage for cart and history
  - JSON data loading for products, categories, translations
  - Simple admin login (single hardcoded user)
  - Fake email submission with toast confirmation
*/

// Import core modules
import { 
  initState, 
  loadJSON, 
  saveJSON, 
  stateHelpers,
  STORAGE_KEYS 
} from './core/state.js'

import { 
  routes,
  initRouting
} from './core/routing.js'

import { 
  loadAllData,
  loadTranslations as loadTranslationsData
} from './core/dataLoader.js'

// Import store modules
import { 
  addToCart as addToCartModule,
  removeFromCart as removeFromCartModule,
  changeQty as changeQtyModule,
  cartTotal as cartTotalModule,
  renderCart,
  renderCartSidebar,
  updateCartBadges,
  updateCartSidebarTotal
} from './store/cart.js'

import { 
  setupSearch
} from './store/search.js'

import { 
  closeAllModals
} from './ui/modal.js'

import { 
  renderProducts,
  openProductModal
} from './store/products.js'

import { 
  renderCategories
} from './store/categories.js'

// Import mobile modules
import { 
  setupMobileNavigation,
  openMobileCartModal
} from './mobile/navigation.js'

// Import feature modules
import { 
  playAddToCartSound,
  playOrderSentSound
} from './features/audio.js'

// Import SEO modules
import { 
  updateSEO,
  updateFAQSchema,
  updateHreflangLinks
} from './seo/meta.js'

// Import image utilities
import './modules/imageUtils.js'

;(function(){
  const els = {
    routes: routes.reduce((acc, r) => { acc[r] = document.getElementById(`route-${r}`); return acc }, {}),
    nav: Object.fromEntries(routes.map(r => [r, document.querySelector(`[data-nav="${r}"]`)])),
    categoryBar: document.getElementById('category-bar'),
    productGrid: document.getElementById('product-grid'),
    cartItems: document.getElementById('cart-items'),
    checkoutForm: document.getElementById('checkout-form'),
    orderTotal: document.getElementById('order-total'),
    sessionHistory: document.getElementById('session-history'),
    checkoutItemCount: document.getElementById('checkout-item-count'),
    viewCartBtn: document.getElementById('view-cart-btn'),
    modalRoot: document.getElementById('modal-root'),
    toastRoot: document.getElementById('toast-root'),

    // Cart sidebar elements (always visible in store)
    cartSidebarItems: document.getElementById('cart-sidebar-items'),
    cartSidebarTotal: document.getElementById('cart-sidebar-total'),
    cartBadgeDesktop: document.getElementById('cart-badge-desktop'),

    // Admin
    adminLogin: document.getElementById('admin-login'),
    adminLoginForm: document.getElementById('admin-login-form'),
    adminDashboard: document.getElementById('admin-dashboard'),
    adminRows: document.getElementById('admin-rows'),
    adminSearch: document.getElementById('admin-search'),
    adminFilterShipping: document.getElementById('admin-filter-shipping'),
    adminFilterStatus: document.getElementById('admin-filter-status'),
    btnExportCSV: document.getElementById('btn-export-csv'),
    btnAdminLogout: document.getElementById('btn-admin-logout'),

    // i18n buttons
    langES: document.getElementById('btn-lang-es'),
    langEN: document.getElementById('btn-lang-en'),
  }

  const ADMIN = {
    user: 'rgim',
    pass: 'demo123',
  }

  // Initialize global state using the state module
  const state = initState()

  function fmtCurrency(n){ return new Intl.NumberFormat(state.lang === 'es' ? 'es-PA' : 'en-US', { style:'currency', currency:'USD' }).format(n) }

  
  function showToast(msg){
    const node = document.createElement('div')
    node.className = 'pointer-events-auto bg-slate-900 text-white px-4 py-2 rounded shadow text-sm'
    node.textContent = msg
    els.toastRoot.appendChild(node)
    setTimeout(()=>{ node.remove() }, 3000)
  }

  
  // i18n - Using consolidated data loader
  async function loadTranslations(){
    try {
      state.t = await loadTranslationsData(state.lang)
      applyTranslations()
    } catch(e) {
      console.warn('Translations load failed', e)
    }
  }
  
  function applyTranslations(){
    document.documentElement.lang = state.lang
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      if(!key) return
      const text = getNested(state.t, key)
      if(typeof text === 'string') el.textContent = text
    })
    // Update SEO meta based on current route and language
    const currentRoute = (location.hash || '#/home').replace('#/','')
    try { updateSEO(currentRoute, state) } catch(e) {}
  }
  
  function getNested(obj, path){
    return path.split('.').reduce((o,k)=> (o && o[k] != null ? o[k] : undefined), obj)
  }

  // Consolidated data loading using dataLoader module
  async function loadData(){
    try {
      const data = await loadAllData()
      
      // Set state with loaded data
      state.products = data.products
      state.categories = data.categories
      state.featured = data.featured
      state.config = data.config
      
    } catch (error) {
      console.error('Critical data loading error:', error)
      // Fallbacks are already handled by the dataLoader module
      state.products = []
      state.categories = []
      state.featured = []
      state.config = {}
    }
  }

  // Cart animation function
  function animateCartSidebar(){
    const cartSidebar = document.querySelector('#route-store .lg\\:col-span-1')
    if(!cartSidebar) return
    
    // Add zoom animation class
    cartSidebar.style.transform = 'scale(0.8)'
    cartSidebar.style.opacity = '0.5'
    cartSidebar.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease'
    
    // Trigger animation after a short delay
    setTimeout(() => {
      cartSidebar.style.transform = 'scale(1)'
      cartSidebar.style.opacity = '1'
    }, 100)
    
    // Clean up styles after animation
    setTimeout(() => {
      cartSidebar.style.transform = ''
      cartSidebar.style.opacity = ''
      cartSidebar.style.transition = ''
    }, 700)
  }

  // Helper function to get image path using imageUtils
  function getImagePath(filename) {
    return window.imageUtils ? window.imageUtils.getImagePath(filename) : null
  }

  // Create callbacks object for routing module
  const routingCallbacks = {
    closeAllModals,
    updateSEO: (route) => updateSEO(route, state),
    store: {
      renderCategories: () => renderCategories(state, els, () => renderProducts(state, els, fmtCurrency, getImagePath, addToCart)),
      renderProducts: () => renderProducts(state, els, fmtCurrency, getImagePath, addToCart),
      renderCart: () => renderCart(state, els, fmtCurrency, getImagePath),
      renderCartSidebar: () => renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQtyModule, removeFromCartModule, updateCartSidebarTotal),
      renderHistory,
      updateTotal,
      updateCartSidebarTotal: () => updateCartSidebarTotal(state, els, fmtCurrency, cartTotalModule),
      animateCartSidebar
    },
    home: {
      renderFeaturedProducts
    },
    admin: {
      updateAdminUI,
      renderAdminRows
    }
  }

  
  // Cart operations - Using imported modules directly
  function addToCart(id){
    addToCartModule(state, id)
    
    // Play sound and update UI
    playAddToCartSound()
    updateCartBadges(state, els)
    renderCart(state, els, fmtCurrency, getImagePath)
    renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQtyModule, removeFromCartModule, updateCartSidebarTotal)
    updateTotal()
    updateCartSidebarTotal(state, els, fmtCurrency, cartTotalModule)
    showToast(state.lang==='es'?'Añadido al carrito':'Added to cart')
  }
  function updateTotal(){
    if(!els.orderTotal) return
    const shipType = document.getElementById('shippingType')?.value || 'sea'
    const base = cartTotalModule(state)
    const total = shipType === 'air' ? base * 1.10 : base
    els.orderTotal.textContent = fmtCurrency(total)
    updateCheckoutSummary()
  }

  function updateCheckoutSummary(){
    if(!els.checkoutItemCount) return
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0)
    const text = state.lang === 'es' ? 
      (count === 0 ? 'Sin productos' : count === 1 ? '1 producto' : `${count} productos`) :
      (count === 0 ? 'No products' : count === 1 ? '1 product' : `${count} products`)
    els.checkoutItemCount.textContent = text
  }

  // Checkout
  els.checkoutForm?.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(state.cart.length === 0){ return showToast(state.lang==='es'?'Agrega productos al carrito':'Add items to cart') }
    const name = document.getElementById('buyerName').value.trim()
    const phone = document.getElementById('buyerWhatsapp').value.trim()
    const shipType = document.getElementById('shippingType').value
    const base = cartTotalModule(state)
    const total = shipType === 'air' ? base*1.10 : base

    const order = {
      id: 'ORD-' + Date.now(),
      date: new Date().toISOString(),
      buyer: { name, phone },
      shipping: shipType,
      items: state.cart.map(it=>({ ...it })),
      total,
      status: 'new'
    }

    // Save to history using state helper
    stateHelpers.addToHistory(state, order)

    // Play order sent sound and show success message
    playOrderSentSound()
    showToast(state.lang==='es'?'Solicitud enviada a la empresa':'Request sent to company')
    
    // Clear form fields
    document.getElementById('buyerName').value = ''
    document.getElementById('buyerWhatsapp').value = ''
    
    // Clear cart after a short delay
    setTimeout(()=>{
      stateHelpers.clearCart(state)
      updateCartBadges(state, els)
      renderCart(state, els, fmtCurrency, getImagePath)
      renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQtyModule, removeFromCartModule, updateCartSidebarTotal)
      updateTotal()
      updateCartSidebarTotal(state, els, fmtCurrency, cartTotalModule)
      renderHistory()
    }, 500)
  })
  document.getElementById('shippingType')?.addEventListener('change', updateTotal)

  function renderHistory(){
    const ul = els.sessionHistory
    if(!ul) return
    ul.innerHTML = ''
    if(state.history.length === 0){
      const li = document.createElement('li')
      li.textContent = state.lang==='es'?'Aún no hay solicitudes.':'No requests yet.'
      ul.appendChild(li)
      return
    }
    state.history.forEach(o => {
      const li = document.createElement('li')
      const count = o.items.reduce((a,b)=>a+b.qty,0)
      li.innerHTML = `<div class="flex items-center justify-between gap-3">
        <div>
          <div class="font-medium">${new Date(o.date).toLocaleString()}</div>
          <div class="text-slate-600 text-xs">${count} items • ${o.shipping==='air'?'Aéreo':'Marítimo'}</div>
        </div>
        <div class="font-semibold">${fmtCurrency(o.total)}</div>
      </div>`
      ul.appendChild(li)
    })
  }

  // Admin area
  function updateAdminUI(){
    const isAuthed = !!state.admin
    els.adminLogin.classList.toggle('hidden', isAuthed)
    els.adminDashboard.classList.toggle('hidden', !isAuthed)
    
    // Hide/show admin menu links
    const adminLinks = document.querySelectorAll('[data-nav="admin"]')
    adminLinks.forEach(link => {
      if (isAuthed) {
        link.classList.remove('hidden')
      } else {
        link.classList.add('hidden')
      }
    })
  }

  els.adminLoginForm?.addEventListener('submit', (e)=>{
    e.preventDefault()
    const u = document.getElementById('adminUser').value
    const p = document.getElementById('adminPass').value
    if(u===ADMIN.user && p===ADMIN.pass){
      state.admin = { user: u, at: Date.now() }
      saveJSON(STORAGE_KEYS.adminSession, state.admin)
      updateAdminUI(); renderAdminRows(); showToast('Bienvenido')
    } else {
      showToast('Acceso denegado')
    }
  })
  els.btnAdminLogout?.addEventListener('click', ()=>{
    state.admin = null
    localStorage.removeItem(STORAGE_KEYS.adminSession)
    updateAdminUI()
  })

  function filteredOrders(){
    const q = (els.adminSearch?.value || '').toLowerCase()
    const s = els.adminFilterShipping?.value || ''
    const st = els.adminFilterStatus?.value || ''
    return state.history.filter(o => {
      const buyerText = `${o.buyer.name} ${o.buyer.phone}`.toLowerCase()
      if(q && !buyerText.includes(q)) return false
      if(s && o.shipping !== s) return false
      if(st && o.status !== st) return false
      return true
    })
  }
  function renderAdminRows(){
    const tbody = els.adminRows
    if(!tbody) return
    tbody.innerHTML = ''
    filteredOrders().forEach(o => {
      const tr = document.createElement('tr')
      const itemsTxt = o.items.map(it => {
        const p = state.products.find(x=>x.id===it.id)
        return `${p?p.name:it.id} x ${it.qty}`
      }).join(', ')
      tr.innerHTML = `
        <td class="p-2 align-top">${new Date(o.date).toLocaleString()}</td>
        <td class="p-2 align-top">${o.buyer.name}</td>
        <td class="p-2 align-top">${o.buyer.phone}</td>
        <td class="p-2 align-top">${o.shipping==='air'?'Aéreo':'Marítimo'}</td>
        <td class="p-2 align-top">${fmtCurrency(o.total)}</td>
        <td class="p-2 align-top">${itemsTxt}</td>
        <td class="p-2 align-top">${o.status==='contacted'?'Contactado':'Nuevo'}</td>
        <td class="p-2 align-top">
          <button class="px-2 py-1 border rounded text-xs" data-mark>${o.status==='contacted'?'Marcar nuevo':'Marcar contactado'}</button>
        </td>`
      tr.querySelector('[data-mark]').onclick = ()=> {
        o.status = o.status==='contacted'?'new':'contacted'
        saveJSON(STORAGE_KEYS.history, state.history)
        renderAdminRows()
      }
      tbody.appendChild(tr)
    })
  }
  els.adminSearch?.addEventListener('input', renderAdminRows)
  els.adminFilterShipping?.addEventListener('change', renderAdminRows)
  els.adminFilterStatus?.addEventListener('change', renderAdminRows)
  els.btnExportCSV?.addEventListener('click', ()=>{
    const rows = [['Fecha','Nombre','WhatsApp','Envio','Total','Items','Estado']]
    filteredOrders().forEach(o => {
      const itemsTxt = o.items.map(it => {
        const p = state.products.find(x=>x.id===it.id)
        return `${p?p.name:it.id} x ${it.qty}`
      }).join(' | ')
      rows.push([
        new Date(o.date).toISOString(), o.buyer.name, o.buyer.phone,
        o.shipping, o.total, itemsTxt, o.status
      ])
    })
    const csv = rows.map(r => r.map(x => '"'+String(x).replaceAll('"','""')+'"').join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'solicitudes.csv'; a.click()
    URL.revokeObjectURL(url)
  })

  // Language switch
  function setLang(l){
    state.lang = l
    saveJSON(STORAGE_KEYS.lang, l)
    try {
      const url = new URL(window.location.href)
      url.searchParams.set('lang', l)
      history.replaceState(null, '', url.toString())
    } catch(e) {}
    loadTranslations()
    try { updateHreflangLinks() } catch(e) {}
  }
  els.langES?.addEventListener('click', ()=> setLang('es'))
  els.langEN?.addEventListener('click', ()=> setLang('en'))

  // Cart sidebar shipping change listener - now handled by shippingType
  document.getElementById('shippingType')?.addEventListener('change', () => updateCartSidebarTotal(state, els, fmtCurrency, cartTotalModule))
  
  
  // Cart button click handler with mobile modal support
  els.cartBadgeDesktop?.parentElement?.addEventListener('click', (e) => {
    e.preventDefault()
    
    // On mobile, open cart modal
    if (window.innerWidth <= 430) {
      const currentRoute = location.hash.replace('#/', '') || 'home'
      if (currentRoute === 'store') {
        openMobileCartModal()
      } else {
        location.hash = '#/store'
        setTimeout(openMobileCartModal, 300)
      }
      return
    }
    
    // Desktop behavior - just navigate to store, routing module handles the rest
    const currentRoute = location.hash.replace('#/', '') || 'home'
    if(currentRoute !== 'store') {
      location.hash = '#/store'
    }
  })

  // Featured products rendering
  function renderFeaturedProducts() {
    const grid = document.getElementById('featured-products-grid')
    if (!grid) return
    
    grid.innerHTML = ''
    
    // Get featured products from state
    const featuredProducts = state.featured
      .map(id => state.products.find(p => p.id === id))
      .filter(p => p) // Remove any undefined products
      .slice(0, 6) // Limit to 6 products
    
    if (featuredProducts.length === 0) {
      // Fallback to first 6 products if no featured products found
      const fallbackProducts = state.products.slice(0, 6)
      fallbackProducts.forEach(product => {
        const card = createFeaturedProductCard(product)
        grid.appendChild(card)
      })
      return
    }
    
    // Render featured products
    featuredProducts.forEach(product => {
      const card = createFeaturedProductCard(product)
      grid.appendChild(card)
    })
  }

  function createFeaturedProductCard(product) {
    const card = document.createElement('div')
    card.className = 'group border rounded-lg p-4 bg-white hover:shadow transition-shadow cursor-pointer'
    
    card.innerHTML = `
      <div class="aspect-square bg-slate-100 rounded overflow-hidden mb-3">
        ${product.image ? 
          `<img src="${getImagePath(product.image)}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">` : 
          `<div class="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>`
        }
      </div>
      <div class="text-sm font-medium truncate">${product.name}</div>
      <div class="text-xs text-slate-600 mt-1">${fmtCurrency(product.price)}</div>
      <div class="text-xs text-brand-600 mt-2 group-hover:underline" data-i18n="home.seeStore">Ver en tienda</div>
    `
    // Click handler to go to store and highlight product
    card.onclick = () => {
      location.hash = '#/store'
      setTimeout(() => {
        const productCards = document.querySelectorAll('.product-card')
        productCards.forEach(productCard => {
          const productName = productCard.querySelector('h3')?.textContent || productCard.querySelector('.font-medium')?.textContent
          if (productName === product.name) {
            productCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
            productCard.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)'
            productCard.style.transform = 'scale(1.02)'
            setTimeout(() => {
              productCard.style.boxShadow = ''
              productCard.style.transform = ''
            }, 2000)
          }
        })
      }, 500)
    }
    
    return card
  }

  // Price and sort filters
  function setupFilters() {
    // Price range filters
    const priceRangeInputs = document.querySelectorAll('input[name="price-range"]')
    const priceMinInput = document.getElementById('price-min')
    const priceMaxInput = document.getElementById('price-max')
    const applyPriceButton = document.getElementById('apply-price-filter')
    const sortSelect = document.getElementById('sort-select')

    // Price range radio buttons
    priceRangeInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (input.checked) {
          state.priceRange = input.value
          if (priceMinInput) priceMinInput.value = ''
          if (priceMaxInput) priceMaxInput.value = ''
          applyFilters()
        }
      })
    })

    // Custom price range
    if (applyPriceButton) {
      applyPriceButton.addEventListener('click', () => {
        const min = parseFloat(priceMinInput?.value) || 0
        const max = parseFloat(priceMaxInput?.value) || Infinity
        state.priceRange = `${min}-${max}`
        
        // Uncheck radio buttons
        priceRangeInputs.forEach(input => input.checked = false)
        applyFilters()
      })
    }

    // Sort dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        state.sortBy = sortSelect.value
        applyFilters()
      })
    }
  }

  function applyFilters() {
    let filteredProducts = [...state.products]

    // Apply category filter
    if (state.activeCategory) {
      filteredProducts = filteredProducts.filter(p => p.categoryId === state.activeCategory)
    }

    // Apply price filter
    if (state.priceRange) {
      filteredProducts = filteredProducts.filter(p => {
        if (state.priceRange === '500+') {
          return p.price >= 500
        }
        
        const [min, max] = state.priceRange.split('-').map(v => parseFloat(v))
        if (isNaN(max)) {
          return p.price >= min
        }
        return p.price >= min && p.price <= max
      })
    }

    // Apply sorting
    if (state.sortBy) {
      switch (state.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price)
          break
        case 'name-asc':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name-desc':
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
          break
      }
    }

    renderFilteredProducts(filteredProducts)
    
    // Update results count
    const resultsCount = document.getElementById('results-count')
    const searchResults = document.getElementById('search-results-info')
    if (resultsCount && searchResults) {
      resultsCount.textContent = filteredProducts.length
      if (state.activeCategory || state.priceRange || state.sortBy) {
        searchResults.classList.remove('hidden')
      } else {
        searchResults.classList.add('hidden')
      }
    }
  }

  function renderFilteredProducts(products) {
    const grid = document.getElementById('product-grid')
    if (!grid) return
    
    grid.innerHTML = ''
    
    if (products.length === 0) {
      const noResults = document.createElement('div')
      noResults.className = 'col-span-full text-center py-12 text-slate-500'
      noResults.innerHTML = `
        <svg class="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <p class="text-lg font-medium">No se encontraron productos</p>
        <p class="text-sm">Intenta ajustar los filtros</p>
      `
      grid.appendChild(noResults)
      return
    }

    products.forEach(p => {
      const card = document.createElement('div')
      card.className = 'group relative product-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
      
      const imagePath = p.image ? getImagePath(p.image) : null
      
      card.innerHTML = `
        <div class="aspect-square w-full overflow-hidden bg-gray-100 relative">
          ${imagePath ? 
            `<img src="${imagePath}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" loading="lazy">` : 
            `<div class="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>`
          }
        </div>
        <div class="p-4">
          <h3 class="text-sm font-medium text-gray-900 truncate">
            <a href="#" class="product-link hover:text-indigo-600">
              ${p.name}
            </a>
          </h3>
          <p class="mt-1 text-xs text-gray-500 line-clamp-2">${p.short || ''}</p>
          <div class="mt-3 flex items-center justify-between">
            <p class="text-sm font-semibold text-gray-900">${fmtCurrency(p.price)}</p>
          </div>
          <div class="mt-3 flex gap-2">
            <button class="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" data-act="details">
              Detalles
            </button>
            <button class="flex-1 bg-indigo-600 py-2 px-3 border border-transparent rounded-md shadow-sm text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" data-act="add">
              Añadir
            </button>
          </div>
        </div>`
      
      const addBtn = card.querySelector('[data-act="add"]')
      const detailsBtn = card.querySelector('[data-act="details"]')
      const productLink = card.querySelector('.product-link')
      
      if(addBtn) addBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); addToCart(p.id) }
      if(detailsBtn) detailsBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openProductModal(p) }
      if(productLink) productLink.onclick = (e) => { e.preventDefault(); openProductModal(p) }
      
      grid.appendChild(card)
    })
  }

  // Clear all filters
  function clearAllFilters() {
    state.activeCategory = ''
    state.priceRange = ''
    state.sortBy = ''
    state.searchQuery = ''
    
    // Reset UI
    const searchInput = document.getElementById('product-search')
    if (searchInput) searchInput.value = ''
    
    const priceRangeInputs = document.querySelectorAll('input[name="price-range"]')
    priceRangeInputs.forEach(input => {
      input.checked = input.value === ''
    })
    
    const priceMinInput = document.getElementById('price-min')
    const priceMaxInput = document.getElementById('price-max')
    if (priceMinInput) priceMinInput.value = ''
    if (priceMaxInput) priceMaxInput.value = ''
    
    const sortSelect = document.getElementById('sort-select')
    if (sortSelect) sortSelect.value = ''
    
    renderProducts(state, els, fmtCurrency, getImagePath, addToCart)
    renderCategories(state, els, () => renderProducts(state, els, fmtCurrency, getImagePath, addToCart))
    
    const searchResults = document.getElementById('search-results-info')
    searchResults?.classList.add('hidden')
  }

  // Setup navigation event listeners
  function setupNavigation() {
    // Setup navigation links
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const route = link.getAttribute('data-nav')
        if (route && routes.includes(route)) {
          location.hash = route === 'home' ? '#/' : `#/${route}`
        }
      })
    })
  }

  // Boot
  ;(async function init(){
    await loadData()
    await loadTranslations()
    updateCartBadges(state, els) // Initialize cart badges
    setupMobileNavigation() // Setup mobile navigation
    setupNavigation() // Setup navigation event listeners
    setupSearch(state, showToast, renderFilteredProducts, () => renderProducts(state, els, fmtCurrency, getImagePath, addToCart), () => renderCategories(state, els, () => renderProducts(state, els, fmtCurrency, getImagePath, addToCart))) // Setup search functionality
    setupFilters() // Setup price and sort filters
    
    // Initialize routing system with callbacks
    const routing = initRouting(els, state, routingCallbacks)
    
    // Setup clear all filters button
    const clearAllFiltersBtn = document.getElementById('clear-all-filters')
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener('click', clearAllFilters)
    }
  })();
});
