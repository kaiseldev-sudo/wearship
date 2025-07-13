import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface UseRequireAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/login', redirectIfFound = false } = options;
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // If redirectIfFound is true, redirect if the user was found
      // This is useful for pages that only non-authenticated users should see, like login page
      if (redirectIfFound && user) {
        navigate('/');
      } 
      // Otherwise, redirect if the user was not found (standard auth protection)
      else if (!redirectIfFound && !user) {
        navigate(redirectTo, { state: { from: location.pathname } });
      }
    }
  }, [user, loading, redirectTo, redirectIfFound, navigate, location]);

  return { user, loading };
}
