const User = require("../models/user.model.js");
const Workout = require("../models/workout.model.js");


// const addWorkout = async (req, res) => {
//     try {
//         const { type, count, duration } = req.body;
//         const workout = new Workout({
//             userId: req.user.userId,
//             type,
//             count,
//             duration
//         });

//         await workout.save();

//         // Update user stats
//         await User.findByIdAndUpdate(req.user.userId, {
//             $inc: {
//                 totalWorkouts: 1,
//                 points: Math.floor(duration * 0.5 + count)  // Simple points calculation
//             }
//         });

//         res.status(201).json(workout);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };

// const getWorkouts = async (req, res) => {
//     try {
//         const workouts = await Workout.find({ userId: req.user.userId })
//             .sort({ timestamp: -1 });
//         res.json(workouts);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// };


// controllers/workout.controller.js
 

/**
 * Add a new workout and update user stats
 * @route POST /api/workouts
 * @access Private
 */
// const addWorkout = async (req, res) => {
//   try {
//     const { type, count, duration } = req.body;
//     const userId = req.user.id; // From auth middleware

//     if (!type || !count || count <= 0 || !duration) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Please provide valid workout details' 
//       });
//     }

//     // Create new workout record
//     const workout = new Workout({
//       userId,
//       type,
//       count,
//       duration,
//       timestamp: Date.now()
//     });

//     await workout.save();

//     // Update user stats
//     const user = await User.findById(userId);
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Increment total workouts
//     user.totalWorkouts += 1;
    
//     // Add points based on workout type and count
//     let pointsEarned = 0;
    
//     switch (type.toLowerCase()) {
//       case 'squat':
//         pointsEarned = Math.floor(count * 1.5);
//         break;
//       case 'pushup':
//         pointsEarned = Math.floor(count * 1.2);
//         break;
//       case 'situp':
//         pointsEarned = Math.floor(count * 1.0);
//         break;
//       default:
//         pointsEarned = count;
//     }
    
//     user.points += pointsEarned;
    
//     // Check if user earned new achievements
//     checkAndAddAchievements(user, type, count);
    
//     await user.save();
    
//     res.status(201).json({
//       success: true,
//       data: {
//         workout,
//         user: {
//           totalWorkouts: user.totalWorkouts,
//           points: user.points,
//           achievements: user.achievements
//         },
//         pointsEarned
//       }
//     });
    
//   } catch (error) {
//     console.error('Error adding workout:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// };

/**
 * Get user workout history
 * @route GET /api/workouts
 * @access Private
 */
const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { limit = 10, skip = 0, type } = req.query;
    
    // Build query
    const query = { userId };
    if (type) {
      query.type = type;
    }
    
    // Get workouts with pagination
    const workouts = await Workout.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
      
    // Get count for pagination
    const total = await Workout.countDocuments(query);
    
    // Get aggregated stats
    const stats = await Workout.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: {
          _id: '$type',
          totalCount: { $sum: '$count' },
          totalWorkouts: { $sum: 1 },
          avgCount: { $avg: '$count' },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        workouts,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip)
        },
        stats
      }
    });
    
  } catch (error) {
    console.error('Error getting workouts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Helper function to check for and add achievements
 */
const checkAndAddAchievements = (user, type, count) => {
  // Get existing achievements
  const achievements = new Set(user.achievements);
  
  // Define possible achievements
  const possibleAchievements = {
    // General achievements
    firstWorkout: {
      check: () => user.totalWorkouts === 0,
      title: "First Workout"
    },
    tenWorkouts: {
      check: () => user.totalWorkouts === 9, // Will be 10 after increment
      title: "Dedicated Athlete: 10 Workouts"
    },
    fiftyWorkouts: {
      check: () => user.totalWorkouts === 49, // Will be 50 after increment
      title: "Fitness Enthusiast: 50 Workouts"
    },
    
    // Squat achievements
    squat10: {
      check: () => type === 'squat' && count >= 10,
      title: "Squat Beginner"
    },
    squat25: {
      check: () => type === 'squat' && count >= 25,
      title: "Squat Intermediate"
    },
    squat50: {
      check: () => type === 'squat' && count >= 50,
      title: "Squat Master"
    },
    squat100: {
      check: () => type === 'squat' && count >= 100,
      title: "Squat Champion"
    },
    
    // Points achievements
    points100: {
      check: () => user.points < 100 && user.points + (count * 1.5) >= 100,
      title: "Point Collector: 100 Points"
    },
    points500: {
      check: () => user.points < 500 && user.points + (count * 1.5) >= 500,
      title: "Point Hoarder: 500 Points"
    },
    points1000: {
      check: () => user.points < 1000 && user.points + (count * 1.5) >= 1000,
      title: "Point Master: 1000 Points"
    }
  };
  
  // Check each achievement and add if condition is met
  Object.entries(possibleAchievements).forEach(([key, achievement]) => {
    if (achievement.check() && !achievements.has(achievement.title)) {
      achievements.add(achievement.title);
    }
  });
  
  // Update user's achievements
  user.achievements = [...achievements];
};




const addWorkout = async (req, res) => {
    try {
      const { type, count, duration } = req.body;
      const userId = req.user.userId; // From auth middleware
  console.log("api hit add workout ")
      if (!type || !count || count <= 0 || !duration) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide valid workout details' 
        });
      }
      
      
  
      // Check if a workout document of the same type already exists for the user
      let workout = await Workout.findOne({ userId, type });
  
      if (workout) {
        // If it exists, increment the count and update the duration
        workout.count += count;
        workout.duration += duration;
      } else {
        // If it doesn't exist, create a new workout document
        workout = new Workout({
          userId,
          type,
          count,
          duration,
          timestamp: Date.now()
        });
      }
  
      await workout.save();
  
      // Update user stats
      console.log(userId)
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      // Increment total workouts
      user.totalWorkouts += 1;
      
      // Add points based on workout type and count
      let pointsEarned = 0;
      
      switch (type.toLowerCase()) {
        case 'squat':
          pointsEarned = Math.floor(count * 1.5);
          break;
        case 'pushup':
          pointsEarned = Math.floor(count * 1.2);
          break;
        case 'situp':
          pointsEarned = Math.floor(count * 1.0);
          break;
        default:
          pointsEarned = count;
      }
      
      user.points += pointsEarned;
      
      // Check if user earned new achievements
      checkAndAddAchievements(user, type, count);
      
      await user.save();
      
      res.status(201).json({
        success: true,
        data: {
          workout,
          user: {
            totalWorkouts: user.totalWorkouts,
            points: user.points,
            achievements: user.achievements
          },
          pointsEarned
        }
      });
      
    } catch (error) {
      console.error('Error adding workout:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };

module.exports = {
  addWorkout,
  getWorkouts
};

module.exports = {
    addWorkout,
    getWorkouts
};