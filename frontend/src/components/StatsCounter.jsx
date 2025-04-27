import React from "react";
import { Box, Typography, Grid, Card } from "@mui/material";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const stats = [
  { label: "HAPPY PATIENTS", value: 2000,  },
  { label: "DENTAL IMPLANTS", value: 1500,  },
  { label: "DENTAL SERVICES", value: 20,  },
  { label: "YEARS OF EXPERIENCE", value: 20,  },
];

const StatsCounter = () => {
  return (
    <Box sx={{ 
      width: "100%", 
      display: "flex", 
      justifyContent: "center", 
      py: 8,
      background: "linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%)",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('/pattern.svg')",
        opacity: 0.1,
        zIndex: 1
      }
    }}>
      <Card
        sx={{
          width: "90%",
          maxWidth: 1200,
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "30px",
          boxShadow: "0 20px 60px rgba(21, 101, 192, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          overflow: "hidden",
          position: "relative",
          zIndex: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #1565c0, #42a5f5, #0fb5f2)",
          }
        }}
      >
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.8)",
                      boxShadow: "0 10px 30px rgba(21, 101, 192, 0.05)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 20px 40px rgba(21, 101, 192, 0.1)",
                        background: "rgba(255, 255, 255, 0.95)",
                      }
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "2.5rem", md: "3rem" },
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                        textShadow: "0 2px 4px rgba(21, 101, 192, 0.1)",
                      }}
                    >
                      <CountUp end={stat.value} duration={2.5} />
                      {stat.value !== 20 && "+"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "2.5rem",
                        mb: 2,
                        color: "#1565c0"
                      }}
                    >
                      {stat.icon}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#37474f",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default StatsCounter;