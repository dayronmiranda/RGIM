import { loadAllData } from '../utils/dataLoader.js';
import { renderFeatured } from '../utils/featured.js';

export async function renderHome(container) {
  container.innerHTML = `
    <section class="bg-gradient-to-br from-brand-50 via-white to-brand-100 min-h-[60vh] flex flex-col justify-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">RG IM USA & PANAMÁ</h1>
          <p class="mt-2 text-lg text-slate-600">Compras desde cualquier parte del mundo. Envíos desde Panamá a Latinoamérica y el Caribe.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#/store" class="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-3 rounded-lg shadow hover:bg-brand-700">Explorar Tienda</a>
            <a href="#/about" class="inline-flex items-center gap-2 px-5 py-3 rounded-lg border hover:bg-white">Conoce RGIM</a>
          </div>
          <div class="mt-6 text-sm text-slate-500">Sedes en Estados Unidos y Panamá</div>
        </div>
        <div aria-hidden="true" class="grid grid-cols-3 gap-3 sm:gap-4">
          <div class="aspect-square rounded-lg bg-slate-100"></div>
          <div class="aspect-square rounded-lg bg-brand-200 row-span-2"></div>
          <div class="aspect-square rounded-lg bg-slate-100"></div>
          <div class="aspect-square rounded-lg bg-slate-100"></div>
          <div class="aspect-square rounded-lg bg-brand-300"></div>
          <div class="aspect-square rounded-lg bg-slate-100"></div>
        </div>
      </div>
    </section>
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-semibold mb-6 mt-8 text-center">Destacados</h2>
      <div id="featured-products"></div>
    </section>
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-2xl font-bold">¿Por qué elegir RGIM?</h2>
          <p class="mt-2 text-slate-600">Operación confiable, cobertura regional y atención cercana para tu compra internacional.</p>
        </div>
        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="flex gap-4 p-5 bg-white border rounded-lg">
            <div class="h-10 w-10 rounded-full bg-brand-100 text-brand-700 grid place-items-center">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7h7l-5.5 4.1L18 21l-6-4-6 4 1.5-7.9L2 9h7z"/></svg>
            </div>
            <div>
              <div class="font-semibold">Confianza y respaldo</div>
              <p class="text-sm text-slate-600">Garantías y seguro de mercancía con comunicación transparente.</p>
            </div>
          </div>
          <div class="flex gap-4 p-5 bg-white border rounded-lg">
            <div class="h-10 w-10 rounded-full bg-brand-100 text-brand-700 grid place-items-center">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v2H3V3zm3 6h12v2H6V9zm-3 6h18v2H3v-2z"/></svg>
            </div>
            <div>
              <div class="font-semibold">Catálogo flexible</div>
              <p class="text-sm text-slate-600">Productos bajo pedido y opciones de compra a medida.</p>
            </div>
          </div>
          <div class="flex gap-4 p-5 bg-white border rounded-lg">
            <div class="h-10 w-10 rounded-full bg-brand-100 text-brand-700 grid place-items-center">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l8 4v6c0 5-8 8-8 8s-8-3-8-8V7l8-4z"/></svg>
            </div>
            <div>
              <div class="font-semibold">Cobertura regional</div>
              <p class="text-sm text-slate-600">Envíos a toda Latinoamérica y el Caribe desde Panamá.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Cargar y mostrar destacados
  const { destacados } = await loadAllData();
  renderFeatured({
    products: destacados,
    containerId: 'featured-products',
    getImagePath: (img) => `assets/images/${img}`
  });
}
