const User = require("../models/user.model.js");



const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const updateProfile = async (req, res) => {
    try {
      const { name } = req.body;
      await User.findByIdAndUpdate(req.user.userId, { name });
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

module.exports = {
    getProfile,
    updateProfile
    };