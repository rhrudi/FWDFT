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
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Workout", workoutSchema);
