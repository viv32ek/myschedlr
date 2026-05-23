const { getUserBySub, createUser } = require('../models/user');

const VALID_ROLES = new Set(['admin', 'faculty', 'student']);

const provision = async (req, res) => {
  const { name, email, roles } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'name and email are required' });
  }

  const parsedRoles = Array.isArray(roles) && roles.length > 0 ? roles : ['student'];
  const invalidRoles = parsedRoles.filter((r) => !VALID_ROLES.has(r));
  if (invalidRoles.length) {
    return res.status(400).json({ message: `Invalid roles: ${invalidRoles.join(', ')}` });
  }

  try {
    const existing = await getUserBySub(req.tenantId, req.cognitoSub);
    if (existing) {
      const { pk, sk, ...safe } = existing;
      return res.status(200).json(safe);
    }

    const user = await createUser(req.tenantId, {
      sub:   req.cognitoSub,
      email: email.toLowerCase(),
      name,
      roles: parsedRoles,
    });
    const { pk, sk, ...safe } = user;
    return res.status(201).json(safe);
  } catch (err) {
    // Race: another request provisioned the same user between our check and our put
    if (err.name === 'ConditionalCheckFailedException') {
      const existing = await getUserBySub(req.tenantId, req.cognitoSub);
      if (existing) {
        const { pk, sk, ...safe } = existing;
        return res.status(200).json(safe);
      }
    }
    console.error('provision error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { provision };
