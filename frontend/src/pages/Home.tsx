import React, { useState } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import Services from './Services';
import StatsCounter from '../components/StatsCounter';
import AppointmentModal from '../components/AppointmentModal';
import heroImage from '../assets/hero-image.png';
import aboutImage from '../assets/Dental Clinic Aesthetic Design Decoration.jpg';
import { LocationOn, Phone, Email, Facebook, Twitter, Instagram } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleScheduleClick = () => {
    if (!user) {
      navigate('/signup', { state: { from: 'appointment' } });
    } else {
      setAppointmentModalOpen(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f6fafd' }}>
      {/* Hero Section */}
      <Box id="hero" sx={{ background: 'linear-gradient(120deg, #e3f0ff 60%, #b3d8fd 100%)', py: { xs: 10, md: 16 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h1" fontWeight={800} sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' }, letterSpacing: -2, color: 'primary.main' }}>
                  Transform Your Smile<br />Transform Your Life
                </Typography>
                <Typography variant="h5" sx={{ mb: 5, color: 'text.secondary', fontWeight: 400, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                  Experience world-class dental care with cutting-edge technology and compassionate experts dedicated to your perfect smile.
                </Typography>
                <Button
                  size="large"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(90deg, #42a5f5 0%, #1565c0 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 20,
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(21,101,192,0.18)',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: '0 12px 36px rgba(21,101,192,0.25)',
                      background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                    },
                  }}
                  onClick={handleScheduleClick}
                >
                  Schedule Your Visit
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <Box
                  sx={{
                    width: { xs: '80%', md: '100%' },
                    maxWidth: 420,
                    boxShadow: 6,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.08)',
                    p: 1,
                  }}
                >
                  <img
                    src={heroImage}
                    alt="Dental Hero"
                    style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block' }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box id="about" sx={{ py: { xs: 8, md: 12 }, background: '#fff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: 2,
                  overflow: 'hidden',
                  background: '#fff',
                  p: 1,
                }}
              >
                <img
                  src={aboutImage}
                  alt="About Us"
                  style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight={800} color="primary" sx={{ mb: 3, fontSize: { xs: '2rem', md: '2.8rem' } }}>
                About Us
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.7 }}>
                Welcome to our state-of-the-art dental clinic, where we combine cutting-edge technology with compassionate care to provide you with the best dental experience possible.
              </Typography>
              <Button variant="outlined" size="large" sx={{ mt: 2, fontWeight: 700, borderRadius: 2, px: 4 }}>
                Meet Our Team
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ pt: 0, pb: 0 }}>
        <Services />
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, background: '#f6fafd' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={10}>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: 4, py: 4, background: '#fff', borderRadius: 3, boxShadow: 1 }}>
                <StatsCounter />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box id="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 0 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Dental Clinic
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Providing exceptional dental care with cutting-edge technology and compassionate service.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="inherit" aria-label="Facebook">
                  <Facebook />
                </IconButton>
                <IconButton color="inherit" aria-label="Twitter">
                  <Twitter />
                </IconButton>
                <IconButton color="inherit" aria-label="Instagram">
                  <Instagram />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1 }} />
                <Typography variant="body2">
                  123 Dental Street, City
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 1 }} />
                <Typography variant="body2">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1 }} />
                <Typography variant="body2">
                  info@dentalclinic.com
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Working Hours
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Mon - Fri: 9:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Saturday: 9:00 AM - 2:00 PM
              </Typography>
              <Typography variant="body2">
                Sunday: Closed
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} Dental Clinic. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      <AppointmentModal
        open={isAppointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
      />
    </Box>
  );
}

export default Home; 
