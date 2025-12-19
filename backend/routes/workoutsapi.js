const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 Protected route
router.get("/", authMiddleware, async (req, res) => {
  const workouts = await Workout.find({ userId: req.userId });
  res.json(workouts);
});

// 🔐 Add new workout
router.post("/", authMiddleware, async (req, res) => {
  const { type, reps } = req.body;

  const workout = new Workout({
    userId: req.userId,
    type,
    reps
  });

  await workout.save();
  res.json({ message: "Workout saved" });
});

module.exports = router;
