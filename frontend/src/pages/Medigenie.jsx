
import React, { useState, useEffect } from "react";
import UploadSection from "./UploadSection";

const Medigenie = () => {
  // const { user, isAuthenticated, isLoading } = useAuth0();
  const [selectedReport, setSelectedReport] = useState(null);
//   const [ user,setUser]=useState("Sakshi");
  // const user ="Sakshi";

  // ✅ Ensure Auth0 query params are cleared from the URL
  // useEffect(() => {
  //   if (window.location.search.includes("code") || window.location.search.includes("state")) {
  //     window.history.replaceState({}, document.title, window.location.pathname);
  //   }
  // }, []);

  // ✅ Debugging: Log authentication state
  // console.log("User:", user);
  // console.log("isAuthenticated:", isAuthenticated);
  // console.log("isLoading:", isLoading);

  // ✅ Prevent blank screen while authentication is loading
  // if (isLoading) {
  //   return <div>Loading ...</div>;
  // }

  // ✅ Prevent blank screen if not authenticated
  // if (!isAuthenticated) {
  //   return <div>Please log in to continue...</div>;
  // }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <UploadSection selectedReport={selectedReport} setSelectedReport={setSelectedReport} />
      </div>
    </div>
  );
};

export default Medigenie;
