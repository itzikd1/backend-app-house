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
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

exports.getGoalById = async (req, res) => {
  try {
    const goal = await goalService.getGoalById(req.user.id, req.params.id);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    // Remove sensitive fields
    const { secret, ...safeGoal } = goal;
    res.json(safeGoal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch goal' });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const goal = await goalService.createGoal(req.user.id, req.body);
    res.status(201).json({ data: goal });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create goal' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ data: goal });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update goal' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const result = await goalService.deleteGoal(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};
const noteService = require('../lib/services/noteService');

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await noteService.getAllNotes(req.user.id);
    res.json({ data: notes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.user.id, req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ data: note });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(req.user.id, req.body);
    res.status(201).json({ data: note });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(req.user.id, req.params.id, req.body);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ data: note });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const result = await noteService.deleteNote(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
