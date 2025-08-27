const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { email, name, password, role = 'USER' } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }
    const user = await prisma.user.create({
      data: { email, name, password, role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

