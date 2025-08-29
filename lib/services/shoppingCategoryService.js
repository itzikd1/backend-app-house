const prisma = require('../prisma');

const getAllCategories = async (userId, familyId) => {
  if (familyId) {
    // Get all categories for family members
    const familyUsers = await prisma.user.findMany({
      where: { familyId },
      select: { id: true },
    });
    const userIds = familyUsers.map(u => u.id);
    return prisma.shoppingCategory.findMany({
      where: { items: { some: { creatorId: { in: userIds } } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  // Get only user's categories
  return prisma.shoppingCategory.findMany({
    where: { items: { some: { creatorId: userId } } },
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

