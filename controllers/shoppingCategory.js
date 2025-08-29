const shoppingCategoryService = require('../lib/services/shoppingCategoryService');

exports.getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const familyId = req.user.familyId;
    const categories = await shoppingCategoryService.getAllCategories(userId, familyId);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const familyId = req.user.familyId;
    const { name } = req.body;
    const category = await shoppingCategoryService.createCategory({ name, userId, familyId });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    const category = await shoppingCategoryService.updateCategory(categoryId, { name });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    await shoppingCategoryService.deleteCategory(categoryId);
    res.json({ success: true, data: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
