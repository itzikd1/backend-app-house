const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const { validateRequest } = require('../middleware/validation');
const authController = require('../controllers/auth');

router.post('/register',
  validateRequest({
    name: 'required|string|min:2',
    email: 'required|email',
    password: 'required|string|min:8',
  }),
  authController.register
);

router.post('/login',
  validateRequest({
    email: 'required|email',
    password: 'required|string',
  }),
  authController.login
);

router.get('/me', authenticate, authController.me);

module.exports = router;
