const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createShoppingItem = async (data) => prisma.shoppingItem.create({ data });
const getShoppingItems = async () => prisma.shoppingItem.findMany();
const getShoppingItemById = async (id) => prisma.shoppingItem.findUnique({ where: { id } });
const updateShoppingItem = async (id, data) => prisma.shoppingItem.update({ where: { id }, data });
const deleteShoppingItem = async (id) => prisma.shoppingItem.delete({ where: { id } });

module.exports = {
  createShoppingItem,
  getShoppingItems,
  getShoppingItemById,
  updateShoppingItem,
  deleteShoppingItem,
};

