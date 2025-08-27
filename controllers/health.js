const healthService = require('../lib/services/healthService');

const getHealth = async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'production',
    region: process.env.VERCEL_REGION || 'local',
    deployment: 'vercel',
    database: {},
  };

  healthCheck.database = await healthService.getDatabaseHealth();
  if (healthCheck.database.status !== 'connected') {
    healthCheck.status = 'error';
  }

  res.status(200).json(healthCheck);
};

module.exports = {
  getHealth,
};

