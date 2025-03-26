import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function MyProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    sex: "",
    location: "",
    password: "", // for changing password
  });

  // Load user profile on mount
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/profile/${user.id}`)
      .then((res) => {
        const { name, email, dob, sex, location } = res.data;
        setForm({
          name: name || "",
          email: email || "",
          dob: dob ? dob.split("T")[0] : "",
          sex: sex || "",
          location: location || "",
          password: "",
        });
      })
      .catch(() => alert("Unable to load profile"));
  }, [user, navigate]);

  // Handle input field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Clean the form before sending (avoids sending _id or other unwanted fields)
const { name, email, dob, sex, location, password } = form;

const response = await axios.put(
  `http://localhost:5000/api/users/profile/${user.id}`,
  { name, email, dob, sex, location, password }
);


      const updatedUser = response.data.user;

      //  Update localStorage with latest info
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          dob: updatedUser.dob,
          sex: updatedUser.sex,
          location: updatedUser.location,
        })
      );

      alert("Profile updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <form onSubmit={handleSave}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="New Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          helperText="Leave blank if you don't want to change your password"
        />

        <TextField
          fullWidth
          label="Date of Birth"
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          fullWidth
          label="Sex"
          name="sex"
          value={form.sex}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          margin="normal"
        />

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default MyProfile;
