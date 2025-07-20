
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UserMenu from "@/components/UserMenu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const isHome = location.pathname === '/';

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
          <Link to="/" className={cn(
            "text-2xl md:text-3xl font-serif font-bold",
            (isHome && !scrolled) ? "text-white" : "text-navy-800"
          )}>
            Wearship
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              (isHome && !scrolled)
                ? "text-white hover:text-gold-300 font-medium transition-colors"
                : "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/') && ((isHome && !scrolled) ? "text-gold-300 font-semibold" : "text-navy-900 font-semibold")
            )}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className={cn(
              (isHome && !scrolled)
                ? "text-white hover:text-gold-300 font-medium transition-colors"
                : "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/shop') && ((isHome && !scrolled) ? "text-gold-300 font-semibold" : "text-navy-900 font-semibold")
            )}
          >
            Shop
          </Link>
          <Link 
            to="/pre-order" 
            className={cn(
              (isHome && !scrolled)
                ? "text-white hover:text-gold-300 font-medium transition-colors"
                : "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/pre-order') && ((isHome && !scrolled) ? "text-gold-300 font-semibold" : "text-navy-900 font-semibold")
            )}
          >
            Pre-Order
          </Link>
          <Link 
            to="/our-story"
            className={cn(
              (isHome && !scrolled)
                ? "text-white hover:text-gold-300 font-medium transition-colors"
                : "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/our-story') && ((isHome && !scrolled) ? "text-gold-300 font-semibold" : "text-navy-900 font-semibold")
            )}
          >
            Our Story
          </Link>
          <Link 
            to="/contact"
            className={cn(
              (isHome && !scrolled)
                ? "text-white hover:text-gold-300 font-medium transition-colors"
                : "text-navy-700 hover:text-navy-900 font-medium transition-colors",
              isActive('/contact') && ((isHome && !scrolled) ? "text-gold-300 font-semibold" : "text-navy-900 font-semibold")
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
                  className={cn(
                    "ml-2 transition-colors",
                    (isHome && !scrolled) ? "text-white hover:text-gold-300" : "text-navy-700 hover:text-navy-900"
                  )}
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button 
                onClick={toggleSearch}
                className={cn(
                  "transition-colors",
                  (isHome && !scrolled) ? "text-white hover:text-gold-300" : "text-navy-700 hover:text-navy-900"
                )}
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Cart */}
          <button 
            onClick={handleCartClick}
            className={cn(
              "transition-colors relative",
              (isHome && !scrolled) ? "text-white hover:text-gold-300" : "text-navy-700 hover:text-navy-900"
            )}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
          <div className="hidden md:block">
            <UserMenu scrolled={(isHome && !scrolled) ? false : true} />
          </div>
          <button
            className={cn(
              "md:hidden transition-colors",
              (isHome && !scrolled) ? "text-white hover:text-gold-300" : "text-navy-700 hover:text-navy-900"
            )}
            onClick={toggleMenu}
          >
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
        {/* Mobile Logo Centered */}
        <div className="absolute top-6 left-0 w-full flex justify-center items-center pointer-events-none select-none">
          <span className="text-2xl font-serif font-bold text-navy-800">Wearship</span>
        </div>
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
          
          {user ? (
            <div className="block">
              <UserMenu scrolled={true} />
              <Link to="/cart" className="text-navy-800 flex items-center gap-2 relative mb-4" onClick={toggleMenu}>
                <ShoppingBag size={18} className="text-navy-700 ms-[14px]" />
                <span className="ms-[8px]">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 left-6 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
