const Blog = require("../models/blog.model.js");


const createBlog = async (req, res) => {
    try {
      const { title, content } = req.body;
      if(req.user.role !== "user"){
        return res.status(403).json({ error: "Access denied. Only users can create blogs." });
      }
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      
      const newBlog = new Blog({
        title,
        content,
        author: req.user.userId
      });
      
      const savedBlog = await newBlog.save();
      
      res.status(201).json({
        success: true,
        blog: savedBlog
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find()
        .populate('author', 'username email')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: blogs.length,
        blogs
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const getUserBlogs = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      const blogs = await Blog.find({ author: userId })
        .populate('author', 'username email')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: blogs.length,
        blogs
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


const getBlog = async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id)
        .populate('author', 'username email');
      
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      
      res.status(200).json({
        success: true,
        blog
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = { createBlog, getAllBlogs, getUserBlogs, getBlog };