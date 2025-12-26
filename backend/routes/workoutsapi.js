const express = require("express");
const Workout = require('../models/Workout');
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

/**
 * CREATE workout (protected)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, reps } = req.body;

    const workout = new Workout({
      user: req.userId,
      type,
      reps
    });

    await workout.save();
    res.json(workout);

  } catch (err) {
  console.error("Workout error:", err);
  res.status(500).json({ message: "Server error" });
}
});


/**
 * GET workouts for logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
