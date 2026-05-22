const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.userRole = payload.role;
    // Prevent a token issued for tenant A from being used on tenant B's deployment
    if (payload.tid && req.tenantId && payload.tid !== req.tenantId) {
      return res.status(403).json({ message: 'Token tenant mismatch' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
