const express = require('express');
const Workout = require('../models/workoutsdata');

const router = express.Router();

router.post('/add', async (req, res) => {
  const workout = new Workout(req.body);
  await workout.save();
  res.json({ message: 'Workout added' });
});

router.get('/:userId', async (req, res) => {
  const workouts = await Workout.find({ userId: req.params.userId });
  res.json(workouts);
});

module.exports = router;
