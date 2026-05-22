process.env.JWT_SECRET = 'test_secret';
process.env.TENANT_ID = 'testco';   // locks tenant middleware to a fixed value in tests

// Mock the user model so tests don't need a real DynamoDB
jest.mock('../src/models/user');
const userModel = require('../src/models/user');

const request = require('supertest');
const app = require('../src/index');

const mockUser = {
  id: 'user-1',
  email: 'a@test.com',
  name: 'Alice',
  role: 'user',
  tenantId: 'testco',
  passwordHash: '$2a$10$WSkYZA9hjeB.lrCEQawQguJkl6kv.gL7d279hSX9toZrvc1qTbj5q', // "password1"
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('Auth routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /auth/signup → 201', async () => {
    userModel.createUser.mockResolvedValue();
    const res = await request(app).post('/auth/signup').send({ email: 'b@test.com', password: 'password1', name: 'Bob' });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(userModel.createUser).toHaveBeenCalledWith('testco', expect.objectContaining({ email: 'b@test.com' }));
  });

  it('POST /auth/signup duplicate email → 409', async () => {
    const err = new Error(); err.name = 'ConditionalCheckFailedException';
    userModel.createUser.mockRejectedValue(err);
    const res = await request(app).post('/auth/signup').send({ email: 'a@test.com', password: 'password1', name: 'Alice' });
    expect(res.status).toBe(409);
  });

  it('POST /auth/login → 200', async () => {
    userModel.getUserByEmail.mockResolvedValue(mockUser);
    const res = await request(app).post('/auth/login').send({ email: 'a@test.com', password: 'password1' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /auth/login wrong password → 401', async () => {
    userModel.getUserByEmail.mockResolvedValue(mockUser);
    const res = await request(app).post('/auth/login').send({ email: 'a@test.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});

