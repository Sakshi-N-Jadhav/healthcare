// sending a GET request to /api/users/doctors will return a list of doctors
const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");


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
  
// Get appointments by patient ID
router.get("/appointments/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .sort({ date: -1 }) // 🔥 Newest first
      .populate("doctorId", "name email"); // Include doctor info
    res.json(appointments);
  } catch (err) {
    res.status(500).send("Error fetching appointments");
  }
});


module.exports = router;



