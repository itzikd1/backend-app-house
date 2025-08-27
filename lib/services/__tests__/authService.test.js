const authService = require('../authService');

describe('authService', () => {
  it('should export an object', () => {
    expect(typeof authService).toBe('object');
  });
  it('should have a login function', () => {
    expect(typeof authService.login).toBe('function');
  });
  it('should have a register function', () => {
    expect(typeof authService.register).toBe('function');
  });
});
