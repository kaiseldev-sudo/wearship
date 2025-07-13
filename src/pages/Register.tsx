
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
      navigate("/login", { 
        state: { 
          message: "Registration successful! Please sign in with your new account." 
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1631867675167-90a456a90863?q=80&w=1974&auto=format&fit=crop')"
      }}>
        <div className="h-full w-full bg-navy-900/40 p-12 flex items-end">
          <blockquote className="text-white max-w-md">
            <p className="text-xl font-serif italic mb-2">
              "Let all that you do be done in love."
            </p>
            <footer className="text-sm">— 1 Corinthians 16:14</footer>
          </blockquote>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-navy-800">
              Wearship
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2 text-navy-800">Create an account</h1>
            <p className="text-navy-600">Join Wearship and start your faith journey with us</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@example.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                minLength={6}
              />
              <p className="text-xs text-navy-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-gray-300"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms" className="text-sm text-navy-600">
                I agree to the{" "}
                <a href="#" className="text-gold-600 hover:text-gold-700">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-gold-600 hover:text-gold-700">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-navy-800 hover:bg-navy-900 text-white"
              disabled={isLoading || !agreeToTerms}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="text-center mt-8">
            <p className="text-navy-600">
              Already have an account?{" "}
              <Link to="/login" className="text-gold-600 hover:text-gold-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
