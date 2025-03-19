// Now, when a user clicks "Logout", the JWT token is removed, and they are redirected to the login page.
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container>
      <Typography variant="h4">Welcome to the Dashboard</Typography>
      <Button onClick={handleLogout} variant="contained" color="secondary">
        Logout
      </Button>
    </Container>
  );
}

export default Dashboard;
