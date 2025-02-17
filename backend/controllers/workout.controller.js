const User = require("../models/user.model.js");
const Workout = require("../models/workout.model.js");


const addWorkout = async (req, res) => {
    try {
        const { type, count, duration } = req.body;
        const workout = new Workout({
            userId: req.user.userId,
            type,
            count,
            duration
        });

        await workout.save();

        // Update user stats
        await User.findByIdAndUpdate(req.user.userId, {
            $inc: {
                totalWorkouts: 1,
                points: Math.floor(duration * 0.5 + count)  // Simple points calculation
            }
        });

        res.status(201).json(workout);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.userId })
            .sort({ timestamp: -1 });
        res.json(workouts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addWorkout,
    getWorkouts
};