const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const usersController = require('../controllers/users');

// GET /users - Get all users (protected route)
router.get('/', authenticate, usersController.getAllUsers);

// POST /users - Create a new user
router.post('/', usersController.createUser);

module.exports = router;
