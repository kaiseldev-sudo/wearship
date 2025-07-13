
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const OurStory = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="People at Generation Christian Fellowship"
              className="rounded-lg shadow-lg object-cover h-full max-h-[600px] w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-gold-500 rounded-lg shadow-lg p-6 max-w-[250px]">
              <p className="text-navy-900 font-serif italic text-lg">"Let your light shine before others."</p>
              <p className="text-navy-700 font-serif text-sm mt-2">- Matthew 5:16</p>
            </div>
          </div>
          
          <div>
            <span className="text-gold-600 font-medium">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800 mt-2 mb-6">
              Spreading Faith Through Fashion
            </h2>
            <p className="text-navy-600 mb-6">
              At Wearship, we are a passionate team from Generation Christian Fellowship (GenCF) dedicated to spreading faith, 
              love, and motivation through unique, Scripture-inspired prints.
            </p>
            <p className="text-navy-600 mb-8">
              Our mission is simple: be a brand that spreads Biblical truth through the use of different personal items 
              while supporting Christian nurture and missions financially.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-gold-500" />
                </div>
                <p className="ml-3 text-navy-700">
                  <span className="font-medium">Quality Materials:</span> Every shirt is made with premium fabrics for comfort and durability.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-gold-500" />
                </div>
                <p className="ml-3 text-navy-700">
                  <span className="font-medium">Hand-Picked Verses:</span> Carefully selected Scriptures that speak to the heart.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-gold-500" />
                </div>
                <p className="ml-3 text-navy-700">
                  <span className="font-medium">Supporting Missions:</span> A portion of each sale supports Christian nurture and missions.
                </p>
              </div>
            </div>
            
            <Button className="bg-navy-700 hover:bg-navy-800 text-white px-8 py-6">
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
