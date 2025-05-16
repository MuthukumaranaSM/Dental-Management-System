import React from 'react';
import { Container, Typography, Box, Card, useTheme, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { LocalHospital, SentimentSatisfied, MedicalServices, Healing } from '@mui/icons-material';
// @ts-ignore: Importing image files for use in service cards
import imgImplant from '../assets/single-tooth-dental-implant.jpg';
// @ts-ignore: Importing image files for use in service cards
import imgRemover from '../assets/teeth_remover.jpg';
// @ts-ignore: Importing image files for use in service cards
import imgVeneers from '../assets/veneers.png';
// @ts-ignore: Importing image files for use in service cards
import imgWhitening from '../assets/whitening.webp';

const services = [
  {
    title: 'Dental Implants',
    description: 'Permanent, natural-looking solutions for missing teeth.',
    icon: <Healing sx={{ fontSize: 48, color: 'primary.main' }} />,
    image: imgImplant,
  },
  {
    title: 'Teeth Removal',
    description: 'Safe and gentle removal of problematic teeth.',
    icon: <MedicalServices sx={{ fontSize: 48, color: 'primary.main' }} />,
    image: imgRemover,
  },
  {
    title: 'Veneers',
    description: 'Custom veneers for a flawless, natural smile.',
    icon: <SentimentSatisfied sx={{ fontSize: 48, color: 'primary.main' }} />,
    image: imgVeneers,
  },
  {
    title: 'Teeth Whitening',
    description: 'Professional whitening for a brighter, whiter smile.',
    icon: <LocalHospital sx={{ fontSize: 48, color: 'primary.main' }} />,
    image: imgWhitening,
  },
];

const Services = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, background: '#fafbfc' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" fontWeight={800} color="text.primary" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.8rem' }, letterSpacing: '-1px' }}>
            Our Services
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
            Premium dental care, delivered with simplicity and expertise.
          </Typography>
        </Box>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 4,
        }}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                elevation={0}
                sx={{
                  background: '#fff',
                  borderRadius: 4,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  p: 4,
                  minHeight: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(0,0,0,0.10)',
                    transform: 'translateY(-4px) scale(1.03)',
                  },
                }}
              >
                <Box sx={{ mb: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <img src={service.image} alt={service.title} style={{ width: '100%', maxWidth: 120, height: 90, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 12px rgba(21,101,192,0.08)' }} />
                </Box>
                <Box sx={{ mb: 2 }}>{service.icon}</Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: 'text.primary', letterSpacing: '-0.5px' }}>
                  {service.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center', fontWeight: 400 }}>
                  {service.description}
                </Typography>
                <Button variant="outlined" size="small" sx={{ borderRadius: 2, fontWeight: 600, textTransform: 'none' }}>
                  Learn More
                </Button>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Services; 
