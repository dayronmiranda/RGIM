const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve pages
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Serve utils
app.use('/utils', express.static(path.join(__dirname, 'utils')));

// API Routes for order management
app.post('/api/orders', (req, res) => {
  try {
    // In a real application, you would save to a database
    // For now, we'll just return success
    console.log('New order received:', req.body);
    res.json({ 
      success: true, 
      message: 'Orden recibida correctamente',
      orderId: Date.now().toString()
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar la orden' 
    });
  }
});

// API route to get orders (for admin panel)
app.get('/api/orders', (req, res) => {
  try {
    // In a real application, you would fetch from a database
    // For now, return empty array
    res.json([]);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las órdenes' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    domain: 'http://www.rgimusa.com'
  });
});

// Catch all handler: send back index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Error interno del servidor' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 RGIM Store Server Started Successfully!

📍 Server running on: http://localhost:${PORT}
🌐 Production domain: http://www.rgimusa.com
📁 Serving files from: ${__dirname}

🛍️  Store: http://localhost:${PORT}/#/store
ℹ️   About: http://localhost:${PORT}/#/about  
❓  FAQ: http://localhost:${PORT}/#/faq
👨‍💼 Admin: http://localhost:${PORT}/#/admin

🔧 API Endpoints:
   POST /api/orders - Submit new orders
   GET  /api/orders - Get orders (admin)
   GET  /api/health - Health check

Ready to serve RGIM customers! 🎉
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});