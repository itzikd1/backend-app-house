const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { validateCar } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateCar, carController.createCar);
router.get('/', authenticate, carController.getCars);
router.get('/:id', authenticate, carController.getCarById);
router.put('/:id', authenticate, authorize('ADMIN'), validateCar, carController.updateCar);
router.delete('/:id', authenticate, authorize('ADMIN'), carController.deleteCar);

module.exports = router;

