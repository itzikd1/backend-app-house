const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const { validateRequest } = require('../middleware/validation');
const tasksController = require('../controllers/tasks');

router.get('/', authenticate, tasksController.getTasks);
router.get('/:id', authenticate, tasksController.getTaskById);
router.post('/',
  authenticate,
  validateRequest({
    title: 'required|string|min:2|max:255',
    description: 'string',
    dueDate: 'date',
    priority: 'in:Low,Medium,High',
    repeatFrequency: 'string',
    categoryId: 'string|uuid',
  }),
  tasksController.createTask
);
router.put('/:id',
  authenticate,
  validateRequest({
    title: 'string|min:2|max:255',
    description: 'string',
    completed: 'boolean',
    dueDate: 'date',
    priority: 'in:Low,Medium,High',
    repeatFrequency: 'string',
    categoryId: 'string|uuid',
  }),
  tasksController.updateTask
);
router.delete('/:id', authenticate, tasksController.deleteTask);

module.exports = router;
