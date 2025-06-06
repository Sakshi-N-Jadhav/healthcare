// sending a GET request to /api/users/doctors will return a list of doctors
const express = require("express");
const User = require("../models/User");
const Appointment = require("../models/Appointment");


const router = express.Router();

// Get all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("name email specialization experience profileImage");
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
    const doctor = await User.findById(req.params.id).select("name email specialization experience role profileImage");

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

// GET doctor by ID
router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select("name email specialization experience role");
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).send("Error fetching doctor details");
  }
});

// GET user profile by ID (patient or doctor)
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// 🔹UPDATE user profile by ID (optional password)
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, email, dob, sex, location, password } = req.body;

    // ✅ Verify the ID in the URL matches the one in localStorage (sent by frontend)
    const userId = req.params.id;

    // Optional: Prevent updating _id field
    if (req.body._id && req.body._id !== userId) {
      return res.status(403).json({ msg: "Unauthorized profile update" });
    }

    // Prepare update fields
    const updates = { name, email, dob, sex, location };

    if (password) {
      const bcrypt = require("bcryptjs");
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select("-password");

    res.json({ msg: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).send("Profile update failed");
  }
});



// Add a new health problem note
router.post("/profile/:id/notes", async (req, res) => {
  try {
    const { note } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.healthNotes.push(note); // Add the new note
    await user.save();
    res.json({ msg: "Note added successfully", notes: user.healthNotes });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all health problem notes
router.get("/profile/:id/notes", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user.healthNotes);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Delete a specific note
router.delete("/profile/:id/notes/:noteIndex", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.healthNotes.splice(req.params.noteIndex, 1); // Remove the note
    await user.save();
    res.json({ msg: "Note deleted", notes: user.healthNotes });
  } catch (err) {
    res.status(500).send("Server error");
  }
});



module.exports = router;



