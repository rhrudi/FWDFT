const mongoose = require('mongoose');

const WorkoutDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  workoutName: String,
  duration: Number,
  caloriesBurned: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutData', WorkoutDataSchema);
