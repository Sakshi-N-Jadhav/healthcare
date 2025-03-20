import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import BookAppointment from "./pages/BookAppointment";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* // Protected Route for Dashboard */}
        <Route element={<ProtectedRoute />}>
         {/* Now, if a user is not logged in, they will be redirected to /login when they try to access /dashboard. */}


        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
