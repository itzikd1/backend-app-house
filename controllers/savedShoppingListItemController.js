const savedShoppingListItemService = require('../lib/services/savedShoppingListItemService');

exports.createSavedShoppingListItem = async (req, res, next) => {
  try {
    const item = await savedShoppingListItemService.createSavedShoppingListItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.getSavedShoppingListItems = async (req, res, next) => {
  try {
    const items = await savedShoppingListItemService.getSavedShoppingListItems();
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.getSavedShoppingListItemById = async (req, res, next) => {
  try {
    const item = await savedShoppingListItemService.getSavedShoppingListItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Saved shopping list item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.updateSavedShoppingListItem = async (req, res, next) => {
  try {
    const item = await savedShoppingListItemService.updateSavedShoppingListItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.deleteSavedShoppingListItem = async (req, res, next) => {
  try {
    await savedShoppingListItemService.deleteSavedShoppingListItem(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const savedShoppingListItemController = require('../controllers/savedShoppingListItemController');
const { validateSavedShoppingListItem } = require('../middleware/validation');

router.post('/', validateSavedShoppingListItem, savedShoppingListItemController.createSavedShoppingListItem);
router.get('/', savedShoppingListItemController.getSavedShoppingListItems);
router.get('/:id', savedShoppingListItemController.getSavedShoppingListItemById);
router.put('/:id', validateSavedShoppingListItem, savedShoppingListItemController.updateSavedShoppingListItem);
router.delete('/:id', savedShoppingListItemController.deleteSavedShoppingListItem);

module.exports = router;
