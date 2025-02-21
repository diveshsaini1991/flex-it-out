const express = require('express');
const { signup, login, checkAuthStatus, adminLogin, createAdmin, adminLogout, userLogout } = require('../controllers/auth.controller.js');
const { authenticateToken, isAdmin} = require('../middleware/authentication.js');

const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',authenticateToken, userLogout);
router.post('/admin/logout', authenticateToken ,isAdmin , adminLogout);
router.get('/status', checkAuthStatus);
router.post('/admin/login', adminLogin);
router.post('/createadmin', authenticateToken, isAdmin, createAdmin);



module.exports = router;