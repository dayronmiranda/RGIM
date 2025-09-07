// utils/dataLoader.js
// Carga sencilla de productos, categorías y destacados desde assets/config

export async function loadJSON(url, fallback = null) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No se pudo cargar ' + url);
    return await res.json();
  } catch (e) {
    console.warn(e);
    return fallback;
  }
}

export async function loadAllData() {
  const [products, categories, destacados] = await Promise.all([
    loadJSON('assets/config/products.json', []),
    loadJSON('assets/config/categories.json', []),
    loadJSON('assets/config/destacados.json', { featured: [] })
  ]);
  return { products, categories, destacados };
}
