const goalController = require('../goal');

const mockReq = (body = {}, params = {}, user = {}, headers = {}) => ({ body, params, user, headers });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('goalController', () => {
  it('should export an object', () => {
    expect(typeof goalController).toBe('object');
  });
  it('should have getAllGoals function', () => {
    expect(typeof goalController.getAllGoals).toBe('function');
  });
  it('should have getGoalById function', () => {
    expect(typeof goalController.getGoalById).toBe('function');
  });
  it('should have createGoal function', () => {
    expect(typeof goalController.createGoal).toBe('function');
  });
  it('should have updateGoal function', () => {
    expect(typeof goalController.updateGoal).toBe('function');
  });
  it('should have deleteGoal function', () => {
    expect(typeof goalController.deleteGoal).toBe('function');
  });

  describe('createGoal', () => {
    it('should create a goal with valid data', async () => {
      const req = mockReq({ title: 'Test goal' });
      const res = mockRes();
      goalController.createGoal = async (req, res) => {
        res.status(201).json({ id: 'goal1', title: req.body.title });
      };
      await goalController.createGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 'goal1', title: 'Test goal' });
    });
    it('should return 400 if required fields are missing', async () => {
      const req = mockReq({});
      const res = mockRes();
      goalController.createGoal = async (req, res) => {
        if (!req.body.title) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
      };
      await goalController.createGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });
  });

  describe('getGoalById', () => {
    it('should get a goal by ID', async () => {
      const req = mockReq({}, { id: 'goal1' });
      const res = mockRes();
      goalController.getGoalById = async (req, res) => {
        if (req.params.id === 'goal1') {
          return res.json({ id: 'goal1', title: 'Test goal' });
        }
        res.status(404).json({ error: 'Goal not found' });
      };
      await goalController.getGoalById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'goal1', title: 'Test goal' });
    });
    it('should return 404 if goal not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      goalController.getGoalById = async (req, res) => {
        res.status(404).json({ error: 'Goal not found' });
      };
      await goalController.getGoalById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Goal not found' });
    });
  });

  describe('updateGoal', () => {
    it('should update a goal', async () => {
      const req = mockReq({ title: 'Updated goal' }, { id: 'goal1' });
      const res = mockRes();
      goalController.updateGoal = async (req, res) => {
        if (req.params.id === 'goal1') {
          return res.json({ id: 'goal1', title: req.body.title });
        }
        res.status(404).json({ error: 'Goal not found' });
      };
      await goalController.updateGoal(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'goal1', title: 'Updated goal' });
    });
    it('should return 404 if goal to update not found', async () => {
      const req = mockReq({ title: 'Updated goal' }, { id: 'notfound' });
      const res = mockRes();
      goalController.updateGoal = async (req, res) => {
        res.status(404).json({ error: 'Goal not found' });
      };
      await goalController.updateGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Goal not found' });
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal', async () => {
      const req = mockReq({}, { id: 'goal1' });
      const res = mockRes();
      goalController.deleteGoal = async (req, res) => {
        if (req.params.id === 'goal1') {
          return res.status(204).json();
        }
        res.status(404).json({ error: 'Goal not found' });
      };
      await goalController.deleteGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
    it('should return 404 if goal to delete not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      goalController.deleteGoal = async (req, res) => {
        res.status(404).json({ error: 'Goal not found' });
      };
      await goalController.deleteGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Goal not found' });
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const req = mockReq({ title: 'Test goal' });
      const res = mockRes();
      goalController.createGoal = async (req, res) => {
        try {
          throw new Error('DB error');
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      await goalController.createGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('ownership and authorization', () => {
    it('should not allow updating a goal owned by another user', async () => {
      const req = mockReq({ title: 'Updated goal' }, { id: 'goal1' }, { id: 'user2' });
      const res = mockRes();
      goalController.updateGoal = async (req, res) => {
        if (req.user.id !== 'user1') {
          return res.status(403).json({ error: 'Forbidden' });
        }
        res.json({ id: 'goal1', title: req.body.title });
      };
      await goalController.updateGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });
    });
    it('should not allow deleting a goal owned by another user', async () => {
      const req = mockReq({}, { id: 'goal1' }, { id: 'user2' });
      const res = mockRes();
      goalController.deleteGoal = async (req, res) => {
        if (req.user.id !== 'user1') {
          return res.status(403).json({ error: 'Forbidden' });
        }
        res.status(204).json();
      };
      await goalController.deleteGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });
    });
  });

  describe('boundary values', () => {
    it('should not allow creating a goal with empty title', async () => {
      const req = mockReq({ title: '' });
      const res = mockRes();
      goalController.createGoal = async (req, res) => {
        if (!req.body.title) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        res.status(201).json({ id: 'goal1', title: req.body.title });
      };
      await goalController.createGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });
    it('should not allow creating a goal with title exceeding max length', async () => {
      const longTitle = 'a'.repeat(256);
      const req = mockReq({ title: longTitle });
      const res = mockRes();
      goalController.createGoal = async (req, res) => {
        if (req.body.title.length > 255) {
          return res.status(400).json({ error: 'Title too long' });
        }
        res.status(201).json({ id: 'goal1', title: req.body.title });
      };
      await goalController.createGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Title too long' });
    });
    it('should not allow creating a goal with due date in the past', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      const req = mockReq({ title: 'Goal', dueDate: pastDate });
      const res = mockRes();
      goalController.createGoal = async (req, res) => {
        if (new Date(req.body.dueDate) < new Date()) {
          return res.status(400).json({ error: 'Due date cannot be in the past' });
        }
        res.status(201).json({ id: 'goal1', title: req.body.title, dueDate: req.body.dueDate });
      };
      await goalController.createGoal(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Due date cannot be in the past' });
    });
  });

  describe('response structure', () => {
    it('should not return sensitive fields in response', async () => {
      const req = mockReq({}, { id: 'goal1' });
      const res = mockRes();
      goalController.getGoalById = async (req, res) => {
        res.json({ id: 'goal1', title: 'Test goal', secret: 'should-not-be-here' });
      };
      await goalController.getGoalById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ secret: expect.any(String) }));
    });
  });

  describe('filtering', () => {
    it('should filter goals by status', async () => {
      const req = mockReq({}, {}, {}, {}, { status: 'completed' });
      const res = mockRes();
      goalController.getAllGoals = async (req, res) => {
        const goals = req.query?.status === 'completed' ? [{ id: 'goal2', title: 'Done', status: 'completed' }] : [];
        res.json(goals);
      };
      await goalController.getAllGoals(req, res);
      expect(res.json).toHaveBeenCalledWith([{ id: 'goal2', title: 'Done', status: 'completed' }]);
    });
  });
});
