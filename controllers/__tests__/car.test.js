const carController = require('../car');

describe('carController', () => {
    it('should export an object', () => {
        expect(typeof carController).toBe('object');
    });
    it('should have getAllCars function', () => {
        expect(typeof carController.getAllCars).toBe('function');
    });
    it('should have getCarById function', () => {
        expect(typeof carController.getCarById).toBe('function');
    });
    it('should have createCar function', () => {
        expect(typeof carController.createCar).toBe('function');
    });
    it('should have updateCar function', () => {
        expect(typeof carController.updateCar).toBe('function');
    });
    it('should have deleteCar function', () => {
        expect(typeof carController.deleteCar).toBe('function');
    });
});

