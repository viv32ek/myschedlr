const { getUserBySub, updateUser, deleteUser, listUsers } = require('../models/user');
const {
  getGrantsForUser,
  putGrant,
  deleteGrant,
  VALID_PERMISSIONS,
  VALID_SCOPES,
} = require('../models/adminGrant');

const VALID_ROLES        = new Set(['admin', 'faculty', 'student']);
const VALID_ADMIN_TYPES  = new Set(['super_admin', 'tenancy_admin']);
const VALID_TENANCY_ACCESS = new Set(['core', 'billing']);

const safeUser  = ({ pk, sk, ...rest }) => rest;
const safeGrant = ({ pk, sk, ...rest }) => rest;

// ─── Self ─────────────────────────────────────────────────────────────────────

const getMe = (req, res) => res.json(safeUser(req.user));

const updateMe = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'name is required' });
  try {
    const updated = await updateUser(req.tenantId, req.user.email, { name });
    return res.json(safeUser(updated));
  } catch (err) {
    console.error('updateMe error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── Admin — user CRUD ────────────────────────────────────────────────────────

const listUsersHandler = async (req, res) => {
  try {
    const users = await listUsers(req.tenantId);
    return res.json(users.map(safeUser));
  } catch (err) {
    console.error('listUsers error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getUser = async (req, res) => {
  try {
    const target = await getUserBySub(req.tenantId, req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const isSelf     = req.user.id === req.params.userId;
    const isElevated = ['super_admin', 'tenancy_admin'].includes(req.user.adminType);
    if (!isSelf && !isElevated) return res.status(403).json({ message: 'Forbidden' });

    return res.json(safeUser(target));
  } catch (err) {
    console.error('getUser error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const target = await getUserBySub(req.tenantId, req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const isSelf         = req.user.id === req.params.userId;
    const isSuperAdmin   = req.user.adminType === 'super_admin';
    const isTenancyCore  = req.user.adminType === 'tenancy_admin' && req.user.tenancyAccess?.includes('core');

    const updates = {};

    if (req.body.name !== undefined) {
      if (!isSelf && !isSuperAdmin && !isTenancyCore) {
        return res.status(403).json({ message: 'Forbidden: cannot update name' });
      }
      updates.name = req.body.name;
    }

    if (req.body.roles !== undefined) {
      if (!isSuperAdmin && !isTenancyCore) {
        return res.status(403).json({ message: 'Forbidden: cannot update roles' });
      }
      const roles = req.body.roles;
      if (!Array.isArray(roles) || roles.length === 0 || roles.some((r) => !VALID_ROLES.has(r))) {
        return res.status(400).json({ message: 'roles must be a non-empty array of: admin, faculty, student' });
      }
      updates.roles = roles;
    }

    if (req.body.adminType !== undefined) {
      if (!isSuperAdmin) return res.status(403).json({ message: 'Forbidden: cannot update adminType' });
      const at = req.body.adminType;
      if (at !== null && !VALID_ADMIN_TYPES.has(at)) {
        return res.status(400).json({ message: 'adminType must be super_admin, tenancy_admin, or null' });
      }
      updates.adminType = at ?? null;
    }

    if (req.body.tenancyAccess !== undefined) {
      if (!isSuperAdmin) return res.status(403).json({ message: 'Forbidden: cannot update tenancyAccess' });
      const access = req.body.tenancyAccess;
      if (!Array.isArray(access) || access.some((a) => !VALID_TENANCY_ACCESS.has(a))) {
        return res.status(400).json({ message: 'tenancyAccess must be an array of: core, billing' });
      }
      updates.tenancyAccess = access;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const updated = await updateUser(req.tenantId, target.email, updates);
    return res.json(safeUser(updated));
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(404).json({ message: 'User not found' });
    }
    console.error('updateUser error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteUserHandler = async (req, res) => {
  try {
    const target = await getUserBySub(req.tenantId, req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    if (req.user.id === req.params.userId) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await deleteUser(req.tenantId, target.email);
    return res.status(204).send();
  } catch (err) {
    console.error('deleteUser error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// ─── Admin grants ─────────────────────────────────────────────────────────────

const listGrantsHandler = async (req, res) => {
  try {
    const target = await getUserBySub(req.tenantId, req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const isSelf     = req.user.id === req.params.userId;
    const isElevated = ['super_admin', 'tenancy_admin'].includes(req.user.adminType);
    if (!isSelf && !isElevated) return res.status(403).json({ message: 'Forbidden' });

    const grants = await getGrantsForUser(req.tenantId, target.email);
    return res.json(grants.map(safeGrant));
  } catch (err) {
    console.error('listGrants error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const putGrantHandler = async (req, res) => {
  try {
    const { scope, scopeId } = req.params;
    if (!VALID_SCOPES.includes(scope)) {
      return res.status(400).json({ message: `scope must be one of: ${VALID_SCOPES.join(', ')}` });
    }

    const target = await getUserBySub(req.tenantId, req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    const permissions = req.body.permissions ?? [];
    const invalid = permissions.filter((p) => !VALID_PERMISSIONS[scope].includes(p));
    if (invalid.length) {
      return res.status(400).json({
        message: `Invalid permissions for ${scope} scope: ${invalid.join(', ')}. Allowed: ${VALID_PERMISSIONS[scope].join(', ')}`,
      });
    }

    const grant = await putGrant(req.tenantId, target.email, {
      scope,
      scopeId,
      permissions,
      grantedBy: req.user.id,
    });
    return res.status(200).json(safeGrant(grant));
  } catch (err) {
    console.error('putGrant error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const removeGrantHandler = async (req, res) => {
  try {
    const { scope, scopeId } = req.params;
    const target = await getUserBySub(req.tenantId, req.params.userId);
    if (!target) return res.status(404).json({ message: 'User not found' });

    await deleteGrant(req.tenantId, target.email, scope, scopeId);
    return res.status(204).send();
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(404).json({ message: 'Grant not found' });
    }
    console.error('removeGrant error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getMe,
  updateMe,
  listUsers:   listUsersHandler,
  getUser,
  updateUser:  updateUserHandler,
  deleteUser:  deleteUserHandler,
  listGrants:  listGrantsHandler,
  putGrant:    putGrantHandler,
  removeGrant: removeGrantHandler,
};
