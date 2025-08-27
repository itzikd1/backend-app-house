const carLocationHistoryService = require('../lib/services/carLocationHistoryService');

exports.createCarLocationHistory = async (req, res, next) => {
  try {
    const history = await carLocationHistoryService.createCarLocationHistory(req.body);
    res.status(201).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

exports.getCarLocationHistories = async (req, res, next) => {
  try {
    const histories = await carLocationHistoryService.getCarLocationHistories();
    res.status(200).json({ success: true, data: histories });
  } catch (err) {
    next(err);
  }
};

exports.getCarLocationHistoryById = async (req, res, next) => {
  try {
    const history = await carLocationHistoryService.getCarLocationHistoryById(req.params.id);
    if (!history) {
      return res.status(404).json({ success: false, error: 'Car location history not found' });
    }
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

exports.updateCarLocationHistory = async (req, res, next) => {
  try {
    const history = await carLocationHistoryService.updateCarLocationHistory(req.params.id, req.body);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

exports.deleteCarLocationHistory = async (req, res, next) => {
  try {
    await carLocationHistoryService.deleteCarLocationHistory(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const carLocationHistoryController = require('../controllers/carLocationHistoryController');
const { validateCarLocationHistory } = require('../middleware/validation');

router.post('/', validateCarLocationHistory, carLocationHistoryController.createCarLocationHistory);
router.get('/', carLocationHistoryController.getCarLocationHistories);
router.get('/:id', carLocationHistoryController.getCarLocationHistoryById);
router.put('/:id', validateCarLocationHistory, carLocationHistoryController.updateCarLocationHistory);
router.delete('/:id', carLocationHistoryController.deleteCarLocationHistory);

module.exports = router;
