const healthService = require('../healthService');

describe('healthService', () => {
  it('should have getDatabaseHealth function', () => {
    expect(typeof healthService.getDatabaseHealth).toBe('function');
  });
});

