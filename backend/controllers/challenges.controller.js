const Challenge = require("../models/challenge.model.js");


const getChallenges = async (req, res) => {
    try {
      const challenges = await Challenge.find()
        .populate('participants', 'name');
      res.json(challenges);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const joinChallenge = async (req, res) => {
    try {
      const { challengeId } = req.body;
      await Challenge.findByIdAndUpdate(challengeId, {
        $addToSet: { participants: req.user.userId }
      });
      res.json({ message: 'Successfully joined challenge' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

module.exports = {
    getChallenges,
    joinChallenge
  };