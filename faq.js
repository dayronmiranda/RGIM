// faq.js
export function renderFAQ(container) {
  container.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid lg:grid-cols-3 gap-10">
        <div>
          <h1 class="text-3xl font-bold">Preguntas frecuentes</h1>
          <p class="mt-3 text-slate-600">Encuentra respuestas claras sobre compras, pagos y envíos. Si necesitas apoyo, nuestro equipo está disponible.</p>
        </div>
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white border rounded-lg p-5">
            <h3 class="font-semibold">¿Cómo funciona el proceso de compra?</h3>
            <p class="mt-2 text-slate-600">Nuestro proceso es simple y seguro: selecciona los productos deseados, agrégalos al carrito, completa tus datos de contacto y envía la solicitud. Recibiremos tu pedido inmediatamente y nos pondremos en contacto contigo para coordinar los detalles finales.</p>
          </div>
          <div class="bg-white border rounded-lg p-5">
            <h3 class="font-semibold">¿Cómo se realiza la comunicación y seguimiento?</h3>
            <p class="mt-2 text-slate-600">Una vez recibida tu solicitud, nuestro equipo de atención al cliente se comunicará contigo vía WhatsApp dentro de las próximas 24 horas para confirmar tu pedido, coordinar el método de pago y brindarte información detallada sobre el envío.</p>
          </div>
          <div class="bg-white border rounded-lg p-5">
            <h3 class="font-semibold">¿Qué métodos de pago están disponibles?</h3>
            <p class="mt-2 text-slate-600">Aceptamos pagos a través de Zelle y transferencias bancarias. Estos métodos garantizan transacciones seguras y rápidas. El proceso de pago se coordina directamente con nuestro equipo de ventas para mayor seguridad.</p>
          </div>
          <div class="bg-white border rounded-lg p-5">
            <h3 class="font-semibold">¿Cómo se calculan los costos de envío?</h3>
            <p class="mt-2 text-slate-600">Ofrecemos dos modalidades: Envío marítimo sin costo adicional (solo pagas el precio de los productos) y envío aéreo con un 10% adicional sobre el valor total. El tiempo de entrega varía según la modalidad seleccionada.</p>
          </div>
          <div class="bg-white border rounded-lg p-5">
            <h3 class="font-semibold">¿Cuál es el alcance geográfico de sus envíos?</h3>
            <p class="mt-2 text-slate-600">Realizamos envíos desde nuestras instalaciones en Panamá hacia todos los países de Latinoamérica y el Caribe. Contamos con una red logística confiable que garantiza la entrega segura de tu pedido.</p>
          </div>
          <div class="bg-white border rounded-lg p-5">
            <h3 class="font-semibold">¿Se mantiene un registro de mis compras?</h3>
            <p class="mt-2 text-slate-600">Sí, mantenemos un historial completo de tus solicitudes durante tu sesión de navegación. Esto te permite revisar pedidos anteriores y facilita el proceso de seguimiento con nuestro equipo de atención al cliente.</p>
          </div>
        </div>
      </div>
    </section>
  `;
}
