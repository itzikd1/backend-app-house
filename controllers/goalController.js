const goalService = require('../lib/services/goalService');

exports.createGoal = async (req, res, next) => {
  try {
    const goal = await goalService.createGoal(req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

exports.getGoals = async (req, res, next) => {
  try {
    const goals = await goalService.getGoals();
    res.status(200).json({ success: true, data: goals });
  } catch (err) {
    next(err);
  }
};

exports.getGoalById = async (req, res, next) => {
  try {
    const goal = await goalService.getGoalById(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, error: 'Goal not found' });
    }
    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const goal = await goalService.updateGoal(req.params.id, req.body);
    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    await goalService.deleteGoal(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const { validateGoal } = require('../middleware/validation');

router.post('/', validateGoal, goalController.createGoal);
router.get('/', goalController.getGoals);
router.get('/:id', goalController.getGoalById);
router.put('/:id', validateGoal, goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
