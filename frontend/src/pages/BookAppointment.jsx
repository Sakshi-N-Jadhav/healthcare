import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  MenuItem,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

function BookAppointment() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedDoctor = queryParams.get("doctorId");

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    doctorId: preselectedDoctor || "",
    date: "",
  });
  const [notes, setNotes] = useState("");
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
        notes: notes
      });

      alert("Appointment booked!");
      navigate("/dashboard");
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #2196F3, #21CBF3)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper elevation={8} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Book Appointment
        </Typography>
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

          <TextField
            fullWidth
            label="Health Problem Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            margin="normal"
            multiline
            rows={4}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              background: "#1565C0",
              fontWeight: "bold",
              color: "#fff",
              '&:hover': { background: "#0D47A1" }
            }}
          >
            Book Appointment
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default BookAppointment;
