const express = require("express");
const connectDB = require("./config/db"); // Import DB connection
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");

require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Enables JSON parsing
app.use(cors()); // Enables cross-origin requests

// ✅ Register Authentication Routes Here
app.use("/api/auth", require("./routes/authRoutes"));

//✅ Now, patients can book appointments via API.
app.use("/api/appointments", require("./routes/appointmentRoutes"));


// Default route
app.get("/", (req, res) => {
  res.send("Healthcare API is running...");
});

// Protected Route: Only accessible if logged in
app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
      msg: "Welcome to your profile",
      user: req.user, // Contains userId and role from the token
    });
  });
  



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
