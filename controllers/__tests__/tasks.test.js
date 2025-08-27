const tasksController = require('../tasks');

describe('tasksController', () => {
  it('should export an object', () => {
    expect(typeof tasksController).toBe('object');
  });
  it('should have getTasks function', () => {
    expect(typeof tasksController.getTasks).toBe('function');
  });
  it('should have getTaskById function', () => {
    expect(typeof tasksController.getTaskById).toBe('function');
  });
  it('should have createTask function', () => {
    expect(typeof tasksController.createTask).toBe('function');
  });
});
