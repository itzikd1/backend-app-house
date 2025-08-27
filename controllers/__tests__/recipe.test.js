const recipeController = require('../recipe');

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
});

