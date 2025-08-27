const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

// Create Category (ADMIN only)
router.post('/', authenticate, authorize('ADMIN'), validateCategory, categoryController.createCategory);
// Get all Categories (authenticated)
router.get('/', authenticate, categoryController.getCategories);
// Get Category by ID (authenticated)
router.get('/:id', authenticate, categoryController.getCategoryById);
// Update Category (ADMIN only)
router.put('/:id', authenticate, authorize('ADMIN'), validateCategory, categoryController.updateCategory);
// Delete Category (ADMIN only)
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.deleteCategory);

module.exports = router;

