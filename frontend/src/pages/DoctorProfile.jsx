import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Button, Box } from "@mui/material";

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/doctors/${id}`)
      .then((res) => setDoctor(res.data))
      .catch(() => alert("Doctor not found"));
  }, [id]);

  if (!doctor) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>{doctor.name}</Typography>
      <Typography variant="subtitle1" color="textSecondary">{doctor.email}</Typography>
      <Typography mt={2}>Specialization: {doctor.specialization || "N/A"}</Typography>
      <Typography>Experience: {doctor.experience || "N/A"}</Typography>

      <Box mt={4}>
        <Button variant="contained" onClick={() => navigate(`/book-appointment?doctorId=${id}`)}>
          Book Appointment
        </Button>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={() => navigate("/doctors")}>
          Back to Directory
        </Button>
      </Box>
    </Container>
  );
}

export default DoctorProfile;
