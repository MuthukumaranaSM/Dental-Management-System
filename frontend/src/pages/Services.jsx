import React from "react";
import { Box, Typography } from "@mui/material"; // ✅ Ensure Typography is imported
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ServiceCard from "../components/ServiceCard"; // ✅ Ensure this is correctly imported
import "./Services.css"; // ✅ Ensure this CSS file exists

const services = [
  {
    title: "Veneers",
    description: "Transform chipped, stained, or uneven teeth with custom-made veneers...",
    image: "/veneers.png",
  },
  {
    title: "Dental Implants",
    description: "Replace missing teeth with secure, durable dental implants...",
    image: "/single-tooth-dental-implant.jpg",
  },
  {
    title: "Teeth Whitening",
    description: "Brighten your smile with our professional teeth whitening service...",
    image: "/whitening.webp",
  },
  {
    title: "Teeth Removing",
    description: "Brighten your smile with our professional teeth whitening service...",
    image: "/teeth_remover.jpg",
  },
];

const Services = () => {
  return (
    <Box className="services-container">
      {/* ✅ "Our Services" title moved to left with reduced font size */}
      <Typography variant="h4" className="services-title">
        Our Services
      </Typography>

      {/* ✅ Swiper Section */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {services.map((service, index) => (
          <SwiperSlide key={index}>
            <ServiceCard title={service.title} description={service.description} image={service.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Services;