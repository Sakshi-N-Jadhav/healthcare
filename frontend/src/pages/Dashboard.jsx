import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  TextField,
  Drawer,
  Toolbar,
  AppBar,
  CssBaseline,
  Avatar,
  Paper,
  Grid,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

// 🖼️ Image Assets
import doctorBanner from "../assets/doctor-talking-patient-man-woman-260nw-1794838012.webp";
import cartoonDoctor from "../assets/pngtree-cartoon-hospital-doctor-design-material-image_1166284.jpg";
import circleDoctor from "../assets/hospital_design_elements_doctor_healthcare_symbols_circle_layout_6835466.jpg";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [reschedulingId, setReschedulingId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(
    (appt) => new Date(appt.date).toDateString() === today
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/appointments/${storedUser.id}`)
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("Error fetching appointments", err));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`);
      alert("Appointment cancelled");
      window.location.reload();
    } catch (err) {
      alert("Cancellation failed");
    }
  };

  const handleReschedule = async () => {
    if (!newDate) return alert("Please select a new date and time.");
    try {
      await axios.put(`http://localhost:5000/api/appointments/${reschedulingId}`, {
        newDate,
      });
      alert("Appointment rescheduled");
      setReschedulingId(null);
      setNewDate("");
      window.location.reload();
    } catch (err) {
      alert("Reschedule failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f4f7fa",
        minHeight: "100vh",
        backgroundImage: `url(${cartoonDoctor})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom right",
        backgroundSize: "200px",
      }}
    >
      <CssBaseline />

      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Button color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
            ☰
          </Button>
          <Typography variant="h6" noWrap component="div">
            Welcome to Your Health Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Side Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            padding: 2,
            backgroundColor: '#e3f2fd'
          }
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>Menu</Typography>
        <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/my-profile")}>My Profile</Button>
        <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/edit-appointments")}>Edit Appointments</Button>
        <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/doctors")}>View Doctors</Button>
        <Button fullWidth sx={{ mb: 2 }} onClick={() => navigate("/book-appointment")}>Book Appointment</Button>
        <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/charts")}>Charts</Button>

        <LogoutButton />
      </Drawer>

      {/* Main Section */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="md">
          <Fade in timeout={600}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#ffffff" }}>
              <Box display="flex" justifyContent="center" mb={3}>
                <img src={doctorBanner} alt="doctor-banner" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 8 }} />
              </Box>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar sx={{ width: 64, height: 64, backgroundColor: '#1976d2' }}>{user?.name?.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="h5">Hello, {user?.name}</Typography>
                  <Typography color="textSecondary">{user?.email}</Typography>
                </Box>
              </Box>

              {/* ⬅️ Repositioned doctor image
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <img src={circleDoctor} alt="doctor-icons" style={{ width: 100, borderRadius: 10 }} />
              </Box> */}

              <Divider sx={{ my: 2 }} />

              {/* 📊 Appointment Cards */}
              <Grid container spacing={2} mb={4}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                    <Typography variant="h6" align="center">Total Appointments</Typography>
                    <Typography variant="h4" align="center">{appointments.length}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                    <Typography variant="h6" align="center">Today</Typography>
                    <Typography variant="h4" align="center">{todayAppointments.length}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* 📅 Today’s Appointments */}
              <Typography variant="h6" mb={1}>Today's Appointments</Typography>
              <List>
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appt) => (
                    <ListItem key={appt._id} divider sx={{ backgroundColor: "#f1f8e9", borderRadius: 2, mb: 2 }}>
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="bold">{new Date(appt.date).toLocaleTimeString()} - {appt.doctorId.name}</Typography>}
                        secondary={<Typography variant="body2">{appt.notes || "No notes provided"}</Typography>}
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography>No appointments today.</Typography>
                )}
              </List>

              {/* 📆 All Appointments */}
              <Divider sx={{ my: 3 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">All Upcoming Appointments</Typography>
                <Box>
                  <Button variant="contained" color="primary" onClick={() => navigate("/book-appointment")}>Book</Button>
                  <Button variant="outlined" color="secondary" onClick={() => navigate("/doctors")} sx={{ ml: 2 }}>Doctors</Button>
                </Box>
              </Box>

              <List>
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <ListItem key={appt._id} divider sx={{ backgroundColor: "#f9f9f9", borderRadius: 2, mb: 2 }}>
                      <ListItemText
                        primary={<Typography variant="subtitle1" fontWeight="bold">Appointment with {appt.doctorId.name} on {new Date(appt.date).toLocaleString()}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2">Status: {appt.status}</Typography>
                            <Typography variant="body2">Health Problem Notes: {appt.notes || "No notes provided"}</Typography>
                          </>
                        }
                      />
                      <Box display="flex" gap={1}>
                        <Button size="small" color="error" onClick={() => handleCancel(appt._id)}>Cancel</Button>
                        {reschedulingId === appt._id ? (
                          <>
                            <TextField
                              type="datetime-local"
                              size="small"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                            />
                            <Button size="small" variant="contained" color="success" onClick={handleReschedule}>Confirm</Button>
                          </>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setReschedulingId(appt._id);
                              setNewDate("");
                            }}
                          >Reschedule</Button>
                        )}
                      </Box>
                    </ListItem>
                  ))
                ) : (
                  <Typography>No upcoming appointments.</Typography>
                )}
              </List>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;











// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Box,
//   TextField,
//   Drawer,
//   Toolbar,
//   AppBar,
//   CssBaseline,
//   Avatar,
//   Paper,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "../components/LogoutButton";

// function Dashboard() {
//   const [appointments, setAppointments] = useState([]);
//   const [reschedulingId, setReschedulingId] = useState(null);
//   const [newDate, setNewDate] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get(`http://localhost:5000/api/users/appointments/${storedUser.id}`)
//       .then((res) => setAppointments(res.data))
//       .catch((err) => console.error("Error fetching appointments", err));
//   }, []);

//   const handleCancel = async (id) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/appointments/${id}`);
//       alert("Appointment cancelled");
//       window.location.reload();
//     } catch (err) {
//       alert("Cancellation failed");
//     }
//   };

//   const handleReschedule = async () => {
//     if (!newDate) return alert("Please select a new date and time.");
//     try {
//       await axios.put(`http://localhost:5000/api/appointments/${reschedulingId}`, {
//         newDate,
//       });
//       alert("Appointment rescheduled");
//       setReschedulingId(null);
//       setNewDate("");
//       window.location.reload();
//     } catch (err) {
//       alert("Reschedule failed");
//     }
//   };

//   return (
//     <Box sx={{ display: "flex", backgroundColor: "#f4f7fa", minHeight: "100vh" }}>
//       <CssBaseline />

//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#1976d2" }}>
//         <Toolbar>
//           <Button color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
//             ☰
//           </Button>
//           <Typography variant="h6" noWrap component="div">
//             Welcome to Your Health Dashboard
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Drawer
//         anchor="left"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         sx={{
//           '& .MuiDrawer-paper': {
//             width: 240,
//             boxSizing: 'border-box',
//             padding: 2,
//             backgroundColor: '#e3f2fd'
//           }
//         }}
//       >
//         <Typography variant="h6" sx={{ mb: 2 }}>Menu</Typography>
//         <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/my-profile")}>My Profile</Button>
//         <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/edit-appointments")}>Edit Appointments</Button>
//         <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/doctors")}>View Doctors</Button>
//         <Button fullWidth sx={{ mb: 2 }} onClick={() => navigate("/book-appointment")}>Book Appointment</Button>
//         <LogoutButton />
//       </Drawer>

//       <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
//         <Container maxWidth="md">
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: "#ffffff" }}>
//             <Box display="flex" alignItems="center" gap={2} mb={2}>
//               <Avatar sx={{ width: 64, height: 64, backgroundColor: '#1976d2' }}>{user?.name?.charAt(0)}</Avatar>
//               <Box>
//                 <Typography variant="h5">Hello, {user?.name}</Typography>
//                 <Typography color="textSecondary">{user?.email}</Typography>
//               </Box>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             <Typography variant="body1">Role: {user?.role}</Typography>
//             <Typography variant="body1">Location: {user?.location || "Not provided"}</Typography>
//             <Typography variant="body1">Sex: {user?.sex || "Not specified"}</Typography>
//             <Typography variant="body1">Date of Birth: {user?.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}</Typography>

//             <Divider sx={{ my: 3 }} />

//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//               <Typography variant="h6">Your Appointments</Typography>
//               <Box>
//                 <Button variant="contained" color="primary" onClick={() => navigate("/book-appointment")}>Book Appointment</Button>
//                 <Button variant="outlined" color="secondary" onClick={() => navigate("/doctors")} sx={{ ml: 2 }}>View Doctors</Button>
//               </Box>
//             </Box>

//             <List>
//               {appointments.length > 0 ? (
//                 appointments.map((appt) => (
//                   <ListItem key={appt._id} divider sx={{ backgroundColor: "#f9f9f9", borderRadius: 2, mb: 2 }}>
//                     <ListItemText
//                       primary={<Typography variant="subtitle1" fontWeight="bold">Appointment with {appt.doctorId.name} on {new Date(appt.date).toLocaleString()}</Typography>}
//                       secondary={
//                         <>
//                           <Typography variant="body2">Status: {appt.status}</Typography>
//                           <Typography variant="body2">Health Problem Notes: {appt.notes || "No notes provided"}</Typography>
//                         </>
//                       }
//                     />
//                     <Box display="flex" gap={1}>
//                       <Button size="small" color="error" onClick={() => handleCancel(appt._id)}>Cancel</Button>
//                       {reschedulingId === appt._id ? (
//                         <>
//                           <TextField
//                             type="datetime-local"
//                             size="small"
//                             value={newDate}
//                             onChange={(e) => setNewDate(e.target.value)}
//                           />
//                           <Button size="small" variant="contained" color="success" onClick={handleReschedule}>Confirm</Button>
//                         </>
//                       ) : (
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           onClick={() => {
//                             setReschedulingId(appt._id);
//                             setNewDate("");
//                           }}
//                         >Reschedule</Button>
//                       )}
//                     </Box>
//                   </ListItem>
//                 ))
//               ) : (
//                 <Typography>No upcoming appointments.</Typography>
//               )}
//             </List>
//           </Paper>
//         </Container>
//       </Box>
//     </Box>
//   );
// }

// export default Dashboard;







//--------
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Box,
//   TextField,
//   Drawer,
//   Toolbar,
//   AppBar,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "../components/LogoutButton";

// function Dashboard() {
//   const [appointments, setAppointments] = useState([]);
//   const [reschedulingId, setReschedulingId] = useState(null);
//   const [newDate, setNewDate] = useState("");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get(`http://localhost:5000/api/users/appointments/${storedUser.id}`)
//       .then((res) => setAppointments(res.data))
//       .catch((err) => console.error("Error fetching appointments", err));
//   }, []);

//   const handleCancel = async (id) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/appointments/${id}`);
//       alert("Appointment cancelled");
//       window.location.reload();
//     } catch (err) {
//       alert("Cancellation failed");
//     }
//   };

//   const handleReschedule = async () => {
//     if (!newDate) return alert("Please select a new date and time.");
//     try {
//       await axios.put(`http://localhost:5000/api/appointments/${reschedulingId}`, {
//         newDate,
//       });
//       alert("Appointment rescheduled");
//       setReschedulingId(null);
//       setNewDate("");
//       window.location.reload();
//     } catch (err) {
//       alert("Reschedule failed");
//     }
//   };

//   return (
//     <Box sx={{ display: "flex" }}>
//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <Button color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
//             ☰
//           </Button>
//           <Typography variant="h6" noWrap component="div">
//             Dashboard
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Drawer
//         anchor="left"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         sx={{
//           '& .MuiDrawer-paper': {
//             width: 240,
//             boxSizing: 'border-box',
//             padding: 2
//           }
//         }}
//       >
//         <Typography variant="h6" sx={{ mb: 2 }}>Menu</Typography>
//         <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/my-profile")}>My Profile</Button>
//         <Button fullWidth sx={{ mb: 1 }} onClick={() => navigate("/edit-appointments")}>Edit Appointments</Button>
//         <LogoutButton />
//       </Drawer>

//       <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
//         <Container maxWidth="md">
//           <Typography variant="h4" gutterBottom>
//             Welcome, {user?.name}
//           </Typography>
//           <Typography variant="subtitle1">Email: {user?.email}</Typography>
//           <Typography variant="subtitle1" gutterBottom>
//             Role: {user?.role}
//           </Typography>
//           <Typography variant="subtitle1">
//             Location: {user?.location || "Not provided"}
//           </Typography>
//           <Typography variant="subtitle1">
//             Sex: {user?.sex || "Not specified"}
//           </Typography>
//           <Typography variant="subtitle1">
//             Date of Birth: {user?.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
//           </Typography>

//           <Divider sx={{ my: 3 }} />

//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography variant="h5">Upcoming Appointments</Typography>
//             <Box>
//               <Button variant="contained" color="primary" onClick={() => navigate("/book-appointment")}>Book Appointment</Button>
//               <Button variant="outlined" color="secondary" onClick={() => navigate("/doctors")} sx={{ ml: 2 }}>View Doctors</Button>
//             </Box>
//           </Box>

//           <List>
//             {appointments.length > 0 ? (
//               appointments.map((appt) => (
//                 <ListItem key={appt._id} divider>
//                   <ListItemText
//                     primary={`Appointment with ${appt.doctorId.name} on ${new Date(appt.date).toLocaleString()}`}
//                     secondary={
//                       <>
//                         <Typography variant="body2">Status: {appt.status}</Typography>
//                         <Typography variant="body2">Health Problem Notes: {appt.notes || "No notes provided"}</Typography>
//                       </>
//                     }
//                   />
//                   <Button size="small" color="error" onClick={() => handleCancel(appt._id)} sx={{ mr: 1 }}>Cancel</Button>
//                   {reschedulingId === appt._id ? (
//                     <>
//                       <TextField
//                         type="datetime-local"
//                         size="small"
//                         value={newDate}
//                         onChange={(e) => setNewDate(e.target.value)}
//                         sx={{ mr: 1 }}
//                       />
//                       <Button size="small" variant="contained" color="success" onClick={handleReschedule}>Confirm</Button>
//                     </>
//                   ) : (
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       onClick={() => {
//                         setReschedulingId(appt._id);
//                         setNewDate("");
//                       }}
//                     >Reschedule</Button>
//                   )}
//                 </ListItem>
//               ))
//             ) : (
//               <Typography>No upcoming appointments.</Typography>
//             )}
//           </List>
//         </Container>
//       </Box>
//     </Box>
//   );
// }

// export default Dashboard;









// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Box,
//   TextField,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import LogoutButton from "../components/LogoutButton";

// function Dashboard() {
//   const [appointments, setAppointments] = useState([]);
//   const [reschedulingId, setReschedulingId] = useState(null);
//   const [newDate, setNewDate] = useState("");
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));
 

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (!storedUser) {
//       navigate("/login");
//       return;
//     }
  
//     axios
//       .get(`http://localhost:5000/api/users/appointments/${storedUser.id}`)
//       .then((res) => setAppointments(res.data))
//       .catch((err) => console.error("Error fetching appointments", err));
//   }, []); // ✅ only runs on initial mount
  

//   // useEffect(() => {
//   //   if (!user) {
//   //     navigate("/login");
//   //     return;
//   //   }

//   //   axios
//   //     .get(`http://localhost:5000/api/users/appointments/${user.id}`)
//   //     .then((res) => setAppointments(res.data))
//   //     .catch((err) => console.error("Error fetching appointments", err));
//   // }, [user, navigate]);

//   const handleCancel = async (id) => {
//     if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/appointments/${id}`);
//       alert("Appointment cancelled");
//       window.location.reload();
//     } catch (err) {
//       alert("Cancellation failed");
//     }
//   };

//   const handleReschedule = async () => {
//     if (!newDate) return alert("Please select a new date and time.");
//     try {
//       await axios.put(`http://localhost:5000/api/appointments/${reschedulingId}`, {
//         newDate,
//       });
//       alert("Appointment rescheduled");
//       setReschedulingId(null);
//       setNewDate("");
//       window.location.reload();
//     } catch (err) {
//       alert("Reschedule failed");
//     }
//   };

//   return (
    
//     <Container maxWidth="md" sx={{ mt: 5 }}>
//       <Typography variant="h4" gutterBottom>
//         Welcome, {user?.name}
//       </Typography>
//       <Typography variant="subtitle1">Email: {user?.email}</Typography>
//       <Typography variant="subtitle1" gutterBottom>
//         Role: {user?.role}
//       </Typography>
//       {/* adding profile info section */}
//       <Typography variant="subtitle1">
//         Location: {user?.location || "Not provided"} </Typography>
//       <Typography variant="subtitle1">
//       Sex: {user?.sex || "Not specified"} </Typography>
//       <Typography variant="subtitle1">
//       Date of Birth: {user?.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
//       </Typography>

//       <Box display="flex" justifyContent="space-between" alignItems="center">
//         <Typography variant="h4">Welcome to Dashboard</Typography>
//         <LogoutButton />
//       </Box>
//       <Button
//       variant="outlined"
//       size="small"
//       sx={{ mb: 3 }}
//       onClick={() => navigate("/my-profile")}>
//         My Profile
//       </Button>

//       <Divider sx={{ my: 3 }} />

//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//         <Typography variant="h5">Upcoming Appointments</Typography>
//         <Button variant="contained" color="primary" onClick={() => navigate("/book-appointment")}>
//           Book Appointment
//         </Button>
//         <Button
//   variant="outlined"
//   color="secondary"
//   onClick={() => navigate("/doctors")}
//   sx={{ ml: 2 }}
// >
//   View Doctors
// </Button>
// {/* <Button
//   variant="outlined"
//   color="success"
//   onClick={() => navigate("/my-profile")}
// >
//   My Profile
// </Button> */}


//       </Box>

//       <List>
//         {appointments.length > 0 ? (
//           appointments.map((appt) => (
//             <ListItem key={appt._id} divider>
//             <ListItemText
//   primary={`Appointment with ${appt.doctorId.name} on ${new Date(appt.date).toLocaleString()}`}
//   secondary={
//     <>
//       <Typography variant="body2">Status: {appt.status}</Typography>
//       <Typography variant="body2">Health Problem Notes: {appt.notes || "No notes provided"}</Typography>
//     </>
//   }
// />

        
//               <Button
//                 size="small"
//                 color="error"
//                 onClick={() => handleCancel(appt._id)}
//                 sx={{ mr: 1 }}
//               >
//                 Cancel
//               </Button>
//               {reschedulingId === appt._id ? (
//                 <>
//                   <TextField
//                     type="datetime-local"
//                     size="small"
//                     value={newDate}
//                     onChange={(e) => setNewDate(e.target.value)}
//                     sx={{ mr: 1 }}
//                   />
//                   <Button
//                     size="small"
//                     variant="contained"
//                     color="success"
//                     onClick={handleReschedule}
//                   >
//                     Confirm
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   onClick={() => {
//                     setReschedulingId(appt._id);
//                     setNewDate("");
//                   }}
//                 >
//                   Reschedule
//                 </Button>
//               )}
//             </ListItem>
//           ))
//         ) : (
//           <Typography>No upcoming appointments.</Typography>
//         )}
//       </List>
      
    
//     </Container>
    
//   );
// }


// export default Dashboard;
