const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { authenticate } = require('../middleware/auth');

// GET /users - Get all users (protected route)
router.get('/', authenticate, usersController.getUsers);
// POST /users - Create a new user
router.post('/', usersController.createUser);

module.exports = router;
