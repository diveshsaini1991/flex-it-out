const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  type: String,
  target: Number
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;