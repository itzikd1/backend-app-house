const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createGoal = async (data) => prisma.goal.create({ data });
const getGoals = async () => prisma.goal.findMany();
const getGoalById = async (id) => prisma.goal.findUnique({ where: { id } });
const updateGoal = async (id, data) => prisma.goal.update({ where: { id }, data });
const deleteGoal = async (id) => prisma.goal.delete({ where: { id } });

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};

