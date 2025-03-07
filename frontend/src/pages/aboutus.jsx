import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import "./home.css";

const teamMembers = [
  { id: 1, name: "Dr. John Doe", img: "/doctor1.jpg" },
  { id: 2, name: "Dr. Emily Smith", img: "/doctor2.jpg" }
];

const AboutUs = () => {
  return (
    <Box className="about-section">
      <Container>
        {/* About Content */}
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h4" className="about-title">Who We Are?</Typography>
          <Typography variant="body1" className="about-text">
            At Beliaththa Dental Clinic, we’re a team of dedicated dental professionals 
            committed to providing exceptional care with a personal touch. Our goal is to 
            ensure every visit is comfortable, informative, and tailored to your unique needs.
          </Typography>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className="team-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Typography variant="h4" className="team-title">Meet Our Experts</Typography>
          <Grid container spacing={5} justifyContent="center">
            {teamMembers.map((member) => (
              <Grid item key={member.id}>
                <motion.div 
                  className="doctor-card"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={member.img} alt={member.name} className="doctor-avatar" />
                </motion.div>
                <Typography variant="body2" className="doctor-name">{member.name}</Typography>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutUs;
