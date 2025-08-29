const taskCategoryService = require('../lib/services/taskCategoryService');

exports.getAllTaskCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const familyId = req.user.familyId;
    const categories = await taskCategoryService.getAllCategories(userId, familyId);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createTaskCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const familyId = req.user.familyId;
    const { name } = req.body;
    const category = await taskCategoryService.createCategory({ name, userId, familyId });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.updateTaskCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name } = req.body;
    const category = await taskCategoryService.updateCategory(categoryId, { name });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteTaskCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    await taskCategoryService.deleteCategory(categoryId);
    res.json({ success: true, data: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
