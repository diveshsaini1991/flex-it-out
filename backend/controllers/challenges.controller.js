const Challenge = require("../models/challenge.model.js");

const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate("participants", "name");
    res.json(challenges);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createChallenge = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Only admins can create challenges." });
    }

    const { title, description, startDate, endDate, type, target } = req.body;
    const newChallenge = new Challenge({
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      type,
      target,
    });

    await newChallenge.save();
    res.json({ message: "Challenge created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const joinChallenge = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ error: "Access denied. Only users can join challenges." });
    }

    const { challengeId } = req.body;

    if (!challengeId) {
      return res.status(400).json({ error: "Challenge ID is required" });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    await Challenge.findByIdAndUpdate(challengeId, {
      $addToSet: { participants: req.user.userId },
    });

    res.json({ message: "Successfully joined challenge" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getChallenges,
  joinChallenge,
  createChallenge,
};
