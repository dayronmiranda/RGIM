#!/usr/bin/env node

/**
 * RGIM Development Server
 * Supports SPA routing for clean URLs
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || 'localhost';

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// SPA routes that should serve index.html
const spaRoutes = ['/', '/home', '/store', '/faq', '/about', '/admin'];

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'text/plain';
}

function serveFile(res, filePath, statusCode = 200) {
  try {
    const content = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    
    res.writeHead(statusCode, {
      'Content-Type': contentType,
      'Cache-Control': contentType.startsWith('text/html') ? 'no-cache' : 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    
    res.end(content);
    return true;
  } catch (error) {
    return false;
  }
}

function serve404(res, requestPath) {
  const html404 = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Página no encontrada | RGIM</title>
    <style>
        body { 
            font-family: system-ui, sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: #f8fafc; 
            color: #334155;
            text-align: center;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            padding: 40px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 { color: #dc2626; margin-bottom: 20px; }
        .code { font-family: monospace; background: #f1f5f9; padding: 20px; border-radius: 4px; margin: 20px 0; }
        a { color: #2563eb; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .routes { text-align: left; margin: 20px 0; }
        .routes li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>404 - Página no encontrada</h1>
        <p>La ruta <code>${requestPath}</code> no existe en el servidor de desarrollo.</p>
        
        <div class="routes">
            <h3>Rutas disponibles:</h3>
            <ul>
                <li><a href="/">/ (Inicio)</a></li>
                <li><a href="/store">/store (Tienda)</a></li>
                <li><a href="/faq">/faq (Preguntas)</a></li>
                <li><a href="/about">/about (Nosotros)</a></li>
                <li><a href="/admin">/admin (Admin)</a></li>
            </ul>
        </div>
        
        <div class="code">
            <strong>Servidor de desarrollo RGIM</strong><br>
            Puerto: ${PORT}<br>
            Host: ${HOST}<br>
            Soporte SPA: ✅ Habilitado
        </div>
        
        <p><a href="/">← Volver al inicio</a></p>
    </div>
</body>
</html>`;

  res.writeHead(404, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache'
  });
  res.end(html404);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const requestPath = parsedUrl.pathname;
  
  console.log(`${new Date().toISOString()} - ${req.method} ${requestPath}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }
  
  // Try to serve static file first
  const filePath = path.join(__dirname, requestPath === '/' ? 'index.html' : requestPath);
  
  // Check if it's a static file request
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    if (serveFile(res, filePath)) {
      return;
    }
  }
  
  // Handle SPA routes - serve index.html for known routes
  if (spaRoutes.includes(requestPath)) {
    const indexPath = path.join(__dirname, 'index.html');
    if (serveFile(res, indexPath)) {
      return;
    }
  }
  
  // Handle favicon.ico
  if (requestPath === '/favicon.ico') {
    // Create a simple favicon response
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end();
    return;
  }
  
  // Try to serve from assets directory
  if (requestPath.startsWith('/assets/')) {
    const assetPath = path.join(__dirname, requestPath);
    if (fs.existsSync(assetPath) && fs.statSync(assetPath).isFile()) {
      if (serveFile(res, assetPath)) {
        return;
      }
    }
  }
  
  // Try common file extensions for extensionless requests
  const extensions = ['.html', '.js', '.css', '.json'];
  for (const ext of extensions) {
    const fileWithExt = path.join(__dirname, requestPath + ext);
    if (fs.existsSync(fileWithExt) && fs.statSync(fileWithExt).isFile()) {
      if (serveFile(res, fileWithExt)) {
        return;
      }
    }
  }
  
  // If nothing found, serve 404
  serve404(res, requestPath);
});

server.listen(PORT, HOST, () => {
  console.log('🚀 RGIM Development Server Started');
  console.log(`📍 Server running at: http://${HOST}:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`🌐 Environment: development`);
  console.log(`🛣️  SPA Routing: Enabled`);
  console.log('');
  console.log('📋 Available routes:');
  spaRoutes.forEach(route => {
    console.log(`   http://${HOST}:${PORT}${route}`);
  });
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});