const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createCar = async (data) => prisma.car.create({ data });
const getCars = async () => prisma.car.findMany();
const getCarById = async (id) => prisma.car.findUnique({ where: { id } });
const updateCar = async (id, data) => prisma.car.update({ where: { id }, data });
const deleteCar = async (id) => prisma.car.delete({ where: { id } });

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};

