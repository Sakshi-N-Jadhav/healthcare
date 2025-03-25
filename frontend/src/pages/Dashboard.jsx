import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Button, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios.get(`http://localhost:5000/api/users/appointments/${user.id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error loading appointments:", err));
  }, [user, navigate]);

  return (
    <Container maxWidth="md" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>Welcome, {user?.name}</Typography>
      <Typography variant="subtitle1" gutterBottom>Email: {user?.email}</Typography>
      <Typography variant="subtitle1" gutterBottom>Role: {user?.role}</Typography>

      <Divider sx={{ my: 4 }} />

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/book-appointment")}
        sx={{ mb: 4 }}
      >
        Book an Appointment
      </Button>

      <Typography variant="h5" gutterBottom>Your Appointments</Typography>
      <List>
  {appointments.length > 0 ? (
    appointments.map((appt) => (
      <ListItem key={appt._id}>
        <ListItemText
          primary={`Appointment with ${appt.doctorId.name} on ${new Date(appt.date).toLocaleString()}`}
          secondary={`Status: ${appt.status}`}
        />
      </ListItem>
    ))
  ) : (
    <Typography>No appointments yet.</Typography>
  )}
</List>
    </Container>
  );
}

export default Dashboard;
