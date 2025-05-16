import React from 'react';
import { Container, Typography, Grid, Box, Card, CardContent, CardMedia, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents, Favorite, Lightbulb } from '@mui/icons-material';
import './aboutus.css';

const teamMembers = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Main Doctor',
    image: '/images/doctor1.jpg',
    description: 'With over 15 years of experience in dental care.',
    expertise: ['General Dentistry', 'Cosmetic Procedures', 'Dental Implants']
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Senior Dentist',
    image: '/images/doctor2.jpg',
    description: 'Specialized in cosmetic dentistry and implants.',
    expertise: ['Orthodontics', 'Cosmetic Dentistry', 'Smile Design']
  }
];

const values = [
  {
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of dental care.',
    icon: <EmojiEvents sx={{ fontSize: 40 }} />
  },
  {
    title: 'Compassion',
    description: 'We treat every patient with care and understanding.',
    icon: <Favorite sx={{ fontSize: 40 }} />
  },
  {
    title: 'Innovation',
    description: 'We use the latest technology and techniques.',
    icon: <Lightbulb sx={{ fontSize: 40 }} />
  }
];

const AboutUs = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 800,
              color: theme.palette.primary.main,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            About Us
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 8,
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Welcome to our state-of-the-art dental clinic, where we combine cutting-edge technology 
            with compassionate care to provide you with the best dental experience possible.
          </Typography>
        </motion.div>

        <Typography
          variant="h3"
          component="h3"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
            color: theme.palette.primary.main
          }}
        >
          Our Team
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={member.image}
                    alt={member.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Typography
                      variant="h5"
                      component="h4"
                      sx={{ mb: 1, fontWeight: 700 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      {member.role}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ mb: 3, color: theme.palette.text.secondary }}
                    >
                      {member.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {member.expertise.map((skill, i) => (
                        <Box
                          key={i}
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.main,
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}
                        >
                          {skill}
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h3"
          component="h3"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
            color: theme.palette.primary.main
          }}
        >
          Our Values
        </Typography>
        
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    borderRadius: 4,
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 3,
                      color: theme.palette.primary.main
                    }}
                  >
                    {value.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h4"
                    sx={{ mb: 2, fontWeight: 700 }}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {value.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs; 
