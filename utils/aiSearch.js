// utils/aiSearch.js
// Búsqueda inteligente de productos usando Gemini AI

// Configuración de Gemini AI
const GEMINI_CONFIG = {
  apiKey: (typeof window !== 'undefined' && window.GEMINI_API_KEY) ||
          (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) || '', // Configurar en variables de entorno o global
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  maxRetries: 3,
  timeout: 10000
};

/**
 * Busca productos usando Gemini AI
 * @param {Array} products - Array de productos
 * @param {string} query - Consulta del usuario
 * @returns {Promise<Array>} - Productos relevantes ordenados por relevancia
 */
export async function aiProductSearch(products, query) {
  if (!query || query.length < 2) return products;
  if (!GEMINI_CONFIG.apiKey) {
    console.warn('Gemini API key not configured, falling back to simple search');
    return fallbackSearch(products, query);
  }

  try {
    // Preparar datos para Gemini
    const productsData = prepareProductsForAI(products);

    // Crear prompt para Gemini
    const prompt = createSearchPrompt(query, productsData);

    // Llamar a Gemini API
    const aiResponse = await callGeminiAPI(prompt);

    // Procesar respuesta y mapear a productos
    const relevantProducts = processGeminiResponse(aiResponse, products);

    console.log(`🤖 Gemini AI encontró ${relevantProducts.length} productos relevantes para: "${query}"`);

    return relevantProducts.length > 0 ? relevantProducts : fallbackSearch(products, query);

  } catch (error) {
    console.warn('Error en búsqueda con Gemini AI:', error);
    return fallbackSearch(products, query);
  }
}

/**
 * Prepara los productos para enviar a la IA (solo campos relevantes)
 * @param {Array} products - Array de productos
 * @returns {Array} - Productos simplificados
 */
function prepareProductsForAI(products) {
  return products.map((product, index) => ({
    id: index,
    name: product.name || '',
    description: product.description || product.short || '',
    category: product.category || '',
    tags: product.tags || []
  }));
}

/**
 * Crea el prompt para Gemini AI
 * @param {string} query - Consulta del usuario
 * @param {Array} productsData - Datos de productos
 * @returns {string} - Prompt completo
 */
function createSearchPrompt(query, productsData) {
  return `Eres un asistente de búsqueda virtual especializado en productos. Un usuario está buscando: "${query}"

Analiza el siguiente conjunto de productos y determina cuáles son más relevantes para la búsqueda del usuario. Considera:

1. **Coincidencias directas**: Nombre o descripción que contengan las palabras clave
2. **Sinónimos y conceptos relacionados**: Productos que puedan ser relevantes aunque no usen exactamente las mismas palabras
3. **Categorías y contexto**: Productos de categorías relacionadas con la búsqueda
4. **Relevancia general**: Qué tan bien se alinea cada producto con la intención de búsqueda

PRODUCTOS DISPONIBLES:
${JSON.stringify(productsData, null, 2)}

INSTRUCCIONES:
- Devuelve solo los IDs de los productos más relevantes (máximo 10)
- Ordena por relevancia (más relevante primero)
- Si no hay productos claramente relevantes, devuelve los más cercanos
- Considera el contexto y la intención detrás de la búsqueda
- Sé inclusivo pero preciso

Responde ÚNICAMENTE con un array JSON de números (IDs de productos), por ejemplo: [0, 3, 7, 12]`;
}

/**
 * Llama a la API de Gemini
 * @param {string} prompt - Prompt para Gemini
 * @returns {Promise<string>} - Respuesta de Gemini
 */
async function callGeminiAPI(prompt) {
  const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`, {
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
        temperature: 0.1, // Baja temperatura para respuestas consistentes
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    }),
    signal: AbortSignal.timeout(GEMINI_CONFIG.timeout)
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response from Gemini API');
  }

  return data.candidates[0].content.parts[0].text;
}

/**
 * Procesa la respuesta de Gemini y mapea a productos
 * @param {string} aiResponse - Respuesta de Gemini
 * @param {Array} products - Array original de productos
 * @returns {Array} - Productos ordenados por relevancia
 */
function processGeminiResponse(aiResponse, products) {
  try {
    // Extraer array de IDs de la respuesta
    const idMatch = aiResponse.match(/\[[\d,\s]+\]/);
    if (!idMatch) {
      console.warn('No se pudo extraer IDs de la respuesta de Gemini');
      return [];
    }

    const productIds = JSON.parse(idMatch[0]);

    // Mapear IDs a productos y filtrar válidos
    const relevantProducts = productIds
      .map(id => products[id])
      .filter(product => product !== undefined);

    console.log(`✅ Gemini AI procesó ${productIds.length} IDs, encontró ${relevantProducts.length} productos válidos`);

    return relevantProducts;

  } catch (error) {
    console.warn('Error procesando respuesta de Gemini:', error);
    return [];
  }
}

/**
 * Búsqueda de fallback cuando Gemini no está disponible
 * @param {Array} products - Array de productos
 * @param {string} query - Consulta del usuario
 * @returns {Array} - Productos filtrados
 */
function fallbackSearch(products, query) {
  console.log('🔄 Usando búsqueda de fallback para:', query);

  const q = query.toLowerCase();
  const terms = q.split(' ').filter(term => term.length > 2);

  return products
    .map(product => {
      const name = (product.name || '').toLowerCase();
      const description = (product.description || product.short || '').toLowerCase();
      const category = (product.category || '').toLowerCase();

      let score = 0;

      // Búsqueda exacta en nombre (mayor peso)
      if (name.includes(q)) score += 10;

      // Búsqueda por términos individuales
      terms.forEach(term => {
        if (name.includes(term)) score += 5;
        if (description.includes(term)) score += 3;
        if (category.includes(term)) score += 2;
      });

      return { product, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}

/**
 * Verifica si Gemini está configurado correctamente
 * @returns {boolean} - True si Gemini está disponible
 */
export function isGeminiAvailable() {
  return Boolean(GEMINI_CONFIG.apiKey && GEMINI_CONFIG.apiKey.length > 10);
}

/**
 * Obtiene estadísticas de uso de la búsqueda AI
 * @returns {Object} - Estadísticas de uso
 */
export function getAISearchStats() {
  // Aquí se podrían almacenar estadísticas de uso
  return {
    geminiAvailable: isGeminiAvailable(),
    totalSearches: 0, // Implementar contador si es necesario
    successfulSearches: 0,
    fallbackSearches: 0
  };
}
