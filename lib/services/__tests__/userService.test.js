const userService = require('../userService');
const prisma = require('../../prisma');

describe('userService', () => {
  it('should have a findById function', () => {
    expect(typeof userService.findById).toBe('function');
  });
  it('should have a findByEmail function', () => {
    expect(typeof userService.findByEmail).toBe('function');
  });
  it('should have a create function', () => {
    expect(typeof userService.create).toBe('function');
  });
});

describe('findById', () => {
  beforeEach(() => {
    prisma.user = {
      findUnique: jest.fn(),
    };
  });
  it('should return user for valid ID', async () => {
    const mockUser = {
      id: 'user1',
      name: 'Test',
      email: 'test@example.com',
      role: 'user',
      createdAt: '2025-08-27T00:00:00.000Z',
    };
    prisma.user.findUnique.mockResolvedValue(mockUser);
    const user = await userService.findById('user1');
    expect(user).toEqual(mockUser);
  });
  it('should return null for invalid ID', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const user = await userService.findById('invalid');
    expect(user).toBeNull();
  });
  it('should handle errors from Prisma', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('DB error'));
    await expect(userService.findById('user1')).rejects.toThrow('DB error');
  });
});

describe('create', () => {
  beforeEach(() => {
    prisma.user = {
      create: jest.fn(),
    };
  });
  it('should create user with valid data', async () => {
    const data = { name: 'Test', email: 'test@example.com' };
    const mockUser = {
      id: 'user1',
      name: 'Test',
      email: 'test@example.com',
      role: 'user',
      createdAt: '2025-08-27T00:00:00.000Z',
    };
    prisma.user.create.mockResolvedValue(mockUser);
    const user = await userService.create(data);
    expect(user).toEqual(mockUser);
  });
  it('should throw error for invalid data', async () => {
    prisma.user.create.mockRejectedValue(new Error('Invalid data'));
    await expect(userService.create({})).rejects.toThrow('Invalid data');
  });
});

describe('delete', () => {
  beforeEach(() => {
    prisma.user = {
      delete: jest.fn(),
    };
  });
  it('should handle deleting non-existent user gracefully', async () => {
    prisma.user.delete.mockRejectedValue(new Error('User not found'));
    await expect(userService.delete('nonexistent')).rejects.toThrow('User not found');
  });
});
