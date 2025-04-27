import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import "./navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDashboard = location.pathname.startsWith('/dashboard');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AppBar position="fixed" className={`navbar ${isDashboard ? 'dashboard-nav' : ''}`}>
      <Toolbar>
        <Typography 
          variant="h4" 
          component="div" 
          className="logo"
          sx={{ flexGrow: 0, minWidth: 'fit-content' }}
        >
          DentalCare+
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", gap: "50px" }}>
          <Button color="inherit" onClick={() => scrollToSection('hero')} className="nav-button">
            Home
          </Button>
          <Button color="inherit" onClick={() => scrollToSection('about')} className="nav-button">
            About us
          </Button>
          <Button color="inherit" onClick={() => scrollToSection('services')} className="nav-button">
            Services
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/appointments" className="nav-button">
              Appointments
            </Button>
          )}
          <Button color="inherit" onClick={() => scrollToSection('contact')} className="nav-button">
            Contact
          </Button>
        </Box>

        {user ? (
          <>
            <Button
              color="inherit"
              onClick={handleMenuOpen}
              className="nav-button"
            >
              {user.firstName || user.email}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>
                Dashboard
              </MenuItem>
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            className="login-button"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;