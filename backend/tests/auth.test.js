process.env.JWT_SECRET = 'test_secret';
const request = require('supertest');
const app = require('../src/index');

describe('Auth routes', () => {
  it('POST /auth/signup → 201', async () => {
    const res = await request(app).post('/auth/signup').send({ email: 'a@test.com', password: 'password1', name: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /auth/login → 200', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'a@test.com', password: 'password1' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /auth/login wrong password → 401', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'a@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
