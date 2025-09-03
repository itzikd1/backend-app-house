const taskCategoryService = require('../lib/services/taskCategoryService');
const taskService = require("../lib/services/taskService");

exports.getAllTaskCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const familyId = req.user.familyId;
        const categories = await taskCategoryService.getAllCategories(userId, familyId);
        res.json({data: {success: true, item: categories}});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
};

exports.createTaskCategory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const familyId = req.user.familyId;
        const {name} = req.body;
        const category = await taskCategoryService.createCategory({name, userId, familyId});
        res.json({data: {success: true, item: category}});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};

exports.updateTaskCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const {name} = req.body;
        const category = await taskCategoryService.updateCategory(categoryId, {name});
        res.json({data: {success: true, item: category}});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};

exports.deleteTaskCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const result = await taskCategoryService.deleteCategory(categoryId);
        if (result.error) {
            if (result.error === 'Task category not found') {
                return res.status(404).json({ data: { success: false, error: result.error } });
            }
            return res.status(403).json({ data: { success: false, error: result.error } });
        }
        res.json({data: {success: true, message: result.message  }});
    } catch (error) {
        res.status(400).json({success: false, error: error.message});
    }
};

