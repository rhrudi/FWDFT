const express = require('express');
const Progress = require('../models/progressdata');

const router = express.Router();

router.post('/add', async (req, res) => {
  const progress = new Progress(req.body);
  await progress.save();
  res.json({ message: 'Progress saved' });
});

router.get('/:userId', async (req, res) => {
  const progress = await Progress.find({ userId: req.params.userId });
  res.json(progress);
});

module.exports = router;
