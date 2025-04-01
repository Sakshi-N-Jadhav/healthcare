import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [tab, setTab] = useState(1); // Start on Signup tab
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed.");
    }
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    if (newValue === 0) navigate("/login");
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #0D47A1, #1976D2)", // 🔵 Blue gradient background
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 3,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Register
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              background: "#42A5F5", // Light blue underline
              height: 3,
            },
            "& .Mui-selected": {
              backgroundColor: "#1565C0",
              color: "#fff !important",
              borderRadius: 1,
            },
            "& button": {
              fontWeight: "bold",
              color: "#000",
              border: "1px solid #ccc",
            },
          }}
        >
          <Tab label="Login" />
          <Tab label="Signup" />
        </Tabs>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: "#0D47A1",
              color: "#fff",
              fontWeight: "bold",
              paddingY: 1.2,
              mt: 2,
              mb: 2,
              border: "2px solid #00E676", // green border
              "&:hover": {
                background: "#1565C0",
              },
            }}
          >
            Register
          </Button>
        </form>

        <Typography variant="body2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#1565C0",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Login now
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;

