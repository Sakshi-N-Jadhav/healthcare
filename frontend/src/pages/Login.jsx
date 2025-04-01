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

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);

      localStorage.setItem("user", JSON.stringify({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
      }));

      alert("Login successful!");

      if (res.data.user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed.");
    }
  };

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    if (newValue === 1) navigate("/register");
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #0D47A1, #1976D2)", // 💙 Blue gradient background
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
          Login Form
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mb: 3,
            "& .MuiTabs-indicator": {
              background: "#42A5F5", // Light blue
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
            label="Email"
            name="email"
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

          <Typography
            variant="body2"
            color="error"
            align="left"
            sx={{ mb: 2, mt: 1, cursor: "pointer" }}
          >
            Forgot password?
          </Typography>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: "#0D47A1",
              color: "#fff",
              fontWeight: "bold",
              paddingY: 1.2,
              mb: 2,
              border: "2px solid #00E676", // Green border like image
              "&:hover": {
                background: "#1565C0",
              },
            }}
          >
            Login
          </Button>
        </form>

        <Typography variant="body2">
          Not a member?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{
              color: "#1565C0",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Signup now
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;