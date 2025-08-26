import { defineConfig } from '@prisma/internals';

export default defineConfig({
  // Prisma Client configuration
  client: {
    // Enable query logging in development
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  },
  // Database connection
  datasource: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Seed configuration
  seed: {
    // Path to the seed script
    run: 'node prisma/seed.js',
  },
  // Output directory for Prisma Client
  output: {
    client: './node_modules/.prisma/client',
  },
});
