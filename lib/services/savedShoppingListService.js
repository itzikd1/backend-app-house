const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSavedShoppingList = async (data) => prisma.savedShoppingList.create({ data });
const getSavedShoppingLists = async () => prisma.savedShoppingList.findMany();
const getSavedShoppingListById = async (id) => prisma.savedShoppingList.findUnique({ where: { id } });
const updateSavedShoppingList = async (id, data) => prisma.savedShoppingList.update({ where: { id }, data });
const deleteSavedShoppingList = async (id) => prisma.savedShoppingList.delete({ where: { id } });

module.exports = {
  createSavedShoppingList,
  getSavedShoppingLists,
  getSavedShoppingListById,
  updateSavedShoppingList,
  deleteSavedShoppingList,
};

