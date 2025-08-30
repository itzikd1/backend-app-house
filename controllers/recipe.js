const recipeService = require('../lib/services/recipeService');

exports.getAllRecipes = async (req, res, next) => {
  try {
    let recipes = await recipeService.getAllRecipes(req.user.id);
    if (req.query.ingredient) {
      recipes = recipes.filter(recipe => Array.isArray(recipe.ingredients) && recipe.ingredients.includes(req.query.ingredient));
    }
    // Map to only required fields
    recipes = recipes.map(({ id, name, title, ingredients }) => ({
      id,
      name: name ?? title,
      ingredients,
    }));
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

exports.getRecipeById = async (req, res, next) => {
  try {
    const recipe = await recipeService.getRecipeById(req.user.id, req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    const { id, title, ingredients, instructions, userId, familyId, createdAt, updatedAt } = recipe;
    res.json({ data: { id, title, ingredients, instructions, userId, familyId, createdAt, updatedAt } });
  } catch (error) {
    next(error);
  }
};

exports.createRecipe = async (req, res, next) => {
  try {
    const recipe = await recipeService.createRecipe(req.user.id, req.body);
    const { id, title, ingredients, instructions, userId, familyId, createdAt, updatedAt } = recipe;
    res.status(201).json({ data: { id, title, ingredients, instructions, userId, familyId, createdAt, updatedAt } });
  } catch (error) {
    next(error);
  }
};

exports.updateRecipe = async (req, res, next) => {
  try {
    const recipe = await recipeService.updateRecipe(req.user.id, req.params.id, req.body);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    const { id, title, ingredients, instructions, userId, familyId, createdAt, updatedAt } = recipe;
    res.json({ data: { id, title, ingredients, instructions, userId, familyId, createdAt, updatedAt } });
  } catch (error) {
    next(error);
  }
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    await recipeService.deleteRecipe(req.user.id, req.params.id);
    res.json({ data: true });
  } catch (error) {
    next(error);
  }
};
