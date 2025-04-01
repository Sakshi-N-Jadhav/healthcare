import React from "react";
import { AppBar, Toolbar, Box, Typography, Button, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

// Navigation bar component
const Navbar = () => (
  <AppBar position="static" style={{ backgroundColor: "#004e7c" }}>
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1 }}>Healthcare Portal</Typography>
      <Stack direction="row" spacing={4}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
        <Link to="#" style={{ color: "#fff", textDecoration: "none" }}>About Us</Link>
        <Link to="#" style={{ color: "#fff", textDecoration: "none" }}>Services</Link>
        <Link to="#" style={{ color: "#fff", textDecoration: "none" }}>Contact</Link>
        <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</Link>
      </Stack>
    </Toolbar>
  </AppBar>
);

// Hero section with welcome message and login/register button
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 64px)",
      }}
    >
      {/* Left Side Background Image */}
      <Box
        sx={{
          backgroundImage: "url('/public/doctors-image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "73%",
          height: "100%",
        }}
      />

      {/* Right Side Welcome Text and Button */}
      <Box
        sx={{
          width: "35%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h3" gutterBottom>Welcome to the Healthcare Portal</Typography>
        <Typography variant="body1" gutterBottom>Your trusted healthcare companion.</Typography>

        <Button
          variant="contained"
          style={{ backgroundColor: "#0097a7", color: "#fff", marginTop: "10px" }}
          onClick={() => navigate("/login")}
        >
          Login / Register
        </Button>
      </Box>
    </Box>
  );
};

// Main Home page component
const Home = () => (
  <>
    <Navbar />
    <HeroSection />
  </>
);

export default Home;
