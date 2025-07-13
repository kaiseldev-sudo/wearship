
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Truck, CreditCard, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import PreOrderForm from "@/components/PreOrderForm";

const PreOrder = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-navy-800">
              Pre-Order Collection
            </h1>
            <p className="text-lg text-navy-600 max-w-2xl mx-auto">
              Be the first to own our exclusive new designs before they're officially released. 
              Pre-order today and receive your items within 3-4 weeks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1628071711153-d0204a351a6e?q=80&w=1520&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1740&auto=format&fit=crop" 
                alt="Pre-order collection preview" 
                className="rounded-lg shadow-lg object-cover h-full"
              />
            </div>
            
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-navy-800 mb-3">Summer 2025 Collection</h2>
                <p className="text-navy-600">
                  Our upcoming collection features sustainable materials, timeless designs, and exceptional craftsmanship. 
                  By pre-ordering, you help us reduce waste and produce only what's needed.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-navy-800 mb-2">Pre-Order Benefits</h3>
                <ul className="space-y-2 text-navy-600">
                  <li className="flex items-center gap-2">
                    <span className="text-gold-500">✓</span> 
                    Special 15% discount on all pre-order items
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold-500">✓</span> 
                    Priority shipping once items are available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-gold-500">✓</span> 
                    Exclusive access to limited edition pieces
                  </li>
                </ul>
              </div>
              
              <Link to="/shop">
                <Button className="w-full bg-navy-800 hover:bg-navy-900 text-white py-6 text-lg">
                  Browse Pre-Order Items
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Custom T-Shirt Design Form */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-navy-800 text-center mb-8">Design Your Custom T-Shirt</h2>
            <PreOrderForm />
          </div>
          
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-navy-800 text-center">How Pre-Ordering Works</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-navy-100 p-3 rounded-full">
                      <ShoppingBag className="h-8 w-8 text-navy-800" />
                    </div>
                    <h3 className="font-bold text-lg text-navy-800">1. Select Your Items</h3>
                    <p className="text-navy-600">Browse our pre-order collection and add your favorite pieces to cart.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-navy-100 p-3 rounded-full">
                      <CreditCard className="h-8 w-8 text-navy-800" />
                    </div>
                    <h3 className="font-bold text-lg text-navy-800">2. Secure Payment</h3>
                    <p className="text-navy-600">Complete your purchase with our secure payment options. Full payment is required for pre-orders.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-navy-100 p-3 rounded-full">
                      <Mail className="h-8 w-8 text-navy-800" />
                    </div>
                    <h3 className="font-bold text-lg text-navy-800">3. Order Confirmation</h3>
                    <p className="text-navy-600">Receive updates about your pre-order status via email, including estimated shipping date.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-navy-100 p-3 rounded-full">
                      <Truck className="h-8 w-8 text-navy-800" />
                    </div>
                    <h3 className="font-bold text-lg text-navy-800">4. Delivery</h3>
                    <p className="text-navy-600">Your items will be shipped directly to your door within the estimated delivery timeframe.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="font-bold text-lg text-navy-800 mb-3">Important Notes:</h3>
              <ul className="space-y-2 text-navy-600 list-disc pl-5">
                <li>Pre-order items typically ship within 3-4 weeks from order date</li>
                <li>All payment methods accepted (credit card, PayPal, Apple Pay)</li>
                <li>Free shipping on pre-orders over $100</li>
                <li>Pre-orders cannot be combined with other promotional offers</li>
                <li>For any questions about your pre-order, please contact <a href="mailto:support@wearship.com" className="text-gold-600 hover:underline">support@wearship.com</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PreOrder;
