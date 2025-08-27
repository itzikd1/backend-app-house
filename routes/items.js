const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { verifyToken } = require('../src/middleware/auth.middleware');

// Middleware to verify token and set userId
router.use(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    await new Promise((resolve, reject) => {
      verifyToken(req, { json: (obj) => reject(obj) }, () => {
        resolve(req.userId);
      });
    });
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// GET /api/items - Get all items for user
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add other CRUD endpoints as needed

module.exports = router;
