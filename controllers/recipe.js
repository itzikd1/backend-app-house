const recipeService = require('../lib/services/recipeService');

exports.getAllRecipes = async (req, res) => {
  try {
    let recipes = await recipeService.getAllRecipes(req.user.id);
    // Filter by ingredient if query param exists
    if (req.query.ingredient) {
      recipes = recipes.filter(recipe => Array.isArray(recipe.ingredients) && recipe.ingredients.includes(req.query.ingredient));
    }
    res.json({ data: { success: true, recipes } });
  } catch (error) {
    res.status(500).json({ data: { success: false, error: 'Failed to fetch recipes' } });
  }
};

exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await recipeService.getRecipeById(req.user.id, req.params.id);
    if (!recipe) {
      return res.status(404).json({ data: { success: false, error: 'Recipe not found' } });
    }
    res.json({ data: { success: true, recipe } });
  } catch (error) {
    res.status(500).json({ data: { success: false, error: 'Failed to fetch recipe' } });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    const recipe = await recipeService.createRecipe(req.user.id, req.body);
    res.status(201).json({ data: { success: true, recipe } });
  } catch (error) {
    res.status(400).json({ data: { success: false, error: error.message || 'Failed to create recipe' } });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await recipeService.updateRecipe(req.user.id, req.params.id, req.body);
    if (!recipe) {
      return res.status(404).json({ data: { success: false, error: 'Recipe not found' } });
    }
    res.json({ data: { success: true, recipe } });
  } catch (error) {
    res.status(400).json({ data: { success: false, error: error.message || 'Failed to update recipe' } });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const result = await recipeService.deleteRecipe(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ data: { success: false, error: 'Recipe not found' } });
    }
    res.json({ data: { success: true } });
  } catch (error) {
    res.status(500).json({ data: { success: false, error: 'Failed to delete recipe' } });
  }
};
