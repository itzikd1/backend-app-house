const prisma = require('../prisma');

const getDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'connected',
      message: 'Database connection successful',
      error: null,
    };
  } catch (error) {
    return {
      status: 'disconnected',
      message: 'Failed to connect to database',
      error: {
        name: error.name,
        message: error.message,
      },
    };
  }
};

module.exports = {
  getDatabaseHealth,
};

