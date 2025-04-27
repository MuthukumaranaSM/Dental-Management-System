import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1565c0, #42a5f5)',
        color: 'white',
        py: 6,
        mt: 'auto',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("/pattern.svg")',
          opacity: 0.1,
          zIndex: 1
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  123 Dental Street, Beliaththa, Sri Lanka
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <Link href="tel:+94123456789" color="inherit" underline="hover">
                    +94 123 456 789
                  </Link>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <Link href="mailto:info@dentalcare.com" color="inherit" underline="hover">
                    info@dentalcare.com
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Opening Hours */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Opening Hours
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Monday - Friday: 8:00 AM - 8:00 PM
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Saturday: 9:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body2">
                Sunday: 10:00 AM - 4:00 PM
              </Typography>
            </Box>
          </Grid>

          {/* Social Links and Logo */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
            <Typography variant="h4" sx={{ mt: 2 }}>
              DentalCare+
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Your Trusted Dental Care Partner
            </Typography>
          </Grid>

          {/* Copyright */}
          <Grid item xs={12}>
            <Typography variant="body2" align="center" sx={{ mt: 2, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
              © {new Date().getFullYear()} DentalCare+. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
