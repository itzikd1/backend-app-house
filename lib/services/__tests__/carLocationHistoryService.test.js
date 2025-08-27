const carLocationHistoryService = require('../carLocationHistoryService');

describe('carLocationHistoryService', () => {
    it('should have getAllCarLocationHistory function', () => {
        expect(typeof carLocationHistoryService.getAllCarLocationHistory).toBe('function');
    });
    it('should have getCarLocationHistoryById function', () => {
        expect(typeof carLocationHistoryService.getCarLocationHistoryById).toBe('function');
    });
    it('should have createCarLocationHistory function', () => {
        expect(typeof carLocationHistoryService.createCarLocationHistory).toBe('function');
    });
    it('should have updateCarLocationHistory function', () => {
        expect(typeof carLocationHistoryService.updateCarLocationHistory).toBe('function');
    });
    it('should have deleteCarLocationHistory function', () => {
        expect(typeof carLocationHistoryService.deleteCarLocationHistory).toBe('function');
    });
});
