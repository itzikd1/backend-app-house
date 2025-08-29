const savedShoppingListService = require('../lib/services/savedShoppingListService');

exports.getAllLists = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const lists = await savedShoppingListService.getAllLists(userId);
    res.json({ success: true, data: lists });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const list = await savedShoppingListService.createList({ name, userId });
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getListById = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const list = await savedShoppingListService.getListById(listId);
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

exports.updateList = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const { name } = req.body;
    const list = await savedShoppingListService.updateList(listId, { name });
    res.json({ success: true, data: list });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteList = async (req, res, next) => {
  try {
    const listId = req.params.id;
    await savedShoppingListService.deleteList(listId);
    res.json({ success: true, data: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Items
exports.getListItems = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const items = await savedShoppingListService.getListItems(listId);
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const listId = req.params.id;
    const userId = req.user.id;
    const itemData = req.body;
    const item = await savedShoppingListService.addItem(listId, itemData, userId);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const itemData = req.body;
    const item = await savedShoppingListService.updateItem(itemId, itemData);
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    await savedShoppingListService.deleteItem(itemId);
    res.json({ success: true, data: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
