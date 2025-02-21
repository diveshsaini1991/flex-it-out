const express = require('express');
const { addWorkout, getWorkouts } = require('../controllers/workout.controller');
const {authenticateToken} = require('../middleware/authentication');
const router = express.Router();

router.post('/addworkout', authenticateToken, addWorkout);
router.get('/', authenticateToken, getWorkouts);

module.exports = router;
