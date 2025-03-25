// sending a GET request to /api/users/doctors will return a list of doctors
const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");


const router = express.Router();

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("name email specialization experience");
    res.json(doctors);
  } catch (err) {
    res.status(500).send("Failed to fetch doctors");
  }
});
  
// Get appointments by patient ID
router.get("/appointments/:patientId", async (req, res) => {
  try {
    const now = new Date();
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
      date: { $gte: now }, // Only future dates
    })
      .sort({ date: 1 }) // Oldest upcoming first
      .populate("doctorId", "name email");

    res.json(appointments);
  } catch (err) {
    res.status(500).send("Error fetching appointments");
  }
});

// GET a specific doctor by ID
router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select("name email specialization experience role");

    // Ensure the user is actually a doctor
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching doctor details");
  }
});


module.exports = router;



