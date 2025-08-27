const goalController = require('../goal');

describe('goalController', () => {
  it('should export an object', () => {
    expect(typeof goalController).toBe('object');
  });
  it('should have getAllGoals function', () => {
    expect(typeof goalController.getAllGoals).toBe('function');
  });
  it('should have getGoalById function', () => {
    expect(typeof goalController.getGoalById).toBe('function');
  });
  it('should have createGoal function', () => {
    expect(typeof goalController.createGoal).toBe('function');
  });
  it('should have updateGoal function', () => {
    expect(typeof goalController.updateGoal).toBe('function');
  });
  it('should have deleteGoal function', () => {
    expect(typeof goalController.deleteGoal).toBe('function');
  });
});

