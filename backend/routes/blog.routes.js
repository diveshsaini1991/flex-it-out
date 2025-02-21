const express = require('express');
const router = express.Router();
const Blog = require('../models/blog.model.js');
const { authenticateToken} = require('../middleware/authentication.js');
const { createBlog, getAllBlogs, getUserBlogs, getBlog } = require('../controllers/blog.controller.js');

router.post('/', authenticateToken, createBlog);

router.get('/all', getAllBlogs );

router.get('/user/:userId', getUserBlogs);

router.get('/:id', getBlog);

module.exports = router;