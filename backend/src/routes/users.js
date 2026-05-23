const express = require('express');
const router = express.Router();
const authenticate   = require('../middleware/authenticate');
const loadUser       = require('../middleware/loadUser');
const { requireUser, requireSuperAdmin, requireTenancyAdmin, requireElevatedAdmin } = require('../middleware/authorize');
const {
  getMe, updateMe,
  listUsers, getUser, updateUser, deleteUser,
  listGrants, putGrant, removeGrant,
} = require('../controllers/userController');

// Middleware chains
const authLoad       = [authenticate, loadUser];
const withUser       = [...authLoad, requireUser];
const elevatedAdmin  = [...withUser, requireElevatedAdmin];
const superAdmin     = [...withUser, requireSuperAdmin];
const tenancyCore    = [...withUser, requireTenancyAdmin('core')];

// ─── Self ──────────────────────────────────────────────────────────────────
router.get('/me',    ...withUser, getMe);
router.patch('/me',  ...withUser, updateMe);

// ─── User management (admin) ───────────────────────────────────────────────
router.get('/',           ...elevatedAdmin, listUsers);
router.get('/:userId',    ...withUser,      getUser);       // self or elevated admin
router.patch('/:userId',  ...withUser,      updateUser);    // per-field permission checks inside
router.delete('/:userId', ...superAdmin,    deleteUser);

// ─── Delegated scope grants ────────────────────────────────────────────────
router.get('/:userId/grants',                        ...withUser,    listGrants);  // self or elevated admin
router.put('/:userId/grants/:scope/:scopeId',        ...tenancyCore, putGrant);
router.delete('/:userId/grants/:scope/:scopeId',     ...tenancyCore, removeGrant);

module.exports = router;
