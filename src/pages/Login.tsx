
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";


interface LocationState {
  from?: string;
  message?: string;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state, or default to home page
  const from = (location.state as LocationState)?.from || "/";
  const message = (location.state as LocationState)?.message;

  // Show registration success message if present
  React.useEffect(() => {
    if (message) {
      toast({
        title: "Welcome to Wearship!",
        description: message,
      });
    }
  }, [message, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Redirect to the page the user was trying to access, or home page
      navigate(from);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(email);
    } catch (error: any) {
      // Error handling is already done in the AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-navy-800">
              Wearship
            </Link>
            <h1 className="text-2xl font-bold mt-6 mb-2 text-navy-800">Welcome back</h1>
            <p className="text-navy-600">Sign in to continue to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gold-600 hover:text-gold-700"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-navy-800 hover:bg-navy-900 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center mt-8">
            <p className="text-navy-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold-600 hover:text-gold-700 font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1711157655217-ce587f36f751?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1964&auto=format&fit=crop')"
      }}>
        <div className="h-full w-full bg-navy-900/40 p-12 flex items-end">
          <blockquote className="text-white max-w-md">
            <p className="text-xl font-serif italic mb-2">
              "For we walk by faith, not by sight."
            </p>
            <footer className="text-sm">— 2 Corinthians 5:7</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Login;
