require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import configurations
const setupSwagger = require('./config/swagger');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { authenticate } = require('./lib/middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
// app.use(cors({
//   origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
//   credentials: true
// }));
app.use(express.json()); // Parse JSON bodies
app.use(logger); // Request logging

// Import API routes
const itemsRoute = require('./api/items');
const healthRoute = require('./api/health');
const authRoute = require('./src/routes/auth.routes');
const usersRoute = require('./routes/users');
const profileRoute = require('./routes/profile');

// API Documentation - Swagger UI
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// API routes
app.use('/api/items', itemsRoute);
app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/profile', profileRoute);

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
          <li><a href="/api/users">List users (GET /api/users) - Protected</a></li>
          <li><a href="/api/profile">User profile (GET /api/profile) - Protected</a></li>
          ${apiDocsLink}
        </ul>
        
        <h2>API Endpoints</h2>
        
        <div class="endpoint">
          <h3>Authentication</h3>
          <p><strong>POST /api/auth/signup</strong> - Register a new user</p>
          <p><strong>POST /api/auth/signin</strong> - Login user and get JWT token</p>
        </div>
        
        <div class="endpoint">
          <h3>Users</h3>
          <p><strong>GET /api/users</strong> - Get all users (Protected)</p>
          <p><strong>POST /api/users</strong> - Create a new user (Public)</p>
        </div>
        
        <div class="endpoint">
          <h3>Profile</h3>
          <p><strong>GET /api/profile</strong> - Get current user's profile (Protected)</p>
          <p><strong>PATCH /api/profile</strong> - Update current user's profile (Protected)</p>
        </div>
        
        <div class="endpoint">
          <h3>Items</h3>
          <p><strong>GET /api/items</strong> - Get all items</p>
          <p><strong>POST /api/items</strong> - Create a new item</p>
        </div>
        
        <div class="endpoint">
          <h3>Health</h3>
          <p><strong>GET /api/health</strong> - Check API health status</p>
        </div>
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
  console.log(`- POST   http://localhost:${PORT}/api/items`);
  console.log(`- GET    http://localhost:${PORT}/api/users`);
  console.log(`- POST   http://localhost:${PORT}/api/users`);
  console.log(`- GET    http://localhost:${PORT}/api/profile`);
  console.log(`- PATCH  http://localhost:${PORT}/api/profile`);
  console.log(`- GET    http://localhost:${PORT}/api/health\n`);
  console.log('Authentication:');
  console.log(`- POST   http://localhost:${PORT}/api/auth/signup`);
  console.log(`- POST   http://localhost:${PORT}/api/auth/signin\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});
