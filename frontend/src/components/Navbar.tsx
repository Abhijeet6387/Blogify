import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LogInIcon from "@mui/icons-material/Login";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FeedIcon from "@mui/icons-material/Feed";
import AddCircleIcon from "@mui/icons-material/AddCircle";
const Navbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
    const parseUser = JSON.parse(user ?? "{}");
    setUserData(parseUser);
  }, []);

  console.log(userData);
  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logging out..");
    navigate("/");
  };
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Toolbar>
        <IconButton edge="start" color="primary" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
        <Button
          color="primary"
          onClick={() => navigate("/")}
          startIcon={<HomeIcon />}
          sx={{ textTransform: "unset" }}
        >
          Home
        </Button>
        {userData ? (
          <>
            <Button
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ textTransform: "unset" }}
              onClick={() => navigate("/create")}
            >
              Create Post
            </Button>
            <Button
              color="primary"
              onClick={() => navigate("/dashboard")}
              startIcon={<DashboardIcon />}
              sx={{ textTransform: "unset" }}
            >
              Dashboard
            </Button>
            <Button
              color="primary"
              startIcon={<LogoutIcon />}
              sx={{ textTransform: "unset" }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="primary"
              startIcon={<FeedIcon />}
              sx={{ textTransform: "unset" }}
              onClick={() => navigate("/explore")}
            >
              Explore
            </Button>
            <Button
              color="primary"
              startIcon={<LogInIcon />}
              sx={{ textTransform: "unset" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
