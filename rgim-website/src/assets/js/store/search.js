/*
  Search functionality module
  Extracted from app.js lines 1304-1580
*/

// AI Search with Gemini
export async function aiSearch(query, products, config) {
  const apiKey = config?.ai?.gemini?.apiKey
  const model = config?.ai?.gemini?.model || 'gemini-2.0-flash-exp'
  
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

// Basic search functionality
export function performSearch(query, products) {
  if (!query || query.trim().length < 2) {
    return []
  }

  const searchTerm = query.toLowerCase().trim()
  return products.filter(product => {
    const searchableText = [
      product.name,
      product.short || '',
      product.description || '',
      product.categoryId || ''
    ].join(' ').toLowerCase()
    
    return searchableText.includes(searchTerm)
  })
}

// Setup search functionality
export function setupSearch(state, showToast, renderFilteredProducts, renderProducts, renderCategories) {
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
  async function performSearchAsync(query) {
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
        results = await aiSearch(query.trim(), state.products, state.config)
        console.log('AI search successful:', results.length, 'results')
      } catch (aiError) {
        console.warn('AI search failed, using basic search:', aiError.message)
        
        // Fallback to basic search
        results = performSearch(query, state.products)
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
    performSearchAsync(searchInput.value)
  })

  searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      performSearchAsync(searchInput.value)
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
        performSearchAsync(query)
      }, 500)
    } else if (query.length === 0) {
      clearSearch()
    }
  })

  clearButton?.addEventListener('click', clearSearch)
  clearAllFilters?.addEventListener('click', clearSearch)
}