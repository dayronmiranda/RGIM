/*
  RGIM Single Page Prototype
  - Hash routing: #/home, #/store, #/faq, #/about, #/admin
  - Local/session storage for cart and history
  - JSON data loading for products, categories, translations
  - Simple admin login (single hardcoded user)
  - Fake email submission with toast confirmation
*/

;(function(){
  const routes = ['home','store','faq','about','admin']
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

  const STORAGE_KEYS = {
    cart: 'rgim.cart',
    history: 'rgim.history',
    adminSession: 'rgim.adminSession',
    lang: 'rgim.lang',
  }

  const ADMIN = {
    user: 'rgim',
    pass: 'demo123',
  }

  // Global state
  const state = {
    products: [],
    categories: [],
    featured: [],
    config: {},
    lang: 'es',
    t: {},
    cart: loadJSON(STORAGE_KEYS.cart, []),
    history: loadJSON(STORAGE_KEYS.history, []),
    admin: loadJSON(STORAGE_KEYS.adminSession, null),
    activeCategory: '',
    searchQuery: '',
    aiSearch: null,
    cacheManager: null,
  }
  state.lang = loadJSON(STORAGE_KEYS.lang, 'es')
  // Override language from URL param if provided (?lang=es|en)
  try {
    const urlLang = new URLSearchParams(location.search).get('lang')
    if(urlLang === 'es' || urlLang === 'en'){
      state.lang = urlLang
      saveJSON(STORAGE_KEYS.lang, urlLang)
    }
  } catch(e) {}

  // Utils
  function loadJSON(key, fallback){
    try {
      const raw = localStorage.getItem(key)
      if(!raw) return fallback
      return JSON.parse(raw)
    } catch(e) { return fallback }
  }
  function saveJSON(key, value){ localStorage.setItem(key, JSON.stringify(value)) }

  function fmtCurrency(n){ return new Intl.NumberFormat(state.lang === 'es' ? 'es-PA' : 'en-US', { style:'currency', currency:'USD' }).format(n) }

  // Get optimized image path
  function getOptimizedImagePath(originalPath, size = 'thumbnail') {
    if (!originalPath) return null
    
    // Extract filename from original path
    const filename = originalPath.split('/').pop()
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "")
    
    // Return optimized image path - try both naming conventions
    const optimizedPath1 = `./assets/images/optimized/${nameWithoutExt}-${size}.jpg`
    const optimizedPath2 = `./assets/images/optimized/${nameWithoutExt}_${size}.jpg`
    
    // For now, return the first format (with dash)
    // In production, you might want to check which file exists
    return optimizedPath1
  }

  function showToast(msg){
    const node = document.createElement('div')
    node.className = 'pointer-events-auto bg-slate-900 text-white px-4 py-2 rounded shadow text-sm'
    node.textContent = msg
    els.toastRoot.appendChild(node)
    setTimeout(()=>{ node.remove() }, 3000)
  }

  // Modern sound effect for adding to cart with vibration
  function playAddToCartSound(){
    try {
      // Vibrate on mobile devices
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]); // Short vibration pattern
      }
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Modern notification sound - ascending notes
      const frequencies = [440, 523.25, 659.25, 783.99] // A4, C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        oscillator.type = 'sine'
        
        const startTime = audioContext.currentTime + (index * 0.08)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + 0.3)
      })
    } catch(e) {
      console.log('Sound/vibration not available')
    }
  }

  // Modern success sound for order submission with vibration
  function playOrderSentSound(){
    try {
      // Success vibration pattern
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]); // Success vibration pattern
      }
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Success chord progression - more modern and pleasant
      const chords = [
        [523.25, 659.25, 783.99], // C major
        [587.33, 739.99, 880.00], // D major
        [659.25, 830.61, 987.77]  // E major
      ]
      
      chords.forEach((chord, chordIndex) => {
        chord.forEach((freq, noteIndex) => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
          oscillator.type = 'sine'
          
          const startTime = audioContext.currentTime + (chordIndex * 0.2) + (noteIndex * 0.02)
          gainNode.gain.setValueAtTime(0, startTime)
          gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.1)
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6)
          
          oscillator.start(startTime)
          oscillator.stop(startTime + 0.6)
        })
      })
    } catch(e) {
      console.log('Sound/vibration not available')
    }
  }

  // Cart badge update
  function updateCartBadges(){
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0)
    if(els.cartBadgeDesktop){
      if(count > 0){
        els.cartBadgeDesktop.textContent = count > 99 ? '99+' : count
        els.cartBadgeDesktop.classList.remove('hidden')
      } else {
        els.cartBadgeDesktop.classList.add('hidden')
      }
    }
  }

  function renderCartSidebar(){
    const wrap = els.cartSidebarItems
    if(!wrap) return
    wrap.innerHTML = ''
    
    if(state.cart.length === 0){
      const empty = document.createElement('div')
      empty.className = 'text-slate-500 text-center py-8'
      empty.textContent = state.lang==='es'? 'Tu carrito está vacío' : 'Your cart is empty'
      wrap.appendChild(empty)
      return
    }

    state.cart.forEach(it => {
      const p = state.products.find(x => x.id === it.id)
      if(!p) return
      const row = document.createElement('div')
      row.className = 'flex items-center gap-3 border rounded-lg p-3 bg-slate-50'
      
      // Get optimized image for cart sidebar
      const optimizedImage = getOptimizedImagePath(p.image, 'thumbnail')
      
      row.innerHTML = `
        <div class="w-12 h-12 bg-slate-200 rounded overflow-hidden flex-shrink-0">
          ${optimizedImage ? `<img src="${optimizedImage}" alt="${p.name}" class="w-full h-full object-cover">` : ''}
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
        </button>`
      
      row.querySelector('[data-dec]').onclick = ()=> { changeQty(it.id, -1); renderCartSidebar(); updateCartSidebarTotal() }
      row.querySelector('[data-inc]').onclick = ()=> { changeQty(it.id, +1); renderCartSidebar(); updateCartSidebarTotal() }
      row.querySelector('[data-del]').onclick = ()=> { removeFromCart(it.id); renderCartSidebar(); updateCartSidebarTotal() }
      wrap.appendChild(row)
    })
  }

  function updateCartSidebarTotal(){
    if(!els.cartSidebarTotal) return
    const shipType = document.getElementById('shippingType')?.value || 'sea'
    const base = cartTotal()
    const total = shipType === 'air' ? base * 1.10 : base
    els.cartSidebarTotal.textContent = fmtCurrency(total)
  }

  function openModal(html){
    // Close any existing modals first
    closeAllModals()
    
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50'
    overlay.innerHTML = `<div class="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">${html}</div>`
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(overlay) })
    
    // Store reference to cleanup function
    const onEsc = (e) => { 
      if(e.key === 'Escape'){ 
        closeModal(overlay)
      } 
    }
    overlay._escHandler = onEsc
    document.addEventListener('keydown', onEsc)
    
    els.modalRoot.appendChild(overlay)
  }

  function closeModal(overlay) {
    if(overlay && overlay.parentNode) {
      // Remove event listener
      if(overlay._escHandler) {
        document.removeEventListener('keydown', overlay._escHandler)
      }
      overlay.remove()
    }
  }

  function closeAllModals() {
    const modals = els.modalRoot.querySelectorAll('.fixed.inset-0')
    modals.forEach(modal => closeModal(modal))
  }

  // i18n
  async function loadTranslations(){
    try {
      const res = await fetch('./translations.json')
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
    try {
      // Initialize cache manager
      if (window.CacheManager) {
        state.cacheManager = new window.CacheManager({
          cacheVersion: '2.0',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          compressionEnabled: true,
          lazyLoadEnabled: true
        })
        await state.cacheManager.init()
      }

      // Load products with caching
      let products = []
      if (state.cacheManager) {
        try {
          products = await state.cacheManager.loadProducts()
        } catch (error) {
          console.warn('Cache failed, loading from network:', error)
          const prodRes = await fetch('./products.json')
          products = await prodRes.json()
        }
      } else {
        const prodRes = await fetch('./products.json')
        products = await prodRes.json()
      }

      // Load other data normally (smaller files)
      const [catRes, featRes, configRes] = await Promise.all([
        fetch('./categories.json'),
        fetch('./destacados.json').catch(() => ({ featured: [] })),
        fetch('./config.json').catch(() => ({}))
      ])

      state.products = products
      state.categories = await catRes.json()
      state.featured = (await featRes.json()).featured || []
      state.config = await configRes.json()
      
      // Initialize AI search if available
      if (window.AISearch && state.config.ai) {
        state.aiSearch = new window.AISearch(state.config.ai.gemini)
        state.aiSearch.setProducts(state.products)
      }

      // Log cache statistics
      if (state.cacheManager) {
        const stats = state.cacheManager.getCacheStats()
        if (stats) {
          console.log('Cache Stats:', {
            entries: stats.entries,
            sizeKB: stats.totalSizeKB,
            version: stats.version
          })
        }
      }

    } catch (error) {
      console.error('Data loading failed:', error)
      // Fallback to basic loading
      const [prodRes, catRes, featRes, configRes] = await Promise.all([
        fetch('./products.json'), 
        fetch('./categories.json'),
        fetch('./destacados.json').catch(() => ({ featured: [] })),
        fetch('./config.json').catch(() => ({}))
      ])
      state.products = await prodRes.json()
      state.categories = await catRes.json()
      state.featured = (await featRes.json()).featured || []
      state.config = await configRes.json()
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

  // Modern routing without hash
  function setActiveRoute(name, fromCartClick = false, updateHistory = true){
    // Close any open modals when changing routes
    closeAllModals()
    
    routes.forEach(r => {
      const sec = els.routes[r]
      if(!sec) return
      if(r === name){ sec.classList.add('active') } else { sec.classList.remove('active') }
      const a = els.nav[r]
      if(a) a.classList.toggle('text-brand-700', r===name)
    })
    window.scrollTo({top:0, behavior:'smooth'})
    
    // Update browser history and URL
    if(updateHistory) {
      const url = name === 'home' ? '/' : `/${name}`
      const currentUrl = location.pathname
      if(currentUrl !== url) {
        history.pushState({ route: name }, '', url)
      }
    }
    
    // Update SEO for route change
    try { updateSEO(name) } catch(e) {}

    if(name === 'store'){
      renderCategories()
      renderProducts()
      renderCart()
      renderCartSidebar()
      renderHistory()
      updateTotal()
      updateCartSidebarTotal()
      
      // Animate cart sidebar if coming from cart click
      if(fromCartClick){
        setTimeout(animateCartSidebar, 200)
      }
    }
    if(name === 'home'){
      renderFeaturedProducts()
    }
    if(name === 'admin'){
      updateAdminUI()
      renderAdminRows()
    }
  }

  function handleRouteChange(){
    const path = location.pathname
    let route = 'home'
    
    if(path === '/' || path === '/home') {
      route = 'home'
    } else if(path.startsWith('/')) {
      const pathRoute = path.substring(1).split('/')[0]
      if(routes.includes(pathRoute)) {
        route = pathRoute
      }
    }
    
    setActiveRoute(route, false, false)
  }

  // Legacy hash support for backward compatibility
  function handleHashChange(){
    const hash = location.hash
    if(hash && hash.startsWith('#/')) {
      const route = hash.replace('#/','')
      if(routes.includes(route)) {
        // Redirect hash to clean URL
        const url = route === 'home' ? '/' : `/${route}`
        history.replaceState({ route }, '', url)
        setActiveRoute(route, false, false)
        return
      }
    }
    handleRouteChange()
  }

  // Store rendering
  function renderCategories(){
    const wrap = els.categoryBar
    if(!wrap) return
    wrap.innerHTML = ''
    const allBtn = makeCatButton('', state.lang==='es'?'Todo':'All')
    wrap.appendChild(allBtn)
    state.categories.forEach(cat => wrap.appendChild(makeCatButton(cat.id, cat.name)))
  }
  function makeCatButton(id, label){
    const b = document.createElement('button')
    b.className = `px-3 py-1 rounded-full border ${id===state.activeCategory? 'bg-brand-600 text-white border-brand-600':'bg-white hover:bg-slate-50'}`
    b.textContent = label
    b.onclick = ()=>{ state.activeCategory = id; renderProducts() }
    return b
  }
  function renderProducts(){
    const grid = els.productGrid
    if(!grid) return
    grid.innerHTML = ''
    let list = state.products
    if(state.activeCategory){ list = list.filter(p => p.categoryId === state.activeCategory) }

    list.forEach(p => {
      const card = document.createElement('div')
      card.className = 'border rounded-lg overflow-hidden bg-white hover:shadow flex flex-col'
      
      // Get optimized image path
      const optimizedImage = getOptimizedImagePath(p.image, 'thumbnail')
      
      card.innerHTML = `
        <div class="aspect-square bg-slate-100 relative">
          ${optimizedImage ? `<img src="${optimizedImage}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover lazy-load" loading="lazy">` : ''}
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
      card.querySelector('[data-act="add"]').onclick = ()=> addToCart(p.id)
      card.querySelector('[data-act="details"]').onclick = ()=> openProductModal(p)
      grid.appendChild(card)
    })
  }

  function openProductModal(p){
    const html = `
      <div class="p-5">
        <div class="flex items-start gap-4">
          <div class="w-28 h-28 bg-slate-100 rounded overflow-hidden">${p.image?`<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">`:''}</div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold">${p.name}</h3>
            <div class="text-slate-600 mt-1">${p.description || p.short || ''}</div>
            <div class="mt-3 font-semibold">${fmtCurrency(p.price)}</div>
            <div class="mt-4 flex gap-2">
              <button data-close class="px-3 py-2 border rounded">Cerrar</button>
              <button data-add class="px-3 py-2 bg-brand-600 text-white rounded">Añadir al carrito</button>
            </div>
          </div>
        </div>
      </div>`
    openModal(html)
    const overlay = els.modalRoot.lastElementChild
    overlay.querySelector('[data-close]').onclick = ()=> closeModal(overlay)
    overlay.querySelector('[data-add]').onclick = ()=> { addToCart(p.id); closeModal(overlay) }
  }

  // Cart
  function addToCart(id){
    const item = state.cart.find(it => it.id === id)
    if(item) item.qty += 1
    else state.cart.push({ id, qty: 1 })
    saveJSON(STORAGE_KEYS.cart, state.cart)
    
    // Play sound and update UI
    playAddToCartSound()
    updateCartBadges()
    renderCart()
    renderCartSidebar()
    updateTotal()
    updateCartSidebarTotal()
    showToast(state.lang==='es'?'Añadido al carrito':'Added to cart')
  }
  function removeFromCart(id){
    state.cart = state.cart.filter(it => it.id !== id)
    saveJSON(STORAGE_KEYS.cart, state.cart)
    updateCartBadges()
    renderCart()
    renderCartSidebar()
    updateTotal()
    updateCartSidebarTotal()
  }
  function changeQty(id, delta){
    const item = state.cart.find(it => it.id === id)
    if(!item) return
    item.qty = Math.max(1, item.qty + delta)
    saveJSON(STORAGE_KEYS.cart, state.cart)
    updateCartBadges()
    renderCart()
    updateTotal()
  }
  function cartTotal(){
    let total = 0
    for(const it of state.cart){
      const p = state.products.find(x => x.id === it.id)
      if(p) total += p.price * it.qty
    }
    return total
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
        <div class="w-14 h-14 bg-slate-100 rounded overflow-hidden">${p.image?`<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">`:''}</div>
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

    // Save to history (session)
    state.history.unshift(order)
    saveJSON(STORAGE_KEYS.history, state.history)

    // Play order sent sound and show success message
    playOrderSentSound()
    showToast(state.lang==='es'?'Solicitud enviada a la empresa':'Request sent to company')
    
    // Clear form fields
    document.getElementById('buyerName').value = ''
    document.getElementById('buyerWhatsapp').value = ''
    
    // Clear cart after a short delay
    setTimeout(()=>{
      state.cart = []
      saveJSON(STORAGE_KEYS.cart, state.cart)
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
  document.getElementById('shippingType')?.addEventListener('change', updateCartSidebarTotal)

  // Mobile cart modal functionality
  function openMobileCartModal() {
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
    renderMobileCartItems()
    updateMobileCartTotal()
    
    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10)
    
    // Event listeners
    modal.querySelector('.mobile-cart-modal-close').onclick = closeMobileCartModal
    modal.querySelector('#mobile-cart-shipping').onchange = updateMobileCartTotal
    modal.querySelector('#mobile-checkout-form').onsubmit = handleMobileCheckout
    
    // Apply translations to modal
    applyTranslations()
  }
  
  function closeMobileCartModal() {
    const modal = document.querySelector('.mobile-cart-modal')
    if (modal) {
      modal.classList.remove('show')
      setTimeout(() => modal.remove(), 300)
    }
  }
  
  function renderMobileCartItems() {
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
          ${product.image ? `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">` : ''}
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
        changeQty(item.id, -1)
        renderMobileCartItems()
        updateMobileCartTotal()
      }
      itemEl.querySelector('[data-inc]').onclick = () => {
        changeQty(item.id, 1)
        renderMobileCartItems()
        updateMobileCartTotal()
      }
      itemEl.querySelector('[data-del]').onclick = () => {
        removeFromCart(item.id)
        renderMobileCartItems()
        updateMobileCartTotal()
      }
      
      container.appendChild(itemEl)
    })
  }
  
  function updateMobileCartTotal() {
    const totalEl = document.getElementById('mobile-cart-total')
    const shippingEl = document.getElementById('mobile-cart-shipping')
    if (!totalEl || !shippingEl) return
    
    const shipType = shippingEl.value || 'sea'
    const base = cartTotal()
    const total = shipType === 'air' ? base * 1.10 : base
    totalEl.textContent = fmtCurrency(total)
  }
  
  function handleMobileCheckout(e) {
    e.preventDefault()
    if (state.cart.length === 0) {
      showToast(state.lang === 'es' ? 'Agrega productos al carrito' : 'Add items to cart')
      return
    }
    
    const name = document.getElementById('mobile-buyer-name').value.trim()
    const phone = document.getElementById('mobile-buyer-whatsapp').value.trim()
    const shipType = document.getElementById('mobile-shipping-type').value
    const base = cartTotal()
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
    playOrderSentSound()
    showToast(state.lang === 'es' ? 'Solicitud enviada a la empresa' : 'Request sent to company')
    
    // Clear cart and close modal
    setTimeout(() => {
      state.cart = []
      saveJSON(STORAGE_KEYS.cart, state.cart)
      updateCartBadges()
      renderCart()
      renderCartSidebar()
      updateTotal()
      updateCartSidebarTotal()
      renderHistory()
      closeMobileCartModal()
    }, 500)
  }
  
  // Mobile navigation menu functionality - FIXED
  function setupMobileNavigation() {
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

  // Search functionality
  function setupSearch() {
    const searchInput = document.getElementById('product-search')
    const searchButton = document.getElementById('search-button')
    const clearButton = document.getElementById('clear-search')
    const searchLoading = document.getElementById('search-loading')
    const searchResults = document.getElementById('search-results-info')
    const resultsCount = document.getElementById('results-count')
    const clearAllFilters = document.getElementById('clear-all-filters')
    const aiIndicator = document.getElementById('ai-search-indicator')

    if (!searchInput) return

    let searchTimeout = null

    // Show AI indicator if available
    if (state.aiSearch && state.aiSearch.isAIEnabled()) {
      aiIndicator?.classList.remove('hidden')
    }

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
        
        if (state.aiSearch) {
          results = await state.aiSearch.search(query.trim())
        } else {
          // Basic search fallback
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
          const optimizedImageMobile = getOptimizedImagePath(p.image, 'thumbnail')
          card.innerHTML = `
            <div class="aspect-square bg-slate-100 relative">
              ${optimizedImageMobile ? `<img src="${optimizedImageMobile}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover" loading="lazy">` : ''}
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
          const optimizedImageDesktop = getOptimizedImagePath(p.image, 'thumbnail')
          card.innerHTML = `
            <div class="aspect-square bg-slate-100 relative">
              ${optimizedImageDesktop ? `<img src="${optimizedImageDesktop}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover" loading="lazy">` : ''}
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

  // Fix category button active state
  function makeCatButton(id, label){
    const b = document.createElement('button')
    b.className = `px-3 py-1 rounded-full border transition-colors ${
      id === state.activeCategory && !state.searchQuery ? 
      'bg-brand-600 text-white border-brand-600' : 
      'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
    }`
    b.textContent = label
    b.onclick = ()=> { 
      // Clear search when selecting category
      const searchInput = document.getElementById('product-search')
      if (searchInput) searchInput.value = ''
      state.searchQuery = ''
      
      state.activeCategory = id
      renderProducts()
      renderCategories() // Re-render to update active states
      
      // Hide search results
      const searchResults = document.getElementById('search-results-info')
      searchResults?.classList.add('hidden')
    }
    return b
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
          `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">` : 
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
    
    // Click handler to go to store and show product
    card.onclick = () => {
      // Go to store page
      location.hash = '#/store'
      
      // After route change, find and highlight the product
      setTimeout(() => {
        setActiveRoute('store')
        
        // Scroll to product if it exists
        setTimeout(() => {
          const productCards = document.querySelectorAll('.product-card')
          productCards.forEach(productCard => {
            const productName = productCard.querySelector('.font-medium')?.textContent
            if (productName === product.name) {
              productCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
              productCard.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)'
              setTimeout(() => {
                productCard.style.boxShadow = ''
              }, 2000)
            }
          })
        }, 300)
      }, 50)
    }
    
    return card
  }

  // Boot
  window.addEventListener('hashchange', handleHashChange)
  window.addEventListener('popstate', handleRouteChange)
  
  // Handle navigation clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="/"], a[href^="#/"]')
    if (link && !link.hasAttribute('target') && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      const href = link.getAttribute('href')
      
      if (href.startsWith('#/')) {
        // Legacy hash link - convert to clean URL
        const route = href.replace('#/', '')
        const url = route === 'home' ? '/' : `/${route}`
        history.pushState({ route }, '', url)
        setActiveRoute(route, false, false)
      } else if (href.startsWith('/')) {
        // Clean URL
        const route = href === '/' ? 'home' : href.substring(1).split('/')[0]
        if (routes.includes(route)) {
          history.pushState({ route }, '', href)
          setActiveRoute(route, false, false)
        }
      }
    }
  })
  
  ;(async function init(){
    await loadData()
    await loadTranslations()
    updateCartBadges() // Initialize cart badges
    setupMobileNavigation() // Setup mobile navigation
    setupSearch() // Setup search functionality
    handleRouteChange() // Initialize routing
  })()
})()
