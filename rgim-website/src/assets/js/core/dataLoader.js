/**
 * Data Loading Module
 * Centralized data loading functionality for all JSON resources
 */

// Data source configuration
const DATA_SOURCES = {
  // Required data sources
  products: {
    url: './src/data/store/products.json',
    required: true,
    fallback: []
  },
  categories: {
    url: './src/data/store/categories.json', 
    required: true,
    fallback: []
  },
  
  // Optional data sources
  featured: {
    url: './src/data/store/destacados.json',
    required: false,
    fallback: [],
    transform: (data) => data.featured || []
  },
  config: {
    url: './src/data/config/config.json',
    required: false,
    fallback: {}
  },
  translations: {
    url: './src/data/config/translations.json',
    required: false,
    fallback: {}
  }
}

/**
 * Load a single JSON resource
 * @param {string} url - URL to fetch
 * @param {boolean} required - Whether this resource is required
 * @param {any} fallback - Fallback value if loading fails
 * @param {Function} transform - Optional transform function for the data
 * @returns {Promise<any>} Loaded data or fallback
 */
async function loadResource(url, required = false, fallback = null, transform = null) {
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      const error = new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`)
      if (required) {
        throw error
      } else {
        console.warn(error.message)
        return fallback
      }
    }
    
    const data = await response.json()
    return transform ? transform(data) : data
    
  } catch (error) {
    if (required) {
      console.error(`Critical error loading required resource ${url}:`, error)
      throw error
    } else {
      console.warn(`Optional resource ${url} not loaded:`, error.message)
      return fallback
    }
  }
}

/**
 * Load multiple resources in parallel
 * @param {Object} sources - Object with source configurations
 * @returns {Promise<Object>} Object with loaded data
 */
async function loadResources(sources) {
  const promises = Object.entries(sources).map(async ([key, config]) => {
    const data = await loadResource(
      config.url,
      config.required,
      config.fallback,
      config.transform
    )
    return [key, data]
  })
  
  const results = await Promise.all(promises)
  return Object.fromEntries(results)
}

/**
 * Load all application data
 * @returns {Promise<Object>} Object containing all loaded data
 */
export async function loadAllData() {
  try {
    return await loadResources(DATA_SOURCES)
  } catch (error) {
    console.error('Critical data loading error:', error)
    // Return safe fallbacks for all data sources
    return Object.fromEntries(
      Object.entries(DATA_SOURCES).map(([key, config]) => [key, config.fallback])
    )
  }
}

/**
 * Load specific data sources
 * @param {string[]} sourceNames - Array of source names to load
 * @returns {Promise<Object>} Object containing requested data
 */
export async function loadSpecificData(sourceNames) {
  const selectedSources = Object.fromEntries(
    sourceNames
      .filter(name => DATA_SOURCES[name])
      .map(name => [name, DATA_SOURCES[name]])
  )
  
  if (Object.keys(selectedSources).length === 0) {
    throw new Error(`No valid data sources found in: ${sourceNames.join(', ')}`)
  }
  
  return await loadResources(selectedSources)
}

/**
 * Load translations for a specific language
 * @param {string} lang - Language code (es, en)
 * @returns {Promise<Object>} Translations object
 */
export async function loadTranslations(lang = 'es') {
  try {
    const data = await loadResource(
      DATA_SOURCES.translations.url,
      false,
      DATA_SOURCES.translations.fallback
    )
    return data[lang] || data['es'] || {}
  } catch (error) {
    console.warn('Translations load failed:', error)
    return {}
  }
}

/**
 * Reload a specific data source
 * @param {string} sourceName - Name of the data source to reload
 * @returns {Promise<any>} Reloaded data
 */
export async function reloadData(sourceName) {
  const source = DATA_SOURCES[sourceName]
  if (!source) {
    throw new Error(`Unknown data source: ${sourceName}`)
  }
  
  return await loadResource(
    source.url,
    source.required,
    source.fallback,
    source.transform
  )
}

/**
 * Check if a data source is available
 * @param {string} sourceName - Name of the data source
 * @returns {boolean} Whether the source exists
 */
export function hasDataSource(sourceName) {
  return sourceName in DATA_SOURCES
}

/**
 * Get available data source names
 * @returns {string[]} Array of available source names
 */
export function getAvailableDataSources() {
  return Object.keys(DATA_SOURCES)
}

/**
 * Add or update a data source configuration
 * @param {string} name - Source name
 * @param {Object} config - Source configuration
 */
export function addDataSource(name, config) {
  DATA_SOURCES[name] = {
    required: false,
    fallback: null,
    transform: null,
    ...config
  }
}