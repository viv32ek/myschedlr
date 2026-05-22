const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory store — replace with a real DB
const users = [];

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already in use' });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = { id: crypto.randomUUID(), email, name, role: 'user', passwordHash: hash, createdAt: new Date().toISOString() };
  users.push(user);
  return res.status(201).json(issueTokens(user));
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json(issueTokens(user));
};

const issueTokens = (user) => ({
  accessToken: jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }),
  refreshToken: jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }),
});

module.exports = { signup, login, users };
