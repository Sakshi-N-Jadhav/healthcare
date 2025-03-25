import { Button, Container, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Container maxWidth="sm" style={{ marginTop: 80, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Welcome to the Healthcare App</Typography>
      <Typography variant="body1" gutterBottom>
        New here? Sign up. Already have an account? Log in!
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
        <Button variant="outlined" component={Link} to="/register">Register</Button>
      </Stack>
    </Container>
  );
}

export default Home;
