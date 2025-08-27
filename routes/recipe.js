const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const recipeController = require('../controllers/recipe');

router.get('/', authenticate, recipeController.getAllRecipes);
router.get('/:id', authenticate, recipeController.getRecipeById);
router.post('/', authenticate, recipeController.createRecipe);
router.put('/:id', authenticate, recipeController.updateRecipe);
router.delete('/:id', authenticate, recipeController.deleteRecipe);

module.exports = router;

