const healthController = require('../health');

describe('healthController', () => {
  it('should export an object', () => {
    expect(typeof healthController).toBe('object');
  });
  it('should have getHealth function', () => {
    expect(typeof healthController.getHealth).toBe('function');
  });
});

