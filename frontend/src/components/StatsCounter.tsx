import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const stats = [
  { label: "Happy Patients", value: 5000, suffix: "+" },
  { label: "Years Experience", value: 15, suffix: "+" },
  { label: "Expert Doctors", value: 10, suffix: "+" },
  { label: "Emergency Care", value: 24, suffix: "/7" },
];

const StatsCounter = () => {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 8, background: "#f6fafd" }}>
      <Box sx={{ width: "100%", maxWidth: 1200 }}>
        {/* Blue accent line at the top */}
        <Box sx={{ height: 6, width: '100%', background: 'linear-gradient(90deg, #1565c0, #42a5f5, #0fb5f2)', borderTopLeftRadius: 32, borderTopRightRadius: 32 }} />
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={3} justifyContent="center">
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
                      p: { xs: 3, md: 4 },
                      borderRadius: "24px",
                      minWidth: 180,
                      maxWidth: 260,
                      mx: "auto",
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "2.2rem", md: "2.5rem" },
                        fontWeight: 700,
                        background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                        display: 'inline-block',
                      }}
                    >
                      <CountUp end={stat.value} duration={2.5} />
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: "2.2rem", md: "2.5rem" },
                        fontWeight: 700,
                        color: '#2196f3',
                        ml: 0.5,
                        verticalAlign: 'middle',
                      }}
                    >
                      {stat.suffix}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#37474f",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        mt: 1,
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
      </Box>
    </Box>
  );
};

export default StatsCounter; 
