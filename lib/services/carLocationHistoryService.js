const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCarLocationHistory = async (data) => prisma.carLocationHistory.create({ data });
const getCarLocationHistories = async () => prisma.carLocationHistory.findMany();
const getCarLocationHistoryById = async (id) => prisma.carLocationHistory.findUnique({ where: { id } });
const updateCarLocationHistory = async (id, data) => prisma.carLocationHistory.update({ where: { id }, data });
const deleteCarLocationHistory = async (id) => prisma.carLocationHistory.delete({ where: { id } });

module.exports = {
  createCarLocationHistory,
  getCarLocationHistories,
  getCarLocationHistoryById,
  updateCarLocationHistory,
  deleteCarLocationHistory,
};

