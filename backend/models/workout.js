const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    required: true
  },
  reps: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedOn: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Workout", workoutSchema);
