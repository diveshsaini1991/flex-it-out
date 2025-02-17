const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const connectDB = require('./db/connection.js');
const User = require('./models/user.model.js');
const Workout = require('./models/workout.model.js');
const Challenge = require('./models/challenge.model.js');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));
app.use(express.json());

// MongoDB connection
connectDB();

// Auth Routes
app.use('/api/auth', require('./routes/auth.routes.js'));

// User Routes
app.use('/api/user', require('./routes/user.routes.js'));

// Workout Routes
app.use('/api/workouts', require('./routes/workout.routes.js'));

// Challenge Routes
app.use('/api/challenges', require('./routes/challenges.routes.js'));

// Leaderboard Route
app.use('/api/leaderboard', require('./routes/leaderboard.routes.js'));


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});