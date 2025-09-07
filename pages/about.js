// about.js
export function renderAbout(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="relative isolate px-6 pt-14 lg:px-8">
        <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div class="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Acerca de RGIM
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              Conectando el mundo con Latinoamérica y el Caribe a través de soluciones logísticas confiables y un servicio excepcional desde 2018.
            </p>
          </div>
        </div>
        <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>
    </div>

    <!-- Company Overview -->
    <div class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-indigo-600">Nuestra Historia</h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Una empresa con visión global
          </p>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            RGIM opera con sedes estratégicas en Estados Unidos y Panamá, especializándose en el envío de productos desde Panamá hacia toda Latinoamérica y el Caribe, ofreciendo soluciones logísticas integrales.
          </p>
        </div>
      </div>
    </div>

    <!-- Timeline Section -->
    <div class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuestra evolución</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Desde nuestros inicios, hemos crecido constantemente, adaptándonos a las necesidades del mercado y mejorando nuestros servicios.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
          <div class="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
            <div class="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
              <p class="flex-none text-3xl font-bold tracking-tight text-gray-900">2018</p>
              <div class="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p class="text-lg font-semibold leading-6 text-gray-900">Inicio de operaciones</p>
                <p class="mt-2 text-base leading-7 text-gray-600">Consolidamos una oferta de compras internacionales con enfoque en servicio y cumplimiento, estableciendo las bases de nuestra operación.</p>
              </div>
            </div>
            <div class="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-900 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-none lg:flex-col lg:items-start">
              <p class="flex-none text-3xl font-bold tracking-tight text-white">2020</p>
              <div class="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p class="text-lg font-semibold leading-6 text-white">Expansión logística</p>
                <p class="mt-2 text-base leading-7 text-gray-300">Operación regional con rutas marítimas y aéreas a Latinoamérica y el Caribe, ampliando significativamente nuestro alcance.</p>
              </div>
            </div>
            <div class="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-indigo-600 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
              <p class="flex-none text-3xl font-bold tracking-tight text-white">2022</p>
              <div class="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p class="text-lg font-semibold leading-6 text-white">Optimización del catálogo</p>
                <p class="mt-2 text-base leading-7 text-indigo-200">Gestión de productos bajo pedido y trazabilidad de solicitudes por sesión, mejorando la experiencia del cliente.</p>
              </div>
            </div>
            <div class="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-gray-50 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-none lg:flex-col lg:items-start">
              <p class="flex-none text-3xl font-bold tracking-tight text-gray-900">2024</p>
              <div class="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p class="text-lg font-semibold leading-6 text-gray-900">Atención omnicanal</p>
                <p class="mt-2 text-base leading-7 text-gray-600">Coordinación por WhatsApp para cierre de compra segura (Zelle/transferencia), integrando canales digitales modernos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:max-w-none">
          <div class="text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Números que nos definen
            </h2>
            <p class="mt-4 text-lg leading-8 text-gray-600">
              Resultados que reflejan nuestro compromiso con la excelencia y el crecimiento sostenido
            </p>
          </div>
          <dl class="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            <div class="flex flex-col bg-white p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Productos gestionados</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">+5,000</dd>
            </div>
            <div class="flex flex-col bg-white p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Países de destino</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">15+</dd>
            </div>
            <div class="flex flex-col bg-white p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Tiempo de respuesta</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">24-48h</dd>
            </div>
            <div class="flex flex-col bg-white p-8">
              <dt class="text-sm font-semibold leading-6 text-gray-600">Sedes operativas</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900">2</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Locations Section -->
    <div class="bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuestras sedes</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Presencia estratégica en dos ubicaciones clave para optimizar nuestras operaciones logísticas
          </p>
        </div>
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <!-- USA Office -->
          <article class="flex max-w-xl flex-col items-start justify-between rounded-2xl bg-gray-50 p-8">
            <div class="flex items-center gap-x-4 text-xs">
              <div class="relative z-10 rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-600">Estados Unidos</div>
            </div>
            <div class="group relative mt-8">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <span class="absolute inset-0"></span>
                Sede Corporativa USA
              </h3>
              <div class="mt-5 space-y-2 text-sm leading-6 text-gray-600">
                <div class="font-semibold text-gray-900">RG IM USA MULTISERVICES LLC</div>
                <div class="flex items-center gap-x-2">
                  <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  12458 SW 220 St, Miami, FL 33170
                </div>
                <div class="flex items-center gap-x-2">
                  <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18H5.25L4.5 3z" />
                  </svg>
                  Operaciones corporativas y coordinación
                </div>
              </div>
            </div>
          </article>

          <!-- Panama Office -->
          <article class="flex max-w-xl flex-col items-start justify-between rounded-2xl bg-indigo-50 p-8">
            <div class="flex items-center gap-x-4 text-xs">
              <div class="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600">Panamá</div>
            </div>
            <div class="group relative mt-8">
              <h3 class="text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                <span class="absolute inset-0"></span>
                Centro Logístico Panamá
              </h3>
              <div class="mt-5 space-y-2 text-sm leading-6 text-gray-600">
                <div class="font-semibold text-gray-900">RG IM PANAMA MULTISERVICES SA</div>
                <div class="flex items-center gap-x-2">
                  <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Calle 50, F&F Tower. Piso 43, Oficina 43-C
                </div>
                <div class="flex items-center gap-x-2">
                  <svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5z" />
                  </svg>
                  Hub de distribución y envíos
                </div>
                <div class="text-gray-500">Ciudad de Panamá, Panamá</div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- Mission & Vision Section -->
    <div class="bg-gray-50 py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:mx-0">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Nuestra misión</h2>
          <p class="mt-6 text-xl leading-8 text-gray-600">
            Facilitar el acceso a productos internacionales para clientes en Latinoamérica y el Caribe, 
            ofreciendo un servicio logístico confiable, eficiente y personalizado que conecte mercados globales 
            con necesidades locales.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                Compromiso
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Dedicación total a la satisfacción del cliente y la excelencia en cada envío.</p>
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                Innovación
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Adopción de tecnologías y procesos que mejoren continuamente nuestro servicio.</p>
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z" />
                  </svg>
                </div>
                Alcance Global
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Conexión efectiva entre mercados internacionales y clientes regionales.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  `;
}
