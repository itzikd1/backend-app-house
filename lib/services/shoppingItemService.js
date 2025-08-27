const prisma = require('../prisma');

const shoppingItemService = {
  async createShoppingItem(data) {
    return prisma.shoppingItem.create({
      data,
    });
  },

  async getShoppingItemById(id) {
    return prisma.shoppingItem.findUnique({
      where: { id },
    });
  },

  async getAllShoppingItems(filter = {}) {
    return prisma.shoppingItem.findMany({
      where: filter,
    });
  },

  async updateShoppingItem(id, data) {
    return prisma.shoppingItem.update({
      where: { id },
      data,
    });
  },

  async deleteShoppingItem(id) {
    return prisma.shoppingItem.delete({
      where: { id },
    });
  },
};

module.exports = shoppingItemService;

