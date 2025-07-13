
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email) {
      toast({
        title: "Thank you for subscribing!",
        description: "You're now on our list to receive updates and special offers.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-gold-500/20 to-cream-200/40">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-gold-600 font-medium">Join Our Community</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800 mt-2 mb-4">
            Let's Stay Connected
          </h2>
          <p className="text-navy-600 mb-8">
            Subscribe to our newsletter for exclusive deals, new releases, and Biblical inspiration
            delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow bg-white border-navy-200 focus:border-navy-400 focus:ring-navy-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="bg-navy-700 hover:bg-navy-800 text-white whitespace-nowrap"
            >
              Subscribe Now
            </Button>
          </form>
          
          <p className="text-navy-500 text-sm mt-4">
            By subscribing, you agree to receive marketing communications from us.
            Don't worry, we respect your privacy and you can unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
