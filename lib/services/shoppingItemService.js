const prisma = require('../prisma');

const shoppingItemService = {
  async createShoppingItem(data) {
    if (!data.creator) {
      throw new Error('Missing required field: creator');
    }
    // Only allow valid fields
    const allowedFields = [
      'name', 'quantity', 'purchased', 'purchasedAt', 'notes', 'creator', 'family', 'category',
    ];
    const filteredData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    return prisma.shoppingItem.create({
      data: filteredData,
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
