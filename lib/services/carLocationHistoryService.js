const prisma = require('../prisma');

exports.getAllCarLocationHistory = async (userId) => {
  return prisma.carLocationHistory.findMany({
    where: { parkedById: userId },
  });
};

exports.getCarLocationHistoryById = async (userId, id) => {
  return prisma.carLocationHistory.findFirst({
    where: { id, parkedById: userId },
  });
};

exports.createCarLocationHistory = async (userId, data) => {
  // Destructure and validate required fields
  const { carId, location, parkedAt, latitude, longitude } = data;
  if (!carId || !location) {
    throw new Error('Missing required fields: carId, location');
  }
  return prisma.carLocationHistory.create({
    data: {
      carId,
      location,
      parkedAt,
      latitude,
      longitude,
      parkedById: userId,
    },
  });
};

exports.updateCarLocationHistory = async (userId, id, data) => {
  // Only allow update if history belongs to user
  const history = await prisma.carLocationHistory.findFirst({ where: { id, parkedById: userId } });
  if (!history) return null;
  const { location, parkedAt, latitude, longitude } = data;
  return prisma.carLocationHistory.update({
    where: { id },
    data: {
      ...(location && { location }),
      ...(parkedAt && { parkedAt }),
      ...(latitude !== undefined && { latitude }),
      ...(longitude !== undefined && { longitude }),
    },
  });
};

exports.deleteCarLocationHistory = async (userId, id) => {
  // Only allow delete if history belongs to user
  const history = await prisma.carLocationHistory.findFirst({ where: { id, parkedById: userId } });
  if (!history) return null;
  return prisma.carLocationHistory.delete({
    where: { id },
  });
};
