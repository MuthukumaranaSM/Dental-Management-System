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
      <Box id="hero" sx={{ 
        background: 'linear-gradient(120deg, #e3f0ff 60%, #b3d8fd 100%)', 
        py: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Typography variant="h1" fontWeight={800} sx={{ 
                  mb: 3, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                  letterSpacing: -2, 
                  color: 'primary.main',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Transform Your Smile<br />Transform Your Life
                </Typography>
                <Typography variant="h5" sx={{ 
                  mb: 5, 
                  color: 'text.secondary', 
                  fontWeight: 400, 
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  lineHeight: 1.6
                }}>
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
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 12px 36px rgba(21,101,192,0.25)',
                      background: 'linear-gradient(90deg, #1565c0 0%, #42a5f5 100%)',
                      transform: 'translateY(-2px)'
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
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.08)',
                    p: 1,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <img
                    src={heroImage}
                    alt="Dental Hero"
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: 16, 
                      display: 'block',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Us Section */}
      <Box id="about" sx={{ 
        py: { xs: 8, md: 12 }, 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)'
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h2" fontWeight={800} color="primary" sx={{ 
                  mb: 4, 
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  letterSpacing: -1,
                  lineHeight: 1.2
                }}>
                  About Us
                </Typography>
                <Typography variant="h5" sx={{ 
                  mb: 4, 
                  color: 'text.secondary', 
                  lineHeight: 1.7,
                  fontWeight: 400
                }}>
                  Welcome to our state-of-the-art dental clinic, where we combine cutting-edge technology with compassionate care to provide you with the best dental experience possible.
                </Typography>
                <Typography variant="body1" sx={{ 
                  mb: 6, 
                  color: 'text.secondary', 
                  lineHeight: 1.8,
                  fontSize: '1.1rem'
                }}>
                  Our team of experienced professionals is dedicated to ensuring your comfort and satisfaction. We use the latest dental technology and techniques to provide you with the highest quality care in a warm and welcoming environment.
                </Typography>
                {/* <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ 
                    fontWeight: 700, 
                    borderRadius: 2, 
                    px: 5,
                    py: 1.5,
                    borderWidth: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Meet Our Team
                </Button> */}
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '520px',
                    margin: '0 auto',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    background: '#fff',
                    p: 1.5,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <img
                    src={aboutImage}
                    alt="About Us"
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      borderRadius: 12, 
                      display: 'block',
                      objectFit: 'cover',
                      aspectRatio: '4/3'
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ pt: 0, pb: 0 }}>
        <Services />
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        py: { xs: 6, md: 10 }, 
        background: 'linear-gradient(135deg, #f6fafd 0%, #e3f0ff 100%)',
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={10}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-around', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: 4, 
                py: 6, 
                px: 4,
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 4,
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <StatsCounter />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box id="footer" sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 8, 
        mt: 0,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 700,
                fontSize: '1.4rem',
                letterSpacing: '0.5px'
              }}>
                Dental Clinic
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: 3,
                opacity: 0.9,
                lineHeight: 1.6
              }}>
                Providing exceptional dental care with cutting-edge technology and compassionate service.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  color="inherit" 
                  aria-label="Facebook"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  aria-label="Twitter"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  aria-label="Instagram"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Instagram />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 700,
                fontSize: '1.4rem',
                letterSpacing: '0.5px'
              }}>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <LocationOn sx={{ mr: 2, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  123 Dental Street, City
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                <Phone sx={{ mr: 2, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +047-225-4848
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 2, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  info@dentalclinic.com
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                mb: 3, 
                fontWeight: 700,
                fontSize: '1.4rem',
                letterSpacing: '0.5px'
              }}>
                Working Hours
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Mon - Fri: 9:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Saturday: 9:00 AM - 2:00 PM
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Sunday: Closed
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            mt: 6, 
            pt: 4, 
            textAlign: 'center' 
          }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
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
