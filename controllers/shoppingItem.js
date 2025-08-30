const shoppingItemService = require('../lib/services/shoppingItemService');

const getAllShoppingItems = async (req, res, next) => {
  try {
    const items = await shoppingItemService.getAllShoppingItems();
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getShoppingItemById = async (req, res, next) => {
  try {
    const item = await shoppingItemService.getShoppingItemById(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const createShoppingItem = async (req, res, next) => {
  try {
    const item = await shoppingItemService.createShoppingItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const updateShoppingItem = async (req, res, next) => {
  try {
    const item = await shoppingItemService.updateShoppingItem(Number(req.params.id), req.body);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const deleteShoppingItem = async (req, res, next) => {
  try {
    await shoppingItemService.deleteShoppingItem(Number(req.params.id));
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllShoppingItems,
  getShoppingItemById,
  createShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
};

