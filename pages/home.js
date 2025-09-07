import { loadAllData } from '../utils/dataLoader.js';
import { renderFeatured } from '../utils/products.js';

export async function renderHome(container) {
  container.innerHTML = `
    <!-- Hero Section with professional copywriting and corporate imagery -->
    <div class="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div class="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div class="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div class="sm:max-w-lg">
            <div class="mb-4">
              <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                🌎 Líder en comercio internacional
              </span>
            </div>
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              <span class="text-blue-600">RGIM</span><br>
              <span class="text-gray-800">USA & PANAMÁ</span>
            </h1>
            <p class="mt-6 text-xl leading-8 text-gray-600">
              <strong>Conectamos mercados globales</strong> con Latinoamérica y el Caribe. 
              Soluciones integrales de importación con la confianza de más de una década de experiencia.
            </p>
            <div class="mt-10 flex items-center gap-x-6">
              <a href="#/store" class="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200">
                Explorar Catálogo
              </a>
              <a href="#/about" class="text-base font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors duration-200">
                Nuestra Historia <span aria-hidden="true">→</span>
              </a>
            </div>
            <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="flex items-center gap-x-3 text-sm text-gray-600">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.757.433l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span><strong>Oficinas:</strong> Miami & Ciudad de Panamá</span>
              </div>
              <div class="flex items-center gap-x-3 text-sm text-gray-600">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <span><strong>Garantía:</strong> 100% en cada envío</span>
              </div>
            </div>
          </div>
          <div>
            <div class="mt-10">
              <!-- Commercial imagery grid with product photos -->
              <div aria-hidden="true" class="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl">
                <div class="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div class="flex items-center space-x-6 lg:space-x-8">
                    <div class="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div class="h-64 w-44 overflow-hidden rounded-lg shadow-xl bg-white sm:opacity-0 lg:opacity-100">
                        <img src="assets/images/products/products_0002_Capa-1.png" alt="Producto destacado" class="h-full w-full object-cover">
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg shadow-xl bg-white">
                        <img src="assets/images/products/products_0010_20231206_132305.png" alt="Electrónica" class="h-full w-full object-cover">
                      </div>
                    </div>
                    <div class="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div class="h-64 w-44 overflow-hidden rounded-lg shadow-xl bg-white">
                        <img src="assets/images/products/products_0015_20231206_132155.png" alt="Tecnología" class="h-full w-full object-cover">
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg shadow-xl bg-white">
                        <img src="assets/images/products/products_0020_20231206_132112.png" alt="Hogar" class="h-full w-full object-cover">
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg shadow-xl bg-white">
                        <img src="assets/images/products/products_0025_20231206_131932.png" alt="Accesorios" class="h-full w-full object-cover">
                      </div>
                    </div>
                    <div class="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div class="h-64 w-44 overflow-hidden rounded-lg shadow-xl bg-white">
                        <img src="assets/images/products/products_0030_20231206_132539.png" alt="Premium" class="h-full w-full object-cover">
                      </div>
                      <div class="h-64 w-44 overflow-hidden rounded-lg shadow-xl bg-white">
                        <img src="assets/images/products/products_0040_20231206_133000.png" alt="Ofertas" class="h-full w-full object-cover">
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



    <!-- Commercial Partnerships Section -->
    <div class="bg-gradient-to-br from-slate-50 to-blue-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestras Alianzas Comerciales
          </h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Trabajamos con las mejores empresas para ofrecerte productos de calidad mundial y servicios excepcionales
          </p>
        </div>
        
        <!-- Partners Grid -->
        <div class="mx-auto mt-16 max-w-5xl">
          <div class="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            <!-- Partner 1: Amazon -->
            <div class="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mb-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <svg class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 8.206 3.166 12.758 3.166 2.639 0 5.462-.394 8.29-1.275.232-.072.29-.058.348.072.058.13.014.174-.145.232-2.898 1.073-6.22 1.608-9.608 1.608-4.33 0-8.742-.921-11.976-3.534-.145-.116-.145-.203-.015-.247zm-.696-1.275c-.087-.145-.029-.232.145-.174 4.026.696 8.177 1.073 12.235 1.073 3.088 0 6.177-.29 9.135-.87.174-.043.232.029.174.145-.058.116-.145.145-.29.174-2.898.609-6.033.87-9.135.87-4.085 0-8.206-.348-12.235-1.073-.145-.029-.174-.087-.029-.145zm-.87-1.26c-.058-.145.029-.203.174-.145 3.695.522 7.564.783 11.454.783 2.784 0 5.568-.203 8.322-.609.145-.029.203.043.145.145-.058.116-.116.145-.261.174-2.726.435-5.539.652-8.322.652-3.92 0-7.84-.261-11.454-.783-.145-.029-.174-.087-.058-.217z"/>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-900 text-center">Amazon</h3>
              <p class="text-xs text-gray-500 text-center mt-1">E-commerce Global</p>
            </div>

            <!-- Partner 2: FedEx -->
            <div class="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-900 text-center">FedEx</h3>
              <p class="text-xs text-gray-500 text-center mt-1">Logística Internacional</p>
            </div>

            <!-- Partner 3: DHL -->
            <div class="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mb-4 bg-gradient-to-br from-red-500 to-yellow-500 rounded-lg flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-900 text-center">DHL</h3>
              <p class="text-xs text-gray-500 text-center mt-1">Envíos Express</p>
            </div>

            <!-- Partner 4: PayPal -->
            <div class="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mb-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-900 text-center">PayPal</h3>
              <p class="text-xs text-gray-500 text-center mt-1">Pagos Seguros</p>
            </div>

            <!-- Partner 5: Walmart -->
            <div class="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-900 text-center">Walmart</h3>
              <p class="text-xs text-gray-500 text-center mt-1">Retail Global</p>
            </div>

            <!-- Partner 6: Best Buy -->
            <div class="group flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div class="w-16 h-16 mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-900 text-center">Best Buy</h3>
              <p class="text-xs text-gray-500 text-center mt-1">Tecnología</p>
            </div>
          </div>
          
          <!-- Partnership Benefits -->
          <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div class="text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900">Calidad Garantizada</h3>
              <p class="mt-2 text-sm text-gray-600">Productos auténticos directamente de nuestros socios comerciales verificados</p>
            </div>
            
            <div class="text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900">Tiempos Optimizados</h3>
              <p class="mt-2 text-sm text-gray-600">Procesos ágiles gracias a nuestras alianzas estratégicas con líderes del mercado</p>
            </div>
            
            <div class="text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="mt-6 text-lg font-semibold text-gray-900">Mejores Precios</h3>
              <p class="mt-2 text-sm text-gray-600">Tarifas preferenciales que trasladamos directamente a nuestros clientes</p>
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
  const { products, destacados } = await loadAllData();
  
  console.log('Products loaded:', products.length);
  console.log('Destacados:', destacados);
  
  // Obtener los productos destacados basados en los IDs
  const featuredProducts = destacados?.featured 
    ? products.filter(product => destacados.featured.includes(product.id))
    : [];
  
  console.log('Featured products found:', featuredProducts.length);
  console.log('Featured products:', featuredProducts);
  
  renderFeatured({
    products: featuredProducts,
    containerId: 'featured-products',
    getImagePath: (img) => `assets/images/products/${img}`
  });
}
