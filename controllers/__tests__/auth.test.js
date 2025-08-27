const authController = require('../auth');
const authService = require('../../lib/services/authService');
const prisma = require('../../lib/prisma');

jest.mock('../../lib/services/authService');

const mockReq = (body = {}, user = {}, headers = {}) => ({ body, user, headers });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('authController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('should register a user and return 201', async () => {
      authService.register.mockResolvedValue({ id: 'user1', email: 'test@example.com' });
      const req = mockReq({ name: 'Test', email: 'test@example.com', password: 'pass' });
      const res = mockRes();
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 'user1', email: 'test@example.com' });
    });
    it('should return 409 if email already in use', async () => {
      authService.register.mockRejectedValue(new Error('Email already in use'));
      const req = mockReq({ name: 'Test', email: 'test@example.com', password: 'pass' });
      const res = mockRes();
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' });
    });
    it('should return 400 if required fields are missing', async () => {
      const req = mockReq({ email: 'test@example.com' }); // missing name and password
      const res = mockRes();
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
    });
    it('should return 500 if service throws unexpected error', async () => {
      authService.register.mockRejectedValue(new Error('Unexpected error'));
      const req = mockReq({ name: 'Test', email: 'test@example.com', password: 'pass' });
      const res = mockRes();
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to register user' });
    });
    it('should handle very long name/email gracefully', async () => {
      const longStr = 'a'.repeat(300);
      authService.register.mockResolvedValue({ id: 'user1', email: longStr });
      const req = mockReq({ name: longStr, email: longStr, password: 'pass' });
      const res = mockRes();
      await authController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 'user1', email: longStr });
    });
  });

  describe('login', () => {
    it('should login and return user data', async () => {
      authService.login.mockResolvedValue({ user: { id: 'user1' }, token: 'jwt' });
      const req = mockReq({ email: 'test@example.com', password: 'pass' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.json).toHaveBeenCalledWith({ user: { id: 'user1' }, token: 'jwt' });
    });
    it('should return 401 for invalid credentials', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));
      const req = mockReq({ email: 'test@example.com', password: 'wrong' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
    it('should return 400 if email is missing', async () => {
      const req = mockReq({ password: 'pass' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing email or password' });
    });
    it('should return 400 if password is missing', async () => {
      const req = mockReq({ email: 'test@example.com' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing email or password' });
    });
    it('should return 500 if service throws unexpected error', async () => {
      authService.login.mockRejectedValue(new Error('Unexpected error'));
      const req = mockReq({ email: 'test@example.com', password: 'pass' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to login' });
    });
    it('should handle SQL injection attempt gracefully', async () => {
      authService.login.mockRejectedValue(new Error('Invalid credentials'));
      const req = mockReq({ email: "' OR 1=1;--", password: 'pass' });
      const res = mockRes();
      await authController.login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });
  });

  describe('me', () => {
    beforeEach(() => {
      prisma.user = {
        findUnique: jest.fn(),
      };
    });
    afterEach(() => jest.clearAllMocks());
    it('should return user data if found', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user1', name: 'Test' });
      const req = mockReq({}, { id: 'user1' }, { authorization: 'Bearer jwt' });
      const res = mockRes();
      await authController.me(req, res);
      expect(res.json).toHaveBeenCalledWith({ user: { id: 'user1', name: 'Test' }, token: 'jwt' });
    });
    it('should return 404 if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const req = mockReq({}, { id: 'user1' }, { authorization: 'Bearer jwt' });
      const res = mockRes();
      await authController.me(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    it('should return 401 if JWT is missing', async () => {
      const req = mockReq({}, { id: 'user1' }, {});
      const res = mockRes();
      await authController.me(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid token' });
    });
    it('should return 401 if JWT is invalid', async () => {
      const req = mockReq({}, { id: 'user1' }, { authorization: 'Bearer invalid' });
      const res = mockRes();
      await authController.me(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid token' });
    });
    it('should return 500 if Prisma throws an error', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('DB error'));
      const req = mockReq({}, { id: 'user1' }, { authorization: 'Bearer jwt' });
      const res = mockRes();
      await authController.me(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch user profile' });
    });
  });
});
