const prisma = require('../prisma');

const getAllCategories = async (userId, familyId) => {
  if (familyId) {
    // Return all categories for the family
    return prisma.shoppingCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  // Return all categories for the user
  return prisma.shoppingCategory.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

const createCategory = async ({ name, userId }) => {
  return prisma.shoppingCategory.create({
    data: { name },
  });
};

const updateCategory = async (categoryId, { name }) => {
  return prisma.shoppingCategory.update({
    where: { id: categoryId },
    data: { name },
  });
};

const deleteCategory = async (categoryId) => {
  return prisma.shoppingCategory.delete({
    where: { id: categoryId },
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
