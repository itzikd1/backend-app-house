const prisma = require('../prisma');

const getAllCategories = async (userId, familyId) => {
  if (familyId) {
    // Get all categories for family members
    const familyUsers = await prisma.user.findMany({
      where: { familyId },
      select: { id: true },
    });
    const userIds = familyUsers.map(u => u.id);
    return prisma.category.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: 'desc' },
    });
  }
  // Get only user's categories
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

const createCategory = async ({ name, userId }) => {
  return prisma.category.create({
    data: { name, userId },
  });
};

const updateCategory = async (categoryId, { name }) => {
  return prisma.category.update({
    where: { id: categoryId },
    data: { name },
  });
};

const deleteCategory = async (categoryId) => {
  return prisma.category.delete({
    where: { id: categoryId },
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

