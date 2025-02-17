const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  type: String,
  count: Number,
  duration: Number,
  timestamp: { type: Date, default: Date.now }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;