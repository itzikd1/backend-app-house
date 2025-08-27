const shoppingItemService = require('../lib/services/shoppingItemService');

exports.createShoppingItem = async (req, res, next) => {
  try {
    const item = await shoppingItemService.createShoppingItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.getShoppingItems = async (req, res, next) => {
  try {
    const items = await shoppingItemService.getShoppingItems();
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.getShoppingItemById = async (req, res, next) => {
  try {
    const item = await shoppingItemService.getShoppingItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Shopping item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.updateShoppingItem = async (req, res, next) => {
  try {
    const item = await shoppingItemService.updateShoppingItem(req.params.id, req.body);
    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.deleteShoppingItem = async (req, res, next) => {
  try {
    await shoppingItemService.deleteShoppingItem(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const shoppingItemController = require('../controllers/shoppingItemController');
const { validateShoppingItem } = require('../middleware/validation');

router.post('/', validateShoppingItem, shoppingItemController.createShoppingItem);
router.get('/', shoppingItemController.getShoppingItems);
router.get('/:id', shoppingItemController.getShoppingItemById);
router.put('/:id', validateShoppingItem, shoppingItemController.updateShoppingItem);
router.delete('/:id', shoppingItemController.deleteShoppingItem);

module.exports = router;
