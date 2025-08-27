const carService = require('../carService');

describe('carService', () => {
  it('should have getAllCars function', () => {
    expect(typeof carService.getAllCars).toBe('function');
  });
  it('should have getCarById function', () => {
    expect(typeof carService.getCarById).toBe('function');
  });
  it('should have createCar function', () => {
    expect(typeof carService.createCar).toBe('function');
  });
  it('should have updateCar function', () => {
    expect(typeof carService.updateCar).toBe('function');
  });
});

