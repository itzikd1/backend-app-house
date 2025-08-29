const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const savedShoppingListController = require('../controllers/savedShoppingList');

router.get('/', authenticate, savedShoppingListController.getAllLists);
router.post('/', authenticate, savedShoppingListController.createList);
router.get('/:id', authenticate, savedShoppingListController.getListById);
router.put('/:id', authenticate, savedShoppingListController.updateList);
router.delete('/:id', authenticate, savedShoppingListController.deleteList);

// Items
router.get('/:id/items', authenticate, savedShoppingListController.getListItems);
router.post('/:id/items', authenticate, savedShoppingListController.addItem);
router.put('/items/:itemId', authenticate, savedShoppingListController.updateItem);
router.delete('/items/:itemId', authenticate, savedShoppingListController.deleteItem);

module.exports = router;

