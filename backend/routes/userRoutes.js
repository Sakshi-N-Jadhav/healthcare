// sending a GET request to /api/users/doctors will return a list of doctors
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all doctors
router.get("/doctors", async (req, res) => {
    try {
      const doctors = await User.find({ role: "doctor" }).select("name email");
      res.json(doctors);
    } catch (error) {
      res.status(500).send("Server error");
    }
  });
  

module.exports = router;
