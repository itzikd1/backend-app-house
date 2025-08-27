const express = require('express');
const router = express.Router();
const savedShoppingListItemController = require('../controllers/savedShoppingListItemController');
const { validateSavedShoppingListItem } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateSavedShoppingListItem, savedShoppingListItemController.createSavedShoppingListItem);
router.get('/', authenticate, savedShoppingListItemController.getSavedShoppingListItems);
router.get('/:id', authenticate, savedShoppingListItemController.getSavedShoppingListItemById);
router.put('/:id', authenticate, authorize('ADMIN'), validateSavedShoppingListItem, savedShoppingListItemController.updateSavedShoppingListItem);
router.delete('/:id', authenticate, authorize('ADMIN'), savedShoppingListItemController.deleteSavedShoppingListItem);

module.exports = router;

