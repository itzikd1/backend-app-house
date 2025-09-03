const goalService = require('../lib/services/goalService');

exports.getAllGoals = async (req, res) => {
  try {
    let goals = await goalService.getAllGoals(req.user.id);
    // Filter by status if query param exists
    if (req.query.status) {
      goals = goals.filter(goal => goal.status === req.query.status);
    }
    // Remove sensitive fields
    goals = goals.map(({ secret, ...rest }) => rest);
    res.json({ data: { success: true, item: goals } });
  } catch (error) {
    res.status(500).json({ data: { success: false, error: 'Failed to fetch goals' } });
  }
};

exports.getGoalById = async (req, res) => {
  try {
    const goal = await goalService.getGoalById(req.user.id, req.params.id);
    if (!goal) {
      return res.status(404).json({ data: { success: false, error: 'Goal not found' } });
    }
    // Remove sensitive fields
    const { secret, ...safeGoal } = goal;
    res.json({ data: { success: true, item: safeGoal } });
  } catch (error) {
    res.status(500).json({ data: { success: false, error: 'Failed to fetch goal' } });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const goal = await goalService.createGoal(req.user.id, req.body);
    res.status(201).json({ data: { success: true, item: goal } });
  } catch (error) {
    res.status(400).json({ data: { success: false, error: error.message || 'Failed to create goal' } });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body);
    if (!goal) {
      return res.status(404).json({ data: { success: false, error: 'Goal not found' } });
    }
    res.json({ data: { success: true, item: goal } });
  } catch (error) {
    res.status(400).json({ data: { success: false, error: error.message || 'Failed to update goal' } });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const result = await goalService.deleteGoal(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ data: { success: false, error: 'Goal not found' } });
    }
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ data: { success: false, error: 'Failed to delete goal' } });
  }
};