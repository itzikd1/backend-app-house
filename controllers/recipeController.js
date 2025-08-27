const recipeService = require('../lib/services/recipeService');

exports.createRecipe = async (req, res, next) => {
  try {
    const recipe = await recipeService.createRecipe(req.body);
    res.status(201).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

exports.getRecipes = async (req, res, next) => {
  try {
    const recipes = await recipeService.getRecipes();
    res.status(200).json({ success: true, data: recipes });
  } catch (err) {
    next(err);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    res.status(200).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    const recipe = await recipeService.updateRecipe(req.params.id, req.body);
    res.status(200).json({ success: true, data: recipe });
  } catch (err) {
    next(err);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    await recipeService.deleteRecipe(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { validateRecipe } = require('../middleware/validation');

router.post('/', validateRecipe, recipeController.createRecipe);
router.get('/', recipeController.getRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', validateRecipe, recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;
