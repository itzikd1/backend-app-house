const noteService = require('../lib/services/noteService');

exports.getAllNotes = async (req, res) => {
  try {
    let notes = await noteService.getAllNotes(req.user.id);
    // Filter by linked task if query param exists
    if (req.query.taskId) {
      notes = notes.filter(note => note.taskId === req.query.taskId);
    }
    // Remove sensitive fields
    notes = notes.map(({ secret, ...rest }) => rest);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await noteService.getNoteById(req.user.id, req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    // Remove sensitive fields
    const { secret, ...safeNote } = note;
    res.json(safeNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};

exports.createNote = async (req, res) => {
  try {
    const note = await noteService.createNote(req.user.id, req.body);
    res.status(201).json({ data: note });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to create note' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const note = await noteService.updateNote(req.user.id, req.params.id, req.body);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ data: note });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Failed to update note' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const result = await noteService.deleteNote(req.user.id, req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};
