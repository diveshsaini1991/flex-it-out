const express = require('express');
const {authenticateToken} = require('../middleware/authentication.js');
const { getLeaderboard } = require('../controllers/leaderboard.controller.js');
const router = express.Router();

router.get('/', authenticateToken, getLeaderboard);

module.exports = router;