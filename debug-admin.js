// debug-admin.js
// Script para debuggear el sistema de administración

console.log('=== DEBUG ADMIN SYSTEM ===');

// Verificar localStorage
const orders = JSON.parse(localStorage.getItem('orders') || '[]');
console.log('📦 Órdenes en localStorage:', orders.length);
console.log('📋 Contenido completo:', orders);

// Crear órdenes de prueba si no existen
if (orders.length === 0) {
  console.log('🔧 Creando órdenes de prueba...');
  
  const testOrders = [
    {
      id: '1703123456789',
      date: new Date().toISOString(),
      name: 'Juan Pérez',
      email: 'juan@example.com',
      whatsapp: '+507 6123-4567',
      country: 'Panamá',
      address: 'Ciudad de Panamá',
      shipping: 'maritime',
      items: [
        { id: 1, name: 'iPhone 15', price: 999, qty: 1 },
        { id: 2, name: 'AirPods Pro', price: 249, qty: 1 }
      ],
      subtotal: 1248,
      shippingCost: 0,
      total: 1248,
      status: 'pending'
    },
    {
      id: '1703123456790',
      date: new Date(Date.now() - 86400000).toISOString(), // Ayer
      name: 'María González',
      email: 'maria@example.com',
      whatsapp: '+507 6987-6543',
      country: 'Costa Rica',
      address: 'San José',
      shipping: 'air',
      items: [
        { id: 3, name: 'MacBook Air', price: 1299, qty: 1 }
      ],
      subtotal: 1299,
      shippingCost: 129.9,
      total: 1428.9,
      status: 'processing'
    },
    {
      id: '1703123456791',
      date: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      whatsapp: '+507 6555-1234',
      country: 'Colombia',
      address: 'Bogotá',
      shipping: 'maritime',
      items: [
        { id: 4, name: 'Samsung Galaxy S24', price: 899, qty: 1 },
        { id: 5, name: 'Galaxy Buds', price: 149, qty: 2 }
      ],
      subtotal: 1197,
      shippingCost: 0,
      total: 1197,
      status: 'shipped'
    }
  ];
  
  localStorage.setItem('orders', JSON.stringify(testOrders));
  console.log('✅ Órdenes de prueba creadas:', testOrders.length);
} else {
  console.log('✅ Ya existen órdenes en el sistema');
}

// Verificar estructura de cada orden
orders.forEach((order, index) => {
  console.log(`📋 Orden ${index + 1}:`, {
    id: order.id,
    name: order.name,
    whatsapp: order.whatsapp,
    total: order.total,
    items: order.items?.length || 0,
    status: order.status,
    date: order.date
  });
});

// Verificar funciones del admin
console.log('🔍 Verificando funciones del admin...');

// Simular carga de datos del dashboard
function testLoadDashboardData() {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalSales: orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0),
    uniqueCustomers: new Set(orders.map(o => o.whatsapp)).size
  };
  
  console.log('📊 Estadísticas calculadas:', stats);
  return stats;
}

const stats = testLoadDashboardData();

// Verificar si el admin puede acceder a las órdenes
console.log('🔐 Verificando acceso admin...');
console.log('Usuario: admin');
console.log('Contraseña: admin123');

// Función para limpiar datos de prueba
window.clearTestData = function() {
  localStorage.removeItem('orders');
  console.log('🗑️ Datos de prueba eliminados');
  location.reload();
};

// Función para agregar más datos de prueba
window.addMoreTestData = function() {
  const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  const newOrder = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    name: 'Cliente Prueba ' + Math.floor(Math.random() * 1000),
    email: 'test@example.com',
    whatsapp: '+507 6' + Math.floor(Math.random() * 1000000).toString().padStart(7, '0'),
    country: 'Panamá',
    address: 'Ciudad de Panamá',
    shipping: Math.random() > 0.5 ? 'maritime' : 'air',
    items: [
      { id: Math.floor(Math.random() * 100), name: 'Producto Test', price: Math.floor(Math.random() * 500) + 100, qty: 1 }
    ],
    subtotal: Math.floor(Math.random() * 500) + 100,
    shippingCost: 0,
    total: Math.floor(Math.random() * 500) + 100,
    status: 'pending'
  };
  
  currentOrders.push(newOrder);
  localStorage.setItem('orders', JSON.stringify(currentOrders));
  console.log('➕ Nueva orden agregada:', newOrder);
  
  // Recargar si estamos en la página de admin
  if (window.location.hash.includes('admin')) {
    location.reload();
  }
};

console.log('🛠️ Funciones de debug disponibles:');
console.log('- clearTestData(): Elimina todos los datos de prueba');
console.log('- addMoreTestData(): Agrega una nueva orden de prueba');

console.log('=== FIN DEBUG ===');