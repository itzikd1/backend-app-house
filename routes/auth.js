const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authService = require('../lib/services/authService');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/register', validateRequest({
  name: 'required|string|min:2',
  email: 'required|email',
  password: 'required|string|min:8',
}), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Create user
    const newUser = await authService.register({
      name,
      email,
      password,
      role: 'FAMILY_MEMBER', // Default role
    });

    // Generate token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });

    // Return user data without password and token
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', validateRequest({
  email: 'required|email',
  password: 'required|string',
}), async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
});

router.get('/me', authenticate, async (req, res) => {
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

    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    res.json({
      user,
      token
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

module.exports = router;
