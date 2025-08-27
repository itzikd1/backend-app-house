const noteService = require('../noteService');

describe('noteService', () => {
  it('should have getAllNotes function', () => {
    expect(typeof noteService.getAllNotes).toBe('function');
  });
  it('should have getNoteById function', () => {
    expect(typeof noteService.getNoteById).toBe('function');
  });
  it('should have createNote function', () => {
    expect(typeof noteService.createNote).toBe('function');
  });
  it('should have updateNote function', () => {
    expect(typeof noteService.updateNote).toBe('function');
  });
  it('should have deleteNote function', () => {
    expect(typeof noteService.deleteNote).toBe('function');
  });
});

