
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword || confirmPassword === "");
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Since we don't have a real password reset system,
      // we'll just show a success message and redirect to login
      toast({
        title: "Password reset simulation",
        description: "In a real app, your password would be updated. Please sign in normally.",
      });
      
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while resetting your password.",
        variant: "destructive",
      });
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-navy-800">
            Wearship
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2 text-navy-800">Reset Your Password</h1>
          <p className="text-navy-600">Please enter your new password below</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              minLength={8}
            />
            <p className="text-xs text-navy-500 mt-1">
              Password must be at least 8 characters long
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className={!passwordsMatch ? "border-red-500" : ""}
            />
            {!passwordsMatch && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-navy-800 hover:bg-navy-900 text-white"
            disabled={isLoading || !passwordsMatch}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-navy-600">
            Remember your password?{" "}
            <Link to="/login" className="text-gold-600 hover:text-gold-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
