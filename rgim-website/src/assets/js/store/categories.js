/*
  Category management functionality module
  Extracted from app.js lines 618-676
*/

export function renderCategories(state, els, renderProductsCallback) {
  const wrap = els.categoryBar
  if (!wrap) return
  wrap.innerHTML = ''
  
  // All categories button
  const allBtn = makeCatButton('', state.lang === 'es' ? 'Todas' : 'All', state, renderProductsCallback)
  wrap.appendChild(allBtn)
  
  // Individual category buttons
  state.categories.forEach(cat => {
    const btn = makeCatButton(cat.id, cat.name, state, renderProductsCallback)
    wrap.appendChild(btn)
  })
}

// FIXED: Proper category button creation
export function makeCatButton(id, label, state, renderProductsCallback) {
  const div = document.createElement('div')
  div.className = 'flex items-center'
  
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.name = 'category'
  input.id = `category-${id || 'all'}`
  input.value = id
  input.className = 'h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 rounded'
  input.checked = id === state.activeCategory
  
  const labelEl = document.createElement('label')
  labelEl.htmlFor = `category-${id || 'all'}`
  labelEl.className = 'ml-3 text-sm text-gray-600 cursor-pointer'
  labelEl.textContent = label
  
  input.onchange = () => {
    // Clear search when selecting category
    const searchInput = document.getElementById('product-search')
    if (searchInput) searchInput.value = ''
    state.searchQuery = ''
    
    if (input.checked) {
      state.activeCategory = id
    } else {
      state.activeCategory = ''
    }
    
    renderProductsCallback()
    renderCategories(state, { categoryBar: document.getElementById('category-bar') }, renderProductsCallback) // Re-render to update active states
    
    // Hide search results
    const searchResults = document.getElementById('search-results-info')
    searchResults?.classList.add('hidden')
  }
  
  div.appendChild(input)
  div.appendChild(labelEl)
  return div
}