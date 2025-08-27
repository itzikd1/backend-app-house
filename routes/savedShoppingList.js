const express = require('express');
const router = express.Router();
const savedShoppingListController = require('../controllers/savedShoppingListController');
const { validateSavedShoppingList } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateSavedShoppingList, savedShoppingListController.createSavedShoppingList);
router.get('/', authenticate, savedShoppingListController.getSavedShoppingLists);
router.get('/:id', authenticate, savedShoppingListController.getSavedShoppingListById);
router.put('/:id', authenticate, authorize('ADMIN'), validateSavedShoppingList, savedShoppingListController.updateSavedShoppingList);
router.delete('/:id', authenticate, authorize('ADMIN'), savedShoppingListController.deleteSavedShoppingList);

module.exports = router;

