const express = require('express');
const router = express.Router();
const { authenticate } = require('../lib/middleware/auth');
const noteController = require('../controllers/note');

router.get('/', authenticate, noteController.getAllNotes);
router.get('/:id', authenticate, noteController.getNoteById);
router.post('/', authenticate, noteController.createNote);
router.put('/:id', authenticate, noteController.updateNote);
router.delete('/:id', authenticate, noteController.deleteNote);

module.exports = router;
