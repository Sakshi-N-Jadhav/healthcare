// patients can book appointments from the frontend.
import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";

function BookAppointment() {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/appointments/book", 
        { doctorId, date },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.msg);
    } catch (error) {
      alert("Error booking appointment");
    }
  };

  return (
    <Container>
      <Typography variant="h4">Book an Appointment</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Doctor ID" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required />
        <TextField fullWidth margin="normal" label="Date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        <Button type="submit" variant="contained" color="primary">Book Appointment</Button>
      </form>
    </Container>
  );
}

export default BookAppointment;
