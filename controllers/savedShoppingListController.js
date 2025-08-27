const savedShoppingListService = require('../lib/services/savedShoppingListService');

exports.createSavedShoppingList = async (req, res, next) => {
  try {
    const list = await savedShoppingListService.createSavedShoppingList(req.body);
    res.status(201).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.getSavedShoppingLists = async (req, res, next) => {
  try {
    const lists = await savedShoppingListService.getSavedShoppingLists();
    res.status(200).json({ success: true, data: lists });
  } catch (err) {
    next(err);
  }
};

exports.getSavedShoppingListById = async (req, res, next) => {
  try {
    const list = await savedShoppingListService.getSavedShoppingListById(req.params.id);
    if (!list) {
      return res.status(404).json({ success: false, error: 'Saved shopping list not found' });
    }
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.updateSavedShoppingList = async (req, res, next) => {
  try {
    const list = await savedShoppingListService.updateSavedShoppingList(req.params.id, req.body);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.deleteSavedShoppingList = async (req, res, next) => {
  try {
    await savedShoppingListService.deleteSavedShoppingList(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const savedShoppingListController = require('../controllers/savedShoppingListController');
const { validateSavedShoppingList } = require('../middleware/validation');

router.post('/', validateSavedShoppingList, savedShoppingListController.createSavedShoppingList);
router.get('/', savedShoppingListController.getSavedShoppingLists);
router.get('/:id', savedShoppingListController.getSavedShoppingListById);
router.put('/:id', validateSavedShoppingList, savedShoppingListController.updateSavedShoppingList);
router.delete('/:id', savedShoppingListController.deleteSavedShoppingList);

module.exports = router;
