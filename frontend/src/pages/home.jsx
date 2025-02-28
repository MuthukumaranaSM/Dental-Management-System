import React from "react";
import AboutUs from "../pages/aboutus"; // ✅ Import About Us section
import "./home.css"; // ✅ Ensure this CSS file exists

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

      {/* About Us Section - Now Part of Home Page */}
      <AboutUs />
    </div>
  );
}

export default Home;
