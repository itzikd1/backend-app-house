// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

let prisma;

try {
  const logOptions = process.env.NODE_ENV === 'test' ? [] : ['error', 'warn'];
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient({
      log: logOptions,
      datasources: {
        db: {
          url: process.env.PRISMA_ACCELERATE_URL || process.env.DATABASE_URL,
        },
      },
    });
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: logOptions,
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
  // Only log errors
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
