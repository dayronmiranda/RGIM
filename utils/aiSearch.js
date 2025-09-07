// utils/aiSearch.js
// Búsqueda de productos usando IA (ejemplo con Gemini API, fácil de adaptar)

// Esta función espera un array de productos y un string de búsqueda.
// Llama a una API de IA (Gemini, OpenAI, etc.) y retorna los productos relevantes.
// Por simplicidad, aquí se simula la llamada. Sustituye la función fetch por tu endpoint real.

export async function aiProductSearch(products, query) {
  if (!query || query.length < 2) return products;
  // Simulación: filtra localmente y "simula" IA
  // Reemplaza esto por una llamada real a tu API de IA si la tienes
  // Ejemplo de llamada real:
  // const res = await fetch('https://tu-api-ia.com/search', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query, products })
  // });
  // const { results } = await res.json();
  // return results;

  // Simulación: búsqueda fuzzy simple
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  );
}
