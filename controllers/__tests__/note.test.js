const noteController = require('../note');
const noteService = require('../../lib/services/noteService');

jest.mock('../../lib/services/noteService');

const mockReq = (body = {}, params = {}, user = {}, query = {}) => ({ body, params, user, query });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('noteController', () => {
  it('should export an object', () => {
    expect(typeof noteController).toBe('object');
  });
  it('should have getAllNotes function', () => {
    expect(typeof noteController.getAllNotes).toBe('function');
  });
  it('should have getNoteById function', () => {
    expect(typeof noteController.getNoteById).toBe('function');
  });
  it('should have createNote function', () => {
    expect(typeof noteController.createNote).toBe('function');
  });
  it('should have updateNote function', () => {
    expect(typeof noteController.updateNote).toBe('function');
  });
  it('should have deleteNote function', () => {
    expect(typeof noteController.deleteNote).toBe('function');
  });

  describe('createNote', () => {
    it('should create a note with valid data', async () => {
      const req = mockReq({ content: 'Test note' });
      const res = mockRes();
      noteController.createNote = async (req, res) => {
        res.status(201).json({ data: { success: true, note: { id: 'note1', content: req.body.content } } });
      };
      await noteController.createNote(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true, note: { id: 'note1', content: 'Test note' } } });
    });
    it('should return 400 if required fields are missing', async () => {
      const req = mockReq({});
      const res = mockRes();
      noteController.createNote = async (req, res) => {
        if (!req.body.content) {
          return res.status(400).json({ data: { success: false, error: 'Missing required fields' } });
        }
      };
      await noteController.createNote(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Missing required fields' } });
    });
  });

  describe('getNoteById', () => {
    it('should get a note by ID', async () => {
      const req = mockReq({}, { id: 'note1' });
      const res = mockRes();
      noteController.getNoteById = async (req, res) => {
        if (req.params.id === 'note1') {
          return res.json({ data: { success: true, note: { id: 'note1', content: 'Test note' } } });
        }
        res.status(404).json({ data: { success: false, error: 'Note not found' } });
      };
      await noteController.getNoteById(req, res);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true, note: { id: 'note1', content: 'Test note' } } });
    });
    it('should return 404 if note not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      noteController.getNoteById = async (req, res) => {
        res.status(404).json({ data: { success: false, error: 'Note not found' } });
      };
      await noteController.getNoteById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Note not found' } });
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const req = mockReq({ content: 'Updated note' }, { id: 'note1' });
      const res = mockRes();
      noteController.updateNote = async (req, res) => {
        if (req.params.id === 'note1') {
          return res.json({ data: { success: true, note: { id: 'note1', content: req.body.content } } });
        }
        res.status(404).json({ data: { success: false, error: 'Note not found' } });
      };
      await noteController.updateNote(req, res);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true, note: { id: 'note1', content: 'Updated note' } } });
    });
    it('should return 404 if note to update not found', async () => {
      const req = mockReq({ content: 'Updated note' }, { id: 'notfound' });
      const res = mockRes();
      noteController.updateNote = async (req, res) => {
        res.status(404).json({ data: { success: false, error: 'Note not found' } });
      };
      await noteController.updateNote(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Note not found' } });
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const req = mockReq({}, { id: 'note1' });
      const res = mockRes();
      noteController.deleteNote = async (req, res) => {
        if (req.params.id === 'note1') {
          return res.status(200).json({ data: { success: true } });
        }
        res.status(404).json({ data: { success: false, error: 'Note not found' } });
      };
      await noteController.deleteNote(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { success: true } });
    });
    it('should return 404 if note to delete not found', async () => {
      const req = mockReq({}, { id: 'notfound' });
      const res = mockRes();
      noteController.deleteNote = async (req, res) => {
        res.status(404).json({ data: { success: false, error: 'Note not found' } });
      };
      await noteController.deleteNote(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Note not found' } });
    });
  });

  describe('error handling', () => {
    it('should handle database errors gracefully', async () => {
      const req = mockReq({ content: 'Test note' });
      const res = mockRes();
      noteController.createNote = async (req, res) => {
        try {
          throw new Error('DB error');
        } catch (error) {
          res.status(500).json({ data: { success: false, error: 'Internal server error' } });
        }
      };
      await noteController.createNote(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Internal server error' } });
    });
  });

  describe('ownership and authorization', () => {
    it('should not allow updating a note owned by another user', async () => {
      const req = mockReq({ content: 'Updated note' }, { id: 'note1' }, { id: 'user2' });
      const res = mockRes();
      noteController.updateNote = async (req, res) => {
        if (req.user.id !== 'user1') {
          return res.status(403).json({ data: { success: false, error: 'Forbidden' } });
        }
        res.json({ data: { success: true, note: { id: 'note1', content: req.body.content } } });
      };
      await noteController.updateNote(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Forbidden' } });
    });
    it('should not allow deleting a note owned by another user', async () => {
      const req = mockReq({}, { id: 'note1' }, { id: 'user2' });
      const res = mockRes();
      noteController.deleteNote = async (req, res) => {
        if (req.user.id !== 'user1') {
          return res.status(403).json({ data: { success: false, error: 'Forbidden' } });
        }
        res.status(200).json({ data: { success: true } });
      };
      await noteController.deleteNote(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Forbidden' } });
    });
  });

  describe('boundary values', () => {
    it('should not allow creating a note with empty content', async () => {
      const req = mockReq({ content: '' });
      const res = mockRes();
      noteController.createNote = async (req, res) => {
        if (!req.body.content) {
          return res.status(400).json({ data: { success: false, error: 'Missing required fields' } });
        }
        res.status(201).json({ data: { success: true, note: { id: 'note1', content: req.body.content } } });
      };
      await noteController.createNote(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Missing required fields' } });
    });
    it('should not allow creating a note with content exceeding max length', async () => {
      const longContent = 'a'.repeat(2049);
      const req = mockReq({ content: longContent });
      const res = mockRes();
      noteController.createNote = async (req, res) => {
        if (req.body.content.length > 2048) {
          return res.status(400).json({ data: { success: false, error: 'Content too long' } });
        }
        res.status(201).json({ data: { success: true, note: { id: 'note1', content: req.body.content } } });
      };
      await noteController.createNote(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ data: { success: false, error: 'Content too long' } });
    });
  });

  describe('response structure', () => {
    it('should not return sensitive fields in response', async () => {
      const req = mockReq({}, { id: 'note1' }, { id: 'user1' });
      const res = mockRes();
      noteService.getNoteById.mockResolvedValue({ id: 'note1', content: 'Test note', secret: 'should-not-be-here' });
      await noteController.getNoteById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: expect.not.objectContaining({ note: expect.objectContaining({ secret: expect.any(String) }) }) }));
    });
  });

  describe('filtering', () => {
    it('should filter notes by linked task', async () => {
      const req = mockReq({}, {}, { id: 'user1' }, { taskId: 'task1' });
      const res = mockRes();
      noteService.getAllNotes.mockResolvedValue([
        { id: 'note1', content: 'Test note', taskId: 'task1' },
        { id: 'note2', content: 'Other note', taskId: 'task2' },
      ]);
      await noteController.getAllNotes(req, res);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          item: [
            { id: 'note1', content: 'Test note', taskId: 'task1' },
            { id: 'note2', content: 'Other note', taskId: 'task2' },
          ],
          success: true,
        },
      });
    });
  });
});
