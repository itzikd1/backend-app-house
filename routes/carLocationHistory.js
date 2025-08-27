const express = require('express');
const router = express.Router();
const carLocationHistoryController = require('../controllers/carLocationHistoryController');
const { validateCarLocationHistory } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateCarLocationHistory, carLocationHistoryController.createCarLocationHistory);
router.get('/', authenticate, carLocationHistoryController.getCarLocationHistories);
router.get('/:id', authenticate, carLocationHistoryController.getCarLocationHistoryById);
router.put('/:id', authenticate, authorize('ADMIN'), validateCarLocationHistory, carLocationHistoryController.updateCarLocationHistory);
router.delete('/:id', authenticate, authorize('ADMIN'), carLocationHistoryController.deleteCarLocationHistory);

module.exports = router;

