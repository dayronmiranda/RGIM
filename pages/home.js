import { loadAllData } from '../utils/dataLoader.js';
import { renderFeatured } from '../utils/products.js';

export async function renderHome(container) {
  container.innerHTML = `
    <!-- Hero Section with modern gradient and improved layout -->
    <div class="relative overflow-hidden bg-white">
      <div class="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div class="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div class="sm:max-w-lg">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              RG IM USA & PANAMÁ
            </h1>
            <p class="mt-4 text-xl text-gray-500">
              Compras desde cualquier parte del mundo. Envíos desde Panamá a Latinoamérica y el Caribe.
            </p>
            <div class="mt-10 flex items-center gap-x-6">
              <a href="#/store" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Explorar Tienda
              </a>
              <a href="#/about" class="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Conoce RGIM <span aria-hidden="true">→</span>
              </a>
            </div>
            <div class="mt-6 flex items-center gap-x-2 text-sm text-gray-500">
              <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
              </svg>
              Sedes en Estados Unidos y Panamá
            </div>
          </div>
          <div>
            <div class="mt-10">
              <!-- Decorative image grid -->
              <div aria-hidden="true" class="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                <div class="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div class="flex items-center space-x-6 lg:space-x-8">
                    <div class="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div class="h-64 w-44 overflow-hidden rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 sm:opacity-0 lg:opacity-100">
                        <div class="h-full w-full bg-gradient-to-br from-indigo-200 to-indigo-300"></div>
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
                        <div class="h-full w-full bg-gradient-to-br from-purple-200 to-purple-300"></div>
                      </div>
                    </div>
                    <div class="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div class="h-64 w-44 overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
                        <div class="h-full w-full bg-gradient-to-br from-blue-200 to-blue-300"></div>
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg bg-gradient-to-br from-cyan-100 to-cyan-200">
                        <div class="h-full w-full bg-gradient-to-br from-cyan-200 to-cyan-300"></div>
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg bg-gradient-to-br from-teal-100 to-teal-200">
                        <div class="h-full w-full bg-gradient-to-br from-teal-200 to-teal-300"></div>
                      </div>
                    </div>
                    <div class="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div class="h-64 w-44 overflow-hidden rounded-lg bg-gradient-to-br from-green-100 to-green-200">
                        <div class="h-full w-full bg-gradient-to-br from-green-200 to-green-300"></div>
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200">
                        <div class="h-full w-full bg-gradient-to-br from-yellow-200 to-yellow-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Products Section -->
    <div class="bg-white">
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Productos Destacados</h2>
          <p class="mt-4 text-lg text-gray-600">Descubre nuestra selección especial de productos más populares</p>
        </div>
        <div id="featured-products" class="mt-16"></div>
      </div>
    </div>

    <!-- Features Section with improved design -->
    <div class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">¿Por qué elegir RGIM?</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Operación confiable, cobertura regional y atención cercana para tu compra internacional.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                Confianza y respaldo
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Garantías y seguro de mercancía con comunicación transparente en cada paso del proceso.</p>
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                Catálogo flexible
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Productos bajo pedido y opciones de compra a medida según tus necesidades específicas.</p>
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z" />
                  </svg>
                </div>
                Cobertura regional
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Envíos a toda Latinoamérica y el Caribe desde nuestras instalaciones en Panamá.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-none">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Números que nos respaldan
            </h2>
            <p class="mt-4 text-lg leading-8 text-gray-600">
              Años de experiencia conectando productos del mundo con Latinoamérica
            </p>
          </div>
          <dl class="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex flex-col bg-gray-400/5 p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Productos gestionados</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">+5,000</dd>
            </div>
            <div class="flex flex-col bg-gray-400/5 p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Países de destino</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">15+</dd>
            </div>
            <div class="flex flex-col bg-gray-400/5 p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Tiempo de respuesta</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">24-48h</dd>
            </div>
            <div class="flex flex-col bg-gray-400/5 p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Sedes operativas</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">2</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  `;

  // Cargar y mostrar destacados
  const { destacados } = await loadAllData();
  renderFeatured({
    products: destacados,
    containerId: 'featured-products',
    getImagePath: (img) => `assets/images/${img}`
  });
}
