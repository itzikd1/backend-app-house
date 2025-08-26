// This is a simple Express server for local development
// In production, Vercel will use the API routes directly

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import configurations
const setupSwagger = require('./config/swagger');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(logger); // Request logging

// Import API routes
const itemsRoute = require('./api/items');
const healthRoute = require('./api/health');

// API Documentation - Swagger UI
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// API routes
app.use('/api/items', itemsRoute);
app.use('/api/health', healthRoute);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Simple root route with API documentation link
app.get('/', (req, res) => {
  const apiDocsLink = process.env.NODE_ENV !== 'production' 
    ? '<li><a href="/api-docs">API Documentation (Swagger UI)</a></li>'
    : '';
    
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Express API Server</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
        .endpoint { margin: 15px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #4CAF50; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Express API Server</h1>
        <p>Welcome to the API server. Below are the available endpoints:</p>
        
        <h2>Quick Links</h2>
        <ul>
          <li><a href="/api/items">List all items (GET /api/items)</a></li>
          <li><a href="/api/health">Health check (GET /api/health)</a></li>
          ${apiDocsLink}
        </ul>
        
        <h2>API Endpoints</h2>
        
        <div class="endpoint">
          <h3>Items</h3>
          <p><strong>GET /api/items</strong> - Get all items</p>
          <p><strong>POST /api/items</strong> - Create a new item (requires JSON body with <code>name</code>)</p>
          <p><strong>PUT /api/items</strong> - Update an item (requires JSON body with <code>id</code> and <code>name</code>)</p>
          <p><strong>DELETE /api/items</strong> - Delete an item (requires JSON body with <code>id</code>)</p>
        </div>
        
        <div class="endpoint">
          <h3>Health</h3>
          <p><strong>GET /api/health</strong> - Check API health status</p>
        </div>
        
        <p>For detailed API documentation, use the Swagger UI link above or check the <a href="https://github.com/yourusername/express-vercel-deployment" target="_blank">GitHub repository</a>.</p>
      </div>
    </body>
    </html>
  `);
});

// Handle 404 - Keep this as the last route
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`
  });
});

// Use the error handling middleware
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log('\nAPI Endpoints:');
  console.log(`- GET    http://localhost:${PORT}/api/items`);
  console.log(`- PUT    http://localhost:${PORT}/api/items`);
  console.log(`- DELETE http://localhost:${PORT}/api/items`);
  console.log(`- GET    http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
