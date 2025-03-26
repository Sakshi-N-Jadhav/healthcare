const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },


  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },

  // fields for doctors
  specialization: {
    type: String,
    default: "",
  },

  experience: {
    type: String,
    default: "",
  },
    // fields for patients
    dob: {
      type: Date,
    },
    sex: {
      type: String,
      enum: ["Male", "Female", "Other", ""], // "" allows unset
      default: "",
    },
    location: {
      type: String,
      default: "",
    }
  
});

module.exports = mongoose.model("User", userSchema);
