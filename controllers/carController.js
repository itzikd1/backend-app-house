const carService = require('../lib/services/carService');

exports.createCar = async (req, res, next) => {
  try {
    const car = await carService.createCar(req.body);
    res.status(201).json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

exports.getCars = async (req, res, next) => {
  try {
    const cars = await carService.getCars();
    res.status(200).json({ success: true, data: cars });
  } catch (err) {
    next(err);
  }
};

exports.getCarById = async (req, res, next) => {
  try {
    const car = await carService.getCarById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, error: 'Car not found' });
    }
    res.status(200).json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

exports.updateCar = async (req, res, next) => {
  try {
    const car = await carService.updateCar(req.params.id, req.body);
    res.status(200).json({ success: true, data: car });
  } catch (err) {
    next(err);
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    await carService.deleteCar(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { validateCar } = require('../middleware/validation');

router.post('/', validateCar, carController.createCar);
router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);
router.put('/:id', validateCar, carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router;
