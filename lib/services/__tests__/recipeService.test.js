const recipeService = require('../recipeService');

describe('recipeService', () => {
  it('should have getAllRecipes function', () => {
    expect(typeof recipeService.getAllRecipes).toBe('function');
  });
  it('should have getRecipeById function', () => {
    expect(typeof recipeService.getRecipeById).toBe('function');
  });
  it('should have createRecipe function', () => {
    expect(typeof recipeService.createRecipe).toBe('function');
  });
  it('should have updateRecipe function', () => {
    expect(typeof recipeService.updateRecipe).toBe('function');
  });
  it('should have deleteRecipe function', () => {
    expect(typeof recipeService.deleteRecipe).toBe('function');
  });
});

