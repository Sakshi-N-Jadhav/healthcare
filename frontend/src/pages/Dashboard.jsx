import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
