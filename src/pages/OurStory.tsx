
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import OurStory from "@/components/OurStory";
import ProductionMethods from "@/components/ProductionMethods";

const OurStoryPage = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32">
        <div className="container mx-auto px-6 mb-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-serif font-semibold text-navy-800 mb-4">
              Our Faith Journey
            </h1>
            <p className="text-navy-600">
              Learn more about our mission to spread Biblical truth through beautiful, wearable designs.
            </p>
          </div>
        </div>
        <OurStory />
        <ProductionMethods />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default OurStoryPage;
