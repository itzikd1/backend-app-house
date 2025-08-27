const authService = require('../lib/services/authService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({
      name,
      email,
      password,
      role: 'FAMILY_MEMBER',
    });
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Email already in use') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        familyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
