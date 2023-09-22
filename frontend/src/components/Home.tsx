import { useEffect, useState } from "react";
import { Typography, Button, Container, Paper, Box, Grid } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import "../styles/Home.css";

import Navbar from "./Navbar";
import Blogs from "./Blogs";

const Home = () => {
  const [userData, setUserData] = useState<any | null>(null);
  useEffect(() => {
    const User = localStorage.getItem("user");
    const parseUser = JSON.parse(User || "null");
    setUserData(parseUser);
  }, []);

  console.log(userData);
  return (
    <>
      <Navbar />
      <div className="home">
        <Container component="main" maxWidth="sm">
          <Paper elevation={0} sx={{ backgroundColor: "transparent" }}>
            <Typography variant="h4" sx={{ paddingTop: 3, paddingBottom: 1 }}>
              <span style={{ fontWeight: "bold" }}>
                Hi {userData?.firstname} {userData?.lastname},
              </span>{" "}
              Welcome to Blogify!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                paddingTop: 1,
                paddingBottom: 1,
                fontFamily: "cursive",
              }}
              paragraph
            >
              "Unleash your creativity, and embark on a journey of
              self-expression through words. Start writing your story today!"
            </Typography>
            <Box className="button-group">
              <Button
                className="button"
                variant="contained"
                startIcon={<AddCircleOutlineOutlinedIcon />}
                sx={{
                  marginRight: 2,
                  marginLeft: 2,
                  marginBottom: 4,
                  textTransform: "unset",
                }}
                href={userData ? "/create" : "/login"}
              >
                Create Post
              </Button>
              <Button
                className="button"
                variant="outlined"
                startIcon={<DashboardIcon />}
                sx={{
                  marginRight: 2,
                  marginLeft: 2,
                  marginBottom: 4,
                  textTransform: "unset",
                }}
                href={userData ? "/dashboard" : "/login"}
              >
                View Dashboard
              </Button>
            </Box>
          </Paper>
        </Container>
      </div>
      <Blogs />
    </>
  );
};

export default Home;
