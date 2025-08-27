const carLocationHistoryController = require('../carLocationHistory');

describe('carLocationHistoryController', () => {
  it('should export an object', () => {
    expect(typeof carLocationHistoryController).toBe('object');
  });
  it('should have getAllCarLocationHistory function', () => {
    expect(typeof carLocationHistoryController.getAllCarLocationHistory).toBe('function');
  });
  it('should have getCarLocationHistoryById function', () => {
    expect(typeof carLocationHistoryController.getCarLocationHistoryById).toBe('function');
  });
  it('should have createCarLocationHistory function', () => {
    expect(typeof carLocationHistoryController.createCarLocationHistory).toBe('function');
  });
  it('should have updateCarLocationHistory function', () => {
    expect(typeof carLocationHistoryController.updateCarLocationHistory).toBe('function');
  });
  it('should have deleteCarLocationHistory function', () => {
    expect(typeof carLocationHistoryController.deleteCarLocationHistory).toBe('function');
  });
});

