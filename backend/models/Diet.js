const mongoose = require("mongoose");

const dietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Diet", dietSchema);
