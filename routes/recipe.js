const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { validateRecipe } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateRecipe, recipeController.createRecipe);
router.get('/', authenticate, recipeController.getRecipes);
router.get('/:id', authenticate, recipeController.getRecipeById);
router.put('/:id', authenticate, authorize('ADMIN'), validateRecipe, recipeController.updateRecipe);
router.delete('/:id', authenticate, authorize('ADMIN'), recipeController.deleteRecipe);

module.exports = router;

