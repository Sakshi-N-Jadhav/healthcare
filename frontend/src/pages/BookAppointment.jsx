import { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/appointments/book",
        { doctorId: selectedDoctor, date },
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
        {/* Dropdown to Select Doctor */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Doctor</InputLabel>
          <Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
            {doctors.map((doctor) => (
              <MenuItem key={doctor._id} value={doctor._id}>
                {doctor.name} ({doctor.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Input */}
        <TextField fullWidth margin="normal" label="Date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
        
        <Button type="submit" variant="contained" color="primary">
          Book Appointment
        </Button>
      </form>
    </Container>
  );
}

export default BookAppointment;
