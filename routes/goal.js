const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const goalController = require('../controllers/goal');

router.get('/', authenticate, goalController.getAllGoals);
router.get('/:id', authenticate, goalController.getGoalById);
router.post('/', authenticate, goalController.createGoal);
router.put('/:id', authenticate, goalController.updateGoal);
router.delete('/:id', authenticate, goalController.deleteGoal);

module.exports = router;

