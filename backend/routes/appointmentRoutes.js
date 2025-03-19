const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Create an appointment
router.post("/book", authMiddleware, async (req, res) => {
  const { doctorId, date } = req.body;

  try {
    const appointment = new Appointment({
      patientId: req.user.userId,
      doctorId,
      date
    });

    await appointment.save();
    res.json({ msg: "Appointment booked successfully!", appointment });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Get a user's appointments
router.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.userId }).populate("doctorId", "name");
    res.json(appointments);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
