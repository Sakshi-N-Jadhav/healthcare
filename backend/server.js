const express = require("express");
const connectDB = require("./config/db"); // Import DB connection
const cors = require("cors");
const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");

require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Enables JSON parsing
app.use(cors()); // Enables cross-origin requests

//  Register Authentication Routes Here
app.use("/api/auth", require("./routes/authRoutes"));

// patients can book appointments via API.
app.use("/api/appointments", require("./routes/appointmentRoutes"));

//the doctors list is accessible in the backend!
app.use("/api/users", require("./routes/userRoutes"));






// Default route
app.get("/", (req, res) => {
  res.send("Healthcare API is running...");
});

// Protected Route: Only accessible if logged in
// app.get("/api/profile", authMiddleware, (req, res) => {
//     res.json({
//       msg: "Welcome to your profile",
//       user: req.user, // Contains userId and role from the token
//     });
//   });
  
  //The frontend can fetch user details from /api/user.
  // app.get("/api/user", authMiddleware, async (req, res) => {
  //   try {
  //     const user = await User.findById(req.user.userId).select("-password");
  //     res.json(user);
  //   } catch (error) {
  //     res.status(500).send("Server error");
  //   }
  // });



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
