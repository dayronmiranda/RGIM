// utils/categories.js
// Renderizado simple de categorías

export function renderCategories({ categories = [], activeCategory = '', barId = 'category-bar', onSelect = () => {} }) {
  const wrap = document.getElementById(barId);
  if (!wrap) return;
  wrap.innerHTML = '';
  // Botón "Todas"
  const allBtn = makeCatButton('', 'Todas', activeCategory === '', onSelect);
  wrap.appendChild(allBtn);
  // Botones de categorías
  categories.forEach(cat => {
    const btn = makeCatButton(cat.id, cat.name, activeCategory === cat.id, onSelect);
    wrap.appendChild(btn);
  });
}

function makeCatButton(id, label, active, onSelect) {
  const btn = document.createElement('button');
  btn.className = 'px-3 py-1 rounded border text-sm mr-2 mb-2 ' + (active ? 'bg-brand-600 text-white' : 'bg-white text-gray-700');
  btn.textContent = label;
  btn.onclick = () => onSelect(id);
  return btn;
}
