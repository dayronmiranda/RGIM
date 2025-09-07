/**
 * AI-Powered Search using Google Gemini
 * Provides intelligent product search capabilities
 */
class AISearch {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || '',
      model: config.model || 'gemini-1.5-flash',
      enabled: config.enabled !== false,
      maxResults: config.maxResults || 10,
      threshold: config.threshold || 0.3
    };
    
    this.products = [];
    this.isLoading = false;
  }

  /**
   * Initialize with products data
   * @param {Array} products - Array of product objects
   */
  setProducts(products) {
    this.products = products;
  }

  /**
   * Perform AI-powered search
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of matching products
   */
  async search(query) {
    if (!query || query.trim().length < 2) {
      return this.products;
    }

    // If AI is disabled or no API key, fall back to basic search
    if (!this.config.enabled || !this.config.apiKey || this.config.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return this.basicSearch(query);
    }

    try {
      this.isLoading = true;
      
      // Create a simplified product list for AI analysis
      const productSummary = this.products.map(p => ({
        id: p.id,
        name: p.name,
        short: p.short || '',
        description: p.description || '',
        categoryId: p.categoryId,
        price: p.price
      }));

      const prompt = this.buildSearchPrompt(query, productSummary);
      const aiResults = await this.queryGemini(prompt);
      
      if (aiResults && aiResults.length > 0) {
        // Map AI results back to full product objects
        const matchedProducts = aiResults
          .map(result => this.products.find(p => p.id === result.id))
          .filter(Boolean)
          .slice(0, this.config.maxResults);
        
        return matchedProducts;
      }
      
      // Fallback to basic search if AI fails
      return this.basicSearch(query);
      
    } catch (error) {
      console.warn('AI search failed, falling back to basic search:', error);
      return this.basicSearch(query);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Build search prompt for Gemini
   * @param {string} query - User search query
   * @param {Array} products - Simplified product list
   * @returns {string} - Formatted prompt
   */
  buildSearchPrompt(query, products) {
    return `
Eres un asistente de búsqueda para una tienda en línea. Tu tarea es encontrar los productos más relevantes basándote en la consulta del usuario.

CONSULTA DEL USUARIO: "${query}"

PRODUCTOS DISPONIBLES:
${products.map(p => `ID: ${p.id} | Nombre: ${p.name} | Descripción: ${p.short} ${p.description} | Categoría: ${p.categoryId} | Precio: $${p.price}`).join('\n')}

INSTRUCCIONES:
1. Analiza la consulta del usuario y encuentra los productos más relevantes
2. Considera sinónimos, palabras relacionadas y contexto
3. Prioriza productos que coincidan con:
   - Nombre del producto
   - Descripción o características
   - Categoría relacionada
   - Marca o tipo de producto
4. Devuelve SOLO un array JSON con los IDs de productos ordenados por relevancia
5. Máximo ${this.config.maxResults} resultados
6. Si no encuentras productos relevantes, devuelve un array vacío []

FORMATO DE RESPUESTA (solo JSON, sin texto adicional):
["p1", "p2", "p3"]
`;
  }

  /**
   * Query Gemini API
   * @param {string} prompt - The prompt to send
   * @returns {Promise<Array>} - Array of product IDs
   */
  async queryGemini(prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = data.candidates[0].content.parts[0].text.trim();
    
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\[.*\]/);
      if (jsonMatch) {
        const productIds = JSON.parse(jsonMatch[0]);
        return productIds.map(id => ({ id }));
      }
      return [];
    } catch (parseError) {
      console.warn('Failed to parse Gemini response:', text);
      return [];
    }
  }

  /**
   * Basic search fallback
   * @param {string} query - Search query
   * @returns {Array} - Filtered products
   */
  basicSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    const words = searchTerm.split(/\s+/);
    
    return this.products.filter(product => {
      const searchableText = [
        product.name,
        product.short || '',
        product.description || '',
        product.categoryId || ''
      ].join(' ').toLowerCase();
      
      // Check if all words are present
      return words.every(word => searchableText.includes(word));
    }).sort((a, b) => {
      // Sort by relevance (name matches first)
      const aNameMatch = a.name.toLowerCase().includes(searchTerm);
      const bNameMatch = b.name.toLowerCase().includes(searchTerm);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return 0;
    });
  }

  /**
   * Get search suggestions based on partial query
   * @param {string} partialQuery - Partial search query
   * @returns {Array} - Array of suggestions
   */
  getSuggestions(partialQuery) {
    if (!partialQuery || partialQuery.length < 2) return [];
    
    const query = partialQuery.toLowerCase();
    const suggestions = new Set();
    
    this.products.forEach(product => {
      // Extract words from product name and description
      const words = [
        ...product.name.toLowerCase().split(/\s+/),
        ...(product.short || '').toLowerCase().split(/\s+/),
        ...(product.description || '').toLowerCase().split(/\s+/)
      ];
      
      words.forEach(word => {
        if (word.length > 2 && word.startsWith(query)) {
          suggestions.add(word);
        }
      });
      
      // Add full product name if it contains the query
      if (product.name.toLowerCase().includes(query)) {
        suggestions.add(product.name);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }

  /**
   * Check if AI search is available
   * @returns {boolean}
   */
  isAIEnabled() {
    return this.config.enabled && 
           this.config.apiKey && 
           this.config.apiKey !== 'YOUR_GEMINI_API_KEY_HERE';
  }

  /**
   * Get loading state
   * @returns {boolean}
   */
  getLoadingState() {
    return this.isLoading;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AISearch;
}