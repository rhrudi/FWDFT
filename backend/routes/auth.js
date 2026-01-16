const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});



/* GOOGLE AUTH */
// 1. Auth with Google
router.get("/google", (req, res, next) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientID || !clientSecret || clientSecret === "PASTE_YOUR_SECRET_HERE") {
    return res.status(500).send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1>Google Login Not Configured</h1>
                <p>Ensure <b>backend/.env</b> exists and is loaded.</p>
                <p><b>Current Status:</b></p>
                <ul style="list-style: none;">
                    <li>Client ID: ${clientID ? "✅ Found" : "❌ Missing"}</li>
                    <li>Client Secret: ${clientSecret && clientSecret !== "PASTE_YOUR_SECRET_HERE" ? "✅ Found" : "❌ Missing/Placeholder"}</li>
                </ul>
                <p>Please restart the server after checking the file.</p>
                <p><a href="/login.html">Go Back</a></p>
            </div>
        `);
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// 2. Callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Redirect to Frontend with token
    // Now pointing to localhost:5000 since backend serves static files
    res.redirect(`http://localhost:5000/workouts.html?token=${token}`);
  }
);

module.exports = router;
