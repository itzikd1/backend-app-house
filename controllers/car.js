const carService = require('../lib/services/carService');

exports.getAllCars = async (req, res) => {
  try {
    const cars = await carService.getAllCars(req.user.id);
    res.json({ data: cars });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.user.id, req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ data: car });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

exports.createCar = async (req, res) => {
  try {
    const car = await carService.createCar(req.user.id, req.body);
    res.status(201).json({ data: car });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create car' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = await carService.updateCar(req.user.id, req.params.id, req.body);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ data: car });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update car' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const result = await carService.deleteCar(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete car' });
  }
};

