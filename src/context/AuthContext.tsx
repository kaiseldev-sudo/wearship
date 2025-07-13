
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiService, User, LoginRequest, RegisterRequest, ForgotPasswordRequest } from '@/lib/api';

// Session type for local storage
type Session = {
  user: User;
  access_token: string;
  expires_at: number;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Session storage in localStorage
const STORAGE_KEY = 'auth_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session on mount
    const savedSession = localStorage.getItem(STORAGE_KEY);
    if (savedSession) {
      try {
        const parsedSession: Session = JSON.parse(savedSession);
        // Check if session is still valid (not expired)
        if (parsedSession.expires_at > Date.now()) {
          setSession(parsedSession);
          setUser(parsedSession.user);
        } else {
          // Session expired, clear it
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const createSession = (user: User, token?: string): Session => {
    const session: Session = {
      user,
      access_token: token || 'api_session_' + Date.now(),
      expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const credentials: LoginRequest = { email, password };
      const response = await apiService.login(credentials);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }

      const { user: userData, token } = response.data;
      const newSession = createSession(userData, token);
      setSession(newSession);
      setUser(userData);

      toast({
        title: "Welcome back!",
        description: `Hello ${userData.first_name}, you have successfully signed in.`,
      });
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during sign in.";
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Split name into first_name and last_name
      const nameParts = name.trim().split(' ');
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(' ') || '';

      const userData: RegisterRequest = {
        email,
        password,
        first_name,
        last_name,
      };

      const response = await apiService.register(userData);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Registration failed');
      }

      toast({
        title: "Registration successful!",
        description: "Your account has been created. You can now sign in with your credentials.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred during registration.";
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const data: ForgotPasswordRequest = { email };
      const response = await apiService.forgotPassword(data);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send reset email');
      }

      toast({
        title: "Password reset email sent",
        description: response.data?.message || "Please check your email for the reset link.",
      });
    } catch (error: any) {
      const errorMessage = error.message || "An error occurred while sending the reset email.";
      toast({
        title: "Password reset failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
