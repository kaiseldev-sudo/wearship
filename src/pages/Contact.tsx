
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-serif font-semibold text-navy-800 mb-4">
              Get in Touch
            </h1>
            <p className="text-navy-600">
              We'd love to hear from you! Whether you have questions about our products, 
              custom orders, or just want to share your Wearship story.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-serif font-medium text-navy-800 mb-4">Contact Information</h2>
              <div className="space-y-4 text-navy-700">
                <p>
                  <strong className="font-medium">Email:</strong> hello@wearship.com
                </p>
                <p>
                  <strong className="font-medium">Phone:</strong> (555) 123-4567
                </p>
                <p>
                  <strong className="font-medium">Address:</strong><br />
                  123 Faith Street<br />
                  Worship City, WS 12345
                </p>
                <div className="pt-4">
                  <h3 className="font-medium text-navy-800 mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-navy-700 hover:text-gold-500 transition-colors">Instagram</a>
                    <a href="#" className="text-navy-700 hover:text-gold-500 transition-colors">Facebook</a>
                    <a href="#" className="text-navy-700 hover:text-gold-500 transition-colors">Twitter</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-cream-50 p-6 rounded-md shadow-sm">
              <h2 className="text-xl font-serif font-medium text-navy-800 mb-4">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Subject" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea 
                      id="message" 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                      rows={4}
                      placeholder="Your message"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="bg-navy-800 hover:bg-navy-900 text-white">
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
