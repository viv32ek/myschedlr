process.env.TENANT_ID = 'testco';
process.env.COGNITO_USER_POOL_ID = 'us-east-1_test';
process.env.COGNITO_CLIENT_ID = 'testclientid';

// Mock aws-jwt-verify before app is required so the singleton captures it
const mockVerify = jest.fn().mockResolvedValue({
  sub: 'cognito-sub-123',
  'cognito:groups': ['user'],
});
jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: { create: () => ({ verify: mockVerify }) },
}));

// Mock the user model so tests don't need a real DynamoDB
jest.mock('../src/models/user');
const userModel = require('../src/models/user');

const request = require('supertest');
const app = require('../src/index');

const mockProfile = {
  id: 'cognito-sub-123',
  role: 'user',
  tenantId: 'testco',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('User routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /users/me → 200 with valid token', async () => {
    userModel.getOrCreateUser.mockResolvedValue(mockProfile);
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer valid.token.here');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('cognito-sub-123');
    expect(res.body.role).toBe('user');
    expect(mockVerify).toHaveBeenCalledWith('valid.token.here');
  });

  it('GET /users/me without token → 401', async () => {
    const res = await request(app).get('/users/me');
    expect(res.status).toBe(401);
  });

  it('GET /users/me with invalid token → 401', async () => {
    mockVerify.mockRejectedValueOnce(new Error('TokenExpiredError'));
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer expired.token.here');
    expect(res.status).toBe(401);
  });

  it('GET /health → 200 (no auth required)', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

