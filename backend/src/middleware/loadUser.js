const { getUserBySub } = require('../models/user');

/**
 * Resolves req.cognitoSub → DynamoDB user profile and attaches it as req.user.
 * Sets req.user = null if no profile exists (e.g. before provision).
 * Always calls next() — use requireUser middleware to gate on profile existence.
 */
const loadUser = async (req, res, next) => {
  try {
    req.user = await getUserBySub(req.tenantId, req.cognitoSub);
    next();
  } catch (err) {
    console.error('loadUser error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = loadUser;
