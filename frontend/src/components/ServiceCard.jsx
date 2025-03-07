import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import "./ServiceCard.css";

const ServiceCard = ({ title, description, image }) => {
  return (
    <Box className="service-card">
      {/* Image Card */}
      <Card className="image-card">
        <img src={image} alt={title} className="service-image" />
      </Card>

      {/* Content Card Below */}
      <Card className="content-card">
        <CardContent>
          <Typography variant="h6" className="service-title">{title}</Typography>
          <Typography variant="body2" className="service-description">{description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ServiceCard;
