const { getOrCreateUser } = require('../models/user');

const getMe = async (req, res) => {
  try {
    const user = await getOrCreateUser(req.tenantId, {
      sub: req.userId,
      role: req.userRole,
    });
    const { pk, sk, ...safe } = user;
    return res.json(safe);
  } catch (err) {
    console.error('getMe error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getMe };
