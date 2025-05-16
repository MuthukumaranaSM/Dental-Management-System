import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const navbarHeight = 64; // Height of the navbar
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => {
    handleClose();
    if (user) {
      switch (user.role) {
        case 'CUSTOMER':
          navigate('/dashboard');
          break;
        case 'DENTIST':
          navigate('/dentist-dashboard');
          break;
        case 'RECEPTIONIST':
          navigate('/receptionist-dashboard');
          break;
        case 'MAIN_DOCTOR':
          navigate('/main-doctor-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    }
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  const handleNavClick = (section: string) => {
    if (location.pathname === '/') {
      scrollToSection(section);
    } else {
      navigate('/', { replace: false });
      setTimeout(() => {
        scrollToSection(section);
      }, 100);
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: '#1565c0',
              fontWeight: 700,
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            }}
          >
            Beliaththa Dental
          </Typography>

          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            gap: 2 
          }}>
            <Button
              onClick={() => handleNavClick('hero')}
              sx={{ 
                color: '#37474f',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Home
            </Button>
            <Button
              onClick={() => handleNavClick('about')}
              sx={{ 
                color: '#37474f',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              About
            </Button>
            <Button
              onClick={() => handleNavClick('services')}
              sx={{ 
                color: '#37474f',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Services
            </Button>
            <Button
              onClick={() => handleNavClick('footer')}
              sx={{ 
                color: '#37474f',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Contact
            </Button>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
            {user ? (
              <>
                <Button
                  startIcon={<DashboardIcon />}
                  onClick={handleDashboard}
                  variant="outlined"
                  sx={{
                    color: '#1565c0',
                    borderColor: '#1565c0',
                    '&:hover': {
                      borderColor: '#0d47a1',
                      backgroundColor: 'rgba(21, 101, 192, 0.04)',
                    },
                  }}
                >
                  Dashboard
                </Button>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="primary"
                >
                  <Avatar sx={{ bgcolor: '#1565c0' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  backgroundColor: 'rgba(21, 101, 192, 0.1)',
                  color: '#1565c0',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(21, 101, 192, 0.2)',
                  borderRadius: '20px',
                  padding: '8px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(21, 101, 192, 0.15)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(21, 101, 192, 0.1)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 
