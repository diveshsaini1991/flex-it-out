const Challenge = require("../models/challenge.model.js");

 

const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const newChallenges = await Challenge.find({
      participants: { $nin: [userId] },
      completedBy: { $nin: [userId] }
    });
    
    const attemptedChallenges = await Challenge.find({
      participants: { $in: [userId] },
      completedBy: { $nin: [userId] }
    });
    
    const completedChallenges = await Challenge.find({
      completedBy: { $in: [userId] }
    });
    
    res.status(200).json({
      new: newChallenges,
      attempted: attemptedChallenges,
      completed: completedChallenges
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user challenges', error: err.message });
  }
};


   
 const createChallenge = async (req, res) => {
  try {
    const { title, description, type, target, endDate } = req.body;
    
    const challenge = new Challenge({
      title,
      description,
      type,
      target,
      endDate,
      
      participants: [],
      completedBy: []
    });
    
    await challenge.save();
    res.status(201).json({ message: 'Challenge created successfully', challenge });
  } catch (err) {
    res.status(500).json({ message: 'Error creating challenge', error: err.message });
  }
};

 

const joinChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    if (challenge.participants.includes(userId) || challenge.completedBy.includes(userId)) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }
    
    challenge.participants.push(userId);
    await challenge.save();
    
    res.status(200).json({ message: 'Successfully joined challenge' });
  } catch (err) {
    res.status(500).json({ message: 'Error joining challenge', error: err.message });
  }
};


const completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user._id;
    console.log("completed hit");
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
 
    challenge.participants = challenge.participants.filter(
      participant => participant.toString() !== userId.toString()
    );
    
 
    if (!challenge.completedBy.includes(userId)) {
      challenge.completedBy.push(userId);
 
      const user = await User.findById(userId);
      user.achievements.push(`Completed ${challenge.title} challenge`);
      user.points += 50;  
      
      await user.save();
    }
    
    await challenge.save();
    
    res.status(200).json({ message: 'Challenge completed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error completing challenge', error: err.message });
  }
};
module.exports = {
  getUserChallenges,
  joinChallenge,
  createChallenge,
  completeChallenge
};
