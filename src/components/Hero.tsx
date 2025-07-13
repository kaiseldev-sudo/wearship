
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 to-navy-700/60" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-16 md:py-20 lg:py-24">
        <div className="max-w-2xl animate-fade-in">
          <span className="block text-gold-400 font-serif text-lg md:text-xl mb-2">
            Spread Biblical Truth Through Fashion
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
            Wear Your Worship.
            <br /> Share His Word.
          </h1>
          <p className="text-lg md:text-xl text-cream-100 mb-8 max-w-xl">
            Unique, Scripture-inspired apparel that speaks to the heart and spreads the Word. Quality
            shirts that make faith visible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/shop">
              <Button className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-medium px-8 py-6 text-lg">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-gray-900 hover:bg-white/10 px-8 py-6 text-lg">
              Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
