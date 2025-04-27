import React from "react";
import { Link } from "react-router-dom";
import AboutUs from "../pages/aboutus";
import Services from "../pages/Services";
import "./home.css";
import StatsCounter from "../components/StatsCounter";

function Home() {
  return (
    <div className="home-container">
      <section id="hero" className="hero">
        <div className="hero-content">
          <h1>Transform Your Smile<br />Transform Your Life</h1>
          <p>Experience world-class dental care with cutting-edge technology and compassionate experts dedicated to your perfect smile.</p>
          <button className="hero-button" onClick={() => window.location.href='/appointments'}>
            Schedule Your Visit
          </button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about">
        <AboutUs />
      </section>

      {/* Services Section */}
      <section id="services">
        <Services />
      </section>

      {/* Stats Counter Section */}
      <section className="stats-section">
        <StatsCounter />
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        {/* Contact section content will go here */}
      </section>
    </div>
  );
}

export default Home;