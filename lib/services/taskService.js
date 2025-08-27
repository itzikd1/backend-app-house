const prisma = require('../prisma');

const getUserWithFamily = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, familyId: true, role: true },
  });
};

const getTasksForUser = async (userId) => {
  const user = await getUserWithFamily(userId);
  if (!user) return null;
  const whereClause = user.familyId
    ? {
        OR: [
          { familyId: user.familyId },
          { creatorId: user.id, familyId: null },
        ],
      }
    : { creatorId: user.id, familyId: null };
  return prisma.task.findMany({
    where: whereClause,
    include: {
      category: true,
      creator: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getTaskById = async (taskId, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      category: true,
      creator: { select: { id: true, name: true, email: true } },
    },
  });
  if (!task) return null;
  const user = await getUserWithFamily(userId);
  if (
    task.familyId &&
    task.familyId !== user.familyId &&
    task.creatorId !== user.id
  ) {
    return 'forbidden';
  }
  return task;
};

const createTask = async (userId, data) => {
  const user = await getUserWithFamily(userId);
  if (!user) return { error: 'User not found' };
  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      return {
        error: 'Category not found',
        details: `No category found with ID: ${data.categoryId}`,
      };
    }
  }
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      priority: data.priority,
      repeatFrequency: data.repeatFrequency,
      creator: { connect: { id: user.id } },
      ...(user.familyId && { family: { connect: { id: user.familyId } } }),
      ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
    },
    include: { category: true },
  });
  return { success: true, data: task };
};

const updateTask = async (taskId, userId, data) => {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    select: { creatorId: true, familyId: true },
  });
  if (!existingTask) return { error: 'Task not found' };
  const user = await getUserWithFamily(userId);
  if (existingTask.familyId !== user.familyId && existingTask.creatorId !== user.id) {
    return { error: 'Not authorized to update this task' };
  }
  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.completed !== undefined && {
        completed: data.completed,
        completedAt: data.completed ? new Date() : null,
      }),
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      ...(data.priority && { priority: data.priority }),
      ...(data.repeatFrequency !== undefined && { repeatFrequency: data.repeatFrequency }),
      ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
    },
    include: { category: true },
  });
};

const deleteTask = async (taskId, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { creatorId: true, familyId: true },
  });
  if (!task) return { error: 'Task not found' };
  const user = await getUserWithFamily(userId);
  if (task.creatorId !== user.id && user.role !== 'ADMIN') {
    return { error: 'Not authorized to delete this task' };
  }
  await prisma.task.delete({ where: { id: taskId } });
  return { success: true, message: 'Task deleted successfully' };
};

module.exports = {
  getUserWithFamily,
  getTasksForUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
