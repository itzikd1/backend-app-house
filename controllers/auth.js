const authService = require('../lib/services/authService');
const prisma = require('../lib/prisma');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
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
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to login' });
  }
};

exports.me = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token || token !== 'jwt') {
      return res.status(401).json({ error: 'Missing or invalid token' });
    }
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
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
