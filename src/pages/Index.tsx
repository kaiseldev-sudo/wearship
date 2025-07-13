
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import OurStory from "@/components/OurStory";
import ProductionMethods from "@/components/ProductionMethods";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <OurStory />
      <ProductionMethods />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
