const { validationResult } = require('express-validator');
const { body } = require('express-validator');

/**
 * Middleware to validate request data
 * @param {Object} rules - Validation rules
 * @returns {Function} Express middleware function
 */
const validateRequest = (rules) => {
  return [
    // Validate request body
    (req, res, next) => {
      const errors = [];

      // Check required fields
      Object.entries(rules).forEach(([field, rule]) => {
        const rulesList = rule.split('|');

        // Check required fields
        if (rulesList.includes('required') && !(field in req.body)) {
          errors.push(`${field} is required`);
          return;
        }

        // Skip further validation if field is not required and not provided
        if (!(field in req.body)) return;

        const value = req.body[field];

        // Check string type
        if (rulesList.includes('string') && typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        }

        // Check email format
        if (rulesList.includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email address`);
        }

        // Check minimum length
        const minLength = rulesList.find(r => r.startsWith('min:'));
        if (minLength) {
          const length = parseInt(minLength.split(':')[1]);
          if (value.length < length) {
            errors.push(`${field} must be at least ${length} characters long`);
          }
        }
      });

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      next();
    },

    // Handle validation errors
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
};

const validateCategory = [
  body('name').isString().notEmpty(),
  body('userId').isString().notEmpty(),
];

const validateGoal = [
  body('title').isString().notEmpty(),
  body('userId').isString().notEmpty(),
];

const validateCar = [
  body('model').isString().notEmpty(),
  body('familyId').isString().notEmpty(),
];

const validateShoppingItem = [
  body('name').isString().notEmpty(),
  body('familyId').isString().notEmpty(),
];

const validateNote = [
  body('content').isString().notEmpty(),
  body('familyId').isString().notEmpty(),
];

const validateRecipe = [
  body('title').isString().notEmpty(),
  body('familyId').isString().notEmpty(),
];

const validateSavedShoppingList = [
  body('name').isString().notEmpty(),
  body('userId').isString().notEmpty(),
];

const validateSavedShoppingListItem = [
  body('name').isString().notEmpty(),
  body('familyId').isString().notEmpty(),
];

const validateCarLocationHistory = [
  body('carId').isString().notEmpty(),
  body('userId').isString().notEmpty(),
  body('location').isString().notEmpty(),
];

module.exports = {
  validateRequest,
  validateCategory,
  validateGoal,
  validateCar,
  validateShoppingItem,
  validateNote,
  validateRecipe,
  validateSavedShoppingList,
  validateSavedShoppingListItem,
  validateCarLocationHistory,
};
