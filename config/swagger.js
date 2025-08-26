// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

// Load base configuration
const baseConfig = require('../docs/swagger/base');

// Find all Swagger definition files
const swaggerDir = path.join(__dirname, '../docs/swagger');
const definitionFiles = fs.readdirSync(swaggerDir)
  .filter(file => file.endsWith('.js') && file !== 'base.js')
  .map(file => path.join(swaggerDir, file));

// Load all definition files
const definitions = definitionFiles.map(file => require(file));

// Combine all paths and components
const combinedPaths = {};
const combinedComponents = {
  schemas: {},
  securitySchemes: baseConfig.components.securitySchemes
};

// Process each definition file
const swaggerOptions = {
  definition: {
    ...baseConfig,
    paths: {}
  },
  // Include JSDoc from route files
  apis: [
    './api/**/*.js',
    './routes/*.js',
    ...definitionFiles
  ]
};

const specs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
  
  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`📚 API Documentation available at http://localhost:${process.env.PORT || 3000}/api-docs`);
};

module.exports = setupSwagger;
