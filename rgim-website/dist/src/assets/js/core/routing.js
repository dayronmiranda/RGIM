/**
 * Routing Module
 * Handles hash-based routing, navigation, and route management
 */

// Available routes in the application
export const routes = ['home','store','faq','about','admin']

// Set active route and update UI
export function setActiveRoute(name, elements, state, callbacks = {}, fromCartClick = false, updateHistory = true) {
  // Close any open modals when changing routes
  if (callbacks.closeAllModals) {
    callbacks.closeAllModals()
  }
  
  // Update route visibility
  routes.forEach(r => {
    const sec = elements.routes[r]
    if(!sec) return
    if(r === name){ 
      sec.classList.add('active') 
    } else { 
      sec.classList.remove('active') 
    }
    
    // Update navigation active state
    const a = elements.nav[r]
    if(a) a.classList.toggle('text-brand-700', r===name)
  })
  
  // Scroll to top smoothly
  window.scrollTo({top:0, behavior:'smooth'})
  
  // Update browser history and URL with hash
  if(updateHistory) {
    const hash = name === 'home' ? '#/' : `#/${name}`
    if(location.hash !== hash) {
      location.hash = hash
    }
  }
  
  // Update SEO for route change
  if (callbacks.updateSEO) {
    try { 
      callbacks.updateSEO(name) 
    } catch(e) {
      console.warn('SEO update failed:', e)
    }
  }

  // Route-specific rendering and setup
  if(name === 'store' && callbacks.store) {
    callbacks.store.renderCategories()
    callbacks.store.renderProducts()
    callbacks.store.renderCart()
    callbacks.store.renderCartSidebar()
    callbacks.store.renderHistory()
    callbacks.store.updateTotal()
    callbacks.store.updateCartSidebarTotal()
    
    // Animate cart sidebar if coming from cart click
    if(fromCartClick && callbacks.store.animateCartSidebar){
      setTimeout(callbacks.store.animateCartSidebar, 200)
    }
  }
  
  if(name === 'home' && callbacks.home) {
    callbacks.home.renderFeaturedProducts()
  }
  
  if(name === 'admin' && callbacks.admin) {
    callbacks.admin.updateAdminUI()
    callbacks.admin.renderAdminRows()
  }
  
  return name
}

// Handle hash change events
export function handleHashChange(elements, state, callbacks = {}) {
  const hash = location.hash || '#/'
  let route = 'home'
  
  if(hash.startsWith('#/')) {
    const hashRoute = hash.replace('#/','') || 'home'
    if(routes.includes(hashRoute)) {
      route = hashRoute
    }
  }
  
  setActiveRoute(route, elements, state, callbacks, false, false)
  return route
}

// Initialize routing system
export function initRouting(elements, state, callbacks = {}) {
  // Set up hash change listener
  const hashChangeHandler = () => handleHashChange(elements, state, callbacks)
  window.addEventListener('hashchange', hashChangeHandler)
  
  // Handle initial route
  const initialRoute = handleHashChange(elements, state, callbacks)
  
  // Return cleanup function
  return {
    currentRoute: initialRoute,
    cleanup: () => {
      window.removeEventListener('hashchange', hashChangeHandler)
    },
    navigate: (routeName, fromCartClick = false) => {
      return setActiveRoute(routeName, elements, state, callbacks, fromCartClick, true)
    },
    getCurrentRoute: () => {
      const hash = location.hash || '#/'
      if(hash.startsWith('#/')) {
        const hashRoute = hash.replace('#/','') || 'home'
        return routes.includes(hashRoute) ? hashRoute : 'home'
      }
      return 'home'
    }
  }
}

// Route validation helper
export function isValidRoute(routeName) {
  return routes.includes(routeName)
}

// Get route from hash
export function getRouteFromHash(hash = location.hash) {
  if(!hash || hash === '#/') return 'home'
  
  if(hash.startsWith('#/')) {
    const routeName = hash.replace('#/','')
    return isValidRoute(routeName) ? routeName : 'home'
  }
  
  return 'home'
}

// Generate hash for route
export function getHashForRoute(routeName) {
  if(!isValidRoute(routeName)) return '#/'
  return routeName === 'home' ? '#/' : `#/${routeName}`
}

// Navigation helpers
export const navigationHelpers = {
  // Navigate to a specific route
  navigateTo(routeName, elements, state, callbacks = {}, fromCartClick = false) {
    if(!isValidRoute(routeName)) {
      console.warn(`Invalid route: ${routeName}`)
      return false
    }
    
    const hash = getHashForRoute(routeName)
    location.hash = hash
    return true
  },
  
  // Go back in history
  goBack() {
    window.history.back()
  },
  
  // Go forward in history
  goForward() {
    window.history.forward()
  },
  
  // Replace current route without adding to history
  replaceRoute(routeName) {
    if(!isValidRoute(routeName)) {
      console.warn(`Invalid route: ${routeName}`)
      return false
    }
    
    const hash = getHashForRoute(routeName)
    window.history.replaceState(null, '', hash)
    return true
  }
}