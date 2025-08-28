const taskService = require('../lib/services/taskService');

exports.getTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    let tasks = await taskService.getTasksForUser(req.user.id);
    if (tasks === null) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Filter by status if query param exists
    if (req.query.status) {
      tasks = tasks.filter(task => task.status === req.query.status);
    }
    res.json({ data: tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const result = await taskService.getTaskById(req.params.id, req.user.id);
    if (result === null) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (result === 'forbidden') {
      return res.status(403).json({ error: 'Not authorized to access this task' });
    }
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const result = await taskService.createTask(req.user.id, req.body);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ data: result });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Related record not found',
        details: error.meta?.cause || 'A related record required for this operation was not found',
      });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const result = await taskService.updateTask(req.params.id, req.user.id, req.body);
    if (result.error) {
      if (result.error === 'Task not found') {
        return res.status(404).json({ error: result.error });
      }
      return res.status(400).json({ error: result.error });
    }
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    if (result === null) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (result === 'forbidden') {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
