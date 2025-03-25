const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const router = express.Router();

//  Get list of doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("name _id");
    res.json(doctors);
  } catch (error) {
    res.status(500).send("Failed to load doctors.");
  }
});

//  Book appointment
router.post("/book", async (req, res) => {
  const { patientId, doctorId, date } = req.body;

  try {
    const appointment = new Appointment({ patientId, doctorId, date });
    await appointment.save();
    res.status(201).json({ msg: "Appointment booked!", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).send("Booking failed");
  }
});

// Cancel Appointment
router.delete("/:appointmentId", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.appointmentId);
    res.json({ msg: "Appointment cancelled" });
  } catch (err) {
    res.status(500).send("Cancel failed");
  }
});

//  Reschedule Appointment
router.put("/:appointmentId", async (req, res) => {
  const { newDate } = req.body;
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { date: newDate, status: "Pending" },
      { new: true }
    );
    res.json({ msg: "Appointment rescheduled", updated });
  } catch (err) {
    res.status(500).send("Reschedule failed");
  }
});


module.exports = router;
