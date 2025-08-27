const prisma = require('../prisma');

exports.getAllGoals = async (userId) => {
  return prisma.goal.findMany({ where: { userId } });
};

exports.getGoalById = async (userId, goalId) => {
  return prisma.goal.findFirst({ where: { id: goalId, userId } });
};

exports.createGoal = async (userId, data) => {
  const { title, description, targetDate, progress, isCompleted, completedAt, familyId } = data;
  if (!title) throw new Error('Missing required field: title');
  return prisma.goal.create({
    data: {
      title,
      description,
      targetDate,
      progress,
      isCompleted,
      completedAt,
      userId,
      familyId,
    },
  });
};

exports.updateGoal = async (userId, goalId, data) => {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) return null;
  return prisma.goal.update({
    where: { id: goalId },
    data,
  });
};

exports.deleteGoal = async (userId, goalId) => {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) return null;
  return prisma.goal.delete({ where: { id: goalId } });
};
