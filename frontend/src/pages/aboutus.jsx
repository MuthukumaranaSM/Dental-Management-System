import React from "react";
import { Box, Typography, Container, Grid, Card } from "@mui/material";
import { motion } from "framer-motion";
import "./aboutus.css";

const teamMembers = [
  { 
    id: 1, 
    name: "Dr. John Doe", 
    role: "Senior Dentist",
    specialty: "Orthodontics",
    experience: "15+ years",
    bio: "Specialized in advanced orthodontic treatments and Invisalign. Leader in modern dental techniques.",
    img: "/doctor1.jpg" 
  },
  { 
    id: 2, 
    name: "Dr. Emily Smith", 
    role: "Dental Surgeon",
    specialty: "Implantology",
    experience: "12+ years",
    bio: "Expert in dental implants and reconstructive surgery. Pioneer in minimally invasive techniques.",
    img: "/doctor2.jpg" 
  }
];

const AboutUs = () => {
  return (
    <Box className="about-section">
      <Container maxWidth="lg">
        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" mb={10}>
            <Typography className="section-title" component="h2">
              Who We Are
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: 800,
                color: "#37474f",
                lineHeight: 1.8,
                mt: 4,
                mx: "auto",
                fontSize: "1.2rem",
                letterSpacing: "0.2px"
              }}
            >
              At Beliaththa Dental Clinic, we are more than just a dental practice – we are your partners in achieving optimal oral health. Our state-of-the-art facility combines cutting-edge technology with compassionate care to provide exceptional dental services. With over two decades of trusted service, we've built our reputation on excellence, innovation, and unwavering commitment to patient comfort.
            </Typography>
          </Box>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Grid container spacing={4} mb={12}>
            {[
              { title: "Excellence", description: "We maintain the highest standards in dental care through continuous learning and adoption of advanced technologies." },
              { title: "Patient-First", description: "Your comfort and well-being are our top priorities. We ensure a stress-free experience with personalized care." },
              { title: "Innovation", description: "We stay at the forefront of dental innovation, offering the latest treatments and technologies." }
            ].map((value, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      p: 4,
                      background: "rgba(255,255,255,0.1)",
                      borderRadius: "20px",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(0,0,0,0.05)",
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        background: "rgba(255,255,255,0.15)"
                      }
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 2
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#37474f",
                        lineHeight: 1.7,
                        fontSize: "1rem",
                        letterSpacing: "0.2px"
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Team Section */}
        <Box>
          <Typography 
            className="section-title"
            component="h2"
          >
            Meet Our Experts
          </Typography>

          <Grid container spacing={6} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item key={member.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="expert-card">
                    <div className="expert-image-container">
                      <img 
                        src={member.img} 
                        alt={member.name}
                        className="expert-image"
                      />
                      <div className="expert-overlay">
                        <Typography variant="body1" sx={{ lineHeight: 1.8, letterSpacing: "0.2px" }}>
                          {member.bio}
                        </Typography>
                      </div>
                      <div className="experience-badge">
                        {member.experience}
                      </div>
                    </div>
                    <Box className="expert-content">
                      <Typography className="expert-name">
                        {member.name}
                      </Typography>
                      <Typography className="expert-role">
                        {member.role}
                      </Typography>
                      <Typography className="expert-specialty">
                        Specialized in {member.specialty}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUs;