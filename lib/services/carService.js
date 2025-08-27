const prisma = require('../prisma');

exports.getAllCars = async (userId) => {
  return prisma.car.findMany({
    where: { userId },
  });
};

exports.getCarById = async (userId, carId) => {
  return prisma.car.findFirst({
    where: { id: carId, userId },
  });
};

exports.createCar = async (userId, data) => {
  // Destructure and validate required fields
  const { make, model, year, licensePlate, familyId } = data;
  if (!make || !model || !licensePlate) {
    throw new Error('Missing required fields: make, model, licensePlate');
  }
  return prisma.car.create({
    data: {
      make,
      model,
      year,
      licensePlate,
      userId,
      familyId,
    },
  });
};

exports.updateCar = async (userId, carId, data) => {
  // Only allow update if car belongs to user
  const car = await prisma.car.findFirst({ where: { id: carId, userId } });
  if (!car) return null;
  // Only update allowed fields
  const { make, model, year, licensePlate, familyId } = data;
  return prisma.car.update({
    where: { id: carId },
    data: {
      ...(make && { make }),
      ...(model && { model }),
      ...(year !== undefined && { year }),
      ...(licensePlate && { licensePlate }),
      ...(familyId && { familyId }),
    },
  });
};

exports.deleteCar = async (userId, carId) => {
  // Only allow delete if car belongs to user
  const car = await prisma.car.findFirst({ where: { id: carId, userId } });
  if (!car) return null;
  return prisma.car.delete({
    where: { id: carId },
  });
};
