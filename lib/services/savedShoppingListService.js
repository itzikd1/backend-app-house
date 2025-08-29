const prisma = require('../prisma');

const getAllLists = async (userId) => {
  return prisma.savedShoppingList.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });
};

const createList = async ({ name, userId }) => {
  return prisma.savedShoppingList.create({
    data: { name, userId },
  });
};

const getListById = async (listId) => {
  return prisma.savedShoppingList.findUnique({
    where: { id: listId },
    include: { items: true },
  });
};

const updateList = async (listId, { name }) => {
  return prisma.savedShoppingList.update({
    where: { id: listId },
    data: { name },
  });
};

const deleteList = async (listId) => {
  return prisma.savedShoppingList.delete({
    where: { id: listId },
  });
};

const getListItems = async (listId) => {
  return prisma.savedShoppingListItem.findMany({
    where: { savedListId: listId },
    orderBy: { createdAt: 'desc' },
  });
};

const addItem = async (listId, itemData, userId) => {
  return prisma.savedShoppingListItem.create({
    data: { ...itemData, savedListId: listId, userId },
  });
};

const updateItem = async (itemId, itemData) => {
  return prisma.savedShoppingListItem.update({
    where: { id: itemId },
    data: itemData,
  });
};

const deleteItem = async (itemId) => {
  return prisma.savedShoppingListItem.delete({
    where: { id: itemId },
  });
};

module.exports = {
  getAllLists,
  createList,
  getListById,
  updateList,
  deleteList,
  getListItems,
  addItem,
  updateItem,
  deleteItem,
};

