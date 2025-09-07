// admin.js
export function renderAdmin(container) {
  container.innerHTML = `
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-2xl font-bold">Panel de solicitudes</h1>
      <div id="admin-login" class="max-w-md mt-6 border rounded-lg p-5 bg-white">
        <h2 class="font-semibold">Acceso</h2>
        <form id="admin-login-form" class="mt-3 space-y-3">
          <div>
            <label class="block text-sm" for="adminUser">Usuario</label>
            <input id="adminUser" type="text" class="mt-1 w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label class="block text-sm" for="adminPass">Contraseña</label>
            <input id="adminPass" type="password" class="mt-1 w-full border rounded px-3 py-2" required />
          </div>
          <button class="w-full bg-brand-600 text-white py-2 rounded hover:bg-brand-700">Entrar</button>
        </form>
      </div>
      <div id="admin-dashboard" class="hidden mt-6">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-xl font-semibold">Solicitudes de compra</h2>
          <div class="flex items-center gap-2">
            <button id="btn-export-csv" class="px-3 py-2 border rounded bg-white hover:bg-slate-50 text-sm">Exportar CSV</button>
            <button id="btn-admin-logout" class="px-3 py-2 border rounded bg-white hover:bg-slate-50 text-sm">Cerrar sesión</button>
          </div>
        </div>
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm border bg-white">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="p-2 text-left">Fecha</th>
                <th class="p-2 text-left">Cliente</th>
                <th class="p-2 text-left">WhatsApp</th>
                <th class="p-2 text-left">Envío</th>
                <th class="p-2 text-left">Total</th>
                <th class="p-2 text-left">Items</th>
                <th class="p-2 text-left">Estado</th>
                <th class="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody id="admin-rows"></tbody>
          </table>
        </div>
      </div>
    </section>
  `;
  const loginForm = document.getElementById('admin-login-form');
  const dashboard = document.getElementById('admin-dashboard');
  if (loginForm && dashboard) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      const user = document.getElementById('adminUser').value;
      const pass = document.getElementById('adminPass').value;
      if (user === 'admin' && pass === 'admin123') {
        dashboard.classList.remove('hidden');
        loginForm.parentElement.classList.add('hidden');
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    };
  }
}
