const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const taskCategoryController = require('../controllers/taskCategory');

router.get('/', authenticate, taskCategoryController.getAllTaskCategories);
router.post('/', authenticate, taskCategoryController.createTaskCategory);
router.put('/:id', authenticate, taskCategoryController.updateTaskCategory);
router.delete('/:id', authenticate, taskCategoryController.deleteTaskCategory);

module.exports = router;

