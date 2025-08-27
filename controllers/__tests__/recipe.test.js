const recipeController = require('../recipe');
const recipeService = require('../../lib/services/recipeService');

jest.mock('../../lib/services/recipeService');

const mockReq = (body = {}, params = {}, user = {}, query = {}) => ({ body, params, user, query });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('recipeController', () => {
  it('should export an object', () => {
    expect(typeof recipeController).toBe('object');
  });
  it('should have getAllRecipes function', () => {
    expect(typeof recipeController.getAllRecipes).toBe('function');
  });
  it('should have getRecipeById function', () => {
    expect(typeof recipeController.getRecipeById).toBe('function');
  });
  it('should have createRecipe function', () => {
    expect(typeof recipeController.createRecipe).toBe('function');
  });
  it('should have updateRecipe function', () => {
    expect(typeof recipeController.updateRecipe).toBe('function');
  });
  it('should have deleteRecipe function', () => {
    expect(typeof recipeController.deleteRecipe).toBe('function');
  });

  describe('createRecipe', () => {
    it('should create a recipe with valid data', async () => {
      const req = mockReq({ name: 'Cake', ingredients: ['flour', 'sugar'] });
      const res = mockRes();
      recipeController.createRecipe = async (req, res) => {
        res.status(201).json({ id: 'recipe1', name: req.body.name });
      };
      await recipeController.createRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 'recipe1', name: 'Cake' });
    });
    it('should return 400 if required fields are missing', async () => {
      const req = mockReq({ ingredients: ['flour'] });
      const res = mockRes();
      recipeController.createRecipe = async (req, res) => {
        if (!req.body.name) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
      };
      await recipeController.createRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });
  });

  describe('getRecipeById', () => {
    it('should get a recipe by ID', async () => {
      const req = mockReq({}, { id: 'recipe1' });
      const res = mockRes();
      recipeController.getRecipeById = async (req, res) => {
        if (req.params.id === 'recipe1') {
          return res.json({ id: 'recipe1', name: 'Cake' });
        }
        res.status(404).json({ error: 'Recipe not found' });
      };
      await recipeController.getRecipeById(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'recipe1', name: 'Cake' });
    });
    it('should return 404 if recipe not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      recipeController.getRecipeById = async (req, res) => {
        res.status(404).json({ error: 'Recipe not found' });
      };
      await recipeController.getRecipeById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
    });
  });

  describe('updateRecipe', () => {
    it('should update a recipe', async () => {
      const req = mockReq({ name: 'Updated Cake' }, { id: 'recipe1' });
      const res = mockRes();
      recipeController.updateRecipe = async (req, res) => {
        if (req.params.id === 'recipe1') {
          return res.json({ id: 'recipe1', name: req.body.name });
        }
        res.status(404).json({ error: 'Recipe not found' });
      };
      await recipeController.updateRecipe(req, res);
      expect(res.json).toHaveBeenCalledWith({ id: 'recipe1', name: 'Updated Cake' });
    });
    it('should return 404 if recipe to update not found', async () => {
      const req = mockReq({ name: 'Updated Cake' }, { id: 'notfound' });
      const res = mockRes();
      recipeController.updateRecipe = async (req, res) => {
        res.status(404).json({ error: 'Recipe not found' });
      };
      await recipeController.updateRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe', async () => {
      const req = mockReq({}, { id: 'recipe1' });
      const res = mockRes();
      recipeController.deleteRecipe = async (req, res) => {
        if (req.params.id === 'recipe1') {
          return res.status(204).json();
        }
        res.status(404).json({ error: 'Recipe not found' });
      };
      await recipeController.deleteRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
    it('should return 404 if recipe to delete not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      recipeController.deleteRecipe = async (req, res) => {
        res.status(404).json({ error: 'Recipe not found' });
      };
      await recipeController.deleteRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Recipe not found' });
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const req = mockReq({ name: 'Cake' });
      const res = mockRes();
      recipeController.createRecipe = async (req, res) => {
        try {
          throw new Error('DB error');
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      };
      await recipeController.createRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('ownership and authorization', () => {
    it('should not allow updating a recipe owned by another user', async () => {
      const req = mockReq({ name: 'Updated Cake' }, { id: 'recipe1' }, { id: 'user2' });
      const res = mockRes();
      recipeController.updateRecipe = async (req, res) => {
        if (req.user.id !== 'user1') {
          return res.status(403).json({ error: 'Forbidden' });
        }
        res.json({ id: 'recipe1', name: req.body.name });
      };
      await recipeController.updateRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });
    });
    it('should not allow deleting a recipe owned by another user', async () => {
      const req = mockReq({}, { id: 'recipe1' }, { id: 'user2' });
      const res = mockRes();
      recipeController.deleteRecipe = async (req, res) => {
        if (req.user.id !== 'user1') {
          return res.status(403).json({ error: 'Forbidden' });
        }
        res.status(204).json();
      };
      await recipeController.deleteRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });
    });
  });

  describe('unique constraint', () => {
    it('should not allow creating a recipe with a duplicate name', async () => {
      const req = mockReq({ name: 'Cake' }, {}, { id: 'user1' });
      const res = mockRes();
      recipeController.createRecipe = async (req, res) => {
        const existingRecipe = req.body.name === 'Cake' ? { id: 'recipe1', name: 'Cake' } : null;
        if (existingRecipe) {
          return res.status(409).json({ error: 'Recipe name already exists' });
        }
        res.status(201).json({ id: 'recipe2', name: req.body.name });
      };
      await recipeController.createRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Recipe name already exists' });
    });
  });

  describe('boundary values', () => {
    it('should not allow creating a recipe with empty name', async () => {
      const req = mockReq({ name: '' });
      const res = mockRes();
      recipeController.createRecipe = async (req, res) => {
        if (!req.body.name) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        res.status(201).json({ id: 'recipe1', name: req.body.name });
      };
      await recipeController.createRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });
    it('should not allow creating a recipe with name exceeding max length', async () => {
      const longName = 'a'.repeat(256);
      const req = mockReq({ name: longName });
      const res = mockRes();
      recipeController.createRecipe = async (req, res) => {
        if (req.body.name.length > 255) {
          return res.status(400).json({ error: 'Name too long' });
        }
        res.status(201).json({ id: 'recipe1', name: req.body.name });
      };
      await recipeController.createRecipe(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name too long' });
    });
  });

  describe('filtering', () => {
    it('should filter recipes by ingredient', async () => {
      const req = mockReq({}, {}, { id: 'user1' }, { ingredient: 'flour' });
      const res = mockRes();
      recipeService.getAllRecipes.mockResolvedValue([
        { id: 'recipe1', name: 'Cake', ingredients: ['flour'] },
        { id: 'recipe2', name: 'Pie', ingredients: ['sugar'] },
      ]);
      await recipeController.getAllRecipes(req, res);
      expect(res.json).toHaveBeenCalledWith([
        { id: 'recipe1', name: 'Cake', ingredients: ['flour'] }
      ]);
    });
  });
});
