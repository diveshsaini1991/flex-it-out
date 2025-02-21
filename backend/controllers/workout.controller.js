const User = require("../models/user.model.js");
const Workout = require("../models/workout.model.js");

const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, skip = 0, type } = req.query;

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const workouts = await Workout.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Workout.countDocuments(query);

    const stats = await Workout.aggregate([
      { $match: { userId: require("mongoose").Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          totalCount: { $sum: "$count" },
          totalWorkouts: { $sum: 1 },
          avgCount: { $avg: "$count" },
          totalDuration: { $sum: "$duration" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        workouts,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Error getting workouts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const addWorkout = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ error: "Access denied. Only users can add workouts." });
    }

    const { type, count, duration } = req.body;
    const userId = req.user.userId;

    if (!type || !count || count <= 0 || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid workout details",
      });
    }

    let workout = await Workout.findOne({ userId, type });

    if (workout) {
      workout.count += count;
      workout.duration += duration;
    } else {
      workout = new Workout({
        userId,
        type,
        count,
        duration,
        timestamp: Date.now(),
      });
    }

    await workout.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    user.totalWorkouts += 1;

    let pointsEarned = 0;

    switch (type.toLowerCase()) {
      case "squat":
        pointsEarned = Math.floor(count * 1.5);
        break;
      case "pushup":
        pointsEarned = Math.floor(count * 1.2);
        break;
      case "situp":
        pointsEarned = Math.floor(count * 1.0);
        break;
      default:
        pointsEarned = count;
    }

    user.points += pointsEarned;


    await user.save();

    res.status(201).json({
      success: true,
      data: {
        workout,
        user: {
          totalWorkouts: user.totalWorkouts,
          points: user.points,
          achievements: user.achievements,
        },
        pointsEarned,
      },
    });
  } catch (error) {
    console.error("Error adding workout:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addWorkout,
  getWorkouts,
};
