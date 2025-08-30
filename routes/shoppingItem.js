const express = require('express');
const router = express.Router();
const shoppingItemController = require('../controllers/shoppingItem');
const {authenticate} = require("../lib/middleware/auth");

// GET /api/shopping-item
router.get('/', authenticate, shoppingItemController.getAllShoppingItems);

// GET /api/shopping-item/:id
router.get('/:id', authenticate, shoppingItemController.getShoppingItemById);

// POST /api/shopping-item
router.post('/', authenticate, shoppingItemController.createShoppingItem);

// PUT /api/shopping-item/:id
router.put('/:id', authenticate, shoppingItemController.updateShoppingItem);

// DELETE /api/shopping-item/:id
router.delete('/:id', authenticate, shoppingItemController.deleteShoppingItem);

module.exports = router;

