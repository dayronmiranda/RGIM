const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Enable CORS
app.use(cors());

// Enable compression
app.use(compression());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname), {
  maxAge: '1d', // Cache static files for 1 day
  etag: true
}));

// API Routes for JSON data
app.get('/api/products', (req, res) => {
  try {
    const products = require('./products.json');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error loading products' });
  }
});

app.get('/api/categories', (req, res) => {
  try {
    const categories = require('./categories.json');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error loading categories' });
  }
});

app.get('/api/translations', (req, res) => {
  try {
    const translations = require('./translations.json');
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: 'Error loading translations' });
  }
});

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes or static assets
  if (req.path.startsWith('/api/') || 
      req.path.includes('.') && !req.path.endsWith('.html')) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RGIM Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});