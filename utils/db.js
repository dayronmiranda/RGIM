// db.js
// Conexión básica a MongoDB usando Node.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Cambia esto si tu MongoDB está en otro host
const dbName = 'tienda_simple';

async function connectDB() {
  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    const db = client.db(dbName);
    // Aquí puedes hacer operaciones con la base de datos
    return db;
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
  }
}

module.exports = { connectDB };
