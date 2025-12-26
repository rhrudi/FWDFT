const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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