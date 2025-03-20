const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Appointment = require("../models/Appointment");

const router = express.Router();

// Get appointments based on user role
router.get("/my-appointments", authMiddleware, async (req, res) => {
  try {
    let appointments;
    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patientId: req.user.userId }).populate("doctorId", "name");
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctorId: req.user.userId }).populate("patientId", "name");
    }
    res.json(appointments);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Create an appointment
router.post("/book", authMiddleware, async (req, res) => {
  const { doctorId, date } = req.body;

  try {
    const appointment = new Appointment({
      patientId: req.user.userId,
      doctorId,
      date,
    });

    await appointment.save();
    res.json({ msg: "Appointment booked successfully!", appointment });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Update appointment status (Doctors only)
router.put("/update-status/:id", authMiddleware, async (req, res) => {
  const { status } = req.body;

  if (req.user.role !== "doctor") {
    return res.status(403).json({ msg: "Only doctors can update appointments" });
  }

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ msg: "Appointment not found" });

    appointment.status = status;
    await appointment.save();

    res.json({ msg: "Appointment status updated successfully" });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
