const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());

connectDB();

app.use('/api/auth', require('./routes/auth.routes.js'));

app.use('/api/user', require('./routes/user.routes.js'));

app.use('/api/workouts', require('./routes/workout.routes.js'));

app.use('/api/challenges', require('./routes/challenges.routes.js'));

app.use('/api/leaderboard', require('./routes/leaderboard.routes.js'));

app.use('/api/blog', require('./routes/blog.routes.js'));


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});