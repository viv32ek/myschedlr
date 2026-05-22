/**
 * Tenant resolution order:
 *  1. TENANT_ID env var (set per ECS deployment — preferred in prod)
 *  2. X-Tenant-ID request header (useful for local dev / testing)
 *  3. First subdomain label: acme.myschedlr.com → "acme"
 */
const resolveTenant = (req) => {
  if (process.env.TENANT_ID) return process.env.TENANT_ID;
  if (req.headers['x-tenant-id']) return req.headers['x-tenant-id'];
  const host = req.hostname ?? '';
  const sub = host.split('.')[0];
  return sub && sub !== 'localhost' ? sub : null;
};

const tenant = (req, res, next) => {
  const tenantId = resolveTenant(req);
  if (!tenantId) {
    return res.status(400).json({ message: 'Tenant could not be determined' });
  }
  // Basic safeguard: only alphanumeric + hyphens to prevent table name injection
  if (!/^[a-z0-9-]{1,63}$/i.test(tenantId)) {
    return res.status(400).json({ message: 'Invalid tenant identifier' });
  }
  req.tenantId = tenantId.toLowerCase();
  next();
};

module.exports = tenant;
