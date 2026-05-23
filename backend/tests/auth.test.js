process.env.TENANT_ID           = 'testco';
process.env.COGNITO_USER_POOL_ID = 'us-east-1_test';
process.env.COGNITO_CLIENT_ID    = 'testclientid';

const mockVerify = jest.fn().mockResolvedValue({ sub: 'cognito-sub-123' });
jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: { create: () => ({ verify: mockVerify }) },
}));

jest.mock('../src/models/user');
jest.mock('../src/models/adminGrant', () => ({
  getGrantsForUser: jest.fn(),
  getGrant:         jest.fn(),
  putGrant:         jest.fn(),
  deleteGrant:      jest.fn(),
  VALID_PERMISSIONS: {
    course: ['edit_course', 'manage_batches', 'manage_schedules'],
    school: ['edit_school', 'manage_batches', 'manage_schedules'],
    batch:  ['edit_batch', 'manage_schedules'],
  },
  VALID_SCOPES: ['course', 'school', 'batch'],
}));

const userModel      = require('../src/models/user');
const adminGrantModel = require('../src/models/adminGrant');
const request        = require('supertest');
const app            = require('../src/index');

const mockProfile = {
  id:        'cognito-sub-123',
  email:     'test@example.com',
  name:      'Test User',
  roles:     ['student'],
  tenantId:  'testco',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const adminProfile = {
  ...mockProfile,
  roles:     ['admin'],
  adminType: 'super_admin',
};

beforeEach(() => jest.clearAllMocks());

describe('GET /health', () => {
  it('returns 200 with no auth required', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /auth/provision', () => {
  it('creates profile → 201', async () => {
    userModel.getUserBySub.mockResolvedValue(null);
    userModel.createUser.mockResolvedValue(mockProfile);

    const res = await request(app)
      .post('/auth/provision')
      .set('Authorization', 'Bearer valid.token.here')
      .send({ name: 'Test User', email: 'test@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.id).toBe('cognito-sub-123');
    expect(res.body.roles).toEqual(['student']);
  });

  it('returns existing profile → 200 (idempotent)', async () => {
    userModel.getUserBySub.mockResolvedValue(mockProfile);

    const res = await request(app)
      .post('/auth/provision')
      .set('Authorization', 'Bearer valid.token.here')
      .send({ name: 'Test User', email: 'test@example.com' });

    expect(res.status).toBe(200);
    expect(userModel.createUser).not.toHaveBeenCalled();
  });

  it('returns 400 when email is missing', async () => {
    const res = await request(app)
      .post('/auth/provision')
      .set('Authorization', 'Bearer valid.token.here')
      .send({ name: 'Test User' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/auth/provision')
      .set('Authorization', 'Bearer valid.token.here')
      .send({ email: 'test@example.com' });
    expect(res.status).toBe(400);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/auth/provision')
      .send({ name: 'Test', email: 'test@example.com' });
    expect(res.status).toBe(401);
  });

  it('returns 400 for invalid roles', async () => {
    userModel.getUserBySub.mockResolvedValue(null);
    const res = await request(app)
      .post('/auth/provision')
      .set('Authorization', 'Bearer valid.token.here')
      .send({ name: 'Test User', email: 'test@example.com', roles: ['superuser'] });
    expect(res.status).toBe(400);
  });
});

describe('GET /users/me', () => {
  it('returns profile → 200', async () => {
    userModel.getUserBySub.mockResolvedValue(mockProfile);

    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer valid.token.here');

    expect(res.status).toBe(200);
    expect(res.body.id).toBe('cognito-sub-123');
    expect(res.body.roles).toEqual(['student']);
    expect(res.body.pk).toBeUndefined();
    expect(mockVerify).toHaveBeenCalledWith('valid.token.here');
  });

  it('returns 404 when profile not provisioned', async () => {
    userModel.getUserBySub.mockResolvedValue(null);

    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer valid.token.here');

    expect(res.status).toBe(404);
  });

  it('returns 401 without token', async () => {
    const res = await request(app).get('/users/me');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    mockVerify.mockRejectedValueOnce(new Error('TokenExpiredError'));
    const res = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer expired.token.here');
    expect(res.status).toBe(401);
  });
});

describe('GET /users', () => {
  it('returns user list for elevated admin → 200', async () => {
    userModel.getUserBySub.mockResolvedValue(adminProfile);
    userModel.listUsers.mockResolvedValue([mockProfile]);

    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer valid.token.here');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns 403 for non-admin', async () => {
    userModel.getUserBySub.mockResolvedValue(mockProfile); // student, no adminType

    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer valid.token.here');

    expect(res.status).toBe(403);
  });
});

describe('PUT /users/:userId/grants/:scope/:scopeId', () => {
  it('creates a grant for tenancy core admin → 200', async () => {
    const coreAdmin = { ...adminProfile, adminType: 'tenancy_admin', tenancyAccess: ['core'] };
    const targetUser = { ...mockProfile, id: 'other-sub-456', email: 'other@example.com' };
    const mockGrant = {
      granteeEmail: 'other@example.com',
      scope: 'course',
      scopeId: 'crs_abc',
      scopeKey: 'course#crs_abc',
      permissions: ['edit_course'],
      grantedBy: 'cognito-sub-123',
      grantedAt: '2024-01-01T00:00:00.000Z',
    };

    userModel.getUserBySub
      .mockResolvedValueOnce(coreAdmin)    // loadUser (caller)
      .mockResolvedValueOnce(targetUser);  // getUser inside putGrantHandler
    adminGrantModel.putGrant.mockResolvedValue(mockGrant);

    const res = await request(app)
      .put('/users/other-sub-456/grants/course/crs_abc')
      .set('Authorization', 'Bearer valid.token.here')
      .send({ permissions: ['edit_course'] });

    expect(res.status).toBe(200);
    expect(res.body.scope).toBe('course');
  });

  it('returns 403 for non-admin caller', async () => {
    userModel.getUserBySub.mockResolvedValue(mockProfile); // student

    const res = await request(app)
      .put('/users/other-sub-456/grants/course/crs_abc')
      .set('Authorization', 'Bearer valid.token.here')
      .send({ permissions: [] });

    expect(res.status).toBe(403);
  });
});

