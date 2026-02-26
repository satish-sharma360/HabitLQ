import React from "react";
import Navbar from "../layout/Navbar";
import Hero from "../landing/Hero";
import Features from "../landing/Features";
import CTA from "../landing/CTA";
import Footer from "../layout/Footer";

const Landing = () => {
  return (
    <div className="bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;