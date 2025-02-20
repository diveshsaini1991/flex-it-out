const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true ,required :true},
  password: String,
  totalWorkouts: { type: Number, default: 0 },
  achievements: [String],
  points: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;