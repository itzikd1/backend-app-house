const familyService = require('../familyService');

describe('familyService', () => {
  it('should have createFamily function', () => {
    expect(typeof familyService.createFamily).toBe('function');
  });
  it('should have getFamilyMembers function', () => {
    expect(typeof familyService.getFamilyMembers).toBe('function');
  });
});

