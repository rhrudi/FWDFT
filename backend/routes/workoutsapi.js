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
// GET workouts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE workout
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: "Workout not found" });

    // Ensure user owns the workout
    if (workout.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await workout.deleteOne();
    res.json({ message: "Workout removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT (Update) workout - Toggle completion
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: "Workout not found" });

    if (workout.user.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    workout.completed = !workout.completed;
    if (workout.completed) {
      workout.completedOn = new Date();
    } else {
      workout.completedOn = null;
    }

    await workout.save();
    res.json(workout);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
