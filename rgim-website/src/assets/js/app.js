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
  getState, 
  setState, 
  stateHelpers,
  STORAGE_KEYS 
} from './core/state.js'

import { 
  routes,
  setActiveRoute, 
  handleHashChange, 
  initRouting,
  navigationHelpers 
} from './core/routing.js'

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
  setupSearch,
  aiSearch,
  performSearch
} from './store/search.js'

import { 
  openModal,
  closeModal,
  closeAllModals
} from './ui/modal.js'

import { 
  renderProducts,
  openProductModal
} from './store/products.js'

import { 
  renderCategories,
  makeCatButton
} from './store/categories.js'

// Import mobile modules
import { 
  setupMobileNavigation,
  openMobileCartModal,
  closeMobileCartModal,
  renderMobileCartItems
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

  // Smart image path resolver with fallback support
  function getImagePath(filename) {
    if (!filename) return null
    
    // Remove file extension to get base name
    const baseName = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '')
    
    // Return the most likely to exist format first
    // Based on the file listing, most images have -medium.jpg format
    return `./src/assets/images/optimized/${baseName}-medium.jpg`
  }

  // Enhanced image element creator with fallback support
  function createImageElement(filename, alt, className = '', attributes = {}) {
    if (!filename) return ''
    
    const baseName = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '')
    
    // Define fallback chain in order of preference
    const fallbacks = [
      `./src/assets/images/optimized/${baseName}-medium.jpg`,
      `./src/assets/images/optimized/${baseName}_medium.jpg`,
      `./src/assets/images/optimized/${baseName}-medium.png`,
      `./src/assets/images/optimized/${baseName}_medium.webp`,
      `./src/assets/images/optimized/${baseName}-thumbnail.jpg`,
      `./src/assets/images/optimized/${baseName}_thumbnail.jpg`
    ]
    
    const attrs = Object.entries(attributes).map(([key, value]) => `${key}="${value}"`).join(' ')
    
    return `<img src="${fallbacks[0]}" alt="${alt}" class="${className}" ${attrs} 
      onerror="
        const fallbacks = ${JSON.stringify(fallbacks)};
        const currentIndex = fallbacks.indexOf(this.src.split('/').pop().includes('${baseName}') ? this.src : '');
        if (currentIndex < fallbacks.length - 1) {
          this.src = fallbacks[currentIndex + 1];
        } else {
          this.style.display = 'none';
          console.log('❌ All image fallbacks failed for: ${filename}');
        }
      "
      onload="console.log('✅ Image loaded: ' + this.src)"
    >`
  }

  function showToast(msg){
    const node = document.createElement('div')
    node.className = 'pointer-events-auto bg-slate-900 text-white px-4 py-2 rounded shadow text-sm'
    node.textContent = msg
    els.toastRoot.appendChild(node)
    setTimeout(()=>{ node.remove() }, 3000)
  }

  
  // i18n
  async function loadTranslations(){
    try {
      const res = await fetch('./src/data/config/translations.json')
      const data = await res.json()
      state.t = data[state.lang] || data['es'] || {}
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
    try { updateSEO(currentRoute) } catch(e) {}
  }

  // SEO helpers
  function upsertMetaByName(name, content){
    let el = document.querySelector('meta[name="'+name+'"]')
    if(!el){
      el = document.createElement('meta')
      el.setAttribute('name', name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }
  function upsertMetaByProp(prop, content){
    let el = document.querySelector('meta[property="'+prop+'"]')
    if(!el){
      el = document.createElement('meta')
      el.setAttribute('property', prop)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }
  function setCanonical(href){
    let link = document.querySelector('link[rel="canonical"]')
    if(!link){
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', href)
    upsertMetaByProp('og:url', href)
  }
  function ensureAltLink(hreflang){
    let link = document.querySelector('link[rel="alternate"][hreflang="'+hreflang+'"]')
    if(!link){
      link = document.createElement('link')
      link.setAttribute('rel', 'alternate')
      link.setAttribute('hreflang', hreflang)
      document.head.appendChild(link)
    }
    return link
  }
  function updateHreflangLinks(){
    const base = location.origin + location.pathname
    const hash = location.hash || '#/home'
    const esUrl = base + '?lang=es' + hash
    const enUrl = base + '?lang=en' + hash
    const defUrl = base + hash
    ensureAltLink('es').setAttribute('href', esUrl)
    ensureAltLink('en').setAttribute('href', enUrl)
    ensureAltLink('x-default').setAttribute('href', defUrl)
  }
  function updateSEO(route){
    const seo = (state.t.seo && state.t.seo[route]) || (state.t.seo && state.t.seo.home) || null
    if(seo && seo.title){ document.title = seo.title }
    const desc = seo && seo.description ? seo.description : ''
    if(desc){
      upsertMetaByName('description', desc)
      upsertMetaByName('twitter:description', desc)
      upsertMetaByProp('og:description', desc)
    }
    const title = seo && seo.title ? seo.title : document.title
    upsertMetaByName('twitter:title', title)
    upsertMetaByProp('og:title', title)
    // Robots per route
    const robots = route === 'admin' ? 'noindex,nofollow' : 'index,follow'
    upsertMetaByName('robots', robots)
    // Locale
    upsertMetaByProp('og:locale', state.lang === 'es' ? 'es_PA' : 'en_US')
    // Canonical per language (avoid hash)
    const canonical = location.origin + location.pathname + '?lang=' + (state.lang || 'es')
    setCanonical(canonical)
    // Hreflang alternates
    updateHreflangLinks()
    try { updateFAQSchema(route) } catch(e) {}
  }
  // JSON-LD: FAQ schema per route
  function updateFAQSchema(route){
    const prev = document.getElementById('faq-jsonld')
    if(prev) prev.remove()
    if(route !== 'faq' && route !== 'home') return
    const faq = state.t.faq || {}
    const items = []
    for(let i=1;i<=10;i++){
      const q = faq['q'+i], a = faq['a'+i]
      if(q && a){
        items.push({
          '@type': 'Question',
          'name': q,
          'acceptedAnswer': { '@type': 'Answer', 'text': a }
        })
      }
    }
    if(items.length === 0) return
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': items
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'faq-jsonld'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }
  function getNested(obj, path){
    return path.split('.').reduce((o,k)=> (o && o[k] != null ? o[k] : undefined), obj)
  }

  // Data loading with cache management
  async function loadData(){
    console.log('Starting data loading...')
    try {
      // Simplified loading - skip cache for now
      console.log('Loading products.json...')
      const prodRes = await fetch('./src/data/store/products.json')
      if (!prodRes.ok) {
        throw new Error(`Failed to load products: ${prodRes.status} ${prodRes.statusText}`)
      }
      const products = await prodRes.json()
      console.log('Products loaded:', products.length, 'items')

      console.log('Loading categories.json...')
      const catRes = await fetch('./src/data/store/categories.json')
      if (!catRes.ok) {
        throw new Error(`Failed to load categories: ${catRes.status} ${catRes.statusText}`)
      }
      const categories = await catRes.json()
      console.log('Categories loaded:', categories.length, 'items')

      // Load other optional files
      let featured = []
      let config = {}
      
      try {
        const featRes = await fetch('./src/data/store/destacados.json')
        if (featRes.ok) {
          const featData = await featRes.json()
          featured = featData.featured || []
          console.log('Featured products loaded:', featured.length, 'items')
        }
      } catch (e) {
        console.warn('Featured products not loaded:', e.message)
      }

      try {
        const configRes = await fetch('./src/data/config/config.json')
        if (configRes.ok) {
          config = await configRes.json()
          console.log('Config loaded successfully')
        }
      } catch (e) {
        console.warn('Config not loaded:', e.message)
      }

      // Set state
      state.products = products
      state.categories = categories
      state.featured = featured
      state.config = config
      
      console.log('Data loading completed successfully')
      console.log('Final state:', {
        products: state.products.length,
        categories: state.categories.length,
        featured: state.featured.length
      })

    } catch (error) {
      console.error('Critical data loading error:', error)
      // Set empty arrays to prevent crashes
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

  // Create callbacks object for routing module
  const routingCallbacks = {
    closeAllModals,
    updateSEO,
    store: {
      renderCategories: renderCategoriesLocal,
      renderProducts: renderProductsLocal,
      renderCart: () => renderCart(state, els, fmtCurrency, getImagePath),
      renderCartSidebar: () => renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQty, removeFromCart, updateCartSidebarTotal),
      renderHistory,
      updateTotal,
      updateCartSidebarTotal: () => updateCartSidebarTotal(state, els, fmtCurrency, cartTotal),
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

  // Store rendering - Using imported modules
  function renderCategoriesLocal(){
    renderCategories(state, els, renderProductsLocal)
  }
  
  function renderProductsLocal(){
    renderProducts(state, els, fmtCurrency, getImagePath, addToCart)
  }

  function openProductModalLocal(p){
    openProductModal(p, els, fmtCurrency, getImagePath, addToCart)
  }

  // Cart - Using imported modules
  function addToCart(id){
    addToCartModule(state, id)
    
    // Play sound and update UI
    playAddToCartSound()
    updateCartBadges(state, els)
    renderCart(state, els, fmtCurrency, getImagePath)
    renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQty, removeFromCart, updateCartSidebarTotal)
    updateTotal()
    updateCartSidebarTotal(state, els, fmtCurrency, cartTotal)
    showToast(state.lang==='es'?'Añadido al carrito':'Added to cart')
  }
  function removeFromCart(id){
    removeFromCartModule(state, id)
    updateCartBadges(state, els)
    renderCart(state, els, fmtCurrency, getImagePath)
    renderCartSidebar(state, els, fmtCurrency, getImagePath, changeQty, removeFromCart, updateCartSidebarTotal)
    updateTotal()
    updateCartSidebarTotal(state, els, fmtCurrency, cartTotal)
  }
  function changeQty(id, delta){
    changeQtyModule(state, id, delta)
    updateCartBadges(state, els)
    renderCart(state, els, fmtCurrency, getImagePath)
    updateTotal()
  }
  function cartTotal(){
    return cartTotalModule(state)
  }
  function updateTotal(){
    if(!els.orderTotal) return
    const shipType = document.getElementById('shippingType')?.value || 'sea'
    const base = cartTotal()
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
  function renderCart(){
    const wrap = els.cartItems
    if(!wrap) return
    wrap.innerHTML = ''
    if(state.cart.length === 0){
      const empty = document.createElement('div')
      empty.className = 'text-slate-500 text-sm'
      empty.textContent = state.lang==='es'? 'Tu carrito está vacío.' : 'Your cart is empty.'
      wrap.appendChild(empty)
      return
    }
    state.cart.forEach(it => {
      const p = state.products.find(x => x.id === it.id)
      if(!p) return
      const row = document.createElement('div')
      row.className = 'flex items-center gap-3 border rounded p-3 bg-white'
      row.innerHTML = `
        <div class="w-14 h-14 bg-slate-100 rounded overflow-hidden">${p.image?`<img src="${getImagePath(p.image)}" alt="${p.name}" class="w-full h-full object-cover" onerror="this.style.display='none'">`:''}</div>
        <div class="flex-1">
          <div class="font-medium">${p.name}</div>
          <div class="text-sm text-slate-600">${fmtCurrency(p.price)} x ${it.qty} = <span class="font-semibold">${fmtCurrency(p.price*it.qty)}</span></div>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-2 py-1 border rounded" data-dec>-</button>
          <div class="w-8 text-center">${it.qty}</div>
          <button class="px-2 py-1 border rounded" data-inc>+</button>
        </div>
        <button class="px-3 py-1 border rounded text-red-600" data-del>Eliminar</button>`
      row.querySelector('[data-dec]').onclick = ()=> changeQty(it.id, -1)
      row.querySelector('[data-inc]').onclick = ()=> changeQty(it.id, +1)
      row.querySelector('[data-del]').onclick = ()=> removeFromCart(it.id)
      wrap.appendChild(row)
    })
  }

  // Checkout
  els.checkoutForm?.addEventListener('submit', (e)=>{
    e.preventDefault()
    if(state.cart.length === 0){ return showToast(state.lang==='es'?'Agrega productos al carrito':'Add items to cart') }
    const name = document.getElementById('buyerName').value.trim()
    const phone = document.getElementById('buyerWhatsapp').value.trim()
    const shipType = document.getElementById('shippingType').value
    const base = cartTotal()
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
      updateCartBadges()
      renderCart()
      renderCartSidebar()
      updateTotal()
      updateCartSidebarTotal()
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
  document.getElementById('shippingType')?.addEventListener('change', () => updateCartSidebarTotal(state, els, fmtCurrency, cartTotal))
  
  
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
        setTimeout(() => {
          setActiveRoute('store', true)
          setTimeout(openMobileCartModal, 300)
        }, 50)
      }
      return
    }
    
    // Desktop behavior
    const currentRoute = location.hash.replace('#/', '') || 'home'
    if(currentRoute !== 'store') {
      location.hash = '#/store'
      setTimeout(() => setActiveRoute('store', true), 50)
    }
  })

  // AI Search with Gemini
  async function aiSearch(query, products) {
    const apiKey = state.config?.ai?.gemini?.apiKey
    const model = state.config?.ai?.gemini?.model || 'gemini-2.0-flash-exp'
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('API key not configured')
    }

    const productsData = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.short || p.description || '',
      category: p.categoryId || ''
    }))

    const prompt = `Un usuario está haciendo una búsqueda y está introduciendo la cadena de texto "${query}". ¿Cuál de los siguientes productos del siguiente JSON puede ser resultado de esta búsqueda?

${JSON.stringify(productsData, null, 2)}

Responde únicamente con un array JSON de los IDs de productos que coincidan con la búsqueda, ordenados por relevancia. Ejemplo: ["id1", "id2", "id3"]`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) {
        throw new Error('No response from Gemini')
      }

      const productIds = JSON.parse(text.trim())
      return products.filter(p => productIds.includes(p.id))
    } catch (e) {
      clearTimeout(timeoutId)
      if (e.name === 'AbortError') {
        throw new Error('Search timeout')
      }
      console.warn('Failed to parse AI response, falling back to basic search')
      throw e
    }
  }

  // Search functionality
  function setupSearch() {
    const searchInput = document.getElementById('product-search')
    const searchButton = document.getElementById('search-button')
    const clearButton = document.getElementById('clear-search')
    const searchLoading = document.getElementById('search-loading')
    const searchResults = document.getElementById('search-results-info')
    const resultsCount = document.getElementById('results-count')
    const clearAllFilters = document.getElementById('clear-all-filters')

    if (!searchInput) return

    let searchTimeout = null

    // Search function
    async function performSearch(query) {
      if (!query || query.trim().length < 2) {
        state.searchQuery = ''
        state.activeCategory = ''
        renderProducts()
        searchResults?.classList.add('hidden')
        clearButton?.classList.add('hidden')
        return
      }

      // Show loading
      searchLoading?.classList.remove('hidden')
      searchButton?.classList.add('hidden')

      try {
        let results = []
        
        // Try AI search first
        try {
          results = await aiSearch(query.trim(), state.products)
          console.log('AI search successful:', results.length, 'results')
        } catch (aiError) {
          console.warn('AI search failed, using basic search:', aiError.message)
          
          // Fallback to basic search
          const searchTerm = query.toLowerCase().trim()
          results = state.products.filter(product => {
            const searchableText = [
              product.name,
              product.short || '',
              product.description || '',
              product.categoryId || ''
            ].join(' ').toLowerCase()
            
            return searchableText.includes(searchTerm)
          })
        }

        // Update state and render
        state.searchQuery = query.trim()
        state.activeCategory = '' // Clear category filter when searching
        
        // Render filtered products
        renderFilteredProducts(results)
        
        // Show results info
        if (resultsCount) resultsCount.textContent = results.length
        searchResults?.classList.remove('hidden')
        clearButton?.classList.remove('hidden')
        clearAllFilters?.classList.remove('hidden')

      } catch (error) {
        console.error('Search error:', error)
        showToast('Error en la búsqueda')
      } finally {
        // Hide loading
        searchLoading?.classList.add('hidden')
        searchButton?.classList.remove('hidden')
      }
    }

    // Render filtered products
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
          <p class="text-sm">Intenta con otros términos de búsqueda</p>
        `
        grid.appendChild(noResults)
        return
      }

      products.forEach(p => {
        const card = document.createElement('div')
        card.className = 'border rounded-lg overflow-hidden bg-white hover:shadow flex flex-col product-card'
        
        // Mobile-optimized layout
        const isMobile = window.innerWidth <= 430
        
        if (isMobile) {
          // Mobile: simplified layout without details button
          const imagePath = p.image ? getImagePath(p.image) : null
          card.innerHTML = `
            <div class="aspect-square bg-slate-100 relative">
              ${imagePath ? `<img src="${imagePath}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover" loading="lazy">` : ''}
            </div>
            <div class="p-3 flex-1 flex flex-col">
              <div class="font-medium text-sm">${p.name}</div>
              <div class="text-xs text-slate-600 mt-1">${p.short || ''}</div>
              <div class="mt-auto pt-2">
                <div class="font-semibold text-sm mb-2">${fmtCurrency(p.price)}</div>
                <button class="w-full px-3 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 text-sm font-medium" data-act="add">Añadir al carrito</button>
              </div>
            </div>`
          
          // Make entire card clickable for details on mobile
          card.style.cursor = 'pointer'
          card.onclick = (e) => {
            if (!e.target.closest('[data-act="add"]')) {
              openProductModal(p)
            }
          }
        } else {
          // Desktop: full layout with details button
          const imagePath = p.image ? getImagePath(p.image) : null
          card.innerHTML = `
            <div class="aspect-square bg-slate-100 relative">
              ${imagePath ? `<img src="${imagePath}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover" loading="lazy">` : ''}
            </div>
            <div class="p-4 flex-1 flex flex-col">
              <div class="font-medium">${p.name}</div>
              <div class="text-sm text-slate-600 mt-1">${p.short || ''}</div>
              <div class="mt-auto flex items-center justify-between gap-2 pt-3">
                <div class="font-semibold">${fmtCurrency(p.price)}</div>
                <div class="flex items-center gap-2">
                  <button class="px-3 py-1 border rounded hover:bg-slate-50" data-act="details">Detalles</button>
                  <button class="px-3 py-1 bg-brand-600 text-white rounded hover:bg-brand-700" data-act="add">Añadir</button>
                </div>
              </div>
            </div>`
          
          card.querySelector('[data-act="details"]').onclick = () => openProductModal(p)
        }
        
        // Add to cart button handler
        card.querySelector('[data-act="add"]').onclick = (e) => {
          e.stopPropagation()
          addToCart(p.id)
        }
        
        grid.appendChild(card)
      })
    }

    // Clear search
    function clearSearch() {
      searchInput.value = ''
      state.searchQuery = ''
      state.activeCategory = ''
      renderProducts()
      renderCategories() // Re-render categories to reset active state
      searchResults?.classList.add('hidden')
      clearButton?.classList.add('hidden')
      clearAllFilters?.classList.add('hidden')
    }

    // Event listeners
    searchButton?.addEventListener('click', () => {
      performSearch(searchInput.value)
    })

    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        performSearch(searchInput.value)
      }
    })

    searchInput?.addEventListener('input', (e) => {
      const query = e.target.value
      
      // Clear timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      
      // Show/hide clear button
      if (query.length > 0) {
        clearButton?.classList.remove('hidden')
      } else {
        clearButton?.classList.add('hidden')
      }
      
      // Auto-search with debounce (optional)
      if (query.length >= 3) {
        searchTimeout = setTimeout(() => {
          performSearch(query)
        }, 500)
      } else if (query.length === 0) {
        clearSearch()
      }
    })

    clearButton?.addEventListener('click', clearSearch)
    clearAllFilters?.addEventListener('click', clearSearch)
  }

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
        setActiveRoute('store')
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
      }, 100)
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
    
    renderProducts()
    renderCategories()
    
    const searchResults = document.getElementById('search-results-info')
    searchResults?.classList.add('hidden')
  }

  // Boot
  ;(async function init(){
    await loadData()
    await loadTranslations()
    updateCartBadges() // Initialize cart badges
    setupMobileNavigation() // Setup mobile navigation
    setupSearch() // Setup search functionality
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
