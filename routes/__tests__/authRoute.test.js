const request = require('supertest');
const app = require('../../server');

describe('Auth Route Integration', () => {
  it('should return 401 for invalid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
  // Add more integration tests for /api/auth here
});

