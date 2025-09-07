// faq.js
export function renderFAQ(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div class="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <div class="text-center">
            <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Preguntas Frecuentes
            </h1>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              Encuentra respuestas claras sobre compras, pagos y envíos. Si necesitas apoyo adicional, nuestro equipo está disponible para ayudarte.
            </p>
          </div>
          
          <!-- FAQ Items with Accordion Style -->
          <dl class="mt-16 space-y-6 divide-y divide-gray-900/10">
            <div class="pt-6">
              <dt>
                <button class="faq-button flex w-full items-start justify-between text-left text-gray-900" data-target="faq-1">
                  <span class="text-base font-semibold leading-7">¿Cómo funciona el proceso de compra?</span>
                  <span class="ml-6 flex h-7 items-center">
                    <svg class="faq-icon h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd class="faq-content mt-2 pr-12 hidden" id="faq-1">
                <div class="text-base leading-7 text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
                  <p class="mb-3">Nuestro proceso es simple y seguro:</p>
                  <ol class="list-decimal list-inside space-y-2 ml-4">
                    <li>Selecciona los productos deseados en nuestra tienda</li>
                    <li>Agrégalos al carrito de compras</li>
                    <li>Completa tus datos de contacto y envío</li>
                    <li>Envía la solicitud de compra</li>
                  </ol>
                  <p class="mt-3">Recibiremos tu pedido inmediatamente y nos pondremos en contacto contigo para coordinar los detalles finales.</p>
                </div>
              </dd>
            </div>

            <div class="pt-6">
              <dt>
                <button class="faq-button flex w-full items-start justify-between text-left text-gray-900" data-target="faq-2">
                  <span class="text-base font-semibold leading-7">¿Cómo se realiza la comunicación y seguimiento?</span>
                  <span class="ml-6 flex h-7 items-center">
                    <svg class="faq-icon h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd class="faq-content mt-2 pr-12 hidden" id="faq-2">
                <div class="text-base leading-7 text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
                  <div class="flex items-start gap-3 mb-3">
                    <div class="flex-shrink-0">
                      <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Comunicación vía WhatsApp</p>
                      <p>Una vez recibida tu solicitud, nuestro equipo se comunicará contigo dentro de las próximas <strong>24 horas</strong> para:</p>
                    </div>
                  </div>
                  <ul class="list-disc list-inside space-y-1 ml-9 text-sm">
                    <li>Confirmar tu pedido y disponibilidad</li>
                    <li>Coordinar el método de pago</li>
                    <li>Brindarte información detallada sobre el envío</li>
                    <li>Proporcionar seguimiento en tiempo real</li>
                  </ul>
                </div>
              </dd>
            </div>

            <div class="pt-6">
              <dt>
                <button class="faq-button flex w-full items-start justify-between text-left text-gray-900" data-target="faq-3">
                  <span class="text-base font-semibold leading-7">¿Qué métodos de pago están disponibles?</span>
                  <span class="ml-6 flex h-7 items-center">
                    <svg class="faq-icon h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd class="faq-content mt-2 pr-12 hidden" id="faq-3">
                <div class="text-base leading-7 text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
                  <p class="mb-4">Aceptamos los siguientes métodos de pago seguros:</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div class="flex-shrink-0">
                        <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">Zelle</p>
                        <p class="text-sm text-gray-600">Transferencia instantánea</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div class="flex-shrink-0">
                        <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">Transferencia Bancaria</p>
                        <p class="text-sm text-gray-600">Proceso seguro y confiable</p>
                      </div>
                    </div>
                  </div>
                  <p class="mt-4 text-sm bg-blue-50 text-blue-800 p-3 rounded-lg">
                    <strong>Nota:</strong> El proceso de pago se coordina directamente con nuestro equipo de ventas para garantizar máxima seguridad.
                  </p>
                </div>
              </dd>
            </div>

            <div class="pt-6">
              <dt>
                <button class="faq-button flex w-full items-start justify-between text-left text-gray-900" data-target="faq-4">
                  <span class="text-base font-semibold leading-7">¿Cómo se calculan los costos de envío?</span>
                  <span class="ml-6 flex h-7 items-center">
                    <svg class="faq-icon h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd class="faq-content mt-2 pr-12 hidden" id="faq-4">
                <div class="text-base leading-7 text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
                  <p class="mb-4">Ofrecemos dos modalidades de envío flexibles:</p>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white rounded-lg border-2 border-green-200 p-4">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5z" />
                        </svg>
                        <h4 class="font-semibold text-green-800">Envío Marítimo</h4>
                      </div>
                      <p class="text-sm text-green-700 mb-2"><strong>Sin costo adicional</strong></p>
                      <p class="text-sm text-gray-600">Solo pagas el precio de los productos. Tiempo de entrega: 15-30 días.</p>
                    </div>
                    <div class="bg-white rounded-lg border-2 border-blue-200 p-4">
                      <div class="flex items-center gap-2 mb-2">
                        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        <h4 class="font-semibold text-blue-800">Envío Aéreo</h4>
                      </div>
                      <p class="text-sm text-blue-700 mb-2"><strong>+10% del valor total</strong></p>
                      <p class="text-sm text-gray-600">Entrega rápida: 3-7 días hábiles.</p>
                    </div>
                  </div>
                </div>
              </dd>
            </div>

            <div class="pt-6">
              <dt>
                <button class="faq-button flex w-full items-start justify-between text-left text-gray-900" data-target="faq-5">
                  <span class="text-base font-semibold leading-7">¿Cuál es el alcance geográfico de sus envíos?</span>
                  <span class="ml-6 flex h-7 items-center">
                    <svg class="faq-icon h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd class="faq-content mt-2 pr-12 hidden" id="faq-5">
                <div class="text-base leading-7 text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
                  <div class="flex items-start gap-3 mb-4">
                    <svg class="h-8 w-8 text-indigo-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z" />
                    </svg>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Cobertura Regional Completa</h4>
                      <p>Realizamos envíos desde nuestras instalaciones en <strong>Panamá</strong> hacia todos los países de:</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-11">
                    <div>
                      <h5 class="font-medium text-gray-900 mb-2">Latinoamérica</h5>
                      <ul class="text-sm text-gray-600 space-y-1">
                        <li>• México y Centroamérica</li>
                        <li>• Sudamérica completa</li>
                        <li>• Islas del Pacífico</li>
                      </ul>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-900 mb-2">El Caribe</h5>
                      <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Antillas Mayores</li>
                        <li>• Antillas Menores</li>
                        <li>• Territorios insulares</li>
                      </ul>
                    </div>
                  </div>
                  <p class="mt-4 text-sm bg-indigo-50 text-indigo-800 p-3 rounded-lg">
                    Contamos con una red logística confiable que garantiza la entrega segura de tu pedido en toda la región.
                  </p>
                </div>
              </dd>
            </div>

            <div class="pt-6">
              <dt>
                <button class="faq-button flex w-full items-start justify-between text-left text-gray-900" data-target="faq-6">
                  <span class="text-base font-semibold leading-7">¿Se mantiene un registro de mis compras?</span>
                  <span class="ml-6 flex h-7 items-center">
                    <svg class="faq-icon h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd class="faq-content mt-2 pr-12 hidden" id="faq-6">
                <div class="text-base leading-7 text-gray-600 bg-gray-50 rounded-lg p-4 mt-4">
                  <div class="flex items-start gap-3">
                    <svg class="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                    <div>
                      <h4 class="font-semibold text-gray-900 mb-2">Historial de Compras</h4>
                      <p class="mb-3">Sí, mantenemos un registro completo de tus solicitudes que incluye:</p>
                      <ul class="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Historial durante tu sesión de navegación</li>
                        <li>Detalles de productos solicitados</li>
                        <li>Estado de cada pedido</li>
                        <li>Información de seguimiento</li>
                      </ul>
                      <p class="mt-3 text-sm">Esto facilita el proceso de seguimiento con nuestro equipo de atención al cliente y te permite revisar pedidos anteriores fácilmente.</p>
                    </div>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div class="bg-gray-50 py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            ¿Tienes más preguntas?
          </h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Nuestro equipo está disponible para resolver cualquier duda adicional que puedas tener.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <a href="#/store" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Explorar Tienda
            </a>
            <a href="#/about" class="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
              Conocer más sobre RGIM <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add accordion functionality
  const faqButtons = document.querySelectorAll('.faq-button');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const icon = button.querySelector('.faq-icon');
      
      // Close all other FAQ items
      faqButtons.forEach(otherButton => {
        if (otherButton !== button) {
          const otherTargetId = otherButton.getAttribute('data-target');
          const otherContent = document.getElementById(otherTargetId);
          const otherIcon = otherButton.querySelector('.faq-icon');
          
          otherContent.classList.add('hidden');
          otherIcon.style.transform = 'rotate(0deg)';
        }
      });
      
      // Toggle current FAQ item
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(45deg)';
      } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
      }
    });
  });
}
