const noteController = require('../note');

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
});

