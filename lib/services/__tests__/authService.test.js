const authService = require('../authService');
const userService = require('../userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../userService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('authService', () => {
  afterEach(() => jest.clearAllMocks());

  it('should export an object', () => {
    expect(typeof authService).toBe('object');
  });
  it('should have a login function', () => {
    expect(typeof authService.login).toBe('function');
  });
  it('should have a register function', () => {
    expect(typeof authService.register).toBe('function');
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      userService.findByEmail.mockResolvedValue({ id: 'user1', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt');
      const result = await authService.login('test@example.com', 'pass');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'jwt');
    });
    it('should throw error for invalid credentials (user not found)', async () => {
      userService.findByEmail.mockResolvedValue(null);
      await expect(authService.login('test@example.com', 'pass')).rejects.toThrow('Invalid credentials');
    });
    it('should throw error for invalid credentials (wrong password)', async () => {
      userService.findByEmail.mockResolvedValue({ id: 'user1', password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);
      await expect(authService.login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      userService.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      userService.create.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
      jwt.sign.mockReturnValue('jwt');
      const result = await authService.register({ email: 'test@example.com', password: 'pass', name: 'Test' });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token', 'jwt');
    });
    it('should throw error if email already in use', async () => {
      userService.findByEmail.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
      await expect(authService.register({ email: 'test@example.com', password: 'pass', name: 'Test' })).rejects.toThrow('Email already in use');
    });
  });
});
