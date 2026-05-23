/** Returns 404 if req.user is null (profile not provisioned yet). */
const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({
      message: 'User profile not found. Call POST /auth/provision first.',
    });
  }
  next();
};

/** Requires super_admin adminType. */
const requireSuperAdmin = (req, res, next) => {
  if (req.user?.adminType !== 'super_admin') {
    return res.status(403).json({ message: 'Forbidden: super admin required' });
  }
  next();
};

/**
 * Requires the caller to be either a super_admin or a tenancy_admin
 * with access to the specified module ('core' or 'billing').
 */
const requireTenancyAdmin = (module) => (req, res, next) => {
  const { adminType, tenancyAccess } = req.user ?? {};
  if (adminType === 'super_admin') return next();
  if (adminType === 'tenancy_admin' && tenancyAccess?.includes(module)) return next();
  return res.status(403).json({ message: `Forbidden: tenancy ${module} admin required` });
};

/** Requires any elevated admin (super_admin or tenancy_admin). */
const requireElevatedAdmin = (req, res, next) => {
  const { adminType } = req.user ?? {};
  if (adminType === 'super_admin' || adminType === 'tenancy_admin') return next();
  return res.status(403).json({ message: 'Forbidden: admin access required' });
};

module.exports = { requireUser, requireSuperAdmin, requireTenancyAdmin, requireElevatedAdmin };
