// Vercel Serverless Function for health check
// @route   GET /api/health
// @desc    Health check endpoint with database status
// @access  Public
const prisma = require('../../lib/prisma');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-cache');

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

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
      error: null
    }
  };

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    healthCheck.database.status = 'connected';
    healthCheck.database.message = 'Database connection successful';
  } catch (error) {
    console.error('Database connection error:', error);
    healthCheck.status = 'error';
    healthCheck.database.status = 'disconnected';
    healthCheck.database.message = 'Failed to connect to database';
    healthCheck.database.error = {
      name: error.name,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };
  }

  // If database is not connected, return 503 Service Unavailable
  if (healthCheck.database.status !== 'connected') {
    return res.status(503).json(healthCheck);
  }

  return res.status(200).json(healthCheck);
};
