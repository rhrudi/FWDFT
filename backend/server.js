const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Load .env from the same directory as server.js
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve static frontend files from the parent directory
app.use(express.static(path.join(__dirname, "../")));

// Session & Passport
const session = require("express-session");
const passport = require("./config/passport");

app.use(session({
  secret: process.env.JWT_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/auth");
const workoutsRoutes = require("./routes/workoutsapi");
const dietRoutes = require("./routes/dietapi");

app.use("/api/diet", dietRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutsRoutes);

// Debug
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});