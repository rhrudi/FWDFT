const express = require("express");
const Diet = require("../models/Diet");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* Add meal */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const meal = new Diet({
      user: req.userId,
      ...req.body
    });
    await meal.save();
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* Get today's meals */
router.get("/", authMiddleware, async (req, res) => {
  const today = new Date().setHours(0,0,0,0);

  const meals = await Diet.find({
    user: req.userId,
    date: { $gte: today }
  });

  res.json(meals);
});

/* Delete meal */
router.delete("/:id", authMiddleware, async (req, res) => {
  await Diet.findByIdAndDelete(req.params.id);
  res.json({ message: "Meal deleted" });
});

module.exports = router;
