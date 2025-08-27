const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const carController = require('../controllers/car');

router.get('/', authenticate, carController.getAllCars);
router.get('/:id', authenticate, carController.getCarById);
router.post('/', authenticate, carController.createCar);
router.put('/:id', authenticate, carController.updateCar);
router.delete('/:id', authenticate, carController.deleteCar);

module.exports = router;

