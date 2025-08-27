const taskService = require('../taskService');

describe('taskService', () => {
  it('should have getUserWithFamily function', () => {
    expect(typeof taskService.getUserWithFamily).toBe('function');
  });
  it('should have getTasksForUser function', () => {
    expect(typeof taskService.getTasksForUser).toBe('function');
  });
  it('should have getTaskById function', () => {
    expect(typeof taskService.getTaskById).toBe('function');
  });
});
