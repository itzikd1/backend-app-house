const taskService = require('../lib/services/taskService');

exports.getTasks = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ data: { success: false, error: 'User not authenticated' } });
    }
    let tasks = await taskService.getTasksForUser(req.user.id);
    if (tasks === null) {
      return res.status(404).json({ data: { success: false, error: 'User not found' } });
    }
    // Filter by status if query param exists
    if (req.query.status) {
      tasks = tasks.filter(task => task.status === req.query.status);
    }
    return res.json({ data: { success: true, item: tasks } });
  } catch (error) {
    return res.status(500).json({ data: { success: false, error: 'Failed to fetch tasks' } });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const result = await taskService.getTaskById(req.params.id, req.user.id);
    if (result === null) {
      return res.status(404).json({ data: { success: false, error: 'Task not found' } });
    }
    if (result === 'forbidden') {
      return res.status(403).json({ data: { success: false, error: 'Not authorized to access this task' } });
    }
    return res.json({ data: { success: true, item: result } });
  } catch (error) {
    return res.status(500).json({ data: { success: false, error: 'Failed to fetch task' } });
  }
};

exports.createTask = async (req, res) => {
  try {
    const result = await taskService.createTask(req.user.id, req.body);
    if (result.error) {
      return res.status(400).json({ data: { success: false, error: result.error } });
    }
    return res.status(201).json({ data: { success: result.success, item: result.data} });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        data: {
          success: false,
          error: 'Related record not found',
          details: error.meta?.cause || 'A related record required for this operation was not found',
        },
      });
    }
    return res.status(500).json({ data: { success: false, error: 'Failed to create task' } });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const result = await taskService.updateTask(req.params.id, req.user.id, req.body);
    if (result.error) {
      if (result.error === 'Task not found') {
        return res.status(404).json({ data: { success: false, error: result.error } });
      }
      return res.status(403).json({ data: { success: false, error: result.error } });
    }
    return res.json({ data: { success: true, item: result } });
  } catch (error) {
    return res.status(500).json({ data: { success: false, error: 'Failed to update task' } });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    if (result.error) {
      if (result.error === 'Task not found') {
        return res.status(404).json({ data: { success: false, error: result.error } });
      }
      return res.status(403).json({ data: { success: false, error: result.error } });
    }
    return res.json({ data: { success: result.success, message: result.message } });
  } catch (error) {
    return res.status(500).json({ data: { success: false, error: 'Failed to delete task' } });
  }
};
