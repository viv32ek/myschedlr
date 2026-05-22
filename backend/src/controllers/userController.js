const { users } = require('./authController');

const getMe = (req, res) => {
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { passwordHash, ...safe } = user;
  return res.json(safe);
};

module.exports = { getMe };
