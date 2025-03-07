import React from "react";
import AboutUs from "../pages/aboutus"; // ✅ Import About Us section
import Services from "../pages/Services"; // ✅ Import Services section
import "./home.css"; 
import StatsCounter from "../components/StatsCounter";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Smile, Our Priority</h1>
          <p>Advanced dental care with a compassionate touch.</p>
          <button className="hero-button">Book an Appointment</button>
        </div>
      </section>

      {/* About Us Section */}
      <AboutUs />

      {/* Services Section */}
      <Services />

       {/* Stats Counter Section */}
       <section className="stats-section">
        <StatsCounter />
      </section>

    </div>
  );
}

export default Home;
