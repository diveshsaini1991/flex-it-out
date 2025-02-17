const express = require('express');
const authenticateToken = require('../middleware/authentication.js');
const { getProfile, updateProfile } = require('../controllers/user.controller.js');
const router = express.Router();


router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;