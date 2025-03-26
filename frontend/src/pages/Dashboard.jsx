import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/appointments/${user.id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments", err));
  }, [user, navigate]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      alert("Appointment cancelled");
      window.location.reload();
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  const handleReschedule = async () => {
    if (!newDate) return alert("Please select a new date and time.");
    try {
      await axios.put(`http://localhost:5000/api/appointments/${reschedulingId}`, {
        newDate,
      });
      alert("Appointment rescheduled");
      setReschedulingId(null);
      setNewDate("");
      window.location.reload();
    } catch (err) {
      alert("Reschedule failed");
    }
  };

  return (
    
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}
      </Typography>
      <Typography variant="subtitle1">Email: {user?.email}</Typography>
      <Typography variant="subtitle1" gutterBottom>
        Role: {user?.role}
      </Typography>
      {/* adding profile info section */}
      <Typography variant="subtitle1">
        Location: {user?.location || "Not provided"} </Typography>
      <Typography variant="subtitle1">
      Sex: {user?.sex || "Not specified"} </Typography>
      <Typography variant="subtitle1">
      Date of Birth: {user?.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Welcome to Dashboard</Typography>
        <LogoutButton />
      </Box>
      <Button
      variant="outlined"
      size="small"
      sx={{ mb: 3 }}
      onClick={() => navigate("/my-profile")}>
        My Profile
      </Button>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Upcoming Appointments</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/book-appointment")}>
          Book Appointment
        </Button>
        <Button
  variant="outlined"
  color="secondary"
  onClick={() => navigate("/doctors")}
  sx={{ ml: 2 }}
>
  View Doctors
</Button>
{/* <Button
  variant="outlined"
  color="success"
  onClick={() => navigate("/my-profile")}
>
  My Profile
</Button> */}


      </Box>

      <List>
        {appointments.length > 0 ? (
          appointments.map((appt) => (
            <ListItem key={appt._id} divider>
              <ListItemText
                primary={`Appointment with ${appt.doctorId.name} on ${new Date(appt.date).toLocaleString()}`}
                secondary={`Status: ${appt.status}`}
              />
              <Button
                size="small"
                color="error"
                onClick={() => handleCancel(appt._id)}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              {reschedulingId === appt._id ? (
                <>
                  <TextField
                    type="datetime-local"
                    size="small"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={handleReschedule}
                  >
                    Confirm
                  </Button>
                </>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setReschedulingId(appt._id);
                    setNewDate("");
                  }}
                >
                  Reschedule
                </Button>
              )}
            </ListItem>
          ))
        ) : (
          <Typography>No upcoming appointments.</Typography>
        )}
      </List>
      
    
    </Container>
    
  );
}


export default Dashboard;
