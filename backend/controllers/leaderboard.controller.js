const User = require("../models/user.model.js");



const getLeaderboard = async (req, res) => {
    try {
      
      const leaders = await User.find()
        .select('name points totalWorkouts')
        .sort({ points: -1 })
        .limit(10);
      res.json(leaders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };


module.exports = {
    getLeaderboard
    };