// admin.js
import { getAnalyticsStats } from '../utils/analytics.js';

export function renderAdmin(container) {
  container.innerHTML = `
    <!-- Admin Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <h1 class="text-xl font-semibold text-gray-900">Panel de Administración</h1>
          </div>
          <div id="admin-user-info" class="hidden flex items-center gap-3">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <div class="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Conectado como Admin</span>
            </div>
            <button id="btn-admin-logout" class="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="min-h-screen bg-gray-50">
      
      <!-- Login Section -->
      <div id="admin-login" class="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
          <div class="text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <svg class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Acceso Administrativo
            </h2>
            <p class="mt-2 text-sm text-gray-600">
              Ingresa tus credenciales para acceder al panel de control
            </p>
          </div>
          
          <div class="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
            <form id="admin-login-form" class="space-y-6">
              <div>
                <label for="adminUser" class="block text-sm font-medium leading-6 text-gray-900">
                  Usuario
                </label>
                <div class="mt-2 relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input id="adminUser" name="username" type="text" required 
                         class="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                         placeholder="Ingresa tu usuario" />
                </div>
              </div>

              <div>
                <label for="adminPass" class="block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
                <div class="mt-2 relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159-.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  </div>
                  <input id="adminPass" name="password" type="password" required 
                         class="block w-full rounded-md border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
                         placeholder="Ingresa tu contraseña" />
                </div>
              </div>

              <div id="login-error" class="hidden rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Error de autenticación</h3>
                    <p class="mt-1 text-sm text-red-700">Usuario o contraseña incorrectos. Inténtalo de nuevo.</p>
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" 
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200">
                  <span class="flex items-center gap-2">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159-.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                    Iniciar sesión
                  </span>
                </button>
              </div>
            </form>
          </div>

          <!-- Security Notice -->
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Acceso Seguro</h3>
                <p class="mt-1 text-sm text-blue-700">
                  Este panel está protegido. Solo personal autorizado puede acceder a la información de pedidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Section -->
      <div id="admin-dashboard" class="hidden">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          
          <!-- Dashboard Stats -->
          <div class="mb-8">
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-500">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Total Pedidos</dt>
                        <dd class="text-lg font-medium text-gray-900" id="total-orders">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12s-1.536.219-2.121.659c-1.172.879-1.172 2.303 0 3.182l.879.659z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Ventas Totales</dt>
                        <dd class="text-lg font-medium text-gray-900" id="total-sales">$0.00</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                        <dd class="text-lg font-medium text-gray-900" id="pending-orders">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                <div class="p-5">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                        <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-5 w-0 flex-1">
                      <dl>
                        <dt class="text-sm font-medium text-gray-500 truncate">Visitantes Hoy</dt>
                        <dd class="text-lg font-medium text-gray-900" id="today-visitors">0</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Section -->
          <div class="mb-8">
            <div class="bg-white shadow-sm rounded-lg border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">Analytics de Visitantes</h3>
                    <p class="mt-1 text-sm text-gray-500">Estadísticas de visitantes y comportamiento</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <button id="btn-refresh-analytics" class="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                      Actualizar
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <!-- Total Visitors -->
                  <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-blue-600">Total Visitantes</p>
                        <p class="text-2xl font-bold text-blue-900" id="analytics-total-visitors">0</p>
                      </div>
                      <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Page Views -->
                  <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-green-600">Vistas de Página</p>
                        <p class="text-2xl font-bold text-green-900" id="analytics-page-views">0</p>
                      </div>
                      <svg class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Top Country -->
                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-purple-600">País Principal</p>
                        <p class="text-lg font-bold text-purple-900" id="analytics-top-country">-</p>
                      </div>
                      <svg class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Device Types -->
                  <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-orange-600">Dispositivos</p>
                        <p class="text-lg font-bold text-orange-900" id="analytics-devices">-</p>
                      </div>
                      <svg class="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 16.5h3" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Countries Table -->
                <div class="bg-gray-50 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-900 mb-3">Visitantes por País (Top 5)</h4>
                  <div class="space-y-2" id="analytics-countries-list">
                    <div class="flex items-center justify-between py-2">
                      <span class="text-sm text-gray-600">Cargando datos...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Orders Table -->
          <div class="bg-white shadow-sm rounded-lg border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Solicitudes de Compra</h3>
                  <p class="mt-1 text-sm text-gray-500">Gestiona todas las solicitudes de compra de los clientes</p>
                </div>
                <div class="flex items-center gap-3">
                  <button id="btn-refresh" class="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Actualizar
                  </button>
                  <button id="btn-export-csv" class="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Exportar CSV
                  </button>
                </div>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WhatsApp
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Envío
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody id="admin-rows" class="bg-white divide-y divide-gray-200">
                  <!-- Orders will be populated here -->
                  <tr>
                    <td colspan="8" class="px-6 py-12 text-center text-sm text-gray-500">
                      <div class="flex flex-col items-center">
                        <svg class="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
                        </svg>
                        <p class="text-lg font-medium text-gray-900 mb-1">No hay solicitudes</p>
                        <p>Las solicitudes de compra aparecerán aquí cuando los clientes realicen pedidos.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Enhanced login functionality
  const loginForm = document.getElementById('admin-login-form');
  const dashboard = document.getElementById('admin-dashboard');
  const loginSection = document.getElementById('admin-login');
  const userInfo = document.getElementById('admin-user-info');
  const loginError = document.getElementById('login-error');

  if (loginForm && dashboard) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      
      // Hide previous error
      loginError.classList.add('hidden');
      
      const user = document.getElementById('adminUser').value;
      const pass = document.getElementById('adminPass').value;
      
      // Add loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <span class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verificando...
        </span>
      `;
      submitBtn.disabled = true;
      
      // Simulate authentication delay
      setTimeout(() => {
        if (user === 'admin' && pass === 'admin123') {
          // Success
          loginSection.classList.add('hidden');
          dashboard.classList.remove('hidden');
          userInfo.classList.remove('hidden');
          
          // Load dashboard data
          loadDashboardData();
        } else {
          // Error
          loginError.classList.remove('hidden');
          
          // Clear form
          document.getElementById('adminUser').value = '';
          document.getElementById('adminPass').value = '';
          document.getElementById('adminUser').focus();
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    };
  }

  // Logout functionality
  document.getElementById('btn-admin-logout').onclick = function() {
    loginSection.classList.remove('hidden');
    dashboard.classList.add('hidden');
    userInfo.classList.add('hidden');
    
    // Clear form
    document.getElementById('adminUser').value = '';
    document.getElementById('adminPass').value = '';
    loginError.classList.add('hidden');
  };

  // Dashboard functionality
  function loadDashboardData() {
    console.log('🔄 Cargando datos del dashboard...');

    // Load orders from localStorage or API
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    console.log('📦 Órdenes encontradas:', orders.length);
    console.log('📋 Órdenes completas:', orders);

    // Update stats
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('pending-orders').textContent = orders.filter(o => o.status === 'pending').length;

    const totalSales = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    document.getElementById('total-sales').textContent = `$${totalSales.toFixed(2)}`;

    // Load analytics data
    loadAnalyticsData();

    console.log('📊 Estadísticas actualizadas:', {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      sales: totalSales
    });

    // Populate table
    populateOrdersTable(orders);
  }

  // Analytics functionality
  function loadAnalyticsData() {
    try {
      const analytics = getAnalyticsStats();

      // Update analytics stats
      document.getElementById('today-visitors').textContent = analytics.summary.todayVisitors;
      document.getElementById('analytics-total-visitors').textContent = analytics.summary.totalVisitors;
      document.getElementById('analytics-page-views').textContent = analytics.summary.totalPageViews;

      // Update top country
      const topCountry = analytics.countries[0];
      document.getElementById('analytics-top-country').textContent = topCountry ? topCountry[0] : 'Sin datos';

      // Update devices
      const deviceStats = Object.entries(analytics.devices)
        .map(([device, count]) => `${device}: ${count}`)
        .join(', ');
      document.getElementById('analytics-devices').textContent = deviceStats || 'Sin datos';

      // Update countries list
      const countriesList = document.getElementById('analytics-countries-list');
      if (countriesList && analytics.countries.length > 0) {
        countriesList.innerHTML = analytics.countries.slice(0, 5).map(([country, count]) => `
          <div class="flex items-center justify-between py-2">
            <span class="text-sm text-gray-900">${country}</span>
            <span class="text-sm font-medium text-gray-600">${count} visitantes</span>
          </div>
        `).join('');
      } else if (countriesList) {
        countriesList.innerHTML = `
          <div class="flex items-center justify-between py-2">
            <span class="text-sm text-gray-600">No hay datos de visitantes aún</span>
          </div>
        `;
      }

      console.log('📊 Analytics cargados:', analytics);
    } catch (error) {
      console.warn('Error loading analytics:', error);
      // Fallback values
      document.getElementById('today-visitors').textContent = '0';
      document.getElementById('analytics-total-visitors').textContent = '0';
      document.getElementById('analytics-page-views').textContent = '0';
      document.getElementById('analytics-top-country').textContent = '-';
      document.getElementById('analytics-devices').textContent = '-';
    }
  }

  function populateOrdersTable(orders) {
    console.log('📋 Poblando tabla con', orders.length, 'órdenes');
    const tbody = document.getElementById('admin-rows');
    
    if (!tbody) {
      console.error('❌ No se encontró el elemento admin-rows');
      return;
    }
    
    if (orders.length === 0) {
      console.log('📭 No hay órdenes, mostrando mensaje vacío');
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-6 py-12 text-center text-sm text-gray-500">
            <div class="flex flex-col items-center">
              <svg class="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119.993z" />
              </svg>
              <p class="text-lg font-medium text-gray-900 mb-1">No hay solicitudes</p>
              <p>Las solicitudes de compra aparecerán aquí cuando los clientes realicen pedidos.</p>
              <div class="mt-4">
                <button onclick="createTestOrder()" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Crear Orden de Prueba
                </button>
              </div>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    console.log('✅ Generando filas de tabla para', orders.length, 'órdenes');
    
    // Ordenar por fecha más reciente primero
    const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tbody.innerHTML = sortedOrders.map((order, index) => {
      console.log(`📝 Procesando orden ${index + 1}:`, order);
      
      return `
        <tr class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${new Date(order.date).toLocaleDateString('es-ES')}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">${order.name || 'Sin nombre'}</div>
            <div class="text-sm text-gray-500">${order.email || 'Sin email'}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <a href="https://wa.me/${order.whatsapp?.replace(/[^0-9]/g, '')}" target="_blank" class="text-green-600 hover:text-green-900">
              ${order.whatsapp || 'Sin WhatsApp'}
            </a>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.shipping === 'air' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
              ${order.shipping === 'air' ? 'Aéreo' : 'Marítimo'}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            ${parseFloat(order.total || 0).toFixed(2)}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${order.items ? order.items.length : 0} productos
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}">
              ${getStatusText(order.status)}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 mr-3" onclick="viewOrder('${order.id}')">
              Ver
            </button>
            <button class="text-red-600 hover:text-red-900" onclick="deleteOrder('${order.id}')">
              Eliminar
            </button>
          </td>
        </tr>
      `;
    }).join('');
    
    console.log('✅ Tabla poblada exitosamente');
  }

  function getStatusColor(status) {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusText(status) {
    switch(status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  }

  // Export CSV functionality
  document.getElementById('btn-export-csv').onclick = function() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    const csv = convertToCSV(orders);
    downloadCSV(csv, 'solicitudes-compra.csv');
  };

  function convertToCSV(orders) {
    const headers = ['Fecha', 'Cliente', 'Email', 'WhatsApp', 'Envío', 'Total', 'Estado'];
    const rows = orders.map(order => [
      new Date(order.date).toLocaleDateString(),
      order.name,
      order.email,
      order.whatsapp,
      order.shipping === 'air' ? 'Aéreo' : 'Marítimo',
      order.total,
      getStatusText(order.status)
    ]);

    return [headers, ...rows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
  }

  function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Refresh functionality
  document.getElementById('btn-refresh').onclick = function() {
    loadDashboardData();
  };

  // Analytics refresh functionality
  document.getElementById('btn-refresh-analytics').onclick = function() {
    loadAnalyticsData();
  };

  // Global functions for table actions
  window.viewOrder = function(orderId) {
    console.log('👁️ Viendo orden:', orderId);
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const itemsList = order.items ? order.items.map(item => `• ${item.qty}x ${item.name} - ${(item.price * item.qty).toFixed(2)}`).join('\n') : 'Sin productos';
      alert(`Detalles del pedido #${order.id}:\n\nCliente: ${order.name}\nWhatsApp: ${order.whatsapp}\nEmail: ${order.email}\nFecha: ${new Date(order.date).toLocaleString('es-ES')}\nEnvío: ${order.shipping === 'air' ? 'Aéreo' : 'Marítimo'}\nEstado: ${getStatusText(order.status)}\n\nProductos:\n${itemsList}\n\nTotal: ${order.total}`);
    } else {
      alert('Orden no encontrada');
    }
  };

  window.deleteOrder = function(orderId) {
    console.log('🗑️ Eliminando orden:', orderId);
    if (confirm('¿Estás seguro de que quieres eliminar esta solicitud?')) {
      let orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const initialLength = orders.length;
      orders = orders.filter(o => o.id !== orderId);
      localStorage.setItem('orders', JSON.stringify(orders));
      console.log(`✅ Orden eliminada. Órdenes restantes: ${orders.length} (antes: ${initialLength})`);
      loadDashboardData();
    }
  };
  
  // Función para crear orden de prueba
  window.createTestOrder = function() {
    console.log('🧪 Creando orden de prueba...');
    const testOrder = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      name: 'Cliente Prueba',
      email: 'test@example.com',
      whatsapp: '+507 6123-4567',
      country: 'Panamá',
      address: 'Ciudad de Panamá',
      shipping: 'maritime',
      items: [
        { id: 1, name: 'Producto de Prueba', price: 100, qty: 1 }
      ],
      subtotal: 100,
      shippingCost: 0,
      total: 100,
      status: 'pending'
    };
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(testOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    console.log('✅ Orden de prueba creada:', testOrder);
    loadDashboardData();
  };
}
