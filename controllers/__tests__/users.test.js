const usersController = require('../users');

describe('usersController', () => {
  it('should export an object', () => {
    expect(typeof usersController).toBe('object');
  });
  it('should have getAllUsers function', () => {
    expect(typeof usersController.getAllUsers).toBe('function');
  });
  it('should have createUser function', () => {
    expect(typeof usersController.createUser).toBe('function');
  });
});

