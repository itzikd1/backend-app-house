const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { validateNote } = require('../middleware/validation');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('ADMIN'), validateNote, noteController.createNote);
router.get('/', authenticate, noteController.getNotes);
router.get('/:id', authenticate, noteController.getNoteById);
router.put('/:id', authenticate, authorize('ADMIN'), validateNote, noteController.updateNote);
router.delete('/:id', authenticate, authorize('ADMIN'), noteController.deleteNote);

module.exports = router;

