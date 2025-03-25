import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error("Error loading doctors:", err));
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Doctor Directory</Typography>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </Box>

      <Grid container spacing={3}>
        {doctors.map((doc) => (
          <Grid item xs={12} md={6} key={doc._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{doc.name}</Typography>
                <Typography variant="body2" color="textSecondary">{doc.email}</Typography>
                <Typography>Specialization: {doc.specialization || "N/A"}</Typography>
                <Typography>Experience: {doc.experience || "N/A"}</Typography>
                  {/* Adding Buttons Below */}
                <Box mt={2} display="flex" gap={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(`/book-appointment?doctorId=${doc._id}`)}
                  >
                    Book Appointment
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/doctors/${doc._id}`)}
                  >
                    View Profile
                  </Button>
                </Box>
                {/*Buttons end here */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DoctorDirectory;
