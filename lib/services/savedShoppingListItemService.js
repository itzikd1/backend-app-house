const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createSavedShoppingListItem = async (data) => prisma.savedShoppingListItem.create({ data });
const getSavedShoppingListItems = async () => prisma.savedShoppingListItem.findMany();
const getSavedShoppingListItemById = async (id) => prisma.savedShoppingListItem.findUnique({ where: { id } });
const updateSavedShoppingListItem = async (id, data) => prisma.savedShoppingListItem.update({ where: { id }, data });
const deleteSavedShoppingListItem = async (id) => prisma.savedShoppingListItem.delete({ where: { id } });

module.exports = {
  createSavedShoppingListItem,
  getSavedShoppingListItems,
  getSavedShoppingListItemById,
  updateSavedShoppingListItem,
  deleteSavedShoppingListItem,
};

