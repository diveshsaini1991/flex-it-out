const express = require('express');
const { signup, login, logout, checkAuthStatus } = require('../controllers/auth.controller.js');

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',logout);
router.get('/status', checkAuthStatus);


module.exports = router;