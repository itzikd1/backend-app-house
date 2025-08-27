const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 4 })
      .withMessage('Password must be at least 4 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
  ],
  authController.signup
);

router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.signin
);

module.exports = router;
