const authController = require('../auth');

describe('authController', () => {
  it('should export an object', () => {
    expect(typeof authController).toBe('object');
  });
  it('should have a register function', () => {
    expect(typeof authController.register).toBe('function');
  });
  it('should have a login function', () => {
    expect(typeof authController.login).toBe('function');
  });
  it('should have a me function', () => {
    expect(typeof authController.me).toBe('function');
  });
});

