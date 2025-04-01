import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import BookAppointment from "./pages/BookAppointment";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorDirectory from "./pages/DoctorDirectory";
import DoctorProfile from "./pages/DoctorProfile";
import MyProfile from "./pages/MyProfile";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctors" element={<DoctorDirectory />} />
        {/* // Protected Route for Dashboard */}
        <Route element={<ProtectedRoute />}>
         {/* Now, if a user is not logged in, they will be redirected to /login when they try to access /dashboard. */}


        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />
        <Route path="/my-profile" element={<MyProfile />} /> {/* //patient updates his profile */}
        
       

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
