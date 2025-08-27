module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/controllers/__tests__', '<rootDir>/lib/services/__tests__'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'lib/services/**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
};

