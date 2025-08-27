const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRecipe = async (data) => prisma.recipe.create({ data });
const getRecipes = async () => prisma.recipe.findMany();
const getRecipeById = async (id) => prisma.recipe.findUnique({ where: { id } });
const updateRecipe = async (id, data) => prisma.recipe.update({ where: { id }, data });
const deleteRecipe = async (id) => prisma.recipe.delete({ where: { id } });

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};

