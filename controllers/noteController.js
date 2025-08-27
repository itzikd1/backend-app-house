const noteService = require('../lib/services/noteService');

exports.createNote = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getNotes();
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    next(err);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(req.params.id, req.body);
    res.status(200).json({ success: true, data: note });
  } catch (err) {
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.params.id);
    res.status(204).json({ success: true });
  } catch (err) {
    next(err);
  }
};
const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { validateNote } = require('../middleware/validation');

router.post('/', validateNote, noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', validateNote, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
