/**
 * Base Swagger configuration
 */
module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Prisma',
    version: '1.0.0',
    description: 'A simple Express API with Prisma and PostgreSQL',
    contact: {
      name: 'API Support',
      url: 'https://your-website.com/support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://your-vercel-app.vercel.app',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Items',
      description: 'API endpoints for managing items'
    },
    {
      name: 'Health',
      description: 'Health check endpoints'
    }
  ],
  paths: {}
};
