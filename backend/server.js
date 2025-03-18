const express = require("express");
const connectDB = require("./config/db"); // Import DB connection
const cors = require("cors");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Enables JSON parsing
app.use(cors()); // Enables cross-origin requests

// ✅ Register Authentication Routes Here
app.use("/api/auth", require("./routes/authRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send("Healthcare API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
