const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { provision } = require('../controllers/authController');

// authenticate only — no loadUser because the profile doesn't exist yet at provision time
router.post('/provision', authenticate, provision);

module.exports = router;
