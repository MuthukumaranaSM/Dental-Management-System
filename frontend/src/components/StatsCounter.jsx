import React from "react";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import CountUp from "react-countup";

const stats = [
  { label: "HAPPY CLIENTS", value: 2000 },
  { label: "ALIGNERS COMPLETED", value: 2000 },
  { label: "DENTAL SERVICES", value: 20 },
  { label: "YEARS OF EXPERIENCE", value: 20 },
];

const StatsCounter = () => {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 5 }}>
      <Card
        sx={{
          width: "90%",
          backgroundColor: "#e3f2fd", // Light Blue
          borderRadius: "16px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        }}
      >
        <CardContent>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item key={index} xs={12} sm={6} md={3} textAlign="center">
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#1565c0", // Dark Blue
                  }}
                >
                  <CountUp end={stat.value} duration={3} />+
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#0d47a1", // Darker Blue
                  }}
                >
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StatsCounter;
