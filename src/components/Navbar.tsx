
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the input when opening
      setTimeout(() => {
        const searchInput = document.getElementById('navbar-search');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      // Clear search when closing
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to shop page with search query
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md py-2"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-navy-800">
            Wearship
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/') && "text-navy-900 font-semibold"
            )}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className={cn(
              "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/shop') && "text-navy-900 font-semibold"
            )}
          >
            Shop
          </Link>
          <Link 
            to="/pre-order" 
            className={cn(
              "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/pre-order') && "text-navy-900 font-semibold"
            )}
          >
            Pre-Order
          </Link>
          <Link 
            to="/our-story"
            className={cn(
              "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/our-story') && "text-navy-900 font-semibold"
            )}
          >
            Our Story
          </Link>
          <Link 
            to="/contact"
            className={cn(
              "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/contact') && "text-navy-900 font-semibold"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <Input
                  id="navbar-search"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onBlur={() => {
                    // Delay closing to allow form submission
                    setTimeout(() => {
                      if (!searchQuery.trim()) {
                        setIsSearchOpen(false);
                      }
                    }, 200);
                  }}
                  className="w-48 h-8 text-sm border-navy-300 focus:border-navy-500"
                />
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="ml-2 text-navy-700 hover:text-navy-900 transition-colors"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button 
                onClick={toggleSearch}
                className="text-navy-700 hover:text-navy-900 transition-colors"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Cart */}
          <button 
            onClick={handleCartClick}
            className="text-navy-700 hover:text-navy-900 transition-colors relative"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
          <div className="hidden md:block">
            <UserMenu />
          </div>
          <button className="md:hidden text-navy-700" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 transition-transform duration-300 md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Mobile Search */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-navy-300 focus:border-navy-500"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="bg-navy-700 hover:bg-navy-800"
              disabled={!searchQuery.trim()}
            >
              <Search size={16} />
            </Button>
          </form>
        </div>

        {/* Mobile Cart */}
        <div className="mb-6">
          <button
            onClick={() => {
              handleCartClick();
              toggleMenu();
            }}
            className="flex items-center justify-between w-full p-3 bg-cream-50 rounded-lg border border-cream-200 hover:bg-cream-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <ShoppingBag size={20} className="text-navy-700" />
              <span className="text-navy-800 font-medium">Cart</span>
            </div>
            {itemCount > 0 && (
              <span className="bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </div>

        <nav className="flex flex-col space-y-6">
          <Link to="/" className="text-navy-800 text-xl font-medium" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/shop" className="text-navy-800 text-xl font-medium" onClick={toggleMenu}>
            Shop
          </Link>
          <Link to="/pre-order" className="text-navy-800 text-xl font-medium" onClick={toggleMenu}>
            Pre-Order
          </Link>
          <Link to="/our-story" className="text-navy-800 text-xl font-medium" onClick={toggleMenu}>
            Our Story
          </Link>
          <Link to="/contact" className="text-navy-800 text-xl font-medium" onClick={toggleMenu}>
            Contact
          </Link>
        </nav>
        <div className="mt-auto mb-8 space-y-4">
          <Link to="/login" onClick={toggleMenu} className="block">
            <Button className="w-full bg-navy-700 hover:bg-navy-800 text-white py-2">
              Sign In
            </Button>
          </Link>
          <Link to="/register" onClick={toggleMenu} className="block">
            <Button variant="outline" className="w-full border-navy-700 text-navy-800 py-2">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
