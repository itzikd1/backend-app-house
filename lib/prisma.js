// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

// Add logging for environment variables (remove in production)
if (process.env.NODE_ENV !== 'test') {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Database URL:', process.env.DATABASE_URL ? '***DB URL SET***' : 'DB URL NOT SET');
  console.log('Prisma Accelerate URL:', process.env.PRISMA_ACCELERATE_URL ? '***ACCELERATE URL SET***' : 'ACCELERATE URL NOT SET');
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

let prisma;

try {
  if (process.env.NODE_ENV === 'production') {
    console.log('Using production Prisma client with Accelerate');
    prisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.PRISMA_ACCELERATE_URL || process.env.DATABASE_URL,
        },
      },
    });
  } else {
    if (!global.prisma) {
      console.log('Creating new Prisma client');
      global.prisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
    }
    prisma = global.prisma;
  }
} catch (error) {
  console.error('Failed to initialize Prisma Client:', error);
  throw error;
}

// Test the database connection when the module loads
async function testConnection() {
  try {
    await prisma.$connect();
    if (process.env.NODE_ENV !== 'test') {
      console.log('Successfully connected to the database');
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Failed to connect to the database:', error);
    }
    throw error;
  }
}

// Test the connection but don't block the module export
testConnection().catch(console.error);

module.exports = prisma;
