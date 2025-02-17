const express = require('express');
const router = express.Router();
const { getChallenges, joinChallenge } = require('../controllers/challenges.controller.js');
const authenticateToken = require('../middleware/authentication.js');

router.get('/', authenticateToken, getChallenges);
router.post('/join', authenticateToken, joinChallenge);

module.exports = router;
