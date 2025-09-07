/**
 * State Management Module
 * Handles application state, local storage operations, and data persistence
 */

// Storage keys for localStorage
export const STORAGE_KEYS = {
  cart: 'rgim.cart',
  history: 'rgim.history',
  adminSession: 'rgim.adminSession',
  lang: 'rgim.lang',
}

// Initialize application state
export function initState() {
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
    priceRange: '',
    sortBy: '',
    aiSearch: null,
  }
  
  // Set language from storage or URL parameter
  state.lang = loadJSON(STORAGE_KEYS.lang, 'es')
  
  // Override language from URL param if provided (?lang=es|en)
  try {
    const urlLang = new URLSearchParams(location.search).get('lang')
    if(urlLang === 'es' || urlLang === 'en'){
      state.lang = urlLang
      saveJSON(STORAGE_KEYS.lang, urlLang)
    }
  } catch(e) {
    console.warn('Error parsing URL parameters:', e)
  }
  
  return state
}

// Load JSON data from localStorage with fallback
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if(!raw) return fallback
    return JSON.parse(raw)
  } catch(e) { 
    console.warn(`Error loading JSON from localStorage key "${key}":`, e)
    return fallback 
  }
}

// Save JSON data to localStorage
export function saveJSON(key, value) { 
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch(e) {
    console.error(`Error saving JSON to localStorage key "${key}":`, e)
  }
}

// Get current state value by key
export function getState(state, key) {
  return key ? state[key] : state
}

// Set state value by key and optionally persist to localStorage
export function setState(state, key, value, persist = false, storageKey = null) {
  if (typeof key === 'object') {
    // Bulk update: setState(state, { key1: value1, key2: value2 })
    Object.assign(state, key)
  } else {
    state[key] = value
  }
  
  // Persist to localStorage if requested
  if (persist && storageKey) {
    saveJSON(storageKey, value)
  }
  
  return state
}

// State helper functions for common operations
export const stateHelpers = {
  // History operations
  addToHistory(state, order) {
    state.history.unshift(order)
    saveJSON(STORAGE_KEYS.history, state.history)
    return state.history
  },
  
  // Language operations
  setLanguage(state, lang) {
    state.lang = lang
    saveJSON(STORAGE_KEYS.lang, lang)
    return lang
  },
  
  // Admin session operations
  setAdminSession(state, adminData) {
    state.admin = adminData
    saveJSON(STORAGE_KEYS.adminSession, adminData)
    return adminData
  },
  
  clearAdminSession(state) {
    state.admin = null
    localStorage.removeItem(STORAGE_KEYS.adminSession)
    return null
  },
  
  // Cart operations - delegated to cart module
  clearCart(state) {
    state.cart = []
    saveJSON(STORAGE_KEYS.cart, state.cart)
    return state.cart
  }
}