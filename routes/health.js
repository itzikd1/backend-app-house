const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Health check endpoint
router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'production',
    region: process.env.VERCEL_REGION || 'local',
    deployment: 'vercel',
    database: {
      status: 'unknown',
      message: '',
      error: null,
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.database.status = 'connected';
    healthCheck.database.message = 'Database connection successful';
  } catch (error) {
    healthCheck.status = 'error';
    healthCheck.database.status = 'disconnected';
    healthCheck.database.message = 'Failed to connect to database';
    healthCheck.database.error = {
      name: error.name,
      message: error.message,
    };
  }

  res.status(200).json(healthCheck);
});

module.exports = router;
