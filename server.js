// This is a simple Express server for local development
// In production, Vercel will use the API routes directly

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Import API routes
const itemsRoute = require('./api/items');
const healthRoute = require('./api/health');

// Use API routes with base path
app.use('/api/items', itemsRoute);
app.use('/api/health', healthRoute);

// Simple root route
app.get('/', (req, res) => {
  res.send(`
    <h1>Express API Server</h1>
    <p>API Endpoints:</p>
    <ul>
      <li>GET <a href="/api/items">/api/items</a> - Get all items</li>
      <li>PUT /api/items - Update an item (requires JSON body with index and value)</li>
      <li>DELETE /api/items - Delete an item (requires JSON body with index)</li>
      <li>GET <a href="/api/health">/api/health</a> - Health check</li>
    </ul>
    <p>Use tools like <a href="https://www.postman.com/" target="_blank">Postman</a> or <a href="https://curl.se/" target="_blank">curl</a> to test PUT and DELETE methods.</p>
  `);
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

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
