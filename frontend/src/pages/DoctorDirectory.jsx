import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
  Avatar,
  TextField,
  Pagination
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function DoctorDirectory() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error loading doctors:", err));
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Doctor Directory</Typography>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Box>

      <TextField
        label="Search by name or specialization"
        variant="outlined"
        fullWidth
        sx={{ mb: 4 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid container spacing={3}>
        {currentDoctors.map((doc) => (
          <Grid item xs={12} md={6} key={doc._id}>
            <Card sx={{ backgroundColor: "#f0f4ff", borderRadius: 3 }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  src={doc.profileImage}
                  alt={doc.name}
                  sx={{ width: 64, height: 64, margin: "0 auto", mb: 1 }}
                />
                <Typography variant="h6">{doc.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {doc.email}
                </Typography>
                <Typography>
                  Specialization: {doc.specialization || "N/A"}
                </Typography>
                <Typography>
                  Experience: {doc.experience || "N/A"}
                </Typography>

                <Box mt={2} display="flex" justifyContent="center" gap={2}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      navigate(`/book-appointment?doctorId=${doc._id}`)
                    }
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(filteredDoctors.length / doctorsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
}

export default DoctorDirectory;
