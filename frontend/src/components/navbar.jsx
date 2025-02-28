import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./Navbar.css"; // CSS for transparency effect

function Navbar() {
  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" className="logo">
          DentalCare+
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center",gap: "50px" }}>
          <Button color="inherit" component={Link} to="/" className="nav-button">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/About us" className="nav-button">
            About us
          </Button>
          <Button color="inherit" component={Link} to="/services" className="nav-button">
            Services
          </Button>
          <Button color="inherit" component={Link} to="/appointments" className="nav-button">
            Appointments
          </Button>
          <Button color="inherit" component={Link} to="/contact" className="nav-button">
            Contact
          </Button>
        </Box>

        {/* Login Button */}
        <Button
          component={Link}
          to="/login"
          variant="outlined"
          className="login-button"
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
