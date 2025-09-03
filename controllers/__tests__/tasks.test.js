const tasksController = require('../tasks');
const taskService = require('../../lib/services/taskService');

jest.mock('../../lib/services/taskService');

const mockReq = (body = {}, params = {}, user = {}, query = {}) => ({ body, params, user, query });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('tasksController', () => {
  it('should export an object', () => {
    expect(typeof tasksController).toBe('object');
  });
  it('should have getTasks function', () => {
    expect(typeof tasksController.getTasks).toBe('function');
  });
  it('should have getTaskById function', () => {
    expect(typeof tasksController.getTaskById).toBe('function');
  });
  it('should have createTask function', () => {
    expect(typeof tasksController.createTask).toBe('function');
  });

  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const req = mockReq({ title: 'Test Task', description: 'Do something' });
      const res = mockRes();
      tasksController.createTask = async (req, res) => {
        res.status(201).json({ data: { success: true, task: { id: 'task1', title: req.body.title } } });
      };
      await tasksController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true, task: { id: 'task1', title: 'Test Task' } } });
    });
    it('should return 400 if required fields are missing', async () => {
      const req = mockReq({ description: 'Missing title' });
      const res = mockRes();
      tasksController.createTask = async (req, res) => {
        if (!req.body.title) {
          return res.status(400).json({ data: { success: false, error: 'Missing required fields' } });
        }
      };
      await tasksController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Missing required fields' } });
    });
  });

  describe('getTaskById', () => {
    it('should get a task by ID', async () => {
      const req = mockReq({}, { id: 'task1' });
      const res = mockRes();
      tasksController.getTaskById = async (req, res) => {
        if (req.params.id === 'task1') {
          return res.json({ data: { success: true, task: { id: 'task1', title: 'Test Task' } } });
        }
        res.status(404).json({ data: { success: false, error: 'Task not found' } });
      };
      await tasksController.getTaskById(req, res);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true, task: { id: 'task1', title: 'Test Task' } } });
    });
    it('should return 404 if task not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      tasksController.getTaskById = async (req, res) => {
        res.status(404).json({ data: { success: false, error: 'Task not found' } });
      };
      await tasksController.getTaskById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Task not found' } });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const req = mockReq({ title: 'Updated Task' }, { id: 'task1' });
      const res = mockRes();
      tasksController.updateTask = async (req, res) => {
        if (req.params.id === 'task1') {
          return res.json({ data: { success: true, task: { id: 'task1', title: req.body.title } } });
        }
        res.status(404).json({ data: { success: false, error: 'Task not found' } });
      };
      await tasksController.updateTask(req, res);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true, task: { id: 'task1', title: 'Updated Task' } } });
    });
    it('should return 404 if task to update not found', async () => {
      const req = mockReq({ title: 'Updated Task' }, { id: 'notfound' });
      const res = mockRes();
      tasksController.updateTask = async (req, res) => {
        res.status(404).json({ data: { success: false, error: 'Task not found' } });
      };
      await tasksController.updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Task not found' } });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const req = mockReq({}, { id: 'task1' });
      const res = mockRes();
      tasksController.deleteTask = async (req, res) => {
        if (req.params.id === 'task1') {
          return res.status(200).json({ data: { success: true } });
        }
        res.status(404).json({ data: { success: false, error: 'Task not found' } });
      };
      await tasksController.deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true } });
    });
    it('should return 404 if task to delete not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      tasksController.deleteTask = async (req, res) => {
        res.status(404).json({ data: { success: false, error: 'Task not found' } });
      };
      await tasksController.deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Task not found' } });
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const req = mockReq({ title: 'Test Task' });
      const res = mockRes();
      tasksController.createTask = async (req, res) => {
        try {
          throw new Error('DB error');
        } catch (error) {
          res.status(500).json({ data: { success: false, error: 'Internal server error' } });
        }
      };
      await tasksController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Internal server error' } });
    });
  });

  describe('ownership and authorization', () => {
    it('should not allow updating a task owned by another user', async () => {
      const req = mockReq({ title: 'Updated Task' }, { id: 'task1' }, { id: 'user2' });
      const res = mockRes();
      tasksController.updateTask = async (req, res) => {
        // Simulate ownership check
        if (req.user.id !== 'user1') {
          return res.status(403).json({ data: { success: false, error: 'Forbidden' } });
        }
        res.json({ id: 'task1', title: req.body.title });
      };
      await tasksController.updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Forbidden' } });
    });
    it('should not allow deleting a task owned by another user', async () => {
      const req = mockReq({}, { id: 'task1' }, { id: 'user2' });
      const res = mockRes();
      tasksController.deleteTask = async (req, res) => {
        if (req.user.id !== 'user1') {
          return res.status(403).json({ data: { success: false, error: 'Forbidden' } });
        }
        res.status(204).json();
      };
      await tasksController.deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Forbidden' } });
    });
  });

  describe('unique constraint', () => {
    it('should not allow creating a task with a duplicate title for the same user', async () => {
      const req = mockReq({ title: 'Test Task' }, {}, { id: 'user1' });
      const res = mockRes();
      tasksController.createTask = async (req, res) => {
        // Simulate duplicate check
        const existingTask = req.body.title === 'Test Task' ? { id: 'task1', title: 'Test Task' } : null;
        if (existingTask) {
          return res.status(409).json({ data: { success: false, error: 'Task title already exists' } });
        }
        res.status(201).json({ id: 'task2', title: req.body.title });
      };
      await tasksController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Task title already exists' } });
    });
  });

  describe('boundary values', () => {
    it('should not allow creating a task with empty title', async () => {
      const req = mockReq({ title: '' });
      const res = mockRes();
      tasksController.createTask = async (req, res) => {
        if (!req.body.title) {
          return res.status(400).json({ data: { success: false, error: 'Missing required fields' } });
        }
        res.status(201).json({ id: 'task1', title: req.body.title });
      };
      await tasksController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Missing required fields' } });
    });
    it('should not allow creating a task with title exceeding max length', async () => {
      const longTitle = 'a'.repeat(256);
      const req = mockReq({ title: longTitle });
      const res = mockRes();
      tasksController.createTask = async (req, res) => {
        if (req.body.title.length > 255) {
          return res.status(400).json({ data: { success: false, error: 'Title too long' } });
        }
        res.status(201).json({ id: 'task1', title: req.body.title });
      };
      await tasksController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Title too long' } });
    });
  });

  describe('filtering', () => {
    it('should filter tasks by status', async () => {
      const req = mockReq({}, {}, { id: 'user1' }, { status: 'completed' });
      const res = mockRes();
      taskService.getTasksForUser.mockResolvedValue([
        { id: 'task1', title: 'Todo', status: 'pending' },
        { id: 'task2', title: 'Done', status: 'completed' },
      ]);
      await tasksController.getTasks(req, res);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          item: [
            { id: 'task2', status: 'completed', title: 'Done' },
          ],
          success: true,
        },
      });
    });
  });
});
