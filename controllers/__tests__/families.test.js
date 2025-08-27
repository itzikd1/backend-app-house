const familiesController = require('../families');

describe('familiesController', () => {
  it('should export an object', () => {
    expect(typeof familiesController).toBe('object');
  });
  it('should have createFamily function', () => {
    expect(typeof familiesController.createFamily).toBe('function');
  });
  it('should have getFamilyMembers function', () => {
    expect(typeof familiesController.getFamilyMembers).toBe('function');
  });
  it('should have removeFamilyMember function', () => {
    expect(typeof familiesController.removeFamilyMember).toBe('function');
  });
  it('should have inviteUserToFamily function', () => {
    expect(typeof familiesController.inviteUserToFamily).toBe('function');
  });
});

