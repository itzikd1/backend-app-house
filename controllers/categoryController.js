const categoryService = require('../lib/services/categoryService');

exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
