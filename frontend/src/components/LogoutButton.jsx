import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user session
    navigate("/login"); // Redirect to login page
  };

  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
