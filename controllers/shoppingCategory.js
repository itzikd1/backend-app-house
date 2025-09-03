const shoppingCategoryService = require('../lib/services/shoppingCategoryService');

exports.getAllCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const familyId = req.user.familyId;
        const categories = await shoppingCategoryService.getAllCategories(userId, familyId);
        res.json({data: {success: true, item: categories}});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const familyId = req.user.familyId;
        const {name} = req.body;
        const category = await shoppingCategoryService.createCategory({name, userId, familyId});
        res.json({data: {success: true, item: category}});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const {name} = req.body;
        const category = await shoppingCategoryService.updateCategory(categoryId, {name});
        res.json({data: {success: true, item: category}});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const result = await shoppingCategoryService.deleteCategory(categoryId);
        console.log(result)
        return res.json({data: {success: true, message: result.message}});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};
