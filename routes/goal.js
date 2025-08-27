const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { validateGoal } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateGoal, goalController.createGoal);
router.get('/', authenticate, goalController.getGoals);
router.get('/:id', authenticate, goalController.getGoalById);
router.put('/:id', authenticate, authorize('ADMIN'), validateGoal, goalController.updateGoal);
router.delete('/:id', authenticate, authorize('ADMIN'), goalController.deleteGoal);

module.exports = router;

