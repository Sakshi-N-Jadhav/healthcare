import { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Button, Container, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";



function BookAppointment() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedDoctor = queryParams.get("doctorId");

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: preselectedDoctor || "",
    date: "",
  });
  
  const navigate = useNavigate();
  

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios.get("http://localhost:5000/api/appointments/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Failed to load doctors:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/appointments/book", {
        patientId: user.id,
        doctorId: form.doctorId,
        date: form.date,
      });

      alert("Appointment booked!");
      navigate("/dashboard");
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Book Appointment</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Select Doctor"
          name="doctorId"
          fullWidth
          margin="normal"
          value={form.doctorId}
          onChange={handleChange}
          required
        >
          {doctors.map(doc => (
            <MenuItem key={doc._id} value={doc._id}>{doc.name}</MenuItem>
          ))}
        </TextField>

        <TextField
          type="datetime-local"
          name="date"
          label="Appointment Date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Book Appointment
        </Button>
      </form>
    </Container>
  );
}

export default BookAppointment;
