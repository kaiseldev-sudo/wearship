
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductionMethods = () => {
  return (
    <section className="section-padding bg-navy-900 text-white">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-400 font-medium">Our Craftsmanship</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mt-2 mb-4">
            Quality Production Methods
          </h2>
          <p className="text-gray-300">
            Our products are crafted with care using two high-quality printing methods, each chosen for its
            ability to bring vibrant designs to life and ensure lasting quality.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="sublimation" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-navy-800 rounded-lg mb-8">
              <TabsTrigger value="sublimation" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 py-3">
                Sublimation Printing
              </TabsTrigger>
              <TabsTrigger value="htv" className="data-[state=active]:bg-gold-500 data-[state=active]:text-navy-900 py-3">
                Heat Transfer Vinyl
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sublimation" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-serif font-medium text-gold-400 mb-4">
                    Sublimation Printing
                  </h3>
                  <p className="text-gray-300 mb-4">
                    A method of transferring designs onto shirts using heat and special ink. The ink soaks 
                    into the fabric, creating durable, vibrant designs.
                  </p>
                  <p className="text-gray-300 mb-6">
                    It is also good for working with larger quantities or when you need all-over prints on 
                    polyester-based materials.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Incredibly vibrant colors
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Permanent, won't fade or crack over time
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Lightweight feel with no raised surfaces
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Perfect for complex, detailed designs
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Sublimation Printing Process"
                    className="rounded-lg shadow-lg"
                  />
                  <div className="absolute -bottom-4 -left-4 bg-gold-500 rounded p-2 text-navy-900 font-medium">
                    Sublimation Process
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="htv" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-serif font-medium text-gold-400 mb-4">
                    Heat Transfer Vinyl (HTV)
                  </h3>
                  <p className="text-gray-300 mb-4">
                    A specialty polyurethane with a heat-activated adhesive that can be used on certain fabrics 
                    and materials to apply designs to promotional products, textiles, and apparel.
                  </p>
                  <p className="text-gray-300 mb-6">
                    Perfect for creating bold, clean designs with sharp edges and solid colors on a variety of fabric types.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Excellent durability and wash resistance
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Works on multiple fabric types
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Creates a slight texture you can feel
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-gold-500 mr-2"></span>
                      Perfect for text and solid graphic elements
                    </li>
                  </ul>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1620288627223-53302f4e8c74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Heat Transfer Vinyl Process"
                    className="rounded-lg shadow-lg"
                  />
                  <div className="absolute -bottom-4 -left-4 bg-gold-500 rounded p-2 text-navy-900 font-medium">
                    HTV Process
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ProductionMethods;
