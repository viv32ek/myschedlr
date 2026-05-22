const { getUserById } = require('../models/user');

const getMe = async (req, res) => {
  const user = await getUserById(req.tenantId, req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { passwordHash, pk, sk, ...safe } = user;
  return res.json(safe);
};

module.exports = { getMe };
