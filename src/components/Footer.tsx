
import React from "react";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-serif font-medium mb-6">Wearship</h3>
            <p className="text-gray-300 mb-6">
              Spreading Biblical truth through fashion while supporting Christian nurture and missions financially.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-navy-800 rounded-full hover:bg-navy-700 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-navy-800 rounded-full hover:bg-navy-700 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-navy-800 rounded-full hover:bg-navy-700 transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Shop All</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Our Story</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gold-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Worship Street, Generation City, PH 1000
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gold-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300">+63 912 345 6789</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gold-400 mr-3 flex-shrink-0" />
                <span className="text-gray-300">hello@wearship.com</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-6">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white rounded p-2 w-12 h-8 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              </div>
              <div className="bg-white rounded p-2 w-12 h-8 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
              </div>
              <div className="bg-white rounded p-2 w-12 h-8 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
              </div>
              <div className="bg-white rounded p-2 w-12 h-8 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-4" />
              </div>
            </div>
            
            <h4 className="text-lg font-medium mt-8 mb-4">Shipping Partners</h4>
            <div className="flex flex-wrap gap-2">
              <div className="bg-white rounded p-2 w-16 h-8 flex items-center justify-center">
                <span className="text-navy-800 text-xs font-bold">DHL</span>
              </div>
              <div className="bg-white rounded p-2 w-16 h-8 flex items-center justify-center">
                <span className="text-navy-800 text-xs font-bold">FedEx</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-navy-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Wearship. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
