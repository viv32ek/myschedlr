const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/user');

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      role: 'user',
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };
    await createUser(req.tenantId, user);
    return res.status(201).json(issueTokens(req.tenantId, user));
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(409).json({ message: 'Email already in use' });
    }
    console.error('signup error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(req.tenantId, email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json(issueTokens(req.tenantId, user));
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// tenantId is embedded in the JWT so authenticate middleware can verify
// the token is being used against the correct tenant deployment
const issueTokens = (tenantId, user) => ({
  accessToken: jwt.sign(
    { sub: user.id, role: user.role, tid: tenantId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
  ),
  refreshToken: jwt.sign(
    { sub: user.id, tid: tenantId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' },
  ),
});

module.exports = { signup, login };
