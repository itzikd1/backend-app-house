require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-very-secure-secret-key',
  jwtExpiration: '24h', // Token expires in 24 hours
  saltRounds: 10, // For bcrypt password hashing
};
