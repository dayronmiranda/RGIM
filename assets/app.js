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
    cartSidebarShipping: document.getElementById('cart-sidebar-shipping'),
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
    lang: 'es',
    t: {},
    cart: loadJSON(STORAGE_KEYS.cart, []),
    history: loadJSON(STORAGE_KEYS.history, []),
    admin: loadJSON(STORAGE_KEYS.adminSession, null),
    activeCategory: '',
  }
  state.lang = loadJSON(STORAGE_KEYS.lang, 'es')

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

  function showToast(msg){
    const node = document.createElement('div')
    node.className = 'pointer-events-auto bg-slate-900 text-white px-4 py-2 rounded shadow text-sm'
    node.textContent = msg
    els.toastRoot.appendChild(node)
    setTimeout(()=>{ node.remove() }, 3000)
  }

  // Sound effect for adding to cart - Professional and pleasant
  function playAddToCartSound(){
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Professional "pop" sound - C major chord progression
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.2) // G5
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } catch(e) {
      console.log('Sound not available')
    }
  }

  // Sound effect for successful order submission - Email sent sound
  function playOrderSentSound(){
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Create a harmonious "sent" sound with multiple tones
      const frequencies = [440, 554.37, 659.25] // A4, C#5, E5 (A major chord)
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        oscillator.type = 'sine'
        
        // Stagger the notes slightly for harmony
        const startTime = audioContext.currentTime + (index * 0.1)
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.1)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8)
        
        oscillator.start(startTime)
        oscillator.stop(startTime + 0.8)
      })
    } catch(e) {
      console.log('Sound not available')
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
      row.innerHTML = `
        <div class="w-12 h-12 bg-slate-200 rounded overflow-hidden flex-shrink-0">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover">` : ''}
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
    if(!els.cartSidebarTotal || !els.cartSidebarShipping) return
    const shipType = els.cartSidebarShipping.value || 'sea'
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
  }
  function getNested(obj, path){
    return path.split('.').reduce((o,k)=> (o && o[k] != null ? o[k] : undefined), obj)
  }

  // Data loading
  async function loadData(){
    const [prodRes, catRes] = await Promise.all([
      fetch('./products.json'), fetch('./categories.json')
    ])
    state.products = await prodRes.json()
    state.categories = await catRes.json()
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

  // Routing
  function setActiveRoute(name, fromCartClick = false){
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
    if(name === 'admin'){
      updateAdminUI()
      renderAdminRows()
    }
  }
  function handleHashChange(){
    const hash = location.hash || '#/home'
    const route = hash.replace('#/','')
    if(!routes.includes(route)) return setActiveRoute('home')
    setActiveRoute(route)
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
      card.innerHTML = `
        <div class="aspect-square bg-slate-100 relative">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" class="absolute inset-0 w-full h-full object-cover">` : ''}
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
  function setLang(l){ state.lang = l; saveJSON(STORAGE_KEYS.lang, l); loadTranslations() }
  els.langES?.addEventListener('click', ()=> setLang('es'))
  els.langEN?.addEventListener('click', ()=> setLang('en'))

  // Cart sidebar shipping change listener
  els.cartSidebarShipping?.addEventListener('change', updateCartSidebarTotal)

  // Cart button click handler with animation
  els.cartBadgeDesktop?.parentElement?.addEventListener('click', (e) => {
    e.preventDefault()
    const currentRoute = location.hash.replace('#/', '') || 'home'
    if(currentRoute !== 'store') {
      // Navigate to store with animation
      location.hash = '#/store'
      setTimeout(() => setActiveRoute('store', true), 50)
    }
  })

  // Boot
  window.addEventListener('hashchange', handleHashChange)
  ;(async function init(){
    await loadData()
    await loadTranslations()
    updateCartBadges() // Initialize cart badges
    handleHashChange()
  })()
})()
