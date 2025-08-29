const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const shoppingCategoryController = require('../controllers/shoppingCategory');

router.get('/', authenticate, shoppingCategoryController.getAllCategories);
router.post('/', authenticate, shoppingCategoryController.createCategory);
router.put('/:id', authenticate, shoppingCategoryController.updateCategory);
router.delete('/:id', authenticate, shoppingCategoryController.deleteCategory);

module.exports = router;

