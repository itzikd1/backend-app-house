const prisma = require('../prisma');

exports.getAllRecipes = async (userId) => {
  return prisma.recipe.findMany({ where: { userId } });
};

exports.getRecipeById = async (userId, recipeId) => {
  return prisma.recipe.findFirst({ where: { id: recipeId, userId } });
};

exports.createRecipe = async (userId, data) => {
  const { title, ingredients, instructions, familyId } = data;
  if (!title || !ingredients || !instructions) throw new Error('Missing required fields: title, ingredients, instructions');
  // Convert ingredients to string[] if array of objects
  let ingredientsArray;
  if (Array.isArray(ingredients)) {
    ingredientsArray = ingredients.map(ing => typeof ing === 'string' ? ing : ing.name);
  } else {
    ingredientsArray = [];
  }
  // Convert instructions to string if array
  let instructionsString;
  if (Array.isArray(instructions)) {
    instructionsString = instructions.join('\n');
  } else {
    instructionsString = instructions;
  }
  return prisma.recipe.create({
    data: {
      title,
      ingredients: ingredientsArray,
      instructions: instructionsString,
      userId,
      familyId,
    },
  });
};

exports.updateRecipe = async (userId, recipeId, data) => {
  const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!recipe) return null;
  return prisma.recipe.update({
    where: { id: recipeId },
    data,
  });
};

exports.deleteRecipe = async (userId, recipeId) => {
  const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!recipe) return null;
  return prisma.recipe.delete({ where: { id: recipeId } });
};
