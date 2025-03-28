import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";



function MyProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDOB] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  // State for health problem notes
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const addNote = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/profile/${user.id}/notes`, { note });
      setNotes([...notes, note]);
      setNote("");
    } catch (err) {
      alert("Error adding note");
    }
  };
  
  const fetchNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/profile/${user.id}/notes`);
      setNotes(res.data);
    } catch (err) {
      alert("Error loading notes");
    }
  };
  
  const deleteNote = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/profile/${user.id}/notes/${index}`);
      const updatedNotes = [...notes];
      updatedNotes.splice(index, 1);
      setNotes(updatedNotes);
    } catch (err) {
      alert("Error deleting note");
    }
  };
  
  useEffect(() => {
    fetchNotes();
  }, []);
  

  
  // Fetch user profile on first load
  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:5000/api/users/profile/${user.id}`)
        .then((res) => {
          const data = res.data;
          setName(data.name || "");
          setEmail(data.email || "");
          const formattedDOB = data.dob ? data.dob.split("T")[0] : "";
          setDOB(formattedDOB);
          // setDOB(data.dob || "");
          setSex(data.sex || "");
          setLocation(data.location || "");
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    }
  }, []); // ✅ EMPTY dependency array = runs only once on mount
  

  // Handle individual field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "dob":
        // alert(value);
        setDOB(value);
        break;
      case "sex":
        setSex(value);
        break;
      case "location":
        setLocation(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const updatedUserData = {
      name,
      email,
      dob,
      sex,
      location,
      password: password.trim() === "" ? null : password,
    };
  
    axios
      .put(`http://localhost:5000/api/users/profile/${user.id}`, updatedUserData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("Profile updated successfully!");
        setPassword(""); // Clear password field
  
        const updatedUser = response.data.user;
  
        // ✅ Refresh localStorage with updated user info
        localStorage.setItem("user", JSON.stringify({
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          dob: updatedUser.dob,
          sex: updatedUser.sex,
          location: updatedUser.location
        }));
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      });
  };
  


  // const handleSubmit = (e) => {
  //   e.preventDefault();
  
  //   const updatedUser = {
  //     name,
  //     email,
  //     dob,
  //     sex,
  //     location,
  //     password: password.trim() === "" ? null : password,
  //   };
  
  //   axios
  //     .put(`http://localhost:5000/api/users/profile/${user.id}`, updatedUser, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then((res) => {
  //       alert("Profile updated successfully!");
  //       setPassword(""); // Clear password field after saving
  //     })
  //     .catch((err) => {
  //       console.error("Error updating profile:", err);
  //       alert("Failed to update profile.");
  //     });
  // };

  
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="New Password"
          name="password"
          type="password"
          value={password}
          onChange={handleChange}
          margin="normal"
          helperText="Leave blank if you don't want to change your password"
        />

        <TextField
          fullWidth
          label="Date of Birth"
          name="dob"
          type="date"
          value={dob || ""}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          select
          fullWidth
          label="Sex"
          name="sex"
          value={sex}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="">Select</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={location}
          onChange={handleChange}
          margin="normal"
        />

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>
      </form>
      {/*  Health Problem Notes Section */}
      <Typography variant="h5" sx={{ mt: 4 }}>
      Health Problem Notes
    </Typography>
    <TextField
      label="Add Health Problem"
      fullWidth
      value={note}
      onChange={(e) => setNote(e.target.value)}
      margin="normal"
    />
    <Button variant="contained" color="primary" onClick={addNote}>
      Add Note
    </Button>

    <List>
      {notes.map((item, index) => (
        <ListItem key={index}>
          {item}
          <IconButton onClick={() => deleteNote(index)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
    </Container>
  );
}

export default MyProfile;













// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Container,
//   Typography,
//   TextField,
//   MenuItem,
//   Button,
//   Box,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// function MyProfile() {
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     dob: "",
//     sex: "",
//     location: "",
//     password: "", // for changing password
//   });

//   // Load user profile on mount
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     axios
//       .get(`http://localhost:5000/api/users/profile/${user.id}`)
//       .then((res) => {
//         const { name, email, dob, sex, location } = res.data;
//         setForm({
//           name: name || "",
//           email: email || "",
//           dob: dob ? dob.split("T")[0] : "",
//           sex: sex || "",
//           location: location || "",
//           password: "",
//         });
//       })
//       .catch(() => alert("Unable to load profile"));
//   }, [user, navigate]);

//   // Handle input field changes
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     try {
//       const { name, email, dob, sex, location, password } = form;
  
//       const response = await axios.put(
//         `http://localhost:5000/api/users/profile/${user.id}`,
//         { name, email, dob, sex, location, password }
//       );
  
//       const updatedUser = response.data.user;
  
//       // ✅ Refresh localStorage with updated user info
//       localStorage.setItem("user", JSON.stringify({
//         id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role,
//         dob: updatedUser.dob,
//         sex: updatedUser.sex,
//         location: updatedUser.location
//       }));
  
//       alert("Profile updated!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update profile");
//     }
//   };
  

//   return (
//     <Container maxWidth="sm" sx={{ mt: 5 }}>
//       <Typography variant="h4" gutterBottom>
//         My Profile
//       </Typography>
//       <form onSubmit={handleSave}>
//         <TextField
//           fullWidth
//           label="Full Name"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           margin="normal"
//           required
//         />

//         <TextField
//           fullWidth
//           label="Email"
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           margin="normal"
//           required
//         />

//         <TextField
//           fullWidth
//           label="New Password"
//           name="password"
//           type="password"
//           value={form.password}
//           onChange={handleChange}
//           margin="normal"
//           helperText="Leave blank if you don't want to change your password"
//         />

//         <TextField
//           fullWidth
//           label="Date of Birth"
//           name="dob"
//           type="date"
//           value={form.dob}
//           onChange={handleChange}
//           margin="normal"
//           InputLabelProps={{ shrink: true }}
//         />

//         <TextField
//           select
//           fullWidth
//           label="Sex"
//           name="sex"
//           value={form.sex}
//           onChange={handleChange}
//           margin="normal"
//         >
//           <MenuItem value="">Select</MenuItem>
//           <MenuItem value="Male">Male</MenuItem>
//           <MenuItem value="Female">Female</MenuItem>
//           <MenuItem value="Other">Other</MenuItem>
//         </TextField>

//         <TextField
//           fullWidth
//           label="Location"
//           name="location"
//           value={form.location}
//           onChange={handleChange}
//           margin="normal"
//         />

//         <Box mt={3}>
//           <Button type="submit" variant="contained" color="primary">
//             Save Changes
//           </Button>
//           <Button
//             variant="outlined"
//             sx={{ ml: 2 }}
//             onClick={() => navigate("/dashboard")}
//           >
//             Back to Dashboard
//           </Button>
//         </Box>
//       </form>
//     </Container>
//   );
// }

// export default MyProfile;
