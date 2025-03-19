import { useEffect, useState } from "react";
import { Container, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Fetch user details & appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch user details
        const userResponse = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        // Fetch user-specific appointments
        const appointmentsResponse = await axios.get("http://localhost:5000/api/appointments/my-appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Function for doctors to approve/reject appointments
  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/appointments/update-status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment updated!");
      window.location.reload();
    } catch (error) {
      alert("Error updating appointment");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      {user && (
        <>
          <Typography variant="h6">Welcome, {user.name} ({user.role})</Typography>
          <Typography variant="body1">Email: {user.email}</Typography>
        </>
      )}

      <Typography variant="h5" gutterBottom>Appointments</Typography>
      {appointments.length > 0 ? (
        <List>
          {appointments.map((appt) => (
            <ListItem key={appt._id} divider>
              <ListItemText
                primary={
                  user.role === "patient"
                    ? `Doctor: ${appt.doctorId.name} | Date: ${new Date(appt.date).toLocaleString()}`
                    : `Patient: ${appt.patientId.name} | Date: ${new Date(appt.date).toLocaleString()} | Status: ${appt.status}`
                }
              />
              {user.role === "doctor" && appt.status === "Pending" && (
                <>
                  <Button onClick={() => handleUpdateStatus(appt._id, "Confirmed")} color="primary">
                    Approve
                  </Button>
                  <Button onClick={() => handleUpdateStatus(appt._id, "Cancelled")} color="error">
                    Reject
                  </Button>
                </>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No appointments found.</Typography>
      )}

      <Button onClick={handleLogout} variant="contained" color="secondary" style={{ marginTop: "20px" }}>
        Logout
      </Button>
    </Container>
  );
}

export default Dashboard;
