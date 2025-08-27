const userService = require('../userService');

describe('userService', () => {
  it('should have a findById function', () => {
    expect(typeof userService.findById).toBe('function');
  });
  it('should have a findByEmail function', () => {
    expect(typeof userService.findByEmail).toBe('function');
  });
  it('should have a create function', () => {
    expect(typeof userService.create).toBe('function');
  });
});
