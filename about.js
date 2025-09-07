// about.js
export function renderAbout(container) {
  container.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid lg:grid-cols-3 gap-10">
        <div class="lg:col-span-2">
          <h1 class="text-3xl font-bold">Acerca de la empresa</h1>
          <p class="mt-3 text-slate-600">RGIM opera con sedes en Estados Unidos y Panamá, enviando productos desde Panamá hacia Latinoamérica y el Caribe.</p>
          <div class="mt-8">
            <ol class="relative border-s border-slate-200">
              <li class="ps-6 py-4">
                <span class="absolute -start-2.5 top-5 h-5 w-5 rounded-full bg-brand-600"></span>
                <div class="text-xs uppercase text-slate-500">2018</div>
                <div class="font-semibold mt-1">Inicio de operaciones</div>
                <p class="text-slate-600 text-sm mt-1">Consolidamos una oferta de compras internacionales con enfoque en servicio y cumplimiento.</p>
              </li>
              <li class="ps-6 py-4">
                <span class="absolute -start-2.5 top-5 h-5 w-5 rounded-full bg-brand-600"></span>
                <div class="text-xs uppercase text-slate-500">2020</div>
                <div class="font-semibold mt-1">Expansión logística</div>
                <p class="text-slate-600 text-sm mt-1">Operación regional con rutas marítimas y aéreas a Latinoamérica y el Caribe.</p>
              </li>
              <li class="ps-6 py-4">
                <span class="absolute -start-2.5 top-5 h-5 w-5 rounded-full bg-brand-600"></span>
                <div class="text-xs uppercase text-slate-500">2022</div>
                <div class="font-semibold mt-1">Optimización del catálogo</div>
                <p class="text-slate-600 text-sm mt-1">Gestión de productos bajo pedido y trazabilidad de solicitudes por sesión.</p>
              </li>
              <li class="ps-6 py-4">
                <span class="absolute -start-2.5 top-5 h-5 w-5 rounded-full bg-brand-600"></span>
                <div class="text-xs uppercase text-slate-500">2024</div>
                <div class="font-semibold mt-1">Atención omnicanal</div>
                <p class="text-slate-600 text-sm mt-1">Coordinación por WhatsApp para cierre de compra segura (Zelle/transferencia).</p>
              </li>
            </ol>
          </div>
        </div>
        <aside>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg border bg-white p-5 text-center">
              <div class="text-3xl font-extrabold text-slate-900">+5k</div>
              <div class="text-slate-600 text-sm">Productos gestionados</div>
            </div>
            <div class="rounded-lg border bg-white p-5 text-center">
              <div class="text-3xl font-extrabold text-slate-900">15+</div>
              <div class="text-slate-600 text-sm">Países de destino</div>
            </div>
            <div class="rounded-lg border bg-white p-5 text-center">
              <div class="text-3xl font-extrabold text-slate-900">24-48h</div>
              <div class="text-slate-600 text-sm">Tiempo de respuesta</div>
            </div>
            <div class="rounded-lg border bg-white p-5 text-center">
              <div class="text-3xl font-extrabold text-slate-900">2</div>
              <div class="text-slate-600 text-sm">Sedes: USA y Panamá</div>
            </div>
          </div>
          <div class="mt-6 rounded-lg border bg-white p-5">
            <div class="font-semibold">Sede USA</div>
            <div class="text-slate-600">RG IM USA MULTISERVICES LLC</div>
            <div class="text-slate-600">12458 sw 220 st Miami fl 33170</div>
            <div class="mt-4 font-semibold">Sede Panamá</div>
            <div class="text-slate-600">RG IM PANAMA MULTISERVICES SA</div>
            <div class="text-slate-600">Calle 50, F&F Tower. Piso 43, Oficina 43-C, Ciudad de Panamá, Panamá</div>
          </div>
        </aside>
      </div>
    </section>
  `;
}
