// db.js
// Conexión básica a MongoDB usando Node.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'tienda_simple';

async function connectDB() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  await client.connect();
  return client.db(dbName);
}

// Guardar productos
async function saveProducts(products) {
  const db = await connectDB();
  const col = db.collection('products');
  await col.deleteMany({});
  return col.insertMany(products);
}

// Guardar categorías
async function saveCategories(categories) {
  const db = await connectDB();
  const col = db.collection('categories');
  await col.deleteMany({});
  return col.insertMany(categories);
}

// Guardar destacados
async function saveFeatured(featured) {
  const db = await connectDB();
  const col = db.collection('featured');
  await col.deleteMany({});
  return col.insertMany(featured);
}

// Guardar carrito por sessionId
async function saveCart(sessionId, cartItems) {
  const db = await connectDB();
  const col = db.collection('carts');
  await col.updateOne(
    { sessionId },
    { $set: { items: cartItems, updatedAt: new Date() } },
    { upsert: true }
  );
}

// Guardar historial de solicitudes (logs)
async function saveRequestLog(log) {
  const db = await connectDB();
  const col = db.collection('request_logs');
  await col.insertOne({ ...log, createdAt: new Date() });
}

module.exports = {
  connectDB,
  saveProducts,
  saveCategories,
  saveFeatured,
  saveCart,
  saveRequestLog
};
