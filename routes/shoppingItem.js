const express = require('express');
const router = express.Router();
const shoppingItemController = require('../controllers/shoppingItemController');
const { validateShoppingItem } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateShoppingItem, shoppingItemController.createShoppingItem);
router.get('/', authenticate, shoppingItemController.getShoppingItems);
router.get('/:id', authenticate, shoppingItemController.getShoppingItemById);
router.put('/:id', authenticate, authorize('ADMIN'), validateShoppingItem, shoppingItemController.updateShoppingItem);
router.delete('/:id', authenticate, authorize('ADMIN'), shoppingItemController.deleteShoppingItem);

module.exports = router;

