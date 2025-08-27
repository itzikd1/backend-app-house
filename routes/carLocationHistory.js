const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const carLocationHistoryController = require('../controllers/carLocationHistory');

router.get('/', authenticate, carLocationHistoryController.getAllCarLocationHistory);
router.get('/:id', authenticate, carLocationHistoryController.getCarLocationHistoryById);
router.post('/', authenticate, carLocationHistoryController.createCarLocationHistory);
router.put('/:id', authenticate, carLocationHistoryController.updateCarLocationHistory);
router.delete('/:id', authenticate, carLocationHistoryController.deleteCarLocationHistory);

module.exports = router;

