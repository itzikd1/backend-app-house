const goalService = require('../goalService');

describe('goalService', () => {
  it('should have getAllGoals function', () => {
    expect(typeof goalService.getAllGoals).toBe('function');
  });
  it('should have getGoalById function', () => {
    expect(typeof goalService.getGoalById).toBe('function');
  });
  it('should have createGoal function', () => {
    expect(typeof goalService.createGoal).toBe('function');
  });
  it('should have updateGoal function', () => {
    expect(typeof goalService.updateGoal).toBe('function');
  });
  it('should have deleteGoal function', () => {
    expect(typeof goalService.deleteGoal).toBe('function');
  });
});

